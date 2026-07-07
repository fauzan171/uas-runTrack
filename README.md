# RunTrack

Aplikasi buat nyatet sesi lari dan ngeliat progres latihan. Dibuat untuk UAS Web Advanced Development.

## Akses & Login

Setelah server jalan, buka di browser:

```
http://localhost:5173
```

**Akun demo (hasil seed):**

| Email | Password |
|-------|----------|
| `andi@runtrack.app` | `password123` |

Bisa langsung login pake akun di atas (udah ada 4 sesi lari contoh), atau daftar akun baru lewat halaman Register.

## Teknologi

- **Backend:** Node.js + Express
- **Frontend:** React (Vite)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt

## Struktur

```
uas/
├── backend/      # API
├── frontend/     # React app
└── Proposal_UAS_Andi_Fauzan.md
```

## Cara Jalanin

> Prasyarat: PostgreSQL berjalan di `localhost:5432`.

### 1. Database

Bikin database dulu di PostgreSQL:

```sql
CREATE DATABASE runtrack_dev;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed        # bikin user contoh (andi@runtrack.app)
npm run dev
```

Server jalan di `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Frontend udah di-set proxy `/api` ke backend jadi gak ribet CORS.

### 4. Test API (terminal)

```bash
cd backend
bash test-api.sh
```

## Endpoint

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | - |
| POST | `/api/auth/login` | - |
| GET | `/api/runs` | JWT |
| POST | `/api/runs` | JWT |
| PUT | `/api/runs/:id` | JWT |
| DELETE | `/api/runs/:id` | JWT |
| GET | `/api/runs/stats` | JWT |

Yang butuh JWT kirim header `Authorization: Bearer <token>`.
