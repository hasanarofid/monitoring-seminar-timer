# 🚨 LANGKAH DARURAT - PULIHKAN WEBSITE UTAMA 503

## ⚡ LANGKAH CEPAT (5 MENIT)

### 1. HENTIKAN NODE.JS APP YANG GAGAL ⛔

1. Login ke **cPanel**
2. Buka **"Node.js Selector"** atau **"Setup Node.js App"**
3. Cari aplikasi **monitoring** yang sudah dibuat
4. Klik **"DELETE"** atau **"STOP"** (DELETE direkomendasikan)
5. **SIMPAN** untuk mengkonfirmasi

**HASIL:** Proses Node.js yang memakan resource akan berhenti.

---

### 2. RESTART APACHE/WEBSERVER 🔄

**Cara 1: Via cPanel (Jika Ada Menu):**
- Cari menu **"Restart"** atau **"Apache Restart"** di cPanel
- Klik **"Restart Apache"**

**Cara 2: Via Terminal SSH:**
```bash
# Jika ada akses SSH
service httpd restart
# atau
service apache2 restart
```

**Cara 3: Tunggu 2-5 Menit:**
- Jika tidak ada menu restart, tunggu beberapa menit
- Apache biasanya auto-restart setelah beberapa menit

---

### 3. CLEAR BROWSER CACHE 🗑️

1. Tekan **Ctrl+Shift+Delete** (Windows/Linux) atau **Cmd+Shift+Delete** (Mac)
2. Pilih **"Cached images and files"**
3. Klik **"Clear data"**
4. Atau buka website di **Incognito/Private mode** (Ctrl+Shift+N)

---

### 4. TEST WEBSITE UTAMA ✅

1. Buka: **https://solusicodekata.com**
2. Website seharusnya sudah pulih (tidak lagi 503)

---

## 🔍 JIKA MASIH 503 - LANJUTKAN KE LANGKAH INI:

### 5. CEK FILE .htaccess DI PUBLIC_HTML 📄

1. Buka **File Manager** cPanel
2. Navigasi ke **`public_html/`**
3. Cek file **`.htaccess`**:
   - Jika file **rusak/aneh**, **BACKUP** dulu (rename ke `.htaccess.backup`)
   - Buat file **`.htaccess`** baru dengan isi default untuk website utama

**Isi .htaccess untuk Website Utama (WordPress):**
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
```

**Atau untuk Static HTML:**
```apache
DirectoryIndex index.html index.php
```

---

### 6. CEK RESOURCE USAGE 📊

1. Di cPanel, buka **"Resource Usage"** atau **"Current Usage"**
2. Cek apakah masih ada **"Faults"** atau **"Resource Limit Exceeded"**
3. Jika ada, **tunggu 10-15 menit** agar resource limit reset
4. Refresh website: **https://solusicodekata.com**

---

### 7. HAPUS FILE MONITORING DARI PUBLIC_HTML (Jika Ada) 🗂️

1. Buka **File Manager** cPanel
2. Cek folder **`public_html/`**:
   - Jika ada folder **`server/`**, **`node_modules/`**, atau file **`package.json`** monitoring → **RENAME** atau **HAPUS** untuk sementara
   - File monitoring **HARUS** di folder **`public_html/monitoring/`** (subdomain terpisah), **BUKAN** di `public_html/` utama

---

### 8. CEK PROCESS YANG TERJEBAK 🔧

**Via Terminal SSH (Jika Tersedia):**
```bash
# Cek proses Node.js yang masih berjalan
ps aux | grep node

# Jika ada proses yang menggantung, kill:
pkill -9 node
pkill -9 npm
```

---

## ✅ VERIFIKASI SETELAH PERBAIKAN

1. ✅ Website utama **solusicodekata.com** bisa diakses (tidak 503)
2. ✅ Tidak ada error di console browser (F12)
3. ✅ Halaman utama website normal

---

## 🆘 JIKA MASIH 503 SETELAH SEMUA LANGKAH:

### CONTACT HOSTING SUPPORT

Kirimkan pesan ke support hosting dengan detail:

```
Subject: Error 503 Service Unavailable - SolusiCodeKata.com

Halo Support,

Website utama saya solusicodekata.com mengalami error 503 Service Unavailable setelah deployment Node.js app yang gagal.

Saya sudah:
1. Menghapus Node.js app yang gagal di cPanel
2. Restart Apache
3. Cek file .htaccess
4. Cek resource usage

Namun website masih 503.

Mohon bantuan:
1. Reset resource limits (LVE) jika perlu
2. Restart Apache/nginx server
3. Cek log error server
4. Verifikasi konfigurasi website utama

Terima kasih.
```

---

## 📋 CHECKLIST RINGKAS

- [ ] Stop/Delete Node.js app yang gagal di cPanel
- [ ] Restart Apache/Webserver
- [ ] Clear browser cache atau buka Incognito
- [ ] Test website utama: https://solusicodekata.com
- [ ] Jika masih 503: Cek .htaccess di public_html/
- [ ] Jika masih 503: Cek resource usage, tunggu 10-15 menit
- [ ] Jika masih 503: Hapus/rename file monitoring dari public_html/
- [ ] Jika masih 503: Kill proses Node.js yang terjebak
- [ ] Jika masih 503: Contact hosting support

---

**WAKTU ESTIMASI:** 5-15 menit untuk langkah cepat, 30-60 menit jika perlu troubleshoot lebih lanjut.

