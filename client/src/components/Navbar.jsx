import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="gradient-bg text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center cursor-pointer select-none"
            onClick={() => handleNav('home')}
          >
            <img 
              src="/p.jpg" 
              alt="HealthInsure logo" 
              className="h-10 w-10 rounded-full object-cover shadow border border-white/20"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="ml-3 text-2xl font-bold tracking-tight">आरोग्य कवच</span>
          </div>

          {/* Desktop Navigation Links (exact links from Home.html) */}
          <div className="hidden md:flex space-x-6 items-center">
            <button 
              onClick={() => handleNav('home')} 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('features')} 
              className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
            >
              Features
            </button>
            <button 
              onClick={() => handleNav('how-it-works')} 
              className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNav('calculator')} 
              className={`nav-link ${activeTab === 'calculator' ? 'active' : ''}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => handleNav('plans')} 
              className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
            >
              Plans
            </button>
            <button 
              onClick={() => handleNav('active-plan')} 
              className={`nav-link ${activeTab === 'active-plan' ? 'active' : ''}`}
            >
              Active Plan
            </button>
            <button 
              onClick={() => handleNav('testimonials')} 
              className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`}
            >
              Testimonials
            </button>
            <button 
              onClick={() => handleNav('contact')} 
              className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button>
            <button 
              onClick={() => handleNav('profile')} 
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            >
              Profile
            </button>

            {/* Auth Link */}
            {user ? (
              <div className="flex items-center space-x-3 ml-2">
                <button
                  onClick={() => handleNav('profile')}
                  className="bg-white/20 px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition text-sm flex items-center gap-2"
                >
                  <i className="fas fa-user-circle"></i>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-red-300 hover:text-red-100 text-sm font-semibold transition"
                  title="Sign Out"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow text-sm"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-white focus:outline-none p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 flex flex-col space-y-3 pb-2">
            <button 
              onClick={() => handleNav('home')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('features')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Features
            </button>
            <button 
              onClick={() => handleNav('how-it-works')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNav('calculator')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Calculator (AI Predictor)
            </button>
            <button 
              onClick={() => handleNav('plans')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Plans
            </button>
            <button 
              onClick={() => handleNav('active-plan')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Active Plan
            </button>
            <button 
              onClick={() => handleNav('testimonials')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Testimonials
            </button>
            <button 
              onClick={() => handleNav('contact')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              Contact
            </button>
            <button 
              onClick={() => handleNav('profile')} 
              className="text-left py-2 font-medium hover:text-gray-200"
            >
              My Profile & Health Card
            </button>
            <div className="pt-2">
              {user ? (
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full text-center bg-white text-indigo-700 py-2.5 rounded-full font-semibold shadow"
                >
                  My Profile ({user.name.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="w-full text-center bg-white text-indigo-700 py-2.5 rounded-full font-semibold shadow"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
