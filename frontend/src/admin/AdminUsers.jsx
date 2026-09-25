import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

export default function AdminUsers() {
  const [summaries, setSummaries] = useState(null);

  useEffect(() => {
    api.get('/admin/user-matches').then(({ data }) => setSummaries(data.summaries));
  }, []);

  if (!summaries) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">User Match Monitoring</h1>
      <p className="text-sm text-slate-500 mb-6">Preliminary match counts per registered user, computed live from the rule engine.</p>

      {summaries.length === 0 && <EmptyState title="No users registered yet" />}

      <div className="card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-slate-500 font-medium">Name</th>
              <th className="text-left p-3 text-slate-500 font-medium">Email</th>
              <th className="text-left p-3 text-slate-500 font-medium">Potentially Eligible Schemes</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr key={s.userId} className="border-t border-slate-100">
                <td className="p-3 text-slate-800">{s.name}</td>
                <td className="p-3 text-slate-500">{s.email}</td>
                <td className="p-3"><span className="badge bg-green-100 text-green-700">{s.potentiallyEligibleCount}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
