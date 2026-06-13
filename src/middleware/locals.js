const { pullFlash } = require("../utils/flash")
const { buildQuery, formatCurrency, formatNumber } = require("../utils/formatters")

function applyLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null
  res.locals.flash = pullFlash(req)
  res.locals.currentPath = req.path
  res.locals.query = req.query
  res.locals.helpers = {
    formatCurrency,
    formatNumber,
    buildQuery,
  }
  next()
}

module.exports = {
  applyLocals,
}
