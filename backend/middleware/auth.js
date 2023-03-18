const jwt = require('jwt-simple')
const secret = 'your-secret-key'

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(403).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.decode(token, secret)

    if (decoded.username !== 'skb') {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware
