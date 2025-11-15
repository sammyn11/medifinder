# MediFinder - Medicine Finder for Kigali, Rwanda

A modern web application that helps residents of Kigali find pharmacies with their prescribed medicines in stock, verify insurance acceptance, and order medicines online with home delivery.

## 🎯 Problem Statement

**Context (Kigali City, Rwanda):**
- Difficulty locating pharmacies with required medicines
- Many people move across the city searching for pharmacies that stock their prescribed drugs
- Patients often don't know whether a pharmacy has their medicine, causing wasted trips and delays
- Insurance-related barriers - pharmacies may prefer cash payments over insurance claims

**Impact:**
- Time wasted traveling between pharmacies
- Delayed access to medication
- Financial and emotional stress for patients

**Solution:**
A digital platform that displays pharmacies with prescribed medicine in stock, shows insurance acceptance, enables online ordering with home delivery, and provides prescription verification.

## ✨ Features

### For Patients
- 🔍 **Medicine Search**: Search for medicines by name and location
- 🏥 **Insurance Filtering**: Filter pharmacies by insurance type (RSSB, Mutuelle, Private-A, Private-B, etc.)
- 📍 **Interactive Maps**: View pharmacy locations on an interactive map
- 🔐 **User Authentication**: Secure login and signup with JWT tokens
- 📋 **Prescription Upload**: Upload and verify prescriptions digitally
- 🛒 **Online Ordering**: Order medicines online with delivery options
- 🔔 **Notifications**: Receive order status updates and notifications
- 🚚 **Home Delivery**: Optional home delivery service

### For Pharmacy Staff
- 📊 **Dashboard**: Manage pharmacy operations
- 💊 **Stock Management**: Update medicine availability and prices
- 📦 **Order Management**: View and process incoming orders
- ✅ **Prescription Verification**: Verify uploaded prescriptions

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Initialize and seed the database:**
   ```bash
   cd backend
   npm run seed
   cd ..
   ```

4. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

5. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
medifinder/
├── src/                    # Frontend source code
│   ├── views/              # Page components
│   ├── ui/                 # UI components
│   ├── store/              # State management
│   ├── services/           # API services
│   └── styles/             # Global styles
├── backend/                # Backend API server
│   ├── src/
│   │   ├── server.js       # Express server
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── database/       # Database layer
│   └── data/              # Database files
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.3 - Type safety
- **Vite** 5.4.8 - Build tool
- **Tailwind CSS** 3.4.14 - Styling
- **React Router** 6.26.2 - Routing
- **Zustand** 4.5.2 - State management
- **Leaflet** 1.9.4 - Maps

### Backend
- **Express.js** 4.18.2 - Web framework
- **SQLite** (better-sqlite3) - Database
- **bcryptjs** 2.4.3 - Password hashing
- **jsonwebtoken** 9.0.2 - JWT authentication

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for Kigali, Rwanda**
