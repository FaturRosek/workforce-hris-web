import apiClient from './client'

export const notificationApi = {
  getNotifications: async () => {
    const res = await apiClient.get('/notifications')
    return res.data
  },

  getUnreadCount: async () => {
    const res = await apiClient.get('/notifications/unread-count')
    return res.data
  },

  markAsRead: async (id) => {
    const res = await apiClient.put(`/notifications/${id}/read`)
    return res.data
  },

  generatePickupNotifications: async () => {
    const res = await apiClient.post('/notifications/generate-pickup')
    return res.data
  },
}

export default notificationApi
