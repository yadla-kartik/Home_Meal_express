import api from './api'

export const adminLogin = async (data) => {
  try {
    const res = await api.post('/admin/login', data)
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const adminSignup = async (data) => {
  try {
    const res = await api.post('/admin/signup', data)
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const adminCookieCheck = async () => {
  try {
    const res = await api.get('/admin/me')
    return res.data
  } catch {
    return null
  }
}

export const adminLogout = async () => {
  try {
    const res = await api.post('/admin/logout')
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const changeAdminPassword = async (data) => {
  try {
    const res = await api.patch('/admin/change-password', data)
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const getChefApprovals = async (status = 'pending') => {
  try {
    const res = await api.get('/admin/chef-approvals', {
      params: { status },
    })
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const approveChefApproval = async (approvalId) => {
  try {
    const res = await api.patch(`/admin/chef-approvals/${approvalId}/approve`)
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const rejectChefApproval = async (approvalId, reason) => {
  try {
    const res = await api.patch(`/admin/chef-approvals/${approvalId}/reject`, { reason })
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const getDeliveryApprovals = async (status = 'pending') => {
  try {
    const res = await api.get('/admin/delivery-approvals', {
      params: { status },
    })
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const approveDeliveryApproval = async (approvalId) => {
  try {
    const res = await api.patch(`/admin/delivery-approvals/${approvalId}/approve`)
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}

export const rejectDeliveryApproval = async (approvalId, reason) => {
  try {
    const res = await api.patch(`/admin/delivery-approvals/${approvalId}/reject`, { reason })
    return res.data
  } catch (err) {
    console.log('Error occured in adminAuthService', err.message)
    return err.response?.data ?? null
  }
}
