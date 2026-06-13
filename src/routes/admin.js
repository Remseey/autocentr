const express = require("express")
const { ensureAdmin } = require("../middleware/auth")
const adminController = require("../controllers/adminController")

const router = express.Router()

router.use(ensureAdmin)

router.get("/", adminController.dashboard)

router.get("/cars", adminController.cars)
router.get("/cars/new", adminController.newCarForm)
router.post("/cars/new", adminController.saveCar)
router.get("/cars/:id/edit", adminController.editCarForm)
router.post("/cars/:id/edit", adminController.saveCar)
router.post("/cars/:id/delete", adminController.removeCar)

router.get("/services", adminController.services)
router.get("/services/new", adminController.newServiceForm)
router.post("/services/new", adminController.saveService)
router.get("/services/:id/edit", adminController.editServiceForm)
router.post("/services/:id/edit", adminController.saveService)
router.post("/services/:id/delete", adminController.removeService)

router.get("/users", adminController.users)
router.post("/users/:id/role", adminController.updateUserRole)
router.post("/users/:id/delete", adminController.removeUser)

router.get("/orders", adminController.orders)
router.post("/orders/:id/status", adminController.updateOrderStatus)
router.post("/orders/:id/delete", adminController.removeOrder)

router.get("/feedback", adminController.feedback)
router.post("/feedback/:id/status", adminController.updateFeedbackStatus)
router.post("/feedback/:id/delete", adminController.removeFeedback)

router.get("/export/:entity.json", adminController.exportJson)

module.exports = router
