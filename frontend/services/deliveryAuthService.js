import api from './api'

export const deliveryLogin = async (data) => {
  try {
    const res = await api.post('/delivery', data)
    return res.data
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Delivery login failed.'
    return err.response?.data ?? { success: false, message }
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

export const getDeliveryReviewStatus = async () => {
  try {
    const res = await api.get('/delivery/review-status')
    return res.data
  } catch (err) {
    console.log('Error occured in deliveryAuthService', err.message)
    return null
  }
}

export const submitDeliveryRegistration = async (data) => {
  try {
    const res = await api.post('/delivery/register', data)
    return res.data
  } catch (err) {
    console.log('Error occured in deliveryAuthService', err.message)
    return err.response?.data ?? null
  }
}
