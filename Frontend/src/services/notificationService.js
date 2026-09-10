import apiClient from './api';

export const notificationService = {
  /**
   * Fetches all notifications for the authenticated user
   */
  getNotifications: async (recipientId = '') => {
    let url = '/notifications';
    if (recipientId) url += `?recipientId=${encodeURIComponent(recipientId)}`;
    return await apiClient.get(url);
  },

  /**
   * Marks a specific notification as Read
   */
  markAsRead: async (notifId) => {
    return await apiClient.put(`/notifications/${notifId}/read`);
  },

  /**
   * Marks all notifications as Read
   */
  markAllAsRead: async () => {
    return await apiClient.put('/notifications/read-all');
  }
};

export default notificationService;
