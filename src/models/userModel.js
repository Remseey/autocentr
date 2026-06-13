const db = require("../config/db")
const { buildPagination } = require("../utils/pagination")

async function createUser({ name, email, phone, passwordHash, role = "user" }) {
  const result = await db.query(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone || null, passwordHash, role]
  )

  return result.insertId
}

async function findByEmail(email) {
  const rows = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email])
  return rows[0] || null
}

async function findById(id) {
  const rows = await db.query(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  )
  return rows[0] || null
}

async function listAdmin({ search = "", sort = "newest", page = 1, perPage = 10 }) {
  const where = []
  const params = []

  if (search) {
    where.push("(name LIKE ? OR email LIKE ? OR role LIKE ?)")
    const term = `%${search}%`
    params.push(term, term, term)
  }

  const allowedSort = {
    newest: "u.created_at DESC",
    oldest: "u.created_at ASC",
    name: "u.name ASC",
    email: "u.email ASC",
    role: "u.role ASC",
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const countRows = await db.query(`SELECT COUNT(*) AS total FROM users u ${whereClause}`, params)
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const rows = await db.query(
    `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
            COUNT(o.id) AS orders_count
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY ${allowedSort[sort] || allowedSort.newest}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  return { rows, pagination }
}

async function updateRole(id, role) {
  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id])
}

async function deleteUser(id) {
  await db.query("DELETE FROM users WHERE id = ?", [id])
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM users")
  return rows[0].total
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  listAdmin,
  updateRole,
  deleteUser,
  countAll,
}
