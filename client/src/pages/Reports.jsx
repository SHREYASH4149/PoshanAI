import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Plus, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const typeColors = { monthly: 'badge-blue', quarterly: 'badge-orange', government: 'badge-red', annual: 'badge-green' };

function generateCSV(children, meals, analytics) {
  const header = ['Name', 'DOB', 'Gender', 'Weight(kg)', 'Height(cm)', 'MUAC(cm)', 'Status', 'Village', 'Guardian', 'Phone'];
  const rows = children.map(c => [c.name, c.dob, c.gender === 'M' ? 'Male' : 'Female', c.weight, c.height, c.muac, c.status, c.village, c.guardian, c.phone]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `PoshanAI_Report_${new Date().toISOString().split('T')[0]}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TYPES = ['monthly', 'quarterly', 'annual', 'government'];
const emptyForm = { title: '', type: 'monthly', month: MONTHS[new Date().getMonth()], year: new Date().getFullYear() };

export default function Reports() {
  const { reports, addReport, children, meals, getAnalytics } = useData();
  const [filter, setFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const analytics = getAnalytics();

  const filtered = reports.filter(r => filter === 'all' || r.type === filter);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    addReport({
      title: form.title || `${form.type.charAt(0).toUpperCase()+form.type.slice(1)} Report – ${form.month} ${form.year}`,
      type: form.type, month: form.month, year: parseInt(form.year),
    });
    setGenerating(false);
    setShowModal(false);
    setForm(emptyForm);
  };

  const downloadCSV = () => generateCSV(children, meals, analytics);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Reports</h1>
          <p className="page-subheader">{reports.length} reports available — generate and download</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="btn-ghost flex items-center gap-2 text-sm py-2.5">
            <Download className="w-4 h-4" /> CSV Export
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: reports.length, color: 'text-blue-400' },
          { label: 'Ready', value: reports.filter(r => r.status === 'ready').length, color: 'text-green-400' },
          { label: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: 'text-orange-400' },
          { label: 'Children in Data', value: children.length, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'monthly', 'quarterly', 'annual', 'government'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30">No reports found. Click "Generate Report" to create one.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((report, i) => (
              <motion.div key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.status === 'ready' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                    {report.status === 'ready' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Clock className="w-5 h-5 text-orange-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{report.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={typeColors[report.type] || 'badge-blue'}>{report.type}</span>
                      <span className="text-white/30 text-xs">{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={report.status === 'ready' ? 'badge-green' : 'badge-orange'}>{report.status}</span>
                  {report.status === 'ready' && (
                    <button onClick={downloadCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Generate New Report</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Report Title (optional)</label>
                  <input value={form.title} onChange={set('title')} placeholder="Auto-generated if blank" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Type</label>
                    <select value={form.type} onChange={set('type')} className="input-field">
                      {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Year</label>
                    <input type="number" min="2020" max="2030" value={form.year} onChange={set('year')} className="input-field" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/60 text-xs mb-1.5 block">Month</label>
                    <select value={form.month} onChange={set('month')} className="input-field">
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400">
                  Data snapshot: {children.length} children · {meals.length} meal records · {analytics.total ? Math.round(analytics.normal/analytics.total*100) : 0}% normal nutrition
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
                  <button type="submit" disabled={generating} className="btn-primary flex-1 text-sm">
                    {generating ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />Generating...</> : 'Generate'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
