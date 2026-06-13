const carModel = require("../models/carModel")
const orderModel = require("../models/orderModel")
const { servicePackages } = require("./catalogController")
const { setFlash } = require("../utils/flash")

async function create(req, res, next) {
  try {
    const car = await carModel.findBySlug(req.params.slug)

    if (!car) {
      setFlash(req, "error", "Автомобиль не найден.")
      return res.redirect("/catalog")
    }

    const selectedService = servicePackages.find((item) => item.key === req.body.servicePackage) || servicePackages[0]
    const totalAmount = Number(car.price) + Number(selectedService.price)

    await orderModel.createOrder({
      userId: req.session.user.id,
      carId: car.id,
      servicePackage: selectedService.title,
      totalAmount,
      comment: req.body.comment,
      contactPhone: req.body.contactPhone,
    })

    setFlash(req, "success", `Заявка создана. Расчётная стоимость: ${totalAmount.toLocaleString("ru-RU")} ₽.`)
    res.redirect("/account")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
}
