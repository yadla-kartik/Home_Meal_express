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

export const getChefReviewStatus = async () => {
  try {
    const res = await api.get('/chef/review-status')
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return null
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

export const getChefMenuDraft = async () => {
  try {
    const res = await api.get('/chef/menu/draft')
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const saveChefMenuDraft = async (data) => {
  try {
    const res = await api.put('/chef/menu/draft', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const publishChefMenu = async () => {
  try {
    const res = await api.post('/chef/menu/publish')
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const generateChefDishPriceGuidance = async (data) => {
  try {
    const res = await api.post('/chef/menu/ai/price-guidance', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const generateChefDishImage = async (data) => {
  try {
    const res = await api.post('/chef/menu/ai/image', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const generateChefDishDescription = async (data) => {
  try {
    const res = await api.post('/chef/menu/ai/description', data)
    return res.data
  } catch (err) {
    console.log('Error occured in chefAuthService', err.message)
    return err.response?.data ?? null
  }
}
