const express = require('express')
const jwt = require('jwt-simple')
const router = express.Router()
const secret = 'your-secret-key'

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username === 'skb' && password === 'skb2023') {
    const token = jwt.encode({ username }, secret)
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }
})

module.exports = router
