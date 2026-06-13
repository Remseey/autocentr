const feedbackModel = require("../models/feedbackModel")
const { setFlash } = require("../utils/flash")

async function create(req, res, next) {
  try {
    await feedbackModel.createFeedback({
      userId: req.session.user ? req.session.user.id : null,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      topic: req.body.topic,
      message: req.body.message,
    })

    setFlash(req, "success", "Сообщение отправлено. Менеджер свяжется с вами.")
    res.redirect(req.body.redirectTo || "/")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
}
