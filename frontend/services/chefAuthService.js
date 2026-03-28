import api from './api'

export const chefLogin = async (data) => {
  try {
    const res = await api.post('/chef/login', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const chefSignup = async (data) => {
  try {
    const res = await api.post('/chef/signup', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const chefCookieCheck = async () => {
  try {
    const res = await api.get('/chef/me')
    return res.data
  } catch {
    return null
  }
}

export const updateChefProfile = async (data) => {
  try {
    const res = await api.put('/chef/profile', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const submitChefRegistration = async (data) => {
  try {
    const res = await api.post('/chef/register', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}
