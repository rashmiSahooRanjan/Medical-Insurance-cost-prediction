const express = require('express');
const router = express.Router();

// POST /api/calculator/bmi
router.post('/bmi', (req, res) => {
  try {
    let { height, weight, unit } = req.body; // height in cm or inches, weight in kg or lbs
    height = Number(height);
    weight = Number(weight);

    if (!height || !weight || height <= 0 || weight <= 0) {
      return res.status(400).json({ success: false, message: 'Valid height and weight are required' });
    }

    let heightInMeters;
    let weightInKg;

    if (unit === 'imperial') {
      // height in inches, weight in lbs
      heightInMeters = height * 0.0254;
      weightInKg = weight * 0.453592;
    } else {
      // metric: cm and kg
      heightInMeters = height / 100;
      weightInKg = weight;
    }

    const bmi = Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));

    let category = 'Normal';
    let riskFactor = 'Optimal';
    let color = '#10B981'; // emerald
    let advice = 'Your BMI is within the healthy zone. This keeps your insurance premium at baseline!';

    if (bmi < 18.5) {
      category = 'Underweight';
      riskFactor = 'Mild Risk';
      color = '#3B82F6'; // blue
      advice = 'Underweight status may require basic nutrition counseling. Premiums are generally standard.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal';
      riskFactor = 'Low Risk';
      color = '#10B981';
      advice = 'Excellent! You qualify for the lowest premium multiplier tier in Arogya Kavaj.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      riskFactor = 'Moderate Risk';
      color = '#F59E0B'; // amber
      advice = 'Overweight status may slightly elevate cardiovascular premium multipliers by ~10-15%.';
    } else {
      category = 'Obesity';
      riskFactor = 'Elevated Risk';
      color = '#EF4444'; // red
      advice = 'Obesity is factored as a pre-disposing condition. Participating in wellness tracking can earn policy discounts.';
    }

    const minHealthyKg = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxHealthyKg = (24.9 * heightInMeters * heightInMeters).toFixed(1);

    return res.json({
      success: true,
      data: {
        bmi,
        category,
        riskFactor,
        color,
        advice,
        healthyWeightRange: `${minHealthyKg} kg - ${maxHealthyKg} kg`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
