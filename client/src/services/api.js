import axios from 'axios'
import performanceMonitor from '../utils/monitoring'

// Create axios instance with optimizations for 10K students
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000, // Increased timeout for high load
  headers: {
    'Content-Type': 'application/json',
  },
  // Connection pooling and keep-alive
  maxRedirects: 3,
  maxContentLength: 10 * 1024 * 1024, // 10MB
})

// Simple in-memory cache for GET requests
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Cache helper functions
const getCacheKey = (config) => `${config.method}:${config.url}:${JSON.stringify(config.params)}`
const isGetRequest = (config) => config.method?.toLowerCase() === 'get'
const shouldCache = (config) => isGetRequest(config) && !config.skipCache

// Request interceptor with caching and performance monitoring
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Check cache for GET requests
    if (shouldCache(config)) {
      const cacheKey = getCacheKey(config)
      const cached = cache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached response
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: cached.headers,
          config,
          request: {}
        })
      }
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: Date.now() }
    
    return config
  },
  (error) => {
    performanceMonitor.recordError(error, { context: 'request_interceptor' })
    return Promise.reject(error)
  }
)

// Response interceptor with caching and monitoring
api.interceptors.response.use(
  (response) => {
    const { config } = response
    const duration = Date.now() - config.metadata.startTime
    
    // Record API call performance
    performanceMonitor.recordApiCall(
      config.url,
      config.method?.toUpperCase(),
      duration,
      response.status
    )
    
    // Cache successful GET responses
    if (shouldCache(config) && response.status === 200) {
      const cacheKey = getCacheKey(config)
      cache.set(cacheKey, {
        data: response.data,
        headers: response.headers,
        timestamp: Date.now()
      })
      
      // Clean up old cache entries
      if (cache.size > 100) {
        const oldestKey = cache.keys().next().value
        cache.delete(oldestKey)
      }
    }
    
    return response
  },
  (error) => {
    const { config } = error
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0
    
    // Record API error
    performanceMonitor.recordApiCall(
      config?.url || 'unknown',
      config?.method?.toUpperCase() || 'unknown',
      duration,
      error.response?.status || 0
    )
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after']
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`)
    }
    
    // Record error for monitoring
    performanceMonitor.recordError(error, {
      context: 'api_response',
      url: config?.url,
      method: config?.method,
      status: error.response?.status
    })
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
}

// User API
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  updateSkills: (skills) => api.post('/users/skills', { skills }),
  deleteSkill: (skillId) => api.delete(`/users/skills/${skillId}`),
  getActivity: (params) => api.get('/users/activity', { params }),
  getDashboard: () => api.get('/users/dashboard'),
}

// Resume API
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  download: () => api.get('/resume/download', { responseType: 'blob' }),
  delete: () => api.delete('/resume'),
  analyze: () => api.get('/resume/analysis'),
}

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  applyToJob: (id) => api.post(`/jobs/${id}/apply`),
  getApplications: (params) => api.get('/jobs/user/applications', { params }),
  getRecommendations: (params) => api.get('/jobs/recommendations', { params }),
}

// Skills API
export const skillsAPI = {
  getAnalysis: () => api.get('/skills/analysis'),
  getSuggestions: (params) => api.get('/skills/suggestions', { params }),
}

// Courses API
export const coursesAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getRecommendations: (params) => api.get('/courses/recommendations', { params }),
}

// Progress API
export const progressAPI = {
  getTimeline: (params) => api.get('/progress/timeline', { params }),
  getStats: () => api.get('/progress/stats'),
}

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
}

export default api
