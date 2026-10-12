import apiClient from './client'

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials)
    return res.data
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me')
    return res.data
  },
}

export default authApi
