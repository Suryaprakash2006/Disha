import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, RefreshCcw, Power, Edit3 } from 'lucide-react';
import api from '../utils/api';
import { LoadingState } from '../components/States';

const BLANK = {
  name: '', shortName: '', organization: '', department: '', schemeType: 'NSFDC',
  description: '', purpose: '', minAge: '', maxAge: '', minIncome: '', maxIncome: '',
  minProjectCost: '', maxProjectCost: '', minLoanAmount: '', maxLoanAmount: '',
  interestRate: '', repaymentPeriod: '', moratorium: '', officialSourceUrl: '',
  officialApplicationUrl: '', sourceName: '',
};

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = () => api.get('/schemes?status=all').then(({ data }) => setSchemes(data.schemes));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(BLANK); setShowForm(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...BLANK, ...s }); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, lastVerifiedAt: new Date().toISOString() };
    if (editing) await api.put(`/schemes/${editing._id}`, payload);
    else await api.post('/schemes', payload);
    setShowForm(false);
    load();
  };

  const toggleStatus = async (s) => {
    await api.patch(`/schemes/${s._id}/status`, { status: s.status === 'active' ? 'inactive' : 'active' });
    load();
  };

  const verify = async (s) => {
    await api.patch(`/schemes/${s._id}/verify`, { reason: 'Manual re-verification via admin dashboard' });
    load();
  };

  const remove = async (s) => {
    if (!confirm(`Delete "${s.name}"? This also removes its eligibility rules.`)) return;
    await api.delete(`/schemes/${s._id}`);
    load();
  };

  if (!schemes) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Scheme Management</h1>
        <button onClick={openCreate} className="btn-primary"><PlusCircle size={16} /> New Scheme</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-5 mb-6 grid sm:grid-cols-2 gap-3">
          <input required placeholder="Scheme name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Short name" className="input" value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} />
          <input required placeholder="Organization" className="input" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <input required placeholder="Department" className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <select className="input" value={form.schemeType} onChange={(e) => setForm({ ...form, schemeType: e.target.value })}>
            <option value="NSFDC">NSFDC</option>
            <option value="Other Government Scheme">Other Government Scheme</option>
          </select>
          <input required placeholder="Source name" className="input" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
          <textarea placeholder="Description" className="input sm:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Min loan amount" type="number" className="input" value={form.minLoanAmount} onChange={(e) => setForm({ ...form, minLoanAmount: e.target.value })} />
          <input placeholder="Max loan amount" type="number" className="input" value={form.maxLoanAmount} onChange={(e) => setForm({ ...form, maxLoanAmount: e.target.value })} />
          <input placeholder="Interest rate" className="input" value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} />
          <input placeholder="Repayment period" className="input" value={form.repaymentPeriod} onChange={(e) => setForm({ ...form, repaymentPeriod: e.target.value })} />
          <input required placeholder="Official source URL" className="input sm:col-span-2" value={form.officialSourceUrl} onChange={(e) => setForm({ ...form, officialSourceUrl: e.target.value })} />
          <input placeholder="Official application URL" className="input sm:col-span-2" value={form.officialApplicationUrl} onChange={(e) => setForm({ ...form, officialApplicationUrl: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">{editing ? 'Update Scheme' : 'Create Scheme'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {schemes.map((s) => (
          <div key={s._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">{s.organization} · v{s.version} · <span className={s.status === 'active' ? 'text-green-600' : 'text-slate-400'}>{s.status}</span></p>
              <h4 className="font-semibold text-slate-800">{s.name}</h4>
              <p className="text-[11px] text-slate-400">Last verified: {new Date(s.lastVerifiedAt).toDateString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(s)} className="btn-ghost !text-xs !px-2 !py-1"><Edit3 size={14} /></button>
              <button onClick={() => verify(s)} className="btn-ghost !text-xs !px-2 !py-1"><RefreshCcw size={14} /></button>
              <button onClick={() => toggleStatus(s)} className="btn-ghost !text-xs !px-2 !py-1"><Power size={14} /></button>
              <button onClick={() => remove(s)} className="btn-ghost !text-xs !px-2 !py-1 text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
