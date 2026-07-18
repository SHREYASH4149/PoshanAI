import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Search, X, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const MEAL_OPTIONS = ['Pohe + Groundnuts', 'Varan Bhat + Ghee', 'Khichdi + Vegetable', 'Upma + Coconut Chutney', 'Egg Rice + Dal', 'Banana + Milk', 'Sheera + Milk', 'Dal Khichdi + Ghee', 'Vegetable Pulao', 'Kheer + Fruit'];
const CAL_MAP = { 'Pohe + Groundnuts': 240, 'Varan Bhat + Ghee': 310, 'Khichdi + Vegetable': 280, 'Upma + Coconut Chutney': 260, 'Egg Rice + Dal': 340, 'Banana + Milk': 180, 'Sheera + Milk': 300, 'Dal Khichdi + Ghee': 280, 'Vegetable Pulao': 260, 'Kheer + Fruit': 200 };
const PRO_MAP = { 'Pohe + Groundnuts': 7, 'Varan Bhat + Ghee': 11, 'Khichdi + Vegetable': 10, 'Upma + Coconut Chutney': 8, 'Egg Rice + Dal': 18, 'Banana + Milk': 5, 'Sheera + Milk': 6, 'Dal Khichdi + Ghee': 10, 'Vegetable Pulao': 7, 'Kheer + Fruit': 5 };
const emptyForm = { date: new Date().toISOString().split('T')[0], session: 'Morning', meal: MEAL_OPTIONS[0], children: '', notes: '' };

export default function MealHistory() {
  const { meals, addMeal, deleteMeal } = useData();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const filtered = meals.filter(h => h.meal.toLowerCase().includes(search.toLowerCase()) || h.date.includes(search));

  const handleAdd = (e) => {
    e.preventDefault();
    addMeal({
      ...form,
      children: parseInt(form.children) || 20,
      calories: CAL_MAP[form.meal] || 260,
      protein: PRO_MAP[form.meal] || 8,
    });
    setShowModal(false);
    setForm(emptyForm);
  };

  const totalCal = meals.slice(0, 7).reduce((a, h) => a + (h.served !== false ? (h.calories || 0) : 0), 0);
  const avgAtt = meals.length ? Math.round(meals.reduce((a, h) => a + (h.children || 0), 0) / meals.length) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Meal History</h1>
          <p className="page-subheader">Track daily meal distribution — {meals.length} records</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Log Meal
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Meals Logged', value: meals.length, color: 'text-blue-400' },
          { label: 'Meals Served', value: meals.filter(m => m.served !== false).length, color: 'text-green-400' },
          { label: 'Avg Attendance', value: avgAtt, color: 'text-orange-400' },
          { label: 'Cal This Week', value: totalCal, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by meal or date..." className="input-field pl-10" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="glass-card p-10 text-center text-white/30">No meals found</div>}
        {filtered.map((h, i) => (
          <motion.div key={h.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass-card p-4 flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.served !== false ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <UtensilsCrossed className={`w-5 h-5 ${h.served !== false ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{h.meal}</p>
                <p className="text-white/40 text-xs">{h.date} · {h.session} · {h.children} children</p>
                {h.notes && <p className="text-white/30 text-xs italic">{h.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white/60 text-sm">{h.calories} kcal</p>
                <p className="text-white/30 text-xs">{h.protein}g protein</p>
              </div>
              <span className={h.served !== false ? 'badge-green' : 'badge-red'}>{h.served !== false ? 'Served' : 'Not Served'}</span>
              <button onClick={() => deleteMeal(h.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Log Meal</h2>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Date</label>
                    <input type="date" required value={form.date} onChange={set('date')} className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Session</label>
                    <select value={form.session} onChange={set('session')} className="input-field">
                      <option>Morning</option>
                      <option>Afternoon</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-white/60 text-xs mb-1.5 block">Meal</label>
                    <select value={form.meal} onChange={set('meal')} className="input-field">
                      {MEAL_OPTIONS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Children Count</label>
                    <input type="number" min="1" max="100" value={form.children} onChange={set('children')} placeholder="20" className="input-field" />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1.5 block">Notes (optional)</label>
                    <input value={form.notes} onChange={set('notes')} placeholder="Any remarks" className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1 text-sm">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 text-sm">Save Meal</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
