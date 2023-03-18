const express = require('express')
const authRoutes = require('./routes/auth')
const productionFlowRoutes = require('./routes/productionFlow')
const authMiddleware = require('./middleware/auth')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/api/auth', authRoutes)

// Asegúrese de que authMiddleware esté siendo utilizado correctamente
app.use('/api/production-flow', authMiddleware, productionFlowRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
