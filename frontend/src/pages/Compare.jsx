import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

const ROWS = [
  { key: 'minLoanAmount', label: 'Loan amount', fmt: (s) => `₹${s.minLoanAmount?.toLocaleString('en-IN')} – ₹${s.maxLoanAmount?.toLocaleString('en-IN')}` },
  { key: 'maxProjectCost', label: 'Project cost', fmt: (s) => `₹${s.minProjectCost?.toLocaleString('en-IN')} – ₹${s.maxProjectCost?.toLocaleString('en-IN')}` },
  { key: 'interestRate', label: 'Interest', fmt: (s) => s.interestRate },
  { key: 'repaymentPeriod', label: 'Repayment', fmt: (s) => s.repaymentPeriod },
  { key: 'moratorium', label: 'Moratorium', fmt: (s) => s.moratorium },
  { key: 'subsidy', label: 'Subsidy', fmt: (s) => s.subsidy },
  { key: 'benefits', label: 'Benefits', fmt: (s) => s.benefits?.join(', ') },
  { key: 'requiredDocuments', label: 'Required documents', fmt: (s) => s.requiredDocuments?.join(', ') },
  { key: 'applicationMethod', label: 'Application method', fmt: (s) => s.applicationMethod },
];

export default function Compare() {
  const [params] = useSearchParams();
  const ids = params.get('ids');
  const [schemes, setSchemes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ids) return;
    api.get(`/schemes/compare?ids=${ids}`)
      .then(({ data }) => setSchemes(data.schemes))
      .catch((err) => setError(err.response?.data?.message || 'Could not load comparison.'));
  }, [ids]);

  if (!ids) return <EmptyState title="No schemes selected" subtitle="Select schemes from your matches to compare them here." />;
  if (error) return <ErrorState message={error} />;
  if (!schemes) return <LoadingState />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Scheme Comparison</h1>
      <p className="text-sm text-slate-500 mb-6">Factual, side-by-side comparison. Disha does not declare a "best" scheme — the right choice depends on your circumstances.</p>

      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left p-3 text-slate-500 font-medium w-40">Attribute</th>
              {schemes.map((s) => (
                <th key={s._id} className="text-left p-3 text-slate-800 font-semibold min-w-[200px]">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-slate-100">
                <td className="p-3 text-slate-500">{row.label}</td>
                {schemes.map((s) => (
                  <td key={s._id} className="p-3 text-slate-700">{row.fmt(s) || '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
