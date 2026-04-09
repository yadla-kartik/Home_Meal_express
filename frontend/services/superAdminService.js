import api from './api'

export const superAdminLogin = async (data) => {
  try {
    const res = await api.post('/superadmin/login', data)
    return res.data
  } catch (err) {
    console.log('Error in superAdminService:', err.message)
    return err.response?.data ?? null
  }
}

export const superAdminCookieCheck = async () => {
  try {
    const res = await api.get('/superadmin/me')
    return res.data
  } catch {
    return null
  }
}

export const superAdminLogout = async () => {
  try {
    const res = await api.post('/superadmin/logout')
    return res.data
  } catch (err) {
    return err.response?.data ?? null
  }
}

export const getAllAdmins = async () => {
  try {
    const res = await api.get('/superadmin/admins')
    return res.data
  } catch (err) {
    console.log('Error in superAdminService:', err.message)
    return err.response?.data ?? null
  }
}

export const addAdmin = async (data) => {
  try {
    const res = await api.post('/superadmin/admins', data)
    return res.data
  } catch (err) {
    console.log('Error in superAdminService:', err.message)
    return err.response?.data ?? null
  }
}

export const removeAdmin = async (id) => {
  try {
    const res = await api.delete(`/superadmin/admins/${id}`)
    return res.data
  } catch (err) {
    console.log('Error in superAdminService:', err.message)
    return err.response?.data ?? null
  }
}
