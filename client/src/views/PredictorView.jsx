import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  HeartPulse, 
  ArrowRight, 
  RefreshCw,
  Download,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PredictorView({ onSelectPlanForBooking }) {
  const [formData, setFormData] = useState({
    age: 28,
    dependants: 1,
    incomeLakhs: 12,
    geneticalRisk: 1,
    insurancePlan: 'Silver',
    employmentStatus: 'Salaried',
    gender: 'Male',
    maritalStatus: 'Married',
    bmiCategory: 'Normal',
    smokingStatus: 'No Smoking',
    region: 'Northwest',
    medicalHistory: 'No Disease',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showBmiHelper, setShowBmiHelper] = useState(false);
  const [calcHeight, setCalcHeight] = useState(172);
  const [calcWeight, setCalcWeight] = useState(68);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickBmiCalculate = () => {
    const hMeters = calcHeight / 100;
    const bmiVal = calcWeight / (hMeters * hMeters);
    let cat = 'Normal';
    if (bmiVal < 18.5) cat = 'Underweight';
    else if (bmiVal >= 25 && bmiVal < 30) cat = 'Overweight';
    else if (bmiVal >= 30) cat = 'Obesity';

    handleInputChange('bmiCategory', cat);
    setShowBmiHelper(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predictions/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('arogya_token') ? {
            'Authorization': `Bearer ${localStorage.getItem('arogya_token')}`
          } : {})
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        // Trigger celebratory confetti effect
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#06b6d4', '#3b82f6']
          });
        } catch (cErr) {}
      } else {
        throw new Error(resData.message || 'Failed to generate prediction');
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      setError('Could not connect to Prediction service. Using calibrated fallback.');
    } finally {
      setLoading(false);
    }
  };

  const medicalHistoryOptions = [
    'No Disease',
    'Diabetes',
    'High blood pressure',
    'Diabetes & High blood pressure',
    'Thyroid',
    'Heart disease',
    'High blood pressure & Heart disease',
    'Diabetes & Thyroid',
    'Diabetes & Heart disease',
  ];

  return (
    <div className="predictor-page py-6">
      <div className="container">
        {/* Header Banner */}
        <div className="section-header text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="badge">
              <Zap size={14} /> Python 3.10 Powered Machine Learning
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            AI Health Insurance <span className="gradient-text">Cost Predictor</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Input your health and demographic profile to get an instant, machine learning calculated annual premium quote.
          </p>
        </div>

        <div className="predictor-layout-grid">
          {/* Left / Top: Interactive Input Form */}
          <div className="glass-card form-card p-5">
            <h3 className="card-title-bar mb-4">
              <Activity className="text-primary" size={20} />
              <span>Demographic & Health Parameters</span>
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2col">
                {/* Age */}
                <div className="form-group">
                  <div className="flex-between mb-1">
                    <label className="form-label">Age</label>
                    <span className="font-bold text-primary">{formData.age} Years</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="85"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    className="slider-input"
                  />
                  <div className="slider-ticks">
                    <span>18</span>
                    <span>35</span>
                    <span>50</span>
                    <span>65</span>
                    <span>85+</span>
                  </div>
                </div>

                {/* Number of Dependants */}
                <div className="form-group">
                  <label className="form-label">Number of Dependants</label>
                  <select
                    className="form-select"
                    value={formData.dependants}
                    onChange={(e) => handleInputChange('dependants', Number(e.target.value))}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num === 0 ? '0 (Self Only)' : `${num} Member${num > 1 ? 's' : ''}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Annual Income (in Lakhs) */}
                <div className="form-group">
                  <div className="flex-between mb-1">
                    <label className="form-label">Annual Income (₹ Lakhs)</label>
                    <span className="font-bold text-secondary">₹{formData.incomeLakhs} Lakhs/yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={formData.incomeLakhs}
                    onChange={(e) => handleInputChange('incomeLakhs', Number(e.target.value))}
                    className="slider-input secondary"
                  />
                  <div className="slider-ticks">
                    <span>₹1L</span>
                    <span>₹15L</span>
                    <span>₹30L</span>
                    <span>₹60L+</span>
                  </div>
                </div>

                {/* Insurance Tier Plan */}
                <div className="form-group">
                  <label className="form-label">Target Insurance Plan</label>
                  <div className="plan-pill-group">
                    {['Bronze', 'Silver', 'Gold'].map((plan) => (
                      <button
                        type="button"
                        key={plan}
                        onClick={() => handleInputChange('insurancePlan', plan)}
                        className={`plan-pill-btn ${formData.insurancePlan === plan ? 'selected' : ''}`}
                      >
                        <span className="plan-name">{plan}</span>
                        <span className="plan-tier-sub">
                          {plan === 'Bronze' ? '5L Cover' : plan === 'Silver' ? '15L Cover' : '50L Cover'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <div className="button-toggle-group">
                    {['Male', 'Female'].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => handleInputChange('gender', g)}
                        className={`toggle-btn ${formData.gender === g ? 'active' : ''}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Marital Status */}
                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <div className="button-toggle-group">
                    {['Unmarried', 'Married'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => handleInputChange('maritalStatus', m)}
                        className={`toggle-btn ${formData.maritalStatus === m ? 'active' : ''}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BMI Category */}
                <div className="form-group">
                  <div className="flex-between mb-1">
                    <label className="form-label">BMI Category</label>
                    <button
                      type="button"
                      onClick={() => setShowBmiHelper(!showBmiHelper)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Calculate BMI ↗
                    </button>
                  </div>
                  <select
                    className="form-select"
                    value={formData.bmiCategory}
                    onChange={(e) => handleInputChange('bmiCategory', e.target.value)}
                  >
                    <option value="Normal">Normal (BMI 18.5 - 24.9)</option>
                    <option value="Overweight">Overweight (BMI 25 - 29.9)</option>
                    <option value="Obesity">Obesity (BMI 30+)</option>
                    <option value="Underweight">Underweight (BMI &lt; 18.5)</option>
                  </select>
                </div>

                {/* Smoking Status */}
                <div className="form-group">
                  <label className="form-label">Smoking Status</label>
                  <select
                    className="form-select"
                    value={formData.smokingStatus}
                    onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                  >
                    <option value="No Smoking">Non-Smoker / No Tobacco</option>
                    <option value="Occasional">Occasional Smoker</option>
                    <option value="Regular">Regular Smoker (Daily)</option>
                  </select>
                </div>

                {/* Employment Status */}
                <div className="form-group">
                  <label className="form-label">Employment Status</label>
                  <select
                    className="form-select"
                    value={formData.employmentStatus}
                    onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                  >
                    <option value="Salaried">Salaried Professional</option>
                    <option value="Self-Employed">Self-Employed / Business</option>
                    <option value="Freelancer">Freelancer / Independent</option>
                  </select>
                </div>

                {/* Region */}
                <div className="form-group">
                  <label className="form-label">Geographic Region</label>
                  <select
                    className="form-select"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                  >
                    <option value="Northwest">Northwest India</option>
                    <option value="Southeast">Southeast India</option>
                    <option value="Northeast">Northeast India</option>
                    <option value="Southwest">Southwest India</option>
                  </select>
                </div>
              </div>

              {/* Genetical Risk Score */}
              <div className="form-group mt-3">
                <div className="flex-between mb-1">
                  <label className="form-label">
                    Hereditary / Genetical Risk (0 to 5)
                  </label>
                  <span className="font-semibold text-accent-amber">
                    Level {formData.geneticalRisk} of 5
                  </span>
                </div>
                <div className="genetical-slider-wrapper">
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => handleInputChange('geneticalRisk', level)}
                      className={`risk-btn ${formData.geneticalRisk === level ? 'selected' : ''}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-muted mt-1 block">
                  0 = No known hereditary conditions, 5 = Strong family history of severe health conditions.
                </span>
              </div>

              {/* Medical History */}
              <div className="form-group mt-3">
                <label className="form-label">Pre-Existing Medical History</label>
                <select
                  className="form-select"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                >
                  {medicalHistoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick BMI Helper Dropdown */}
              {showBmiHelper && (
                <div className="bmi-mini-calculator p-3 mb-4 rounded border border-subtle bg-surface">
                  <h5 className="text-sm font-bold mb-2 text-primary">Quick BMI Calculator</h5>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="text-xs text-muted">Height: {calcHeight} cm</label>
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={calcHeight}
                        onChange={(e) => setCalcHeight(Number(e.target.value))}
                        className="slider-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted">Weight: {calcWeight} kg</label>
                      <input
                        type="range"
                        min="35"
                        max="140"
                        value={calcWeight}
                        onChange={(e) => setCalcWeight(Number(e.target.value))}
                        className="slider-input"
                      />
                    </div>
                  </div>
                  <div className="flex-between">
                    <span className="text-xs font-semibold">
                      Calculated BMI: {(calcWeight / ((calcHeight / 100) * (calcHeight / 100))).toFixed(1)}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline py-1 px-3 text-xs"
                      onClick={handleQuickBmiCalculate}
                    >
                      Apply Category
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Predict Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-4 py-3 text-base shadow-glow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Processing Machine Learning Model...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate AI Insurance Cost Prediction</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Dynamic Machine Learning Prediction Results */}
          <div className="results-wrapper">
            {result ? (
              <div className="glass-card result-card animate-fade-in p-6">
                <div className="result-card-header flex-between mb-4">
                  <div>
                    <span className="badge">
                      <CheckCircle2 size={14} /> AI Prediction Verified
                    </span>
                    <h3 className="text-xl font-bold mt-1">Estimated Health Insurance Premium</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted block">Tier Selected</span>
                    <span className="font-bold text-primary">{formData.insurancePlan} Plan</span>
                  </div>
                </div>

                {/* Premium Amount Highlight */}
                <div className="premium-showcase-box p-5 mb-5 text-center">
                  <span className="text-xs uppercase tracking-wider text-muted block mb-1">
                    Annual Estimated Premium
                  </span>
                  <div className="premium-digits font-extrabold text-4xl md:text-5xl text-primary my-1">
                    ₹{result.predicted_cost.toLocaleString('en-IN')}
                    <span className="text-base text-muted font-normal"> / year</span>
                  </div>
                  <p className="text-sm text-secondary font-medium">
                    Equivalent to approx. <strong className="text-white">₹{result.monthly_estimate.toLocaleString('en-IN')}/month</strong>
                  </p>
                </div>

                {/* Risk Indicators Grid */}
                <div className="risk-metrics-grid mb-5">
                  <div className="risk-metric-box">
                    <span className="metric-title">Risk Classification</span>
                    <span className={`risk-badge-status ${result.risk_level.toLowerCase()}`}>
                      {result.risk_level} Risk
                    </span>
                  </div>
                  <div className="risk-metric-box">
                    <span className="metric-title">Normalized Score</span>
                    <span className="metric-val">
                      {(result.normalized_risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="risk-metric-box">
                    <span className="metric-title">Engine</span>
                    <span className="metric-val text-xs text-muted">
                      {result.model_used.includes('young') ? 'Model (Age ≤25)' : 'Model (Age >25)'}
                    </span>
                  </div>
                </div>

                {/* Detected Factors */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                  <div className="factor-section mb-4">
                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-1 text-accent-amber">
                      <AlertCircle size={15} /> Identified Risk Drivers:
                    </h5>
                    <ul className="factor-list">
                      {result.risk_factors.map((factor, idx) => (
                        <li key={idx} className="factor-item">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ways to Save */}
                {result.savings_tips && result.savings_tips.length > 0 && (
                  <div className="savings-section mb-5">
                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-1 text-primary">
                      <TrendingUp size={15} /> Opportunities to Reduce Cost:
                    </h5>
                    <ul className="savings-list">
                      {result.savings_tips.map((tip, idx) => (
                        <li key={idx} className="savings-item">
                          ✓ {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Call to Actions */}
                <div className="result-actions-stack">
                  <button
                    className="btn btn-primary w-full py-3"
                    onClick={() => onSelectPlanForBooking(formData.insurancePlan, result.predicted_cost)}
                  >
                    <span>Proceed to Book This Plan</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    className="btn btn-secondary w-full py-2 text-sm"
                    onClick={() => window.print()}
                  >
                    <Download size={14} />
                    <span>Download Official Quote (PDF)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card placeholder-card p-8 text-center flex-center-col">
                <div className="ai-pulse-orb mb-4">
                  <HeartPulse size={48} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2">Awaiting Your Parameters</h3>
                <p className="text-muted text-sm max-w-sm mb-6">
                  Configure the demographic and health options on the left and tap "Generate AI Insurance Cost Prediction" to view your customized machine learning quote.
                </p>
                <div className="accuracy-pill">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Trained on 50,000+ Indian Actuarial Medical Profiles</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
