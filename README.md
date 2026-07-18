# PoshanAI — AI-Powered Anganwadi Nutrition Monitoring System

A full-stack web application for monitoring child nutrition in Indian Anganwadi centers, built with React + Vite (frontend) and Node.js + Express (backend).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Auth/DB | Firebase Auth + Firestore |
| Backend | Node.js + Express |
| AI | OpenAI API (optional) |
| PDF | jsPDF |

## Features

- Landing Page with animated sections
- Firebase Authentication (Login / Register / Roles)
- Multi-role Dashboards (Worker / Admin / Government)
- Child Registry with CRUD operations
- Nutrition Analysis (radar charts, nutrient breakdown)
- AI Plate Detection (meal photo upload + analysis)
- AI Chatbot (nutrition Q&A with OpenAI fallback)
- Attendance Tracking (daily marking)
- Meal History Logging
- Child Growth Tracking (weight, height, MUAC charts)
- Malnutrition Detection (SAM/MAM risk assessment)
- Geo Tracking (Anganwadi center map)
- Alerts & Notifications
- Government Analytics & Reports
- PDF Report Export
- Glassmorphism UI with dark theme

## Quick Start (Windows / VS Code)

### Prerequisites
- Node.js v18+ → https://nodejs.org
- Git (optional)

### 1. Setup Client
```powershell
cd PoshanAI\client
npm install
copy .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```
Frontend runs at: http://localhost:5173

### 2. Setup Server (optional)
```powershell
cd PoshanAI\server
npm install
copy .env.example .env
# Edit .env with your keys
npm run dev
```
Backend runs at: http://localhost:5000

## Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** (test mode)
5. Copy config values to `client/.env`

## Environment Variables

### client/.env
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### server/.env
```
PORT=5000
OPENAI_API_KEY=your_key  (optional - app works without it)
```

## Project Structure

```
PoshanAI/
├── client/
│   ├── src/
│   │   ├── App.jsx              # Router + auth guards
│   │   ├── firebase.js          # Firebase config
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Auth provider
│   │   ├── components/
│   │   │   ├── Layout.jsx       # App shell
│   │   │   ├── Sidebar.jsx      # Navigation
│   │   │   └── Navbar.jsx       # Top bar
│   │   └── pages/               # All 20+ pages
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── server/
    ├── index.js                 # Express app entry
    ├── routes/
    │   ├── children.js          # CRUD children
    │   ├── nutrition.js         # Meal & nutrition
    │   ├── reports.js           # Report generation
    │   ├── analytics.js         # Analytics data
    │   └── ai.js                # Chatbot & plate detection
    └── package.json
```

## Build for Production

```powershell
cd PoshanAI\client
npm run build
# Output in client/dist/
```

## Demo Accounts

The app uses Firebase Auth. Register a new account or use demo credentials shown on the Login page.

## License

MIT — Free to use and modify
