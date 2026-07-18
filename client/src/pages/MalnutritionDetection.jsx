import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, AlertTriangle, CheckCircle, Upload, X, RotateCcw } from 'lucide-react';

const cases = [
  { id: 1, name: 'Priya Devi', age: '2y 8m', weight: 9.1, height: 82, muac: 11.0, whz: -3.2, status: 'SAM', risk: 98, oedema: false, intervention: 'NRC Referral' },
  { id: 2, name: 'Amit Kumar', age: '1y 6m', weight: 7.8, height: 74, muac: 11.4, whz: -3.0, status: 'SAM', risk: 95, oedema: true, intervention: 'NRC Referral' },
  { id: 3, name: 'Rahul Singh', age: '4y 1m', weight: 11.8, height: 98, muac: 13.1, whz: -2.4, status: 'MAM', risk: 62, oedema: false, intervention: 'RUTF + Follow-up' },
  { id: 4, name: 'Vikram Patel', age: '4y 3m', weight: 12.4, height: 100, muac: 13.5, whz: -2.1, status: 'MAM', risk: 55, oedema: false, intervention: 'Supplementary Feeding' },
  { id: 5, name: 'Sunita Kumari', age: '3y 9m', weight: 13.8, height: 97, muac: 14.2, whz: -1.2, status: 'Normal', risk: 15, oedema: false, intervention: 'Regular Monitoring' },
];

const statusConfig = {
  SAM: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', badge: 'badge-red' },
  MAM: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', badge: 'badge-orange' },
  Normal: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', badge: 'badge-green' },
};

export default function MalnutritionDetection() {
  const [form, setForm] = useState({ name: '', age: '', weight: '', height: '', muac: '', oedema: false });
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const analyzeChild = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    const muac = parseFloat(form.muac);
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height);
    const whz = ((weight - 14) / 1.5).toFixed(1);
    let status, risk, intervention;
    if (muac < 11.5 || form.oedema) { status = 'SAM'; risk = 96; intervention = 'Immediate NRC Referral Required'; }
    else if (muac < 12.5 || weight < 10) { status = 'MAM'; risk = 65; intervention = 'RUTF Supplementation + Weekly Monitoring'; }
    else { status = 'Normal'; risk = 12; intervention = 'Continue Regular Monthly Monitoring'; }
    setResult({ name: form.name, age: form.age, weight, height, muac, whz, status, risk, intervention, oedema: form.oedema });
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Malnutrition Detection</h1>
        <p className="page-subheader">AI-assisted screening using anthropometric measurements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Assessment Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Microscope className="w-5 h-5 text-green-400" /> Quick Assessment
            </h3>
            <form onSubmit={analyzeChild} className="space-y-4">
              <div>
                <label className="text-white/60 text-xs mb-1.5 block">Child Name</label>
                <input required value={form.name} onChange={set('name')} placeholder="Full name" className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Age</label>
                  <input required value={form.age} onChange={set('age')} placeholder="3y 2m" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Weight (kg)</label>
                  <input required type="number" step="0.1" value={form.weight} onChange={set('weight')} placeholder="12.5" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Height (cm)</label>
                  <input required type="number" value={form.height} onChange={set('height')} placeholder="95" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">MUAC (cm)</label>
                  <input required type="number" step="0.1" value={form.muac} onChange={set('muac')} placeholder="13.5" className="input-field text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <input type="checkbox" id="oedema" checked={form.oedema} onChange={e => setForm(p => ({ ...p, oedema: e.target.checked }))}
                  className="w-4 h-4 accent-green-500" />
                <label htmlFor="oedema" className="text-white/70 text-sm cursor-pointer">Bilateral Oedema Present</label>
              </div>
              <button type="submit" disabled={analyzing} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                {analyzing ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : 'Analyze'}
              </button>
            </form>
          </div>

          {/* WHO Reference */}
          <div className="glass-card p-4">
            <h4 className="text-white/60 text-sm font-medium mb-3">WHO MUAC Cutoffs</h4>
            <div className="space-y-2">
              {[
                { label: 'Normal', value: '≥ 13.5 cm', color: 'text-green-400' },
                { label: 'At Risk', value: '12.5–13.5 cm', color: 'text-yellow-400' },
                { label: 'MAM', value: '11.5–12.5 cm', color: 'text-orange-400' },
                { label: 'SAM', value: '< 11.5 cm', color: 'text-red-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-white/50">{r.label}</span>
                  <span className={r.color}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-5 border ${statusConfig[result.status].bg}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-xl">{result.name}</h3>
                    <p className="text-white/40 text-sm">{result.age}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={statusConfig[result.status].badge}>{result.status}</span>
                    <button onClick={() => setResult(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>Malnutrition Risk Score</span>
                    <span className={statusConfig[result.status].color}>{result.risk}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.risk}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: result.status === 'SAM' ? '#ef4444' : result.status === 'MAM' ? '#f97316' : '#22c55e' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Weight', value: `${result.weight} kg` },
                    { label: 'Height', value: `${result.height} cm` },
                    { label: 'MUAC', value: `${result.muac} cm` },
                    { label: 'Oedema', value: result.oedema ? 'Yes' : 'No' },
                  ].map(d => (
                    <div key={d.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-white/40 text-xs">{d.label}</p>
                      <p className="text-white font-medium text-sm mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl ${statusConfig[result.status].bg} flex items-start gap-3`}>
                  <AlertTriangle className={`w-5 h-5 ${statusConfig[result.status].color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-semibold ${statusConfig[result.status].color} text-sm`}>Recommended Intervention</p>
                    <p className="text-white/70 text-sm mt-1">{result.intervention}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing cases */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Current Flagged Cases</h3>
            <div className="space-y-3">
              {cases.filter(c => c.status !== 'Normal').map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                  className={`p-3 rounded-xl border ${statusConfig[c.status].bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm font-bold">{c.name.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-white/40 text-xs">{c.age} · MUAC: {c.muac}cm</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={statusConfig[c.status].badge}>{c.status}</span>
                    <p className="text-white/30 text-xs mt-1">{c.intervention.split('+')[0].trim()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
