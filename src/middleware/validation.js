const { validationResult } = require("express-validator")
const { setFlash } = require("../utils/flash")

function handleValidation(view) {
  return (req, res, next) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
      return next()
    }

    const errors = result.array()

    if (view) {
      return res.status(422).render(view, {
        title: "Ошибка валидации",
        errors,
        formData: req.body,
      })
    }

    setFlash(req, "error", errors[0].msg)
    return res.redirect("back")
  }
}

module.exports = {
  handleValidation,
}
