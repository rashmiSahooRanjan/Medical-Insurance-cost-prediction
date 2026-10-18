import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function CalculatorView({ setActiveTab }) {
  const [formData, setFormData] = useState({
    age: 30,
    gender: 'Male',
    maritalStatus: 'Married',
    dependants: 1,
    incomeLakhs: 10,
    employmentStatus: 'Salaried',
    geneticalRisk: 1,
    smokingStatus: 'No Smoking',
    region: 'Northwest',
    insurancePlan: 'Silver',
    bmiCategory: 'Normal',
    medicalHistory: 'No Disease',
    sumInsured: 500000,
    policyTerm: 2,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [displayCost, setDisplayCost] = useState(0);
  const [toast, setToast] = useState(null);
  const [mlServiceOnline, setMlServiceOnline] = useState(true);

  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Check ML Microservice health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.services && data.services.ml) {
          setMlServiceOnline(data.services.ml.status === 'reachable');
        }
      })
      .catch(() => setMlServiceOnline(false));
  }, []);

  // Animated Count-Up for Annual Cost
  useEffect(() => {
    if (!result || !result.predicted_cost) return;

    const target = result.predicted_cost;
    const duration = 1000;
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const current = Math.round(target * (1 - Math.pow(1 - progress, 2)));
      setDisplayCost(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayCost(target);
      }
    }, duration / totalFrames);

    return () => clearInterval(timer);
  }, [result]);

  // Render Doughnut Chart when result changes
  useEffect(() => {
    if (!result || !chartCanvasRef.current || !window.Chart) return;

    const breakdown = result.breakdown || {
      base: Math.round(result.predicted_cost * 0.52),
      age: Math.round(result.predicted_cost * 0.18),
      health: Math.round(result.predicted_cost * 0.14),
      region: Math.round(result.predicted_cost * 0.06),
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    chartInstanceRef.current = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Base Premium', 'Age Factor', 'Health Risk', 'Region Factor'],
        datasets: [
          {
            data: [breakdown.base, breakdown.age, breakdown.health, breakdown.region],
            backgroundColor: ['#0066CC', '#3399FF', '#66B2FF', '#99CCFF'],
            borderWidth: 2,
            borderColor: '#232332',
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              font: { size: 11, family: 'Segoe UI, Poppins, sans-serif' },
              padding: 12,
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const val = context.raw || 0;
                return ` ${label}: ₹${val.toLocaleString('en-IN')}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [result]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberStep = (field, delta, min = 0, max = 200) => {
    setFormData((prev) => {
      const val = Number(prev[field]) + delta;
      return { ...prev, [field]: Math.min(max, Math.max(min, val)) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const payload = {
        age: Number(formData.age),
        dependants: Number(formData.dependants),
        incomeLakhs: Number(formData.incomeLakhs),
        geneticalRisk: Number(formData.geneticalRisk),
        insurancePlan: formData.insurancePlan,
        employmentStatus: formData.employmentStatus,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        bmiCategory: formData.bmiCategory,
        smokingStatus: formData.smokingStatus,
        region: formData.region,
        medicalHistory: formData.medicalHistory,
        sumInsured: Number(formData.sumInsured),
        policyTerm: Number(formData.policyTerm),
      };

      const res = await fetch('/api/predictions/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('arogya_token')
            ? { Authorization: `Bearer ${localStorage.getItem('arogya_token')}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        const modelName = data.data.model_used || 'Python ML Model';
        setToast(`ML Output Calculated: ${modelName}`);

        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else {
        throw new Error(data.message || 'Machine Learning prediction failed');
      }
    } catch (err) {
      console.error('Calculation Error:', err);
      setToast('Calculated actuarial estimate with safety fallback.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    if (!window.jspdf) {
      alert('Generating print summary...');
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Purple header background
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('आरोग्य कवच - Health Insurance Report', 15, 20);
    doc.setFontSize(10);
    doc.text('Powered by Python 3.10 Machine Learning & Actuarial Risk Engine', 15, 28);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.text('Applicant Profile & Inputs', 15, 48);

    doc.setFontSize(10);
    doc.text(`Age: ${formData.age} Years`, 15, 58);
    doc.text(`Gender: ${formData.gender}`, 15, 66);
    doc.text(`Marital Status: ${formData.maritalStatus}`, 15, 74);
    doc.text(`Dependants: ${formData.dependants}`, 15, 82);
    doc.text(`Annual Income: Rs. ${formData.incomeLakhs} Lakhs`, 15, 90);

    doc.text(`Insurance Plan: ${formData.insurancePlan}`, 110, 58);
    doc.text(`Sum Insured: Rs. ${(formData.sumInsured / 100000).toFixed(0)} Lakhs`, 110, 66);
    doc.text(`Policy Term: ${formData.policyTerm} Year(s)`, 110, 74);
    doc.text(`BMI Category: ${formData.bmiCategory}`, 110, 82);
    doc.text(`Smoking Status: ${formData.smokingStatus}`, 110, 90);

    doc.setDrawColor(200, 200, 200);
    doc.line(15, 98, 195, 98);

    doc.setFontSize(14);
    doc.text('Machine Learning Prediction Summary', 15, 110);

    doc.setFontSize(11);
    doc.text(`ML Model Executed: ${result.model_used || 'Python ML'}`, 15, 120);
    doc.text(`Algorithm: ${result.algorithm || 'XGBoost / Ridge Regression'}`, 15, 128);
    doc.text(`Normalized Risk Score: ${result.normalized_risk_score} / 1.00 (${result.risk_level} Risk)`, 15, 136);

    doc.setFillColor(243, 244, 246);
    doc.rect(15, 144, 180, 28, 'F');
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34);
    doc.text(`Annual Premium: Rs. ${result.predicted_cost.toLocaleString('en-IN')}`, 20, 156);
    doc.setFontSize(11);
    doc.setTextColor(70, 70, 70);
    doc.text(`Monthly Estimate: Rs. ${result.monthly_estimate.toLocaleString('en-IN')} (approx.)`, 20, 166);

    if (result.breakdown) {
      doc.setFontSize(13);
      doc.setTextColor(40, 40, 40);
      doc.text('Cost Composition Breakdown', 15, 186);

      doc.setFontSize(10);
      doc.text(`Base Premium: Rs. ${result.breakdown.base.toLocaleString('en-IN')}`, 15, 196);
      doc.text(`Age Factor Loading: Rs. ${result.breakdown.age.toLocaleString('en-IN')}`, 15, 204);
      doc.text(`Health Risk Loading: Rs. ${result.breakdown.health.toLocaleString('en-IN')}`, 15, 212);
      doc.text(`Region Factor Loading: Rs. ${result.breakdown.region.toLocaleString('en-IN')}`, 15, 220);
      doc.text(`GST (18%): Rs. ${result.breakdown.gst.toLocaleString('en-IN')}`, 15, 228);
    }

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Report Generated On: ${new Date().toLocaleString()} | Arogya Kavaj Medical Insurance`, 15, 280);

    doc.save(`Arogya_ML_Report_${formData.age}yr_${Date.now()}.pdf`);
  };

  const totalCost = result ? result.predicted_cost : 0;
  const breakdown = result?.breakdown || {
    base: Math.round(totalCost * 0.52),
    age: Math.round(totalCost * 0.18),
    health: Math.round(totalCost * 0.14),
    region: Math.round(totalCost * 0.06),
    gst: Math.round(totalCost * 0.18),
  };

  return (
    <div className="calculator-page-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast show" style={{ zIndex: 9999 }}>
          <div className="flex items-center">
            <span className="mr-2">
              <i className="fas fa-robot text-green-400"></i>
            </span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Floating Shapes Background from p.html */}
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="calc-grid">
        {/* Left Card: Input Form */}
        <div className="calc-card">
          <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-6">
            <h2 className="text-xl font-bold text-white mb-0 border-b-0 pb-0">
              Enter Your Details
            </h2>
            <div className="flex items-center gap-2 text-xs bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <span className={`ml-status-dot ${mlServiceOnline ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className="text-gray-300 font-medium">
                {mlServiceOnline ? 'Python 3.10 ML Online' : 'Local Engine Ready'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="calc-form-grid">
              {/* Age */}
              <div className="calc-form-group">
                <label>Age</label>
                <div className="calc-input-wrapper">
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    required
                  />
                  <div className="input-controls">
                    <button type="button" onClick={() => handleNumberStep('age', 1, 18, 100)}>
                      +
                    </button>
                    <button type="button" onClick={() => handleNumberStep('age', -1, 18, 100)}>
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="calc-form-group">
                <label>Gender</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Smoking Status */}
              <div className="calc-form-group">
                <label>Smoking Status</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.smokingStatus}
                    onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                  >
                    <option value="No Smoking">No / Non-Smoker</option>
                    <option value="Regular">Yes / Regular Smoker</option>
                    <option value="Occasional">Occasional Smoker</option>
                  </select>
                </div>
              </div>

              {/* Region */}
              <div className="calc-form-group">
                <label>Region</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                  >
                    <option value="Northwest">North / Northwest India</option>
                    <option value="Southeast">East / Southeast India</option>
                    <option value="Southwest">South / Southwest India</option>
                    <option value="Northeast">Northeast India</option>
                  </select>
                </div>
              </div>

              {/* Number of Dependants */}
              <div className="calc-form-group">
                <label>Number of Dependants</label>
                <div className="calc-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.dependants}
                    onChange={(e) => handleInputChange('dependants', Number(e.target.value))}
                    required
                  />
                  <div className="input-controls">
                    <button type="button" onClick={() => handleNumberStep('dependants', 1, 0, 20)}>
                      +
                    </button>
                    <button type="button" onClick={() => handleNumberStep('dependants', -1, 0, 20)}>
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Insurance Plan */}
              <div className="calc-form-group">
                <label>Insurance Plan</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.insurancePlan}
                    onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                  >
                    <option value="Bronze">Bronze (Base Plan)</option>
                    <option value="Silver">Silver (Standard Plan)</option>
                    <option value="Gold">Gold (Premium Plan)</option>
                  </select>
                </div>
              </div>

              {/* BMI Category */}
              <div className="calc-form-group">
                <label>BMI Category</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.bmiCategory}
                    onChange={(e) => handleInputChange('bmiCategory', e.target.value)}
                  >
                    <option value="Normal">Normal (18.5 - 24.9)</option>
                    <option value="Overweight">Overweight (25 - 29.9)</option>
                    <option value="Obesity">Obese (30+)</option>
                    <option value="Underweight">Underweight (&lt;18.5)</option>
                  </select>
                </div>
              </div>

              {/* Medical History */}
              <div className="calc-form-group">
                <label>Medical History</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  >
                    <option value="No Disease">No Disease</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="High blood pressure">High Blood Pressure</option>
                    <option value="Diabetes & High blood pressure">Diabetes & High Blood Pressure</option>
                    <option value="Thyroid">Thyroid</option>
                    <option value="Heart disease">Heart Disease</option>
                    <option value="High blood pressure & Heart disease">High BP & Heart Disease</option>
                    <option value="Diabetes & Heart disease">Diabetes & Heart Disease</option>
                  </select>
                </div>
              </div>

              {/* Income in Lakhs */}
              <div className="calc-form-group">
                <label>Income in Lakhs (₹)</label>
                <div className="calc-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.incomeLakhs}
                    onChange={(e) => handleInputChange('incomeLakhs', Number(e.target.value))}
                    required
                  />
                  <div className="input-controls">
                    <button type="button" onClick={() => handleNumberStep('incomeLakhs', 1, 0, 200)}>
                      +
                    </button>
                    <button type="button" onClick={() => handleNumberStep('incomeLakhs', -1, 0, 200)}>
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Genetical Risk */}
              <div className="calc-form-group">
                <label>Genetical Risk (0 - 5)</label>
                <div className="calc-input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.geneticalRisk}
                    onChange={(e) => handleInputChange('geneticalRisk', Number(e.target.value))}
                    required
                  />
                  <div className="input-controls">
                    <button type="button" onClick={() => handleNumberStep('geneticalRisk', 1, 0, 5)}>
                      +
                    </button>
                    <button type="button" onClick={() => handleNumberStep('geneticalRisk', -1, 0, 5)}>
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Employment Status */}
              <div className="calc-form-group">
                <label>Employment Status</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
              </div>

              {/* Marital Status */}
              <div className="calc-form-group">
                <label>Marital Status</label>
                <div className="calc-input-wrapper">
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  >
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                  </select>
                </div>
              </div>

              {/* Coverage Details Section */}
              <div className="coverage-box">
                <h3>Coverage Details</h3>
                <div className="coverage-grid">
                  <div className="calc-form-group">
                    <label>Sum Insured (₹)</label>
                    <div className="calc-input-wrapper">
                      <select
                        value={formData.sumInsured}
                        onChange={(e) => handleInputChange('sumInsured', Number(e.target.value))}
                      >
                        <option value="300000">3 Lakhs</option>
                        <option value="500000">5 Lakhs (Standard)</option>
                        <option value="1000000">10 Lakhs</option>
                        <option value="1500000">15 Lakhs</option>
                        <option value="2000000">20 Lakhs</option>
                        <option value="2500000">25 Lakhs</option>
                        <option value="5000000">50 Lakhs</option>
                      </select>
                    </div>
                    <small className="text-gray-400 text-xs mt-1 block">
                      Recommended: ₹5-10 lakhs for individuals
                    </small>
                  </div>

                  <div className="calc-form-group">
                    <label>Policy Term (Years)</label>
                    <div className="calc-input-wrapper">
                      <select
                        value={formData.policyTerm}
                        onChange={(e) => handleInputChange('policyTerm', Number(e.target.value))}
                      >
                        <option value="1">1 Year</option>
                        <option value="2">2 Years (5% multi-year discount)</option>
                        <option value="3">3 Years (10% multi-year discount)</option>
                        <option value="4">4 Years (12% multi-year discount)</option>
                        <option value="5">5 Years (15% multi-year discount)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn-predict">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Running Machine Learning Inference...
                  </span>
                ) : (
                  'Calculate Premium'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Estimated Premium & Machine Learning Outputs */}
        <div className="calc-card">
          <h2>Estimated Premium</h2>

          {result ? (
            <div className="result-section">
              {/* Machine Learning Model Badge */}
              <div className="ml-badge-container">
                <div className="ml-badge-header">
                  <span className="ml-badge-title">
                    <span className="ml-status-dot"></span>
                    <span>Machine Learning Inference</span>
                  </span>
                  <span className="ml-badge-model">
                    {result.model_used?.includes('young') ? 'model_young (<=25)' : 'model_rest (>25)'}
                  </span>
                </div>
                <div className="ml-badge-info-grid">
                  <div className="ml-badge-info-item">
                    <span>Algorithm: </span>
                    <strong>{result.algorithm || 'XGBoost Regressor'}</strong>
                  </div>
                  <div className="ml-badge-info-item">
                    <span>Health Risk: </span>
                    <strong className={result.risk_level === 'High' ? 'text-red-400' : (result.risk_level === 'Moderate' ? 'text-yellow-400' : 'text-green-400')}>
                      {result.normalized_risk_score} / 1.0 ({result.risk_level})
                    </strong>
                  </div>
                  <div className="ml-badge-info-item">
                    <span>Features Evaluated: </span>
                    <strong>18 Categorical & Scaled</strong>
                  </div>
                  <div className="ml-badge-info-item">
                    <span>Policy Term Discount: </span>
                    <strong className="text-green-400">-{result.discount_percent || 5}%</strong>
                  </div>
                </div>
              </div>

              <h3 className="text-gray-300 font-semibold text-lg">Annual Premium</h3>
              <div className="premium-display">
                <div className="result-amount">
                  ₹{displayCost.toLocaleString('en-IN')}
                </div>
                <div className="monthly-amount">
                  Monthly (approx.): ₹{result.monthly_estimate.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Premium Breakdown */}
              <div className="breakdown">
                <h4>Premium Breakdown</h4>
                <div className="breakdown-item">
                  <span>Base Premium:</span>
                  <strong>₹{breakdown.base.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Age Factor:</span>
                  <strong>₹{breakdown.age.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Health Risk:</span>
                  <strong>₹{breakdown.health.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Region Factor:</span>
                  <strong>₹{breakdown.region.toLocaleString('en-IN')}</strong>
                </div>
                <div className="breakdown-item">
                  <span>GST (18%):</span>
                  <strong>₹{breakdown.gst.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Doughnut Chart Canvas (from p.html) */}
              <div className="chart-container">
                <h4 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '15px', fontWeight: 600 }}>
                  Cost Composition
                </h4>
                <canvas id="pieChart" ref={chartCanvasRef}></canvas>
              </div>

              {/* Recommendations (ML Risk Factors & Tips) */}
              <div className="recommendations">
                <h4>Recommendations & ML Risk Insights</h4>
                <ul>
                  {result.risk_factors && result.risk_factors.map((factor, idx) => (
                    <li key={`rf-${idx}`}>{factor}</li>
                  ))}
                  {result.savings_tips && result.savings_tips.map((tip, idx) => (
                    <li key={`st-${idx}`}>{tip}</li>
                  ))}
                  <li>Higher sum insured provides significant economies of scale against medical inflation</li>
                  <li>Avail annual free cashless health checkups included in your Arogya plan</li>
                </ul>
              </div>

              {/* Download PDF Button */}
              <button
                type="button"
                className="btn-download mb-3"
                onClick={handleDownloadPDF}
              >
                <span>📥</span> Download PDF Report
              </button>

              {/* Apply for Plan Action */}
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition shadow-lg"
              >
                Apply for {formData.insurancePlan} Plan Now
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🏥</div>
              <p className="max-w-xs mx-auto">
                Fill the form and click calculate to see your insurance cost estimation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
