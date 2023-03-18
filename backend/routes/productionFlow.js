const express = require('express')
const router = express.Router()

router.get('/info', (req, res) => {
  res.json({ message: 'Información del flujo de producción' })
})

router.get('/data', (req, res) => {
  res.json({ message: 'Datos del flujo de producción' })
})

module.exports = router
