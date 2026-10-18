const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

const initialReviews = [
  {
    name: 'Priya Sharma',
    role: 'Software Architect',
    city: 'Bengaluru',
    rating: 5,
    comment: 'The AI cost predictor was accurate down to 98% of the final quote! Arogya Kavaj made comparing plans and getting instant cashless approvals super seamless.',
    planUsed: 'Silver Smart Plan',
    savings: '₹14,500/year',
  },
  {
    name: 'Vikram Mehta',
    role: 'Financial Consultant',
    city: 'Mumbai',
    rating: 5,
    comment: 'Best medical insurance platform in India. The ML risk breakdown helped me understand why my diabetes history was affecting premiums, and how to optimize my deductible.',
    planUsed: 'Gold Elite 360°',
    savings: '₹22,000/year',
  },
  {
    name: 'Ananya Verma',
    role: 'Digital Marketer',
    city: 'Delhi NCR',
    rating: 5,
    comment: 'Mobile friendly, ultra-fast prediction, and very intuitive UI! Got my family policy active within 5 minutes without any tedious paper forms.',
    planUsed: 'Bronze Essential',
    savings: '₹8,900/year',
  },
  {
    name: 'Dr. Rajesh Patel',
    role: 'Physician',
    city: 'Ahmedabad',
    rating: 5,
    comment: 'As a doctor, I recommend Arogya Kavaj. The transparency in cashless hospital networks and accurate cost estimation based on medical history is unparalleled.',
    planUsed: 'Gold Elite 360°',
    savings: '₹35,000/year',
  },
];

let mockReviews = [...initialReviews];

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    let reviews = await Testimonial.find().sort({ createdAt: -1 });
    if (!reviews || reviews.length === 0) {
      reviews = mockReviews;
    }
    return res.json({ success: true, count: reviews.length, testimonials: reviews });
  } catch (error) {
    return res.json({ success: true, count: mockReviews.length, testimonials: mockReviews });
  }
});

// POST /api/testimonials
router.post('/', async (req, res) => {
  try {
    const { name, role, city, rating, comment, planUsed, savings } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ success: false, message: 'Name and comment are required' });
    }

    const newRev = {
      name,
      role: role || 'Verified Customer',
      city: city || 'India',
      rating: Number(rating) || 5,
      comment,
      planUsed: planUsed || 'Arogya Health Plan',
      savings: savings || '₹10,000/year',
      verified: true,
      createdAt: new Date(),
    };

    try {
      const created = await Testimonial.create(newRev);
      return res.status(201).json({ success: true, testimonial: created });
    } catch (dbErr) {
      mockReviews.unshift(newRev);
      return res.status(201).json({ success: true, testimonial: newRev });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
