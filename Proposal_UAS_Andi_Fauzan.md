# PROPOSAL UAS — WEB ADVANCED DEVELOPMENT

## RunTrack — Aplikasi Pencatatan & Tracking Aktivitas Lari Berbasis Web

**Nama Mahasiswa:** Andi Fauzan Hediantoro  
**NIM:** 24110400010  
**Program Studi:** Sistem Informasi  
**Topik Detail:** Pengembangan Aplikasi Web Pencatatan Aktivitas Lari dengan REST API (Node.js + Express), ORM (Prisma + PostgreSQL), dan Autentikasi JWT



## Bagian 1 — Topic & Business Goal

### Latar Belakang

Banyak pelari, baik pemula maupun berpengalaman, kesulitan memantau perkembangan latihan mereka secara terstruktur. Catatan sesi lari sering hanya tersimpan di notes HP atau tidak dicatat sama sekali, sehingga sulit mengukur progres, menentukan target realistis, dan menjaga konsistensi latihan.

### Business Goal

1. Memungkinkan pengguna mencatat setiap sesi lari (jarak, durasi, tanggal, catatan) secara terstruktur
2. Memberikan dashboard statistik personal untuk memantau progres dan konsistensi latihan

### Business Requirements

| No   | Requirement                                                              |
|------|--------------------------------------------------------------------------|
| BR-1 | User dapat mendaftar dan login untuk mengakses data pribadinya           |
| BR-2 | User dapat mencatat sesi lari baru (jarak, durasi, tanggal, catatan)     |
| BR-3 | User dapat melihat riwayat semua sesi lari miliknya                      |
| BR-4 | User dapat melihat statistik agregat (total km, pace rata-rata, jumlah sesi) |
| BR-5 | User dapat mengedit dan menghapus sesi lari yang sudah dicatat           |

---

## Bagian 2 — Bentuk Data & API Endpoints

### Entitas Utama

- **User** — data akun pengguna (nama, email, password hash)
- **RunSession** — sesi lari (jarak dalam km, durasi dalam menit, tanggal, catatan opsional)

### Daftar Endpoint REST API

| Method | Endpoint | Business Goal | Expected Output |
|--------|----------|---------------|-----------------|
| POST | `/api/auth/register` | Daftar akun baru | `{ user }` — 201 Created |
| POST | `/api/auth/login` | Login & dapatkan JWT | `{ user, token }` — 200 OK |
| GET | `/api/runs` | Lihat semua sesi lari milik user yang login | `[{ id, distance, duration, date, notes }]` |
| POST | `/api/runs` | Catat sesi lari baru | `{ run }` — 201 Created |
| PUT | `/api/runs/:id` | Edit sesi lari tertentu | `{ run }` — 200 OK |
| DELETE | `/api/runs/:id` | Hapus sesi lari tertentu | `{ message }` — 200 OK |
| GET | `/api/runs/stats` | Lihat statistik agregat (total km, pace, jumlah sesi) | `{ totalKm, avgPace, totalSessions }` — 200 OK |

### Autentikasi (JWT)

Semua endpoint `/api/runs` memerlukan header `Authorization: Bearer <token>` yang didapat dari hasil login. Token diverifikasi di middleware sebelum request diproses.

---

## Bagian 3 — Rencana Tech Stack

| Layer    | Teknologi            |
|----------|----------------------|
| Backend  | Node.js + Express.js |
| Frontend | React.js             |
| ORM      | Prisma               |
| Database | PostgreSQL           |
| Auth     | JWT (jsonwebtoken)   |

---

## Bagian 4 — Impact

- **Bagi pengguna:** Pelari bisa mencatat dan memantau progres latihan secara konsisten, memudahkan evaluasi performa dari waktu ke waktu.
- **Bagi kesehatan & motivasi:** Statistik yang tervisualisasi (total km, pace) memberikan motivasi nyata untuk terus berlatih dan mencapai target.
- **Jangka panjang:** Sistem dapat dikembangkan dengan fitur target mingguan, integrasi GPS, atau komunitas pelari dengan arsitektur yang sama.
