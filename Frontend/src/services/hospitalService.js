import apiClient from './api';

export const hospitalService = {
  /**
   * Search nearby hospitals via geolocation or manual query (city, locality, PIN code, hospital name)
   * @param {Object} options
   * @param {number|null} options.lat - User latitude
   * @param {number|null} options.lon - User longitude
   * @param {number} [options.radiusKm=10] - Search radius (2, 5, 10, 20, 50)
   * @param {string} [options.query=''] - Manual text search
   */
  getNearbyHospitals: async ({ lat = null, lon = null, radiusKm = 10, query = '' } = {}) => {
    const params = new URLSearchParams();
    if (lat !== null && lat !== undefined) params.append('lat', lat);
    if (lon !== null && lon !== undefined) params.append('lon', lon);
    if (radiusKm) params.append('radius_km', radiusKm);
    if (query && query.trim()) params.append('query', query.trim());

    const queryString = params.toString();
    const endpoint = queryString ? `/hospitals/nearby?${queryString}` : '/hospitals/nearby';
    return await apiClient.get(endpoint);
  },

  /**
   * Get single hospital profile with verified bed telemetry
   * @param {string} hospitalId
   */
  getHospitalById: async (hospitalId) => {
    return await apiClient.get(`/hospitals/${hospitalId}`);
  },

  /**
   * Get emergency healthcare hotlines (Ambulance, Trauma, Health Helpline)
   */
  getEmergencyHotlines: async () => {
    return await apiClient.get('/hospitals/emergency/hotlines');
  }
};

export default hospitalService;
