import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Users, Download, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

const STATE_DATA = {
  Maharashtra: {
    children: '2.1M', centers: '96,000', normal: 72, mam: 18, sam: 10, coverage: 91,
    districts: [
      { district: 'Pune', total: 62000, normal: 75, mam: 17, sam: 8 },
      { district: 'Nashik', total: 55000, normal: 70, mam: 19, sam: 11 },
      { district: 'Aurangabad', total: 48000, normal: 65, mam: 22, sam: 13 },
      { district: 'Nagpur', total: 52000, normal: 73, mam: 18, sam: 9 },
      { district: 'Solapur', total: 44000, normal: 68, mam: 20, sam: 12 },
    ],
    trend: [
      { year: '2020', sam: 14, mam: 22, normal: 64 },
      { year: '2021', sam: 13, mam: 21, normal: 66 },
      { year: '2022', sam: 12, mam: 20, normal: 68 },
      { year: '2023', sam: 11, mam: 19, normal: 70 },
      { year: '2024', sam: 10, mam: 18, normal: 72 },
    ],
    schemes: [
      { scheme: 'ICDS', coverage: 91 }, { scheme: 'PM POSHAN', coverage: 94 },
      { scheme: 'NRC Referral', coverage: 80 }, { scheme: 'Vitamin A', coverage: 87 },
      { scheme: 'Iron Folic', coverage: 83 }, { scheme: 'NHM', coverage: 89 },
    ],
  },
  Bihar: {
    children: '2.8M', centers: '1,12,000', normal: 60, mam: 26, sam: 14, coverage: 82,
    districts: [
      { district: 'Patna', total: 48500, normal: 65, mam: 23, sam: 12 },
      { district: 'Nalanda', total: 42000, normal: 60, mam: 26, sam: 14 },
      { district: 'Gaya', total: 55000, normal: 55, mam: 28, sam: 17 },
      { district: 'Muzaffarpur', total: 61000, normal: 58, mam: 27, sam: 15 },
      { district: 'Bhagalpur', total: 38000, normal: 63, mam: 24, sam: 13 },
    ],
    trend: [
      { year: '2020', sam: 20, mam: 30, normal: 50 },
      { year: '2021', sam: 18, mam: 29, normal: 53 },
      { year: '2022', sam: 17, mam: 28, normal: 55 },
      { year: '2023', sam: 15, mam: 27, normal: 58 },
      { year: '2024', sam: 14, mam: 26, normal: 60 },
    ],
    schemes: [
      { scheme: 'ICDS', coverage: 82 }, { scheme: 'PM POSHAN', coverage: 85 },
      { scheme: 'NRC Referral', coverage: 68 }, { scheme: 'Vitamin A', coverage: 74 },
      { scheme: 'Iron Folic', coverage: 70 }, { scheme: 'NHM', coverage: 78 },
    ],
  },
  'Uttar Pradesh': {
    children: '5.2M', centers: '1,89,000', normal: 58, mam: 28, sam: 14, coverage: 78,
    districts: [
      { district: 'Lucknow', total: 72000, normal: 65, mam: 23, sam: 12 },
      { district: 'Kanpur', total: 68000, normal: 60, mam: 26, sam: 14 },
      { district: 'Varanasi', total: 55000, normal: 57, mam: 28, sam: 15 },
      { district: 'Agra', total: 62000, normal: 63, mam: 24, sam: 13 },
      { district: 'Gorakhpur', total: 48000, normal: 54, mam: 30, sam: 16 },
    ],
    trend: [
      { year: '2020', sam: 18, mam: 32, normal: 50 },
      { year: '2021', sam: 17, mam: 31, normal: 52 },
      { year: '2022', sam: 16, mam: 30, normal: 54 },
      { year: '2023', sam: 15, mam: 29, normal: 56 },
      { year: '2024', sam: 14, mam: 28, normal: 58 },
    ],
    schemes: [
      { scheme: 'ICDS', coverage: 78 }, { scheme: 'PM POSHAN', coverage: 82 },
      { scheme: 'NRC Referral', coverage: 65 }, { scheme: 'Vitamin A', coverage: 71 },
      { scheme: 'Iron Folic', coverage: 68 }, { scheme: 'NHM', coverage: 75 },
    ],
  },
  Rajasthan: {
    children: '2.4M', centers: '88,000', normal: 68, mam: 22, sam: 10, coverage: 86,
    districts: [
      { district: 'Jaipur', total: 55000, normal: 72, mam: 20, sam: 8 },
      { district: 'Jodhpur', total: 48000, normal: 68, mam: 22, sam: 10 },
      { district: 'Udaipur', total: 42000, normal: 65, mam: 24, sam: 11 },
      { district: 'Kota', total: 38000, normal: 70, mam: 21, sam: 9 },
      { district: 'Ajmer', total: 35000, normal: 66, mam: 23, sam: 11 },
    ],
    trend: [
      { year: '2020', sam: 14, mam: 26, normal: 60 },
      { year: '2021', sam: 13, mam: 25, normal: 62 },
      { year: '2022', sam: 12, mam: 24, normal: 64 },
      { year: '2023', sam: 11, mam: 23, normal: 66 },
      { year: '2024', sam: 10, mam: 22, normal: 68 },
    ],
    schemes: [
      { scheme: 'ICDS', coverage: 86 }, { scheme: 'PM POSHAN', coverage: 90 },
      { scheme: 'NRC Referral', coverage: 76 }, { scheme: 'Vitamin A', coverage: 82 },
      { scheme: 'Iron Folic', coverage: 79 }, { scheme: 'NHM', coverage: 85 },
    ],
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs space-y-1">
        <p className="text-white/60 font-medium mb-1">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}{p.value <= 100 ? '%' : ''}</p>)}
      </div>
    );
  }
  return null;
};

export default function GovtAnalytics() {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const sd = STATE_DATA[selectedState];

  function downloadStateCSV() {
    const header = ['District', 'Total Children', 'Normal %', 'MAM %', 'SAM %'];
    const rows = sd.districts.map(d => [d.district, d.total, d.normal, d.mam, d.sam]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `GovtReport_${selectedState}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header">Government Analytics</h1>
          <p className="page-subheader">State-level nutrition data for policy and decision-making</p>
        </div>
        <div className="flex gap-2">
          <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="input-field text-sm w-44">
            {Object.keys(STATE_DATA).map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={downloadStateCSV} className="btn-primary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* State Summary */}
      <div className="glass-card p-5 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-green-400" />
          <h3 className="text-white font-bold text-lg">{selectedState} — State Overview</h3>
          <span className="badge-green">Live</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Children', value: sd.children },
            { label: 'Anganwadis', value: sd.centers },
            { label: 'Normal %', value: `${sd.normal}%` },
            { label: 'SAM Cases', value: `${sd.sam}%` },
            { label: 'Coverage', value: `${sd.coverage}%` },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">District-wise Nutrition Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sd.districts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="district" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
              <Bar dataKey="normal" fill="#22c55e" name="Normal %" radius={[3,3,0,0]} />
              <Bar dataKey="mam" fill="#f97316" name="MAM %" radius={[3,3,0,0]} />
              <Bar dataKey="sam" fill="#ef4444" name="SAM %" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">5-Year Malnutrition Trend — {selectedState}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={sd.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }} />
              <Line type="monotone" dataKey="normal" stroke="#22c55e" strokeWidth={2} dot={false} name="Normal %" />
              <Line type="monotone" dataKey="mam" stroke="#f97316" strokeWidth={2} dot={false} name="MAM %" />
              <Line type="monotone" dataKey="sam" stroke="#ef4444" strokeWidth={2} dot={false} name="SAM %" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scheme coverage */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-5">Government Scheme Coverage — {selectedState}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sd.schemes.map(scheme => (
            <div key={scheme.scheme} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">{scheme.scheme}</span>
                <span className={`font-medium ${scheme.coverage >= 85 ? 'text-green-400' : scheme.coverage >= 75 ? 'text-orange-400' : 'text-red-400'}`}>{scheme.coverage}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${scheme.coverage}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full" style={{ background: scheme.coverage >= 85 ? '#22c55e' : scheme.coverage >= 75 ? '#f97316' : '#ef4444' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* District table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">District Performance — {selectedState}</h3>
          <button onClick={downloadStateCSV} className="btn-ghost text-xs flex items-center gap-1.5 py-1.5"><Download className="w-3.5 h-3.5" /> CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['District','Total Children','Normal %','MAM %','SAM %','Grade'].map(h => <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {sd.districts.map(row => (
                <tr key={row.district} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white text-sm font-medium">{row.district}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{row.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-green-400 text-sm">{row.normal}%</td>
                  <td className="px-4 py-3 text-orange-400 text-sm">{row.mam}%</td>
                  <td className="px-4 py-3 text-red-400 text-sm">{row.sam}%</td>
                  <td className="px-4 py-3"><span className={row.normal >= 70 ? 'badge-green' : row.normal >= 60 ? 'badge-orange' : 'badge-red'}>{row.normal >= 70 ? 'A' : row.normal >= 60 ? 'B' : 'C'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
