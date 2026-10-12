import apiClient from './client'

export const orderApi = {
  getOrders: async (params = {}) => {
    const res = await apiClient.get('/orders', { params })
    return res.data
  },

  getOrderById: async (id) => {
    const res = await apiClient.get(`/orders/${id}`)
    return res.data
  },

  createOrder: async (orderData) => {
    const res = await apiClient.post('/orders', orderData)
    return res.data
  },

  updateOrderStatus: async (id, status) => {
    const res = await apiClient.put(`/orders/${id}/status`, { status })
    return res.data
  },

  getStatusHistory: async (id) => {
    const res = await apiClient.get(`/orders/${id}/status-history`)
    return res.data
  },

  getPaymentSummary: async (id) => {
    const res = await apiClient.get(`/orders/${id}/payment-summary`)
    return res.data
  },

  getPayments: async (id) => {
    const res = await apiClient.get(`/orders/${id}/payments`)
    return res.data
  },
}

export default orderApi
