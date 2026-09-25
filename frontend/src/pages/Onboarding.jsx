import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Personal Details', 'Business Details', 'Additional Details', 'Review'];

const CATEGORY_OPTIONS = ['General', 'SC', 'ST', 'OBC', 'EWS', 'Other'];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    category: user?.category || '',
    state: user?.state || '',
    district: user?.district || '',
    residenceType: user?.residenceType || '',
    annualIncome: user?.annualIncome || '',

    newOrExistingBusiness: user?.newOrExistingBusiness || '',
    businessType: user?.businessType || '',
    businessActivity: user?.businessActivity || '',
    businessCategory: user?.businessCategory || '',
    projectCost: user?.projectCost || '',
    loanRequired: user?.loanRequired || '',

    educationStatus: user?.educationStatus || '',
    previousLoanHistory: user?.previousLoanHistory || 'None',
    employmentStatus: user?.employmentStatus || '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submitAll = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      await refreshUser();
      navigate('/matches');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Tell us about yourself</h1>
      <p className="text-sm text-slate-500 mb-6">This helps Disha run a preliminary match against available schemes.</p>

      <Stepper step={step} />

      <div className="card p-6 mt-6">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Name"><input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age"><input type="number" className="input" value={form.age} onChange={(e) => update('age', e.target.value)} /></Field>
              <Field label="Gender">
                <select className="input" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </Field>
            </div>
            <Field label="Category">
              <select className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                <option value="">Select</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State"><input className="input" value={form.state} onChange={(e) => update('state', e.target.value)} /></Field>
              <Field label="District"><input className="input" value={form.district} onChange={(e) => update('district', e.target.value)} /></Field>
            </div>
            <Field label="Rural / Urban">
              <select className="input" value={form.residenceType} onChange={(e) => update('residenceType', e.target.value)}>
                <option value="">Select</option><option>Rural</option><option>Urban</option>
              </select>
            </Field>
            <Field label="Annual family income (₹)"><input type="number" className="input" value={form.annualIncome} onChange={(e) => update('annualIncome', e.target.value)} /></Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="New or Existing business">
              <select className="input" value={form.newOrExistingBusiness} onChange={(e) => update('newOrExistingBusiness', e.target.value)}>
                <option value="">Select</option><option>New</option><option>Existing</option>
              </select>
            </Field>
            <Field label="Business type"><input className="input" placeholder="e.g. Micro Enterprise" value={form.businessType} onChange={(e) => update('businessType', e.target.value)} /></Field>
            <Field label="Business activity"><input className="input" placeholder="e.g. Tailoring" value={form.businessActivity} onChange={(e) => update('businessActivity', e.target.value)} /></Field>
            <Field label="Manufacturing / Service / Trading">
              <select className="input" value={form.businessCategory} onChange={(e) => update('businessCategory', e.target.value)}>
                <option value="">Select</option><option>Manufacturing</option><option>Service</option><option>Trading</option><option>Other</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project cost (₹)"><input type="number" className="input" value={form.projectCost} onChange={(e) => update('projectCost', e.target.value)} /></Field>
              <Field label="Loan required (₹)"><input type="number" className="input" value={form.loanRequired} onChange={(e) => update('loanRequired', e.target.value)} /></Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Education"><input className="input" value={form.educationStatus} onChange={(e) => update('educationStatus', e.target.value)} /></Field>
            <Field label="Employment status"><input className="input" value={form.employmentStatus} onChange={(e) => update('employmentStatus', e.target.value)} /></Field>
            <Field label="Previous government loan / repayment status">
              <select className="input" value={form.previousLoanHistory} onChange={(e) => update('previousLoanHistory', e.target.value)}>
                <option>None</option><option>Repaid</option><option>Ongoing</option><option>Defaulted</option>
              </select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 mb-2">Review your information before finding matches.</p>
            {Object.entries(form).map(([k, v]) => v !== '' && (
              <div key={k} className="flex justify-between text-sm border-b border-slate-100 py-1.5">
                <span className="text-slate-500">{k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span>
                <span className="font-medium text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
          <button onClick={back} disabled={step === 0} className="btn-ghost disabled:opacity-30">
            <ChevronLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary">Next <ChevronRight size={16} /></button>
          ) : (
            <button onClick={submitAll} disabled={saving} className="btn-primary">
              <CheckCircle2 size={16} /> {saving ? 'Saving...' : 'Find Matching Schemes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {i + 1}
            </div>
            <span className={`text-[11px] mt-1 ${i === step ? 'text-brand-700 font-medium' : 'text-slate-400'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-brand-600' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
