const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const normalizeOrigin = (value) => {
  const input = String(value || '').trim()
  if (!input) return ''

  try {
    const url = new URL(input)
    return url.origin.toLowerCase()
  } catch {
    return input.replace(/\/+$/, '').toLowerCase()
  }
}

const getAllowedOrigins = () => {
  const configured = parseOrigins(process.env.CLIENT_ORIGIN).map(normalizeOrigin)
  if (configured.length) {
    return configured
  }

  return ['http://localhost:5173']
}

const matchesWildcardOrigin = (origin, allowedPattern) => {
  // Supports patterns like: https://*.vercel.app
  if (!allowedPattern.includes('*')) return false

  const normalizedPattern = normalizeOrigin(allowedPattern)
  const normalizedOrigin = normalizeOrigin(origin)

  const protocolSeparator = normalizedPattern.indexOf('://')
  if (protocolSeparator === -1) return false

  const protocol = normalizedPattern.slice(0, protocolSeparator)
  const hostPattern = normalizedPattern.slice(protocolSeparator + 3)

  if (!hostPattern.startsWith('*.')) return false

  try {
    const parsedOrigin = new URL(normalizedOrigin)
    const originProtocol = parsedOrigin.protocol.replace(':', '').toLowerCase()
    const originHost = parsedOrigin.hostname.toLowerCase()

    if (originProtocol !== protocol) return false

    const expectedSuffix = hostPattern.slice(1).toLowerCase() // ".vercel.app"
    return originHost.endsWith(expectedSuffix)
  } catch {
    return false
  }
}

const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) return true

  const normalizedOrigin = normalizeOrigin(origin)

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === normalizedOrigin) return true
    return matchesWildcardOrigin(normalizedOrigin, allowedOrigin)
  })
}

module.exports = {
  getAllowedOrigins,
  isOriginAllowed,
}
