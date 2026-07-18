import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Download, MapPin, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const NATIONAL = {
  totalChildren: '158M+', centers: '1.4M', normalPct: 69, samPct: 11.2, coverage: 88,
  stateSummary: [
    { state: 'Maharashtra', children: 2.1, normal: 72, sam: 10, coverage: 91 },
    { state: 'Bihar', children: 2.8, normal: 60, sam: 14, coverage: 82 },
    { state: 'UP', children: 5.2, normal: 58, sam: 14, coverage: 78 },
    { state: 'Rajasthan', children: 2.4, normal: 68, sam: 10, coverage: 86 },
    { state: 'MP', children: 3.1, normal: 63, sam: 12, coverage: 84 },
  ],
  budgetData: [
    { year: '2020', allocated: 180, utilized: 152 },
    { year: '2021', allocated: 200, utilized: 178 },
    { year: '2022', allocated: 225, utilized: 201 },
    { year: '2023', allocated: 240, utilized: 224 },
    { year: '2024', allocated: 260, utilized: 238 },
  ],
  policyActions: [
    { title: 'Scale NRC capacity in Bihar & UP', priority: 'High', status: 'In Progress' },
    { title: 'Increase RUTF procurement by 25%', priority: 'High', status: 'Pending' },
    { title: 'Train 50,000 new Anganwadi workers', priority: 'Medium', status: 'Approved' },
    { title: 'Expand PM POSHAN to 8 new districts in Maharashtra', priority: 'Medium', status: 'In Progress' },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value <= 100 ? `${p.value}%` : `₹${p.value}Cr`}</p>)}
      </div>
    );
  }
  return null;
};

export default function GovtDashboard() {
  const [view, setView] = useState('national');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="page-header">Government Dashboard</h1>
            <p className="page-subheader">National nutrition monitoring and policy insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['national', 'state'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${view === v ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* National KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Children Enrolled', value: NATIONAL.totalChildren, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Users },
          { label: 'Normal Nutrition', value: `${NATIONAL.normalPct}%`, color: 'text-green-400', bg: 'bg-green-500/10', icon: TrendingUp },
          { label: 'SAM Prevalence', value: `${NATIONAL.samPct}%`, color: 'text-red-400', bg: 'bg-red-500/10', icon: BarChart3 },
          { label: 'Coverage Rate', value: `${NATIONAL.coverage}%`, color: 'text-orange-400', bg: 'bg-orange-500/10', icon: MapPin },
          { label: 'AWC Centers', value: NATIONAL.centers, color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Shield },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`glass-card p-4 ${s.bg}`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State normal % */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">State-wise Normal Nutrition %</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={NATIONAL.stateSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="state" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} domain={[40, 80]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="normal" name="Normal %" radius={[4,4,0,0]}>
                {NATIONAL.stateSummary.map((e, i) => <Cell key={i} fill={e.normal >= 70 ? '#22c55e' : e.normal >= 60 ? '#f97316' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">ICDS Budget Utilization (₹ Crore)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={NATIONAL.budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}Cr`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
              <Line type="monotone" dataKey="allocated" stroke="#3b82f6" strokeWidth={2} name="Allocated" dot={false} />
              <Line type="monotone" dataKey="utilized" stroke="#22c55e" strokeWidth={2} name="Utilized" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">State Performance Overview</h3>
          <span className="text-white/30 text-xs">Sorted by Normal %</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['State','Children (M)','Normal %','SAM %','Coverage %','Grade'].map(h => <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {[...NATIONAL.stateSummary].sort((a,b) => b.normal - a.normal).map(row => (
                <tr key={row.state} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium text-sm">{row.state}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{row.children}M</td>
                  <td className="px-4 py-3 text-green-400 text-sm">{row.normal}%</td>
                  <td className="px-4 py-3 text-red-400 text-sm">{row.sam}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full" style={{ width: `${row.coverage}%` }} /></div>
                      <span className="text-white/60 text-xs">{row.coverage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={row.normal >= 70 ? 'badge-green' : row.normal >= 60 ? 'badge-orange' : 'badge-red'}>{row.normal >= 70 ? 'A' : row.normal >= 60 ? 'B' : 'C'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy actions */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">Priority Policy Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NATIONAL.policyActions.map(p => (
            <div key={p.title} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div>
                <p className="text-white text-sm font-medium">{p.title}</p>
                <span className={p.priority === 'High' ? 'badge-red' : 'badge-orange'}>{p.priority} Priority</span>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${p.status === 'Approved' ? 'bg-green-500/10 text-green-400' : p.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-white/50'}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
