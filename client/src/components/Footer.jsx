import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin, Heart, Lock, Award, CheckCircle } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="nav-brand mb-3">
              <ShieldCheck className="brand-shield" size={28} />
              <div className="brand-text">
                <span className="brand-title">आरोग्य कवच</span>
                <span className="brand-subtitle">HealthInsure Pro</span>
              </div>
            </div>
            <p className="footer-description">
              India's premier AI-powered health insurance platform. Combining advanced machine learning predictions, transparent plan comparisons, and instant cashless hospitalization support.
            </p>
            <div className="security-badges">
              <span className="sec-badge"><Lock size={14} /> 256-Bit SSL</span>
              <span className="sec-badge"><Award size={14} /> ISO 27001</span>
              <span className="sec-badge"><CheckCircle size={14} /> IRDAI Registered</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-title">Platform Features</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNav('predict')}>AI Cost Predictor</button></li>
              <li><button onClick={() => handleNav('bmi')}>BMI Health Calculator</button></li>
              <li><button onClick={() => handleNav('plans')}>Compare Insurance Plans</button></li>
              <li><button onClick={() => handleNav('active-plans')}>My Active Policies</button></li>
              <li><button onClick={() => handleNav('guide')}>Insurance Guide & Terms</button></li>
            </ul>
          </div>

          {/* Healthcare Resources */}
          <div className="footer-col">
            <h4 className="footer-title">Policyholder Care</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNav('reviews')}>Customer Reviews & Ratings</button></li>
              <li><button onClick={() => handleNav('contact')}>Find Cashless Hospitals</button></li>
              <li><button onClick={() => handleNav('contact')}>File Cashless Claim (24x7)</button></li>
              <li><button onClick={() => handleNav('guide')}>Pre-Existing Diseases Guide</button></li>
              <li><button onClick={() => handleNav('contact')}>Support & Grievances</button></li>
            </ul>
          </div>

          {/* Contact & Helpline */}
          <div className="footer-col">
            <h4 className="footer-title">24x7 Support Helpline</h4>
            <div className="footer-contact-item">
              <PhoneCall size={16} className="contact-icon text-primary" />
              <div>
                <span className="contact-label">Toll-Free Emergency</span>
                <p className="contact-val">1800-276492 (1800-AROGYA)</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} className="contact-icon text-secondary" />
              <div>
                <span className="contact-label">Support Email</span>
                <p className="contact-val">support@arogyakavaj.com</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <MapPin size={16} className="contact-icon text-muted" />
              <div>
                <span className="contact-label">Corporate Office</span>
                <p className="contact-val">BKC Cyber City, Mumbai, Maharashtra 400051</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} आरोग्य कवच (Arogya Kavaj). Built with React.js, Express, MongoDB Atlas, and Python 3.10 Machine Learning.
          </p>
          <div className="footer-legal">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
