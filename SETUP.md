# Esencelab Setup Guide

This guide will help you set up and run the Esencelab Student Super App on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

Optional:
- **Docker & Docker Compose** - For containerized deployment

## Quick Start (Recommended)

### Option 1: Using Docker Compose (Easiest)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd windsurf-project-2
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **Seed sample data** (optional):
   ```bash
   docker-compose exec backend npm run seed
   ```

### Option 2: Manual Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd windsurf-project-2
   npm run install-all
   ```

2. **Set up environment variables**:
   
   **Backend** (`server/.env`):
   ```bash
   cp server/env.example server/.env
   ```
   Edit `server/.env` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/esencelab
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend** (`client/.env`):
   ```bash
   cp client/env.example client/.env
   ```

3. **Start MongoDB**:
   ```bash
   # On Windows (if installed as service)
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

4. **Seed sample data**:
   ```bash
   cd server
   npm run seed
   ```

5. **Start the development servers**:
   ```bash
   # From the root directory
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
esencelab-student-app/
├── client/                 # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── contexts/      # React context providers
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend (Express + MongoDB)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route handlers
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Server utilities
│   ├── scripts/          # Database scripts
│   └── package.json
├── docker-compose.yml     # Docker configuration
└── README.md
```

## Available Scripts

### Root Directory
- `npm run install-all` - Install dependencies for both client and server
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the client for production
- `npm start` - Start the server in production mode

### Server (`/server`)
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm start` - Start server in production mode
- `npm run seed` - Seed database with sample data
- `npm test` - Run server tests

### Client (`/client`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables

**Server Environment Variables**:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - Optional: For enhanced AI features
- `EMAIL_SERVICE` - Optional: For email notifications

**Client Environment Variables**:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### Database Configuration

The application uses MongoDB with the following collections:
- `users` - User profiles and authentication
- `jobs` - Job listings and applications
- `courses` - Course recommendations
- Activity logs and progress tracking

## Features Overview

### 🎯 Core Features
- **User Authentication** - Secure login/register with JWT
- **Resume Upload & Analysis** - AI-powered resume parsing
- **Job Matching** - Personalized job recommendations
- **Skill Gap Analysis** - Identify missing skills
- **Course Recommendations** - Curated learning paths
- **Progress Tracking** - Career development timeline
- **AI Chatbot** - 24/7 career guidance

### 🎨 Design Features
- **Dark Theme** - Modern, eye-friendly interface
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered
- **Accessible** - WCAG compliant design
- **Fast Loading** - Optimized performance

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Ensure MongoDB is running and accessible

2. **Port Already in Use**:
   ```
   Error: listen EADDRINUSE :::5000
   ```
   **Solution**: Change the PORT in your `.env` file or kill the process using the port

3. **Module Not Found Errors**:
   **Solution**: Run `npm run install-all` to ensure all dependencies are installed

4. **CORS Errors**:
   **Solution**: Check that the frontend URL is included in the backend CORS configuration

### Getting Help

1. **Check the logs**: Both client and server provide detailed error logs
2. **Verify environment variables**: Ensure all required variables are set
3. **Database connection**: Verify MongoDB is running and accessible
4. **Port conflicts**: Ensure ports 3000 and 5000 are available

## Development Tips

### Adding New Features
1. **Backend**: Add routes in `/server/routes/`, models in `/server/models/`
2. **Frontend**: Add pages in `/client/src/pages/`, components in `/client/src/components/`
3. **API Integration**: Update `/client/src/services/api.js`

### Code Style
- **Backend**: Follow Node.js best practices, use ESLint
- **Frontend**: Follow React best practices, use Tailwind CSS classes
- **Database**: Use Mongoose schemas with proper validation

### Testing
- Write unit tests for utility functions
- Test API endpoints with proper error handling
- Test React components with user interactions

## Deployment

### Production Deployment

1. **Using Docker**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Manual Deployment**:
   - Build the client: `cd client && npm run build`
   - Set production environment variables
   - Use a process manager like PM2 for the server
   - Set up a reverse proxy (nginx) for the client

### Environment Setup
- Set `NODE_ENV=production`
- Use a production MongoDB instance
- Configure proper CORS origins
- Set up SSL certificates
- Configure environment-specific variables

## Security Considerations

- Change default JWT secret in production
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Use HTTPS in production
- Regularly update dependencies

## Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries with indexes
- Use lazy loading for React components
- Minimize bundle size with code splitting

## Support

For questions or issues:
1. Check this setup guide
2. Review the troubleshooting section
3. Check the application logs
4. Create an issue in the repository

---

**Happy coding! 🚀**
