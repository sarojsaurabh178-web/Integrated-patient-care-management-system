import apiClient from './api';

export const doctorService = {
  /**
   * Fetches list of doctors with optional department & status filters
   */
  getDoctors: async (department = '', status = '') => {
    let url = '/doctors';
    const params = new URLSearchParams();
    if (department && department !== 'All') params.append('department', department);
    if (status && status !== 'All') params.append('status', status);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    return await apiClient.get(url);
  },

  /**
   * Fetches single doctor profile with assigned appointments
   */
  getDoctorById: async (id) => {
    return await apiClient.get(`/doctors/${id}`);
  },

  /**
   * Updates doctor profile details & duty status
   */
  updateDoctor: async (id, updateData) => {
    return await apiClient.put(`/doctors/${id}`, updateData);
  },

  /**
   * Creates a new doctor profile (Admin only)
   */
  createDoctor: async (doctorData) => {
    return await apiClient.post('/doctors', doctorData);
  }
};

export default doctorService;
