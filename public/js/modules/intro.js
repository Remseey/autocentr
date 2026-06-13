export function initIntro() {
  const intro = document.getElementById("siteIntro")

  if (!intro) {
    return
  }

  const skipIntro = sessionStorage.getItem("primecar-intro-seen")

  if (skipIntro) {
    intro.remove()
    return
  }

  document.body.classList.add("intro-lock")
  window.setTimeout(() => {
    intro.classList.add("is-hidden")
    document.body.classList.remove("intro-lock")
    sessionStorage.setItem("primecar-intro-seen", "1")
    window.setTimeout(() => intro.remove(), 800)
  }, 1600)
}
