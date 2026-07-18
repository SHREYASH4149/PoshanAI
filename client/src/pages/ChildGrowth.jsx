import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Plus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../contexts/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return <div className="glass-card p-3 text-xs"><p className="text-white/60 mb-1">{label}</p>{payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}</div>;
  }
  return null;
};

const emptyRecord = { month: '', weight: '', height: '', muac: '' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ChildGrowth() {
  const { children, growthData, addGrowthRecord, calcAge } = useData();
  const [selected, setSelected] = useState(children[0]?.id || null);
  const [metric, setMetric] = useState('weight');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyRecord);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const child = children.find(c => c.id === selected);
  const data = (selected && growthData[selected]) ? growthData[selected] : [];

  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const diff = (latest && prev) ? (latest[metric] - prev[metric]).toFixed(1) : null;
  const trend = diff === null ? null : diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';

  const handleAdd = (e) => {
    e.preventDefault();
    addGrowthRecord(selected, {
      month: form.month,
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      muac: parseFloat(form.muac),
    });
    setShowAdd(false);
    setForm(emptyRecord);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Child Growth Tracker</h1>
          <p className="page-subheader">Monthly growth monitoring for all enrolled children</p>
        </div>
        {selected && (
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Record
          </button>
        )}
      </div>

      {/* Child selector */}
      <div className="glass-card p-4">
        <p className="text-white/40 text-xs mb-3 font-medium">SELECT CHILD ({children.length} enrolled)</p>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
          {children.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all border ${selected === c.id ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'}`}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500/30 to-orange-500/30 flex items-center justify-center text-xs font-bold text-white">{c.name.charAt(0)}</div>
              <span>{c.name.split(' ')[0]}</span>
              <span className={c.status === 'Normal' ? 'text-green-400 text-xs' : c.status === 'MAM' ? 'text-orange-400 text-xs' : 'text-red-400 text-xs'}>●</span>
            </button>
          ))}
        </div>
      </div>

      {!selected && <div className="glass-card p-12 text-center text-white/30">Select a child above to view growth data</div>}

      {selected && child && (
        <>
          {/* Child info bar */}
          <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold">{child.name.charAt(0)}</div>
              <div>
                <h3 className="text-white font-bold">{child.name}</h3>
                <p className="text-white/40 text-sm">{calcAge(child.dob)} · {child.gender === 'M' ? 'Male' : 'Female'} · {child.village}</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { label: 'Weight', value: `${child.weight} kg`, color: 'text-blue-400' },
                { label: 'Height', value: `${child.height} cm`, color: 'text-green-400' },
                { label: 'MUAC', value: `${child.muac} cm`, color: 'text-orange-400' },
                { label: 'Status', value: child.status, color: child.status === 'Normal' ? 'text-green-400' : child.status === 'MAM' ? 'text-orange-400' : 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-white/30 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Metric selector */}
          <div className="flex gap-2">
            {[{ key: 'weight', label: 'Weight (kg)' }, { key: 'height', label: 'Height (cm)' }, { key: 'muac', label: 'MUAC (cm)' }].map(m => (
              <button key={m.key} onClick={() => setMetric(m.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${metric === m.key ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
                {m.label}
              </button>
            ))}
            {diff !== null && (
              <div className={`ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${trend === 'up' ? 'bg-green-500/10 text-green-400' : trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/50'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                {diff > 0 ? '+' : ''}{diff} from last month
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">{child.name} — {metric.charAt(0).toUpperCase() + metric.slice(1)} Trend</h3>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} domain={['auto','auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey={metric} stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name={metric} />
                  {metric === 'muac' && (
                    <>
                      <ReferenceLine y={11.5} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'SAM', fill: '#ef4444', fontSize: 10 }} />
                      <ReferenceLine y={12.5} stroke="#f97316" strokeDasharray="4 2" label={{ value: 'MAM', fill: '#f97316', fontSize: 10 }} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-white/30">No growth records yet. Click "Add Record" to start tracking.</div>
            )}
          </div>

          {/* Data table */}
          {data.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-white font-semibold">Growth Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/5">{['Month','Weight (kg)','Height (cm)','MUAC (cm)'].map(h => <th key={h} className="text-left text-white/40 text-xs px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody>
                    {[...data].reverse().map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-white text-sm font-medium">{row.month}</td>
                        <td className="px-4 py-3 text-white/60 text-sm">{row.weight}</td>
                        <td className="px-4 py-3 text-white/60 text-sm">{row.height}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${row.muac < 11.5 ? 'text-red-400' : row.muac < 12.5 ? 'text-orange-400' : 'text-green-400'}`}>{row.muac}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Record Modal */}
      {showAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold">Add Growth Record</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Month</label>
                <select required value={form.month} onChange={set('month')} className="input-field">
                  <option value="">Select month</option>
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              {[{ label: 'Weight (kg)', key: 'weight', placeholder: '13.2' }, { label: 'Height (cm)', key: 'height', placeholder: '95' }, { label: 'MUAC (cm)', key: 'muac', placeholder: '14.5' }].map(f => (
                <div key={f.key}>
                  <label className="text-white/60 text-xs mb-1.5 block">{f.label}</label>
                  <input required type="number" step="0.1" value={form[f.key]} onChange={set(f.key)} placeholder={f.placeholder} className="input-field" />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
                <button type="submit" className="btn-primary flex-1 text-sm">Save</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
