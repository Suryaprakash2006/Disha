import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandPlot } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <LandPlot className="mx-auto text-saffron mb-2" size={32} />
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Log in to Disha to see your matches</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-xs text-slate-400 text-center">
          Demo user: demo.user@disha.gov.in / Demo@12345
        </p>
      </form>
      <p className="text-center text-sm text-slate-500 mt-4">
        Don't have an account? <Link to="/register" className="text-brand-600 font-medium">Register</Link>
      </p>
    </div>
  );
}
