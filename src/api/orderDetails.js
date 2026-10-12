import apiClient from './client'

export const orderDetailApi = {
  getOrderDetails: async (params = {}) => {
    const res = await apiClient.get('/order-details', { params })
    return res.data
  },

  getOrderDetailById: async (id) => {
    const res = await apiClient.get(`/order-details/${id}`)
    return res.data
  },

  createOrderDetail: async (detailData) => {
    const res = await apiClient.post('/order-details', detailData)
    return res.data
  },

  updateOrderDetail: async (id, detailData) => {
    const res = await apiClient.put(`/order-details/${id}`, detailData)
    return res.data
  },

  deleteOrderDetail: async (id) => {
    const res = await apiClient.delete(`/order-details/${id}`)
    return res.data
  },
}

export default orderDetailApi
