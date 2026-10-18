const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  guestEmail: {
    type: String,
    default: null,
  },
  inputData: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, default: 'Unmarried' },
    dependants: { type: Number, default: 0 },
    incomeLakhs: { type: Number, required: true },
    geneticalRisk: { type: Number, default: 0 },
    insurancePlan: { type: String, default: 'Silver' },
    employmentStatus: { type: String, default: 'Salaried' },
    bmi: { type: Number, default: 22.5 },
    bmiCategory: { type: String, default: 'Normal' },
    smokingStatus: { type: String, default: 'No Smoking' },
    region: { type: String, default: 'Northwest' },
    medicalHistory: { type: String, default: 'No Disease' },
  },
  predictedCost: {
    type: Number,
    required: true,
  },
  monthlyEstimate: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Moderate',
  },
  normalizedRiskScore: {
    type: Number,
    default: 0,
  },
  riskFactors: [{
    type: String,
  }],
  savingsTips: [{
    type: String,
  }],
  modelUsed: {
    type: String,
    default: 'Python ML XGBoost / Linear',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Prediction', predictionSchema);
