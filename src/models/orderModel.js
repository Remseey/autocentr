const db = require("../config/db")
const { buildPagination } = require("../utils/pagination")

async function createOrder({ userId, carId, servicePackage, totalAmount, comment, contactPhone }) {
  const result = await db.query(
    `INSERT INTO orders (user_id, car_id, service_package, total_amount, comment, contact_phone, status)
     VALUES (?, ?, ?, ?, ?, ?, 'new')`,
    [userId, carId, servicePackage, totalAmount, comment || null, contactPhone]
  )
  return result.insertId
}

async function listByUserId(userId) {
  return db.query(
    `SELECT o.*, c.brand, c.model, c.slug
     FROM orders o
     INNER JOIN cars c ON c.id = o.car_id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [userId]
  )
}

async function getAdminList({ search = "", sort = "newest", page = 1, perPage = 10 }) {
  const where = []
  const params = []

  if (search) {
    where.push("(u.name LIKE ? OR u.email LIKE ? OR c.brand LIKE ? OR c.model LIKE ? OR o.status LIKE ?)")
    const term = `%${search}%`
    params.push(term, term, term, term, term)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const countRows = await db.query(
    `SELECT COUNT(*) AS total
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     INNER JOIN cars c ON c.id = o.car_id
     ${whereClause}`,
    params
  )
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const sortMap = {
    newest: "o.created_at DESC",
    oldest: "o.created_at ASC",
    amount_desc: "o.total_amount DESC",
    amount_asc: "o.total_amount ASC",
    status: "o.status ASC",
  }

  const rows = await db.query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email, c.brand, c.model
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     INNER JOIN cars c ON c.id = o.car_id
     ${whereClause}
     ORDER BY ${sortMap[sort] || sortMap.newest}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  return { rows, pagination }
}

async function updateStatus(id, status) {
  await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id])
}

async function deleteOrder(id) {
  await db.query("DELETE FROM orders WHERE id = ?", [id])
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM orders")
  return rows[0].total
}

module.exports = {
  createOrder,
  listByUserId,
  getAdminList,
  updateStatus,
  deleteOrder,
  countAll,
}
