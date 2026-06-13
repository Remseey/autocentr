function buildPagination(totalItems, currentPage, perPage) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)

  return {
    totalItems,
    currentPage: safePage,
    perPage,
    totalPages,
    offset: (safePage - 1) * perPage,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  }
}

module.exports = {
  buildPagination,
}
