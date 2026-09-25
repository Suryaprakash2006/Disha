import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { LoadingState, ErrorState } from '../components/States';

export default function Schemes() {
  const [schemes, setSchemes] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/schemes')
      .then(({ data }) => setSchemes(data.schemes))
      .catch((err) => setError(err.response?.data?.message || 'Could not load schemes.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!schemes) return <LoadingState />;

  const filtered = filter === 'all' ? schemes : schemes.filter((s) => s.schemeType === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Explore Schemes</h1>
      <p className="text-sm text-slate-500 mb-6">All schemes are sourced from official government portals. NSFDC schemes are the primary focus; PMMY and Stand-Up India are additional schemes, not NSFDC schemes.</p>

      <div className="flex gap-2 mb-6">
        {[['all', 'All'], ['NSFDC', 'NSFDC Schemes'], ['Other Government Scheme', 'Other Government Schemes']].map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === v ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div key={s._id} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.organization}</p>
              {s.schemeType === 'NSFDC' && <span className="badge bg-brand-50 text-brand-700"><ShieldCheck size={12} /> NSFDC</span>}
            </div>
            <h3 className="font-semibold text-slate-800 mt-1">{s.name}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{s.description}</p>
            <div className="mt-3 text-xs text-slate-500">
              Loan range: ₹{s.minLoanAmount?.toLocaleString('en-IN')} – ₹{s.maxLoanAmount?.toLocaleString('en-IN')}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link to={`/schemes/${s._id}`} className="btn-secondary !px-3 !py-1.5 !text-xs">View Details</Link>
              <a href={s.officialSourceUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 flex items-center gap-1">
                Official source <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
