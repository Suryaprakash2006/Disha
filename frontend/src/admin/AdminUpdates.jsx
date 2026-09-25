import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

export default function AdminUpdates() {
  const [updates, setUpdates] = useState(null);

  useEffect(() => {
    api.get('/schemes/updates/all').then(({ data }) => setUpdates(data.updates));
  }, []);

  if (!updates) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Scheme Update Management</h1>
      <p className="text-sm text-slate-500 mb-6">Full audit trail of scheme creation, edits, status changes and re-verifications.</p>

      {updates.length === 0 && <EmptyState title="No updates recorded yet" />}

      <div className="space-y-2">
        {updates.map((u) => (
          <div key={u._id} className="card p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{u.schemeId?.name || 'Deleted scheme'}</span>
              <span className={`badge ${u.changeType === 'create' ? 'bg-green-100 text-green-700' : u.changeType === 'deactivate' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>{u.changeType}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">By {u.changedBy?.name || 'Unknown'} on {new Date(u.timestamp).toLocaleString()}</p>
            {u.reason && <p className="text-xs text-slate-600 mt-1">Reason: {u.reason}</p>}
            {u.sourceUrl && <a href={u.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600">{u.sourceUrl}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
