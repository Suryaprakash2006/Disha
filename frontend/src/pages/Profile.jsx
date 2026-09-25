import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/saved-schemes').then(({ data }) => setSaved(data.saved)).catch(() => { });
    api.get('/applications').then(({ data }) => setApps(data.applications)).catch(() => { });
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome, {user.name?.split(' ')[0]}</h1>
      <p className="text-sm text-slate-500 mb-6">Your Disha dashboard</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Profile completion" value={`${user.profileCompletion || 0}%`} />
        <StatCard label="Saved schemes" value={saved.length} />
        <StatCard label="Applications" value={apps.length} />
      </div>

      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">Your Profile</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Category" value={user.category} />
          <InfoRow label="State / District" value={[user.state, user.district].filter(Boolean).join(', ')} />
          <InfoRow label="Business activity" value={user.businessActivity} />
          <InfoRow label="Loan required" value={user.loanRequired ? `₹${Number(user.loanRequired).toLocaleString('en-IN')}` : null} />
        </div>
        <Link to="/onboarding" className="btn-secondary mt-4 inline-flex !text-xs !px-3 !py-1.5">Update profile</Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Saved Schemes</h3>
          {saved.length === 0 && <p className="text-sm text-slate-400">No schemes saved yet.</p>}
          <ul className="space-y-1 text-sm">
            {saved.map((s) => s.schemeId && <li key={s._id}><Link to={`/schemes/${s.schemeId._id}`} className="text-brand-600 hover:underline">{s.schemeId.name}</Link></li>)}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Application Status</h3>
          {apps.length === 0 && <p className="text-sm text-slate-400">No applications tracked yet.</p>}
          <ul className="space-y-1 text-sm">
            {apps.slice(0, 5).map((a) => <li key={a._id} className="flex justify-between"><span>{a.schemeId?.name}</span><span className="text-slate-500">{a.status}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-bold text-brand-700">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-slate-100 py-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
