from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")  # ✅ FIX

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    message = data.get("message", "")

    message_vec = vectorizer.transform([message])  # ✅ FIX

    prediction = model.predict(message_vec)[0]
    proba = model.predict_proba(message_vec)[0]

    confidence = max(proba) * 100

    return jsonify({
        "result": "Scam" if prediction == 1 else "Safe",
        "confidence": f"{confidence:.2f}%"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)