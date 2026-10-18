import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthView({ setActiveTab }) {
  const { login, demoLogin } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData),
      });
      const data = await res.json();
      if (data.success && data.token) {
        login(data.user, data.token);
        setActiveTab('home');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection to MongoDB backend error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        login(data.user, data.token);
        setActiveTab('home');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to MongoDB backend error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await demoLogin();
    setLoading(false);
    setActiveTab('home');
  };

  return (
    <div className="auth-page-wrapper">
      {/* Auth Container from Frontend/SIGN IN AND SIGN UP PAGE/Index.html */}
      <div className="auth-container-box">
        {/* Left Side - Branding */}
        <div className="auth-left-branding">
          <div>
            <i className="fas fa-shield-heart text-6xl md:text-7xl mb-4"></i>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">आरोग्य कवच</h1>
            <h2 className="text-xl mb-4 font-medium opacity-90">HealthInsure Pro</h2>
            <p className="text-sm opacity-90 max-w-xs mb-8 leading-relaxed">
              Advanced AI-powered insurance cost prediction with personalized savings recommendations.
            </p>
            <div className="space-y-3 text-left text-sm opacity-90">
              <p><i className="fas fa-check-circle mr-2 text-emerald-300"></i> 95% Accuracy Rate</p>
              <p><i className="fas fa-check-circle mr-2 text-emerald-300"></i> 750K+ Predictions Made</p>
              <p><i className="fas fa-check-circle mr-2 text-emerald-300"></i> Trusted by Thousands</p>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="auth-right-form">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isSignUp ? 'Create Account' : 'Welcome Back!'}
              </h2>
              <p className="text-sm text-slate-500">
                {isSignUp ? 'Join us and start saving on insurance' : 'Sign in to access your account'}
              </p>
            </div>
            <button
              onClick={handleDemo}
              className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
            >
              ⚡ Demo Login
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-xs border border-red-200">
              {error}
            </div>
          )}

          {!isSignUp ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-envelope text-slate-400 mr-2 text-sm"></i>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-lock text-slate-400 mr-2 text-sm"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  />
                  <i
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-slate-400 cursor-pointer`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-1.5" defaultChecked /> Remember me
                </label>
                <a href="#" className="text-indigo-600 hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? 'Authenticating with MongoDB Atlas...' : 'Sign In'}
              </button>

              <div className="text-center text-xs text-slate-500 my-4">
                <span>OR CONTINUE WITH</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDemo}
                  className="flex items-center justify-center gap-2 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <i className="fab fa-google text-red-500"></i> Google
                </button>
                <button
                  type="button"
                  onClick={handleDemo}
                  className="flex items-center justify-center gap-2 p-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <i className="fab fa-facebook text-blue-600"></i> Facebook
                </button>
              </div>

              <div className="text-center text-xs text-slate-600 mt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(null); }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-user text-slate-400 mr-2 text-sm"></i>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-envelope text-slate-400 mr-2 text-sm"></i>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-lock text-slate-400 mr-2 text-sm"></i>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <i className="fas fa-lock text-slate-400 mr-2 text-sm"></i>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? 'Creating in MongoDB Atlas...' : 'Create Account'}
              </button>

              <div className="text-center text-xs text-slate-600 mt-6">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(null); }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
