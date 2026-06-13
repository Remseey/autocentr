const carModel = require("../models/carModel")
const serviceModel = require("../models/serviceModel")
const reviewModel = require("../models/reviewModel")
const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")

async function home(req, res, next) {
  try {
    const [featuredCars, services, reviewCount, carCount, orderCount] = await Promise.all([
      carModel.getFeatured(3),
      serviceModel.listAll(),
      reviewModel.countAll(),
      carModel.countAll(),
      orderModel.countAll(),
    ])

    const heroSlides = featuredCars.map((car, index) => ({
      ...car,
      eyebrow: index === 0 ? "Спецпредложение" : index === 1 ? "Личный подбор" : "Премиальный сервис",
      headline:
        index === 0
          ? `${car.brand} ${car.model} для тех, кто ценит статус и точность`
          : index === 1
            ? "Подбор, сопровождение и покупка автомобиля в одном пространстве"
            : "PRIMECAR делает покупку автомобиля спокойной и понятной",
      text:
        index === 0
          ? "Откройте одну из лучших позиций каталога и сразу переходите к заявке или отзыву."
          : index === 1
            ? "Выберите подходящую модель, сравните предложения и получите сопровождение на каждом этапе сделки."
            : "От первого обращения до выдачи автомобиля вся работа выстроена вокруг комфорта клиента.",
      primaryHref: index === 0 ? `/catalog/${car.slug}` : index === 1 ? "/catalog" : "/services",
      primaryLabel: index === 0 ? "Открыть авто" : index === 1 ? "Перейти в каталог" : "Посмотреть услуги",
    }))

    res.render("pages/home", {
      title: "PRIMECAR",
      featuredCars: heroSlides,
      services: services.slice(0, 3),
      stats: { reviewCount, carCount, orderCount },
    })
  } catch (error) {
    next(error)
  }
}

async function services(req, res, next) {
  try {
    const [servicesList, testimonials] = await Promise.all([
      serviceModel.listAll(),
      reviewModel.latest(4),
    ])

    res.render("pages/services", {
      title: "Услуги | PRIMECAR",
      services: servicesList,
      testimonials,
    })
  } catch (error) {
    next(error)
  }
}

async function search(req, res) {
  const params = new URLSearchParams()

  if (req.query.q) {
    params.set("search", req.query.q)
  }

  return res.redirect(`/catalog?${params.toString()}`)
}

async function dashboardStats() {
  const [users, cars, services, orders, reviews] = await Promise.all([
    userModel.countAll(),
    carModel.countAll(),
    serviceModel.countAll(),
    orderModel.countAll(),
    reviewModel.countAll(),
  ])

  return { users, cars, services, orders, reviews }
}

module.exports = {
  home,
  services,
  search,
  dashboardStats,
}
