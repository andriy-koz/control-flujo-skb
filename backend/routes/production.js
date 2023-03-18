const express = require('express')
const pool = require('../config/db')
const router = express.Router()

router.post('/start-production', async (req, res) => {
  const { model, targetQuantity } = req.body

  try {
    const modelResult = await pool.query(
      'SELECT id FROM my_schema.models WHERE name = $1',
      [model]
    )
    const modelId = modelResult.rows[0].id

    await pool.query(
      'INSERT INTO my_schema.production_orders (model_id, target_quantity) VALUES ($1, $2)',
      [modelId, targetQuantity]
    )

    res.status(201).json({ message: 'Production started successfully.' })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while starting production.' })
  }
})

router.post('/update-progress', async (req, res) => {
  const { orderId, stage, quantity } = req.body

  try {
    const stageResult = await pool.query(
      'SELECT id FROM my_schema.production_stages WHERE name = $1',
      [stage]
    )
    const stageId = stageResult.rows[0].id

    await pool.query(
      'INSERT INTO my_schema.production_progress (production_order_id, production_stage_id, quantity) VALUES ($1, $2, $3)',
      [orderId, stageId, quantity]
    )

    res
      .status(201)
      .json({ message: 'Production progress updated successfully.' })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while updating production progress.' })
  }
})

router.get('/progress/:orderId', async (req, res) => {
  const orderId = req.params.orderId

  try {
    const progressResult = await pool.query(
      'SELECT p.stage, SUM(p.quantity) as quantity FROM my_schema.production_progress p WHERE p.production_order_id = $1 GROUP BY p.stage',
      [orderId]
    )

    res.status(200).json({ progress: progressResult.rows })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching production progress.' })
  }
})

module.exports = router
