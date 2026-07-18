import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, CheckCheck, X, Activity, AlertTriangle, Info, CheckCircle, Star } from 'lucide-react';

const initialNotifs = [
  { id: 1, type: 'alert', title: 'SAM Case: Priya Devi', msg: 'New SAM case detected in your center. Immediate action required.', time: '5 min ago', read: false, priority: 'high' },
  { id: 2, type: 'info', title: 'Attendance Reminder', msg: "Don't forget to mark today's attendance before 11 AM.", time: '30 min ago', read: false, priority: 'medium' },
  { id: 3, type: 'success', title: 'Report Submitted', msg: 'April monthly nutrition report submitted to CDPO successfully.', time: '2h ago', read: false, priority: 'low' },
  { id: 4, type: 'alert', title: 'Low Attendance This Week', msg: 'Only 68% attendance recorded this week. Below 70% threshold.', time: '3h ago', read: true, priority: 'medium' },
  { id: 5, type: 'info', title: 'Vitamin A Drive — June 15', msg: 'National Vitamin A supplementation drive scheduled for June 15. Prepare stock.', time: '1d ago', read: true, priority: 'medium' },
  { id: 6, type: 'success', title: 'Rahul Singh Recovery', msg: 'Rahul Singh has shown weight improvement — moved from SAM to MAM.', time: '1d ago', read: true, priority: 'low' },
  { id: 7, type: 'star', title: 'Monthly Target Achieved!', msg: "Your center achieved 90%+ normal nutrition rate this month. Great work!", time: '2d ago', read: true, priority: 'low' },
  { id: 8, type: 'info', title: 'Government Report Due', msg: 'ICDS quarterly report submission deadline: June 30, 2024.', time: '3d ago', read: true, priority: 'high' },
];

const typeConfig = {
  alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  star: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all');

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Notifications</h1>
          <p className="page-subheader">Stay updated with alerts and system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && <span className="badge-red">{unreadCount} unread</span>}
          <button onClick={markAllRead} className="btn-ghost text-sm flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence>
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const cfg = typeConfig[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card p-4 flex items-start gap-4 transition-all ${!notif.read ? 'border-l-2 border-green-500' : 'opacity-70'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                    {notif.priority === 'high' && <span className="badge-red text-xs">High</span>}
                  </div>
                  <p className="text-white/50 text-sm">{notif.msg}</p>
                  <p className="text-white/30 text-xs mt-1">{notif.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notif.read && (
                    <button onClick={() => markRead(notif.id)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/30 hover:text-green-400 flex items-center justify-center transition-all">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => dismiss(notif.id)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/30 hover:text-white flex items-center justify-center transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <BellOff className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 font-medium">No notifications here</p>
              <p className="text-white/25 text-sm">You're all caught up</p>
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
