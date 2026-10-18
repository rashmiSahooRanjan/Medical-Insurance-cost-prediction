const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const PolicySubscription = require('../models/PolicySubscription');
const { protect, optionalProtect } = require('../middleware/auth');

// Default initial plans matching Arogya Kavaj tiers
const defaultPlans = [
  {
    planId: 'plan_bronze_essential',
    title: 'Arogya Bronze Essential',
    tier: 'Bronze',
    tagline: 'Basic comprehensive protection for young adults and singles',
    annualPrice: 5999,
    coverageAmount: '₹5 Lakhs',
    coverageAmountValue: 500000,
    popular: false,
    networkHospitals: 7500,
    cashlessHospitalization: true,
    waitingPeriod: '30 Days general, 2 Years pre-existing',
    coPayPercentage: 15,
    maternityCover: false,
    annualHealthCheckup: true,
    features: [
      '₹5 Lakhs In-Patient Hospitalization',
      '7,500+ Cashless Network Hospitals',
      'Free Annual Health Checkup (1 Person)',
      'Pre & Post Hospitalization (30/60 Days)',
      'No Claim Bonus up to 50%',
      'Ambulance Cover up to ₹2,500',
    ],
  },
  {
    planId: 'plan_silver_smart',
    title: 'Arogya Silver Smart',
    tier: 'Silver',
    tagline: 'Our most popular comprehensive family and individual care cover',
    annualPrice: 11999,
    coverageAmount: '₹15 Lakhs',
    coverageAmountValue: 1500000,
    popular: true,
    networkHospitals: 11200,
    cashlessHospitalization: true,
    waitingPeriod: '30 Days general, 1 Year pre-existing',
    coPayPercentage: 10,
    maternityCover: true,
    annualHealthCheckup: true,
    features: [
      '₹15 Lakhs High Sum Insured',
      '11,200+ Pan-India Cashless Hospitals',
      'Zero Room Rent Capping',
      'Pre & Post Hospitalization (60/90 Days)',
      'Day Care Treatments Covered (500+ Procedures)',
      '100% Restore Benefit on Exhaustion',
      'Full Maternity & Newborn Cover up to ₹50,000',
      'Free Doctor Teleconsultations (Unlimited)',
    ],
  },
  {
    planId: 'plan_gold_elite',
    title: 'Arogya Gold Elite 360°',
    tier: 'Gold',
    tagline: 'Premium top-tier global medical security with zero compromises',
    annualPrice: 24999,
    coverageAmount: '₹50 Lakhs',
    coverageAmountValue: 5000000,
    popular: false,
    networkHospitals: 15000,
    cashlessHospitalization: true,
    waitingPeriod: 'Zero waiting period for specific ailments',
    coPayPercentage: 0,
    maternityCover: true,
    annualHealthCheckup: true,
    features: [
      '₹50 Lakhs Worldwide Emergency Coverage',
      '15,000+ Top Tier Cashless Hospitals',
      '0% Co-Payment on all claims',
      'Unlimited Free Restoration of Sum Insured',
      'Global Second Medical Opinion',
      'Air Ambulance Cover up to ₹5 Lakhs',
      'Comprehensive Critical Illness lumpsum payout',
      'Dental & Optical OPD Care add-on included',
    ],
  },
];

// In-memory mock store for policies when MongoDB Atlas is disconnected
const mockSubscriptions = [];

// GET /api/plans
router.get('/', async (req, res) => {
  try {
    let plans = await Plan.find();
    if (!plans || plans.length === 0) {
      plans = defaultPlans;
    }
    return res.json({ success: true, count: plans.length, plans });
  } catch (error) {
    return res.json({ success: true, count: defaultPlans.length, plans: defaultPlans });
  }
});

// GET /api/plans/:id
router.get('/:id', async (req, res) => {
  try {
    let plan = await Plan.findOne({ planId: req.params.id });
    if (!plan) {
      plan = defaultPlans.find((p) => p.planId === req.params.id || p.tier.toLowerCase() === req.params.id.toLowerCase());
    }
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    return res.json({ success: true, plan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/plans/subscribe
router.post('/subscribe', optionalProtect, async (req, res) => {
  try {
    const { planId, tier, planTitle, sumInsured, premiumPaid, insuredMembers, paymentMethod } = req.body;
    const policyNum = 'AK-2026-' + Math.floor(100000 + Math.random() * 900000);
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(startDate.getFullYear() + 1);

    const subscriptionData = {
      user: req.user ? req.user._id : null,
      planTitle: planTitle || `${tier} Plan`,
      tier: tier || 'Silver',
      policyNumber: policyNum,
      sumInsured: sumInsured || '₹15 Lakhs',
      premiumPaid: Number(premiumPaid) || 11999,
      insuredMembers: insuredMembers || [{ name: req.user ? req.user.name : 'Policyholder', relation: 'Self', age: req.user ? req.user.age : 30, gender: req.user ? req.user.gender : 'Male' }],
      startDate,
      expiryDate,
      status: 'Active',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Online / Card',
    };

    try {
      const created = await PolicySubscription.create(subscriptionData);
      return res.status(201).json({ success: true, policy: created });
    } catch (dbErr) {
      console.warn('Saving subscription in mock memory mode:', dbErr.message);
      const mockSub = { _id: 'sub_' + Date.now(), ...subscriptionData };
      mockSubscriptions.push(mockSub);
      return res.status(201).json({ success: true, policy: mockSub });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/plans/user/my-policies
router.get('/user/my-policies', protect, async (req, res) => {
  try {
    const policies = await PolicySubscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (policies.length === 0) {
      const userMock = mockSubscriptions.filter((s) => String(s.user) === String(req.user._id));
      return res.json({ success: true, count: userMock.length, policies: userMock });
    }
    return res.json({ success: true, count: policies.length, policies });
  } catch (err) {
    const userMock = mockSubscriptions.filter((s) => String(s.user) === String(req.user._id));
    return res.json({ success: true, count: userMock.length, policies: userMock });
  }
});

module.exports = router;
