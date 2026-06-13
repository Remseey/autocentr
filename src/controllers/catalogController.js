const carModel = require("../models/carModel")
const reviewModel = require("../models/reviewModel")

const servicePackages = [
  { key: "consultation", title: "Консультация эксперта", price: 0 },
  { key: "registration", title: "Постановка на учет и страховка", price: 120000 },
  { key: "extended_warranty", title: "Расширенная гарантия", price: 190000 },
  { key: "delivery", title: "Доставка по РФ", price: 60000 },
]

async function list(req, res, next) {
  try {
    const data = await carModel.getCatalogData({
      search: req.query.search || "",
      brand: req.query.brand || "",
      bodyType: req.query.bodyType || "",
      transmission: req.query.transmission || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page || 1),
    })

    res.render("pages/catalog", {
      title: "Каталог | PRIMECAR",
      cars: data.rows,
      filterOptions: data.filters,
      pagination: data.pagination,
      totalCount: data.totalCount,
    })
  } catch (error) {
    next(error)
  }
}

async function detail(req, res, next) {
  try {
    const car = await carModel.findBySlug(req.params.slug)

    if (!car) {
      return res.status(404).render("pages/404", { title: "Не найдено | PRIMECAR" })
    }

    const reviews = await reviewModel.listByCarId(car.id)

    res.render("pages/car-detail", {
      title: `${car.brand} ${car.model} | PRIMECAR`,
      car,
      reviews,
      servicePackages,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  list,
  detail,
  servicePackages,
}
