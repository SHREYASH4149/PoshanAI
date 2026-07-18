import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell, Filter } from 'lucide-react';

const allAlerts = [
  { id: 1, type: 'critical', title: 'SAM Case Detected', msg: 'Priya Devi (2y 8m) has been identified as Severely Acutely Malnourished. Immediate intervention required.', time: '10 min ago', child: 'Priya Devi', resolved: false },
  { id: 2, type: 'warning', title: 'MAM Status Update', msg: 'Rahul Singh (4y 1m) continues to show MAM indicators. Weight gain is below target for 2 consecutive months.', time: '1h ago', child: 'Rahul Singh', resolved: false },
  { id: 3, type: 'warning', title: 'Low Attendance Alert', msg: 'Attendance dropped below 70% this week. 12 children were absent for 3+ consecutive days.', time: '3h ago', child: null, resolved: false },
  { id: 4, type: 'info', title: 'Supplementation Due', msg: 'Monthly Vitamin A supplementation due for 18 children aged 6m–5y. Schedule distribution at next session.', time: '5h ago', child: null, resolved: false },
  { id: 5, type: 'info', title: 'Report Generated', msg: 'Monthly nutrition report for May 2024 has been auto-generated and is ready for submission.', time: '1d ago', child: null, resolved: true },
  { id: 6, type: 'success', title: 'Recovery Milestone', msg: 'Kavita Sharma (3y) has graduated from MAM to Normal nutrition status after 3 months of intervention!', time: '2d ago', child: 'Kavita Sharma', resolved: true },
  { id: 7, type: 'critical', title: 'Growth Faltering', msg: 'Amit Kumar (18m) shows growth faltering with no weight gain in the last 4 weeks. Follow-up required.', time: '2d ago', child: 'Amit Kumar', resolved: false },
];

const typeConfig = {
  critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', badge: 'badge-red' },
  warning: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', badge: 'badge-orange' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', badge: 'badge-blue' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', badge: 'badge-green' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(allAlerts);
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'active') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return a.type === filter;
  });

  const resolve = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const counts = {
    critical: alerts.filter(a => a.type === 'critical' && !a.resolved).length,
    warning: alerts.filter(a => a.type === 'warning' && !a.resolved).length,
    active: alerts.filter(a => !a.resolved).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Alerts & Notifications</h1>
          <p className="page-subheader">Critical health and nutrition alerts requiring attention</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-red">{counts.critical} Critical</span>
          <span className="badge-orange">{counts.warning} Warnings</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: counts.active, color: 'text-white', bg: 'bg-white/5' },
          { label: 'Critical', value: counts.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Warnings', value: counts.warning, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Resolved', value: alerts.filter(a => a.resolved).length, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'critical', 'warning', 'info', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <AnimatePresence>
        <div className="space-y-3">
          {filtered.map(alert => {
            const cfg = typeConfig[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass-card p-4 border ${cfg.bg} ${alert.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <cfg.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                        <span className={cfg.badge}>{alert.type}</span>
                        {alert.resolved && <span className="badge-green">Resolved</span>}
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">{alert.msg}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white/30 text-xs">{alert.time}</span>
                        {alert.child && <span className="text-white/40 text-xs">· {alert.child}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!alert.resolved && (
                      <button onClick={() => resolve(alert.id)} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-all">
                        Resolve
                      </button>
                    )}
                    <button onClick={() => dismiss(alert.id)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/30 hover:text-white flex items-center justify-center transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No alerts found</p>
              <p className="text-sm">All clear for this category</p>
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
