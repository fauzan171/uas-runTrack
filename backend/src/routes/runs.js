const express = require('express')
const router = express.Router()

const { authenticate } = require('../middlewares/auth')
const { getRuns, createRun, updateRun, deleteRun, getStats } = require('../controllers/runController')

router.use(authenticate)

router.get('/stats', getStats)
router.get('/', getRuns)
router.post('/', createRun)
router.put('/:id', updateRun)
router.delete('/:id', deleteRun)

module.exports = router
