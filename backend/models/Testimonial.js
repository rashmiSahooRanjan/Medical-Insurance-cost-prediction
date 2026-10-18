const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Verified Policyholder',
  },
  city: {
    type: String,
    default: 'Delhi',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  planUsed: {
    type: String,
    default: 'Silver Care Plan',
  },
  savings: {
    type: String,
    default: '₹14,200/year',
  },
  avatar: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
