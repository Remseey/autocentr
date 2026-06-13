export function initNavigation() {
  const burger = document.getElementById("burger")
  const nav = document.getElementById("nav")

  if (!burger || !nav) {
    return
  }

  burger.addEventListener("click", () => {
    burger.classList.toggle("active")
    nav.classList.toggle("active")
  })

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active")
      nav.classList.remove("active")
    })
  })
}
