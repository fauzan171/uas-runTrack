#!/bin/bash

BASE=http://localhost:4000
EMAIL="tester_$(date +%s)@mail.com"
PASS="rahasia123"

echo "============================================"
echo "  TEST RunTrack API"
echo "============================================"

echo ""
echo "[1] Register user baru"
curl -s -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Tester\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}"
echo ""

echo ""
echo "[2] Login"
LOGIN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
echo "$LOGIN"
TOKEN=$(echo "$LOGIN" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).token))")

echo ""
echo "[3] Akses /api/runs TANPA token (harus 401)"
curl -s $BASE/api/runs -w "  (HTTP %{http_code})\n"

echo ""
echo "[4] Catat sesi lari baru"
NEW=$(curl -s -X POST $BASE/api/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"distance":5.2,"duration":33,"date":"2024-06-15","notes":"Lari pagi"}')
echo "$NEW"
RUNID=$(echo "$NEW" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).run.id))")

echo ""
echo "[5] Catat sesi kedua"
curl -s -X POST $BASE/api/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"distance":8.0,"duration":50,"date":"2024-06-18","notes":"Tempo run"}'
echo ""

echo ""
echo "[6] Lihat semua sesi"
curl -s $BASE/api/runs -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "[7] Edit sesi id=$RUNID"
curl -s -X PUT $BASE/api/runs/$RUNID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"distance":6.0,"notes":"Dikoreksi"}'
echo ""

echo ""
echo "[8] Lihat statistik"
curl -s $BASE/api/runs/stats -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "[9] Hapus sesi id=$RUNID"
curl -s -X DELETE $BASE/api/runs/$RUNID -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "[10] Lihat sesi setelah hapus"
curl -s $BASE/api/runs -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "============================================"
echo "  SELESAI"
echo "============================================"
