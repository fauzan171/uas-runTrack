const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const runRoutes = require('./routes/runs')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'RunTrack API jalan' })
})

app.use('/api/auth', authRoutes)
app.use('/api/runs', runRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan server' })
})

module.exports = app
