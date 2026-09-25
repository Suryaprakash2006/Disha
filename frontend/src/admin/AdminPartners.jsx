import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Power } from 'lucide-react';
import api from '../utils/api';
import { LoadingState } from '../components/States';

const PARTNER_TYPES = ['SCA', 'PSB', 'RRB', 'NBFC-MFI', 'Cooperative Bank', 'Small Finance Bank', 'Cooperative Society', 'Other Authorized Agency'];

const BLANK = { name: '', type: 'SCA', state: '', district: '', address: '', latitude: '', longitude: '', phone: '', sourceUrl: '' };

export default function AdminPartners() {
  const [partners, setPartners] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  const load = () => api.get('/partners').then(({ data }) => setPartners(data.partners));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/partners', { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude), lastVerifiedAt: new Date().toISOString() });
    setForm(BLANK);
    setShowForm(false);
    load();
  };

  const toggleActive = async (p) => {
    await api.put(`/partners/${p._id}`, { activeStatus: !p.activeStatus });
    load();
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await api.delete(`/partners/${p._id}`);
    load();
  };

  if (!partners) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Channel Partner Management</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary"><PlusCircle size={16} /> New Partner</button>
      </div>

      {showForm && (
        <form onSubmit={create} className="card p-5 mb-6 grid sm:grid-cols-3 gap-3">
          <input required placeholder="Name" className="input sm:col-span-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {PARTNER_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input required placeholder="State" className="input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <input required placeholder="District" className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <input placeholder="Phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Address" className="input sm:col-span-3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input required type="number" step="any" placeholder="Latitude" className="input" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          <input required type="number" step="any" placeholder="Longitude" className="input" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          <input placeholder="Source URL" className="input" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} />
          <div className="sm:col-span-3 flex gap-2">
            <button type="submit" className="btn-primary">Create Partner</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {partners.map((p) => (
          <div key={p._id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{p.type} · {p.district}, {p.state} · <span className={p.activeStatus ? 'text-green-600' : 'text-slate-400'}>{p.activeStatus ? 'Active' : 'Inactive'}</span></p>
              <h4 className="font-semibold text-slate-800">{p.name}</h4>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleActive(p)} className="btn-ghost !text-xs !px-2 !py-1"><Power size={14} /></button>
              <button onClick={() => remove(p)} className="btn-ghost !text-xs !px-2 !py-1 text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
