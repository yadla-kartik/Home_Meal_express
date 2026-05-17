import api from './api'

const MSG91_SCRIPT_SRC = 'https://verify.msg91.com/otp-provider.js'
const MSG91_WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID || ''
const MSG91_TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH || ''
const MSG91_SESSION_REQ_ID = 'msg91ReqId'
const MSG91_SESSION_IDENTIFIER = 'msg91Identifier'
const MSG91_READY_TIMEOUT_MS = 15000

let widgetLoaderPromise = null
let widgetInitPromise = null
let widgetInitIdentifier = ''
let otpSendInFlight = null

const normalizeMobileNo = (value) => String(value ?? '').replace(/\D/g, '').slice(0, 10)

const getMsg91Identifier = (data) => {
  const country = String(data?.country || '+91').replace(/\D/g, '') || '91'
  const mobileNo = normalizeMobileNo(data?.mobileNo)
  return `${country}${mobileNo}`
}

const extractReqId = (data) =>
  data?.reqId ||
  data?.req_id ||
  data?.requestId ||
  data?.request_id ||
  data?.data?.reqId ||
  data?.data?.requestId ||
  data?.result?.reqId ||
  data?.result?.requestId ||
  null

const loadMsg91Widget = () => {
  if (widgetLoaderPromise) return widgetLoaderPromise

  widgetLoaderPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('MSG91 can only run in the browser.'))
      return
    }

    if (!MSG91_WIDGET_ID || !MSG91_TOKEN_AUTH) {
      reject(new Error('MSG91 widget id or token auth is missing.'))
      return
    }

    if (typeof window.initSendOTP === 'function') {
      resolve()
      return
    }

    const existing = document.querySelector(`script[data-msg91-otp="true"]`)
    if (existing) {
      if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
        resolve()
        return
      }

      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Unable to load MSG91 OTP widget.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = MSG91_SCRIPT_SRC
    script.async = true
    script.dataset.msg91Otp = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load MSG91 OTP widget.'))
    document.head.appendChild(script)
  })

  return widgetLoaderPromise
}

const waitForMsg91Methods = async () => {
  const start = Date.now()

  while (Date.now() - start < MSG91_READY_TIMEOUT_MS) {
    if (
      typeof window !== 'undefined' &&
      typeof window.initSendOTP === 'function' &&
      typeof window.sendOtp === 'function' &&
      typeof window.retryOtp === 'function' &&
      typeof window.verifyOtp === 'function'
    ) {
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  throw new Error('MSG91 OTP widget is still loading. Please try again in a moment.')
}

const initMsg91Widget = async (identifier) => {
  if (widgetInitPromise && widgetInitIdentifier === identifier) {
    return widgetInitPromise
  }

  widgetInitIdentifier = identifier
  widgetInitPromise = (async () => {
    await loadMsg91Widget()

    if (typeof window.initSendOTP !== 'function') {
      throw new Error('MSG91 OTP widget is not available.')
    }

    window.initSendOTP({
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN_AUTH,
      exposeMethods: true,
      success: () => { },
      failure: () => { },
    })

    await waitForMsg91Methods()
  })().catch((error) => {
    widgetInitPromise = null
    throw error
  })

  return widgetInitPromise
}

const callWidgetMethod = (methodName, ...args) =>
  new Promise((resolve, reject) => {
    const fn = window[methodName]
    if (typeof fn !== 'function') {
      reject(new Error(`MSG91 ${methodName} is not ready.`))
      return
    }

    fn(
      ...args,
      (data) => resolve(data),
      (error) => reject(new Error(error?.message || error?.error || error?.reason || 'MSG91 request failed.')),
    )
  })

const callMsg91SendOtp = (identifier) => callWidgetMethod('sendOtp', identifier)

const callMsg91RetryOtp = (reqId) =>
  new Promise((resolve, reject) => {
    const fn = window.retryOtp
    if (typeof fn !== 'function') {
      reject(new Error('MSG91 retryOtp is not ready.'))
      return
    }

    fn(
      null,
      (data) => resolve(data),
      (error) => reject(new Error(error?.message || error?.error || error?.reason || 'MSG91 request failed.'))
    )
  })

const callMsg91VerifyOtp = (otp, reqId) =>
  new Promise((resolve, reject) => {
    const fn = window.verifyOtp
    if (typeof fn !== 'function') {
      console.error('[DEBUG Frontend] window.verifyOtp is not a function!')
      reject(new Error('MSG91 verifyOtp is not ready.'))
      return
    }

    console.log('[DEBUG Frontend] Invoking window.verifyOtp with otp:', otp)
    fn(
      otp,
      (data) => {
        console.log('[DEBUG Frontend] window.verifyOtp Success Callback:', data)
        resolve(data)
      },
      (error) => {
        console.error('[DEBUG Frontend] window.verifyOtp Error Callback:', error)
        reject(new Error(error?.message || error?.error || error?.reason || 'MSG91 verifyOtp internal failure.'))
      }
    )
  })

const extractAccessToken = (data) => {
  if (typeof data === 'string' && data.startsWith('eyJ')) return data
  if (!data || typeof data !== 'object') return null

  const token = data?.accessToken ||
    data?.access_token ||
    data?.token ||
    data?.['access-token'] ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.data?.token ||
    data?.data?.['access-token'] ||
    data?.result?.accessToken ||
    data?.result?.access_token ||
    data?.result?.token ||
    data?.result?.['access-token']

  if (token) return token

  if (typeof data?.message === 'string' && data.message.startsWith('eyJ')) {
    return data.message
  }

  return null
}

export const userLogin = async (data) => {
  try {
    const res = await api.post('/login', data)
    return res.data
  } catch (err) {
    console.log('Error occured in userAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const sendUserOtp = async (data) => {
  try {
    if (otpSendInFlight) {
      return otpSendInFlight
    }

    const identifier = getMsg91Identifier(data)
    const isResend = data?.__mode === 'resend'

    if (!isResend) {
      sessionStorage.removeItem(MSG91_SESSION_REQ_ID)
    }

    otpSendInFlight = (async () => {
      await initMsg91Widget(identifier)

      const response = isResend 
        ? await callMsg91RetryOtp()
        : await callMsg91SendOtp(identifier)

      sessionStorage.setItem(MSG91_SESSION_IDENTIFIER, identifier)

      return {
        success: true,
        message: 'OTP sent successfully.',
        data: response,
      }
    })()

    return await otpSendInFlight
  } catch (err) {
    return { success: false, message: err.message || 'Unable to send OTP.' }
  } finally {
    otpSendInFlight = null
  }
}

export const verifyUserOtp = async (data) => {
  try {
    const identifier = getMsg91Identifier(data)
    const storedIdentifier = sessionStorage.getItem(MSG91_SESSION_IDENTIFIER)
    
    console.log('[DEBUG Frontend] Verify started for identifier:', identifier)
    console.log('[DEBUG Frontend] Stored identifier:', storedIdentifier)
    console.log('[DEBUG Frontend] User input OTP:', data?.otp)

    await initMsg91Widget(identifier)

    console.log('[DEBUG Frontend] Widget Initialized. Calling callMsg91VerifyOtp...')
    const widgetResponse = await callMsg91VerifyOtp(String(data?.otp || ''))
    console.log('[DEBUG Frontend] MSG91 Widget Response RAW:', widgetResponse)

    const accessToken = extractAccessToken(widgetResponse)
    console.log('[DEBUG Frontend] Extracted Access Token:', accessToken)
    
    if (!accessToken) {
      console.warn('[DEBUG Frontend] No access token found in widget response! Throwing invalid code.')
      throw new Error(widgetResponse?.message || widgetResponse?.error || widgetResponse?.reason || 'Invalid code, try again.')
    }

    sessionStorage.removeItem(MSG91_SESSION_IDENTIFIER)

    console.log('[DEBUG Frontend] Sending /login/otp/verify-access-token to Backend...')
    const res = await api.post('/login/otp/verify-access-token', {
      accessToken,
      name: data?.name,
      mobileNo: normalizeMobileNo(data?.mobileNo),
      country: data?.country || '+91',
    }).then((response) => response.data)

    console.log('[DEBUG Frontend] Backend Response:', res)

    return {
      success: true,
      message: res?.message || 'OTP verified successfully.',
      widget: widgetResponse,
      user: res?.user || null,
      token: res?.token || null,
    }
  } catch (err) {
    console.error('[DEBUG Frontend] Caught Error during verification:', err)
    return { success: false, message: err.message || err?.error || err?.reason || 'Unable to verify OTP.' }
  }
}

export const userCookieCheck = async () => {
  try {
    const res = await api.get('/login/me')
    return res.data
  } catch (err) {
    return null
  }
}

export const userLogout = async () => {
  try {
    const res = await api.post('/login/logout')
    return res.data
  } catch (err) {
    console.error('Logout error:', err)
    return { success: false, message: 'Unable to logout' }
  }
}

export const checkPnrDetails = async (pnr) => {
  try {
    const res = await api.post('/login/pnr/check', { pnr })
    return res.data
  } catch (err) {
    console.error('Error fetching PNR details:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching PNR details' }
  }
}

export const getJourneySummary = async (data) => {
  try {
    const res = await api.post('/login/pnr/journey-summary', data)
    return res.data
  } catch (err) {
    console.error('Error fetching journey summary:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching chef service stations.' }
  }
}

export const getStationChefs = async (stationCode, stationName = '') => {
  try {
    const res = await api.get(`/login/stations/${stationCode}/chefs`, {
      params: stationName ? { stationName } : {},
    })
    return res.data
  } catch (err) {
    console.error('Error fetching station chefs:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching station chefs.' }
  }
}

export const getStationChefMenu = async (stationCode, chefId, stationName = '') => {
  try {
    const res = await api.get(`/login/stations/${stationCode}/chefs/${chefId}/menu`, {
      params: stationName ? { stationName } : {},
    })
    return res.data
  } catch (err) {
    console.error('Error fetching chef menu:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching chef menu.' }
  }
}

export const createJourneyOrder = async (data) => {
  try {
    const res = await api.post('/login/orders', data)
    return res.data
  } catch (err) {
    console.error('Error creating journey order:', err)
    return err.response?.data || { success: false, message: 'Network error while saving your order.' }
  }
}

export const saveOrderDraft = async (data) => {
  try {
    const res = await api.post('/login/orders/draft', data)
    return res.data
  } catch (err) {
    console.error('Error saving order draft:', err)
    return err.response?.data || { success: false, message: 'Network error while saving order draft.' }
  }
}

export const getUserOrders = async () => {
  try {
    const res = await api.get('/login/orders')
    return res.data
  } catch (err) {
    console.error('Error fetching user orders:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching your orders.' }
  }
}

export const getUserOrderDetails = async (orderId) => {
  try {
    const res = await api.get(`/login/orders/${orderId}`)
    return res.data
  } catch (err) {
    console.error('Error fetching user order details:', err)
    return err.response?.data || { success: false, message: 'Network error while fetching order details.' }
  }
}
