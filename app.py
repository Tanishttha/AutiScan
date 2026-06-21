from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add this line


# --- Load saved model and encoders ---
try:
    with open("best_model.pkl", "rb") as f:
        model = pickle.load(f)

    with open("encoders.pkl", "rb") as f:
        encoders = pickle.load(f)
except FileNotFoundError:
    print("ERROR: Model or encoders file not found. Ensure 'best_model.pkl' and 'encoders.pkl' are in the same directory.")
    pass

# --- CRUCIAL: The Confirmed Correct Feature Order ---
# This list is based on the final column order derived from your CSV after drops.
feature_order = [
    'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score', 
    'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score', 
    'age', 
    'gender', 'ethnicity', 'jaundice', 'austim', 'contry_of_res', 
    'used_app_before', 
    'result', 
    'relation'
]

# --- Derived validation lists for perfect consistency ---
all_numeric_cols_in_order = [
    'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score', 
    'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score', 
    'age', 'result'
]

categorical_cols = [
    'gender', 'ethnicity', 'jaundice', 'austim', 'contry_of_res', 
    'used_app_before', 'relation'
]


# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Predict route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        # --- 1. Data Type Conversion & Validation for Numeric Columns ---
        for col in all_numeric_cols_in_order:
            if col not in df or pd.isna(df[col].values[0]) or df[col].values[0] == "":
                return jsonify({"error": f"Missing or empty value for {col}"}), 400
            try:
                # Convert to float
                df[col] = df[col].astype(float)
            except ValueError:
                return jsonify({"error": f"Invalid numeric input for {col}: '{df[col].values[0]}'"}), 400

        # --- 2. Categorical Encoding & Validation (with Training Replacements) ---
        for col in categorical_cols:
            raw_value = df[col].values[0]
            processed_value = raw_value
            
            if col not in df or pd.isna(raw_value) or raw_value == "":
                return jsonify({"error": f"Missing or empty value for {col}"}), 400
            
            # --- Apply Training Script Replacements (CRITICAL) ---
            if col == 'ethnicity':
                if raw_value == '?' or raw_value == 'others': 
                    processed_value = 'Others'
            
            if col == 'relation':
                # Simplified replacement to catch all non-'Self' entries mapped to 'Others' in training
                if raw_value in ['?', 'Relative', 'Parent', 'Health care professional']: 
                    processed_value = 'Others' 
            
            if col == 'contry_of_res':
                if raw_value == 'Viet Nam': processed_value = 'Vietnam'
                elif raw_value == 'AmericanSamoa': processed_value = 'United States'
                elif raw_value == 'Hong Kong': processed_value = 'China'
            
            # Check if the processed value is in the encoder's known classes
            if processed_value not in encoders[col].classes_:
                return jsonify({"error": f"Input value '{raw_value}' for {col} is invalid or wasn't trained on. Must be one of {list(encoders[col].classes_)}"}), 400

            # Apply the transform
            # The transform method for LabelEncoder expects a 1D array/list, hence [processed_value] and [0].
            df[col] = encoders[col].transform([processed_value])[0] 

        # --- 3. Feature Ordering (The Guarantee) ---
        
        # This step GUARANTEES the columns are present and in the exact order 
        # specified by feature_order.
        df_final = df.reindex(columns=feature_order)

        # --- 4. Prediction ---
        pred = model.predict(df_final)[0]
        
        result = "ASD Positive" if pred == 1 else "ASD Negative"
        return jsonify({"prediction": result})

    except Exception as e:
        # Print detailed error to the terminal
        print(f"Predict Error: {e}")
        # Return a generic 500 error to the user with the detail
        return jsonify({"error": f"An internal server error occurred. Detail: {str(e)}"}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
