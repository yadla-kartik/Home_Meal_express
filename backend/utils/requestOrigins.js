const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const getAllowedOrigins = () => {
  const configured = parseOrigins(process.env.CLIENT_ORIGIN)
  if (configured.length) {
    return configured
  }

  return ['http://localhost:5173']
}

const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) return true
  return allowedOrigins.includes(origin)
}

module.exports = {
  getAllowedOrigins,
  isOriginAllowed,
}
