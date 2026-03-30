import api from './api'

export const deliveryLogin = async (data) => {
  try {
    const res = await api.post('/delivery', data)
    return res.data
  } catch (err) {
    console.log('Error occured in deliveryAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const deliveryCookieCheck = async () => {
  try {
    const res = await api.get('/delivery/me')
    return res.data
  } catch {
    return null
  }
}
