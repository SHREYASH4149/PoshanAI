import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, ArrowRight, Shield, Zap, Globe, BarChart3,
  Users, Brain, CheckCircle, Star, ChevronDown
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Deep learning models detect malnutrition and analyze meal nutrition with 94% accuracy.', color: 'from-green-500 to-emerald-400' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboards tracking 2M+ children across 500,000 Anganwadis nationwide.', color: 'from-orange-500 to-amber-400' },
  { icon: Shield, title: 'Government Ready', desc: 'Compliance with ICDS guidelines, integrated with MIS portals and state reports.', color: 'from-blue-500 to-cyan-400' },
  { icon: Globe, title: 'Geo Tracking', desc: 'Real-time location tracking of Anganwadi centers with district-level coverage maps.', color: 'from-purple-500 to-pink-400' },
  { icon: Users, title: 'Multi-Role Access', desc: 'Tailored dashboards for workers, supervisors, CDPO officers, and government officials.', color: 'from-teal-500 to-green-400' },
  { icon: Zap, title: 'Instant Alerts', desc: 'Automated critical alerts for SAM/MAM cases, missed vaccinations, and growth faltering.', color: 'from-red-500 to-orange-400' },
];

const stats = [
  { value: '2.8M+', label: 'Children Monitored' },
  { value: '94%', label: 'Detection Accuracy' },
  { value: '28', label: 'States Covered' },
  { value: '500K+', label: 'Anganwadis' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/20 via-transparent to-orange-950/20 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center glow-green">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-xl">PoshanAI</span>
            <span className="ml-2 badge-green text-xs">Beta</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 md:px-16 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Powered by AI · Built for India</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black leading-tight mb-6">
            <span className="gradient-text">AI-Powered</span><br />
            <span className="text-white">Nutrition Monitoring</span><br />
            <span className="text-white/60 text-3xl md:text-5xl">for Every Anganwadi</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            PoshanAI transforms child nutrition tracking with real-time AI analysis, predictive malnutrition detection, and government-grade reporting tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-4">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-16 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-white/40 max-w-xl mx-auto">A complete nutrition monitoring platform designed for Anganwadi workers, supervisors, and government officials.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-16 pb-24">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center bg-gradient-to-br from-green-900/20 to-orange-900/20 border-green-500/20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Transform Nutrition Monitoring?</h2>
          <p className="text-white/50 mb-8 text-lg">Join 50,000+ Anganwadi workers already using PoshanAI</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-16 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            <span className="text-white/40 text-sm">PoshanAI © 2024 · Built for India's Children</span>
          </div>
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
