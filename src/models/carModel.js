const db = require("../config/db")
const { buildPagination } = require("../utils/pagination")

const ratingJoin = `
  LEFT JOIN (
    SELECT car_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS review_count
    FROM reviews
    GROUP BY car_id
  ) review_stats ON review_stats.car_id = c.id
`

function buildCatalogWhere(filters, params) {
  const where = ["c.status = 'active'"]

  if (filters.search) {
    where.push("(c.brand LIKE ? OR c.model LIKE ? OR c.description LIKE ? OR c.engine LIKE ?)")
    const term = `%${filters.search}%`
    params.push(term, term, term, term)
  }

  if (filters.brand) {
    where.push("c.brand = ?")
    params.push(filters.brand)
  }

  if (filters.bodyType) {
    where.push("c.body_type = ?")
    params.push(filters.bodyType)
  }

  if (filters.transmission) {
    where.push("c.transmission = ?")
    params.push(filters.transmission)
  }

  return where
}

async function getFeatured(limit = 3) {
  return db.query(
    `SELECT c.*, COALESCE(review_stats.avg_rating, 0) AS avg_rating,
            COALESCE(review_stats.review_count, 0) AS review_count
     FROM cars c
     ${ratingJoin}
     WHERE c.featured = 1 AND c.status = 'active'
     ORDER BY c.created_at DESC
     LIMIT ?`,
    [limit]
  )
}

async function getCatalogData({ search = "", brand = "", bodyType = "", transmission = "", sort = "newest", page = 1, perPage = 6 }) {
  const params = []
  const where = buildCatalogWhere({ search, brand, bodyType, transmission }, params)
  const whereClause = `WHERE ${where.join(" AND ")}`

  const countRows = await db.query(`SELECT COUNT(*) AS total FROM cars c ${whereClause}`, params)
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const sortMap = {
    newest: "c.created_at DESC",
    price_asc: "c.price ASC",
    price_desc: "c.price DESC",
    year_desc: "c.year DESC",
    mileage_asc: "c.mileage ASC",
    rating_desc: "COALESCE(review_stats.avg_rating, 0) DESC, COALESCE(review_stats.review_count, 0) DESC",
    name_asc: "c.brand ASC, c.model ASC",
  }

  const rows = await db.query(
    `SELECT c.*, COALESCE(review_stats.avg_rating, 0) AS avg_rating,
            COALESCE(review_stats.review_count, 0) AS review_count
     FROM cars c
     ${ratingJoin}
     ${whereClause}
     ORDER BY ${sortMap[sort] || sortMap.newest}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  const filterRows = await db.query(
    `SELECT DISTINCT brand, body_type, transmission
     FROM cars
     WHERE status = 'active'
     ORDER BY brand, body_type, transmission`
  )

  return {
    rows,
    pagination,
    filters: {
      brands: [...new Set(filterRows.map((item) => item.brand).filter(Boolean))],
      bodyTypes: [...new Set(filterRows.map((item) => item.body_type).filter(Boolean))],
      transmissions: [...new Set(filterRows.map((item) => item.transmission).filter(Boolean))],
    },
    totalCount: countRows[0].total,
  }
}

async function findBySlug(slug) {
  const rows = await db.query(
    `SELECT c.*, COALESCE(review_stats.avg_rating, 0) AS avg_rating,
            COALESCE(review_stats.review_count, 0) AS review_count
     FROM cars c
     ${ratingJoin}
     WHERE c.slug = ?
     LIMIT 1`,
    [slug]
  )
  return rows[0] || null
}

async function getAdminList({ search = "", sort = "newest", page = 1, perPage = 10 }) {
  const where = []
  const params = []

  if (search) {
    where.push("(c.brand LIKE ? OR c.model LIKE ? OR c.status LIKE ?)")
    const term = `%${search}%`
    params.push(term, term, term)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const countRows = await db.query(`SELECT COUNT(*) AS total FROM cars c ${whereClause}`, params)
  const pagination = buildPagination(countRows[0].total, Number(page || 1), perPage)

  const sortMap = {
    newest: "c.created_at DESC",
    price_desc: "c.price DESC",
    price_asc: "c.price ASC",
    year_desc: "c.year DESC",
    brand: "c.brand ASC, c.model ASC",
    status: "c.status ASC",
  }

  const rows = await db.query(
    `SELECT c.*, COALESCE(review_stats.avg_rating, 0) AS avg_rating,
            COALESCE(review_stats.review_count, 0) AS review_count
     FROM cars c
     ${ratingJoin}
     ${whereClause}
     ORDER BY ${sortMap[sort] || sortMap.newest}
     LIMIT ? OFFSET ?`,
    [...params, pagination.perPage, pagination.offset]
  )

  return { rows, pagination }
}

async function findById(id) {
  const rows = await db.query("SELECT * FROM cars WHERE id = ? LIMIT 1", [id])
  return rows[0] || null
}

async function createCar(payload) {
  const result = await db.query(
    `INSERT INTO cars (
      brand, model, slug, year, mileage, engine, body_type, transmission,
      price, description, image_url, status, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.brand,
      payload.model,
      payload.slug,
      payload.year,
      payload.mileage,
      payload.engine,
      payload.body_type,
      payload.transmission,
      payload.price,
      payload.description,
      payload.image_url,
      payload.status,
      payload.featured ? 1 : 0,
    ]
  )

  return result.insertId
}

async function updateCar(id, payload) {
  await db.query(
    `UPDATE cars SET
      brand = ?, model = ?, slug = ?, year = ?, mileage = ?, engine = ?,
      body_type = ?, transmission = ?, price = ?, description = ?,
      image_url = ?, status = ?, featured = ?
     WHERE id = ?`,
    [
      payload.brand,
      payload.model,
      payload.slug,
      payload.year,
      payload.mileage,
      payload.engine,
      payload.body_type,
      payload.transmission,
      payload.price,
      payload.description,
      payload.image_url,
      payload.status,
      payload.featured ? 1 : 0,
      id,
    ]
  )
}

async function deleteCar(id) {
  await db.query("DELETE FROM cars WHERE id = ?", [id])
}

async function countAll() {
  const rows = await db.query("SELECT COUNT(*) AS total FROM cars")
  return rows[0].total
}

module.exports = {
  getFeatured,
  getCatalogData,
  findBySlug,
  getAdminList,
  findById,
  createCar,
  updateCar,
  deleteCar,
  countAll,
}
