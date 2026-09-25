import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator as CalcIcon } from 'lucide-react';
import api from '../utils/api';

export default function Calculator() {
  const [params] = useSearchParams();
  const schemeId = params.get('schemeId') || '';
  const [form, setForm] = useState({ loanAmount: 100000, annualInterestRate: 8, tenureMonths: 36 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = async (e) => {
    e?.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/calculator/emi', { ...form, schemeId: schemeId || undefined });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not calculate EMI.');
    }
  };

  useEffect(() => { calculate(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2"><CalcIcon /> Financial Calculator</h1>
      <p className="text-sm text-slate-500 mb-6">Estimate your EMI before you apply. All figures are estimates, not a loan offer.</p>

      <form onSubmit={calculate} className="card p-6 grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Loan amount (₹)</label>
          <input type="number" className="input" value={form.loanAmount} onChange={(e) => setForm({ ...form, loanAmount: e.target.value })} />
        </div>
        <div>
          <label className="label">Annual interest rate (%)</label>
          <input type="number" step="0.1" className="input" value={form.annualInterestRate} onChange={(e) => setForm({ ...form, annualInterestRate: e.target.value })} />
        </div>
        <div>
          <label className="label">Tenure (months)</label>
          <input type="number" className="input" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="btn-primary w-full sm:w-auto">Calculate</button>
        </div>
      </form>

      {error && <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}

      {result && (
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Estimate</h3>
            <StatRow label="Principal" value={`₹${result.results.principal.toLocaleString('en-IN')}`} />
            <StatRow label="Estimated EMI" value={`₹${result.results.estimatedEMI.toLocaleString('en-IN')}/mo`} highlight />
            <StatRow label="Total Interest" value={`₹${result.results.totalInterest.toLocaleString('en-IN')}`} />
            <StatRow label="Total Repayment" value={`₹${result.results.totalRepayment.toLocaleString('en-IN')}`} />
            <p className="text-xs text-slate-400 mt-3">{result.disclaimer}</p>
          </div>

          {result.schemeContext && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Scheme context — {result.schemeContext.name}</h3>
              <StatRow label="Scheme maximum loan" value={result.schemeContext.schemeMaxLoan ? `₹${result.schemeContext.schemeMaxLoan.toLocaleString('en-IN')}` : 'Not specified'} />
              <StatRow label="Scheme interest information" value={result.schemeContext.schemeInterestInfo || 'Not specified'} />
              <StatRow label="Maximum repayment period" value={result.schemeContext.maxRepaymentPeriod || 'Not specified'} />
              <StatRow label="Moratorium" value={result.schemeContext.moratorium || 'Not specified'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between py-2 text-sm border-b border-slate-100 ${highlight ? 'text-brand-700 font-semibold' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
