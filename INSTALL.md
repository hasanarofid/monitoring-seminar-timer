# Panduan Instalasi Aplikasi Monitoring Seminar

## Persyaratan
- Node.js (v14 atau lebih baru)
- MySQL (v5.7 atau lebih baru)
- npm atau yarn

## Langkah Instalasi

### 1. Install Dependencies

Jalankan perintah berikut di folder root project:

```bash
npm run install-all
```

Atau install secara manual:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Setup Database MySQL

1. Login ke MySQL:
```bash
mysql -u root -p
```

2. Buat database:
```sql
CREATE DATABASE monitoring_seminar;
EXIT;
```

3. Import database menggunakan file `database.sql`:
```bash
mysql -u root -p < database.sql
```
Atau via MySQL:
```bash
mysql -u root -p
source database.sql
```

4. Copy file `.env.example` ke `.env` untuk server:
```bash
cp server/.env.example server/.env
```

5. Copy file `.env.example` ke `.env` untuk client:
```bash
cp client/.env.example client/.env
```

6. Edit file `server/.env` dan sesuaikan konfigurasi database:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=monitoring_seminar
PORT=5000
```

7. Edit file `client/.env` jika backend berjalan di URL/port berbeda:
```
REACT_APP_API_URL=http://localhost:5000
```
(Default sudah sesuai, tidak perlu diubah jika backend di port 5000)

### 3. Jalankan Aplikasi

Jalankan backend dan frontend secara bersamaan:

```bash
npm run dev
```

Aplikasi akan:
- Backend berjalan di `http://localhost:5000`
- Frontend berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

Buka browser dan akses:
- **Dashboard**: http://localhost:3000
- **Layar Monitoring**: http://localhost:3000/monitoring

## Troubleshooting

### Error koneksi database
- Pastikan MySQL sudah running
- Periksa username dan password di file `.env`
- Pastikan database `monitoring_seminar` sudah dibuat

### Port sudah digunakan
- Backend: Ganti `PORT` di file `.env`
- Frontend: Edit file `client/package.json` untuk mengubah port React

### Dependencies tidak terinstall
- Hapus folder `node_modules` dan file `package-lock.json`
- Jalankan ulang `npm install`

## Struktur Database

Tabel `seminars` akan dibuat otomatis saat pertama kali menjalankan server dengan struktur:
- `id`: Primary key
- `tanggal`: Tanggal seminar
- `pengisi`: Nama pengisi seminar
- `materi`: Materi seminar
- `durasi`: Durasi dalam menit
- `status`: Status (play, jeda, selesai)
- `waktu_mulai`: Timestamp saat mulai
- `waktu_berjalan`: Waktu yang sudah berjalan (dalam detik)

