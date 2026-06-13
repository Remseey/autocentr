const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { hashPassword, verifyPassword } = require("../utils/password")
const { setFlash } = require("../utils/flash")

function renderLogin(req, res) {
  res.render("pages/auth/login", {
    title: "Вход | PRIMECAR",
    errors: [],
    formData: {},
  })
}

function renderRegister(req, res) {
  res.render("pages/auth/register", {
    title: "Регистрация | PRIMECAR",
    errors: [],
    formData: {},
  })
}

async function register(req, res, next) {
  try {
    const existingUser = await userModel.findByEmail(req.body.email)

    if (existingUser) {
      return res.status(422).render("pages/auth/register", {
        title: "Регистрация | PRIMECAR",
        errors: [{ msg: "Пользователь с таким email уже существует." }],
        formData: req.body,
      })
    }

    const userId = await userModel.createUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: hashPassword(req.body.password),
    })

    const user = await userModel.findById(userId)
    req.session.user = user
    setFlash(req, "success", "Регистрация выполнена. Добро пожаловать в PRIMECAR.")
    res.redirect("/account")
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const user = await userModel.findByEmail(req.body.email)

    if (!user || !verifyPassword(req.body.password, user.password_hash)) {
      return res.status(422).render("pages/auth/login", {
        title: "Вход | PRIMECAR",
        errors: [{ msg: "Неверный email или пароль." }],
        formData: req.body,
      })
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    }

    setFlash(req, "success", "Вы авторизованы.")
    res.redirect(user.role === "admin" ? "/admin" : "/account")
  } catch (error) {
    next(error)
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/")
  })
}

async function account(req, res, next) {
  try {
    const orders = await orderModel.listByUserId(req.session.user.id)

    res.render("pages/account/dashboard", {
      title: "Личный кабинет | PRIMECAR",
      orders,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderLogin,
  renderRegister,
  register,
  login,
  logout,
  account,
}
