import apiClient from './api';

export const dashboardService = {
  /**
   * Fetches real-time dashboard analytics computed directly from the PostgreSQL database
   */
  getDashboardMetrics: async () => {
    return await apiClient.get('/analytics/dashboard');
  },

  /**
   * Fetches audit logs for Administrator inspection
   */
  getAuditLogs: async (limit = 50) => {
    return await apiClient.get(`/audit/logs?limit=${limit}`);
  },

  /**
   * Fetches security events for security monitoring dashboard
   */
  getSecurityEvents: async (limit = 50) => {
    return await apiClient.get(`/audit/security-events?limit=${limit}`);
  },

  /**
   * Generates CSV report download URL
   */
  getCsvExportUrl: (type = 'appointments') => {
    const token = sessionStorage.getItem('meditrack_auth_token');
    return `/api/v1/analytics/reports/csv?type=${type}${token ? `&token=${token}` : ''}`;
  }
};

export default dashboardService;
