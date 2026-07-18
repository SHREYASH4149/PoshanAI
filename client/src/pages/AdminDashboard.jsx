import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Building2, BarChart3, AlertTriangle, CheckCircle, X, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '../contexts/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return <div className="glass-card p-3 text-xs"><p className="text-white/60">{label}</p>{payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}</div>;
  }
  return null;
};

const SEED_USERS = [
  { id: 1, name: 'Sunita Jadhav', role: 'Worker', center: 'AWC Hadapsar-01', status: 'active', lastLogin: '1h ago' },
  { id: 2, name: 'Rekha Patil', role: 'Worker', center: 'AWC Kondhwa-03', status: 'active', lastLogin: '3h ago' },
  { id: 3, name: 'Meena Deshmukh', role: 'Supervisor', center: 'Block Pune-A', status: 'active', lastLogin: '2d ago' },
  { id: 4, name: 'Anjali More', role: 'Worker', center: 'AWC Katraj-07', status: 'inactive', lastLogin: '5d ago' },
];

const emptyUser = { name: '', role: 'Worker', center: '', phone: '' };

export default function AdminDashboard() {
  const { children, reports, getAnalytics } = useData();
  const analytics = getAnalytics();
  const [users, setUsers] = useState(SEED_USERS);
  const [showAddUser, setShowAddUser] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  // Centers derived from villages in children data
  const centerMap = {};
  children.forEach(c => {
    if (!centerMap[c.village]) centerMap[c.village] = { name: `AWC ${c.village}`, children: 0, normal: 0, mam: 0, sam: 0, status: 'active', lastReport: '1d ago' };
    centerMap[c.village].children++;
    centerMap[c.village][c.status.toLowerCase()]++;
  });
  const centers = Object.values(centerMap);

  const perfData = centers.slice(0, 6).map(c => ({
    center: c.name.replace('AWC ', '').slice(0, 8),
    score: c.children ? Math.round((c.normal / c.children) * 100) : 0,
  }));

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers(prev => [{ id: Date.now(), ...form, status: 'active', lastLogin: 'just now' }, ...prev]);
    setShowAddUser(false);
    setForm(emptyUser);
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="page-header">Admin Dashboard</h1>
          <p className="page-subheader">Manage centers, workers, and system overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Centers', value: centers.length, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active Workers', value: users.filter(u => u.status === 'active').length, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Children', value: children.length, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'SAM Cases', value: analytics.sam, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Center Performance (Normal %)</h3>
          {perfData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={perfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="center" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Score %" radius={[4,4,0,0]}>
                  {perfData.map((e, i) => <Cell key={i} fill={e.score >= 80 ? '#22c55e' : e.score >= 60 ? '#f97316' : '#ef4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-white/30">Add children to see center performance</div>}
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5"><h3 className="text-white font-semibold">Centers ({centers.length})</h3></div>
          <div className="divide-y divide-white/5 max-h-56 overflow-y-auto">
            {centers.length === 0 ? (
              <div className="p-8 text-center text-white/30 text-sm">No centers yet — add children first</div>
            ) : centers.map(c => (
              <div key={c.name} className="flex items-center justify-between px-4 py-3 hover:bg-white/5">
                <div>
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-white/30 text-xs">{c.children} children · {c.normal}N {c.mam}M {c.sam}S</p>
                </div>
                <span className={c.status === 'active' ? 'badge-green' : 'badge-red'}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">User Management ({users.length})</h3>
          <button onClick={() => setShowAddUser(true)} className="btn-primary text-sm flex items-center gap-2 py-2"><Plus className="w-3.5 h-3.5" /> Add User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Name','Role','Center','Status','Last Login','Actions'].map(h => <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500/20 to-orange-500/20 flex items-center justify-center text-white text-xs font-bold">{user.name.charAt(0)}</div><span className="text-white text-sm">{user.name}</span></div></td>
                  <td className="px-4 py-3"><span className="badge-blue">{user.role}</span></td>
                  <td className="px-4 py-3 text-white/60 text-sm">{user.center}</td>
                  <td className="px-4 py-3"><span className={user.status === 'active' ? 'badge-green' : 'badge-red'}>{user.status}</span></td>
                  <td className="px-4 py-3 text-white/30 text-sm">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(user.id)} className={`text-xs px-2.5 py-1 rounded-lg transition-all ${user.status === 'active' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'}`}>
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold">Add New User</h2>
                <button onClick={() => setShowAddUser(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                  <input required value={form.name} onChange={set('name')} placeholder="Worker name" className="input-field" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Role</label>
                  <select value={form.role} onChange={set('role')} className="input-field">
                    <option>Worker</option><option>Supervisor</option><option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Center / Block</label>
                  <input value={form.center} onChange={set('center')} placeholder="AWC Hadapsar-01" className="input-field" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Phone</label>
                  <input value={form.phone} onChange={set('phone')} placeholder="9876543210" className="input-field" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowAddUser(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 text-sm">Add User</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
