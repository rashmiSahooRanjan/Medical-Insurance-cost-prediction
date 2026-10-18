import React from 'react';

export default function HowItWorksView({ setActiveTab }) {
  const steps = [
    {
      num: 1,
      title: 'Data Collection',
      desc: 'Simply enter your demographic information, health metrics, lifestyle factors, and coverage preferences into our intuitive form.',
    },
    {
      num: 2,
      title: 'AI Analysis',
      desc: 'Our Python 3.10 machine learning models analyze your profile across calibrated actuarial risk vectors and medical inflation rates.',
    },
    {
      num: 3,
      title: 'Cost Projection',
      desc: 'Using machine learning trained on 50,000+ actual policy rates, we generate customized cost estimates and itemized breakdowns.',
    },
    {
      num: 4,
      title: 'Policy Activation',
      desc: 'Select your preferred coverage tier (Bronze, Silver, Gold) and get instant digital policy certificates backed by MongoDB Atlas.',
    },
  ];

  return (
    <div className="how-it-works-page">
      {/* Video Demo Section from working.html */}
      <section id="video-demo" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            See How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Watch our 90-second demo to see how easily you can get accurate insurance cost predictions.
          </p>

          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="w-full relative pb-[56.25%] h-0">
              <iframe
                src="https://www.youtube.com/embed/Kdsgl2dvh_4?si=KFl5B-Bqe36mCk_D"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Arogya Kavaj Demo"
              ></iframe>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveTab('calculator')}
              className="text-indigo-600 font-semibold hover:text-indigo-800 inline-flex items-center text-lg cursor-pointer"
            >
              <span>Try it yourself now</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section from working.html */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            How Our Insurance Prediction Works
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Our AI-powered prediction process uses 50+ data points to estimate your insurance costs
          </p>

          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <img
                src="/ph.avif"
                alt="Insurance prediction process flow diagram"
                className="rounded-2xl shadow-xl w-full object-cover"
                onError={(e) => { e.target.src = '/p.jpg'; }}
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              {steps.map((st) => (
                <div key={st.num} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-start">
                  <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl font-bold mr-4">
                    {st.num}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{st.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
