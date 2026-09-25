import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { LoadingState } from '../components/States';

const CATEGORIES = ['Identity', 'Income', 'Address', 'Business', 'Financial', 'Other'];

export default function AdminDocuments() {
  const [types, setTypes] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Other', description: '' });

  const load = () => api.get('/documents/types').then(({ data }) => setTypes(data.types));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/documents/types', form);
    setForm({ name: '', category: 'Other', description: '' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/documents/types/${id}`);
    load();
  };

  if (!types) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Management</h1>
      <p className="text-sm text-slate-500 mb-6">Master list of document types available to attach to scheme checklists.</p>

      <form onSubmit={create} className="card p-4 mb-6 grid sm:grid-cols-4 gap-2 items-end">
        <input required placeholder="Document name" className="input sm:col-span-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button type="submit" className="btn-primary"><PlusCircle size={16} /> Add</button>
        <input placeholder="Description (optional)" className="input sm:col-span-4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </form>

      <div className="space-y-2">
        {types.map((d) => (
          <div key={d._id} className="card p-3 flex items-center justify-between text-sm">
            <div>
              <span className="badge bg-slate-100 text-slate-600 mr-2">{d.category}</span>
              <span className="font-medium text-slate-800">{d.name}</span>
              {d.description && <p className="text-xs text-slate-400 mt-0.5">{d.description}</p>}
            </div>
            <button onClick={() => remove(d._id)} className="btn-ghost !text-xs !px-2 !py-1 text-red-500"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
