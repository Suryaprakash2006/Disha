import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Circle, UploadCloud } from 'lucide-react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

export default function Documents() {
  const [params, setParams] = useSearchParams();
  const schemeId = params.get('schemeId') || '';
  const [schemes, setSchemes] = useState([]);
  const [checklist, setChecklist] = useState(null);
  const [readiness, setReadiness] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/schemes').then(({ data }) => setSchemes(data.schemes));
  }, []);

  const loadChecklist = (id) => {
    if (!id) return;
    setLoading(true);
    api.get(`/documents/checklist/${id}`)
      .then(({ data }) => { setChecklist(data.checklist); setReadiness(data.readinessPercentage); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadChecklist(schemeId); }, [schemeId]);

  const markStatus = async (documentName, status) => {
    await api.patch(`/documents/checklist/${schemeId}`, { documentName, status });
    loadChecklist(schemeId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Checklist</h1>
      <p className="text-sm text-slate-500 mb-6">Track your Document Readiness. This is self-reported — not government verification.</p>

      <div className="card p-4 mb-6">
        <label className="label">Select scheme</label>
        <select className="input" value={schemeId} onChange={(e) => setParams({ schemeId: e.target.value })}>
          <option value="">Choose a scheme</option>
          {schemes.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {!schemeId && <EmptyState title="Select a scheme" subtitle="Choose a scheme above to see its document checklist." />}
      {schemeId && loading && <LoadingState />}

      {schemeId && checklist && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Document Readiness</h3>
            <span className="text-brand-700 font-bold">{readiness}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full mb-5">
            <div className="h-2 bg-brand-600 rounded-full transition-all" style={{ width: `${readiness}%` }} />
          </div>

          <ul className="space-y-2">
            {checklist.map((c) => (
              <li key={c.documentName} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  {c.status !== 'pending' ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-slate-300" />}
                  <span className={c.status !== 'pending' ? 'text-slate-800' : 'text-slate-500'}>{c.documentName}</span>
                </div>
                <div className="flex gap-1">
                  {c.status === 'pending' && (
                    <button onClick={() => markStatus(c.documentName, 'ready')} className="btn-ghost !text-xs !px-2 !py-1">Mark Ready</button>
                  )}
                  {c.status !== 'pending' && (
                    <button onClick={() => markStatus(c.documentName, 'pending')} className="btn-ghost !text-xs !px-2 !py-1">Reset</button>
                  )}
                  <button className="btn-ghost !text-xs !px-2 !py-1"><UploadCloud size={13} /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
