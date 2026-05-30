# Arogya Kavaj

Arogya Kavaj is a health-focused project combining a static website frontend with a machine learning-powered health insurance cost predictor. The repository provides web pages for information, insurance guidance, and prediction support alongside a Streamlit-based prediction app.

## Repository Structure

- `Frontend/`
  - Static HTML/CSS/JavaScript pages for the website
  - Contains sections such as Home, About, Blog, FAQ, Features, Insurance Guide, Plans, Contact, Testimonials, and Sign In / Sign Up

- `Health_insurance_predictor_1/`
  - Machine learning project for predicting health insurance charges
  - Contains a Streamlit app, prediction helper modules, trained model artifacts, notebooks, and a requirements file

## What this project includes

### Frontend

The `Frontend/` directory includes a collection of website pages intended for a health insurance or healthcare service platform. Key pages include:

- `Home/` — main landing page and profile page
- `About page/` — project or company information
- `Blog Page/` — blog listing page
- `Calculator page/` — BMI and related calculation pages
- `cotact page/` — contact form page
- `FAQ PAGE/` — frequently asked questions
- `FEATURE PAGE/` — feature showcase
- `INSURANCE GUIDE/` — insurance guide content
- `PLANS PAGE/` — insurance plan details and order flow
- `Privacypolice page/` — privacy policy
- `SIGN IN AND SIGN UP PAGE/` — authentication UI
- `TERM OF SERVICES/` — terms of service
- `TESTIMONAL PAGE/` — testimonials and reviews
- run the Frontend Home.html by :- http://127.0.0.1:5501/Frontend/HOME%20PAGE/Home.html

### Health Insurance Predictor

The `Health_insurance_predictor_1/` directory is a dedicated ML app that predicts health insurance costs using user input such as age, gender, BMI, dependants, income, smoking status, region, and health history.

Key files:

- `app/main.py` — Streamlit app entrypoint
- `app/prediction_helper.py` — preprocessing and model prediction logic
- `app/artifacts/` — saved model and scaler files
- `requirements.txt` — Python dependencies for the prediction app

## Getting Started

### Frontend

Open any HTML file in `Frontend/` using a browser to view the static website pages.

### Health Insurance Predictor

1. Open a terminal and navigate to the Streamlit app folder:

```bash
cd Health_insurance_predictor_1
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
streamlit run app/main.py
```

4. Open the local URL shown by Streamlit in your browser.

## Notes

- The prediction app uses pre-trained models and saved scaler artifacts located in `Health_insurance_predictor_1/app/artifacts/`.
- The frontend is self-contained and does not require a server to view, but a static host or local browser is sufficient.

## Additional Documentation

For more details on the machine learning app, see the nested README at `Health_insurance_predictor_1/README.md`.
