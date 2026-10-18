const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/Plan');
const Testimonial = require('./models/Testimonial');

dotenv.config();

const samplePlans = [
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

const sampleReviews = [
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
    role: 'Senior Physician',
    city: 'Ahmedabad',
    rating: 5,
    comment: 'As a doctor, I recommend Arogya Kavaj. The transparency in cashless hospital networks and accurate cost estimation based on medical history is unparalleled.',
    planUsed: 'Gold Elite 360°',
    savings: '₹35,000/year',
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Please define MONGODB_URI in your .env file before running seed script.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    await Plan.deleteMany();
    await Plan.insertMany(samplePlans);
    console.log('✅ Seeded Insurance Plans successfully.');

    await Testimonial.deleteMany();
    await Testimonial.insertMany(sampleReviews);
    console.log('✅ Seeded Testimonials successfully.');

    console.log('🎉 MongoDB Atlas Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
