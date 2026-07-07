# RunTrack — Aplikasi Pencatatan & Tracking Aktivitas Lari

Aplikasi web untuk mencatat sesi lari dan memantau perkembangan latihan. Dibuat untuk UAS Web Advanced Development.

| | |
|---|---|
| Nama | Andi Fauzan Hediantoro |
| NIM | 24110400010 |
| Program Studi | Sistem Informasi |
| Topik | REST API (Node.js + Express), ORM (Prisma + PostgreSQL), Autentikasi JWT |

---

## 1. Deskripsi Singkat

RunTrack memungkinkan pelari mencatat setiap sesi latihan lari (jarak, durasi, tanggal, catatan) secara terstruktur dan memantau perkembangannya lewat dashboard statistik personal. Aplikasi terdiri dari **backend REST API** dan **frontend React** yang saling terhubung.

## 2. Tech Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| Backend | Node.js + Express.js | REST API server |
| Frontend | React.js (Vite) | Antarmuka pengguna |
| ORM | Prisma | Akses & migrasi database |
| Database | PostgreSQL | Penyimpanan data |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` | Autentikasi & hashing password |

## 3. Struktur Proyek

```
uas/
├── Proposal_UAS_Andi_Fauzan.md
├── README.md
├── backend/
│   ├── package.json
│   ├── .env / .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── server.js          # entry point, start server & koneksi DB
│   │   ├── app.js             # konfigurasi express, middleware, route
│   │   ├── lib/prisma.js      # instance Prisma Client
│   │   ├── middlewares/auth.js# verify JWT
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── runController.js
│   │   └── routes/
│   │       ├── auth.js
│   │       └── runs.js
│   └── test-api.sh            # skrip uji endpoint via curl
└── frontend/
    ├── package.json
    ├── vite.config.js         # proxy /api -> backend
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # routing + protected route
        ├── AuthContext.jsx   # state autentikasi
        ├── api.js            # wrapper fetch + header JWT
        ├── style.css
        ├── components/  (Navbar, StatsCard, RunForm, RunList)
        └── pages/       (LoginPage, RegisterPage, DashboardPage)
```

## 4. Model Data (Prisma Schema)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String                // bcrypt hash
  createdAt DateTime @default(now())
  runs      RunSession[]
}

model RunSession {
  id        Int      @id @default(autoincrement())
  distance  Float    // dalam km
  duration  Int      // dalam menit
  date      DateTime
  notes     String   @default("")
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId])
}
```

**Relasi:** satu `User` memiliki banyak `RunSession` (one-to-many). Jika user dihapus, semua sesi miliknya ikut terhapus (`onDelete: Cascade`).

## 5. Endpoint REST API

| Method | Endpoint | Fungsi | Auth | Output |
|--------|----------|--------|------|--------|
| POST | `/api/auth/register` | Daftar akun baru | - | `{ user }` — 201 |
| POST | `/api/auth/login` | Login & dapatkan JWT | - | `{ user, token }` — 200 |
| GET | `/api/runs` | Lihat semua sesi milik user login | JWT | `[{ id, distance, duration, date, notes }]` — 200 |
| POST | `/api/runs` | Catat sesi lari baru | JWT | `{ run }` — 201 |
| PUT | `/api/runs/:id` | Edit sesi lari | JWT | `{ run }` — 200 |
| DELETE | `/api/runs/:id` | Hapus sesi lari | JWT | `{ message }` — 200 |
| GET | `/api/runs/stats` | Statistik agregat | JWT | `{ totalKm, avgPace, totalSessions }` — 200 |

Semua endpoint `/api/runs` memerlukan header:

```
Authorization: Bearer <token>
```

Token berisi `{ id, email }` pengguna, ditandatangani dengan `JWT_SECRET`, berlaku 7 hari. Verifikasi dilakukan di middleware `middlewares/auth.js`. Endpoint tanpa token → `401`.

## 6. Pemenuhan Business Requirements

| Kode | Requirement | Implementasi |
|------|-------------|--------------|
| BR-1 | User dapat mendaftar dan login | `POST /api/auth/register` (hash bcrypt) & `POST /api/auth/login` (issue JWT); halaman `RegisterPage` & `LoginPage` |
| BR-2 | User dapat mencatat sesi lari baru | `POST /api/runs`; komponen `RunForm` |
| BR-3 | User dapat melihat riwayat semua sesi | `GET /api/runs` (urut tanggal desc); komponen `RunList` |
| BR-4 | User dapat melihat statistik agregat | `GET /api/runs/stats`; komponen `StatsCard` |
| BR-5 | User dapat mengedit & menghapus sesi | `PUT /api/runs/:id` & `DELETE /api/runs/:id`; tombol Edit/Hapus di `RunList` |

Setiap operasi CRUD memastikan `userId` sesuai user yang login, sehingga user tidak bisa mengakses sesi milik user lain.

## 7. Perhitungan Statistik

Pace dihitung dalam **menit per km**:
- Pace per sesi = `durasi (menit) / jarak (km)`
- Pace rata-rata = `total durasi / total jarak`

Contoh (data seed user demo):

| Sesi | Jarak (km) | Durasi (menit) |
|------|-----------|----------------|
| 1 | 5.0 | 30 |
| 2 | 8.2 | 48 |
| 3 | 3.1 | 19 |
| 4 | 10.0 | 62 |
| **Total** | **26.3** | **159** |

- `totalKm` = 26.3
- `avgPace` = 159 / 26.3 = **6.05 min/km**
- `totalSessions` = 4

## 8. Cara Menjalankan

### 8.1 Database
Pastikan PostgreSQL berjalan, lalu buat database:
```sql
CREATE DATABASE runtrack_dev;
```

### 8.2 Backend
```bash
cd backend
cp .env.example .env            # sesuaikan DATABASE_URL bila perlu
npm install
npx prisma migrate dev          # jalankan migration
npm run seed                    # isi data contoh (opsional)
npm run dev                     # server jalan di http://localhost:4000
```

User demo hasil seed:
- email: `andi@runtrack.app`
- password: `password123`

### 8.3 Test API (di terminal)
```bash
cd backend
bash test-api.sh
```

### 8.4 Frontend
```bash
cd frontend
npm install
npm run dev                     # buka http://localhost:5173
```
Frontend meneruskan request `/api` ke backend lewat proxy di `vite.config.js`, sehingga tidak ada masalah CORS saat development.

## 9. Hasil Pengujian

### 9.1 Uji endpoint via `curl` / `test-api.sh`

| No | Skenario | Hasil |
|----|----------|-------|
| 1 | Register user baru | 201 Created ✓ |
| 2 | Register email sudah ada | 409 Conflict ✓ |
| 3 | Login kredensial benar | 200 + token JWT ✓ |
| 4 | `/api/runs` tanpa token | 401 Unauthorized ✓ |
| 5 | `/api/runs` dengan token | 200 + data ✓ |
| 6 | Catat sesi lari baru | 201 Created ✓ |
| 7 | Catat sesi field kurang | 400 Bad Request ✓ |
| 8 | Edit sesi (`PUT`) | 200 OK ✓ |
| 9 | Hapus sesi (`DELETE`) | 200 OK ✓ |
| 10 | Lihat statistik | 200 + `{totalKm, avgPace, totalSessions}` ✓ |

Contoh output `GET /api/runs/stats`:
```json
{"totalKm":26.3,"avgPace":6.05,"totalSessions":4}
```

### 9.2 Uji frontend
- Build production (`npm run build`) → sukses, tanpa error.
- Proxy `/api` dari frontend (`:5173`) ke backend (`:4000`) → login lewat frontend mengembalikan 200.
- Flow end-to-end: register → login → catat sesi → muncul di tabel → edit → berubah → hapus → hilang dari daftar.

## 10. Fitur Frontend

- **Login & Register** dengan validasi sederhana + pesan error.
- **Dashboard (terlindungi)** — hanya bisa diakses setelah login:
  - Kartu statistik: total jarak, pace rata-rata (format `mm:ss`), jumlah sesi.
  - Form catat sesi baru (jarak, durasi, tanggal, catatan).
  - Form edit sesi (terisi otomatis).
  - Tabel riwayat dengan kolom pace per sesi + tombol Edit/Hapus.
- **Navbar** menampilkan nama user + tombol logout saat login, atau link Login/Daftar saat belum.
- Token JWT disimpan di `localStorage` sehingga sesi tetap aktif saat halaman di-refresh.

## 11. Keamanan

- Password di-hash memakai `bcryptjs` (salt 10 rounds).
- JWT ditandatangani dengan `JWT_SECRET` di `.env`, berlaku 7 hari.
- Endpoint `/api/runs` dilindungi middleware `authenticate`.
- Otorisasi per-user: edit/hapus hanya berlaku pada sesi milik user yang login.

## 12. Pengembangan Lanjutan

- Target latihan mingguan/bulanan.
- Integrasi GPS untuk pencatatan rute otomatis.
- Komunitas pelari (leaderboard, feed).
- Grafik progres (chart) di dashboard.
