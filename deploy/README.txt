==========================================
FOLDER DEPLOY - SIAP UNTUK UPLOAD KE CPANEL
==========================================

Folder ini berisi semua file yang siap untuk di-upload ke cPanel via FileZilla.

ISI FOLDER:
- server/              → Folder backend Node.js (upload ke server/)
- public/              → Folder build React (upload ke public/)
- package.json         → File dependencies Node.js (upload ke root)
- .env                 → File konfigurasi (UPLOAD LANGSUNG, PORT akan di-update nanti)
- AFTER_CREATE_APP.txt → Langkah setelah create application di cPanel ⭐
- README_DEPLOY.txt    → Instruksi deployment
- UPLOAD_INSTRUKSI.txt → Cara upload via FileZilla
- SETUP_CPANEL_LANGKAH.txt → Panduan setup lengkap
- REBUILD_INSTRUKSI.txt → Instruksi rebuild React (jika diperlukan)

==========================================
CARA PAKAI:
==========================================

1. BACA FILE: UPLOAD_INSTRUKSI.txt
   → Ikuti langkah-langkah upload via FileZilla
   → Upload folder server/, public/, package.json, dan .env

2. SETUP NODE.JS APP DI CPANEL:
   → Lihat SETUP_CPANEL_LANGKAH.txt untuk form Create Application
   → Isi form dengan benar
   → Klik "CREATE"

3. SETELAH CREATE APP:
   → ⭐ BACA FILE: AFTER_CREATE_APP.txt ⭐
   → Update PORT di file .env
   → Tambahkan Environment Variables di cPanel

4. INSTALL & RESTART:
   → Klik "NPM Install" di Node.js Selector
   → Klik "Restart App"
   → Test di browser

==========================================
PENTING:
==========================================

✅ Build React sudah menggunakan relative API path (/api)
   → Tidak perlu rebuild dengan environment variable
   → API akan otomatis menggunakan domain production

✅ Server sudah dikonfigurasi untuk serve static files
   → Tidak perlu konfigurasi tambahan

✅ Pastikan file .env ada di root folder (sama level dengan server/)
   → File .env HARUS ada untuk koneksi database

✅ Database sudah harus diimport ke server terlebih dahulu

==========================================
UNTUK PANDUAN LENGKAP:
==========================================

Lihat file: ../DEPLOY_CPANEL.md

==========================================

