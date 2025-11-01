# Cara Import Database monitoring_seminar

## Metode 1: Import via Terminal (Source)

1. Buka terminal dan login ke MySQL:
```bash
mysql -u root -p
```

2. Setelah masuk ke MySQL, jalankan perintah:
```sql
source database.sql
```

Atau dengan path lengkap:
```sql
source /home/hasanarofid/Documents/reny/monitoringapp/database.sql
```

3. Verifikasi database berhasil dibuat:
```sql
SHOW DATABASES;
USE monitoring_seminar;
SHOW TABLES;
DESCRIBE seminars;
```

4. Keluar dari MySQL:
```sql
EXIT;
```

## Metode 2: Import Langsung dari Terminal (Tanpa Login)

Jalankan perintah berikut di terminal (pastikan berada di folder project):

```bash
mysql -u root -p < database.sql
```

Atau dengan path lengkap:
```bash
mysql -u root -p < /home/hasanarofid/Documents/reny/monitoringapp/database.sql
```

## Metode 3: Import dengan Pipe (Tanpa Password di Command)

```bash
cat database.sql | mysql -u root -p
```

## Verifikasi

Setelah import, verifikasi database:

```bash
mysql -u root -p -e "USE monitoring_seminar; SHOW TABLES; DESCRIBE seminars;"
```

## Troubleshooting

### Error: "Unknown database"
- Pastikan file `database.sql` ada di lokasi yang benar
- Pastikan menggunakan path lengkap jika perlu

### Error: "Access denied"
- Pastikan user MySQL memiliki hak akses untuk membuat database
- Gunakan user yang memiliki privilege CREATE DATABASE

### Error: "Table already exists"
- File SQL sudah otomatis menghapus tabel jika sudah ada
- Jika masih error, hapus database manual: `DROP DATABASE monitoring_seminar;`

## Struktur Tabel

Tabel `seminars` memiliki kolom:
- `id`: Primary key (auto increment)
- `tanggal`: Tanggal seminar (DATE)
- `pengisi`: Nama pengisi seminar (VARCHAR 255)
- `materi`: Materi seminar (TEXT)
- `durasi`: Durasi dalam menit (INT)
- `status`: Status seminar - play, jeda, selesai (ENUM)
- `waktu_mulai`: Timestamp saat mulai (TIMESTAMP)
- `waktu_berjalan`: Waktu yang sudah berjalan dalam detik (INT)
- `created_at`: Timestamp pembuatan (TIMESTAMP)
- `updated_at`: Timestamp update terakhir (TIMESTAMP)

