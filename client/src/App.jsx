import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

import HomeView from './views/HomeView';
import FeatureView from './views/FeatureView';
import HowItWorksView from './views/HowItWorksView';
import CalculatorView from './views/CalculatorView';
import PlansView from './views/PlansView';
import ActivePlanView from './views/ActivePlanView';
import TestimonialsView from './views/TestimonialsView';
import ContactView from './views/ContactView';
import AuthView from './views/AuthView';
import ProfileView from './views/ProfileView';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Exact Purple Gradient Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'features' && <FeatureView setActiveTab={setActiveTab} />}
        {activeTab === 'how-it-works' && <HowItWorksView setActiveTab={setActiveTab} />}
        {activeTab === 'calculator' && <CalculatorView setActiveTab={setActiveTab} />}
        {activeTab === 'plans' && <PlansView setActiveTab={setActiveTab} />}
        {activeTab === 'active-plan' && <ActivePlanView setActiveTab={setActiveTab} />}
        {activeTab === 'testimonials' && <TestimonialsView />}
        {activeTab === 'contact' && <ContactView />}
        {activeTab === 'auth' && <AuthView setActiveTab={setActiveTab} />}
        {activeTab === 'profile' && <ProfileView setActiveTab={setActiveTab} />}
      </main>

      {/* 24/7 Floating Insurance Assistant Chatbot */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
