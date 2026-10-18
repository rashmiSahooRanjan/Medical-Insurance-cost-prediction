const mongoose = require('mongoose');

const policySubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  planTitle: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    required: true,
  },
  policyNumber: {
    type: String,
    required: true,
    unique: true,
  },
  sumInsured: {
    type: String,
    required: true,
  },
  premiumPaid: {
    type: Number,
    required: true,
  },
  insuredMembers: [{
    name: String,
    relation: String,
    age: Number,
    gender: String,
  }],
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Verification', 'Expired', 'Claimed'],
    default: 'Active',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Paid',
  },
  paymentMethod: {
    type: String,
    default: 'UPI / NetBanking',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PolicySubscription', policySubscriptionSchema);
