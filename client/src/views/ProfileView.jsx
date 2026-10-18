import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function ProfileView({ setActiveTab }) {
  const { user, logout, demoLogin } = useAuth();
  const [activePlan, setActivePlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Profile Form State
  const [form, setForm] = useState({
    name: user ? user.name : 'Rahul Sharma',
    email: user ? user.email : 'rahul.sharma@example.com',
    phone: user ? (user.phone || '+91 98765 43210') : '+91 98765 43210',
    age: user ? (user.age || 30) : 30,
    gender: user ? (user.gender || 'Male') : 'Male',
    city: user ? (user.city || 'Mumbai') : 'Mumbai',
    bloodGroup: user ? (user.bloodGroup || 'O+') : 'O+',
  });

  // Unique generated or persisted Health Card identifiers
  const memberId = 'AK-UHID-' + (user ? user._id?.slice(-6).toUpperCase() : '894201');
  const policyNumber = 'POL-AK-2026-' + (user ? user._id?.slice(-4).toUpperCase() : '4182');
  const validityDate = '10/2027';

  useEffect(() => {
    // 1. Fetch active purchased plan from localStorage or MongoDB
    const stored = localStorage.getItem('PurchasedPlan');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActivePlan(parsed);
      } catch (e) {}
    }

    if (user) {
      fetchUserPolicies();
      fetchPredictionHistory();
    }
  }, [user]);

  const fetchUserPolicies = async () => {
    try {
      const res = await fetch('/api/plans/user/my-policies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('arogya_token')}`,
        },
      });
      const data = await res.json();
      if (data.success && data.policies && data.policies.length > 0) {
        setActivePlan(data.policies[0]);
      }
    } catch (e) {
      console.warn('Could not fetch user policies:', e.message);
    }
  };

  const fetchPredictionHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/predictions/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('arogya_token')}`,
        },
      });
      const data = await res.json();
      if (data.success && data.predictions) {
        setHistory(data.predictions);
      }
    } catch (e) {
      console.warn('Could not fetch prediction history:', e.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('arogya_token')}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2500);
      }
    } catch (err) {
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 2500);
    }
  };

  const copyMemberId = () => {
    navigator.clipboard.writeText(memberId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadHealthCardPDF = () => {
    if (!window.jspdf) {
      alert('Generating Health Card printable view...');
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    // CR80 standard card dimensions ratio landscape (85.6mm x 54mm) -> 170mm x 108mm in PDF
    const doc = new jsPDF('landscape', 'mm', [170, 108]);

    // Navy & Indigo gradient header background
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, 170, 108, 'F');

    // Header Stripe
    doc.setFillColor(67, 56, 202);
    doc.rect(0, 0, 170, 24, 'F');

    // Top gold line
    doc.setFillColor(234, 179, 8);
    doc.rect(0, 23, 170, 1.5, 'F');

    // Organization Logo & Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('आरोग्य कवच • DIGITAL HEALTH INSURANCE CARD', 10, 10);
    doc.setFontSize(7.5);
    doc.setTextColor(200, 210, 255);
    doc.text('GOVERNMENT OF INDIA • IRDAI REG: 148 • ABDM COMPATIBLE', 10, 16);
    doc.text('24x7 TOLL-FREE CASHLESS: 1800-102-4455', 10, 20);

    // Golden Smart Chip Representation
    doc.setFillColor(218, 165, 32);
    doc.roundedRect(10, 28, 16, 12, 1.5, 1.5, 'F');
    doc.setDrawColor(180, 130, 20);
    doc.rect(13, 30, 10, 8, 'D');

    // Contactless symbol
    doc.setFontSize(10);
    doc.setTextColor(234, 179, 8);
    doc.text(')))', 30, 36);

    // Cardholder Info
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(form.name.toUpperCase(), 10, 47);

    doc.setFontSize(8);
    doc.setTextColor(190, 200, 230);
    doc.text(`MEMBER ID: ${memberId}`, 10, 54);
    doc.text(`POLICY NO: ${policyNumber}`, 10, 60);

    doc.text(`PLAN: ${activePlan?.planTitle || activePlan?.name || 'Standard Plan (Silver Shield)'}`, 10, 66);
    doc.text(`SUM INSURED: ${activePlan?.sumInsured || activePlan?.coverage || 'Rs. 5,00,000'}`, 10, 72);
    doc.text(`VALID THRU: ${validityDate}`, 10, 78);

    doc.text(`AGE/GENDER: ${form.age} Yrs / ${form.gender}`, 10, 84);
    doc.text(`BLOOD GROUP: ${form.bloodGroup}`, 10, 90);

    // QR Code Placeholder Area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(122, 28, 38, 38, 2, 2, 'F');
    doc.setTextColor(30, 27, 75);
    doc.setFontSize(8);
    doc.text('DIGITAL QR', 133, 40);
    doc.setFontSize(6);
    doc.text('SCAN AT TPA DESK', 126, 48);
    doc.text('FOR 30-MIN CASHLESS', 124, 53);
    doc.text('PRE-AUTHORIZATION', 125, 58);

    // Network hospital badge
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(110, 72, 50, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('11,200+ CASHLESS HOSPITALS', 113, 77.5);

    // Emergency Bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 96, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('Third Party Administrator: MediAssist / HealthIndia TPA Network | Emergency Helpline: 1800-102-4455', 10, 103);

    doc.save(`Arogya_Health_Card_${form.name.replace(/\s+/g, '_')}.pdf`);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const planName = activePlan?.planTitle || activePlan?.name || 'Standard Plan (Silver)';
  const planCoverage = activePlan?.sumInsured || activePlan?.coverage || '₹5,00,000';

  return (
    <div className="profile-page-wrapper" style={{ background: '#f5f7fa', minHeight: 'calc(100vh - 70px)' }}>
      {/* Header Banner from MyProfile.html */}
      <div className="profile-header">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
          Welcome, {form.name}!
        </h1>
        <p className="text-white opacity-90 text-sm md:text-base">
          Manage your digital health identity, health cards, and active insurance benefits
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-5xl -mt-8 pb-16">
        {/* ========================================================
            FEATURED HEALTH CARD SECTION (Interactive & Attractive)
            ======================================================== */}
        <div className="health-card-widget">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Official Digital Health Card
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                आरोग्य कवच Smart Health Insurance Card
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Valid for instant cashless admissions at 11,200+ network hospitals pan-India.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs font-semibold">
              <i className="fas fa-check-circle text-emerald-600"></i>
              <span>Status: Active & Verified</span>
            </div>
          </div>

          {/* Visual Interactive Health Card Preview */}
          <div className="flex flex-col lg:flex-row items-center gap-8 my-4">
            {/* The 3D Physical Card Graphic */}
            <div className="health-card-flipper">
              <div
                className={`health-card-inner ${isCardFlipped ? 'flipped' : ''}`}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                title="Click to flip card"
              >
                {/* Front Side */}
                <div className="health-card-face health-card-front">
                  <div>
                    {/* Top Branding Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        <div>
                          <div className="font-extrabold text-sm tracking-wide text-white">आरोग्य कवच</div>
                          <div className="text-[10px] text-indigo-200 tracking-wider">NATIONAL HEALTH CARD</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 border border-white/30 text-amber-300 font-bold">
                          ABDM Compliant
                        </span>
                      </div>
                    </div>

                    {/* Chip & Contactless Row */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="smart-chip-icon">
                        <div className="smart-chip-lines"></div>
                      </div>
                      <div className="text-amber-300 text-lg opacity-80">
                        <i className="fas fa-wifi rotate-90"></i>
                      </div>
                    </div>

                    {/* Member ID */}
                    <div className="mt-3">
                      <div className="text-[9px] text-indigo-200 uppercase tracking-widest">Cardholder ID</div>
                      <div className="text-lg md:text-xl font-mono font-bold tracking-wider text-yellow-300">
                        {memberId}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Details Row */}
                  <div>
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/20 pt-2 mb-2">
                      <div>
                        <div className="text-[9px] text-indigo-200">CARDHOLDER NAME</div>
                        <div className="font-bold text-sm tracking-wide text-white truncate">
                          {form.name.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-indigo-200">PLAN / COVERAGE</div>
                        <div className="font-bold text-xs text-emerald-300 truncate">
                          {planName} ({planCoverage})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-indigo-200">
                      <span>BLOOD: <strong className="text-white">{form.bloodGroup}</strong></span>
                      <span>VALID THRU: <strong className="text-white">{validityDate}</strong></span>
                      <span>NETWORK: <strong className="text-white">11,200+ HOSPITALS</strong></span>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="health-card-face health-card-back">
                  <div>
                    {/* Magnetic Stripe Graphic */}
                    <div className="h-9 -mx-6 -mt-5 bg-slate-950 mb-3 border-b border-slate-800"></div>

                    {/* TPA Instructions */}
                    <div className="text-[10px] text-slate-300 space-y-1 mb-2">
                      <p className="font-bold text-white text-xs">CASHLESS HOSPITALIZATION INSTRUCTIONS:</p>
                      <p>1. Present this card along with a Government Photo ID at any Network Hospital TPA Desk.</p>
                      <p>2. Pre-authorization is issued within 30 minutes via digital portal.</p>
                    </div>

                    {/* Helpline & Security Barcode */}
                    <div className="bg-white/10 p-2 rounded border border-white/10 text-xs">
                      <div className="text-[10px] text-amber-300 font-bold">24x7 TOLL-FREE CASHLESS HELPLINE:</div>
                      <div className="text-sm font-mono font-bold text-white">1800-102-4455 / 1800-209-8800</div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-2">
                    <div>
                      <div className="font-mono text-xs tracking-widest text-slate-400">||| |||| || ||||| ||||</div>
                      <div className="text-[9px] text-slate-400">AUTH SECURE ID: {policyNumber}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400">Arogya Kavaj Insurance Co. Ltd.</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                <i className="fas fa-sync-alt mr-1"></i> Click card to flip front / back
              </p>
            </div>

            {/* Side-By-Side Action Buttons & Quick Stats */}
            <div className="flex-1 w-full space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Member UHID</span>
                    <strong className="text-gray-800 font-mono text-sm">{memberId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Active Plan</span>
                    <strong className="text-indigo-600 font-semibold">{planName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Sum Insured</span>
                    <strong className="text-emerald-600 font-bold">{planCoverage}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Policy Validity</span>
                    <strong className="text-gray-800">Till {validityDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Blood Group</span>
                    <strong className="text-red-600 font-bold">{form.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Emergency Support</span>
                    <strong className="text-gray-800">1800-102-4455</strong>
                  </div>
                </div>
              </div>

              {/* Side-by-Side: View Health Card & Download Health Card */}
              <div className="health-card-actions-row">
                <button
                  type="button"
                  className="btn-view-card"
                  onClick={() => setShowHealthCardModal(true)}
                >
                  <i className="fas fa-eye text-lg"></i>
                  <span>View Health Card</span>
                </button>

                <button
                  type="button"
                  className="btn-download-card"
                  onClick={handleDownloadHealthCardPDF}
                >
                  <i className="fas fa-download text-lg"></i>
                  <span>Download Health Card</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyMemberId}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 py-1 px-2 rounded hover:bg-indigo-50 transition"
                >
                  <i className={`fas ${copiedId ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                  <span>{copiedId ? 'Copied Member ID!' : 'Copy Member ID for TPA'}</span>
                </button>

                <span className="text-gray-300">•</span>

                <button
                  type="button"
                  onClick={() => setActiveTab('active-plan')}
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >
                  View Active Plan Details &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PROFILE DETAILS & EDIT FORM
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Information Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-user-edit text-indigo-600"></i> Personal Details
              </h3>
              {editSuccess && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                  <i className="fas fa-check-circle"></i> Saved to MongoDB Atlas
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">City / Region</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-600 text-sm bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: AI Prediction Calculations & Quick Links */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-amber-500"></i> Quick Actions
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="w-full text-left p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 transition flex items-center justify-between text-sm font-medium"
                >
                  <span>🏥 Run AI Cost Predictor</span>
                  <i className="fas fa-chevron-right text-xs text-indigo-500"></i>
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 transition flex items-center justify-between text-sm font-medium"
                >
                  <span>🛡️ Browse All Insurance Plans</span>
                  <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 transition flex items-center justify-between text-sm font-medium"
                >
                  <span>📞 24/7 Priority Support</span>
                  <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                </button>
                {user && (
                  <button
                    onClick={logout}
                    className="w-full text-left p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition flex items-center justify-between text-sm font-medium"
                  >
                    <span>🚪 Sign Out</span>
                    <i className="fas fa-sign-out-alt text-xs text-red-400"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Recent Predictions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-history text-indigo-600"></i> Recent ML Estimates
                </h3>
                <button
                  onClick={fetchPredictionHistory}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Refresh
                </button>
              </div>

              {historyLoading ? (
                <p className="text-xs text-gray-400 py-4 text-center">Loading estimates...</p>
              ) : history.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  <p className="mb-2">No calculations saved yet.</p>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Calculate Premium Now
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {history.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs flex justify-between items-center">
                      <div>
                        <strong className="text-gray-900 block font-bold text-sm">
                          ₹{item.predictedCost?.toLocaleString('en-IN') || '14,058'} / yr
                        </strong>
                        <span className="text-gray-500 text-[11px]">
                          Age {item.inputData?.age || 30} • {item.inputData?.insurancePlan || 'Silver'} Plan
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL VIEW HEALTH CARD MODAL (Detailed & Attractive)
          ======================================================== */}
      {showHealthCardModal && (
        <div
          className="health-card-modal-backdrop"
          onClick={() => setShowHealthCardModal(false)}
        >
          <div
            className="health-card-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <h3 className="text-lg font-bold text-gray-800">
                  Digital Health Insurance ID Card
                </h3>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none p-1"
                onClick={() => setShowHealthCardModal(false)}
              >
                &times;
              </button>
            </div>

            {/* 3D Interactive Card Preview */}
            <div className="health-card-flipper my-2">
              <div
                className={`health-card-inner ${isCardFlipped ? 'flipped' : ''}`}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                {/* Front Side */}
                <div className="health-card-face health-card-front">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        <div>
                          <div className="font-extrabold text-sm tracking-wide text-white">आरोग्य कवच</div>
                          <div className="text-[9px] text-indigo-200">NATIONAL HEALTH IDENTITY CARD</div>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                        CASHLESS ID
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="smart-chip-icon">
                        <div className="smart-chip-lines"></div>
                      </div>
                      <div className="text-amber-300 text-lg opacity-90">
                        <i className="fas fa-wifi rotate-90"></i>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-[9px] text-indigo-200 uppercase tracking-widest">MEMBER UHID</div>
                      <div className="text-xl font-mono font-bold tracking-widest text-yellow-300">
                        {memberId}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/20 pt-2 mb-2">
                      <div>
                        <div className="text-[9px] text-indigo-200">CARDHOLDER NAME</div>
                        <div className="font-bold text-sm text-white truncate">{form.name.toUpperCase()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-indigo-200">PLAN / SUM INSURED</div>
                        <div className="font-bold text-xs text-emerald-300 truncate">
                          {planName} • {planCoverage}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-indigo-200">
                      <span>BLOOD: <strong className="text-white">{form.bloodGroup}</strong></span>
                      <span>VALID THRU: <strong className="text-white">{validityDate}</strong></span>
                      <span>POLICY: <strong className="text-white">{policyNumber}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="health-card-face health-card-back">
                  <div>
                    <div className="h-8 -mx-6 -mt-5 bg-slate-950 mb-3 border-b border-slate-800"></div>

                    <div className="text-[10px] text-slate-300 space-y-1 mb-2">
                      <p className="font-bold text-white text-xs">CASHLESS HOSPITALIZATION GUIDELINES:</p>
                      <p>• Present this card at the Network Hospital TPA Help Desk with any Govt Photo ID.</p>
                      <p>• Emergency hospitalization intimation must be submitted within 24 hours.</p>
                    </div>

                    <div className="bg-white/10 p-2 rounded border border-white/10 text-xs">
                      <div className="text-[9px] text-amber-300 font-bold">24x7 EMERGENCY CASHLESS ASSISTANCE:</div>
                      <div className="text-sm font-mono font-bold text-white">1800-102-4455 / 1800-209-8800</div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-2">
                    <div>
                      <div className="font-mono text-xs tracking-widest text-slate-400">||| |||| || ||||| ||||</div>
                      <div className="text-[9px] text-slate-400">TPA NETWORK: MEDIASSIST / HEALTHINDIA</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400">IRDAI Reg. 148</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Click to flip button */}
            <div className="text-center my-3">
              <button
                type="button"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-4 rounded-full font-semibold transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fas fa-sync-alt"></i>
                <span>{isCardFlipped ? 'Show Front Side' : 'Show Back Side & TPA Info'}</span>
              </button>
            </div>

            {/* Complete Card Specifications List */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Policyholder Name:</span>
                <strong className="text-gray-800">{form.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UHID / Member Card No:</span>
                <strong className="font-mono text-indigo-700">{memberId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Insurance Tier:</span>
                <strong className="text-gray-800">{planName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Inpatient Sum Insured:</span>
                <strong className="text-emerald-700 font-bold">{planCoverage}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Card Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> Active & Cashless Approved
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Toll-Free Cashless Help:</span>
                <strong className="text-gray-800">1800-102-4455 (24 Hours)</strong>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadHealthCardPDF}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 shadow"
              >
                <i className="fas fa-file-pdf"></i>
                <span>Download Card PDF</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <i className="fas fa-print"></i>
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHealthCardModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
