print("🔥 MODEL LOADED")
import sys
import joblib
import json

# Load model ONCE
model = joblib.load("models/model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

text = sys.argv[1]

X = vectorizer.transform([text])

prob = model.predict_proba(X)[0][1]
prediction = model.predict(X)[0]

keywords = ["lottery", "urgent", "click", "offer", "win", "free"]
found = [w for w in keywords if w in text.lower()]

explanation = []
if "lottery" in found:
    explanation.append("Lottery scams are very common")
if "urgent" in found:
    explanation.append("Urgency is used to manipulate users")
if "click" in found:
    explanation.append("Clicking unknown links is risky")

print(json.dumps({
    "probability": round(prob * 100, 2),
    "prediction": int(prediction),
    "keywords": found,
    "explanation": explanation
}))