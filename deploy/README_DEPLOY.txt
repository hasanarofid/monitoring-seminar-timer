==========================================
INSTRUKSI UPLOAD KE CPANEL
==========================================

STRUKTUR FOLDER INI SUDAH SIAP UNTUK DI-UPLOAD KE CPANEL

Setelah upload, ikuti langkah berikut:

1. SETUP NODE.JS DI CPANEL
   - Buka Node.js Selector di cPanel
   - Create Application baru
   - Application root: folder subdomain Anda
   - Application startup file: server/index.js
   - Application mode: Production
   - Catat PORT yang diberikan

2. BUAT FILE .env DI ROOT FOLDER SERVER
   - Copy file .env.example menjadi .env
   - Edit file .env dan isi:
     DB_HOST=localhost
     DB_USER=solz1468_solkit
     DB_PASSWORD=DemiAllah@1
     DB_NAME=solz1468_monitoring
     PORT=[PORT_DARI_CPANEL]  <-- Ganti dengan port dari cPanel
     NODE_ENV=production

3. INSTALL DEPENDENCIES
   - Via Terminal SSH atau Node.js Selector
   - Jalankan: npm install

4. RESTART APLIKASI
   - Via Node.js Selector, klik "Restart App"

5. TEST
   - Buka browser: https://monitoring.solusicodekata.com
   - Test fitur aplikasi

==========================================
STRUKTUR FOLDER DI SERVER:
==========================================

monitoring/
├── server/
│   └── index.js
├── public/
│   ├── index.html
│   ├── static/
│   └── ...
├── package.json
├── .env          <-- Buat file ini setelah upload
└── node_modules/ <-- Auto-generated setelah npm install

==========================================
CATATAN PENTING:
==========================================

- File .env HARUS di root folder (sama level dengan server/ dan public/)
- Ganti PORT di .env dengan port yang diberikan cPanel Node.js App
- Pastikan folder public/ berisi file build React
- Pastikan database sudah diimport ke server

Untuk panduan lengkap, lihat file DEPLOY_CPANEL.md di root project.

