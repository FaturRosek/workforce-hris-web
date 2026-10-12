import apiClient from './client'

export const customerApi = {
  getCustomers: async (params = {}) => {
    const res = await apiClient.get('/customers', { params })
    return res.data
  },

  getCustomerById: async (id) => {
    const res = await apiClient.get(`/customers/${id}`)
    return res.data
  },

  createCustomer: async (customerData) => {
    const res = await apiClient.post('/customers', customerData)
    return res.data
  },

  updateCustomer: async (id, customerData) => {
    const res = await apiClient.put(`/customers/${id}`, customerData)
    return res.data
  },

  deleteCustomer: async (id) => {
    const res = await apiClient.delete(`/customers/${id}`)
    return res.data
  },
}

export default customerApi
