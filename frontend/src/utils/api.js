import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 Making ${config.method?.toUpperCase()} request to ${config.url}`);
    if (config.data) {
      console.log('📤 Request data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    if (response.data) {
      console.log('📥 Response data:', response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error - No response received:', error.request);
    } else {
      // Something else happened
      console.error('❌ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get users API error:', error);
      throw error;
    }
  },
  
  create: async (user) => {
    try {
      const response = await api.post('/users', user);
      return response.data;
    } catch (error) {
      console.error('Create user API error:', error);
      throw error;
    }
  },
  
  getStudents: async () => {
    try {
      const response = await api.get('/users/students');
      return response.data;
    } catch (error) {
      console.error('Get students API error:', error);
      throw error;
    }
  },
};

// Question API
export const questionAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Get questions API error:', error);
      throw error;
    }
  },
  
  create: async (question) => {
    try {
      const response = await api.post('/questions', question);
      return response.data;
    } catch (error) {
      console.error('Create question API error:', error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete question API error:', error);
      throw error;
    }
  },
  
  getCount: async () => {
    try {
      const response = await api.get('/questions/count');
      return response.data;
    } catch (error) {
      console.error('Get question count API error:', error);
      throw error;
    }
  },
};

// Score API
export const scoreAPI = {
  save: async (scoreData) => {
    try {
      console.log('💾 Saving score data:', scoreData);
      const response = await api.post('/scores', scoreData);
      console.log('✅ Score saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Save score API error:', error);
      throw error;
    }
  },
  
  getUserScores: async (userId) => {
    try {
      console.log(`📊 Fetching scores for user ID: ${userId}`);
      const response = await api.get(`/scores/user/${userId}`);
      console.log(`✅ Retrieved ${response.data.length} scores for user ${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user scores API error:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },
  
  getUserBestScore: async (userId) => {
    try {
      const response = await api.get(`/scores/user/${userId}/best`);
      return response.data;
    } catch (error) {
      console.error('Get user best score API error:', error);
      return 0;
    }
  },
  
  getAllScores: async () => {
    try {
      console.log('📊 Fetching all scores for admin panel');
      const response = await api.get('/scores/all');
      console.log(`✅ Retrieved ${response.data.length} total scores`);
      return response.data;
    } catch (error) {
      console.error('Get all scores API error:', error);
      // Return empty array instead of throwing to prevent admin panel crashes
      return [];
    }
  },
};

export default api;