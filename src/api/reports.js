import apiClient from './client'

export const reportApi = {
  getSalesReport: async (params = {}) => {
    const res = await apiClient.get('/reports/sales', { params })
    return res.data
  },

  getPaymentReport: async (params = {}) => {
    const res = await apiClient.get('/reports/payments', { params })
    return res.data
  },
}

export default reportApi
