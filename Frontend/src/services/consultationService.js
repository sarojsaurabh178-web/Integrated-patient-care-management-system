import apiClient from './api';

export const consultationService = {
  /**
   * Fetches consultations with optional patientId or doctorId filter
   */
  getConsultations: async (filters = {}) => {
    let url = '/consultations';
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    return await apiClient.get(url);
  },

  /**
   * Fetches single consultation by ID
   */
  getConsultationById: async (id) => {
    return await apiClient.get(`/consultations/${id}`);
  },

  /**
   * Fetches consultations for a specific patient
   */
  getPatientConsultations: async (patientId) => {
    return await apiClient.get(`/consultations/patient/${patientId}`);
  },

  /**
   * Records a new consultation record
   */
  createConsultation: async (data) => {
    const payload = {
      patientId: data.patientId,
      patientName: data.patientName,
      appointmentId: data.appointmentId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      symptoms: data.symptoms,
      observations: data.observations,
      diagnosis: data.diagnosis,
      labResults: data.labResults,
      treatmentPlan: data.treatmentPlan,
      clinicalNotes: data.clinicalNotes,
      vitals: data.vitals || {}
    };
    return await apiClient.post('/consultations', payload);
  }
};

export default consultationService;
