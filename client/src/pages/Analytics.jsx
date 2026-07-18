import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, BarChart3, Users, Activity } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs space-y-1">
        <p className="text-white/60 font-medium mb-1">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { children, meals, getAnalytics } = useData();
  const [range, setRange] = useState('6M');
  const analytics = getAnalytics();

  // Village bar data from real children
  const villageData = analytics.byVillage.map(v => ({
    village: v.village.length > 8 ? v.village.slice(0, 8) : v.village,
    Normal: v.normal, MAM: v.mam, SAM: v.sam,
  }));

  // Age group data from real children
  const ageData = analytics.byAge.map(a => ({
    group: a.group, boys: 0, girls: 0,
    normal: a.normal, mam: a.mam, sam: a.sam,
  }));
  children.forEach(c => {
    const age = (new Date() - new Date(c.dob)) / (365.25 * 24 * 3600 * 1000);
    const grp = age < 1 ? '0-1y' : age < 2 ? '1-2y' : age < 3 ? '2-3y' : age < 4 ? '3-4y' : age < 5 ? '4-5y' : '5+y';
    const row = ageData.find(a => a.group === grp);
    if (row) { if (c.gender === 'M') row.boys++; else row.girls++; }
  });

  // Nutrient coverage from meals
  const recentMeals = meals.slice(0, 14);
  const avgCal = recentMeals.length ? Math.round(recentMeals.reduce((a, m) => a + (m.calories || 0), 0) / recentMeals.length) : 0;
  const avgPro = recentMeals.length ? (recentMeals.reduce((a, m) => a + (m.protein || 0), 0) / recentMeals.length).toFixed(1) : 0;

  const nutrientData = [
    { subject: 'Protein', value: Math.min(100, Math.round((avgPro / 15) * 100)), fullMark: 100 },
    { subject: 'Calories', value: Math.min(100, Math.round((avgCal / 400) * 100)), fullMark: 100 },
    { subject: 'Iron', value: 55, fullMark: 100 },
    { subject: 'Calcium', value: 68, fullMark: 100 },
    { subject: 'Vitamin A', value: 45, fullMark: 100 },
    { subject: 'Zinc', value: 50, fullMark: 100 },
  ];

  const pieData = [
    { name: 'Normal', value: analytics.normal, color: '#22c55e' },
    { name: 'MAM', value: analytics.mam, color: '#f97316' },
    { name: 'SAM', value: analytics.sam, color: '#ef4444' },
  ];

  // Attendance trend
  const attTrend = analytics.attDays.slice().reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Analytics</h1>
          <p className="page-subheader">Data-driven insights from your {children.length} enrolled children</p>
        </div>
        <div className="flex gap-2">
          {['1M', '3M', '6M', '1Y'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${range === r ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled', value: analytics.total, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Users },
          { label: 'Normal %', value: analytics.total ? `${Math.round(analytics.normal/analytics.total*100)}%` : '0%', color: 'text-green-400', bg: 'bg-green-500/10', icon: TrendingUp },
          { label: 'SAM + MAM', value: analytics.mam + analytics.sam, color: 'text-red-400', bg: 'bg-red-500/10', icon: Activity },
          { label: 'Avg Meal Cal', value: avgCal || '–', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: BarChart3 },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`glass-card p-5 ${s.bg}`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village-wise distribution */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Area-wise Nutrition Status</h3>
          {villageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={villageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="village" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
                <Bar dataKey="Normal" fill="#22c55e" radius={[3,3,0,0]} />
                <Bar dataKey="MAM" fill="#f97316" radius={[3,3,0,0]} />
                <Bar dataKey="SAM" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-white/30">No data yet</div>}
        </div>

        {/* Nutrition pie */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Nutrition Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {pieData.map(p => (
              <div key={p.name} className="text-center p-2 rounded-xl bg-white/5">
                <div className="text-lg font-bold" style={{ color: p.color }}>{p.value}</div>
                <div className="text-white/40 text-xs">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age group */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Age Group Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="group" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
              <Bar dataKey="boys" fill="#3b82f6" radius={[3,3,0,0]} name="Boys" />
              <Bar dataKey="girls" fill="#ec4899" radius={[3,3,0,0]} name="Girls" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Nutrient radar */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Nutrient Coverage (% of RDA)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={nutrientData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
              <Radar name="Coverage" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance trend */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">Daily Attendance – Last 7 Days</h3>
        {attTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
              <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} dot={false} name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={false} name="Absent" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="h-40 flex items-center justify-center text-white/30">Mark attendance to see trends</div>}
      </div>
    </div>
  );
}
