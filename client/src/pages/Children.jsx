import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Eye, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const statusColor = { Normal: 'badge-green', MAM: 'badge-orange', SAM: 'badge-red' };

const emptyForm = { name: '', dob: '', gender: 'M', weight: '', height: '', muac: '', guardian: '', village: '', phone: '' };

export default function Children() {
  const { children, addChild, deleteChild, calcAge } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewChild, setViewChild] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.village.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    addChild(form);
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Children Registry</h1>
          <p className="page-subheader">Manage all enrolled children — {children.length} registered</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Child
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or village..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {['All', 'Normal', 'MAM', 'SAM'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: children.length, color: 'text-white' },
          { label: 'Normal', value: children.filter(c => c.status === 'Normal').length, color: 'text-green-400' },
          { label: 'MAM', value: children.filter(c => c.status === 'MAM').length, color: 'text-orange-400' },
          { label: 'SAM', value: children.filter(c => c.status === 'SAM').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30">No children found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Age', 'Gender', 'Weight', 'Height', 'MUAC', 'Village', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((child, i) => (
                  <motion.tr key={child.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-orange-500/20 flex items-center justify-center text-white text-xs font-bold">{child.name.charAt(0)}</div>
                        <span className="text-white text-sm font-medium">{child.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">{calcAge(child.dob)}</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{child.gender === 'M' ? 'Male' : 'Female'}</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{child.weight} kg</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{child.height} cm</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{child.muac} cm</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{child.village}</td>
                    <td className="px-4 py-3"><span className={statusColor[child.status]}>{child.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewChild(child)} className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-all"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteChild(child.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Add New Child</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-white/60 text-xs mb-1.5 block">Full Name *</label>
                    <input required value={form.name} onChange={set('name')} placeholder="Child's name" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Date of Birth *</label>
                    <input required type="date" value={form.dob} onChange={set('dob')} className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Gender</label>
                    <select value={form.gender} onChange={set('gender')} className="input-field">
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Weight (kg) *</label>
                    <input required type="number" step="0.1" min="1" max="30" value={form.weight} onChange={set('weight')} placeholder="12.5" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Height (cm) *</label>
                    <input required type="number" min="30" max="130" value={form.height} onChange={set('height')} placeholder="95" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">MUAC (cm) *</label>
                    <input required type="number" step="0.1" min="8" max="20" value={form.muac} onChange={set('muac')} placeholder="13.5" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Guardian Name</label>
                    <input value={form.guardian} onChange={set('guardian')} placeholder="Parent/Guardian" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Village / Area</label>
                    <input value={form.village} onChange={set('village')} placeholder="e.g. Hadapsar" className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/60 text-xs mb-1.5 block">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" className="input-field" />
                  </div>
                </div>
                <p className="text-white/30 text-xs">Status (Normal/MAM/SAM) is auto-calculated from MUAC value.</p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 text-sm">Add Child</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewChild && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">Child Details</h2>
                <button onClick={() => setViewChild(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">{viewChild.name.charAt(0)}</div>
                <div>
                  <h3 className="text-white font-bold text-xl">{viewChild.name}</h3>
                  <span className={statusColor[viewChild.status]}>{viewChild.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Age', value: calcAge(viewChild.dob) },
                  { label: 'Gender', value: viewChild.gender === 'M' ? 'Male' : 'Female' },
                  { label: 'Weight', value: `${viewChild.weight} kg` },
                  { label: 'Height', value: `${viewChild.height} cm` },
                  { label: 'MUAC', value: `${viewChild.muac} cm` },
                  { label: 'Guardian', value: viewChild.guardian || '–' },
                  { label: 'Village', value: viewChild.village || '–' },
                  { label: 'Phone', value: viewChild.phone || '–' },
                ].map(d => (
                  <div key={d.label} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs">{d.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
