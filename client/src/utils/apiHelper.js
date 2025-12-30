/**
 * API Helper Utility
 * Provides standardized methods for API requests with error handling
 */

// Base API URL - can be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Make an API request with standardized error handling
 * 
 * @param {string} endpoint - API endpoint (with leading slash)
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} options.data - Request payload for POST/PUT requests
 * @param {Object} options.headers - Additional headers
 * @param {boolean} options.includeAuth - Whether to include auth token (default: true)
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    headers = {},
    includeAuth = true,
  } = options;

  // Prepare URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers with content type
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if token exists and includeAuth is true
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Prepare request config
  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include', // Include cookies if any
  };

  // Add body for POST/PUT requests
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    config.body = JSON.stringify(data);
  }

  try {
    // Make the request
    const response = await fetch(url, config);

    // Get response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON if not empty
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Error parsing response as JSON:', e);
      throw new Error('Invalid response format from server');
    }

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      // Extract error message from response or use status text
      const errorMessage = responseData?.message || 
                          responseData?.error || 
                          response.statusText || 
                          'Something went wrong';
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    // If it's already our custom error, just rethrow it
    if (error.status) {
      throw error;
    }
    
    // Handle network errors
    console.error('API request failed:', error);
    throw new Error('Network error. Please check your connection.');
  }
};

/**
 * Convenience methods for common HTTP verbs
 */

export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

export const post = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'POST', data });
};

export const put = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'PUT', data });
};

export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};