const crypto = require("crypto")

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || "").split(":")

  if (!salt || !key) {
    return false
  }

  const hashedBuffer = crypto.scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(key, "hex")

  if (storedBuffer.length !== hashedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(storedBuffer, hashedBuffer)
}

module.exports = {
  hashPassword,
  verifyPassword,
}
