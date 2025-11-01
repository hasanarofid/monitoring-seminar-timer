# Troubleshooting - Port Already in Use

## Problem: Error EADDRINUSE - Port 5000 sudah digunakan

```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solusi

### 1. Cek Proses yang Menggunakan Port 5000

```bash
lsof -i :5000
```

atau

```bash
netstat -tulpn | grep 5000
```

atau

```bash
ss -tulpn | grep 5000
```

### 2. Matikan Proses yang Menggunakan Port 5000

#### Cara 1: Menggunakan PID dari lsof
```bash
# Cari PID
lsof -i :5000

# Matikan proses (ganti PID dengan angka yang ditemukan)
kill PID
```

#### Cara 2: Menggunakan fuser
```bash
fuser -k 5000/tcp
```

#### Cara 3: Matikan semua proses node (hati-hati!)
```bash
pkill -f node
```

### 3. Alternatif: Ganti Port

Edit file `server/.env`:
```env
PORT=5001
```

Jangan lupa update juga `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5001
```

## Cara Menjalankan Server

### Jika sudah menjalankan `npm run dev`
Jangan jalankan `node index.js` lagi, karena server sudah berjalan!

### Jika ingin menjalankan server saja:
```bash
# Matikan proses yang menggunakan port 5000
kill $(lsof -t -i:5000)

# Jalankan server
cd server
node index.js
```

### Jika ingin menjalankan server dan client:
```bash
# Dari folder root
npm run dev
```

## Checklist

- [ ] Cek apakah sudah ada server yang berjalan: `lsof -i :5000`
- [ ] Jika ada, matikan dulu: `kill PID`
- [ ] Pastikan file `.env` sudah di-setup dengan benar
- [ ] Pastikan database MySQL sudah dibuat
- [ ] Jalankan server: `npm run server` atau `node server/index.js`

