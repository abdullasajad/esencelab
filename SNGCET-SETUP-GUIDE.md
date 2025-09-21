# 🎓 Esencelab - SNGCET Student Career Portal

## Quick Start Guide for SNGCET College

### 🚀 **One-Click Setup**
```bash
# Run this single command to start everything:
start-sngcet-portal.bat
```

### 📋 **Prerequisites**
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Community Server) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### 🛠 **Manual Setup (if needed)**

#### 1. Install Dependencies
```bash
npm run install-all
```

#### 2. Setup MongoDB
**Option A: Local MongoDB**
```bash
# Run the setup script
setup-mongodb.bat

# Or manually start MongoDB service
net start MongoDB
```

**Option B: Docker (if you have Docker)**
```bash
docker-compose up -d mongodb
```

**Option C: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Get connection string
4. Update `server/.env` file

#### 3. Environment Setup
```bash
# Copy environment file
copy server\env-local server\.env
```

#### 4. Start Development Servers
```bash
npm run dev
```

### 🌐 **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

### 🎯 **SNGCET-Specific Features**

#### **Department-Specific Career Paths**
- **CSE**: Software Engineer, Data Scientist, DevOps Engineer
- **ECE**: Embedded Systems, VLSI Design, Telecommunications
- **MECH**: Design Engineer, Production Engineer, Automotive
- **EEE**: Power Systems, Control Systems, Renewable Energy
- **CIVIL**: Structural Engineer, Project Manager, Transportation

#### **Campus Recruitment Partners**
- Infosys, TCS, Wipro, Cognizant
- Ashok Leyland, L&T, BHEL
- Intel, Qualcomm, Bosch
- Google, Microsoft, Amazon (for top performers)

#### **Alumni Network**
- 12,000+ alumni worldwide
- 500+ companies represented
- 150+ mentors available
- 45+ countries presence

### 📱 **Mobile-First Design**
- Responsive design for all devices
- Touch-optimized navigation
- Offline functionality with Service Worker
- Progressive Web App (PWA) capabilities

### ⚡ **Performance Optimizations**
- Lazy loading components
- Image optimization
- Bundle splitting
- Service Worker caching
- Memory usage monitoring
- Critical CSS inlining

### 🔧 **Troubleshooting**

#### **MongoDB Connection Issues**
```bash
# Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe"

# Start MongoDB manually
mongod --dbpath "C:\data\db"

# Check connection
mongo --eval "db.adminCommand('ismaster')"
```

#### **Port Already in Use**
```bash
# Kill processes on ports 3000 and 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

#### **Node Modules Issues**
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

### 📊 **Development Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run client` | Start only frontend (port 3000) |
| `npm run server` | Start only backend (port 5000) |
| `npm run build` | Build for production |
| `npm run install-all` | Install all dependencies |
| `npm run seed` | Seed database with sample data |

### 🎨 **SNGCET Branding**
- **Logo**: Stylized "E" in gradient (Primary Blue to Gold)
- **Colors**: 
  - Primary: #6d4fe6 (Deep Blue)
  - Accent: #a9824c (Gold)
  - Dark: #000000 (Pure Black)
  - Silver: #c3ced0 (Silver Grey)
- **Typography**: Inter (body), Space Grotesk (headings)

### 🚀 **Deployment Options**

#### **Option 1: Netlify (Frontend) + Railway (Backend)**
```bash
# Build for production
npm run build

# Deploy frontend to Netlify
# Deploy backend to Railway
```

#### **Option 2: Docker Deployment**
```bash
docker-compose up -d
```

#### **Option 3: Traditional VPS**
```bash
# Build and copy files to server
npm run build
# Setup Nginx, PM2, MongoDB on server
```

### 📞 **Support**
- **Technical Issues**: Create GitHub issue
- **SNGCET Specific**: Contact placement cell
- **Feature Requests**: Submit via feedback form

### 🎯 **Success Metrics**
- **95%** placement success rate target
- **500+** job opportunities available
- **24/7** AI career assistant
- **Real-time** job matching

---

## 🏆 **Built Exclusively for SNGCET Students**

*Empowering the next generation of engineers from SNGCET College with cutting-edge career tools and personalized guidance.*

**Made with ❤️ for SNGCET by the Esencelab Team**
