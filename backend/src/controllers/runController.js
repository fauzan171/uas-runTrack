const prisma = require('../lib/prisma')

async function getRuns(req, res) {
  try {
    const runs = await prisma.runSession.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    })

    const result = runs.map((r) => ({
      id: r.id,
      distance: r.distance,
      duration: r.duration,
      date: r.date,
      notes: r.notes,
    }))

    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mengambil data sesi lari' })
  }
}

async function createRun(req, res) {
  try {
    const { distance, duration, date, notes } = req.body

    if (distance == null || duration == null || !date) {
      return res.status(400).json({ message: 'distance, duration, dan date wajib diisi' })
    }

    const run = await prisma.runSession.create({
      data: {
        distance: parseFloat(distance),
        duration: parseInt(duration),
        date: new Date(date),
        notes: notes || '',
        userId: req.user.id,
      },
    })

    return res.status(201).json({
      run: {
        id: run.id,
        distance: run.distance,
        duration: run.duration,
        date: run.date,
        notes: run.notes,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal menyimpan sesi lari' })
  }
}

async function updateRun(req, res) {
  try {
    const id = parseInt(req.params.id)
    const { distance, duration, date, notes } = req.body

    const existing = await prisma.runSession.findFirst({
      where: { id, userId: req.user.id },
    })
    if (!existing) {
      return res.status(404).json({ message: 'Sesi lari tidak ditemukan' })
    }

    const run = await prisma.runSession.update({
      where: { id },
      data: {
        distance: distance != null ? parseFloat(distance) : undefined,
        duration: duration != null ? parseInt(duration) : undefined,
        date: date ? new Date(date) : undefined,
        notes: notes != null ? notes : undefined,
      },
    })

    return res.json({
      run: {
        id: run.id,
        distance: run.distance,
        duration: run.duration,
        date: run.date,
        notes: run.notes,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mengubah sesi lari' })
  }
}

async function deleteRun(req, res) {
  try {
    const id = parseInt(req.params.id)

    const existing = await prisma.runSession.findFirst({
      where: { id, userId: req.user.id },
    })
    if (!existing) {
      return res.status(404).json({ message: 'Sesi lari tidak ditemukan' })
    }

    await prisma.runSession.delete({ where: { id } })

    return res.json({ message: 'Sesi lari berhasil dihapus' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal menghapus sesi lari' })
  }
}

async function getStats(req, res) {
  try {
    const runs = await prisma.runSession.findMany({
      where: { userId: req.user.id },
    })

    const totalSessions = runs.length
    const totalKm = runs.reduce((sum, r) => sum + r.distance, 0)
    const totalMinutes = runs.reduce((sum, r) => sum + r.duration, 0)
    const avgPace = totalKm > 0 ? totalMinutes / totalKm : 0

    return res.json({
      totalKm: Math.round(totalKm * 100) / 100,
      avgPace: Math.round(avgPace * 100) / 100,
      totalSessions,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mengambil statistik' })
  }
}

module.exports = { getRuns, createRun, updateRun, deleteRun, getStats }
