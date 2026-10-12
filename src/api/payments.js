import apiClient from './client'

export const paymentApi = {
  getPayments: async (params = {}) => {
    const res = await apiClient.get('/payments', { params })
    return res.data
  },

  getPaymentById: async (id) => {
    const res = await apiClient.get(`/payments/${id}`)
    return res.data
  },

  createPayment: async (paymentData) => {
    const res = await apiClient.post('/payments', paymentData)
    return res.data
  },
}

export default paymentApi
