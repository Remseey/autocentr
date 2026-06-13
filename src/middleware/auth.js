const { setFlash } = require("../utils/flash")

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    setFlash(req, "error", "Для выполнения действия выполните вход.")
    return res.redirect("/login")
  }

  return next()
}

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    setFlash(req, "error", "Доступ к разделу ограничен.")
    return res.redirect("/")
  }

  return next()
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
}
