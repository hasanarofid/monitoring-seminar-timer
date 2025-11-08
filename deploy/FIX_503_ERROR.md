# 🔧 FIX ERROR 503 - Website Utama SolusiCodeKata.com

## ⚠️ MASALAH YANG TERJADI

Website utama **solusicodekata.com** menjadi **503 Service Unavailable** karena deployment Node.js yang gagal di cPanel. Error `cagefs_enter: Unable to fork` menunjukkan resource limit tercapai.

---

## 🚨 LANGKAH DARURAT - PULIHKAN WEBSITE UTAMA

### **STEP 1: HENTIKAN NODE.JS APP YANG GAGAL** ⛔

1. Login ke **cPanel**
2. Buka menu **"Node.js Selector"** atau **"Setup Node.js App"**
3. Cari aplikasi monitoring yang sudah dibuat sebelumnya
4. Klik **"Stop"** atau **"Delete"** aplikasi tersebut
   - **RECOMMENDED: DELETE** aplikasi untuk pembersihan total
   - Ini akan menghentikan proses yang memakan resource

**Catatan:** Jangan khawatir, kita akan setup ulang dengan benar setelah website utama pulih.

---

### **STEP 2: CEK DAN BERSIHKAN PROSES YANG TERJEBAK** 🧹

#### Via Terminal SSH (Jika Tersedia):

```bash
# Cek proses Node.js yang masih berjalan
ps aux | grep node

# Jika ada proses yang menggantung, kill dengan force:
pkill -9 node
pkill -9 npm
```

#### Via File Manager cPanel:

1. Buka **File Manager**
2. Cek folder **`public_html/`** - pastikan tidak ada file Node.js yang konflik
3. Cek folder **`monitoring/`** atau **`public_html/monitoring/`**:
   - Jika ada file `package.json`, `server/`, `node_modules/` yang besar → **HAPUS atau RENAME** untuk sementara

---

### **STEP 3: CEK FILE .htaccess DI PUBLIC_HTML** 📄

**PENTING:** File `.htaccess` di `public_html/` mungkin ter-overwrite atau rusak oleh deployment Node.js.

1. Buka **File Manager** cPanel
2. Navigasi ke **`public_html/`**
3. Cek apakah ada file `.htaccess`
4. Jika `.htaccess` ada tapi website tetap 503:
   - **BACKUP** file `.htaccess` (rename ke `.htaccess.backup`)
   - Buat file `.htaccess` baru dengan isi default untuk website utama:

```apache
# .htaccess untuk Website Utama (WordPress/PHP)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
```

**Atau** jika website utama adalah static HTML:

```apache
DirectoryIndex index.html index.php
```

5. **Restart Apache** (jika ada menu di cPanel) atau tunggu beberapa menit

---

### **STEP 4: CEK RESOURCE USAGE** 📊

1. Di cPanel, buka **"Resource Usage"** atau **"Current Usage"**
2. Cek apakah masih ada **Faults** atau **Resource Limit Exceeded**
3. Tunggu 5-10 menit agar resource limit reset
4. Refresh website utama: **https://solusicodekata.com**

---

### **STEP 5: CLEAR CACHE** 🗑️

1. Di cPanel, cari menu **"Cache"** atau **"Clear Cache"** jika ada
2. Clear browser cache Anda:
   - Tekan `Ctrl+Shift+Delete`
   - Clear "Cached images and files"
3. Test website utama di **Incognito/Private mode**

---

## ✅ VERIFIKASI WEBSITE UTAMA SUDAH PULIH

Setelah langkah di atas:

1. ✅ Buka: **https://solusicodekata.com**
2. ✅ Website harus bisa diakses normal (tidak lagi 503)
3. ✅ Cek console browser (F12) - tidak ada error kritis

---

## 🔄 SETUP ULANG MONITORING APP (SETELAH WEBSITE UTAMA PULIH)

**PENTING:** Setup ulang dengan benar agar tidak mempengaruhi website utama.

### **Prinsip Penting:**

1. **PISAHKAN SUBDOMAIN**: Monitoring app harus di **subdomain terpisah**: `monitoring.solusicodekata.com`
2. **JANGAN GUNAKAN PUBLIC_HTML UTAMA**: Buat folder terpisah untuk subdomain
3. **GUNAKAN PORT YANG BENAR**: Gunakan port yang diberikan cPanel, jangan hardcode

---

### **STEP 1: BUAT SUBDOMAIN TERPISAH**

1. Di cPanel, buka **"Subdomains"**
2. Buat subdomain: **`monitoring`**
   - Document Root: **`public_html/monitoring`** (BUKAN `public_html/`)
3. Pastikan subdomain aktif dan SSL sudah diaktifkan

---

### **STEP 2: UPLOAD FILE KE FOLDER SUBDOMAIN**

**Struktur yang benar di server:**

```
public_html/
├── index.php          ← Website utama (JANGAN DIOTAK-ATIK)
├── .htaccess         ← Website utama (JANGAN DIOTAK-ATIK)
└── (file website utama lainnya)

public_html/monitoring/    ← SUBDOMAIN TERPISAH
├── server/
│   └── index.js
├── public/
│   ├── index.html
│   └── static/
├── package.json
└── .env
```

**Upload dengan benar:**
1. Upload file monitoring ke **`public_html/monitoring/`** (folder subdomain)
2. **JANGAN upload ke `public_html/`** (folder website utama)

---

### **STEP 3: SETUP NODE.JS APP DENGAN BENAR**

1. Buka **Node.js Selector** di cPanel
2. Klik **"Create Application"**
3. **Konfigurasi yang BENAR:**
   - **Application root**: `/home/USERNAME/public_html/monitoring`
   - **Application URL**: `monitoring.solusicodekata.com` (subdomain)
   - **Application startup file**: `server/index.js`
   - **Application mode**: `Production`
   - **Node.js version**: Pilih versi terbaru (18.x atau 20.x)

4. **CATAT PORT** yang diberikan cPanel (misal: 5001, 5002, dll)
   - Jangan gunakan port 5000 jika tidak diberikan

---

### **STEP 4: BUAT FILE .env DI SUBDOMAIN**

Di folder **`public_html/monitoring/`**, buat file `.env`:

```env
DB_HOST=localhost
DB_USER=solz1468_solkit
DB_PASSWORD=DemiAllah@1
DB_NAME=solz1468_monitoring
PORT=5001
NODE_ENV=production
```

**Catatan:** Ganti `PORT=5001` dengan port yang diberikan cPanel.

---

### **STEP 5: INSTALL DEPENDENCIES (PRODUCTION ONLY)**

Via Terminal SSH (direkomendasikan):

```bash
cd ~/public_html/monitoring

# Hapus node_modules lama jika ada
rm -rf node_modules package-lock.json

# Install HANYA production dependencies
npm install --omit=dev --production

# Atau dengan flag legacy:
npm install --only=production
```

**PENTING:** Jangan install devDependencies di server untuk mengurangi penggunaan resource.

---

### **STEP 6: SET ENVIRONMENT VARIABLES DI NODE.JS APP**

1. Di Node.js Selector, pilih aplikasi monitoring
2. Klik **"Edit"** atau **"Setup Environment Variables"**
3. Tambahkan:
   - `DB_HOST` = `localhost`
   - `DB_USER` = `solz1468_solkit`
   - `DB_PASSWORD` = `DemiAllah@1`
   - `DB_NAME` = `solz1468_monitoring`
   - `NODE_ENV` = `production`
   - `PORT` = (port yang diberikan cPanel)

---

### **STEP 7: START APLIKASI**

1. Di Node.js Selector, klik **"Start"** atau **"Restart"**
2. Tunggu status menjadi **"Running"**
3. Cek log jika ada error

---

### **STEP 8: TEST MONITORING APP**

1. Buka: **https://monitoring.solusicodekata.com**
2. Test fitur-fitur aplikasi
3. Cek API endpoint: **https://monitoring.solusicodekata.com/api/seminars**

---

## 🛡️ PENCEGAHAN ERROR DI MASA DEPAN

### **DO's (Lakukan):**

✅ Gunakan **subdomain terpisah** untuk Node.js app  
✅ Install **production dependencies only** (`--omit=dev`)  
✅ Gunakan **port dari cPanel**, jangan hardcode  
✅ Monitor **resource usage** secara berkala  
✅ Buat **backup** sebelum deploy  
✅ Test di **staging subdomain** dulu sebelum production  

### **DON'Ts (Jangan Lakukan):**

❌ **JANGAN** deploy Node.js di folder `public_html/` utama  
❌ **JANGAN** install devDependencies di server  
❌ **JANGAN** gunakan resource intensif (build React) di server  
❌ **JANGAN** hardcode port (gunakan dari cPanel)  
❌ **JANGAN** ubah file website utama tanpa backup  

---

## 📞 JIKA MASALAH MASIH ADA

### **Error 503 Masih Muncul di Website Utama:**

1. **Contact Hosting Support** - Minta mereka:
   - Reset resource limits (LVE)
   - Restart Apache/nginx
   - Cek log error server

2. **Cek File Permission:**
   ```bash
   chmod 644 public_html/.htaccess
   chmod 755 public_html/
   ```

3. **Disable Node.js App Sementara:**
   - Stop semua Node.js apps
   - Test website utama
   - Setelah pulih, baru setup ulang dengan benar

### **Monitoring App Tidak Jalan:**

1. Cek log di Node.js Selector
2. Pastikan `.env` file benar
3. Pastikan dependencies terinstall: `npm install --omit=dev`
4. Pastikan port di `.env` sesuai dengan cPanel
5. Pastikan database credentials benar

---

## 📝 CHECKLIST FINAL

Setelah semua langkah:

- [ ] Website utama **solusicodekata.com** sudah pulih (tidak 503)
- [ ] Node.js app sudah dihentikan/dihapus dari konfigurasi lama
- [ ] Subdomain **monitoring.solusicodekata.com** sudah dibuat
- [ ] File monitoring sudah di-upload ke folder subdomain (BUKAN public_html/)
- [ ] Node.js App sudah dibuat dengan konfigurasi benar
- [ ] File `.env` sudah dibuat dengan port yang benar
- [ ] Dependencies sudah diinstall (production only)
- [ ] Aplikasi monitoring sudah bisa diakses
- [ ] Website utama tidak terpengaruh lagi

---

## 🎯 KESIMPULAN

**Root Cause:** Deployment Node.js yang gagal mengunci resource dan mungkin mengganggu konfigurasi website utama.

**Solusi:** 
1. Hentikan/delete Node.js app yang gagal
2. Pulihkan website utama
3. Setup ulang monitoring app di **subdomain terpisah** dengan benar

**Prevention:** Selalu gunakan subdomain terpisah dan install production dependencies only.

---

**TERAKHIR UPDATE:** Panduan ini dibuat untuk memulihkan website utama dan setup ulang monitoring app dengan benar.

