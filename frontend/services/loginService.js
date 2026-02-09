import api from './api'

export const userLogin = async (data) => {
  try {
    const res = await api.post('/login', data)
    return res.data
  } catch (err) {
    console.log('Error occured in loginService', err.message)
  }
}

export const cookieCheck = async () => {
  try {
    const res = await api.get('/login/me')
    return res.data
  } catch (err) {
    return null
  }
}
