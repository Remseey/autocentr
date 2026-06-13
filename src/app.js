const path = require("path")
const express = require("express")
const session = require("express-session")
const routes = require("./routes/web")
const env = require("./config/env")
const { applyLocals } = require("./middleware/locals")

function createApp() {
  const app = express()

  app.set("view engine", "ejs")
  app.set("views", path.join(process.cwd(), "views"))

  app.use("/static", express.static(path.join(process.cwd(), "public")))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(
    session({
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  )
  app.use(applyLocals)
  app.use(routes)

  app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).render("pages/500", {
      title: "Ошибка сервера | PRIMECAR",
      error,
    })
  })

  return app
}

module.exports = {
  createApp,
}
