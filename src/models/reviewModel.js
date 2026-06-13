const db = require("../config/db")

async function listByCarId(carId) {
  return db.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.name
     FROM reviews r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.car_id = ?
     ORDER BY r.created_at DESC`,
    [carId]
  )
}

async function createReview({ carId, userId, rating, comment }) {
  const result = await db.query(
    `INSERT INTO reviews (car_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [carId, userId, rating, comment]
  )
  return result.insertId
}

async function latest(limit = 4) {
  return db.query(
    `SELECT r.rating, r.comment, r.created_at, u.name, c.brand, c.model
     FROM reviews r
     INNER JOIN users u ON u.id = r.user_id
     INNER JOIN cars c ON c.id = r.car_id
     ORDER BY r.created_at DESC
     LIMIT ?`,
    [limit]
  )
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM reviews")
  return rows[0].total
}

module.exports = {
  listByCarId,
  createReview,
  latest,
  countAll,
}
