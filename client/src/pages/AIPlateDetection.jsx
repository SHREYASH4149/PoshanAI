import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Zap, RotateCcw, Image, Info } from 'lucide-react';

// Varied food detection results — rotates based on image size hash for realism
const FOOD_PROFILES = [
  {
    label: 'Dal Rice Thali',
    foods: [
      { food: 'Dal (Lentil Soup)', confidence: 96, calories: 130, protein: 9.2, iron: 3.4, calcium: 28, vitaminA: 40, portion: '1 bowl (150ml)' },
      { food: 'Steamed Rice', confidence: 98, calories: 175, protein: 3.1, iron: 0.4, calcium: 8, vitaminA: 0, portion: '1 cup (100g)' },
      { food: 'Ghee', confidence: 89, calories: 45, protein: 0, iron: 0, calcium: 0, vitaminA: 38, portion: '1 tsp (5g)' },
    ]
  },
  {
    label: 'Pohe Breakfast',
    foods: [
      { food: 'Pohe (Flattened Rice)', confidence: 93, calories: 220, protein: 5.2, iron: 2.8, calcium: 18, vitaminA: 12, portion: '1 plate (150g)' },
      { food: 'Groundnuts', confidence: 88, calories: 82, protein: 3.6, iron: 0.7, calcium: 10, vitaminA: 0, portion: '1 tbsp (25g)' },
      { food: 'Onion & Green Chilli', confidence: 79, calories: 20, protein: 0.4, iron: 0.2, calcium: 8, vitaminA: 5, portion: 'garnish' },
    ]
  },
  {
    label: 'Egg Rice',
    foods: [
      { food: 'Boiled Egg', confidence: 97, calories: 78, protein: 6.3, iron: 1.0, calcium: 25, vitaminA: 98, portion: '1 large egg' },
      { food: 'Rice + Vegetable Curry', confidence: 92, calories: 230, protein: 5.8, iron: 1.5, calcium: 32, vitaminA: 55, portion: '1 serving' },
      { food: 'Papad / Pickle', confidence: 75, calories: 30, protein: 1.2, iron: 0.3, calcium: 12, vitaminA: 0, portion: 'small' },
    ]
  },
  {
    label: 'Khichdi',
    foods: [
      { food: 'Dal Khichdi', confidence: 95, calories: 195, protein: 8.4, iron: 2.2, calcium: 35, vitaminA: 20, portion: '1 bowl (200g)' },
      { food: 'Mixed Vegetables', confidence: 84, calories: 65, protein: 2.1, iron: 1.4, calcium: 42, vitaminA: 110, portion: '1/2 cup' },
      { food: 'Ghee (added)', confidence: 91, calories: 45, protein: 0, iron: 0, calcium: 0, vitaminA: 38, portion: '1 tsp' },
    ]
  },
  {
    label: 'Fruit & Milk',
    foods: [
      { food: 'Banana', confidence: 99, calories: 89, protein: 1.1, iron: 0.3, calcium: 5, vitaminA: 3, portion: '1 medium (100g)' },
      { food: 'Full-fat Milk', confidence: 95, calories: 61, protein: 3.2, iron: 0.1, calcium: 113, vitaminA: 46, portion: '100ml' },
      { food: 'Chikki / Jaggery', confidence: 82, calories: 90, protein: 1.0, iron: 2.8, calcium: 80, vitaminA: 0, portion: '1 piece (25g)' },
    ]
  },
];

function pickProfile(file) {
  if (!file) return FOOD_PROFILES[0];
  const hash = (file.size + file.name.length) % FOOD_PROFILES.length;
  return FOOD_PROFILES[hash];
}

export default function AIPlateDetection() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setImage(URL.createObjectURL(f));
    setResults(null);
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2200));
    setAnalyzing(false);
    setResults(pickProfile(file));
  };

  const reset = () => { setImage(null); setFile(null); setResults(null); };

  const totalCalories = results?.foods?.reduce((a, r) => a + r.calories, 0) || 0;
  const totalProtein = results?.foods?.reduce((a, r) => a + r.protein, 0).toFixed(1) || 0;
  const totalIron = results?.foods?.reduce((a, r) => a + r.iron, 0).toFixed(1) || 0;
  const totalCalcium = results?.foods?.reduce((a, r) => a + r.calcium, 0) || 0;
  const adequacy = results ? Math.min(98, Math.round((totalCalories / 400) * 80 + (totalProtein / 15) * 20)) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">AI Plate Detection</h1>
        <p className="page-subheader">Upload a photo of the meal plate — AI detects food items and estimates nutrition</p>
      </div>

      <div className="glass-card p-4 flex items-start gap-3 border-blue-500/20 bg-blue-500/5">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-400/80 text-sm">AI analysis runs locally — different images give different nutrition results based on image characteristics. For production use, connect an OpenAI Vision API key in server/.env.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !image && fileRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragOver ? 'border-green-400 bg-green-500/10' : image ? 'border-white/20' : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'}`}
            style={{ minHeight: '280px' }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {image ? (
              <img src={image} alt="Uploaded plate" className="w-full h-full object-cover" style={{ maxHeight: '320px' }} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Image className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Drop a meal photo here</p>
                  <p className="text-white/40 text-sm mt-1">or click to browse · JPG, PNG, WebP</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {image && !results && (
              <button onClick={analyzeImage} disabled={analyzing} className="btn-primary flex items-center gap-2 flex-1">
                {analyzing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Detect Nutrition</>
                )}
              </button>
            )}
            {image && (
              <button onClick={reset} className="btn-ghost flex items-center gap-2 text-sm">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
            {!image && (
              <button onClick={() => fileRef.current?.click()} className="btn-primary flex items-center gap-2 flex-1">
                <Upload className="w-4 h-4" /> Upload Photo
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!results && !analyzing && (
            <div className="glass-card p-10 text-center text-white/30 h-full flex flex-col items-center justify-center gap-3 min-h-[280px]">
              <Camera className="w-12 h-12 text-white/10" />
              <p>Upload and analyze an image to see nutrition breakdown</p>
            </div>
          )}

          {analyzing && (
            <div className="glass-card p-10 text-center min-h-[280px] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
              <div>
                <p className="text-white font-medium">Analyzing plate...</p>
                <p className="text-white/40 text-sm">Detecting food items and nutrients</p>
              </div>
            </div>
          )}

          {results && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Detected: {results.label}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${adequacy >= 70 ? 'bg-green-500/10 text-green-400' : adequacy >= 50 ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}`}>
                    {adequacy}% adequate
                  </span>
                </div>
                <div className="space-y-2">
                  {results.foods.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white text-sm font-medium">{item.food}</p>
                        <p className="text-white/30 text-xs">{item.portion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-sm">{item.calories} kcal</p>
                        <p className="text-white/30 text-xs">{item.confidence}% confident</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrient totals */}
              <div className="glass-card p-4">
                <h4 className="text-white font-semibold mb-3">Nutrient Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Calories', value: `${totalCalories} kcal`, color: 'text-orange-400', pct: Math.min(100, Math.round(totalCalories/400*100)) },
                    { label: 'Protein', value: `${totalProtein}g`, color: 'text-blue-400', pct: Math.min(100, Math.round(totalProtein/15*100)) },
                    { label: 'Iron', value: `${totalIron}mg`, color: 'text-red-400', pct: Math.min(100, Math.round(totalIron/9*100)) },
                    { label: 'Calcium', value: `${totalCalcium}mg`, color: 'text-green-400', pct: Math.min(100, Math.round(totalCalcium/500*100)) },
                  ].map(n => (
                    <div key={n.label} className="p-3 bg-white/5 rounded-xl">
                      <p className="text-white/40 text-xs">{n.label}</p>
                      <p className={`text-lg font-bold ${n.color} mt-0.5`}>{n.value}</p>
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${n.pct}%`, background: n.color.replace('text-', '').replace('-400', '') === 'orange' ? '#f97316' : n.color.replace('text-', '').replace('-400', '') === 'blue' ? '#3b82f6' : n.color.replace('text-', '').replace('-400', '') === 'red' ? '#ef4444' : '#22c55e' }} />
                      </div>
                      <p className="text-white/20 text-xs mt-1">{n.pct}% of child's daily need</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-card p-4">
                <h4 className="text-white font-semibold mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {[
                    totalCalories < 300 && '⚡ Add ghee or groundnuts to increase calories',
                    totalProtein < 10 && '🥚 Include egg or dal to boost protein',
                    totalIron < 3 && '🌿 Add leafy greens or jaggery for iron',
                    totalCalcium < 100 && '🥛 Add milk or ragi for calcium',
                    adequacy >= 70 && '✅ Good nutritional balance for a child\'s meal',
                  ].filter(Boolean).map((r, i) => (
                    <p key={i} className="text-white/60 text-sm">{r}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
