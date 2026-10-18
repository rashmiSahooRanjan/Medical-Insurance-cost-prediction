import React, { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your Arogya Kavaj 24/7 Insurance Assistant. How can I assist you with your health insurance quotes or policies today?"
    }
  ]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsgList = [...messages, { sender: 'user', text: userText }];
    setMessages(newMsgList);
    setInputMsg('');

    // Generate smart automated reply
    setTimeout(() => {
      let botReply = "Thank you for asking! You can use our AI Calculator to get an exact quote in 30 seconds based on your medical parameters, or check our Plans section for 100% cashless hospital covers.";
      const lower = userText.toLowerCase();

      if (lower.includes('plan') || lower.includes('coverage') || lower.includes('cost')) {
        botReply = "We offer 3 primary plans: Basic Shield (₹5L at ₹5,999/yr), Standard Plan (₹15L at ₹11,999/yr - Most Popular), and Premium Plan (₹50L at ₹24,999/yr) with 11,200+ cashless hospitals.";
      } else if (lower.includes('claim') || lower.includes('hospital') || lower.includes('cashless')) {
        botReply = "For cashless hospital claims, show your digital policy card at any of our 11,200+ partner network hospitals. Our 24/7 desk processes pre-authorizations in under 30 minutes!";
      } else if (lower.includes('predict') || lower.includes('ai') || lower.includes('calculate')) {
        botReply = "Our machine learning model is powered by Python 3.10 and analyzes 50+ factors including age, BMI, smoking status, and medical history. Head to the 'Calculator' tab to try it!";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        botReply = "Hello! Looking for a personalized insurance cost prediction or details about our cashless health plans?";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="chat-button" 
        onClick={() => setIsOpen(!isOpen)}
        title="Insurance Assistant"
        aria-label="Open 24/7 Insurance Chat Assistant"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
      </button>

      {/* Chat Window Container */}
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div>
              <h2 className="font-bold text-base">🛡️ Insurance Assistant</h2>
              <p className="text-xs text-white/80">Your 24/7 Insurance Helper</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-lg"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`chat-bubble ${m.sender === 'user' ? 'user' : 'bot'}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
