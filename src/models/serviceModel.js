const db = require("../config/db")
const { buildPagination } = require("../utils/pagination")

async function listAll() {
  return db.query("SELECT * FROM services ORDER BY sort_order ASC, id ASC")
}

async function getAdminList({ search = "", sort = "sort_order", page = 1, perPage = 10 }) {
  const where = []
  const params = []

  if (search) {
    where.push("(title LIKE ? OR short_description LIKE ?)")
    const term = `%${search}%`
    params.push(term, term)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const countRows = await db.query(`SELECT COUNT(*) AS total FROM services ${whereClause}`, params)
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const sortMap = {
    sort_order: "sort_order ASC, id ASC",
    title: "title ASC",
    price_desc: "base_price DESC",
    price_asc: "base_price ASC",
  }

  const rows = await db.query(
    `SELECT * FROM services
     ${whereClause}
     ORDER BY ${sortMap[sort] || sortMap.sort_order}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  return { rows, pagination }
}

async function findById(id) {
  const rows = await db.query("SELECT * FROM services WHERE id = ? LIMIT 1", [id])
  return rows[0] || null
}

async function createService(payload) {
  const result = await db.query(
    `INSERT INTO services (
      title, short_description, feature_list, base_price, badge, sort_order
     ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      payload.short_description,
      payload.feature_list,
      payload.base_price,
      payload.badge,
      payload.sort_order,
    ]
  )
  return result.insertId
}

async function updateService(id, payload) {
  await db.query(
    `UPDATE services SET
      title = ?, short_description = ?, feature_list = ?,
      base_price = ?, badge = ?, sort_order = ?
     WHERE id = ?`,
    [
      payload.title,
      payload.short_description,
      payload.feature_list,
      payload.base_price,
      payload.badge,
      payload.sort_order,
      id,
    ]
  )
}

async function deleteService(id) {
  await db.query("DELETE FROM services WHERE id = ?", [id])
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM services")
  return rows[0].total
}

module.exports = {
  listAll,
  getAdminList,
  findById,
  createService,
  updateService,
  deleteService,
  countAll,
}
