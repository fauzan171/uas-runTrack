const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'andi@runtrack.app' },
    update: {},
    create: {
      name: 'Andi Fauzan',
      email: 'andi@runtrack.app',
      password,
    },
  })

  // hapus sesi lama user ini dulu biar seed idempoten
  await prisma.runSession.deleteMany({ where: { userId: user.id } })

  const contoh = [
    { distance: 5.0, duration: 30, date: '2024-06-01', notes: 'Lari pagi santai' },
    { distance: 8.2, duration: 48, date: '2024-06-04', notes: 'Sesi tempo' },
    { distance: 3.1, duration: 19, date: '2024-06-07', notes: 'Recovery run' },
    { distance: 10.0, duration: 62, date: '2024-06-10', notes: 'Long run weekend' },
  ]

  for (const r of contoh) {
    await prisma.runSession.create({
      data: { ...r, date: new Date(r.date), userId: user.id },
    })
  }

  console.log('Seed selesai. User demo:')
  console.log('  email   : andi@runtrack.app')
  console.log('  password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
