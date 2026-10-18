const express = require('express');
const router = express.Router();
const axios = require('axios');
const Prediction = require('../models/Prediction');
const { optionalProtect, protect } = require('../middleware/auth');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Calculate fallback estimate if ML service is unreachable
function calculateFallbackEstimate(input) {
  const age = Number(input.age || input.Age || 30);
  const income = Number(input.incomeLakhs || input['Income in Lakhs'] || 10);
  const plan = input.insurancePlan || input['Insurance Plan'] || 'Silver';
  const smoking = input.smokingStatus || input['Smoking Status'] || 'No Smoking';
  const bmiCat = input.bmiCategory || input['BMI Category'] || 'Normal';
  const medHist = (input.medicalHistory || input['Medical History'] || 'No Disease').toLowerCase();
  const genetical = Number(input.geneticalRisk || input['Genetical Risk'] || 0);
  const dependants = Number(input.dependants || input['Number of Dependants'] || 0);

  let base = 3500;
  base += (age - 18) * 380;
  base += dependants * 1800;
  base += income * 120;
  base += genetical * 950;

  if (plan === 'Gold') base *= 1.35;
  if (plan === 'Bronze') base *= 0.85;

  if (smoking === 'Regular') base *= 1.6;
  else if (smoking === 'Occasional') base *= 1.25;

  if (bmiCat === 'Obesity') base *= 1.35;
  else if (bmiCat === 'Overweight') base *= 1.15;

  let riskScore = 0;
  if (medHist.includes('heart')) riskScore += 0.55;
  if (medHist.includes('diabetes')) riskScore += 0.35;
  if (medHist.includes('blood pressure')) riskScore += 0.35;
  if (medHist.includes('thyroid')) riskScore += 0.25;
  base += riskScore * 12000;

  const predicted = Math.max(3000, Math.round(base));
  return {
    predicted_cost: predicted,
    base_ml_annual: Math.round(predicted * 0.95),
    monthly_estimate: Math.round(predicted / 12),
    risk_level: riskScore > 0.4 || smoking === 'Regular' ? 'High' : (riskScore > 0.2 || bmiCat === 'Obesity' ? 'Moderate' : 'Low'),
    normalized_risk_score: Math.min(1.0, Number(riskScore.toFixed(3))),
    breakdown: {
      base: Math.round(predicted * 0.52),
      age: Math.round(predicted * 0.18),
      health: Math.round(predicted * 0.14),
      region: Math.round(predicted * 0.06),
      gst: Math.round(predicted * 0.18)
    },
    risk_factors: [
      smoking !== 'No Smoking' ? 'Smoking habit impacts respiratory & cardiovascular rates' : null,
      bmiCat !== 'Normal' ? `BMI category (${bmiCat}) influences coverage loading` : null,
      riskScore > 0 ? 'Medical history with pre-existing indicators' : null,
    ].filter(Boolean),
    savings_tips: [
      'Maintain regular cardiovascular fitness for preferred renewal rates',
      'Select higher voluntary deductibles to lower your annual premium by 10-20%',
      'Avail annual health checkups included in your Arogya plan',
    ],
    model_used: 'Heuristic Insurance Engine (Fallback)',
    algorithm: 'Heuristic Estimation',
  };
}

// POST /api/predictions/predict
router.post('/predict', optionalProtect, async (req, res) => {
  try {
    const input = req.body;
    let mlResult;

    // 1. Try calling the Python 3.10 ML Microservice
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, input, { timeout: 15000 });
      if (response.data && response.data.success) {
        mlResult = response.data.data;
      }
    } catch (mlErr) {
      console.warn(`[ML Service Warning]: Could not reach Python service at ${ML_SERVICE_URL}. Using fallback algorithm. Error:`, mlErr.message);
      mlResult = calculateFallbackEstimate(input);
    }

    if (!mlResult) {
      mlResult = calculateFallbackEstimate(input);
    }

    // 2. Save prediction record to MongoDB Atlas if possible
    let savedRecord = null;
    try {
      savedRecord = await Prediction.create({
        user: req.user ? req.user._id : null,
        guestEmail: req.body.email || null,
        inputData: {
          age: Number(input.age || input.Age || 30),
          gender: input.gender || input.Gender || 'Male',
          maritalStatus: input.maritalStatus || input['Marital Status'] || 'Unmarried',
          dependants: Number(input.dependants || input['Number of Dependants'] || 0),
          incomeLakhs: Number(input.incomeLakhs || input['Income in Lakhs'] || 10),
          geneticalRisk: Number(input.geneticalRisk || input['Genetical Risk'] || 0),
          insurancePlan: input.insurancePlan || input['Insurance Plan'] || 'Silver',
          employmentStatus: input.employmentStatus || input['Employment Status'] || 'Salaried',
          bmi: Number(input.bmi || 22.5),
          bmiCategory: input.bmiCategory || input['BMI Category'] || 'Normal',
          smokingStatus: input.smokingStatus || input['Smoking Status'] || 'No Smoking',
          region: input.region || input.Region || 'Northwest',
          medicalHistory: input.medicalHistory || input['Medical History'] || 'No Disease',
        },
        predictedCost: mlResult.predicted_cost,
        monthlyEstimate: mlResult.monthly_estimate,
        riskLevel: mlResult.risk_level,
        normalizedRiskScore: mlResult.normalized_risk_score,
        riskFactors: mlResult.risk_factors || [],
        savingsTips: mlResult.savings_tips || [],
        modelUsed: mlResult.model_used || 'Python ML (XGBoost/Ridge)',
      });
    } catch (dbErr) {
      console.warn('Could not save prediction to MongoDB Atlas:', dbErr.message);
    }

    return res.json({
      success: true,
      predictionId: savedRecord ? savedRecord._id : 'pred_' + Date.now(),
      data: mlResult,
      isRealML: !mlResult.model_used.includes('Fallback'),
    });
  } catch (error) {
    console.error('Prediction controller error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/predictions/history
router.get('/history', protect, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json({ success: true, count: predictions.length, predictions });
  } catch (error) {
    return res.json({ success: true, count: 0, predictions: [] });
  }
});

// GET /api/predictions/:id
router.get('/:id', async (req, res) => {
  try {
    const record = await Prediction.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }
    return res.json({ success: true, prediction: record });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
