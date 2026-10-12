import apiClient from './client'

export const serviceApi = {
  getServices: async (params = {}) => {
    const res = await apiClient.get('/services', { params })
    return res.data
  },

  getServiceById: async (id) => {
    const res = await apiClient.get(`/services/${id}`)
    return res.data
  },
}

export default serviceApi
