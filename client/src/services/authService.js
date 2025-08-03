import api from "./api";

const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  CURRENT_USER: "/auth/profile",
  REFRESH_TOKEN: "/auth/refresh",
};

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      console.log("📦 Sending to API:", userData);  // Add this for debugging
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, we'll clear local storage
      console.error("Logout error:", error);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    console.log("Calling getCurrentUser");
    const token = localStorage.getItem("token");
    if (!token) return null; // ✅ Don't call API if token is missing
    try {
      const response = await api.get(API_ENDPOINTS.CURRENT_USER);
      return response.data.user;
    } catch (error) {
      console.error("getCurrentUser error:", error.message);
      return null;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
