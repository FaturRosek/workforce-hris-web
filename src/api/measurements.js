import apiClient from './client'

export const measurementApi = {
  getByOrderId: async (orderId) => {
    const res = await apiClient.get(`/measurements/orders/${orderId}`)
    return res.data
  },

  create: async (orderId, data) => {
    const res = await apiClient.post(`/measurements/orders/${orderId}`, data)
    return res.data
  },

  update: async (orderId, data) => {
    const res = await apiClient.put(`/measurements/orders/${orderId}`, data)
    return res.data
  },
}

export default measurementApi
