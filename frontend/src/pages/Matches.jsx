import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Bookmark, Calculator, FileCheck } from 'lucide-react';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, EmptyState, ErrorState } from '../components/States';

export default function Matches() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .post('/match', {})
      .then(({ data }) => setResults(data.results))
      .catch((err) => setError(err.response?.data?.message || 'Could not run matching.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s));
  };

  const saveScheme = async (schemeId) => {
    try {
      await api.post('/saved-schemes', { schemeId });
    } catch {
      // non-critical for prototype UX
    }
  };

  if (loading) return <LoadingState label="Running preliminary match..." />;
  if (error) return <ErrorState message={error} />;
  if (!results || !results.length) return <EmptyState title="No schemes found" subtitle="Complete your profile to see matches." action={<Link to="/onboarding" className="btn-primary">Complete Profile</Link>} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Potential Scheme Matches</h1>
          <p className="text-sm text-slate-500 mt-1">Preliminary results from the rule engine — not an official eligibility decision.</p>
        </div>
        {selected.length >= 2 && (
          <button onClick={() => navigate(`/compare?ids=${selected.join(',')}`)} className="btn-primary">
            <Scale size={16} /> Compare Selected ({selected.length})
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {results.map((r) => (
          <div key={r.scheme._id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-slate-400">{r.scheme.organization}{r.scheme.schemeType !== 'NSFDC' ? ' · Not an NSFDC scheme' : ''}</p>
                <h3 className="font-semibold text-slate-800">{r.scheme.name}</h3>
              </div>
              <input type="checkbox" checked={selected.includes(r.scheme._id)} onChange={() => toggleSelect(r.scheme._id)} className="mt-1 w-4 h-4" />
            </div>

            <div className="mt-2"><StatusBadge status={r.status} /></div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div><span className="block text-slate-400">Loan range</span>₹{r.scheme.minLoanAmount?.toLocaleString('en-IN')} – ₹{r.scheme.maxLoanAmount?.toLocaleString('en-IN')}</div>
              <div><span className="block text-slate-400">Repayment</span>{r.scheme.repaymentPeriod}</div>
            </div>

            {r.matchedRules.length > 0 && (
              <div className="mt-3 text-xs">
                <p className="text-slate-500 font-medium mb-1">Why this scheme matched</p>
                <ul className="space-y-0.5">
                  {r.matchedRules.slice(0, 3).map((m, i) => (
                    <li key={i} className="text-green-700">✓ {m.explanation}</li>
                  ))}
                </ul>
              </div>
            )}

            {r.warnings.length > 0 && (
              <div className="mt-2 text-xs">
                <p className="text-slate-500 font-medium mb-1">Things you still need to verify</p>
                <ul className="space-y-0.5">
                  {r.warnings.slice(0, 2).map((w, i) => (
                    <li key={i} className="text-amber-600">⚠ {w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
              <Link to={`/schemes/${r.scheme._id}`} className="btn-secondary !px-3 !py-1.5 !text-xs">View Details</Link>
              <button onClick={() => saveScheme(r.scheme._id)} className="btn-ghost !px-3 !py-1.5 !text-xs"><Bookmark size={13} /> Save</button>
              <Link to={`/calculator?schemeId=${r.scheme._id}`} className="btn-ghost !px-3 !py-1.5 !text-xs"><Calculator size={13} /> Calculate EMI</Link>
              <Link to={`/documents?schemeId=${r.scheme._id}`} className="btn-ghost !px-3 !py-1.5 !text-xs"><FileCheck size={13} /> Documents</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
