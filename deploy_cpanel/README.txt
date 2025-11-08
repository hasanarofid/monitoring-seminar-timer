===========================================
FOLDER SIAP UPLOAD KE CPANEL
===========================================

Folder ini berisi semua file yang siap di-upload ke subdomain:
monitoring.solusicodekata.com

===========================================
CARA UPLOAD:
===========================================

1. Login ke cPanel Anda
2. Buka File Manager
3. Navigasi ke folder subdomain monitoring.solusicodekata.com
   (Biasanya ada di: public_html/monitoring/ atau monitoring/)
4. Upload SEMUA isi folder deploy_cpanel/ ke root folder subdomain
   - Bisa drag & drop semua file dan folder
   - Atau upload satu per satu

===========================================
STRUKTUR FOLDER DI SERVER:
===========================================

monitoring.solusicodekata.com/
├── index.html              ← dari client/build/
├── static/                 ← dari client/build/static/
│   ├── css/
│   └── js/
├── api/                     ← folder PHP API
│   ├── config.php          ← SUDAH DIKONFIGURASI dengan database Anda
│   ├── index.php
│   └── .htaccess
├── .htaccess                ← routing untuk React app dan API
├── brigthon.jpeg            ← jika ada
└── asset-manifest.json      ← dari client/build/

===========================================
KONFIGURASI DATABASE:
===========================================

Database sudah dikonfigurasi di file api/config.php:
- DB_HOST: localhost
- DB_USER: solz1468_solkit
- DB_PASSWORD: DemiAllah@1
- DB_NAME: solz1468_monitoring

TIDAK PERLU EDIT LAGI - SUDAH SIAP!

===========================================
SET PERMISSION FILE:
===========================================

Setelah upload, pastikan permission file:
- File PHP: 644
- Folder: 755
- .htaccess: 644

Cara: Klik kanan file → Change Permissions

===========================================
TEST SETELAH UPLOAD:
===========================================

1. Test API:
   https://monitoring.solusicodekata.com/api/seminars
   Seharusnya muncul JSON response (bisa kosong [] jika belum ada data)

2. Test Aplikasi:
   https://monitoring.solusicodekata.com
   Seharusnya aplikasi bisa diakses

===========================================
TROUBLESHOOTING:
===========================================

Jika ada error:
1. Cek permission file (harus 644 untuk file, 755 untuk folder)
2. Cek file .htaccess sudah di-upload
3. Cek database credentials di api/config.php
4. Cek error log di cPanel

===========================================
CATATAN:
===========================================

- Aplikasi ini menggunakan PHP backend (TIDAK PERLU Node.js)
- Real-time update menggunakan polling (setiap 2 detik)
- Database MySQL sudah dikonfigurasi

===========================================

