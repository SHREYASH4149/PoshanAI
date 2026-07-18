import express from 'express';
const router = express.Router();

const reports = [
  { id: 1, title: 'Monthly Nutrition Report – May 2024', type: 'monthly', date: '2024-05-31', status: 'ready', generatedBy: 'system' },
  { id: 2, title: 'SAM/MAM Case Summary – Q1 2024', type: 'quarterly', date: '2024-03-31', status: 'ready', generatedBy: 'admin' },
  { id: 3, title: 'Attendance Summary – May 2024', type: 'monthly', date: '2024-05-31', status: 'ready', generatedBy: 'system' },
];

router.get('/', (req, res) => {
  const { type, status } = req.query;
  let result = [...reports];
  if (type) result = result.filter(r => r.type === type);
  if (status) result = result.filter(r => r.status === status);
  res.json({ success: true, data: result, total: result.length });
});

router.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json({ success: true, data: report });
});

router.post('/generate', (req, res) => {
  const { type, month, year, anganwadiId } = req.body;
  const newReport = {
    id: Date.now(),
    title: `${type || 'Monthly'} Report – ${month || 'June'} ${year || 2024}`,
    type: type || 'monthly',
    date: new Date().toISOString().split('T')[0],
    status: 'ready',
    generatedBy: 'system',
    anganwadiId: anganwadiId || 'AWC-1042',
    generatedAt: new Date().toISOString(),
  };
  reports.push(newReport);
  res.status(201).json({ success: true, data: newReport, message: 'Report generated successfully' });
});

export default router;
