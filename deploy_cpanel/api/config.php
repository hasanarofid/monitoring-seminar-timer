<?php
/**
 * Konfigurasi Database dan CORS
 * File ini berisi konfigurasi koneksi database MySQL
 */

// Enable CORS untuk semua origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// KONFIGURASI DATABASE
// ============================================
// Database sudah dikonfigurasi untuk monitoring.solusicodekata.com

define('DB_HOST', 'localhost');
define('DB_USER', 'solz1468_solkit');
define('DB_PASSWORD', 'DemiAllah@1');
define('DB_NAME', 'solz1468_monitoring');

// Koneksi Database
function getDBConnection() {
    static $conn = null;
    
    if ($conn === null) {
        try {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
            
            if ($conn->connect_error) {
                throw new Exception('Database connection failed: ' . $conn->connect_error);
            }
            
            // Set charset ke utf8mb4
            $conn->set_charset('utf8mb4');
            
            // Buat tabel jika belum ada
            createTableIfNotExists($conn);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
    
    return $conn;
}

// Buat tabel jika belum ada
function createTableIfNotExists($conn) {
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS seminars (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $conn->query($createTableQuery);
}

// Helper function untuk response JSON
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

// Helper function untuk error response
function errorResponse($message, $statusCode = 500) {
    jsonResponse(['error' => $message], $statusCode);
}

