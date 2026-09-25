import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandPlot } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <LandPlot className="mx-auto text-saffron mb-2" size={32} />
        <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
        <p className="text-sm text-slate-500 mt-1">Start discovering schemes that fit your journey</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Full name</label>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-brand-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
