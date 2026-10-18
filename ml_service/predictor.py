from pathlib import Path
import pandas as pd
import joblib
import os
import sys

BASE_DIR = Path(__file__).resolve().parent

# Look in local artifacts first, then in the original app directory
possible_artifact_dirs = [
    BASE_DIR / "artifacts",
    BASE_DIR.parent / "Health_insurance_predictor_1" / "app" / "artifacts"
]

ARTIFACTS_DIR = None
for ad in possible_artifact_dirs:
    if ad.exists() and (ad / "model_young.joblib").exists():
        ARTIFACTS_DIR = ad
        break

if not ARTIFACTS_DIR:
    raise FileNotFoundError(f"Model artifacts directory could not be located in {possible_artifact_dirs}")

print(f"Loading ML models from: {ARTIFACTS_DIR}")

# Load models and scalers
model_young = joblib.load(ARTIFACTS_DIR / "model_young.joblib")
model_rest = joblib.load(ARTIFACTS_DIR / "model_rest.joblib")
scaler_young = joblib.load(ARTIFACTS_DIR / "scaler_young.joblib")
scaler_rest = joblib.load(ARTIFACTS_DIR / "scaler_rest.joblib")

def calculate_normalized_risk(medical_history):
    risk_scores = {
        "diabetes": 6,
        "heart disease": 8,
        "high blood pressure": 6,
        "thyroid": 5,
        "no disease": 0,
        "none": 0
    }
    # Split the medical history into potential parts and convert to lowercase
    diseases = str(medical_history).lower().split(" & ")
    total_risk_score = sum(risk_scores.get(disease.strip(), 0) for disease in diseases)

    max_score = 14  # heart disease (8) + (diabetes or high blood pressure) (6)
    min_score = 0
    normalized_risk_score = (total_risk_score - min_score) / (max_score - min_score)
    return min(max(normalized_risk_score, 0.0), 1.0)

def preprocess_input(input_dict):
    expected_columns = [
        'age', 'number_of_dependants', 'income_lakhs', 'insurance_plan', 'genetical_risk', 'normalized_risk_score',
        'gender_Male', 'region_Northwest', 'region_Southeast', 'region_Southwest', 'marital_status_Unmarried',
        'bmi_category_Obesity', 'bmi_category_Overweight', 'bmi_category_Underweight', 'smoking_status_Occasional',
        'smoking_status_Regular', 'employment_status_Salaried', 'employment_status_Self-Employed'
    ]

    df = pd.DataFrame(0, columns=expected_columns, index=[0])

    # Flexible case & alternative input keys
    raw_gender = str(input_dict.get('Gender') or input_dict.get('gender') or 'Male').strip().capitalize()
    raw_region = str(input_dict.get('Region') or input_dict.get('region') or 'Northwest').strip().lower()
    raw_marital = str(input_dict.get('Marital Status') or input_dict.get('marital_status') or input_dict.get('maritalStatus') or 'Unmarried').strip().lower()
    raw_bmi_cat = str(input_dict.get('BMI Category') or input_dict.get('bmi_category') or input_dict.get('bmiCategory') or 'Normal').strip().lower()
    raw_smoking = str(input_dict.get('Smoking Status') or input_dict.get('smoking_status') or input_dict.get('smokingStatus') or 'No Smoking').strip().lower()
    raw_employment = str(input_dict.get('Employment Status') or input_dict.get('employment_status') or input_dict.get('employmentStatus') or 'Salaried').strip().lower()
    raw_plan = str(input_dict.get('Insurance Plan') or input_dict.get('insurance_plan') or input_dict.get('insurancePlan') or 'Silver').strip().lower()

    raw_age = float(input_dict.get('Age') or input_dict.get('age') or 30)
    raw_dependants = int(input_dict.get('Number of Dependants') or input_dict.get('number_of_dependants') or input_dict.get('dependants') or 0)
    raw_income = float(input_dict.get('Income in Lakhs') or input_dict.get('income_lakhs') or input_dict.get('incomeLakhs') or 10)
    raw_genetical = int(input_dict.get('Genetical Risk') or input_dict.get('genetical_risk') or input_dict.get('geneticalRisk') or 0)
    raw_medical = input_dict.get('Medical History') or input_dict.get('medical_history') or input_dict.get('medicalHistory') or 'No Disease'

    # Gender
    if raw_gender == 'Male':
        df['gender_Male'] = 1

    # Region
    if 'northwest' in raw_region or raw_region in ['north', 'west']:
        df['region_Northwest'] = 1
    elif 'southeast' in raw_region or raw_region in ['east']:
        df['region_Southeast'] = 1
    elif 'southwest' in raw_region or raw_region in ['south']:
        df['region_Southwest'] = 1

    # Marital Status
    if raw_marital in ['unmarried', 'single']:
        df['marital_status_Unmarried'] = 1

    # BMI Category
    if 'obesity' in raw_bmi_cat or 'obese' in raw_bmi_cat:
        df['bmi_category_Obesity'] = 1
    elif 'overweight' in raw_bmi_cat:
        df['bmi_category_Overweight'] = 1
    elif 'underweight' in raw_bmi_cat:
        df['bmi_category_Underweight'] = 1

    # Smoking Status
    if 'regular' in raw_smoking or raw_smoking in ['yes', 'true']:
        df['smoking_status_Regular'] = 1
    elif 'occasional' in raw_smoking:
        df['smoking_status_Occasional'] = 1

    # Employment Status
    if 'salaried' in raw_employment:
        df['employment_status_Salaried'] = 1
    elif 'self' in raw_employment or 'business' in raw_employment:
        df['employment_status_Self-Employed'] = 1

    # Insurance Plan
    if 'gold' in raw_plan or 'premium' in raw_plan:
        plan_code = 3
    elif 'bronze' in raw_plan or 'basic' in raw_plan or 'base' in raw_plan:
        plan_code = 1
    else:
        plan_code = 2

    df['insurance_plan'] = plan_code
    df['age'] = raw_age
    df['number_of_dependants'] = raw_dependants
    df['income_lakhs'] = raw_income
    df['genetical_risk'] = raw_genetical
    df['normalized_risk_score'] = calculate_normalized_risk(raw_medical)

    df = handle_scaling(raw_age, df)
    return df

def handle_scaling(age, df):
    if age <= 25:
        scaler_object = scaler_young
    else:
        scaler_object = scaler_rest

    cols_to_scale = scaler_object['cols_to_scale']
    scaler = scaler_object['scaler']

    df['income_level'] = None
    df[cols_to_scale] = scaler.transform(df[cols_to_scale])
    df.drop('income_level', axis='columns', inplace=True)
    return df

def predict_insurance(input_dict):
    age = float(input_dict.get('Age') or input_dict.get('age') or 30)
    input_df = preprocess_input(input_dict)

    # Execute ML Inference
    if age <= 25:
        prediction = model_young.predict(input_df)
        model_name = "model_young.joblib (Age <= 25)"
        algorithm = "Linear Regression / Ridge Regressor"
    else:
        prediction = model_rest.predict(input_df)
        model_name = "model_rest.joblib (Age > 25)"
        algorithm = "XGBoost Gradient Boosted Trees Regressor"

    base_ml_annual = int(round(prediction[0]))
    if base_ml_annual < 2500:
        base_ml_annual = 2500

    # Coverage scaling based on sum insured and policy term
    raw_sum_insured = float(input_dict.get('sumInsured') or input_dict.get('sum_insured') or 500000)
    raw_term = int(input_dict.get('policyTerm') or input_dict.get('policy_term') or 2)

    # Multi-year term discount
    term_discounts = {1: 0.00, 2: 0.05, 3: 0.10, 4: 0.12, 5: 0.15}
    discount_pct = term_discounts.get(raw_term, 0.05)

    # Scale mildly with sum insured (benchmark is 5 Lakhs = 1.0)
    coverage_multiplier = 1.0 + ((raw_sum_insured - 500000) / 500000) * 0.25
    coverage_multiplier = max(0.75, min(coverage_multiplier, 2.5))

    adjusted_annual = round(base_ml_annual * coverage_multiplier * (1.0 - discount_pct))
    adjusted_annual = max(2500, adjusted_annual)

    # Medical Risk calculation
    raw_med = input_dict.get('Medical History') or input_dict.get('medical_history') or input_dict.get('medicalHistory') or 'No Disease'
    norm_risk = calculate_normalized_risk(raw_med)
    smoking_val = str(input_dict.get('Smoking Status') or input_dict.get('smoking_status') or input_dict.get('smokingStatus') or 'No Smoking').lower()
    bmi_val = str(input_dict.get('BMI Category') or input_dict.get('bmi_category') or input_dict.get('bmiCategory') or 'Normal').lower()
    genetical = int(input_dict.get('Genetical Risk') or input_dict.get('genetical_risk') or input_dict.get('geneticalRisk') or 0)

    # Breakdown components (proportional to total cost)
    # 1. Base Premium (core demographic risk)
    base_share = 0.52
    base_comp = round(adjusted_annual * base_share)

    # 2. Age Factor Loading
    age_ratio = min(max((age - 18) / 60.0, 0.05), 0.40)
    age_comp = round(adjusted_annual * (0.12 + age_ratio * 0.10))

    # 3. Health Risk Factor (Smoking + BMI + Medical Risk + Genetical)
    health_ratio = (norm_risk * 0.5) + (0.3 if 'regular' in smoking_val or 'yes' in smoking_val else (0.15 if 'occasional' in smoking_val else 0.0)) + (0.15 if 'obese' in bmi_val or 'obesity' in bmi_val else 0.0)
    health_comp = round(adjusted_annual * min(0.35, max(0.08, health_ratio * 0.28)))

    # 4. Region Factor
    region_comp = round(adjusted_annual * 0.06)

    # 5. GST (18%)
    gst_comp = round(adjusted_annual * 0.18)

    risk_factors = []
    savings_tips = []

    if 'regular' in smoking_val or smoking_val in ['yes', 'true']:
        risk_factors.append("Active tobacco smoking habit: significantly elevates actuarial pulmonary & cardiac risk profile")
        savings_tips.append("Smoking cessation programs can reduce your renewal premium by up to 25%")
    elif 'occasional' in smoking_val:
        risk_factors.append("Occasional tobacco usage: moderate respiratory loading factor applied")
        savings_tips.append("Complete tobacco cessation qualifies for preferred non-smoker renewal discounts")

    if 'obesity' in bmi_val or 'obese' in bmi_val:
        risk_factors.append("Obese BMI classification: increases cardiovascular & metabolic loading")
        savings_tips.append("Enrolling in verified wellness & BMI reduction programs can lower renewal costs by up to 15%")
    elif 'overweight' in bmi_val:
        risk_factors.append("Overweight BMI classification: moderate metabolic loading applied")

    if norm_risk > 0.4:
        risk_factors.append(f"Pre-existing medical conditions identified (Normalized Health Risk: {round(norm_risk, 2)}/1.0)")
        savings_tips.append("Annual preventive health checkups and chronic illness management maintain optimal rates")

    if genetical >= 3:
        risk_factors.append(f"Hereditary / Genetical risk index ({genetical}/5): higher family predisposition")
        savings_tips.append("Add-on critical illness riders give comprehensive financial security against family health risks")

    if not risk_factors:
        risk_factors.append("Low risk baseline profile: no adverse clinical indicators detected")
        savings_tips.append("You qualify for optimal preferred pricing tier under Arogya Kavaj")

    if raw_term < 3:
        savings_tips.append("Selecting a 3-5 year multi-year policy term unlocks an extra 10% to 15% guaranteed discount")

    # Risk Level classification
    if norm_risk > 0.5 or 'regular' in smoking_val or smoking_val in ['yes', 'true'] or ('obese' in bmi_val and norm_risk > 0.2):
        risk_level = "High"
    elif norm_risk > 0.2 or 'occasional' in smoking_val or 'overweight' in bmi_val or 'obese' in bmi_val:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    monthly_estimate = int(round(adjusted_annual / 12))

    return {
        "predicted_cost": adjusted_annual,
        "base_ml_annual": base_ml_annual,
        "monthly_estimate": monthly_estimate,
        "risk_level": risk_level,
        "normalized_risk_score": round(norm_risk, 3),
        "breakdown": {
            "base": base_comp,
            "age": age_comp,
            "health": health_comp,
            "region": region_comp,
            "gst": gst_comp
        },
        "risk_factors": risk_factors,
        "savings_tips": savings_tips,
        "model_used": model_name,
        "algorithm": algorithm,
        "discount_percent": int(discount_pct * 100),
        "coverage_amount": int(raw_sum_insured),
        "policy_term_years": raw_term
    }

