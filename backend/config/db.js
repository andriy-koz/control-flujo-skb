const { Pool } = require('pg')

const pool = new Pool({
  user: 'andriy',
  host: 'localhost',
  database: 'production_flow',
  password: 'andriy123',
  port: 5432,
})

module.exports = pool
