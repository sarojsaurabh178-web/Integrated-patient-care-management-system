/**
 * Centralized API Client for MediTrack Healthcare Platform
 * Manages Base URL, JWT Authentication Header Injection, and Global Error Handling
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  /**
   * Core request executor with automatic Bearer token injection
   */
  request: async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Retrieve safe token from sessionStorage
    const token = sessionStorage.getItem('meditrack_auth_token');

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - Session Expiry
      if (response.status === 401) {
        // Dispatch session expired event so App can prompt re-login if needed
        window.dispatchEvent(new CustomEvent('meditrack:unauthorized', { detail: { endpoint } }));
      }

      // Parse JSON response
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorDetail = 
          (data && typeof data === 'object' && (data.detail || data.message || data.error)) ||
          response.statusText ||
          `Request failed with status ${response.status}`;
        
        throw new ApiError(errorDetail, response.status, data);
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      // Network or browser fetch error
      throw new ApiError(err.message || 'Network connection failed. Backend unreachable.', 0, null);
    }
  },

  get: (endpoint, options = {}) => {
    return apiClient.request(endpoint, { ...options, method: 'GET' });
  },

  post: (endpoint, body, options = {}) => {
    return apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put: (endpoint, body, options = {}) => {
    return apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete: (endpoint, options = {}) => {
    return apiClient.request(endpoint, { ...options, method: 'DELETE' });
  }
};

export default apiClient;
