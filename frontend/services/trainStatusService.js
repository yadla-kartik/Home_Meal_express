import api from './api'

export const getTrainSummary = async (trainNo, date) => {
  try {
    const res = await api.get(`/irctc/train/${trainNo}`, {
      params: date ? { date } : {},
    })
    return res.data
  } catch (err) {
    return err.response?.data ?? { success: false, error: err.message || 'Unable to fetch train details.' }
  }
}
