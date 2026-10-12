import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mm_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mm_token')
      localStorage.removeItem('mm_user')
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED'
        ? 'Request timeout, periksa koneksi server'
        : !error.response
        ? 'Server backend tidak dapat dihubungi'
        : 'Terjadi kesalahan sistem')

    const enhancedError = new Error(message)
    enhancedError.response = error.response
    enhancedError.status = error.response?.status
    return Promise.reject(enhancedError)
  }
)

export default apiClient
