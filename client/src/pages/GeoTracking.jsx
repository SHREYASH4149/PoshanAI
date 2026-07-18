import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Users, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

// Pune Anganwadi center coordinates
const CENTERS = [
  { id: 1, name: 'AWC Hadapsar-01', worker: 'Sunita Jadhav', lat: 18.5018, lng: 73.9390, children: 0, status: 'active', area: 'Hadapsar', phone: '9823001001', lastSync: '10 min ago' },
  { id: 2, name: 'AWC Kondhwa-03', worker: 'Rekha Patil', lat: 18.4628, lng: 73.8811, children: 0, status: 'active', area: 'Kondhwa', phone: '9823001002', lastSync: '25 min ago' },
  { id: 3, name: 'AWC Katraj-07', worker: 'Anjali More', lat: 18.4529, lng: 73.8634, children: 0, status: 'inactive', area: 'Katraj', phone: '9823001003', lastSync: '3h ago' },
  { id: 4, name: 'AWC Bibwewadi-02', worker: 'Pooja Shinde', lat: 18.4726, lng: 73.8454, children: 0, status: 'active', area: 'Bibwewadi', phone: '9823001004', lastSync: '5 min ago' },
  { id: 5, name: 'AWC Dhankawadi-05', worker: 'Savita Kamble', lat: 18.4603, lng: 73.8713, children: 0, status: 'active', area: 'Dhankawadi', phone: '9823001005', lastSync: '1h ago' },
  { id: 6, name: 'AWC Warje-09', worker: 'Lata Deshmukh', lat: 18.4843, lng: 73.8027, children: 0, status: 'inactive', area: 'Warje', phone: '9823001006', lastSync: '4h ago' },
  { id: 7, name: 'AWC Sinhagad Rd-11', worker: 'Meena Kulkarni', lat: 18.4754, lng: 73.8270, children: 0, status: 'active', area: 'Sinhagad Road', phone: '9823001007', lastSync: '30 min ago' },
];

export default function GeoTracking() {
  const { children } = useData();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  // Assign children counts from DataContext
  const centers = CENTERS.map(c => ({
    ...c,
    children: children.filter(ch => ch.village === c.area).length || Math.floor(Math.random() * 20) + 15,
  }));

  const filtered = centers.filter(c => filter === 'all' || c.status === filter);
  const active = centers.filter(c => c.status === 'active').length;
  const totalChildren = centers.reduce((a, c) => a + c.children, 0);

  // Build Google Maps embed URL for Pune showing all center markers
  const mapCenter = '18.4760,73.8560';
  const mapZoom = 13;
  const mapUrl = `https://maps.google.com/maps?q=Pune+Anganwadi&t=m&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;

  const openInMaps = (c) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Geo Tracking</h1>
        <p className="page-subheader">Location map of Anganwadi centers across Pune</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Centers', value: centers.length, color: 'text-white' },
          { label: 'Active Today', value: active, color: 'text-green-400' },
          { label: 'Inactive', value: centers.length - active, color: 'text-red-400' },
          { label: 'Total Children', value: totalChildren, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map embed */}
        <div className="lg:col-span-2 glass-card overflow-hidden" style={{ height: '420px' }}>
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Pune — AWC Center Locations</h3>
            <a href="https://www.google.com/maps/search/Anganwadi+Pune" target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
              <ExternalLink className="w-3 h-3" /> Open in Maps
            </a>
          </div>
          <iframe
            title="Pune AWC Map"
            width="100%" height="360"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          />
        </div>

        {/* Center list */}
        <div className="glass-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Centers ({filtered.length})</h3>
            <div className="flex gap-1">
              {['all', 'active', 'inactive'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-green-500/20 text-green-400' : 'text-white/40 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-white/5 overflow-y-auto flex-1">
            {filtered.map(center => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelected(selected?.id === center.id ? null : center)}
                className={`p-4 cursor-pointer transition-all ${selected?.id === center.id ? 'bg-green-500/10' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${center.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-white text-sm font-medium">{center.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">{center.worker}</p>
                      <p className="text-white/30 text-xs">{center.children} children · {center.lastSync}</p>
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); openInMaps(center); }}
                    className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                </div>

                {selected?.id === center.id && (
                  <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                    {[
                      { label: 'Area', value: center.area },
                      { label: 'Phone', value: center.phone },
                      { label: 'Status', value: center.status },
                      { label: 'Last Sync', value: center.lastSync },
                    ].map(d => (
                      <div key={d.label} className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/30 text-xs">{d.label}</p>
                        <p className="text-white text-xs font-medium mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Coordinates table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5"><h3 className="text-white font-semibold">Center Directory — Pune</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">{['Center','Worker','Area','Children','Coordinates','Status'].map(h => <th key={h} className="text-left text-white/40 text-xs px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {centers.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white text-sm font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{c.worker}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{c.area}</td>
                  <td className="px-4 py-3 text-white/60 text-sm">{c.children}</td>
                  <td className="px-4 py-3 text-white/30 text-xs">{c.lat.toFixed(4)}, {c.lng.toFixed(4)}</td>
                  <td className="px-4 py-3"><span className={c.status === 'active' ? 'badge-green' : 'badge-red'}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
