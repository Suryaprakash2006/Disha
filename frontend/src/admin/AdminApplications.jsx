import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

export default function AdminApplications() {
  const [apps, setApps] = useState(null);

  useEffect(() => {
    api.get('/applications/admin/all').then(({ data }) => setApps(data.applications));
  }, []);

  if (!apps) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">All Applications</h1>
      <p className="text-sm text-slate-500 mb-6">Simulated application tracking across all users — not connected to an official government API.</p>

      {apps.length === 0 && <EmptyState title="No applications tracked yet" />}

      <div className="space-y-2">
        {apps.map((a) => (
          <div key={a._id} className="card p-4 flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-400">{a.userId?.name} · {a.userId?.email}</p>
              <h4 className="font-medium text-slate-800">{a.schemeId?.name}</h4>
              {a.channelPartnerId && <p className="text-xs text-slate-400">via {a.channelPartnerId.name}</p>}
            </div>
            <span className="badge bg-blue-100 text-blue-700">{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
