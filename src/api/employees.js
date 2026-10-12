import apiClient from './client'

export const employeeApi = {
  getEmployees: async (params = {}) => {
    const res = await apiClient.get('/employees', { params })
    return res.data
  },

  getEmployeeById: async (id) => {
    const res = await apiClient.get(`/employees/${id}`)
    return res.data
  },
}

export default employeeApi
