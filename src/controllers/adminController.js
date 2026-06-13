const carModel = require("../models/carModel")
const serviceModel = require("../models/serviceModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const feedbackModel = require("../models/feedbackModel")
const reviewModel = require("../models/reviewModel")
const homeController = require("./homeController")
const { setFlash } = require("../utils/flash")

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
}

async function dashboard(req, res, next) {
  try {
    const stats = await homeController.dashboardStats()
    res.render("pages/admin/dashboard", {
      title: "Админ-панель | PRIMECAR",
      stats,
    })
  } catch (error) {
    next(error)
  }
}

async function cars(req, res, next) {
  try {
    const result = await carModel.getAdminList({
      search: req.query.search || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page || 1),
    })

    res.render("pages/admin/cars", {
      title: "Управление автомобилями | PRIMECAR",
      cars: result.rows,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

async function newCarForm(req, res) {
  res.render("pages/admin/car-form", {
    title: "Добавление автомобиля | PRIMECAR",
    car: null,
    errors: [],
  })
}

async function editCarForm(req, res, next) {
  try {
    const car = await carModel.findById(req.params.id)
    if (!car) {
      setFlash(req, "error", "Запись не найдена.")
      return res.redirect("/admin/cars")
    }

    res.render("pages/admin/car-form", {
      title: "Редактирование автомобиля | PRIMECAR",
      car,
      errors: [],
    })
  } catch (error) {
    next(error)
  }
}

async function saveCar(req, res, next) {
  try {
    const payload = {
      brand: req.body.brand,
      model: req.body.model,
      slug: req.body.slug || slugify(`${req.body.brand}-${req.body.model}`),
      year: req.body.year,
      mileage: req.body.mileage,
      engine: req.body.engine,
      body_type: req.body.body_type,
      transmission: req.body.transmission,
      price: req.body.price,
      description: req.body.description,
      image_url: req.body.image_url,
      status: req.body.status,
      featured: req.body.featured === "1",
    }

    if (req.params.id) {
      await carModel.updateCar(req.params.id, payload)
      setFlash(req, "success", "Автомобиль обновлён.")
    } else {
      await carModel.createCar(payload)
      setFlash(req, "success", "Автомобиль добавлен.")
    }

    res.redirect("/admin/cars")
  } catch (error) {
    next(error)
  }
}

async function removeCar(req, res, next) {
  try {
    await carModel.deleteCar(req.params.id)
    setFlash(req, "success", "Автомобиль удалён.")
    res.redirect("/admin/cars")
  } catch (error) {
    next(error)
  }
}

async function services(req, res, next) {
  try {
    const result = await serviceModel.getAdminList({
      search: req.query.search || "",
      sort: req.query.sort || "sort_order",
      page: Number(req.query.page || 1),
    })

    res.render("pages/admin/services", {
      title: "Управление услугами | PRIMECAR",
      services: result.rows,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

async function newServiceForm(req, res) {
  res.render("pages/admin/service-form", {
    title: "Добавление услуги | PRIMECAR",
    service: null,
    errors: [],
  })
}

async function editServiceForm(req, res, next) {
  try {
    const service = await serviceModel.findById(req.params.id)
    if (!service) {
      setFlash(req, "error", "Запись не найдена.")
      return res.redirect("/admin/services")
    }

    res.render("pages/admin/service-form", {
      title: "Редактирование услуги | PRIMECAR",
      service,
      errors: [],
    })
  } catch (error) {
    next(error)
  }
}

async function saveService(req, res, next) {
  try {
    const payload = {
      title: req.body.title,
      short_description: req.body.short_description,
      feature_list: req.body.feature_list,
      base_price: req.body.base_price,
      badge: req.body.badge,
      sort_order: req.body.sort_order,
    }

    if (req.params.id) {
      await serviceModel.updateService(req.params.id, payload)
      setFlash(req, "success", "Услуга обновлена.")
    } else {
      await serviceModel.createService(payload)
      setFlash(req, "success", "Услуга добавлена.")
    }

    res.redirect("/admin/services")
  } catch (error) {
    next(error)
  }
}

async function removeService(req, res, next) {
  try {
    await serviceModel.deleteService(req.params.id)
    setFlash(req, "success", "Услуга удалена.")
    res.redirect("/admin/services")
  } catch (error) {
    next(error)
  }
}

async function users(req, res, next) {
  try {
    const result = await userModel.listAdmin({
      search: req.query.search || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page || 1),
    })

    res.render("pages/admin/users", {
      title: "Управление пользователями | PRIMECAR",
      users: result.rows,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

async function updateUserRole(req, res, next) {
  try {
    await userModel.updateRole(req.params.id, req.body.role)
    setFlash(req, "success", "Роль пользователя обновлена.")
    res.redirect("/admin/users")
  } catch (error) {
    next(error)
  }
}

async function removeUser(req, res, next) {
  try {
    await userModel.deleteUser(req.params.id)
    setFlash(req, "success", "Пользователь удалён.")
    res.redirect("/admin/users")
  } catch (error) {
    next(error)
  }
}

async function orders(req, res, next) {
  try {
    const result = await orderModel.getAdminList({
      search: req.query.search || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page || 1),
    })

    res.render("pages/admin/orders", {
      title: "Управление заявками | PRIMECAR",
      orders: result.rows,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    await orderModel.updateStatus(req.params.id, req.body.status)
    setFlash(req, "success", "Статус заявки обновлён.")
    res.redirect("/admin/orders")
  } catch (error) {
    next(error)
  }
}

async function removeOrder(req, res, next) {
  try {
    await orderModel.deleteOrder(req.params.id)
    setFlash(req, "success", "Заявка удалена.")
    res.redirect("/admin/orders")
  } catch (error) {
    next(error)
  }
}

async function feedback(req, res, next) {
  try {
    const result = await feedbackModel.getAdminList({
      search: req.query.search || "",
      sort: req.query.sort || "newest",
      page: Number(req.query.page || 1),
    })

    res.render("pages/admin/feedback", {
      title: "Обратная связь | PRIMECAR",
      feedback: result.rows,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

async function updateFeedbackStatus(req, res, next) {
  try {
    await feedbackModel.updateStatus(req.params.id, req.body.status)
    setFlash(req, "success", "Статус сообщения обновлён.")
    res.redirect("/admin/feedback")
  } catch (error) {
    next(error)
  }
}

async function removeFeedback(req, res, next) {
  try {
    await feedbackModel.deleteFeedback(req.params.id)
    setFlash(req, "success", "Сообщение удалено.")
    res.redirect("/admin/feedback")
  } catch (error) {
    next(error)
  }
}

async function exportJson(req, res, next) {
  try {
    const entityMap = {
      cars: () => carModel.getAdminList({ page: 1, perPage: 500 }),
      users: () => userModel.listAdmin({ page: 1, perPage: 500 }),
      orders: () => orderModel.getAdminList({ page: 1, perPage: 500 }),
      feedback: () => feedbackModel.getAdminList({ page: 1, perPage: 500 }),
      services: () => serviceModel.getAdminList({ page: 1, perPage: 500 }),
      reviews: () => reviewModel.latest(500),
    }

    const loader = entityMap[req.params.entity]

    if (!loader) {
      return res.status(404).json({ error: "Unknown export entity" })
    }

    const data = await loader()
    const payload = Array.isArray(data) ? data : data.rows

    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader("Content-Disposition", `attachment; filename=${req.params.entity}.json`)
    res.send(JSON.stringify(payload, null, 2))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  dashboard,
  cars,
  newCarForm,
  editCarForm,
  saveCar,
  removeCar,
  services,
  newServiceForm,
  editServiceForm,
  saveService,
  removeService,
  users,
  updateUserRole,
  removeUser,
  orders,
  updateOrderStatus,
  removeOrder,
  feedback,
  updateFeedbackStatus,
  removeFeedback,
  exportJson,
}
