import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

const STATUS_OPTIONS = ['Draft', 'Documents Pending', 'Application Submitted', 'Under Review', 'Additional Information Required', 'Approved', 'Rejected'];

const STATUS_COLORS = {
  Draft: 'bg-slate-100 text-slate-600',
  'Documents Pending': 'bg-amber-100 text-amber-700',
  'Application Submitted': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-indigo-100 text-indigo-700',
  'Additional Information Required': 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function Applications() {
  const [apps, setApps] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ schemeId: '', applicationReference: '', status: 'Draft' });

  const load = () => api.get('/applications').then(({ data }) => setApps(data.applications));

  useEffect(() => {
    load();
    api.get('/schemes').then(({ data }) => setSchemes(data.schemes));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/applications', form);
    setShowForm(false);
    setForm({ schemeId: '', applicationReference: '', status: 'Draft' });
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/applications/${id}`, { status });
    load();
  };

  if (!apps) return <LoadingState />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Application Tracking</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary"><PlusCircle size={16} /> Add</button>
      </div>
      <p className="text-sm text-slate-500 mb-6">Simulated tracking — not connected to an official government API.</p>

      {showForm && (
        <form onSubmit={create} className="card p-5 mb-6 space-y-3">
          <select required className="input" value={form.schemeId} onChange={(e) => setForm({ ...form, schemeId: e.target.value })}>
            <option value="">Select scheme</option>
            {schemes.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <input className="input" placeholder="Application reference (optional)" value={form.applicationReference} onChange={(e) => setForm({ ...form, applicationReference: e.target.value })} />
          <button type="submit" className="btn-primary">Save Application</button>
        </form>
      )}

      {apps.length === 0 && <EmptyState title="No applications tracked yet" subtitle="Add one after you apply through a channel partner or official portal." />}

      <div className="space-y-3">
        {apps.map((a) => (
          <div key={a._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-800">{a.schemeId?.name}</h4>
              <p className="text-xs text-slate-400">{a.applicationReference || 'No reference'} · Updated {new Date(a.lastUpdated).toDateString()}</p>
            </div>
            <select
              value={a.status}
              onChange={(e) => updateStatus(a._id, e.target.value)}
              className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 ${STATUS_COLORS[a.status]}`}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
