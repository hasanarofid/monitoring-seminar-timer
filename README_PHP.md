# 🚀 Deploy ke cPanel dengan PHP (Tanpa Node.js)

## ✅ Solusi Tanpa Node.js

Aplikasi ini sudah dikonversi untuk berjalan di **cPanel shared hosting tanpa perlu Node.js**.

### Perubahan:
- ✅ Backend: Express.js → **PHP API**
- ✅ Real-time: Socket.io → **Polling** (update setiap 2 detik)
- ✅ Frontend: React (tetap sama, static files)

---

## 📁 Struktur File Baru

```
monitoringapp/
├── api/                      ← PHP Backend (BARU)
│   ├── config.php           ← Edit dengan database credentials
│   ├── config.example.php   ← Contoh konfigurasi
│   ├── index.php            ← Main API router
│   └── .htaccess            ← Routing untuk API
├── client/                   ← React Frontend (sama seperti sebelumnya)
│   └── src/
│       └── pages/
│           └── Monitoring.js ← Sudah di-update (polling instead of Socket.io)
├── .htaccess                 ← Routing untuk root (BARU)
└── DEPLOY_CPANEL_PHP.md     ← Panduan deploy lengkap
```

---

## 🎯 Quick Start Deploy

### 1. Build React App

```bash
cd client
npm run build
```

### 2. Edit Database Config

Edit file `api/config.php` dengan kredensial database Anda:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'username_db');      // GANTI
define('DB_PASSWORD', 'password_db');  // GANTI
define('DB_NAME', 'nama_database');    // GANTI
```

### 3. Upload ke cPanel

Upload ke root subdomain Anda:
- ✅ Semua isi `client/build/` → root folder
- ✅ Folder `api/` → root folder
- ✅ File `.htaccess` → root folder

### 4. Test

- Test API: `https://domain-anda.com/api/seminars`
- Test App: `https://domain-anda.com`

---

## 📖 Dokumentasi Lengkap

Lihat file **`DEPLOY_CPANEL_PHP.md`** untuk panduan lengkap dengan troubleshooting.

---

## ⚠️ Catatan Penting

1. **Tidak perlu Node.js** - Aplikasi 100% PHP untuk backend
2. **Polling** - Real-time update menggunakan polling (setiap 2 detik)
3. **Database** - Tetap MySQL, tidak ada perubahan struktur
4. **Frontend** - Tetap React, hanya di-build menjadi static files

---

## 🔧 Troubleshooting

Jika ada masalah, cek:
1. File `api/config.php` sudah benar
2. Database sudah di-import
3. File `.htaccess` sudah di-upload
4. Permission file sudah benar (644 untuk file, 755 untuk folder)

Lihat **`DEPLOY_CPANEL_PHP.md`** untuk troubleshooting lengkap.

---

## ✅ Keuntungan Solusi PHP

- ✅ **Tidak perlu Node.js** - Berjalan di semua cPanel hosting
- ✅ **Lebih mudah deploy** - Hanya upload file, tidak perlu setup Node.js
- ✅ **Lebih stabil** - PHP sudah teruji di shared hosting
- ✅ **Lebih murah** - Tidak perlu VPS atau hosting khusus Node.js

---

## 📞 Support

Jika ada masalah:
1. Cek `DEPLOY_CPANEL_PHP.md` untuk troubleshooting
2. Cek error log di cPanel
3. Test API langsung di browser

