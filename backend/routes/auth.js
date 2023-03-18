const express = require('express')
const jwt = require('jwt-simple')
const router = express.Router()
const secret = 'your-secret-key'

// Usuarios y contraseñas predefinidos
const users = [
  {
    username: 'skb',
    password: 'skb2023',
    role: 'SKB User',
  },
  {
    username: 'mecanizado',
    password: 'mecanizado2023',
    role: 'Mecanizado User',
  },
  {
    username: 'soldadura',
    password: 'soldadura2023',
    role: 'Soldadura User',
  },
  {
    username: 'esmalteria',
    password: 'esmalteria2023',
    role: 'Esmalteria User',
  },
  {
    username: 'montaje',
    password: 'montaje2023',
    role: 'Montaje User',
  },
]

router.post('/login', (req, res) => {
  const { username, password } = req.body

  // Encuentra el usuario que coincida con el nombre de usuario y la contraseña proporcionados
  const user = users.find(
    user => user.username === username && user.password === password
  )

  if (user) {
    const token = jwt.encode(
      { username: user.username, role: user.role },
      secret
    )
    res.json({ token, role: user.role })
  } else {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
  }
})

module.exports = router
