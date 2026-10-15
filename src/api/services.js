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

  createService: async (serviceData) => {
    const res = await apiClient.post('/services', serviceData)
    return res.data
  },

  updateService: async (id, serviceData) => {
    const res = await apiClient.put(`/services/${id}`, serviceData)
    return res.data
  },

  deleteService: async (id) => {
    const res = await apiClient.delete(`/services/${id}`)
    return res.data
  },
}

export default serviceApi
