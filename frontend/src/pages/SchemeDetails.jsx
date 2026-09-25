import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Calculator, FileCheck, MapPinned, CalendarCheck2 } from 'lucide-react';
import api from '../utils/api';
import { LoadingState, ErrorState } from '../components/States';

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/schemes/${id}`)
      .then(({ data }) => setScheme(data.scheme))
      .catch((err) => setError(err.response?.data?.message || 'Scheme not found.'));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!scheme) return <LoadingState />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-xs text-slate-400">{scheme.organization} · {scheme.department}</p>
      <h1 className="text-2xl font-bold text-slate-800 mt-1">{scheme.name}</h1>
      {scheme.schemeType !== 'NSFDC' && (
        <p className="text-xs text-amber-600 mt-1">Additional government financing scheme — not an NSFDC scheme.</p>
      )}
      <p className="text-slate-600 mt-3">{scheme.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        <Link to={`/calculator?schemeId=${scheme._id}`} className="btn-secondary !text-xs !px-3 !py-1.5"><Calculator size={13} /> Calculate EMI</Link>
        <Link to={`/documents?schemeId=${scheme._id}`} className="btn-secondary !text-xs !px-3 !py-1.5"><FileCheck size={13} /> Document Checklist</Link>
        <Link to={`/partners?schemeId=${scheme._id}`} className="btn-secondary !text-xs !px-3 !py-1.5"><MapPinned size={13} /> Find Channel Partners</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Eligibility & Purpose</h3>
          <Row label="Who it is for" value={scheme.beneficiaryCategories?.join(', ')} />
          <Row label="Purpose" value={scheme.purpose} />
          <Row label="Age range" value={scheme.minAge != null ? `${scheme.minAge} – ${scheme.maxAge}` : null} />
          <Row label="Income limit" value={scheme.maxIncome != null ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}` : 'Not restricted'} />
          <Row label="Eligible activities" value={scheme.eligibleActivities?.join(', ')} />
          <Row label="Location rules" value={scheme.locationRules} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Loan & Financial Terms</h3>
          <Row label="Loan amount" value={`₹${scheme.minLoanAmount?.toLocaleString('en-IN')} – ₹${scheme.maxLoanAmount?.toLocaleString('en-IN')}`} />
          <Row label="Project cost limit" value={`₹${scheme.minProjectCost?.toLocaleString('en-IN')} – ₹${scheme.maxProjectCost?.toLocaleString('en-IN')}`} />
          <Row label="Interest rate" value={scheme.interestRate} />
          <Row label="Repayment period" value={scheme.repaymentPeriod} />
          <Row label="Moratorium" value={scheme.moratorium} />
          <Row label="Subsidy/benefits" value={scheme.benefits?.join(', ') || scheme.subsidy} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Documents & Channel</h3>
          <Row label="Required documents" value={scheme.requiredDocuments?.join(', ')} />
          <Row label="Channel partner types" value={scheme.channelPartnerTypes?.join(', ')} />
          <Row label="Application procedure" value={scheme.applicationInstructions} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><CalendarCheck2 size={16} /> Source & Verification</h3>
          <Row label="Source" value={scheme.sourceName} />
          <Row label="Last verified" value={scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt).toDateString() : 'N/A'} />
          <Row label="Version" value={scheme.version} />
          <a href={scheme.officialSourceUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-600 flex items-center gap-1 mt-2">
            View official source <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <a href={scheme.officialApplicationUrl} target="_blank" rel="noreferrer" className="btn-primary">
          Apply on Official Portal <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
