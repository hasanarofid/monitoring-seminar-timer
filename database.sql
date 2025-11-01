-- Database untuk Aplikasi Monitoring Seminar
-- Gunakan: mysql -u root -p < database.sql
-- Atau: mysql -u root -p
--      source database.sql

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS monitoring_seminar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gunakan database
USE monitoring_seminar;

-- Hapus tabel jika sudah ada (opsional, untuk reset)
DROP TABLE IF EXISTS seminars;

-- Buat tabel seminars
CREATE TABLE seminars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal DATE NOT NULL,
  pengisi VARCHAR(255) NOT NULL,
  materi TEXT NOT NULL,
  durasi INT NOT NULL COMMENT 'durasi dalam menit',
  status ENUM('play', 'jeda', 'selesai') DEFAULT 'jeda',
  waktu_mulai TIMESTAMP NULL,
  waktu_berjalan INT DEFAULT 0 COMMENT 'waktu yang sudah berjalan dalam detik',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Data contoh (opsional - uncomment jika ingin data contoh)
/*
INSERT INTO seminars (tanggal, pengisi, materi, durasi, status) VALUES
('2024-01-15', 'Dr. Ahmad Fauzi', 'Pengenalan React JS untuk Pemula', 60, 'jeda'),
('2024-01-20', 'Prof. Siti Nurhaliza', 'Advanced Node.js Development', 90, 'jeda'),
('2024-01-25', 'Ir. Budi Santoso', 'Best Practices MySQL Database', 45, 'jeda');
*/
-- Tampilkan struktur tabel untuk verifikasi
DESCRIBE seminars;

-- Tampilkan informasi database
SELECT 'Database monitoring_seminar berhasil dibuat!' AS Status;
SELECT DATABASE() AS 'Database Aktif';

