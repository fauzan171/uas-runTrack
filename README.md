# RunTrack

Aplikasi buat nyatet sesi lari dan ngeliat progres latihan. Dibuat untuk UAS Web Advanced Development.

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
npm run seed        # opsional, bikin user contoh
npm run dev
```

Server jalan di `http://localhost:4000`.

User hasil seed:
- email: `andi@runtrack.app`
- password: `password123`

### 3. Test API (terminal)

```bash
cd backend
bash test-api.sh
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Fronten udah di-set proxy `/api` ke backend jadi gak ribet CORS.

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

## Penjelasan Detail

Untuk laporan lengkap (deskripsi, skema data, pemenuhan requirement, hasil uji) baca [`LAPORAN_UAS.md`](./LAPORAN_UAS.md).
