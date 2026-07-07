const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'runtrack-secret'

function authenticate(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = { id: payload.id, email: payload.email }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' })
  }
}

module.exports = { authenticate }
