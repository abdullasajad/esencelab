// API endpoints
export const API_BASE_URL = '/api'

// App constants
export const APP_NAME = 'Esencelab'
export const APP_VERSION = '1.0.0'

// Color palette
export const COLORS = {
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6fe',
    300: '#a5b8fc',
    400: '#8b93f8',
    500: '#7c6ef2',
    600: '#6d4fe6',
    700: '#5d3fcc',
    800: '#4d35a5',
    900: '#1B155C',
    950: '#0f0a2e',
  },
  dark: {
    50: '#f8f9fa',
    100: '#f1f3f4',
    200: '#e8eaed',
    300: '#dadce0',
    400: '#bdc1c6',
    500: '#9aa0a6',
    600: '#80868b',
    700: '#5f6368',
    800: '#3c4043',
    900: '#202124',
    950: '#000000',
  },
  accent: {
    silver: '#C3CED0',
    gold: '#A9824C',
  }
}

// Skill levels
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
]

// Skill categories
export const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'language', label: 'Language' },
  { value: 'certification', label: 'Certification' }
]

// Job types
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' }
]

// Work arrangements
export const WORK_ARRANGEMENTS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' }
]

// Education levels
export const EDUCATION_LEVELS = [
  { value: 'high-school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'phd', label: 'PhD' },
  { value: 'none', label: 'No Formal Education' }
]

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['.pdf', '.doc', '.docx'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  LANGUAGE: 'language'
}

// Routes
export const ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  OPPORTUNITIES: '/opportunities',
  SKILLS: '/skills',
  TRACK: '/track',
  PROFILE: '/profile'
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  SKILL_ADDED: 'Skill added successfully!',
  RESUME_UPLOADED: 'Resume uploaded successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!'
}
