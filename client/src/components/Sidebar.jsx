import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Apple, CalendarCheck, BarChart3,
  Bell, Bot, MapPin, UtensilsCrossed, TrendingUp,
  Settings, Shield, Microscope, Camera, FileText,
  Activity, X, Leaf, ChevronRight, LogOut, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Children', icon: Users, path: '/children' },
  { label: 'Nutrition', icon: Apple, path: '/nutrition' },
  { label: 'Attendance', icon: CalendarCheck, path: '/attendance' },
  { label: 'Meal History', icon: UtensilsCrossed, path: '/meal-history' },
  { label: 'AI Plate Detection', icon: Camera, path: '/ai-plate' },
  { label: 'Child Growth', icon: TrendingUp, path: '/child-growth' },
  { label: 'Malnutrition', icon: Microscope, path: '/malnutrition' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Reports', icon: FileText, path: '/reports' },
  { label: 'Geo Tracking', icon: MapPin, path: '/geo-tracking' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Notifications', icon: Activity, path: '/notifications' },
  { label: 'AI Chatbot', icon: Bot, path: '/chatbot' },
  { label: 'Govt Analytics', icon: Globe, path: '/govt-analytics' },
  { label: 'Govt Dashboard', icon: Shield, path: '/govt-dashboard' },
  { label: 'Admin Panel', icon: Shield, path: '/admin' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout, currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 z-30 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center glow-green">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">PoshanAI</h1>
              <p className="text-green-400 text-xs mt-0.5">Nutrition Monitor</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/5">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{currentUser?.displayName || 'User'}</p>
              <p className="text-white/40 text-xs truncate">{userProfile?.role || 'Worker'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-green-400' : 'text-white/40 group-hover:text-white/70'}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-green-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
