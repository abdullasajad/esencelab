# 🚀 SNGCET Portal - Deployment Guide

## 📋 **Quick Setup Instructions**

### **Step 1: Run Setup as Administrator**
1. **Right-click PowerShell** → **"Run as Administrator"**
2. Navigate to project folder:
   ```cmd
   cd "C:\Users\sajadtlpr\CascadeProjects\windsurf-project-2"
   ```
3. Run complete setup:
   ```cmd
   setup-complete.bat
   ```

### **Step 2: Start the Portal**
```cmd
start-portal.bat
```

### **Step 3: Access SNGCET Portal**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🔧 **MongoDB Setup Options**

### **Option A: Local MongoDB (Recommended for Development)**
```cmd
# As Administrator
net start MongoDB

# Or manual start
mongod --dbpath "C:\data\db"
```

### **Option B: MongoDB Atlas (Cloud - Recommended for Production)**
1. Go to: https://cloud.mongodb.com
2. Create free account
3. Create cluster
4. Get connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/esencelab_sngcet
   ```

### **Option C: Docker MongoDB**
```cmd
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## 🌐 **Deployment Options**

### **Option 1: Netlify + Railway (Recommended)**

#### **Frontend (Netlify):**
1. Build the frontend:
   ```cmd
   cd client
   npm run build
   ```
2. Deploy `client/build` folder to Netlify
3. Set environment variables in Netlify:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

#### **Backend (Railway):**
1. Connect GitHub repo to Railway
2. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   PORT=5000
   ```

### **Option 2: Vercel (Full Stack)**
```cmd
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Option 3: Traditional VPS**
```bash
# On server
git clone your-repo
cd windsurf-project-2
npm run install-all
npm run build
pm2 start ecosystem.config.js
```

---

## 📱 **SNGCET Features Checklist**

### ✅ **Completed Features:**
- [x] "E" logo throughout the app
- [x] SNGCET branding ("for SNGCET Students")
- [x] Testimonials removed
- [x] Statistics removed (clean interface)
- [x] Mobile responsive design
- [x] Department selection (CSE, ECE, MECH, EEE, CIVIL)
- [x] Alumni network interface
- [x] Career opportunities page
- [x] Performance optimizations
- [x] Service worker for offline functionality
- [x] Mobile bottom navigation

### 🎯 **SNGCET-Specific Content:**
- **Departments**: CSE, ECE, MECH, EEE, CIVIL
- **Recruiters**: Infosys, TCS, Wipro, Ashok Leyland, L&T, BHEL
- **Alumni Network**: Connect with SNGCET graduates
- **Campus Placements**: Dedicated placement portal

---

## 🔍 **Troubleshooting**

### **MongoDB Issues:**
```cmd
# Check if MongoDB is running
tasklist | findstr mongod

# Check port 27017
netstat -an | findstr 27017

# Restart MongoDB
net stop MongoDB
net start MongoDB
```

### **Port Conflicts:**
```cmd
# Kill processes on ports 3000 and 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Node Modules Issues:**
```cmd
# Clean reinstall
rmdir /s node_modules client\node_modules server\node_modules
npm run install-all
```

---

## 🎓 **SNGCET Portal Ready!**

Your portal includes:
- **Clean Design**: No statistics, focus on functionality
- **SNGCET Branding**: College-specific customization
- **Mobile First**: Perfect on all devices
- **Performance**: Optimized for speed
- **Offline**: Works without internet (cached)

**Built exclusively for SNS College of Engineering and Technology students! 🎉**
