import express from 'express';
const router = express.Router();

router.get('/nutrition-trend', (req, res) => {
  res.json({
    success: true,
    data: [
      { month: 'Jan', normal: 62, mam: 22, sam: 16 },
      { month: 'Feb', normal: 65, mam: 20, sam: 15 },
      { month: 'Mar', normal: 60, mam: 24, sam: 16 },
      { month: 'Apr', normal: 68, mam: 20, sam: 12 },
      { month: 'May', normal: 70, mam: 18, sam: 12 },
      { month: 'Jun', normal: 74, mam: 16, sam: 10 },
    ]
  });
});

router.get('/attendance', (req, res) => {
  res.json({
    success: true,
    data: [
      { week: 'W1', present: 42, absent: 8, rate: 84 },
      { week: 'W2', present: 38, absent: 12, rate: 76 },
      { week: 'W3', present: 45, absent: 5, rate: 90 },
      { week: 'W4', present: 44, absent: 6, rate: 88 },
    ]
  });
});

router.get('/malnutrition-by-age', (req, res) => {
  res.json({
    success: true,
    data: [
      { ageGroup: '0-1y', sam: 15, mam: 28, normal: 57 },
      { ageGroup: '1-2y', sam: 12, mam: 25, normal: 63 },
      { ageGroup: '2-3y', sam: 10, mam: 22, normal: 68 },
      { ageGroup: '3-4y', sam: 8, mam: 18, normal: 74 },
      { ageGroup: '4-5y', sam: 6, mam: 15, normal: 79 },
    ]
  });
});

router.get('/district-summary', (req, res) => {
  res.json({
    success: true,
    data: [
      { district: 'Patna', centers: 1240, children: 48500, normal: 72, sam: 10 },
      { district: 'Nalanda', centers: 980, children: 42000, normal: 68, sam: 12 },
      { district: 'Gaya', centers: 1100, children: 55000, normal: 60, sam: 16 },
      { district: 'Bhagalpur', centers: 850, children: 38000, normal: 74, sam: 8 },
    ]
  });
});

export default router;
