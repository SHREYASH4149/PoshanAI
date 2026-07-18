import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Children from './pages/Children';
import NutritionAnalysis from './pages/NutritionAnalysis';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Chatbot from './pages/Chatbot';
import GeoTracking from './pages/GeoTracking';
import MealHistory from './pages/MealHistory';
import GovtAnalytics from './pages/GovtAnalytics';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import GovtDashboard from './pages/GovtDashboard';
import ChildGrowth from './pages/ChildGrowth';
import MalnutritionDetection from './pages/MalnutritionDetection';
import Notifications from './pages/Notifications';
import AIPlateDetection from './pages/AIPlateDetection';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/children" element={<PrivateRoute><Layout><Children /></Layout></PrivateRoute>} />
            <Route path="/nutrition" element={<PrivateRoute><Layout><NutritionAnalysis /></Layout></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><Layout><Attendance /></Layout></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Layout><Reports /></Layout></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
            <Route path="/alerts" element={<PrivateRoute><Layout><Alerts /></Layout></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><Layout><Chatbot /></Layout></PrivateRoute>} />
            <Route path="/geo-tracking" element={<PrivateRoute><Layout><GeoTracking /></Layout></PrivateRoute>} />
            <Route path="/meal-history" element={<PrivateRoute><Layout><MealHistory /></Layout></PrivateRoute>} />
            <Route path="/govt-analytics" element={<PrivateRoute><Layout><GovtAnalytics /></Layout></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Layout><AdminDashboard /></Layout></PrivateRoute>} />
            <Route path="/worker-dashboard" element={<PrivateRoute><Layout><WorkerDashboard /></Layout></PrivateRoute>} />
            <Route path="/govt-dashboard" element={<PrivateRoute><Layout><GovtDashboard /></Layout></PrivateRoute>} />
            <Route path="/child-growth" element={<PrivateRoute><Layout><ChildGrowth /></Layout></PrivateRoute>} />
            <Route path="/malnutrition" element={<PrivateRoute><Layout><MalnutritionDetection /></Layout></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Layout><Notifications /></Layout></PrivateRoute>} />
            <Route path="/ai-plate" element={<PrivateRoute><Layout><AIPlateDetection /></Layout></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
