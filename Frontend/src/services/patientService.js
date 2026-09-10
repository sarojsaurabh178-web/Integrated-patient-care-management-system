import apiClient from './api';

export const patientService = {
  /**
   * Fetches list of patients with optional search query & gender filter
   */
  getPatients: async (search = '', gender = '') => {
    let url = '/patients';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (gender && gender !== 'All') params.append('gender', gender);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    return await apiClient.get(url);
  },

  /**
   * Fetches single patient by ID
   */
  getPatientById: async (id) => {
    return await apiClient.get(`/patients/${id}`);
  },

  /**
   * Creates a new patient
   */
  createPatient: async (patientData) => {
    const payload = {
      fullName: patientData.fullName || patientData.name,
      name: patientData.name || patientData.fullName,
      age: parseInt(patientData.age, 10) || 0,
      gender: patientData.gender,
      phone: patientData.phone,
      email: patientData.email,
      address: patientData.address || 'N/A',
      emergencyContact: patientData.emergencyContact,
      bloodGroup: patientData.bloodGroup || 'O+',
      medicalHistoryNotes: patientData.medicalHistoryNotes || patientData.notes || '',
    };
    return await apiClient.post('/patients', payload);
  },

  /**
   * Updates an existing patient record
   */
  updatePatient: async (id, updateData) => {
    return await apiClient.put(`/patients/${id}`, updateData);
  },

  /**
   * Archives a patient (soft delete)
   */
  archivePatient: async (id) => {
    return await apiClient.delete(`/patients/${id}`);
  },

  /**
   * Fetches patient treatment history
   */
  getTreatmentHistory: async (id) => {
    return await apiClient.get(`/patients/${id}/history`);
  }
};

export default patientService;
