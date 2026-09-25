import React, { useEffect, useState } from 'react';
import { ScrollText, CheckCircle2, MapPinned, Users, ClipboardList, Clock } from 'lucide-react';
import api from '../utils/api';
import { LoadingState } from '../components/States';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then(({ data }) => setSummary(data.summary));
  }, []);

  if (!summary) return <LoadingState />;

  const cards = [
    { label: 'Total Schemes', value: summary.totalSchemes, icon: ScrollText },
    { label: 'Active Schemes', value: summary.activeSchemes, icon: CheckCircle2 },
    { label: 'Channel Partners', value: summary.channelPartners, icon: MapPinned },
    { label: 'Users', value: summary.users, icon: Users },
    { label: 'Applications', value: summary.applications, icon: ClipboardList },
    { label: 'Last Updated', value: summary.lastUpdated ? new Date(summary.lastUpdated).toLocaleDateString() : 'N/A', icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="text-sm text-slate-500 mb-6">Overview of Disha prototype data.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <c.icon className="text-brand-600" size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{c.value}</p>
              <p className="text-xs text-slate-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
