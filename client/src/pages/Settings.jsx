import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const ACCENTS = [
  { key: 'green', label: 'Forest Green', hex: '#22c55e' },
  { key: 'orange', label: 'Harvest Orange', hex: '#f97316' },
  { key: 'blue', label: 'Sky Blue', hex: '#3b82f6' },
  { key: 'purple', label: 'Royal Purple', hex: '#a855f7' },
  { key: 'red', label: 'Crimson Red', hex: '#ef4444' },
];

export default function Settings() {
  const { currentUser, userProfile } = useAuth();
  const { settings, updateSettings } = useData();
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: currentUser?.displayName || '',
    phone: '',
    anganwadiId: userProfile?.anganwadiId || 'AWC-PUNE-042',
    district: 'Pune',
    state: 'Maharashtra',
    language: settings.language || 'English',
  });

  const setP = f => e => setProfile(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    updateSettings({ language: profile.language });
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotif = (key) => {
    updateSettings({ notifications: { ...settings.notifications, [key]: !settings.notifications[key] } });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="page-subheader">Manage your account, theme, and preferences</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-400 font-medium">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="space-y-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 glass-card p-6">
          {tab === 'profile' && (
            <div className="space-y-5">
              <h3 className="text-white font-semibold text-lg">Profile Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Your name' },
                  { label: 'Phone Number', key: 'phone', placeholder: '9876543210' },
                  { label: 'Anganwadi ID', key: 'anganwadiId', placeholder: 'AWC-PUNE-042' },
                  { label: 'District', key: 'district', placeholder: 'Pune' },
                  { label: 'State', key: 'state', placeholder: 'Maharashtra' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'name' ? 'col-span-2' : ''}>
                    <label className="text-white/60 text-xs mb-1.5 block">{f.label}</label>
                    <input value={profile[f.key]} onChange={setP(f.key)} placeholder={f.placeholder} className="input-field" />
                  </div>
                ))}
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Language</label>
                  <select value={profile.language} onChange={setP('language')} className="input-field">
                    {['English', 'हिन्दी', 'मराठी', 'বাংলা', 'తెలుగు'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-white font-semibold text-lg">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'samAlerts', label: 'SAM Alerts', desc: 'Critical alerts for Severe Acute Malnutrition cases' },
                  { key: 'mamAlerts', label: 'MAM Alerts', desc: 'Alerts for Moderate Acute Malnutrition cases' },
                  { key: 'attendanceLow', label: 'Low Attendance', desc: 'Alert when attendance drops below 70%' },
                  { key: 'reportReady', label: 'Report Ready', desc: 'Notify when monthly reports are generated' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of center activity' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <div>
                      <p className="text-white text-sm font-medium">{n.label}</p>
                      <p className="text-white/40 text-xs">{n.desc}</p>
                    </div>
                    <button onClick={() => toggleNotif(n.key)}
                      className={`w-11 h-6 rounded-full transition-all relative ${settings.notifications?.[n.key] ? 'bg-green-500' : 'bg-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.notifications?.[n.key] ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">Theme & Appearance</h3>

              {/* Theme mode */}
              <div>
                <p className="text-white/60 text-sm mb-3">Theme Mode</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'dark', label: 'Dark Mode', desc: 'Default dark glassmorphism' },
                    { key: 'light', label: 'Light Mode', desc: 'Coming soon' },
                  ].map(t => (
                    <button key={t.key} onClick={() => updateSettings({ theme: t.key })}
                      className={`p-4 rounded-xl border text-left transition-all ${settings.theme === t.key ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                      <p className={`text-sm font-medium ${settings.theme === t.key ? 'text-green-400' : 'text-white'}`}>{t.label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div>
                <p className="text-white/60 text-sm mb-3">Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {ACCENTS.map(a => (
                    <button key={a.key} onClick={() => updateSettings({ accentColor: a.key })}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all ${settings.accentColor === a.key ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                      <div className="w-4 h-4 rounded-full" style={{ background: a.hex }} />
                      <span className="text-white/70 text-sm">{a.label}</span>
                      {settings.accentColor === a.key && <CheckCircle className="w-3.5 h-3.5 text-white/60" />}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-3">Accent color is applied immediately across the app.</p>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-5">
              <h3 className="text-white font-semibold text-lg">Security & Privacy</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white text-sm font-medium">Email</p>
                  <p className="text-white/40 text-sm mt-0.5">{currentUser?.email || 'Not set'}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-white text-sm font-medium">Account Type</p>
                  <p className="text-white/40 text-sm mt-0.5">{userProfile?.role || 'Worker'}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm font-medium">Data Privacy</p>
                  <p className="text-blue-400/60 text-xs mt-0.5">All data is stored locally in your browser. No data is sent to external servers without your Firebase configuration.</p>
                </div>
                <button className="btn-ghost text-sm text-red-400 border-red-500/20 hover:bg-red-500/10 w-full">Change Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
