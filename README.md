# PoshanAI — AI-Powered Anganwadi Nutrition Monitoring System

A full-stack web application for monitoring child nutrition in Indian Anganwadi centers, built with React + Vite (frontend) and Node.js + Express (backend).

## Tech Stack

| Layer | Technology |
|---------|------------|
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

## Quick Start

### Prerequisites

- Node.js v18+
- Git (optional)

### Setup Client

```powershell
cd PoshanAI\client
npm install
copy .env.example .env
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

### Setup Server

```powershell
cd PoshanAI\server
npm install
copy .env.example .env
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication → Email/Password.
3. Enable Firestore Database.
4. Copy Firebase configuration values into `client/.env`.

## Environment Variables

### client/.env

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### server/.env

```env
PORT=5000
OPENAI_API_KEY=your_key
```

## Build for Production

```powershell
cd PoshanAI\client
npm run build
```

## License

MIT License