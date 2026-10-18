# 🛡️ आरोग्य कवच (Arogya Kavaj) - HealthInsure Pro
### Full-Stack AI Medical Insurance Cost Prediction & Health Management Platform

Arogya Kavaj is a full-stack, enterprise-grade healthcare insurance platform combining modern web design, **React.js (Vite)**, **Node.js & Express**, **MongoDB Atlas**, and a **Python 3.10 Machine Learning microservice** (`scikit-learn` & `xgboost`).

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React.js (Vite) Frontend                    │
│      Responsive on Android, iPhone (iOS), and Desktop       │
│                http://localhost:5173                        │
└──────────────────────────────┬──────────────────────────────┘
                               │  REST API Calls (/api)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js + Express.js Backend                │
│                     http://localhost:5000                   │
│   • JWT Authentication       • Policy Subscriptions         │
│   • Prediction Management    • Contact & Review APIs        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
       MongoDB │                              │ HTTP /predict
       Mongoose│                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MongoDB Atlas Cloud     │ │  Python 3.10 ML Service    │
│  • Users & Auth Data         │ │    http://localhost:5001   │
│  • Insurance Plans           │ │  • XGBoost Regressor       │
│  • Policy Subscriptions      │ │  • Scaled Linear Model     │
│  • Prediction History Log    │ │  • Artifacts Scalers       │
│  • Inquiries & Reviews       │ │  • Actuarial Risk Engine   │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## ✨ Key Features

1. **AI Cost Predictor**:
   - Calculates personalized annual and monthly health insurance premiums using pre-trained machine learning models (`model_young.joblib` and `model_rest.joblib`).
   - Supports 12 actuarial input parameters: Age, Dependants, Income (in Lakhs), Genetical Risk, Insurance Tier (Bronze, Silver, Gold), Employment Status, Gender, Marital Status, BMI Category, Smoking Habit, Region, and Medical History (Diabetes, Hypertension, Heart Disease, Thyroid).
   - Generates normalized risk scores, identified risk factors, and proactive savings recommendations.

2. **Interactive BMI Health Calculator**:
   - Metric (cm/kg) and Imperial (ft/lbs) dual mode.
   - Real-time BMI category computation (Underweight, Normal, Overweight, Obese) with one-click transfer to the AI Cost Predictor.

3. **IRDAI-Approved Insurance Plans Comparison**:
   - **Arogya Bronze Essential** (₹5 Lakhs cover)
   - **Arogya Silver Smart** (₹15 Lakhs cover - Most Popular)
   - **Arogya Gold Elite 360°** (₹50 Lakhs comprehensive worldwide cover)
   - Feature comparison matrix, waiting periods, room rent terms, and cashless network hospitals count.

4. **Policy Activation & Cashless Dashboard ("My Policies")**:
   - Instant digital policy issuance with official policy certificates (`AK-2026-XXXX`).
   - 24x7 cashless hospital admission request filing module.

5. **Customer Reviews & Testimonials**:
   - Verified policyholder reviews stored in MongoDB Atlas with interactive rating submissions.

6. **Full Cross-Device Mobile Responsiveness**:
   - Native mobile bottom dock navigation bar for Android and iPhone (iOS).
   - Touch-optimized sliders, responsive grid layouts, and slide-in drawer menus.
   - Dark / Light luxury healthcare theme toggle.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (v22 installed)
- **Python**: 3.10 (tested and verified with Python 3.10.8)
- **MongoDB Atlas** account (or local MongoDB)

---

### Option 1: One-Click Launch (Recommended)

Run the Python 3.10 orchestration script from the project root:

```bash
# Using Python 3.10
py -3.10 run_all.py
```

*Or on Windows, simply double-click:*
```text
start_all.bat
```

*Or with npm:*
```bash
npm run dev
```

This starts:
1. 🤖 **Python 3.10 ML Service** on `http://localhost:5001`
2. 🚀 **Node.js Express Backend** on `http://localhost:5000`
3. 💻 **React Vite Frontend** on `http://localhost:5173`

---

### Option 2: Running Services Individually

#### 1. Machine Learning Microservice (Python 3.10)
```bash
cd ml_service
py -3.10 server.py
# Runs on http://localhost:5001
```

#### 2. Node.js Express Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

#### 3. React.js Vite Frontend
```bash
cd client
npm install
npm run dev
# Opens on http://localhost:5173
```

---

## 🌐 Deploying to Render (render.com)

You can deploy this full-stack application to **Render** using either:

### Method A: One-Click Render Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Blueprint**.
3. Connect your GitHub repository: `rashmiSahooRanjan/Medical-Insurance-cost-prediction`.
4. Render automatically reads [render.yaml](render.yaml) and creates:
   - `arogya-ml-service` (Python 3.10 microservice)
   - `arogya-kavaj-web` (Full-Stack Node.js + React web application)
5. Set `MONGODB_URI` with your MongoDB Atlas connection string when prompted.
6. Click **Apply**! Render will build and deploy the complete stack.

### Method B: Deploy as a Unified Web Service
1. In Render, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `rashmiSahooRanjan/Medical-Insurance-cost-prediction`.
3. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *Any strong secret string*
   - `ML_SERVICE_URL`: *URL of your deployed Python ML service (or leaves fallback active)*
5. Click **Deploy Web Service**.

---

## 🗄️ MongoDB Atlas Setup

1. Open [MongoDB Atlas Cloud Console](https://www.mongodb.com/atlas/database).
2. Create a free M0 cluster and copy your connection string.
3. Open `backend/.env` and paste your URI:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/arogya_kavaj?retryWrites=true&w=majority
   ```
4. Seed the initial insurance plans and verified reviews:
   ```bash
   cd backend
   npm run seed
   ```

---

## 👤 Demo Credentials

For quick testing without creating a new account:
- **Email**: `demo@arogyakavaj.com`
- **Password**: `demo123`
- *Or click the "Quick Login" button on the sign-in modal!*

---

## 📁 Repository Directory Structure

```text
Medical-Insurance-cost-prediction/
├── client/                     # React.js (Vite) Frontend Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AuthModal
│   │   ├── context/            # AuthContext (JWT & Profile State)
│   │   ├── views/              # HomeView, PredictorView, BmiView, PlansView, ActivePlansView, etc.
│   │   ├── App.jsx             # Main routing and layout
│   │   ├── App.css             # Responsive styling for iOS, Android, Desktop
│   │   └── index.css           # Design tokens, variables, and animations
│   ├── index.html              # HTML shell with Google fonts & mobile meta tags
│   └── vite.config.js          # Vite config with backend proxy setup
│
├── backend/                    # Node.js & Express.js REST API
│   ├── config/db.js            # MongoDB Atlas connection handler
│   ├── middleware/auth.js      # JWT authentication middleware
│   ├── models/                 # Mongoose Schemas (User, Prediction, Plan, PolicySubscription, etc.)
│   ├── routes/                 # Express route handlers
│   ├── seed.js                 # Database seeder for plans & reviews
│   ├── server.js               # Express application entrypoint
│   └── .env                    # Environment configuration
│
├── ml_service/                 # Python 3.10 Machine Learning Microservice
│   ├── artifacts/              # Pre-trained models and scaler joblib files
│   ├── predictor.py            # Preprocessing & inference logic
│   ├── server.py               # Flask REST API exposing /predict
│   └── requirements.txt        # Python 3.10 dependencies
│
├── run_all.py                  # Python 3.10 process orchestrator
├── start_all.bat               # Windows 1-click batch launcher
├── package.json                # Root package with concurrently dev scripts
└── README.md                   # Complete documentation
```

---

## 🛡️ License
MIT License. Developed for Arogya Kavaj Medical Insurance Cost Prediction.
