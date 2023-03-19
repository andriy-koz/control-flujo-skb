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

    if (!modelResult.rows.length) {
      res.status(404).json({ error: 'Model not found.' })
      return
    }

    const modelId = modelResult.rows[0].id

    const insertResult = await pool.query(
      'INSERT INTO my_schema.production_orders (model_id, target_quantity) VALUES ($1, $2) RETURNING id',
      [modelId, targetQuantity]
    )

    const orderId = insertResult.rows[0].id
    res
      .status(201)
      .json({ message: 'Production started successfully.', orderId })
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
      'SELECT m.name AS model, o.target_quantity AS target_quantity FROM my_schema.production_orders o JOIN my_schema.models m ON o.model_id = m.id WHERE o.id = $1',
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
