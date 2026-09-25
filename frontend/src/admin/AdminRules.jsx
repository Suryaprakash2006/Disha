import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { LoadingState, EmptyState } from '../components/States';

const OPERATORS = ['==', '!=', '>', '>=', '<', '<=', 'IN', 'NOT_IN', 'BETWEEN'];
const RULE_TYPES = ['mandatory', 'conditional', 'informational'];

export default function AdminRules() {
  const [schemes, setSchemes] = useState([]);
  const [schemeId, setSchemeId] = useState('');
  const [rules, setRules] = useState(null);
  const [form, setForm] = useState({ field: '', operator: '==', value: '', ruleType: 'mandatory', priority: 1, explanation: '' });

  useEffect(() => {
    api.get('/schemes?status=all').then(({ data }) => setSchemes(data.schemes));
  }, []);

  const loadRules = (id) => {
    if (!id) return;
    api.get(`/eligibility-rules/scheme/${id}`).then(({ data }) => setRules(data.rules));
  };

  useEffect(() => { loadRules(schemeId); }, [schemeId]);

  const parseValue = (raw) => {
    // supports plain values, comma lists (IN/NOT_IN), and "a,b" for BETWEEN
    if (form.operator === 'IN' || form.operator === 'NOT_IN' || form.operator === 'BETWEEN') {
      const parts = raw.split(',').map((p) => p.trim());
      return parts.map((p) => (isNaN(Number(p)) ? p : Number(p)));
    }
    return isNaN(Number(raw)) ? raw : Number(raw);
  };

  const addRule = async (e) => {
    e.preventDefault();
    await api.post('/eligibility-rules', {
      schemeId,
      field: form.field,
      operator: form.operator,
      value: parseValue(form.value),
      ruleType: form.ruleType,
      priority: Number(form.priority),
      explanation: form.explanation,
    });
    setForm({ field: '', operator: '==', value: '', ruleType: 'mandatory', priority: 1, explanation: '' });
    loadRules(schemeId);
  };

  const removeRule = async (id) => {
    await api.delete(`/eligibility-rules/${id}`);
    loadRules(schemeId);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Eligibility Rule Management</h1>
      <p className="text-sm text-slate-500 mb-6">Rules drive the backend matching engine. Values for IN / NOT_IN / BETWEEN accept comma-separated lists.</p>

      <div className="card p-4 mb-6">
        <label className="label">Select scheme</label>
        <select className="input" value={schemeId} onChange={(e) => setSchemeId(e.target.value)}>
          <option value="">Choose a scheme</option>
          {schemes.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {!schemeId && <EmptyState title="Select a scheme to manage its rules" />}

      {schemeId && (
        <>
          <form onSubmit={addRule} className="card p-4 mb-5 grid sm:grid-cols-6 gap-2 items-end">
            <input required placeholder="field e.g. annualIncome" className="input sm:col-span-2" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
            <select className="input" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })}>
              {OPERATORS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <input required placeholder="value" className="input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            <select className="input" value={form.ruleType} onChange={(e) => setForm({ ...form, ruleType: e.target.value })}>
              {RULE_TYPES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <input type="number" placeholder="priority" className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            <input required placeholder="explanation shown to users" className="input sm:col-span-5" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            <button type="submit" className="btn-primary"><PlusCircle size={16} /> Add Rule</button>
          </form>

          {!rules ? <LoadingState /> : (
            <div className="space-y-2">
              {rules.map((r) => (
                <div key={r._id} className="card p-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-mono text-xs bg-slate-100 rounded px-1.5 py-0.5 mr-2">{r.field} {r.operator} {JSON.stringify(r.value)}</span>
                    <span className={`badge ${r.ruleType === 'mandatory' ? 'bg-red-50 text-red-600' : r.ruleType === 'conditional' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{r.ruleType}</span>
                    <p className="text-xs text-slate-500 mt-1">{r.explanation}</p>
                  </div>
                  <button onClick={() => removeRule(r._id)} className="btn-ghost !text-xs !px-2 !py-1 text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
              {rules.length === 0 && <EmptyState title="No rules yet for this scheme" />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
