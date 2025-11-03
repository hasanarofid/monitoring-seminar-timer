# Panduan Deploy ke cPanel - monitoring.solusicodekata.com

## Ringkasan Checklist

- [ ] 1. Build React app (`npm run build` di folder `client/`)
- [ ] 2. Upload file ke cPanel (server/, public/, package.json)
- [ ] 3. Setup Node.js App di cPanel Node.js Selector
- [ ] 4. Buat file `.env` di root folder dengan konfigurasi database
- [ ] 5. Install dependencies (`npm install` di server)
- [ ] 6. Buat `.env` di `client/` dengan `REACT_APP_API_URL` production
- [ ] 7. Rebuild React dengan API URL production
- [ ] 8. Upload ulang folder `client/build/` ke `public/` di server
- [ ] 9. Restart aplikasi di Node.js Selector
- [ ] 10. Test aplikasi di browser

---

## Prasyarat

1. ✅ Subdomain sudah dibuat: `monitoring.solusicodekata.com`
2. ✅ Database sudah di-export dan diimport ke server
3. ✅ Database credentials:
   - Host: `localhost`
   - User: `solz1468_solkit`
   - Database: `solz1468_monitoring`
   - Password: `DemiAllah@1`

---

## Langkah 1: Build Aplikasi React (Production)

### Di Komputer Lokal:

```bash
# Masuk ke folder client
cd client

# Build aplikasi React untuk production
npm run build
```

File build akan tersimpan di folder `client/build/`

---

## Langkah 2: Upload File ke cPanel

### Metode A: File Manager cPanel

1. Login ke cPanel Anda
2. Buka **File Manager**
3. Navigasi ke folder subdomain `monitoring.solusicodekata.com`
   - Biasanya ada di: `public_html/monitoring/` atau `monitoring/`
   - Pastikan Anda di folder root subdomain tersebut

4. **Upload file berikut:**

   **A. Upload File Server (Backend)**
   - Upload seluruh isi folder `server/` ke root subdomain
   - Termasuk: `server/index.js` dan semua file yang diperlukan
   
   **B. Upload Build React (Frontend)**
   - Upload semua isi folder `client/build/` ke subfolder `public/` atau root
   - Atau upload ke root jika ingin struktur lebih sederhana

   **C. Upload File Pendukung**
   - Upload `package.json` dari root ke subdomain root
   - Upload file `brigthon.jpeg` jika diperlukan

### Struktur Folder di Server (Saran):

```
monitoring.solusicodekata.com/
├── server/
│   └── index.js
├── public/          # Build React
│   ├── index.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── ...
├── package.json
└── .env              # Akan dibuat di langkah berikutnya
```

---

## Langkah 3: Setup Node.js di cPanel

1. Di cPanel, cari menu **"Node.js Selector"** atau **"Setup Node.js App"**
2. Klik **"Create Application"** atau **"Setup Node App"**
3. Isi konfigurasi:
   - **Node.js version**: Pilih versi terbaru yang tersedia (misal: 18.x atau 20.x)
   - **Application root**: Path ke folder subdomain Anda
     - Contoh: `/home/username/monitoring` atau `/home/username/public_html/monitoring`
   - **Application URL**: Pilih subdomain `monitoring.solusicodekata.com`
   - **Application startup file**: `server/index.js`
   - **Application mode**: Production

4. Setelah dibuat, catat:
   - **Port** yang diberikan (misal: 5000, 5001, atau port khusus cPanel)
   - **NODE_ENV** biasanya otomatis di-set sebagai `production`

---

## Langkah 4: Buat File .env di Server

1. Di File Manager cPanel, buka folder subdomain
2. Buat file baru bernama `.env` di root folder (sama level dengan `server/` dan `public/`)
3. Edit file `.env` dan isi dengan:

```env
DB_HOST=localhost
DB_USER=solz1468_solkit
DB_PASSWORD=DemiAllah@1
DB_NAME=solz1468_monitoring
PORT=5000
NODE_ENV=production
```

**Catatan:** 
- Ganti `PORT=5000` dengan port yang diberikan oleh cPanel Node.js App
- Jika port dari cPanel berbeda (misal 5001), gunakan port tersebut

---

## Langkah 5: Install Dependencies di Server

### Metode A: Terminal SSH (Jika Tersedia)

1. Buka **Terminal** di cPanel atau gunakan SSH
2. Navigasi ke folder subdomain:
```bash
cd ~/monitoring
# atau
cd ~/public_html/monitoring
```

3. Install dependencies:
```bash
npm install
```

### Metode B: Install via Package.json

1. Di File Manager, pastikan `package.json` sudah di-upload
2. Di Node.js Selector cPanel:
   - Pilih aplikasi yang sudah dibuat
   - Klik **"NPM Install"** atau pilih **"Run NPM Install"**
   - cPanel akan otomatis menjalankan `npm install`

---

## Langkah 6: Update API URL di Client Build

**PENTING:** Build React harus menggunakan API URL production, bukan localhost.

### Di Komputer Lokal:

1. Buat file `.env` di folder `client/` jika belum ada:
```bash
cd client
touch .env
```

2. Edit file `client/.env` dan tambahkan:
```env
REACT_APP_API_URL=https://monitoring.solusicodekata.com/api
```

**Atau** tanpa environment variable, API akan otomatis menggunakan base URL dari domain production saat di-build.

---

## Langkah 7: Build React untuk Production (Lagi)

**Rebuild dengan API URL production:**

```bash
cd client
npm run build
```

Pastikan build berhasil dan file ada di folder `client/build/`

---

## Langkah 8: Upload Build React ke Server

1. Di File Manager cPanel, pastikan folder `public/` ada di root folder subdomain
2. Upload **semua isi** folder `client/build/` ke folder `public/` di server
   - Pastikan `index.html` ada di `public/index.html`
   - Pastikan folder `static/` ada di `public/static/`

**Struktur yang benar:**
```
monitoring/
├── server/
│   └── index.js
├── public/
│   ├── index.html          ← dari client/build/index.html
│   ├── static/             ← dari client/build/static/
│   └── ...
├── package.json
└── .env
```

---

## Langkah 9: Verifikasi File .env di Server

Pastikan file `.env` sudah dibuat dan ada di **root folder subdomain** (sama level dengan `server/` dan `public/`).

Isi file `.env`:
```env
DB_HOST=localhost
DB_USER=solz1468_solkit
DB_PASSWORD=DemiAllah@1
DB_NAME=solz1468_monitoring
PORT=5000
NODE_ENV=production
```

**Catatan:** 
- Ganti `PORT=5000` dengan port yang diberikan cPanel Node.js App
- File `.env` HARUS di root folder, bukan di dalam folder `server/`

---

## Langkah 10: Update Environment Variables di Node.js App (Opsional)

Beberapa hosting cPanel memerlukan set environment variables melalui interface Node.js Selector:

1. Di Node.js Selector, pilih aplikasi Anda
2. Klik **"Edit"** atau **"Setup Environment Variables"**
3. Tambahkan variabel berikut:
   - `DB_HOST` = `localhost`
   - `DB_USER` = `solz1468_solkit`
   - `DB_PASSWORD` = `DemiAllah@1`
   - `DB_NAME` = `solz1468_monitoring`
   - `NODE_ENV` = `production`

**Catatan:** Port biasanya sudah di-set otomatis oleh cPanel.

---

## Langkah 11: Start/Restart Aplikasi

1. Di Node.js Selector cPanel:
   - Pilih aplikasi Anda
   - Klik **"Restart App"** atau **"Reload App"**

2. Atau bisa juga di Terminal:
```bash
# Jika menggunakan PM2 (jika tersedia)
pm2 restart monitoring-app

# Atau restart via cPanel Node.js interface
```

---

## Langkah 12: Test Aplikasi

1. Buka browser dan akses: `https://monitoring.solusicodekata.com`
2. Test fitur-fitur:
   - Dashboard bisa diakses
   - Bisa create seminar baru
   - Bisa edit/delete seminar
   - Monitoring page bisa menampilkan seminar aktif
   - Timer berjalan dengan baik

---

## Troubleshooting

### Error: Cannot find module
- Pastikan semua dependencies sudah diinstall: `npm install`
- Pastikan `node_modules/` folder ada di server

### Error: Database connection failed
- Periksa file `.env` sudah benar
- Pastikan username, password, dan database name sesuai
- Pastikan database sudah diimport dengan benar

### Error: Port already in use
- Ganti port di file `.env` sesuai port yang diberikan cPanel
- Restart aplikasi setelah ganti port

### 404 Error saat akses halaman
- Pastikan server sudah dikonfigurasi untuk serve static files
- Pastikan routing React sudah di-setup dengan benar di server

### API tidak bisa diakses
- Pastikan API URL di client build sudah di-update
- Periksa CORS settings di server (sudah di-set ke `*` di kode)
- Test endpoint API langsung: `https://monitoring.solusicodekata.com/api/seminars`
- Pastikan tidak ada firewall yang memblokir request

### Aplikasi tidak jalan
- Cek log di Node.js Selector untuk melihat error
- Pastikan file `server/index.js` adalah startup file yang benar
- Pastikan semua dependencies terinstall: `npm install`
- Pastikan port di `.env` sesuai dengan port dari cPanel

### Halaman 404 saat akses route React
- Pastikan server sudah dikonfigurasi untuk serve static files (sudah ada di kode)
- Pastikan folder `public/` berisi file build React
- Pastikan `NODE_ENV=production` di `.env`

### Error: Cannot find module 'dotenv' atau module lainnya
- Jalankan `npm install` lagi di folder root
- Pastikan `node_modules/` ada dan lengkap
- Pastikan `package.json` sudah benar

---

## Catatan Penting

1. **Port cPanel**: cPanel biasanya menggunakan port khusus untuk Node.js apps, bukan port 5000. Pastikan gunakan port yang diberikan cPanel.

2. **Environment Variables**: Beberapa hosting cPanel memerlukan set environment variables melalui interface Node.js Selector, bukan hanya file `.env`.

3. **File Permissions**: Pastikan file memiliki permission yang tepat (biasanya 644 untuk file, 755 untuk folder).

4. **SSL/HTTPS**: Pastikan subdomain sudah memiliki SSL certificate (biasanya otomatis via Let's Encrypt di cPanel).

---

## Struktur Final di Server

```
monitoring/
├── server/
│   └── index.js
├── public/              # React build
│   ├── index.html
│   ├── static/
│   └── ...
├── node_modules/        # Auto-generated setelah npm install
├── package.json
└── .env
```

