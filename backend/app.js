const express = require('express')
const authRoutes = require('./routes/auth')
const productionFlowRoutes = require('./routes/productionFlow')
const productionRoutes = require('./routes/production')
const authMiddleware = require('./middleware/auth')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/production', productionRoutes)

app.use('/api/production-flow', authMiddleware, productionFlowRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
