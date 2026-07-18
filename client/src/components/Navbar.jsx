import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { currentUser, userProfile } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { id: 1, msg: 'Ravi Kumar flagged as severely malnourished', time: '2m ago', type: 'alert' },
    { id: 2, msg: 'Monthly nutrition report generated', time: '1h ago', type: 'info' },
    { id: 3, msg: 'Attendance marked for AWC-1042', time: '3h ago', type: 'success' },
  ];

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64">
          <Search className="w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search children, reports..."
            className="bg-transparent text-white/70 text-sm placeholder-white/30 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-3 space-y-2 z-50">
              <p className="text-white font-semibold text-sm px-2 pb-1 border-b border-white/10">Notifications</p>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.type === 'alert' ? 'bg-red-400' : n.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-white/80 text-xs leading-relaxed">{n.msg}</p>
                    <p className="text-white/30 text-xs mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/settings" className="flex items-center gap-2 hover:bg-white/5 rounded-xl px-2 py-1.5 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
            {currentUser?.displayName?.charAt(0) || 'U'}
          </div>
          <span className="hidden md:block text-white/70 text-sm">{currentUser?.displayName || 'User'}</span>
          <ChevronDown className="hidden md:block w-3 h-3 text-white/30" />
        </Link>
      </div>
    </header>
  );
}
