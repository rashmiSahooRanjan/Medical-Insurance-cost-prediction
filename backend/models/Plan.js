const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    required: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  annualPrice: {
    type: Number,
    required: true,
  },
  coverageAmount: {
    type: String,
    required: true,
  },
  coverageAmountValue: {
    type: Number,
    default: 500000,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  features: [{
    type: String,
  }],
  networkHospitals: {
    type: Number,
    default: 8500,
  },
  cashlessHospitalization: {
    type: Boolean,
    default: true,
  },
  waitingPeriod: {
    type: String,
    default: '30 Days for general, 2 Years for pre-existing',
  },
  coPayPercentage: {
    type: Number,
    default: 10,
  },
  maternityCover: {
    type: Boolean,
    default: false,
  },
  annualHealthCheckup: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);
