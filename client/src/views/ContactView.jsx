import React, { useState } from 'react';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 gradient-bg min-h-[calc(100vh-70px)] text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header from contact.html */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow">
            Get in Touch
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We're here to help you find the right medical insurance for your needs.
          </p>
        </div>

        {/* Content Grid (from contact.html) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-3">
              Send us a Message
            </h2>

            {success ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl text-center">
                <i className="fas fa-check-circle text-4xl text-emerald-600 mb-3 block"></i>
                <h3 className="font-bold text-lg mb-1">Message Sent Successfully!</h3>
                <p className="text-sm">Recorded in MongoDB Atlas. Our support team will reply within 2 hours.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Claims Support">Claims Support</option>
                    <option value="Policy Information">Policy Information</option>
                    <option value="Billing Question">Billing Question</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Message *</label>
                  <textarea
                    rows="4"
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-600 text-sm"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-full font-semibold transition shadow-lg cursor-pointer"
                >
                  {loading ? 'Submitting to MongoDB Atlas...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-white shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/20 pb-3">
              Contact Information
            </h2>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-100">Phone</h4>
                <p className="text-white text-lg font-bold">+91 98765 43210</p>
                <p className="text-xs text-white/70">Mon-Sat from 9am to 7pm</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-100">Email</h4>
                <p className="text-white text-lg font-bold">support@medicalinsurance.com</p>
                <p className="text-xs text-white/70">We reply within 2 business hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-100">Office Location</h4>
                <p className="text-white font-medium">123 Health Avenue, Medical District</p>
                <p className="text-sm text-white/80">BKC, Mumbai, Maharashtra 400051</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-indigo-950/40 border border-indigo-400/30 mt-6">
              <h4 className="font-bold text-amber-300 text-sm mb-1">
                <i className="fas fa-ambulance mr-2"></i> 24/7 Emergency Cashless Desk
              </h4>
              <p className="text-xs text-white/90">
                For urgent hospital pre-authorizations, call toll-free: <strong>1800-123-4567</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
