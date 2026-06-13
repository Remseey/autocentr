const carModel = require("../models/carModel")
const reviewModel = require("../models/reviewModel")
const { setFlash } = require("../utils/flash")

async function create(req, res, next) {
  try {
    const car = await carModel.findBySlug(req.params.slug)

    if (!car) {
      setFlash(req, "error", "Автомобиль не найден.")
      return res.redirect("/catalog")
    }

    await reviewModel.createReview({
      carId: car.id,
      userId: req.session.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    })

    setFlash(req, "success", "Отзыв сохранён.")
    res.redirect(`/catalog/${car.slug}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
}
