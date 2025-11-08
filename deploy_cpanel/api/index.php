<?php
/**
 * Main API Router
 * File ini menangani semua routing API
 */

require_once __DIR__ . '/config.php';

// Ambil method dan path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path); // Remove /api prefix
$path = trim($path, '/');

// Split path menjadi array
$pathParts = $path ? explode('/', $path) : [];

// Route handling
try {
    $conn = getDBConnection();
    
    // GET /api/seminars
    if ($method === 'GET' && $pathParts[0] === 'seminars' && !isset($pathParts[1])) {
        $query = "SELECT * FROM seminars ORDER BY created_at DESC";
        $result = $conn->query($query);
        
        $seminars = [];
        while ($row = $result->fetch_assoc()) {
            $seminars[] = $row;
        }
        
        jsonResponse($seminars);
    }
    
    // GET /api/seminars/active
    if ($method === 'GET' && $pathParts[0] === 'seminars' && $pathParts[1] === 'active') {
        $query = "SELECT * FROM seminars WHERE status = 'play' LIMIT 1";
        $result = $conn->query($query);
        
        if ($result->num_rows > 0) {
            $seminar = $result->fetch_assoc();
            
            // Hitung waktu_berjalan real-time jika status play
            if ($seminar['status'] === 'play' && $seminar['waktu_mulai']) {
                $waktuMulai = strtotime($seminar['waktu_mulai']);
                $sekarang = time();
                $selisihDetik = $sekarang - $waktuMulai;
                
                // Update waktu_berjalan dengan perhitungan real-time
                $waktuBerjalan = (int)$seminar['waktu_berjalan'] + $selisihDetik;
                $seminar['waktu_berjalan'] = $waktuBerjalan;
            }
            
            // Pastikan waktu_berjalan adalah integer
            $seminar['waktu_berjalan'] = (int)$seminar['waktu_berjalan'];
            $seminar['durasi'] = (int)$seminar['durasi'];
            
            jsonResponse($seminar);
        } else {
            jsonResponse(null);
        }
    }
    
    // GET /api/seminars/:id
    if ($method === 'GET' && $pathParts[0] === 'seminars' && isset($pathParts[1]) && is_numeric($pathParts[1])) {
        $id = (int)$pathParts[1];
        $stmt = $conn->prepare("SELECT * FROM seminars WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            jsonResponse($result->fetch_assoc());
        } else {
            errorResponse('Seminar not found', 404);
        }
    }
    
    // POST /api/seminars
    if ($method === 'POST' && $pathParts[0] === 'seminars' && !isset($pathParts[1])) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['tanggal']) || !isset($data['pengisi']) || 
            !isset($data['materi']) || !isset($data['durasi'])) {
            errorResponse('All fields are required', 400);
        }
        
        $tanggal = $data['tanggal'];
        $pengisi = $data['pengisi'];
        $materi = $data['materi'];
        $durasi = (int)$data['durasi'];
        $status = 'jeda';
        
        $stmt = $conn->prepare("INSERT INTO seminars (tanggal, pengisi, materi, durasi, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssis', $tanggal, $pengisi, $materi, $durasi, $status);
        
        if ($stmt->execute()) {
            jsonResponse(['id' => $conn->insert_id, 'message' => 'Seminar created successfully']);
        } else {
            errorResponse('Failed to create seminar: ' . $conn->error, 500);
        }
    }
    
    // PUT /api/seminars/:id
    if ($method === 'PUT' && $pathParts[0] === 'seminars' && isset($pathParts[1]) && is_numeric($pathParts[1])) {
        $id = (int)$pathParts[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Jika hanya update status
        if (isset($data['status']) && !isset($data['tanggal']) && !isset($data['pengisi']) && 
            !isset($data['materi']) && !isset($data['durasi'])) {
            
            $status = $data['status'];
            
            if ($status === 'play') {
                // Cek apakah ada seminar lain yang sedang play
                $checkStmt = $conn->prepare("SELECT id FROM seminars WHERE status = 'play' AND id != ?");
                $checkStmt->bind_param('i', $id);
                $checkStmt->execute();
                $checkResult = $checkStmt->get_result();
                
                if ($checkResult->num_rows > 0) {
                    errorResponse('Tidak bisa start seminar lain. Ada seminar yang masih aktif!', 400);
                }
                
                // Ambil waktu_berjalan saat ini (untuk melanjutkan dari jeda)
                $getStmt = $conn->prepare("SELECT waktu_berjalan FROM seminars WHERE id = ?");
                $getStmt->bind_param('i', $id);
                $getStmt->execute();
                $getResult = $getStmt->get_result();
                
                $waktuBerjalan = 0;
                if ($getResult->num_rows > 0) {
                    $seminar = $getResult->fetch_assoc();
                    $waktuBerjalan = (int)$seminar['waktu_berjalan']; // Ambil waktu_berjalan yang sudah ada
                }
                
                // Update status menjadi play, set waktu_mulai baru, tapi TIDAK reset waktu_berjalan
                // Waktu_berjalan tetap untuk melanjutkan dari jeda
                $updateStmt = $conn->prepare("UPDATE seminars SET status = ?, waktu_mulai = CURRENT_TIMESTAMP, waktu_berjalan = ? WHERE id = ?");
                $updateStmt->bind_param('sii', $status, $waktuBerjalan, $id);
                
                if ($updateStmt->execute()) {
                    jsonResponse(['message' => 'Seminar updated successfully']);
                } else {
                    errorResponse('Failed to update seminar: ' . $conn->error, 500);
                }
            } else if ($status === 'selesai' || $status === 'jeda') {
                // Update waktu_berjalan saat jeda atau selesai
                $getStmt = $conn->prepare("SELECT waktu_mulai, waktu_berjalan, status FROM seminars WHERE id = ?");
                $getStmt->bind_param('i', $id);
                $getStmt->execute();
                $getResult = $getStmt->get_result();
                
                $waktuBerjalan = 0;
                if ($getResult->num_rows > 0) {
                    $seminar = $getResult->fetch_assoc();
                    if ($seminar['status'] === 'play' && $seminar['waktu_mulai']) {
                        $waktuMulai = strtotime($seminar['waktu_mulai']);
                        $sekarang = time();
                        $selisihDetik = $sekarang - $waktuMulai;
                        $waktuBerjalan = (int)$seminar['waktu_berjalan'] + $selisihDetik;
                    } else {
                        $waktuBerjalan = (int)$seminar['waktu_berjalan'];
                    }
                }
                
                $updateStmt = $conn->prepare("UPDATE seminars SET status = ?, waktu_berjalan = ? WHERE id = ?");
                $updateStmt->bind_param('sii', $status, $waktuBerjalan, $id);
                
                if ($updateStmt->execute()) {
                    jsonResponse(['message' => 'Seminar updated successfully']);
                } else {
                    errorResponse('Failed to update seminar: ' . $conn->error, 500);
                }
            }
        } else {
            // Update field lainnya
            $updates = [];
            $params = [];
            $types = '';
            
            if (isset($data['tanggal'])) {
                $updates[] = "tanggal = ?";
                $params[] = $data['tanggal'];
                $types .= 's';
            }
            if (isset($data['pengisi'])) {
                $updates[] = "pengisi = ?";
                $params[] = $data['pengisi'];
                $types .= 's';
            }
            if (isset($data['materi'])) {
                $updates[] = "materi = ?";
                $params[] = $data['materi'];
                $types .= 's';
            }
            if (isset($data['durasi'])) {
                $updates[] = "durasi = ?";
                $params[] = (int)$data['durasi'];
                $types .= 'i';
            }
            if (isset($data['status'])) {
                $status = $data['status'];
                $updates[] = "status = ?";
                $params[] = $status;
                $types .= 's';
                
                if ($status === 'play') {
                    // Cek apakah ada seminar lain yang sedang play
                    $checkStmt = $conn->prepare("SELECT id FROM seminars WHERE status = 'play' AND id != ?");
                    $checkStmt->bind_param('i', $id);
                    $checkStmt->execute();
                    $checkResult = $checkStmt->get_result();
                    
                    if ($checkResult->num_rows > 0) {
                        errorResponse('Tidak bisa start seminar lain. Ada seminar yang masih aktif!', 400);
                    }
                    
                    // Ambil waktu_berjalan saat ini (untuk melanjutkan dari jeda)
                    $getWaktuStmt = $conn->prepare("SELECT waktu_berjalan FROM seminars WHERE id = ?");
                    $getWaktuStmt->bind_param('i', $id);
                    $getWaktuStmt->execute();
                    $getWaktuResult = $getWaktuStmt->get_result();
                    
                    $waktuBerjalanLanjut = 0;
                    if ($getWaktuResult->num_rows > 0) {
                        $seminarWaktu = $getWaktuResult->fetch_assoc();
                        $waktuBerjalanLanjut = (int)$seminarWaktu['waktu_berjalan'];
                    }
                    
                    $updates[] = "waktu_mulai = CURRENT_TIMESTAMP";
                    $updates[] = "waktu_berjalan = " . $waktuBerjalanLanjut; // Lanjutkan dari jeda, bukan reset
                }
            }
            
            if (empty($updates)) {
                errorResponse('No fields to update', 400);
            }
            
            $params[] = $id;
            $types .= 'i';
            
            $query = "UPDATE seminars SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                jsonResponse(['message' => 'Seminar updated successfully']);
            } else {
                errorResponse('Failed to update seminar: ' . $conn->error, 500);
            }
        }
    }
    
    // DELETE /api/seminars/:id
    if ($method === 'DELETE' && $pathParts[0] === 'seminars' && isset($pathParts[1]) && is_numeric($pathParts[1])) {
        $id = (int)$pathParts[1];
        $stmt = $conn->prepare("DELETE FROM seminars WHERE id = ?");
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            jsonResponse(['message' => 'Seminar deleted successfully']);
        } else {
            errorResponse('Failed to delete seminar: ' . $conn->error, 500);
        }
    }
    
    // Route tidak ditemukan
    errorResponse('Route not found', 404);
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 500);
}

