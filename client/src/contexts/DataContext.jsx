import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}

// ── helpers ──────────────────────────────────────────────────────────────────
export function calcAge(dob) {
  if (!dob) return '–';
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  return `${years}y ${months}m`;
}

function calcStatus(muac, weight, height) {
  const m = parseFloat(muac);
  if (!m) return 'Normal';
  if (m < 11.5) return 'SAM';
  if (m < 12.5) return 'MAM';
  return 'Normal';
}

function ls(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Pune seed data ────────────────────────────────────────────────────────────
const SEED_CHILDREN = [
  { id: 1, name: 'Rutuja Jadhav', dob: '2021-03-10', gender: 'F', weight: 13.0, height: 94, muac: 14.5, guardian: 'Sunita Jadhav', village: 'Hadapsar', phone: '9823001001' },
  { id: 2, name: 'Aryan Patil', dob: '2020-06-15', gender: 'M', weight: 12.2, height: 99, muac: 13.2, guardian: 'Rajesh Patil', village: 'Kondhwa', phone: '9823001002' },
  { id: 3, name: 'Sakshi Shinde', dob: '2022-01-20', gender: 'F', weight: 8.4, height: 73, muac: 11.1, guardian: 'Priya Shinde', village: 'Dhankawadi', phone: '9823001003' },
  { id: 4, name: 'Omkar Deshmukh', dob: '2019-09-05', gender: 'M', weight: 17.8, height: 110, muac: 15.8, guardian: 'Suresh Deshmukh', village: 'Katraj', phone: '9823001004' },
  { id: 5, name: 'Prachi More', dob: '2021-11-18', gender: 'F', weight: 10.5, height: 86, muac: 12.1, guardian: 'Kavita More', village: 'Bibwewadi', phone: '9823001005' },
  { id: 6, name: 'Sagar Kulkarni', dob: '2022-04-08', gender: 'M', weight: 9.1, height: 78, muac: 11.8, guardian: 'Anita Kulkarni', village: 'Warje', phone: '9823001006' },
  { id: 7, name: 'Neha Pawar', dob: '2020-08-22', gender: 'F', weight: 14.6, height: 103, muac: 14.9, guardian: 'Geeta Pawar', village: 'Hadapsar', phone: '9823001007' },
  { id: 8, name: 'Rohan Bhosale', dob: '2021-05-30', gender: 'M', weight: 11.4, height: 90, muac: 12.4, guardian: 'Anil Bhosale', village: 'Kondhwa', phone: '9823001008' },
  { id: 9, name: 'Aishwarya Gaikwad', dob: '2022-09-12', gender: 'F', weight: 7.9, height: 70, muac: 10.8, guardian: 'Rekha Gaikwad', village: 'Dhankawadi', phone: '9823001009' },
  { id: 10, name: 'Pratik Mane', dob: '2019-12-01', gender: 'M', weight: 18.2, height: 112, muac: 16.0, guardian: 'Vijay Mane', village: 'Katraj', phone: '9823001010' },
  { id: 11, name: 'Pooja Waghmare', dob: '2021-07-25', gender: 'F', weight: 12.7, height: 92, muac: 14.1, guardian: 'Lata Waghmare', village: 'Bibwewadi', phone: '9823001011' },
  { id: 12, name: 'Harsh Suryavanshi', dob: '2022-02-14', gender: 'M', weight: 9.5, height: 80, muac: 12.0, guardian: 'Santosh Suryavanshi', village: 'Sinhagad Road', phone: '9823001012' },
  { id: 13, name: 'Sneha Kamble', dob: '2020-10-10', gender: 'F', weight: 13.8, height: 101, muac: 14.3, guardian: 'Seema Kamble', village: 'Warje', phone: '9823001013' },
  { id: 14, name: 'Aditya Thorat', dob: '2021-01-05', gender: 'M', weight: 13.5, height: 96, muac: 14.7, guardian: 'Mahesh Thorat', village: 'Karve Nagar', phone: '9823001014' },
  { id: 15, name: 'Varsha Jagtap', dob: '2022-06-20', gender: 'F', weight: 8.7, height: 74, muac: 11.3, guardian: 'Kiran Jagtap', village: 'Hingne', phone: '9823001015' },
  { id: 16, name: 'Vikram Salunkhe', dob: '2019-04-17', gender: 'M', weight: 16.9, height: 108, muac: 15.5, guardian: 'Ramesh Salunkhe', village: 'Dhayari', phone: '9823001016' },
  { id: 17, name: 'Kavya Nikalje', dob: '2021-09-03', gender: 'F', weight: 11.9, height: 89, muac: 13.6, guardian: 'Sonal Nikalje', village: 'Hadapsar', phone: '9823001017' },
  { id: 18, name: 'Sahil Londhe', dob: '2022-11-25', gender: 'M', weight: 7.5, height: 68, muac: 10.6, guardian: 'Pramod Londhe', village: 'Kondhwa', phone: '9823001018' },
  { id: 19, name: 'Dipali Kale', dob: '2020-03-30', gender: 'F', weight: 14.1, height: 104, muac: 14.6, guardian: 'Usha Kale', village: 'Bibwewadi', phone: '9823001019' },
  { id: 20, name: 'Raj Chavan', dob: '2021-08-14', gender: 'M', weight: 12.1, height: 91, muac: 13.4, guardian: 'Sunil Chavan', village: 'Katraj', phone: '9823001020' },
].map(c => ({ ...c, status: calcStatus(c.muac) }));

const SEED_MEALS = [
  { id: 1, date: new Date().toISOString().split('T')[0], session: 'Morning', meal: 'Pohe + Groundnuts', children: 18, calories: 240, protein: 7, served: true, notes: '' },
  { id: 2, date: new Date().toISOString().split('T')[0], session: 'Afternoon', meal: 'Varan Bhat + Ghee', children: 17, calories: 310, protein: 11, served: true, notes: '' },
  { id: 3, date: new Date(Date.now()-86400000).toISOString().split('T')[0], session: 'Morning', meal: 'Khichdi + Vegetable', children: 19, calories: 280, protein: 10, served: true, notes: '' },
  { id: 4, date: new Date(Date.now()-86400000).toISOString().split('T')[0], session: 'Afternoon', meal: 'Banana + Milk', children: 18, calories: 180, protein: 5, served: true, notes: '' },
  { id: 5, date: new Date(Date.now()-172800000).toISOString().split('T')[0], session: 'Morning', meal: 'Upma + Coconut Chutney', children: 17, calories: 260, protein: 8, served: true, notes: '' },
  { id: 6, date: new Date(Date.now()-172800000).toISOString().split('T')[0], session: 'Afternoon', meal: 'Egg Rice + Dal', children: 16, calories: 340, protein: 18, served: false, notes: 'Eggs unavailable' },
  { id: 7, date: new Date(Date.now()-259200000).toISOString().split('T')[0], session: 'Morning', meal: 'Sheera + Milk', children: 20, calories: 300, protein: 6, served: true, notes: '' },
];

const SEED_ATTENDANCE = (() => {
  const records = {};
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    records[dateStr] = SEED_CHILDREN.map(c => ({
      childId: c.id, present: Math.random() > 0.15
    }));
  }
  return records;
})();

const SEED_GROWTH = (() => {
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const data = {};
  SEED_CHILDREN.forEach(c => {
    data[c.id] = months.map((month, i) => ({
      month,
      weight: +(c.weight - (6 - i) * 0.25).toFixed(1),
      height: +(c.height - (6 - i) * 1.2).toFixed(0),
      muac: +(c.muac - (6 - i) * 0.1).toFixed(1),
    }));
  });
  return data;
})();

const SEED_REPORTS = [
  { id: 1, title: 'Monthly Nutrition Report – May 2025', type: 'monthly', month: 'May', year: 2025, date: '2025-05-31', status: 'ready' },
  { id: 2, title: 'Attendance Summary – May 2025', type: 'monthly', month: 'May', year: 2025, date: '2025-05-31', status: 'ready' },
  { id: 3, title: 'SAM/MAM Case Summary – Q1 2025', type: 'quarterly', month: 'Mar', year: 2025, date: '2025-03-31', status: 'ready' },
  { id: 4, title: 'Government Submission – ICDS Q4', type: 'government', month: 'Mar', year: 2025, date: '2025-03-31', status: 'pending' },
];

const DEFAULT_SETTINGS = {
  theme: 'dark', accentColor: 'green', language: 'English',
  notifications: { samAlerts: true, mamAlerts: true, attendanceLow: true, reportReady: true, weeklyDigest: false },
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function DataProvider({ children: appChildren }) {
  const [children, setChildren]     = useState(() => ls('poshanai_children', SEED_CHILDREN));
  const [meals, setMeals]           = useState(() => ls('poshanai_meals', SEED_MEALS));
  const [attendance, setAttendance] = useState(() => ls('poshanai_attendance', SEED_ATTENDANCE));
  const [growthData, setGrowthData] = useState(() => ls('poshanai_growth', SEED_GROWTH));
  const [reports, setReports]       = useState(() => ls('poshanai_reports', SEED_REPORTS));
  const [settings, setSettings]     = useState(() => ls('poshanai_settings', DEFAULT_SETTINGS));

  // persist on change
  useEffect(() => lsSet('poshanai_children', children), [children]);
  useEffect(() => lsSet('poshanai_meals', meals), [meals]);
  useEffect(() => lsSet('poshanai_attendance', attendance), [attendance]);
  useEffect(() => lsSet('poshanai_growth', growthData), [growthData]);
  useEffect(() => lsSet('poshanai_reports', reports), [reports]);
  useEffect(() => lsSet('poshanai_settings', settings), [settings]);

  // apply theme & accent
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    const accents = { green: '#22c55e', orange: '#f97316', blue: '#3b82f6', purple: '#a855f7', red: '#ef4444' };
    root.style.setProperty('--accent', accents[settings.accentColor] || accents.green);
  }, [settings.theme, settings.accentColor]);

  // ── children ──
  const addChild = useCallback((form) => {
    const muac = parseFloat(form.muac) || 13.5;
    const child = {
      id: Date.now(),
      ...form,
      weight: parseFloat(form.weight) || 0,
      height: parseFloat(form.height) || 0,
      muac,
      status: calcStatus(muac),
    };
    setChildren(prev => [child, ...prev]);
    // seed initial growth row
    setGrowthData(prev => ({
      ...prev,
      [child.id]: [{ month: 'May', weight: child.weight, height: child.height, muac }],
    }));
    return child;
  }, []);

  const deleteChild = useCallback((id) => setChildren(prev => prev.filter(c => c.id !== id)), []);

  const updateChild = useCallback((id, updates) => {
    setChildren(prev => prev.map(c => {
      if (c.id !== id) return c;
      const merged = { ...c, ...updates };
      merged.status = calcStatus(merged.muac, merged.weight, merged.height);
      return merged;
    }));
  }, []);

  // ── meals ──
  const addMeal = useCallback((form) => {
    const entry = { id: Date.now(), ...form, served: true };
    setMeals(prev => [entry, ...prev]);
  }, []);

  const deleteMeal = useCallback((id) => setMeals(prev => prev.filter(m => m.id !== id)), []);

  // ── attendance ──
  const markAttendance = useCallback((date, records) => {
    setAttendance(prev => ({ ...prev, [date]: records }));
  }, []);

  // ── growth ──
  const addGrowthRecord = useCallback((childId, record) => {
    setGrowthData(prev => ({
      ...prev,
      [childId]: [...(prev[childId] || []), record],
    }));
  }, []);

  // ── reports ──
  const addReport = useCallback((report) => {
    const r = { id: Date.now(), status: 'ready', date: new Date().toISOString().split('T')[0], ...report };
    setReports(prev => [r, ...prev]);
    return r;
  }, []);

  // ── settings ──
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // ── derived analytics ──
  const getAnalytics = useCallback(() => {
    const total = children.length;
    const normal = children.filter(c => c.status === 'Normal').length;
    const mam = children.filter(c => c.status === 'MAM').length;
    const sam = children.filter(c => c.status === 'SAM').length;

    const byVillage = {};
    children.forEach(c => {
      if (!byVillage[c.village]) byVillage[c.village] = { village: c.village, total: 0, normal: 0, mam: 0, sam: 0 };
      byVillage[c.village].total++;
      byVillage[c.village][c.status.toLowerCase()]++;
    });

    const byAge = { '0-1y': { normal:0,mam:0,sam:0 }, '1-2y': { normal:0,mam:0,sam:0 }, '2-3y': { normal:0,mam:0,sam:0 }, '3-4y': { normal:0,mam:0,sam:0 }, '4-5y': { normal:0,mam:0,sam:0 }, '5+y': { normal:0,mam:0,sam:0 } };
    children.forEach(c => {
      const age = new Date() - new Date(c.dob);
      const years = age / (365.25 * 24 * 3600 * 1000);
      const grp = years < 1 ? '0-1y' : years < 2 ? '1-2y' : years < 3 ? '2-3y' : years < 4 ? '3-4y' : years < 5 ? '4-5y' : '5+y';
      byAge[grp][c.status.toLowerCase()]++;
    });

    // attendance last 7 days
    const attDays = Object.entries(attendance)
      .sort(([a],[b]) => b.localeCompare(a))
      .slice(0, 7)
      .map(([date, recs]) => {
        const present = recs.filter(r => r.present).length;
        return { date: date.slice(5), present, absent: recs.length - present, rate: Math.round(present/Math.max(recs.length,1)*100) };
      });

    return { total, normal, mam, sam, byVillage: Object.values(byVillage), byAge: Object.entries(byAge).map(([group, v]) => ({ group, ...v })), attDays };
  }, [children, attendance]);

  const value = {
    children, addChild, deleteChild, updateChild,
    meals, addMeal, deleteMeal,
    attendance, markAttendance,
    growthData, addGrowthRecord,
    reports, addReport,
    settings, updateSettings,
    getAnalytics,
    calcAge,
  };

  return <DataContext.Provider value={value}>{appChildren}</DataContext.Provider>;
}
