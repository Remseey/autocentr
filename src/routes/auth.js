const express = require("express")
const { body } = require("express-validator")
const authController = require("../controllers/authController")
const { handleValidation } = require("../middleware/validation")

const router = express.Router()

router.get("/login", authController.renderLogin)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Укажите корректный email."),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов."),
  ],
  handleValidation("pages/auth/login"),
  authController.login
)

router.get("/register", authController.renderRegister)
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Имя должно содержать минимум 2 символа."),
    body("email").isEmail().withMessage("Укажите корректный email."),
    body("phone").optional({ values: "falsy" }).isLength({ min: 10 }).withMessage("Укажите корректный телефон."),
    body("password").isLength({ min: 6 }).withMessage("Пароль должен содержать минимум 6 символов."),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Подтверждение пароля не совпадает."),
  ],
  handleValidation("pages/auth/register"),
  authController.register
)

router.post("/logout", authController.logout)

module.exports = router
