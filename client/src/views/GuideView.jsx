import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Zap, Info, Check } from 'lucide-react';

export default function GuideView({ setActiveTab }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does the AI Machine Learning Predictor calculate my cost?',
      a: 'The Arogya Kavaj machine learning model was trained using Python (scikit-learn & XGBoost) on over 50,000 anonymized Indian healthcare insurance claims. It accounts for age non-linear risk curves, family dependencies, income brackets, tobacco usage, BMI categories, regional medical inflation, and complex co-morbidities like Diabetes and Hypertension.',
    },
    {
      q: 'What is the difference between Cashless Hospitalization and Reimbursement?',
      a: 'With Cashless Hospitalization, you show your Arogya Kavaj Digital Health Card at any of our 11,200+ partner network hospitals. The hospital TPA sends the pre-authorization to us and we pay the approved hospital bills directly. With reimbursement, you pay first at a non-network hospital and file medical receipts for repayment.',
    },
    {
      q: 'What does "Zero Room Rent Capping" mean in Silver and Gold plans?',
      a: 'Standard base policies limit hospital room rent to 1% of the Sum Insured (e.g. ₹5,000/day on a 5L plan). If you choose a room exceeding this limit, all associated medical bills (doctor fees, surgery costs) are proportionately deducted. Arogya Silver and Gold plans have ZERO room rent capping, protecting you from disproportionate billing!',
    },
    {
      q: 'How does BMI (Body Mass Index) influence health insurance premiums?',
      a: 'Underwriting algorithms consider BMI between 18.5 and 24.9 as standard. BMIs above 30 indicate obesity, which statistically correlates with hypertension and cardiac stress. Maintaining a healthy BMI earns preferred renewal discounts.',
    },
    {
      q: 'What is a Pre-Existing Disease (PED) Waiting Period?',
      a: 'A pre-existing disease is any medical condition diagnosed before buying the policy (such as Thyroid or Diabetes). IRDAI guidelines standardly mandate a 1 to 2-year waiting period before claims related to that specific pre-existing illness are covered. Our Gold plan offers an optional day-1 waiver rider.',
    },
    {
      q: 'Is my prediction data private and secure in MongoDB Atlas?',
      a: 'Yes. All prediction parameters and policy records stored in MongoDB Atlas are protected with 256-bit TLS encryption in transit and AES-256 at rest, adhering to HIPAA and ISO 27001 healthcare data standards.',
    },
  ];

  const terms = [
    {
      term: 'Deductible',
      definition: 'A predetermined amount you agree to pay out-of-pocket before your health insurance begins paying.',
    },
    {
      term: 'Co-Payment (Co-Pay)',
      definition: 'A cost-sharing mechanism where you pay a fixed percentage (e.g., 10%) of the admissible claim and the insurer covers the remaining 90%.',
    },
    {
      term: 'Cumulative Bonus (NCB)',
      definition: 'An increase in your Sum Insured without any increase in premium for every claim-free year (up to 100% on Arogya plans).',
    },
    {
      term: 'Restoration Benefit',
      definition: 'Automatic 100% replenishment of your Sum Insured if exhausted by previous hospitalizations in the same policy year.',
    },
  ];

  return (
    <div className="guide-view py-6">
      <div className="container">
        {/* Header */}
        <div className="section-header text-center mb-8">
          <div className="badge mb-2">
            <BookOpen size={14} /> Health Insurance Knowledge Base
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            Insurance <span className="gradient-text">Guide & Terminology</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Everything you need to know about healthcare insurance, cashless hospital networks, and how machine learning optimizes your coverage.
          </p>
        </div>

        {/* Essential Terms Glossary */}
        <div className="glossary-section mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info size={20} className="text-primary" /> Key Health Insurance Terms Explained
          </h3>
          <div className="terms-grid">
            {terms.map((item, idx) => (
              <div key={idx} className="glass-card p-5">
                <h4 className="font-bold text-primary mb-1 text-base">{item.term}</h4>
                <p className="text-sm text-secondary leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div className="faq-section mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-secondary" /> Frequently Asked Questions
          </h3>
          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="glass-card faq-item mb-3 overflow-hidden">
                  <button
                    className="faq-question-btn p-5 w-full flex-between text-left font-semibold"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span className="text-base text-white">{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} className="text-primary flex-shrink-0" /> : <ChevronDown size={20} className="text-muted flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer p-5 pt-0 text-sm text-secondary border-t border-subtle">
                      <p className="leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="glass-card p-8 text-center bg-surface">
          <h3 className="text-2xl font-bold mb-2">Ready to Discover Your Exact Medical Premium?</h3>
          <p className="text-muted text-sm max-w-md mx-auto mb-6">
            Test our Python 3.10 Machine Learning Predictor in under 60 seconds with no commitment or registration required.
          </p>
          <button className="btn btn-primary py-3 px-8 text-base" onClick={() => setActiveTab('predict')}>
            <span>Launch AI Cost Predictor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
