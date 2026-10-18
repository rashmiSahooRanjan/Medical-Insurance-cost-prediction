import React from 'react';

export default function FeatureView({ setActiveTab }) {
  const features = [
    {
      icon: 'fa-brain',
      title: 'AI-Powered Cost Prediction',
      desc: 'Our advanced machine learning models (Python 3.10 XGBoost) analyze 50+ variables to provide accurate, transparent insurance premium predictions.',
    },
    {
      icon: 'fa-bolt',
      title: 'Instant Quotes in 30s',
      desc: 'Get detailed, personalized insurance quotes in seconds without lengthy paperwork, agents, or intrusive marketing phone calls.',
    },
    {
      icon: 'fa-heartbeat',
      title: 'Actuarial Risk Assessment',
      desc: 'Comprehensive health risk evaluation using calibrated medical actuarial data to help you understand your true coverage needs.',
    },
    {
      icon: 'fa-hospital-user',
      title: '11,200+ Cashless Hospitals',
      desc: 'Direct cashless hospitalization across 11,200+ top multi-speciality network hospitals pan-India with 30-minute pre-authorization.',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Zero Room Rent Capping',
      desc: 'Enjoy unrestricted private rooms without proportionate deductions or unexpected co-pays during treatment.',
    },
    {
      icon: 'fa-file-invoice-dollar',
      title: 'Transparent Pricing & Breakdown',
      desc: 'Clear, itemized cost breakdown displaying base rates, age factors, GST, and actionable levers to save on annual renewals.',
    },
  ];

  return (
    <div className="features-page-wrapper py-16" style={{ background: '#0a0e27', color: 'white', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 text-3xl mb-4">
            <i className="fas fa-shield-virus"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features For <span className="gradient-text">Smarter Insurance</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Experience the future of health insurance with our cutting-edge AI-driven platform designed to protect your family and wealth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl border border-white/10 transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50"
              style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-indigo-500/30">
                <i className={`fas ${feat.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="rounded-3xl p-10 text-center max-w-3xl mx-auto" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Smarter Insurance?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Calculate your personalized quote in under 60 seconds with our trained Machine Learning models.
          </p>
          <button
            onClick={() => setActiveTab('calculator')}
            className="bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition shadow-xl cursor-pointer"
          >
            Calculate Your Premium Now
          </button>
        </div>
      </div>
    </div>
  );
}
