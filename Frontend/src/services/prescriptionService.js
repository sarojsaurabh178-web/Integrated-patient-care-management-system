import apiClient from './api';

export const prescriptionService = {
  /**
   * Fetches all prescriptions with optional patientId or doctorId filter
   */
  getPrescriptions: async (filters = {}) => {
    let url = '/prescriptions';
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    return await apiClient.get(url);
  },

  /**
   * Fetches single prescription by ID
   */
  getPrescriptionById: async (id) => {
    return await apiClient.get(`/prescriptions/${id}`);
  },

  /**
   * Fetches prescriptions for a specific patient
   */
  getPatientPrescriptions: async (patientId) => {
    return await apiClient.get(`/prescriptions/patient/${patientId}`);
  },

  /**
   * Issues a new electronic prescription
   */
  createPrescription: async (data) => {
    const payload = {
      patientId: data.patientId,
      patientName: data.patientName,
      consultationId: data.consultationId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      medicines: data.medicines || [],
      instructions: data.instructions || ''
    };
    return await apiClient.post('/prescriptions', payload);
  }
};

export default prescriptionService;
