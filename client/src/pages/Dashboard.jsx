import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Apple, AlertTriangle, CheckCircle, Activity, ArrowUp, ArrowDown, CalendarCheck, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return <div className="glass-card p-3 text-xs"><p className="text-white/60 mb-1">{label}</p>{payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}</div>;
  }
  return null;
};

const COLORS = { Normal: '#22c55e', MAM: '#f97316', SAM: '#ef4444' };

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { children, meals, getAnalytics, calcAge } = useData();
  const analytics = getAnalytics();

  const pieData = [
    { name: 'Normal', value: analytics.normal, color: COLORS.Normal },
    { name: 'MAM', value: analytics.mam, color: COLORS.MAM },
    { name: 'SAM', value: analytics.sam, color: COLORS.SAM },
  ];

  const stats = [
    { label: 'Total Children', value: analytics.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Normal Nutrition', value: analytics.normal, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'MAM Cases', value: analytics.mam, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'SAM Cases', value: analytics.sam, icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const recentChildren = [...children].slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Good morning, {currentUser?.displayName?.split(' ')[0] || 'User'} 👋</h1>
        <p className="page-subheader">Here's the nutrition overview for your Anganwadi center — Pune</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Attendance – Last 7 Days</h3>
            <span className="badge-green">Daily</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.attDays.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="present" fill="#22c55e" radius={[4,4,0,0]} name="Present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4,4,0,0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Nutrition Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {pieData.map(p => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} /><span className="text-white/60">{p.name}</span></div>
                <span className="text-white font-medium">{analytics.total ? Math.round(p.value/analytics.total*100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village breakdown */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Village / Area Breakdown</h3>
            <Link to="/analytics" className="text-green-400 text-xs hover:text-green-300 flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {analytics.byVillage.map(v => (
              <div key={v.village} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10">
                <span className="text-white/70 text-sm">{v.village}</span>
                <div className="flex gap-2 text-xs">
                  <span className="text-green-400">{v.normal}N</span>
                  <span className="text-orange-400">{v.mam}M</span>
                  <span className="text-red-400">{v.sam}S</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent children */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Children</h3>
            <Link to="/children" className="text-green-400 text-xs hover:text-green-300 flex items-center gap-1">All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recentChildren.map(child => (
              <div key={child.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-orange-500/20 flex items-center justify-center text-white text-xs font-bold">{child.name.charAt(0)}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{child.name}</p>
                    <p className="text-white/30 text-xs">{calcAge(child.dob)} · {child.weight} kg</p>
                  </div>
                </div>
                <span className={child.status === 'Normal' ? 'badge-green' : child.status === 'MAM' ? 'badge-orange' : 'badge-red'}>{child.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Mark Attendance', icon: CalendarCheck, path: '/attendance', color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Add Child', icon: Users, path: '/children', color: 'bg-green-500/10 text-green-400' },
            { label: 'Log Meal', icon: Apple, path: '/meal-history', color: 'bg-orange-500/10 text-orange-400' },
            { label: 'View Alerts', icon: AlertTriangle, path: '/alerts', color: 'bg-red-500/10 text-red-400' },
          ].map(a => (
            <Link key={a.label} to={a.path} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
              <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center`}><a.icon className="w-4 h-4" /></div>
              <span className="text-white/70 text-sm font-medium group-hover:text-white">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
