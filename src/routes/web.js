const express = require("express")
const { body } = require("express-validator")
const homeController = require("../controllers/homeController")
const catalogController = require("../controllers/catalogController")
const orderController = require("../controllers/orderController")
const reviewController = require("../controllers/reviewController")
const feedbackController = require("../controllers/feedbackController")
const authController = require("../controllers/authController")
const authRoutes = require("./auth")
const adminRoutes = require("./admin")
const { ensureAuthenticated } = require("../middleware/auth")
const { handleValidation } = require("../middleware/validation")

const router = express.Router()

router.use(authRoutes)

router.get("/", homeController.home)
router.get("/services", homeController.services)
router.get("/search", homeController.search)
router.get("/catalog", catalogController.list)
router.get("/catalog/:slug", catalogController.detail)

router.post(
  "/catalog/:slug/orders",
  ensureAuthenticated,
  [
    body("contactPhone").trim().isLength({ min: 10 }).withMessage("Укажите телефон для связи."),
    body("servicePackage").trim().notEmpty().withMessage("Выберите пакет сопровождения."),
  ],
  handleValidation(),
  orderController.create
)

router.post(
  "/catalog/:slug/reviews",
  ensureAuthenticated,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Оценка должна быть от 1 до 5."),
    body("comment").trim().isLength({ min: 10 }).withMessage("Комментарий должен содержать минимум 10 символов."),
  ],
  handleValidation(),
  reviewController.create
)

router.post(
  "/feedback",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Укажите имя."),
    body("email").isEmail().withMessage("Укажите корректный email."),
    body("topic").trim().isLength({ min: 3 }).withMessage("Укажите тему обращения."),
    body("message").trim().isLength({ min: 10 }).withMessage("Сообщение слишком короткое."),
  ],
  handleValidation(),
  feedbackController.create
)

router.get("/account", ensureAuthenticated, authController.account)
router.use("/admin", adminRoutes)

router.use((req, res) => {
  res.status(404).render("pages/404", { title: "Не найдено | PRIMECAR" })
})

module.exports = router
