import api from './api'

export const userLogin = async (data) => {
  try {
    const res = await api.post('/login', data)
    return res.data
  } catch (err) {
    console.log('Error occured in userAuthService', err.message)
    return err.response?.data ?? null
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
