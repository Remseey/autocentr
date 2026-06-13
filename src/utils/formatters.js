function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value || 0))
}

function buildQuery(base, nextValues = {}) {
  const params = new URLSearchParams()

  Object.entries({ ...base, ...nextValues }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  })

  return params.toString()
}

module.exports = {
  formatCurrency,
  formatNumber,
  buildQuery,
}
