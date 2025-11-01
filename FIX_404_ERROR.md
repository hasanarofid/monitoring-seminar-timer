# Cara Memperbaiki Error 404 - API Not Found

## Problem
Error 404 terjadi karena frontend mencari API di `http://localhost:5000/seminars` 
padahal backend API ada di `http://localhost:5000/api/seminars`

## Solusi

### 1. Update file `.env` di folder client

File `client/.env` harus berisi:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**PENTING**: URL harus berakhir dengan `/api` karena:
- `api.js` menggunakan `baseURL: API_URL` 
- Kemudian endpoint seperti `api.get('/seminars')` akan menjadi `http://localhost:5000/api/seminars`

### 2. Restart Development Server

Setelah mengubah `.env`, **WAJIB** restart development server:

1. **Stop** server dengan `Ctrl+C` di terminal yang menjalankan `npm run dev`
2. **Start** ulang:
```bash
npm run dev
```

### 3. Hard Refresh Browser

Setelah server restart, hard refresh browser:
- **Windows/Linux**: `Ctrl + Shift + R` atau `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 4. Clear Browser Cache (Jika Masih Error)

Jika masih error setelah restart:
1. Buka Developer Tools (F12)
2. Klik kanan pada tombol refresh
3. Pilih "Empty Cache and Hard Reload"

## Verifikasi

Setelah restart, buka browser console (F12) dan cek:
- **Sebelum**: `GET http://localhost:5000/seminars 404`
- **Sesudah**: `GET http://localhost:5000/api/seminars 200`

## Troubleshooting

### Masih error 404?
1. Pastikan backend server berjalan: `lsof -i :5000`
2. Test API langsung: `curl http://localhost:5000/api/seminars`
3. Pastikan file `.env` di `client/.env` sudah benar
4. Pastikan sudah restart development server

### Halaman kosong?
1. Buka browser console (F12)
2. Cek apakah ada error JavaScript
3. Pastikan semua dependencies sudah terinstall: `npm install`

