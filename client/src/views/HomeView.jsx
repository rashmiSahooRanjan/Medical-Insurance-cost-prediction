import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomeView({ setActiveTab }) {
  const { user, login, logout, demoLogin } = useAuth();
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [authLoading, setAuthLoading] = useState(false);
  const [authMsg, setAuthMsg] = useState(null);

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [signinForm, setSigninForm] = useState({
    email: '',
    password: '',
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setAuthLoading(true);
    setAuthMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        setAuthMsg({ type: 'success', text: 'Account created successfully in MongoDB Atlas!' });
      } else {
        setAuthMsg({ type: 'error', text: data.message || 'Signup failed' });
      }
    } catch (err) {
      setAuthMsg({ type: 'error', text: 'Server connection error' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinForm),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user, data.token);
        setAuthMsg({ type: 'success', text: 'Welcome back! Signed in successfully.' });
      } else {
        setAuthMsg({ type: 'error', text: data.message || 'Invalid credentials' });
      }
    } catch (err) {
      setAuthMsg({ type: 'error', text: 'Server connection error' });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="home-view-container">
      {/* Hero Section (Exact markup and style from Frontend/HOME PAGE/Home.html) */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4">
              Advanced Insurance Cost Prediction
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 opacity-95">
              Our AI analyzes 50+ factors to provide the most accurate medical insurance cost
              estimates with personalized savings recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('calculator')}
                className="bg-white text-indigo-700 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 shadow-lg pulse-animation inline-block cursor-pointer text-sm sm:text-base"
              >
                Calculate Now
              </button>
              <button
                onClick={() => setActiveTab('how-it-works')}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition duration-300 inline-flex items-center cursor-pointer text-sm sm:text-base"
              >
                <i className="fas fa-play-circle mr-2"></i> Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="relative">
              <img 
                src="/ph.avif" 
                alt="Health Insurance Hero visual" 
                className="rounded-2xl shadow-2xl w-full object-cover max-h-[420px]"
                onError={(e) => { e.target.src = '/p.jpg'; }}
              />
              <div className="absolute bottom-2 right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-lg shadow-lg p-2.5 sm:p-4">
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-lg p-2 sm:p-3 mr-2 sm:mr-3 text-indigo-600 text-lg sm:text-xl">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xs sm:text-sm md:text-base">Save your Life</h4>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Verified AI Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Stats Strip */}
        <div className="container mx-auto px-6 mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Trusted Results Backed By Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-4">
              <div className="text-white text-3xl font-bold mb-2">95%</div>
              <div className="text-gray-200">Accuracy Rate</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-white text-3xl font-bold mb-2">750K+</div>
              <div className="text-gray-200">Predictions Made</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-white text-3xl font-bold mb-2">1Lakh+</div>
              <div className="text-gray-200">Average Annual Savings</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-white text-3xl font-bold mb-2">4.9★</div>
              <div className="text-gray-200">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section from Home.html */}
      <section className="py-20 bg-white" id="contactSection">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Contact our support team</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Need help with your account or policy? Reach out to our expert support team and get a fast response.
              </p>
              <p className="text-slate-500 mb-2">Phone: <strong className="text-slate-800">+91 98765 43210</strong></p>
              <p className="text-slate-500">Email: <strong className="text-slate-800">support@healthinsurepro.com</strong></p>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white shadow-2xl">
              <h3 className="text-3xl font-semibold mb-4">Get personalized help</h3>
              <p className="mb-6">
                Whether you want a quote, need help with claims, or want to learn more about our plans, we are here for you.
              </p>
              <button
                onClick={() => setActiveTab('contact')}
                className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth or Profile Section from Home.html */}
      {!user ? (
        <section className="py-20 bg-slate-900 text-white" id="authSection">
          <div className="container mx-auto px-6">
            <div id="authPanel" className="rounded-3xl bg-white p-10 shadow-2xl text-slate-900 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold" id="authTitle">
                  {authMode === 'signup' ? 'Create your account' : 'Welcome back!'}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setAuthMode('signin'); setAuthMsg(null); }}
                    className={`px-5 py-3 rounded-full border transition cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthMsg(null); }}
                    className={`px-5 py-3 rounded-full border transition cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {authMsg && (
                <div className={`p-4 mb-6 rounded-lg text-sm ${
                  authMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {authMsg.text}
                </div>
              )}

              {/* Quick Demo Button */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={demoLogin}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-semibold border border-indigo-200 hover:bg-indigo-100 transition"
                >
                  ⚡ One-Click Demo Login
                </button>
              </div>

              {authMode === 'signup' ? (
                <form onSubmit={handleSignup}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Enter full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Enter email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Confirm password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="mt-8 w-full bg-indigo-600 text-white px-6 py-4 rounded-full font-semibold hover:bg-indigo-700 transition cursor-pointer"
                  >
                    {authLoading ? 'Creating Account in MongoDB Atlas...' : 'Create Account'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignin}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Enter email"
                        value={signinForm.email}
                        onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
                        placeholder="Enter password"
                        value={signinForm.password}
                        onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="mt-8 w-full bg-slate-900 text-white px-6 py-4 rounded-full font-semibold hover:bg-slate-800 transition cursor-pointer"
                  >
                    {authLoading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* My Profile Section from Home.html */
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white" id="myProfileSection">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm p-10 shadow-2xl max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">My Profile</p>
                <h2 className="text-4xl font-bold mt-4">Welcome back, {user.name}!</h2>
                <p className="mt-3 text-slate-200 text-lg">
                  Your saved profile is ready, and your personalized insurance dashboard is waiting.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-6 text-center">
                  <div className="text-5xl mb-3"><i className="fas fa-user-circle"></i></div>
                  <div className="text-xl font-semibold">{user.name}</div>
                  <div className="mt-2 text-slate-200 text-sm">{user.email}</div>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-6 flex flex-col justify-center items-center">
                  <div className="text-sm text-cyan-100/80 mb-2">Profile Status</div>
                  <div className="text-2xl font-bold text-emerald-300">Active</div>
                  <div className="text-xs text-slate-200 mt-2">Account Verified (MongoDB Atlas)</div>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-6 flex flex-col justify-center">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-center bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition mb-3 cursor-pointer"
                  >
                    View Full Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition mb-3 cursor-pointer"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full text-center bg-white/20 border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition cursor-pointer"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer from Home.html */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                  <img src="/p.jpg" alt="HealthInsure logo" className="h-8 w-8 rounded-full object-cover" />
                </div>
                <span className="ml-3 text-xl font-bold">आरोग्य कवच</span>
              </div>
              <p className="text-gray-400">Advanced AI for smarter insurance decisions. Save money with confidence.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('features')} className="text-gray-400 hover:text-white transition">Features</button></li>
                <li><button onClick={() => setActiveTab('how-it-works')} className="text-gray-400 hover:text-white transition">How It Works</button></li>
                <li><button onClick={() => setActiveTab('testimonials')} className="text-gray-400 hover:text-white transition">Testimonials</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('calculator')} className="text-gray-400 hover:text-white transition">Health Calculator</button></li>
                <li><button onClick={() => setActiveTab('plans')} className="text-gray-400 hover:text-white transition">Insurance Plans</button></li>
                <li><button onClick={() => setActiveTab('active-plan')} className="text-gray-400 hover:text-white transition">Active Plan</button></li>
                <li><button onClick={() => setActiveTab('contact')} className="text-gray-400 hover:text-white transition">Support & Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition text-xl"><i className="fab fa-instagram"></i></a>
              </div>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter</p>
              <div className="mt-2 flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none text-sm"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg transition">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="mb-4 md:mb-0">© 2026 HealthInsure Pro (आरोग्य कवच). All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
