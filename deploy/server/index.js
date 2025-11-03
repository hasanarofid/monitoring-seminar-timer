const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
// Load .env file - coba dari folder parent jika di server
const envPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '..', '.env')  // Di server: .env di root folder
  : path.join(__dirname, '.env');        // Di local: .env di folder server

require('dotenv').config({ path: envPath });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Konfigurasi Database MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'monitoring_seminar'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Buat tabel jika belum ada
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS seminars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tanggal DATE NOT NULL,
      pengisi VARCHAR(255) NOT NULL,
      materi TEXT NOT NULL,
      durasi INT NOT NULL COMMENT 'durasi dalam menit',
      status ENUM('play', 'jeda', 'selesai') DEFAULT 'jeda',
      waktu_mulai TIMESTAMP NULL,
      waktu_berjalan INT DEFAULT 0 COMMENT 'waktu yang sudah berjalan dalam detik',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table seminars ready');
    }
  });
});

// API Routes
// Get semua seminar
app.get('/api/seminars', (req, res) => {
  const query = 'SELECT * FROM seminars ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get seminar aktif (yang statusnya play)
app.get('/api/seminars/active', (req, res) => {
  const query = "SELECT * FROM seminars WHERE status = 'play' LIMIT 1";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results.length > 0 ? results[0] : null);
  });
});

// Get seminar by ID
app.get('/api/seminars/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM seminars WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Seminar not found' });
    }
    res.json(results[0]);
  });
});

// Create seminar baru
app.post('/api/seminars', (req, res) => {
  const { tanggal, pengisi, materi, durasi } = req.body;
  
  if (!tanggal || !pengisi || !materi || !durasi) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = 'INSERT INTO seminars (tanggal, pengisi, materi, durasi, status) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [tanggal, pengisi, materi, durasi, 'jeda'], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, message: 'Seminar created successfully' });
  });
});

// Update seminar
app.put('/api/seminars/:id', (req, res) => {
  const { id } = req.params;
  const { tanggal, pengisi, materi, durasi, status } = req.body;
  
  // Jika hanya update status
  if (status !== undefined && tanggal === undefined && pengisi === undefined && materi === undefined && durasi === undefined) {
    // Jika status menjadi 'play', set waktu_mulai dan cek apakah ada seminar aktif lain
    if (status === 'play') {
      // Cek apakah ada seminar lain yang sedang play
      db.query("SELECT id FROM seminars WHERE status = 'play' AND id != ?", [id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: 'Tidak bisa start seminar lain. Ada seminar yang masih aktif!' });
        }
        
        const query = 'UPDATE seminars SET status = ?, waktu_mulai = CURRENT_TIMESTAMP, waktu_berjalan = 0 WHERE id = ?';
        db.query(query, [status, id], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          // Emit ke socket untuk update real-time
          io.emit('seminarUpdated', { id, status: 'play' });
          res.json({ message: 'Seminar updated successfully' });
        });
      });
      return;
    } else if (status === 'selesai' || status === 'jeda') {
      // Update waktu_berjalan saat jeda atau selesai
      db.query('SELECT waktu_mulai, waktu_berjalan, status FROM seminars WHERE id = ?', [id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        let waktuBerjalan = 0;
        if (results.length > 0) {
          const seminar = results[0];
          if (seminar.status === 'play' && seminar.waktu_mulai) {
            const waktuMulai = new Date(seminar.waktu_mulai);
            const sekarang = new Date();
            const selisihDetik = Math.floor((sekarang - waktuMulai) / 1000);
            waktuBerjalan = (seminar.waktu_berjalan || 0) + selisihDetik;
          } else {
            waktuBerjalan = seminar.waktu_berjalan || 0;
          }
        }
        
        const query = 'UPDATE seminars SET status = ?, waktu_berjalan = ? WHERE id = ?';
        db.query(query, [status, waktuBerjalan, id], (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          io.emit('seminarUpdated', { id, status });
          res.json({ message: 'Seminar updated successfully' });
        });
      });
      return;
    }
  }
  
  // Update field lainnya
  let query = 'UPDATE seminars SET';
  let params = [];
  let updates = [];
  
  if (tanggal !== undefined) {
    updates.push('tanggal = ?');
    params.push(tanggal);
  }
  if (pengisi !== undefined) {
    updates.push('pengisi = ?');
    params.push(pengisi);
  }
  if (materi !== undefined) {
    updates.push('materi = ?');
    params.push(materi);
  }
  if (durasi !== undefined) {
    updates.push('durasi = ?');
    params.push(durasi);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    params.push(status);
    
    if (status === 'play') {
      // Cek apakah ada seminar lain yang sedang play
      db.query("SELECT id FROM seminars WHERE status = 'play' AND id != ?", [id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: 'Tidak bisa start seminar lain. Ada seminar yang masih aktif!' });
        }
        
        updates.push('waktu_mulai = CURRENT_TIMESTAMP');
        updates.push('waktu_berjalan = 0');
        query += ' ' + updates.join(', ') + ' WHERE id = ?';
        params.push(id);
        
        db.query(query, params, (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          io.emit('seminarUpdated', { id, status: 'play' });
          res.json({ message: 'Seminar updated successfully' });
        });
      });
      return;
    }
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  query += ' ' + updates.join(', ') + ' WHERE id = ?';
  params.push(id);
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    io.emit('seminarUpdated', { id });
    res.json({ message: 'Seminar updated successfully' });
  });
});

// Delete seminar
app.delete('/api/seminars/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM seminars WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    io.emit('seminarDeleted', { id });
    res.json({ message: 'Seminar deleted successfully' });
  });
});

// Socket.io untuk real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files from React build (untuk production)
// HARUS setelah semua API routes
if (process.env.NODE_ENV === 'production') {
  // Path ke folder build React - di server biasanya di parent folder
  const buildPath = path.join(__dirname, '..', 'public');
  
  // Serve static files (CSS, JS, images, dll)
  app.use(express.static(buildPath));
  
  // Serve React app untuk semua route non-API
  // Ini untuk handle React Router
  app.get('*', (req, res) => {
    // Skip API routes (shouldn't reach here karena API sudah di-handle di atas)
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

