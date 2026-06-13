function setFlash(req, type, message) {
  req.session.flash = { type, message }
}

function pullFlash(req) {
  const flash = req.session.flash || null
  delete req.session.flash
  return flash
}

module.exports = {
  setFlash,
  pullFlash,
}
