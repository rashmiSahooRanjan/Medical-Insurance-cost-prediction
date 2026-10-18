from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

from predictor import predict_insurance

app = Flask(__name__)
# Enable CORS for all routes so Node.js backend and React client can easily communicate
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Arogya Kavaj Machine Learning Microservice",
        "python_version": sys.version,
        "models_loaded": True
    }), 200

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"error": "No input payload provided"}), 400

        result = predict_insurance(data)
        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting ML Prediction Service on port {port} (Python {sys.version.split()[0]})...")
    app.run(host="0.0.0.0", port=port, debug=False)
