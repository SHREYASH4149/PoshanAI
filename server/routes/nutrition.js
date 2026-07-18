import express from 'express';
const router = express.Router();

const meals = [
  { id: 1, name: 'Dal Khichdi', calories: 280, protein: 12, iron: 3.2, calcium: 80, vitaminA: 45, zinc: 2.1, date: '2024-05-28' },
  { id: 2, name: 'Egg Rice', calories: 320, protein: 18, iron: 2.1, calcium: 60, vitaminA: 120, zinc: 2.8, date: '2024-05-27' },
  { id: 3, name: 'Sattu Porridge', calories: 250, protein: 10, iron: 4.5, calcium: 120, vitaminA: 20, zinc: 1.8, date: '2024-05-26' },
];

// GET all meals
router.get('/meals', (req, res) => {
  const { date, limit = 10 } = req.query;
  let result = meals;
  if (date) result = result.filter(m => m.date === date);
  res.json({ success: true, data: result.slice(0, parseInt(limit)), total: result.length });
});

// GET meal by id
router.get('/meals/:id', (req, res) => {
  const meal = meals.find(m => m.id === parseInt(req.params.id));
  if (!meal) return res.status(404).json({ error: 'Meal not found' });
  res.json({ success: true, data: meal });
});

// POST log meal
router.post('/meals', (req, res) => {
  const { name, date, session, childrenCount } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'name and date are required' });
  const newMeal = {
    id: Date.now(),
    name,
    date,
    session: session || 'Morning',
    childrenCount: childrenCount || 0,
    calories: 260,
    protein: 10,
    createdAt: new Date().toISOString(),
  };
  meals.push(newMeal);
  res.status(201).json({ success: true, data: newMeal });
});

// GET nutrition summary
router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      weeklyAvgCalories: 271,
      weeklyAvgProtein: 13.3,
      mealsServed: 14,
      childrenCovered: 248,
      adequacyScore: 78,
    }
  });
});

export default router;
