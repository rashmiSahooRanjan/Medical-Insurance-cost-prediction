import React, { useState } from 'react';
import { ShieldCheck, X as CloseIcon, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: 28,
    gender: 'Male',
    city: 'Mumbai',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success && data.token && data.user) {
        login(data.user, data.token);
        onClose();
      } else {
        setError(data.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // In offline or local demo fallback:
      if (!isRegister && form.email === 'demo@arogyakavaj.com') {
        demoLogin();
        onClose();
      } else {
        setError('Cannot connect to authentication server. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setLoading(true);
    await demoLogin();
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-card p-6 max-w-md w-full animate-fade-in relative">
        <button className="modal-close-btn" onClick={onClose}>
          <CloseIcon size={20} />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="brand-logo-icon mx-auto mb-2 inline-flex">
            <ShieldCheck className="brand-shield" size={32} />
          </div>
          <h2 className="text-2xl font-bold">
            {isRegister ? 'Join आरोग्य कवच' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-muted">
            {isRegister
              ? 'Create an account to save predictions and manage policies'
              : 'Sign in to access your digital policies & health records'}
          </p>
        </div>

        {/* Quick Demo User Pill */}
        {!isRegister && (
          <div className="demo-login-banner p-3 mb-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary flex-shrink-0" />
              <span className="text-xs text-emerald-200">Test quickly with 1-click Demo Account</span>
            </div>
            <button
              type="button"
              className="btn btn-primary py-1 px-3 text-xs"
              onClick={handleDemoFill}
            >
              Quick Login
            </button>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="tab-pill-group mb-5 flex border border-subtle rounded-lg p-1 bg-surface">
          <button
            type="button"
            className={`tab-pill-btn flex-1 py-1.5 text-xs font-semibold rounded ${!isRegister ? 'bg-primary text-white' : 'text-muted'}`}
            onClick={() => { setIsRegister(false); setError(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-pill-btn flex-1 py-1.5 text-xs font-semibold rounded ${isRegister ? 'bg-primary text-white' : 'text-muted'}`}
            onClick={() => { setIsRegister(true); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  className="form-input pl-9"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                className="form-input pl-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input pl-9 pr-9"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password (min 6 chars)"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-grid-2col mb-4">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  min="18"
                  max="90"
                  className="form-input"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-sm font-bold shadow-glow"
          >
            {loading ? 'Authenticating with MongoDB Atlas...' : isRegister ? 'Create Account & Continue' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
