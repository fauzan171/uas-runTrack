const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const JWT_SECRET = process.env.JWT_SECRET || 'runtrack-secret'

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  })
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' })
    }

    const sudahAda = await prisma.user.findUnique({ where: { email } })
    if (sudahAda) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    })

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal mendaftarkan user' })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const cocok = await bcrypt.compare(password, user.password)
    if (!cocok) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const token = signToken(user)

    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Gagal login' })
  }
}

module.exports = { register, login }
