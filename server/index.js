const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resumeRoutes = require('./routes/resume');
const jobsRoutes = require('./routes/jobs');
const skillsRoutes = require('./routes/skills');
const coursesRoutes = require('./routes/courses');
const progressRoutes = require('./routes/progress');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting - Scaled for 10K students
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 1000, // Higher limit for 10K students
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration - Production ready
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGIN || '').split(',').filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002'];

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection - Optimized for 10K students
const mongoOptions = {
  maxPoolSize: process.env.DB_MAX_POOL_SIZE || 50, // Maintain up to 50 socket connections
  minPoolSize: process.env.DB_MIN_POOL_SIZE || 5,  // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: process.env.DB_MAX_IDLE_TIME_MS || 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: process.env.DB_SERVER_SELECTION_TIMEOUT_MS || 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB with optimized settings for 10K students');
    console.log(`📊 Pool size: ${mongoOptions.maxPoolSize}, Min pool: ${mongoOptions.minPoolSize}`);
  })
  .catch((error) => {
    console.error('⚠️  MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Production database connection failed - exiting');
      process.exit(1);
    } else {
      console.log('🔄 Running in demo mode - some features may be limited');
    }
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
