import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldAlert, Heart, CheckCircle2, Info } from 'lucide-react';

export default function BmiCalculatorView({ onApplyBmiToPredictor }) {
  const [unit, setUnit] = useState('metric'); // 'metric' (cm/kg) or 'imperial' (inches/lbs)
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(68);

  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);
  const [weightLbs, setWeightLbs] = useState(150);

  // Calculate BMI
  let bmi = 23.5;
  if (unit === 'metric') {
    const hMeters = heightCm / 100;
    bmi = Number((weightKg / (hMeters * hMeters)).toFixed(1));
  } else {
    const totalInches = heightFeet * 12 + heightInches;
    bmi = Number(((weightLbs / (totalInches * totalInches)) * 703).toFixed(1));
  }

  // Determine category & advice
  let category = 'Normal';
  let categoryColor = '#10b981';
  let advice = 'You have a healthy Body Mass Index. This qualifies you for standard insurance underwriting with no obesity surcharges!';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#3b82f6';
    advice = 'Your BMI indicates you are underweight. Basic wellness advice is recommended, with normal base insurance rates.';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
    categoryColor = '#10b981';
    advice = 'Optimal healthy weight. You are eligible for zero loading and highest preferred discounts across all Arogya plans.';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    categoryColor = '#f59e0b';
    advice = 'Slightly above the optimal range. Insurance algorithms may apply mild risk weighting. Participating in wellness tracking waives this.';
  } else {
    category = 'Obesity';
    categoryColor = '#ef4444';
    advice = 'Obesity is classified as an elevated actuarial risk factor for cardiovascular conditions. We provide customized wellness programs to help reduce future premiums.';
  }

  const handleUseInPredictor = () => {
    onApplyBmiToPredictor(category);
  };

  return (
    <div className="bmi-view py-6">
      <div className="container">
        <div className="section-header text-center mb-6">
          <div className="badge mb-2">
            <Calculator size={14} /> Medical Insurance Underwriting Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            BMI Health & Insurance <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Body Mass Index directly impacts your insurance premium multiplier. Calculate yours and see how it influences your policy rates.
          </p>
        </div>

        <div className="bmi-grid-layout">
          {/* Left: Input Card */}
          <div className="glass-card p-6">
            <div className="flex-between mb-4">
              <h3 className="font-bold text-lg">Input Your Measurements</h3>
              <div className="button-toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${unit === 'metric' ? 'active' : ''}`}
                  onClick={() => setUnit('metric')}
                >
                  Metric (cm / kg)
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${unit === 'imperial' ? 'active' : ''}`}
                  onClick={() => setUnit('imperial')}
                >
                  Imperial (ft / lbs)
                </button>
              </div>
            </div>

            {unit === 'metric' ? (
              <>
                {/* Height Slider */}
                <div className="form-group mb-5">
                  <div className="flex-between mb-2">
                    <label className="form-label">Height</label>
                    <span className="font-bold text-primary text-lg">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="110"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="slider-input"
                  />
                  <div className="slider-ticks">
                    <span>110 cm</span>
                    <span>150 cm</span>
                    <span>180 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="form-group mb-4">
                  <div className="flex-between mb-2">
                    <label className="form-label">Weight</label>
                    <span className="font-bold text-secondary text-lg">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="slider-input secondary"
                  />
                  <div className="slider-ticks">
                    <span>30 kg</span>
                    <span>60 kg</span>
                    <span>90 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Feet & Inches */}
                <div className="form-grid-2col mb-4">
                  <div className="form-group">
                    <label className="form-label">Feet</label>
                    <select
                      className="form-select"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                    >
                      {[4, 5, 6, 7].map((f) => (
                        <option key={f} value={f}>{f} ft</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inches</label>
                    <select
                      className="form-select"
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                        <option key={i} value={i}>{i} in</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Weight in Lbs */}
                <div className="form-group mb-4">
                  <div className="flex-between mb-2">
                    <label className="form-label">Weight (lbs)</label>
                    <span className="font-bold text-secondary text-lg">{weightLbs} lbs</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="350"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="slider-input secondary"
                  />
                  <div className="slider-ticks">
                    <span>70 lbs</span>
                    <span>150 lbs</span>
                    <span>250 lbs</span>
                    <span>350 lbs</span>
                  </div>
                </div>
              </>
            )}

            {/* Standard Reference Table */}
            <div className="bmi-category-strip mt-5">
              <span className="text-xs text-muted block mb-2 font-semibold">BMI REFERENCE SCALE</span>
              <div className="bmi-spectrum-bar">
                <div className="seg seg-under" title="Underweight (< 18.5)"></div>
                <div className="seg seg-normal" title="Normal (18.5 - 24.9)"></div>
                <div className="seg seg-over" title="Overweight (25 - 29.9)"></div>
                <div className="seg seg-obese" title="Obese (30+)"></div>
              </div>
              <div className="bmi-spectrum-labels">
                <span>&lt;18.5 Under</span>
                <span>18.5-24.9 Normal</span>
                <span>25-29.9 Over</span>
                <span>30+ Obese</span>
              </div>
            </div>
          </div>

          {/* Right: Results Card */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <span className="badge mb-3">
                <Heart size={14} /> Clinical Assessment
              </span>
              <h3 className="text-xl font-bold mb-4">Your BMI Analysis</h3>

              {/* Big Score Display */}
              <div className="bmi-score-box text-center py-6 mb-5">
                <span className="text-xs uppercase tracking-widest text-muted block">Calculated BMI</span>
                <span className="text-6xl font-black my-2 inline-block" style={{ color: categoryColor }}>
                  {bmi}
                </span>
                <div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold inline-block"
                    style={{ backgroundColor: `${categoryColor}25`, color: categoryColor, border: `1px solid ${categoryColor}50` }}
                  >
                    {category} Weight Category
                  </span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="advice-callout p-4 rounded-lg bg-surface border border-subtle mb-5">
                <div className="flex items-start gap-2">
                  <Info size={18} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-secondary leading-relaxed">
                    {advice}
                  </p>
                </div>
              </div>
            </div>

            {/* Link to Cost Predictor */}
            <button
              onClick={handleUseInPredictor}
              className="btn btn-primary w-full py-3"
            >
              <span>Use "{category}" in AI Cost Predictor</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
