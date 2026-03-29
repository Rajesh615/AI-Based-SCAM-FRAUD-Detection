import sys
import joblib
import json
import os

try:
    # ✅ Get current folder (VERY IMPORTANT for Render)
    BASE_DIR = os.path.dirname(__file__)

    model_path = os.path.join(BASE_DIR, "model.pkl")
    vectorizer_path = os.path.join(BASE_DIR, "vectorizer.pkl")

    # ✅ Load model safely
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)

    # ✅ Get input text safely
    text = sys.argv[1] if len(sys.argv) > 1 else ""

    # ✅ Transform input
    X = vectorizer.transform([text])

    prob = model.predict_proba(X)[0][1]
    prediction = model.predict(X)[0]

    # ✅ Keyword detection
    keywords = ["lottery", "urgent", "click", "offer", "win", "free"]
    found = [w for w in keywords if w in text.lower()]

    # ✅ Explanation logic
    explanation = []
    if "lottery" in found:
        explanation.append("Lottery scams are very common")
    if "urgent" in found:
        explanation.append("Urgency is used to manipulate users")
    if "click" in found:
        explanation.append("Clicking unknown links is risky")

    # ✅ FINAL OUTPUT (ONLY JSON — VERY IMPORTANT)
    print(json.dumps({
        "probability": round(prob * 100, 2),
        "prediction": int(prediction),
        "keywords": found,
        "explanation": explanation
    }))

except Exception as e:
    # ❗ IMPORTANT: Always return JSON even on error
    print(json.dumps({
        "probability": 0,
        "prediction": 0,
        "keywords": [],
        "explanation": ["Model error", str(e)]
    }))