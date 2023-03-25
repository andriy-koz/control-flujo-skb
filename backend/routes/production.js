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

    // Comprueba si se encontró un registro con el nombre proporcionado
    if (stageResult.rows.length === 0) {
      res.status(404).json({ error: `No stage found with the name: ${stage}` })
      return
    }

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
    res.status(500).json({
      error: `An error occurred while updating production progress: ${err.message}`,
    })
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

router.get('/latest-order', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM my_schema.production_orders ORDER BY id DESC LIMIT 1'
    )

    res.status(200).json({ orderId: result.rows[0].id })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the latest order ID.' })
  }
})

router.get('/sum-progress/:stage', async (req, res) => {
  const { stage } = req.params

  try {
    const stageResult = await pool.query(
      'SELECT id FROM my_schema.production_stages WHERE name = $1',
      [stage]
    )
    const stageId = stageResult.rows[0].id

    const latestOrder = await pool.query(
      'SELECT id FROM my_schema.production_orders ORDER BY id DESC LIMIT 1'
    )

    const latestOrderId = latestOrder.rows[0].id

    const sumResult = await pool.query(
      'SELECT SUM(quantity) as sum FROM my_schema.production_progress WHERE production_stage_id = $1 AND production_order_id = $2',
      [stageId, latestOrderId]
    )
    res.status(200).json(sumResult.rows[0].sum)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching sum of progress.' })
  }
})

router.get('/get-orders', async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT po.id AS order_id, m.name AS model_name, po.target_quantity AS order_quantity, COALESCE(SUM(pp.quantity), 0) AS production_progress FROM my_schema.production_orders po JOIN my_schema.models m ON po.model_id = m.id LEFT JOIN my_schema.production_progress pp ON po.id = pp.production_order_id GROUP BY po.id, m.name, po.target_quantity ORDER BY po.id DESC;'
    )
    res.status(200).json({ orders: ordersResult.rows })
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching production progress.' })
  }
})

router.get('/get-sum-of-every-sector', async (req, res) => {
  try {
    const result = await pool.query(
      'WITH latest_order AS (SELECT MAX(po.created_at) AS latest_created_at FROM my_schema.production_orders po), joined_order AS (SELECT pp.production_stage_id, ps.name AS stage, pp.quantity AS quantity FROM latest_order lo JOIN my_schema.production_orders po ON lo.latest_created_at = po.created_at JOIN my_schema.production_progress pp ON pp.production_order_id = po.id JOIN my_schema.production_stages ps ON ps.id = pp.production_stage_id) SELECT stage, SUM(quantity) as total_equipment FROM joined_order GROUP BY stage;'
    )
    res.status(200).json({ result: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'An error occurred while fetching the sum of every sector.',
    })
  }
})

module.exports = router
