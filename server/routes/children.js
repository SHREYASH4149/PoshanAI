import express from 'express';
const router = express.Router();

let children = [
  { id: 1, name: 'Ananya Kumari', dob: '2021-03-15', gender: 'F', weight: 13.2, height: 95, muac: 14.6, status: 'Normal', guardian: 'Sunita Devi', village: 'Rampur', phone: '9876543210', anganwadiId: 'AWC-1042' },
  { id: 2, name: 'Rahul Singh', dob: '2020-04-20', gender: 'M', weight: 11.8, height: 98, muac: 13.1, status: 'MAM', guardian: 'Raju Singh', village: 'Sitapur', phone: '9876543211', anganwadiId: 'AWC-1042' },
  { id: 3, name: 'Priya Devi', dob: '2021-09-10', gender: 'F', weight: 9.1, height: 82, muac: 11.0, status: 'SAM', guardian: 'Geeta Devi', village: 'Maholi', phone: '9876543212', anganwadiId: 'AWC-1042' },
  { id: 4, name: 'Arjun Yadav', dob: '2019-06-01', gender: 'M', weight: 17.5, height: 108, muac: 15.7, status: 'Normal', guardian: 'Ramesh Yadav', village: 'Rampur', phone: '9876543213', anganwadiId: 'AWC-1042' },
];

router.get('/', (req, res) => {
  const { status, village, limit = 50 } = req.query;
  let result = [...children];
  if (status) result = result.filter(c => c.status === status);
  if (village) result = result.filter(c => c.village.toLowerCase().includes(village.toLowerCase()));
  res.json({ success: true, data: result.slice(0, parseInt(limit)), total: result.length });
});

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      total: children.length,
      normal: children.filter(c => c.status === 'Normal').length,
      mam: children.filter(c => c.status === 'MAM').length,
      sam: children.filter(c => c.status === 'SAM').length,
      lastUpdated: new Date().toISOString(),
    }
  });
});

router.get('/:id', (req, res) => {
  const child = children.find(c => c.id === parseInt(req.params.id));
  if (!child) return res.status(404).json({ error: 'Child not found' });
  res.json({ success: true, data: child });
});

router.post('/', (req, res) => {
  const { name, dob, gender, weight, height, muac, guardian, village, phone, anganwadiId } = req.body;
  if (!name || !dob || !gender) return res.status(400).json({ error: 'name, dob, and gender are required' });
  const muacNum = parseFloat(muac);
  const status = muacNum < 11.5 ? 'SAM' : muacNum < 12.5 ? 'MAM' : 'Normal';
  const newChild = {
    id: Date.now(),
    name, dob, gender,
    weight: parseFloat(weight) || 0,
    height: parseFloat(height) || 0,
    muac: muacNum || 0,
    status,
    guardian: guardian || '',
    village: village || '',
    phone: phone || '',
    anganwadiId: anganwadiId || '',
    createdAt: new Date().toISOString(),
  };
  children.push(newChild);
  res.status(201).json({ success: true, data: newChild });
});

router.put('/:id', (req, res) => {
  const idx = children.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Child not found' });
  children[idx] = { ...children[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: children[idx] });
});

router.delete('/:id', (req, res) => {
  const idx = children.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Child not found' });
  children.splice(idx, 1);
  res.json({ success: true, message: 'Child deleted' });
});

export default router;
