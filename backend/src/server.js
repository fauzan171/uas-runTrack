require('dotenv').config()
const app = require('./app')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

async function main() {
  await prisma.$connect()
  console.log('Database terhubung')

  app.listen(PORT, () => {
    console.log(`Server RunTrack jalan di http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error('Gagal start server:', err)
  process.exit(1)
})
