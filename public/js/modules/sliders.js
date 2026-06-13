function setupSlider({ rootId, prevId, nextId, dotsId, slideSelector, intervalMs }) {
  const root = document.getElementById(rootId)

  if (!root) {
    return
  }

  const slides = root.querySelectorAll(slideSelector)
  const prev = document.getElementById(prevId)
  const next = document.getElementById(nextId)
  const dotsContainer = document.getElementById(dotsId)
  let current = 0
  let timer = null

  slides.forEach((_, index) => {
    const dot = document.createElement("button")
    dot.type = "button"
    dot.className = `slider-dot ${index === 0 ? "active" : ""}`
    dot.addEventListener("click", () => goTo(index))
    dotsContainer?.appendChild(dot)
  })

  const dots = dotsContainer?.querySelectorAll(".slider-dot") || []

  function goTo(index) {
    slides[current].classList.remove("active")
    dots[current]?.classList.remove("active")
    current = (index + slides.length) % slides.length
    slides[current].classList.add("active")
    dots[current]?.classList.add("active")
  }

  function restart() {
    window.clearInterval(timer)
    timer = window.setInterval(() => goTo(current + 1), intervalMs)
  }

  prev?.addEventListener("click", () => {
    goTo(current - 1)
    restart()
  })

  next?.addEventListener("click", () => {
    goTo(current + 1)
    restart()
  })

  root.addEventListener("mouseenter", () => window.clearInterval(timer))
  root.addEventListener("mouseleave", restart)
  restart()
}

export function initSliders() {
  setupSlider({
    rootId: "heroSlider",
    prevId: "heroPrev",
    nextId: "heroNext",
    dotsId: "heroDots",
    slideSelector: ".hero-slide",
    intervalMs: 5000,
  })

  setupSlider({
    rootId: "testimonialsSlider",
    prevId: "testimonialsPrev",
    nextId: "testimonialsNext",
    dotsId: "testimonialsDots",
    slideSelector: ".testimonial-slide",
    intervalMs: 6000,
  })
}
