import apiClient from './api';

export const hospitalManagementService = {
  /**
   * Fetches Hospital Info and Real-time Bed Telemetry Metrics
   */
  getHospitalInfo: async () => {
    return await apiClient.get('/hospital-management/info');
  },

  /**
   * Updates Hospital Profile (Admin only)
   */
  updateHospitalInfo: async (infoData) => {
    return await apiClient.put('/hospital-management/info', infoData);
  },

  /**
   * Fetches list of hospital beds with optional filters
   */
  getBeds: async ({ ward = '', type = '', status = '', search = '' } = {}) => {
    let url = '/hospital-management/beds';
    const params = new URLSearchParams();
    if (ward && ward !== 'All') params.append('ward', ward);
    if (type && type !== 'All') params.append('type', type);
    if (status && status !== 'All') params.append('status', status);
    if (search) params.append('search', search);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return await apiClient.get(url);
  },

  /**
   * Registers a new bed (Admin/Staff)
   */
  createBed: async (bedData) => {
    return await apiClient.post('/hospital-management/beds', bedData);
  },

  /**
   * Updates an existing bed's status, patient assignment, or ward
   */
  updateBed: async (bedId, updateData) => {
    return await apiClient.put(`/hospital-management/beds/${bedId}`, updateData);
  },

  /**
   * Deletes a bed record (Admin only)
   */
  deleteBed: async (bedId) => {
    return await apiClient.delete(`/hospital-management/beds/${bedId}`);
  }
};

export default hospitalManagementService;
