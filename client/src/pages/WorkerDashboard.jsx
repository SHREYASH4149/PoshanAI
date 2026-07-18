import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, Apple, Bell, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const todayTasks = [
  { id: 1, task: 'Mark attendance for 48 children', done: true, time: '9:00 AM' },
  { id: 2, task: 'Distribute morning meal (Dal Khichdi)', done: true, time: '10:00 AM' },
  { id: 3, task: 'Weigh 8 children for monthly record', done: false, time: '11:00 AM' },
  { id: 4, task: 'Conduct nutrition counseling session', done: false, time: '12:00 PM' },
  { id: 5, task: 'Submit daily report to supervisor', done: false, time: '2:00 PM' },
];

const recentActivities = [
  { msg: 'Attendance marked — 42/48 present', time: '2h ago', type: 'success' },
  { msg: 'Morning meal distributed to 42 children', time: '3h ago', type: 'info' },
  { msg: 'SAM alert: Priya Devi needs NRC referral', time: '5h ago', type: 'alert' },
  { msg: 'Monthly weighing completed for Batch A', time: '1d ago', type: 'success' },
];

export default function WorkerDashboard() {
  const { currentUser, userProfile } = useAuth();
  const done = todayTasks.filter(t => t.done).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6 bg-gradient-to-r from-green-900/20 to-orange-900/10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Good Morning, {currentUser?.displayName?.split(' ')[0] || 'Worker'}</h1>
            <p className="text-white/50 text-sm">Anganwadi: {userProfile?.anganwadiId || 'AWC-1042'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs mb-1">Today's Progress</p>
            <p className="text-2xl font-bold gradient-text">{done}/{todayTasks.length}</p>
            <p className="text-white/40 text-xs">tasks done</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(done / todayTasks.length) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Children Today', value: '42', sub: '6 absent', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Attendance %', value: '87.5%', sub: 'This week', icon: CalendarCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Pending Weighing', value: '8', sub: 'This month', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Open Alerts', value: '3', sub: '1 critical', icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            <div className="text-white/25 text-xs">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today's Tasks</h3>
            <span className="badge-green">{done}/{todayTasks.length} done</span>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${task.done ? 'bg-green-500/5 opacity-60' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${task.done ? 'border-green-500 bg-green-500' : 'border-white/20'}`}>
                  {task.done && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.done ? 'text-white/40 line-through' : 'text-white'}`}>{task.task}</p>
                </div>
                <div className="flex items-center gap-1 text-white/30 text-xs flex-shrink-0">
                  <Clock className="w-3 h-3" /> {task.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-400' : activity.type === 'alert' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-white/70 text-sm">{activity.msg}</p>
                  <p className="text-white/30 text-xs mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Mark Attendance', icon: CalendarCheck, path: '/attendance', color: 'text-blue-400 bg-blue-500/10' },
            { label: 'Log Meal', icon: Apple, path: '/meal-history', color: 'text-orange-400 bg-orange-500/10' },
            { label: 'Add Child', icon: Users, path: '/children', color: 'text-green-400 bg-green-500/10' },
            { label: 'View Alerts', icon: Bell, path: '/alerts', color: 'text-red-400 bg-red-500/10' },
          ].map(a => (
            <Link key={a.label} to={a.path} className={`flex items-center gap-3 p-4 rounded-xl ${a.color.split(' ')[1]} hover:bg-white/10 border border-white/5 transition-all group`}>
              <a.icon className={`w-5 h-5 ${a.color.split(' ')[0]}`} />
              <span className="text-white/70 text-sm font-medium group-hover:text-white">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
