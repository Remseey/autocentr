const mysql = require("mysql2/promise")
const env = require("./env")

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: false,
})

async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}

module.exports = {
  pool,
  query,
}
