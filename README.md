# Aplikasi Monitoring Seminar

Aplikasi React JS dengan database MySQL untuk monitoring seminar dengan fitur real-time timer.

## Fitur

- **CRUD Seminar**: Kelola data seminar dengan inputan tanggal, pengisi, materi, durasi, dan status
- **Layar Monitoring**: Tampilan real-time dengan timer yang otomatis berjalan saat seminar di-start
- **Validasi**: Hanya satu seminar yang bisa aktif pada satu waktu
- **Responsive Design**: Tampilan responsive untuk berbagai ukuran TV dan perangkat

## Teknologi

- **Frontend**: React JS, React Router, Socket.IO Client
- **Backend**: Node.js, Express.js, MySQL
- **Real-time**: Socket.IO

## Instalasi

### 1. Install Dependencies

```bash
npm run install-all
```

Atau install secara terpisah:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

### 2. Setup Database MySQL

1. Buat database MySQL:
```sql
CREATE DATABASE monitoring_seminar;
```

2. Copy file `.env.example` ke `.env` di folder root:
```bash
cp server/.env.example server/.env
```

3. Edit file `.env` dan sesuaikan konfigurasi database:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=monitoring_seminar
PORT=5000
```

### 3. Jalankan Aplikasi

Jalankan backend dan frontend secara bersamaan:

```bash
npm run dev
```

Atau jalankan secara terpisah:

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

## Struktur Project

```
monitoringapp/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Komponen React
│   │   ├── pages/         # Halaman utama
│   │   ├── services/      # API service
│   │   └── App.js
│   └── package.json
├── server/                # Express Backend
│   ├── index.js
│   └── .env.example
├── package.json
└── README.md
```

## Halaman Aplikasi

### 1. Dashboard (Halaman CRUD)
- Tambah seminar baru
- Edit seminar
- Hapus seminar
- Ubah status seminar (Play, Jeda, Selesai)

### 2. Layar Monitoring
- Tampilan real-time seminar yang aktif
- Timer otomatis berjalan saat status "Play"
- Progress bar menampilkan persentase durasi
- Tampilan responsive untuk berbagai ukuran TV

## API Endpoints

- `GET /api/seminars` - Get semua seminar
- `GET /api/seminars/active` - Get seminar aktif
- `GET /api/seminars/:id` - Get seminar by ID
- `POST /api/seminars` - Create seminar baru
- `PUT /api/seminars/:id` - Update seminar
- `DELETE /api/seminars/:id` - Delete seminar

## Validasi

Aplikasi memastikan hanya satu seminar yang bisa aktif (status: play) pada satu waktu. Jika ada seminar yang masih aktif, tidak bisa memulai seminar lain sampai seminar sebelumnya di-jeda atau di-selesai-kan.

## Responsive Design

Aplikasi mendukung berbagai ukuran layar:
- Mobile (480px)
- Tablet (768px)
- TV Kecil (1024px - 1366px)
- TV Sedang (768px - 1024px)
- TV Besar (1920px+)
- TV Extra Besar (2560px+)

## Lisensi

ISC

