import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, TrendingUp, AlertTriangle, Info, ChevronDown } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const meals = [
  { name: 'Dal Khichdi', calories: 280, protein: 12, iron: 3.2, calcium: 80, vitA: 45, zinc: 2.1 },
  { name: 'Egg + Rice', calories: 320, protein: 18, iron: 2.1, calcium: 60, vitA: 120, zinc: 2.8 },
  { name: 'Sattu Porridge', calories: 250, protein: 10, iron: 4.5, calcium: 120, vitA: 20, zinc: 1.8 },
  { name: 'Banana + Milk', calories: 190, protein: 6, iron: 0.8, calcium: 220, vitA: 80, zinc: 0.9 },
];

const requiredNutrients = { calories: 1200, protein: 20, iron: 8, calcium: 600, vitA: 300, zinc: 5 };

export default function NutritionAnalysis() {
  const [selected, setSelected] = useState(meals[0]);
  const [childAge, setChildAge] = useState('3-5');

  const radarData = [
    { subject: 'Calories', value: Math.round(selected.calories / requiredNutrients.calories * 100), fullMark: 100 },
    { subject: 'Protein', value: Math.round(selected.protein / requiredNutrients.protein * 100), fullMark: 100 },
    { subject: 'Iron', value: Math.round(selected.iron / requiredNutrients.iron * 100), fullMark: 100 },
    { subject: 'Calcium', value: Math.round(selected.calcium / requiredNutrients.calcium * 100), fullMark: 100 },
    { subject: 'Vitamin A', value: Math.round(selected.vitA / requiredNutrients.vitA * 100), fullMark: 100 },
    { subject: 'Zinc', value: Math.round(selected.zinc / requiredNutrients.zinc * 100), fullMark: 100 },
  ];

  const barData = meals.map(m => ({
    name: m.name.split(' ')[0],
    Calories: m.calories,
    Protein: m.protein * 10,
    Iron: m.iron * 20,
  }));

  const getColor = (val) => val >= 80 ? '#22c55e' : val >= 50 ? '#f97316' : '#ef4444';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card p-3 text-xs">
          <p className="text-white/60 mb-1">{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Nutrition Analysis</h1>
        <p className="page-subheader">Analyze meal nutritional content against daily requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal Selector */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <label className="text-white/60 text-sm mb-2 block">Age Group</label>
            <div className="relative">
              <select value={childAge} onChange={e => setChildAge(e.target.value)} className="input-field appearance-none pr-8 text-sm">
                <option value="0-1">0–1 years</option>
                <option value="1-3">1–3 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5-6">5–6 years</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>

          <h3 className="text-white font-semibold text-sm px-1">Select Meal</h3>
          {meals.map(meal => (
            <button
              key={meal.name}
              onClick={() => setSelected(meal)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected.name === meal.name
                  ? 'bg-green-500/15 border-green-500/30 text-white'
                  : 'glass border-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Apple className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{meal.name}</p>
                  <p className="text-xs text-white/40">{meal.calories} kcal · {meal.protein}g protein</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-1">{selected.name}</h3>
            <p className="text-white/40 text-xs mb-4">% of daily requirement met (age {childAge}y)</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Nutrient bars */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Nutrient Details</h3>
            <div className="space-y-3">
              {radarData.map(n => (
                <div key={n.subject}>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{n.subject}</span>
                    <span style={{ color: getColor(n.value) }}>{n.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(n.value, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: getColor(n.value) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-3">Recommendations</h3>
            <div className="space-y-2">
              {radarData.filter(n => n.value < 60).map(n => (
                <div key={n.subject} className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-orange-300 text-xs">Low {n.subject} ({n.value}%). Consider adding foods rich in {n.subject.toLowerCase()} to this meal.</p>
                </div>
              ))}
              {radarData.filter(n => n.value >= 60).length === radarData.length && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Info className="w-4 h-4 text-green-400" />
                  <p className="text-green-300 text-xs">This meal meets most daily nutritional requirements. Well balanced!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">Meal Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Calories" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Protein" fill="#f97316" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Iron" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
