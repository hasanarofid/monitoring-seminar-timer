# ⚡ Quick Start - Deploy dengan PHP

## 🎯 Langkah Cepat Deploy ke cPanel (Tanpa Node.js)

### 1️⃣ Build React App

```bash
cd client
npm run build
```

### 2️⃣ Edit Database Config

Edit file `api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'solz1468_solkit');      // GANTI
define('DB_PASSWORD', 'DemiAllah@1');      // GANTI
define('DB_NAME', 'solz1468_monitoring');   // GANTI
```

### 3️⃣ Upload ke cPanel

Upload ke **root folder subdomain** Anda:

- ✅ **Semua isi** `client/build/` → root folder
- ✅ **Folder** `api/` → root folder
- ✅ **File** `.htaccess` → root folder

**Struktur di server:**
```
monitoring.solusicodekata.com/
├── index.html          ← dari client/build/
├── static/             ← dari client/build/static/
├── api/                ← folder api/
│   ├── config.php
│   ├── index.php
│   └── .htaccess
└── .htaccess           ← dari root project
```

### 4️⃣ Test

1. Test API: `https://monitoring.solusicodekata.com/api/seminars`
2. Test App: `https://monitoring.solusicodekata.com`

---

## ✅ Selesai!

Aplikasi Anda sekarang berjalan di cPanel **tanpa perlu Node.js**!

---

## 📖 Dokumentasi Lengkap

Lihat **`DEPLOY_CPANEL_PHP.md`** untuk:
- Panduan lengkap
- Troubleshooting
- Konfigurasi detail

---

## ⚠️ Catatan

- **Tidak perlu Node.js** - Backend 100% PHP
- **Polling** - Real-time update setiap 2 detik (menggantikan Socket.io)
- **Database** - Tetap MySQL, tidak ada perubahan

