# Panduan Deploy ke cPanel dengan PHP (Tanpa Node.js)

## 🎯 Solusi Tanpa Node.js

Aplikasi ini sudah dikonversi untuk berjalan di cPanel shared hosting **tanpa perlu Node.js**. Backend menggunakan **PHP** yang pasti tersedia di semua cPanel hosting.

### Perubahan yang Dilakukan:
- ✅ Backend Express.js → **PHP API**
- ✅ Socket.io → **Polling** (update setiap 2 detik)
- ✅ Frontend React tetap sama (static files)

---

## 📋 Prasyarat

1. ✅ Subdomain sudah dibuat (misal: `monitoring.solusicodekata.com`)
2. ✅ Database MySQL sudah dibuat dan di-import
3. ✅ cPanel hosting dengan PHP 7.4+ (biasanya sudah tersedia)
4. ✅ Akses File Manager di cPanel

---

## 🚀 Langkah Deploy

### Langkah 1: Build Aplikasi React

Di komputer lokal Anda:

```bash
# Masuk ke folder client
cd client

# Build aplikasi React untuk production
npm run build
```

File build akan tersimpan di folder `client/build/`

---

### Langkah 2: Upload File ke cPanel

#### A. Upload Build React (Frontend)

1. Login ke cPanel
2. Buka **File Manager**
3. Navigasi ke folder subdomain Anda (misal: `public_html/monitoring/`)
4. **Upload semua isi** folder `client/build/` ke **root folder subdomain**
   - Pastikan `index.html` ada di root
   - Pastikan folder `static/` ada di root

#### B. Upload PHP API (Backend)

1. Di File Manager yang sama, buat folder `api/` di root subdomain
2. Upload file berikut ke folder `api/`:
   - `api/config.php`
   - `api/index.php`
   - `api/.htaccess`

#### C. Upload .htaccess Root

1. Upload file `.htaccess` dari root project ke root subdomain

#### Struktur Folder Final di Server:

```
monitoring.solusicodekata.com/
├── index.html              ← dari client/build/index.html
├── static/                 ← dari client/build/static/
│   ├── css/
│   └── js/
├── api/                    ← folder baru
│   ├── config.php
│   ├── index.php
│   └── .htaccess
├── .htaccess               ← dari root project
└── brigthon.jpeg           ← jika ada
```

---

### Langkah 3: Konfigurasi Database

#### Opsi A: Edit File config.php Langsung

1. Di File Manager, buka file `api/config.php`
2. Edit bagian konfigurasi database:

```php
// Konfigurasi Database
define('DB_HOST', 'localhost');  // Biasanya localhost
define('DB_USER', 'username_db'); // Username database Anda
define('DB_PASSWORD', 'password_db'); // Password database Anda
define('DB_NAME', 'nama_database'); // Nama database Anda
```

**Contoh untuk hosting Anda:**
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'solz1468_solkit');
define('DB_PASSWORD', 'DemiAllah@1');
define('DB_NAME', 'solz1468_monitoring');
```

#### Opsi B: Menggunakan Environment Variables (Jika Support)

Jika hosting Anda support `.env` file (jarang di shared hosting), buat file `.env` di folder `api/`:

```env
DB_HOST=localhost
DB_USER=solz1468_solkit
DB_PASSWORD=DemiAllah@1
DB_NAME=solz1468_monitoring
```

---

### Langkah 4: Set Permission File

1. Di File Manager, pastikan permission file:
   - File PHP: **644**
   - Folder: **755**
   - `.htaccess`: **644**

2. Jika perlu, ubah permission:
   - Klik kanan file → **Change Permissions**
   - Set sesuai di atas

---

### Langkah 5: Test API

1. Buka browser dan akses:
   ```
   https://monitoring.solusicodekata.com/api/seminars
   ```

2. Seharusnya muncul JSON response (bisa kosong `[]` jika belum ada data)

3. Jika error, cek:
   - File `api/config.php` sudah benar
   - Database credentials sudah benar
   - Database sudah di-import

---

### Langkah 6: Test Aplikasi

1. Buka browser dan akses:
   ```
   https://monitoring.solusicodekata.com
   ```

2. Test fitur-fitur:
   - ✅ Dashboard bisa diakses
   - ✅ Bisa create seminar baru
   - ✅ Bisa edit/delete seminar
   - ✅ Monitoring page bisa menampilkan seminar aktif
   - ✅ Timer berjalan dengan baik
   - ✅ Update real-time via polling (setiap 2 detik)

---

## 🔧 Troubleshooting

### Error: Database connection failed

**Solusi:**
1. Periksa file `api/config.php` - pastikan credentials benar
2. Pastikan database sudah dibuat dan di-import
3. Pastikan username dan password database benar
4. Cek apakah database host benar (biasanya `localhost`)

### Error 404 saat akses API

**Solusi:**
1. Pastikan file `.htaccess` ada di root dan folder `api/`
2. Pastikan mod_rewrite enabled di server (biasanya sudah enabled)
3. Cek permission file `.htaccess` (harus 644)

### Error 500 Internal Server Error

**Solusi:**
1. Cek error log di cPanel → **Error Log**
2. Pastikan PHP version 7.4+ (cek di cPanel → **Select PHP Version**)
3. Pastikan semua file PHP sudah di-upload dengan benar
4. Pastikan permission file sudah benar

### Halaman Blank / Tidak Load

**Solusi:**
1. Clear browser cache (Ctrl+F5)
2. Pastikan file `index.html` ada di root folder
3. Pastikan folder `static/` ada dan berisi file CSS/JS
4. Cek browser console (F12) untuk error JavaScript

### API tidak bisa diakses dari frontend

**Solusi:**
1. Pastikan API URL di frontend menggunakan relative path `/api`
2. Cek CORS settings di `api/config.php` (sudah di-set ke `*`)
3. Test API langsung di browser: `https://monitoring.solusicodekata.com/api/seminars`

### Polling tidak update real-time

**Solusi:**
1. Polling berjalan setiap 2 detik (normal)
2. Jika terlalu lambat, bisa edit di `client/src/pages/Monitoring.js`:
   ```javascript
   const pollingInterval = setInterval(() => {
     fetchActiveSeminar();
   }, 2000); // Ubah angka ini (dalam milidetik)
   ```
3. Rebuild React setelah edit: `npm run build`

---

## 📝 Catatan Penting

### 1. **Tidak Perlu Node.js**
   - Aplikasi ini **100% PHP** untuk backend
   - Frontend adalah static files (HTML/CSS/JS)
   - Tidak perlu setup Node.js di cPanel

### 2. **Polling vs Socket.io**
   - Socket.io diganti dengan **polling** (fetch setiap 2 detik)
   - Ini normal dan cukup untuk aplikasi monitoring
   - Jika ingin lebih cepat, bisa kurangi interval polling

### 3. **File Structure**
   - Pastikan struktur folder sesuai panduan
   - File `.htaccess` penting untuk routing

### 4. **Database**
   - Database tetap MySQL (sama seperti sebelumnya)
   - Tidak ada perubahan struktur database

### 5. **SSL/HTTPS**
   - Pastikan subdomain sudah memiliki SSL certificate
   - Biasanya otomatis via Let's Encrypt di cPanel

---

## ✅ Checklist Deploy

- [ ] Build React app (`npm run build` di folder `client/`)
- [ ] Upload semua isi `client/build/` ke root subdomain
- [ ] Upload folder `api/` ke root subdomain
- [ ] Upload `.htaccess` ke root subdomain
- [ ] Edit `api/config.php` dengan database credentials
- [ ] Set permission file (644 untuk file, 755 untuk folder)
- [ ] Test API: `https://monitoring.solusicodekata.com/api/seminars`
- [ ] Test aplikasi: `https://monitoring.solusicodekata.com`
- [ ] Test semua fitur (create, edit, delete, monitoring)

---

## 🎉 Selesai!

Aplikasi Anda sekarang berjalan di cPanel **tanpa perlu Node.js**!

Jika ada masalah, cek bagian **Troubleshooting** di atas atau cek error log di cPanel.

---

## 📞 Support

Jika masih ada masalah:
1. Cek error log di cPanel
2. Cek browser console (F12)
3. Test API langsung di browser
4. Pastikan semua file sudah di-upload dengan benar

