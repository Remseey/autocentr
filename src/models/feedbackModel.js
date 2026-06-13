const db = require("../config/db")
const { buildPagination } = require("../utils/pagination")

async function createFeedback({ userId, name, email, phone, topic, message }) {
  const result = await db.query(
    `INSERT INTO feedback_messages (user_id, name, email, phone, topic, message, status)
     VALUES (?, ?, ?, ?, ?, ?, 'new')`,
    [userId || null, name, email, phone || null, topic, message]
  )
  return result.insertId
}

async function getAdminList({ search = "", sort = "newest", page = 1, perPage = 10 }) {
  const where = []
  const params = []

  if (search) {
    where.push("(name LIKE ? OR email LIKE ? OR topic LIKE ? OR status LIKE ?)")
    const term = `%${search}%`
    params.push(term, term, term, term)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const countRows = await db.query(`SELECT COUNT(*) AS total FROM feedback_messages ${whereClause}`, params)
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const sortMap = {
    newest: "created_at DESC",
    oldest: "created_at ASC",
    status: "status ASC",
    topic: "topic ASC",
  }

  const rows = await db.query(
    `SELECT * FROM feedback_messages
     ${whereClause}
     ORDER BY ${sortMap[sort] || sortMap.newest}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  return { rows, pagination }
}

async function updateStatus(id, status) {
  await db.query("UPDATE feedback_messages SET status = ? WHERE id = ?", [status, id])
}

async function deleteFeedback(id) {
  await db.query("DELETE FROM feedback_messages WHERE id = ?", [id])
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM feedback_messages")
  return rows[0].total
}

async function exportAll() {
  return db.query("SELECT * FROM feedback_messages ORDER BY created_at DESC")
}

module.exports = {
  createFeedback,
  getAdminList,
  updateStatus,
  deleteFeedback,
  countAll,
  exportAll,
}
