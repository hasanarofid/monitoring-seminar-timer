# Panduan Install dan Menjalankan Server Backend

## Install Dependencies

### Dari Folder Root Project (Recommended)

```bash
# Kembali ke folder root
cd ..

# Install semua dependencies (server + client)
npm install
```

### Hanya Install Dependencies Server

```bash
# Dari folder root
npm install express mysql2 cors dotenv socket.io

# Install devDependencies untuk development
npm install --save-dev nodemon
```

## Setup Konfigurasi

1. **Copy file .env.example ke .env:**
```bash
# Dari folder server
cp .env.example .env
```

2. **Edit file .env dan sesuaikan konfigurasi:**
```bash
nano .env
# atau
vim .env
```

Isi file `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=monitoring_seminar
PORT=5000
```

## Setup Database

Pastikan database MySQL sudah dibuat:

```bash
# Dari folder root project
mysql -u root -p < database.sql
```

Atau via MySQL:
```bash
mysql -u root -p
source database.sql
```

## Menjalankan Server

### Dari Folder Root (Recommended)

```bash
# Dari folder root project
npm run server
```

### Dari Folder Server

```bash
# Dari folder server
node index.js
```

Atau dengan nodemon (auto-reload saat perubahan):
```bash
# Dari folder root
nodemon server/index.js
```

## Verifikasi Server Berjalan

Server akan berjalan di: `http://localhost:5000`

Test dengan curl atau browser:
```bash
curl http://localhost:5000/api/seminars
```

## Troubleshooting

### Error: Cannot find module
```bash
# Pastikan sudah install dependencies dari folder root
cd ..
npm install
```

### Error: Koneksi database gagal
- Pastikan MySQL sudah running
- Periksa username dan password di file `.env`
- Pastikan database `monitoring_seminar` sudah dibuat

### Error: Port 5000 sudah digunakan
- Ganti port di file `.env`: `PORT=5001`
- Atau matikan aplikasi yang menggunakan port 5000

### Server tidak auto-reload
- Gunakan `nodemon` untuk auto-reload
- Install: `npm install -g nodemon`
- Jalankan: `nodemon server/index.js`

