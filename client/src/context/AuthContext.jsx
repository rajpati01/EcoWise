<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
=======
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  // console.log("Dispatching:", action); // See if something spams
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      // console.log('Checking auth status...');
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // console.log("Token found:", token);
          const user = await authService.getCurrentUser();
          // console.log("Dispatching:", action.type);
          dispatch({ type: "SET_USER", payload: user });
        } else {
          if (!token && state.loading !== false) {
            // console.log("Dispatching SET_LOADING");
            dispatch({ type: "SET_LOADING", payload: false });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        // console.log("Dispatching:", action.type);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await authService.login(credentials);

      // Store token
      localStorage.setItem("token", response.token);

      // Set user in context
      dispatch({ type: "SET_USER", payload: response.data });
      // dispatch({ type: "LOGIN_SUCCESS", payload: response });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await authService.register(userData);

      // Store token
      localStorage.setItem("token", response.token);

      // Set user in context
      dispatch({ type: "SET_USER", payload: response.user });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: "SET_USER", payload: userData });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
>>>>>>> 4caa9b560694b674764defdb47cf6f0a54066b11
