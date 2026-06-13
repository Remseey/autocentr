const burger = document.getElementById("burger")
const nav = document.getElementById("nav")

if (burger) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active")
    nav.classList.toggle("active")
  })

  const navLinks = nav.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("active")
      nav.classList.remove("active")
    })
  })
}

const heroSlider = document.getElementById("heroSlider")
if (heroSlider) {
  const slides = heroSlider.querySelectorAll(".hero-slide")
  const prevBtn = document.getElementById("heroPrev")
  const nextBtn = document.getElementById("heroNext")
  const dotsContainer = document.getElementById("heroDots")
  let currentSlide = 0
  let slideInterval

  slides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.classList.add("slider-dot")
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(index))
    dotsContainer.appendChild(dot)
  })

  const dots = dotsContainer.querySelectorAll(".slider-dot")

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active")
    dots[currentSlide].classList.remove("active")
    currentSlide = (n + slides.length) % slides.length
    slides[currentSlide].classList.add("active")
    dots[currentSlide].classList.add("active")
  }

  function nextSlide() {
    goToSlide(currentSlide + 1)
  }

  function prevSlide() {
    goToSlide(currentSlide - 1)
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000)
  }

  function stopSlideShow() {
    clearInterval(slideInterval)
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide()
      stopSlideShow()
      startSlideShow()
    })

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide()
      stopSlideShow()
      startSlideShow()
    })

  startSlideShow()

  heroSlider.addEventListener("mouseenter", stopSlideShow)
  heroSlider.addEventListener("mouseleave", startSlideShow)
}

const testimonialsSlider = document.getElementById("testimonialsSlider")
if (testimonialsSlider) {
  const slides = testimonialsSlider.querySelectorAll(".testimonial-slide")
  const prevBtn = document.getElementById("testimonialsPrev")
  const nextBtn = document.getElementById("testimonialsNext")
  const dotsContainer = document.getElementById("testimonialsDots")
  let currentSlide = 0
  let slideInterval

  slides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.classList.add("slider-dot")
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(index))
    dotsContainer.appendChild(dot)
  })

  const dots = dotsContainer.querySelectorAll(".slider-dot")

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active")
    dots[currentSlide].classList.remove("active")
    currentSlide = (n + slides.length) % slides.length
    slides[currentSlide].classList.add("active")
    dots[currentSlide].classList.add("active")
  }

  function nextSlide() {
    goToSlide(currentSlide + 1)
  }

  function prevSlide() {
    goToSlide(currentSlide - 1)
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 6000)
  }

  function stopSlideShow() {
    clearInterval(slideInterval)
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevSlide()
      stopSlideShow()
      startSlideShow()
    })

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextSlide()
      stopSlideShow()
      startSlideShow()
    })

  startSlideShow()

  testimonialsSlider.addEventListener("mouseenter", stopSlideShow)
  testimonialsSlider.addEventListener("mouseleave", startSlideShow)
}

const forms = document.querySelectorAll("form")
forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    alert("Спасибо за обращение! Мы свяжемся с вами в ближайшее время.")
    form.reset()
  })
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".car-card, .advantage-card, .service-card")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
