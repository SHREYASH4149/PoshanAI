import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

const children = [
  { id: 1, name: 'Ananya Kumari', age: '3y 2m' },
  { id: 2, name: 'Rahul Singh', age: '4y 1m' },
  { id: 3, name: 'Priya Devi', age: '2y 8m' },
  { id: 4, name: 'Arjun Yadav', age: '5y 0m' },
  { id: 5, name: 'Meera Jha', age: '1y 6m' },
  { id: 6, name: 'Vikram Patel', age: '4y 3m' },
  { id: 7, name: 'Sunita Kumari', age: '3y 9m' },
  { id: 8, name: 'Dev Kumar', age: '2y 4m' },
];

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState(() => {
    const init = {};
    children.forEach(c => { init[c.id] = 'present'; });
    return init;
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id, status) => setAttendance(prev => ({ ...prev, [id]: status }));

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const markAll = (status) => {
    const updated = {};
    children.forEach(c => { updated[c.id] = status; });
    setAttendance(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Attendance</h1>
          <p className="page-subheader">Mark daily attendance for your Anganwadi</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
          <CalendarCheck className="w-4 h-4" /> Save Attendance
        </button>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400 font-medium">Attendance saved successfully!</p>
        </motion.div>
      )}

      {/* Date & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <label className="text-white/40 text-xs mb-2 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field text-sm" />
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{presentCount}</p>
            <p className="text-white/40 text-xs">Present</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{absentCount}</p>
            <p className="text-white/40 text-xs">Absent</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">{Math.round(presentCount / children.length * 100)}%</p>
            <p className="text-white/40 text-xs">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button onClick={() => markAll('present')} className="btn-ghost text-sm text-green-400 border-green-500/20 hover:bg-green-500/10">Mark All Present</button>
        <button onClick={() => markAll('absent')} className="btn-ghost text-sm text-red-400 border-red-500/20 hover:bg-red-500/10">Mark All Absent</button>
      </div>

      {/* Attendance List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Children — {date}</h3>
        </div>
        <div className="divide-y divide-white/5">
          {children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500/20 to-orange-500/20 flex items-center justify-center text-white text-sm font-bold">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{child.name}</p>
                  <p className="text-white/30 text-xs">{child.age}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {['present', 'absent', 'leave'].map(status => (
                  <button
                    key={status}
                    onClick={() => toggle(child.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      attendance[child.id] === status
                        ? status === 'present' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : status === 'absent' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-white/5 text-white/30 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
