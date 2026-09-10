import apiClient from './api';

export const appointmentService = {
  /**
   * Fetches all appointments with optional filters (patientId, doctorId, status, date)
   */
  getAppointments: async (filters = {}) => {
    let url = '/appointments';
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    return await apiClient.get(url);
  },

  /**
   * Fetches a single appointment by ID
   */
  getAppointmentById: async (id) => {
    return await apiClient.get(`/appointments/${id}`);
  },

  /**
   * Checks real-time slot availability for a doctor on a specific date
   */
  checkSlotAvailability: async (doctorId, date) => {
    return await apiClient.get(`/appointments/availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`);
  },

  /**
   * Books a new appointment with atomic conflict validation
   */
  createAppointment: async (appointmentData) => {
    const payload = {
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      doctorId: appointmentData.doctorId || 'D-01',
      doctorName: appointmentData.doctorName,
      department: appointmentData.department || 'General Medicine',
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type || 'Consultation',
      reason: appointmentData.reason || 'General Health Check'
    };
    return await apiClient.post('/appointments', payload);
  },

  /**
   * Updates appointment status (Scheduled, Completed, Cancelled, Pending)
   */
  updateAppointmentStatus: async (id, status) => {
    return await apiClient.put(`/appointments/${id}`, { status });
  },

  /**
   * Cancels an appointment
   */
  cancelAppointment: async (id) => {
    return await apiClient.delete(`/appointments/${id}`);
  }
};

export default appointmentService;
