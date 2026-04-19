const parseBool = (value) => String(value || '').toLowerCase() === 'true'

const isProduction = process.env.NODE_ENV === 'production'
const forceSecureCookies = parseBool(process.env.COOKIE_SECURE)
const secure = isProduction || forceSecureCookies
const sameSite = secure ? 'none' : 'lax'

const buildAuthCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure,
  sameSite,
  maxAge,
  path: '/',
})

const buildClearCookieOptions = () => ({
  httpOnly: true,
  secure,
  sameSite,
  path: '/',
})

module.exports = {
  buildAuthCookieOptions,
  buildClearCookieOptions,
}
