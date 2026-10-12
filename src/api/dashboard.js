import apiClient from './client'

export const dashboardApi = {
  getSummary: async (params = {}) => {
    const res = await apiClient.get('/dashboard', { params })
    return res.data
  },
}

export default dashboardApi
