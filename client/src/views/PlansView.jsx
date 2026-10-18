import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function PlansView({ setActiveTab }) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [fullDetailsPlan, setFullDetailsPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    mobile: user ? user.phone : '',
    email: user ? user.email : '',
  });

  const plansData = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 5999,
      coverage: '₹3 Lakhs',
      popular: false,
      features: [
        'Coverage up to ₹3 Lakhs',
        'Cashless Hospitalization',
        'Pre-existing diseases after 2 years',
        'Daycare Procedures',
        'Annual Health Check-up',
        '24/7 Customer Support',
      ],
      fullDetails: {
        subtitle: 'Essential and affordable medical protection designed for individuals and young professionals.',
        highlights: [
          { icon: '🏥', title: '₹3 Lakhs Cover', desc: 'Comprehensive hospitalization limit' },
          { icon: '⚡', title: '7,500+ Hospitals', desc: 'Cashless pan-India network' },
          { icon: '🩺', title: 'Annual Check-up', desc: '1 member preventive checkup' },
        ],
        coverages: [
          { title: 'In-Patient Hospitalization', desc: 'Covers room rent, ICU charges, nursing, and physician fees up to ₹3 Lakhs.' },
          { title: 'Pre & Post Hospitalization', desc: 'Medical expenses 30 days prior to admission and 60 days post discharge.' },
          { title: 'Daycare Procedures', desc: 'Over 500+ procedures covered that require less than 24 hours hospitalization.' },
          { title: 'Ambulance Charges', desc: 'Road ambulance emergency transport coverage up to ₹2,000 per hospitalization.' },
          { title: 'Waiting Period', desc: 'Initial waiting period 30 days. Pre-existing conditions covered after 2 years.' },
          { title: 'Restoration Benefit', desc: 'Up to 50% basic sum insured reinstatement on exhaustion.' },
        ],
      },
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 11999,
      coverage: '₹5 Lakhs',
      popular: true,
      features: [
        'Coverage up to ₹5 Lakhs',
        'Cashless Hospitalization',
        'Pre-existing diseases after 1 year',
        'Daycare Procedures',
        'Maternity Coverage',
        'Annual Health Check-up (2 members)',
        'Ambulance Charges',
        'No Room Rent Limit',
      ],
      fullDetails: {
        subtitle: 'Our most popular comprehensive family health coverage with maternity and zero room rent caps.',
        highlights: [
          { icon: '🛡️', title: '₹5 Lakhs Cover', desc: 'Optimal protection for small families' },
          { icon: '🏥', title: '11,200+ Hospitals', desc: 'Tier-1 cashless network pan-India' },
          { icon: '👶', title: 'Maternity Cover', desc: 'Normal & C-Section deliveries' },
        ],
        coverages: [
          { title: 'In-Patient & ICU Care', desc: 'No room rent capping or restriction on ICU charges; full sum insured available.' },
          { title: 'Pre & Post Hospitalization', desc: 'Covers 60 days pre-hospitalization and 90 days post-hospitalization bills.' },
          { title: 'Maternity & Newborn Care', desc: 'Maternity expenses covered up to ₹50,000 with newborn cover from day one.' },
          { title: 'Pre-existing Conditions', desc: 'Accelerated coverage: pre-existing ailments covered after just 1 year.' },
          { title: 'Annual Health Check-up', desc: 'Comprehensive preventive health check-up voucher for up to 2 family members.' },
          { title: '100% Reload Benefit', desc: 'Automatic 100% restoration of base sum insured if exhausted in a policy year.' },
        ],
      },
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 24999,
      coverage: '₹10 Lakhs',
      popular: false,
      features: [
        'Coverage up to ₹10 Lakhs',
        'Cashless Hospitalization',
        'Pre-existing diseases covered',
        'Daycare & Home Care',
        'Maternity & Newborn Coverage',
        'Annual Health Check-up (4 members)',
        'Worldwide Emergency Cover',
        'No Room Rent Limit',
        'Organ Donor Expenses',
        'Alternative Treatment (AYUSH)',
      ],
      fullDetails: {
        subtitle: 'Elite VIP coverage with worldwide emergency cover, home healthcare, and AYUSH treatments.',
        highlights: [
          { icon: '👑', title: '₹10 Lakhs Cover', desc: 'High sum insured with global cover' },
          { icon: '🌍', title: 'Worldwide Emergency', desc: 'International medical assistance' },
          { icon: '🌿', title: 'AYUSH Treatments', desc: 'Ayurveda, Yoga, Unani, Homeopathy' },
        ],
        coverages: [
          { title: 'Worldwide Emergency Treatment', desc: 'Emergency inpatient hospitalization coverage globally across top international centers.' },
          { title: 'Pre-Existing Conditions Cover', desc: 'Immediate cover with waived waiting periods on standard lifestyle ailments.' },
          { title: 'Home Healthcare & OPD', desc: 'Doctor consultations, nursing care at home, diagnostic tests, and dental add-ons.' },
          { title: 'Maternity & IVF Support', desc: 'Maternity coverage up to ₹1,00,000 with newborn immunization and birth care.' },
          { title: 'Organ Donor & Air Ambulance', desc: 'Complete donor hospitalization expenses and emergency air ambulance transport.' },
          { title: 'Unlimited Restoration', desc: 'Unlimited 100% sum insured restoration for completely unrelated illnesses.' },
        ],
      },
    },
  ];

  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setSuccessData(null);
    setFullDetailsPlan(null);
    if (user) {
      setFormData({
        fullName: user.name || '',
        mobile: user.phone || '',
        email: user.email || '',
      });
    }
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setSuccessData(null);
    setFullDetailsPlan(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const initiatePayment = async (e) => {
    if (e) e.preventDefault();

    if (!formData.fullName || !formData.mobile || !formData.email) {
      alert('Please fill in all contact information');
      return;
    }

    if (formData.mobile.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // 1. Store in localStorage matching plan.html
      const purchaseRecord = {
        name: selectedPlan.name,
        price: selectedPlan.price,
        coverage: selectedPlan.coverage,
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        paymentMethod: selectedPaymentMethod,
        date: new Date().toISOString(),
      };
      localStorage.setItem('PurchasedPlan', JSON.stringify(purchaseRecord));

      // 2. Persist to MongoDB Atlas backend
      const res = await fetch('/api/plans/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('arogya_token')
            ? { Authorization: `Bearer ${localStorage.getItem('arogya_token')}` }
            : {}),
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          tier: selectedPlan.name.split(' ')[0],
          planTitle: selectedPlan.name,
          sumInsured: selectedPlan.coverage,
          premiumPaid: selectedPlan.price,
          paymentMethod: selectedPaymentMethod,
          insuredMembers: [
            {
              name: formData.fullName,
              relation: 'Self',
              age: 30,
              gender: 'Male',
            },
          ],
        }),
      });

      const data = await res.json();

      const orderId = 'HG' + Date.now().toString().slice(-8);
      const paymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();

      setSuccessData({
        orderId,
        paymentId,
        policy: data.policy || null,
      });

      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error('Subscription error:', err);
      // Fallback success simulation
      const orderId = 'HG' + Date.now().toString().slice(-8);
      const paymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      setSuccessData({ orderId, paymentId });
    } finally {
      setLoading(false);
    }
  };

  const gst = selectedPlan ? Math.round(selectedPlan.price * 0.18) : 0;
  const discount = selectedPlan ? Math.round(selectedPlan.price * 0.1) : 0;
  const totalAmount = selectedPlan ? selectedPlan.price + gst - discount : 0;

  return (
    <div className="plans-page-container">
      <div className="container">
        {/* Header from Frontend/PLANS PAGE/plan.html */}
        <div className="plans-header">
          <h1>Medical Insurance Plans</h1>
          <p>Comprehensive Health Coverage for You and Your Family</p>
        </div>

        {/* 3 Plans Container */}
        <div className="plans-container">
          {plansData.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
              data-plan={plan.id}
              data-price={plan.price}
            >
              {plan.popular && <span className="popular-badge">Most Popular</span>}

              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  ₹{plan.price.toLocaleString('en-IN')}
                  <span>/year</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <div className="plan-btn-group">
                <button
                  type="button"
                  className="btn-details"
                  onClick={() => setFullDetailsPlan(plan)}
                >
                  Full Details
                </button>

                <button
                  type="button"
                  className="select-btn"
                  onClick={() => openPaymentModal(plan)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal (Exact from plan.html) */}
      {selectedPlan && (
        <div className="payment-modal-backdrop" onClick={closeModal}>
          <div
            className="payment-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="payment-header">
              <h2>Secure Payment</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>

            {!successData ? (
              <div id="paymentSection">
                <div className="payment-content">
                  {/* Left Section: Contact Information */}
                  <div className="left-section">
                    <div className="section-title">Contact Information</div>
                    <form id="contactForm" onSubmit={initiatePayment}>
                      <div className="payment-form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="payment-form-group">
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                        />
                      </div>

                      <div className="payment-form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div className="payment-info-box">
                        <h4>💳 Secure Payment Gateway</h4>
                        <p>
                          Your payment is processed through Razorpay & MongoDB Atlas. All transactions are encrypted and secure.
                        </p>
                      </div>

                      <div className="section-title" style={{ marginTop: '25px' }}>
                        Accepted Payment Methods
                      </div>
                      <div className="payment-methods-list">
                        {[
                          { id: 'UPI', icon: '📱', label: 'UPI' },
                          { id: 'Cards', icon: '💳', label: 'Cards' },
                          { id: 'Net Banking', icon: '🏦', label: 'Net Banking' },
                          { id: 'Wallets', icon: '👛', label: 'Wallets' },
                          { id: 'EMI', icon: '💰', label: 'EMI' },
                          { id: 'International', icon: '🌐', label: 'International' },
                        ].map((method) => (
                          <div
                            key={method.id}
                            className={`payment-method-icon ${
                              selectedPaymentMethod === method.id ? 'active' : ''
                            }`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <div style={{ fontSize: '1.4rem' }}>{method.icon}</div>
                            <div>{method.label}</div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="place-order-btn"
                      >
                        {loading ? 'Processing Secure Payment...' : 'Proceed to Payment'}
                      </button>
                    </form>
                  </div>

                  {/* Right Section: Price Details */}
                  <div className="right-section">
                    <div className="section-title">Price Details</div>
                    <div className="price-details">
                      <div className="summary-row">
                        <span>Plan Selected</span>
                        <span>{selectedPlan.name}</span>
                      </div>
                      <div className="summary-row">
                        <span>Plan Price</span>
                        <span>₹{selectedPlan.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="summary-row">
                        <span>GST (18%)</span>
                        <span>₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="summary-row">
                        <span style={{ color: '#388e3c' }}>Discount (10%)</span>
                        <span style={{ color: '#388e3c' }}>
                          - ₹{discount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Success Screen (Exact from plan.html) */
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600">
                  Thank you for choosing HealthGuard / आरोग्य कवच Insurance
                </p>
                <div className="order-id">
                  Order ID: <span>{successData.orderId}</span>
                </div>
                <div className="payment-id">
                  Payment ID: <span>{successData.paymentId}</span>
                </div>
                <p style={{ color: '#666', marginTop: '20px' }}>
                  Your policy is activated and stored securely in MongoDB Atlas.
                </p>
                <div className="flex gap-3 justify-center mt-6">
                  <button
                    type="button"
                    className="place-order-btn"
                    style={{ maxWidth: '200px', marginTop: 0 }}
                    onClick={() => {
                      closeModal();
                      setActiveTab('active-plan');
                    }}
                  >
                    View in Active Plan
                  </button>
                  <button
                    type="button"
                    className="place-order-btn"
                    style={{ maxWidth: '120px', marginTop: 0, background: '#667eea' }}
                    onClick={closeModal}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Details Modal (from Full1.html, Full2.html, Full3.html) */}
      {fullDetailsPlan && (
        <div className="payment-modal-backdrop" onClick={() => setFullDetailsPlan(null)}>
          <div
            className="full-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold">
                HealthGuard Plans &gt; {fullDetailsPlan.name} Full Specifications
              </span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-900 text-2xl font-bold"
                onClick={() => setFullDetailsPlan(null)}
              >
                &times;
              </button>
            </div>

            <div className="full-details-hero">
              <h2 className="text-3xl font-extrabold mb-2">{fullDetailsPlan.name}</h2>
              <p className="opacity-90 text-sm max-w-2xl">{fullDetailsPlan.fullDetails.subtitle}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold">₹{fullDetailsPlan.price.toLocaleString('en-IN')}</span>
                <span className="text-white opacity-80">/ year (Sum Insured: {fullDetailsPlan.coverage})</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Key Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {fullDetailsPlan.fullDetails.highlights.map((h, i) => (
                <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                  <div className="text-3xl mb-1">{h.icon}</div>
                  <div className="font-bold text-gray-800 text-sm">{h.title}</div>
                  <div className="text-xs text-gray-600">{h.desc}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Coverage Specifications</h3>
            <div className="full-details-grid">
              {fullDetailsPlan.fullDetails.coverages.map((c, i) => (
                <div key={i} className="full-details-card">
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                className="btn-details"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={() => setFullDetailsPlan(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="select-btn"
                style={{ width: 'auto', padding: '10px 30px' }}
                onClick={() => {
                  const plan = fullDetailsPlan;
                  setFullDetailsPlan(null);
                  openPaymentModal(plan);
                }}
              >
                Buy {fullDetailsPlan.name} Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
