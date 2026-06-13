export function initPriceCalculator() {
  const calculator = document.querySelector("[data-price-calculator]")
  const totalOutput = document.querySelector("[data-total-output]")

  if (!calculator || !totalOutput) {
    return
  }

  const basePrice = Number(calculator.dataset.basePrice || 0)

  const updateTotal = () => {
    const selected = calculator.selectedOptions[0]
    const extraPrice = Number(selected?.dataset.extraPrice || 0)
    totalOutput.textContent = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(basePrice + extraPrice)
  }

  calculator.addEventListener("change", updateTotal)
  updateTotal()
}
