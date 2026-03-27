import sys
import pickle
import os

# ✅ FIX: correct path for model files
base_path = os.path.dirname(__file__)

# load model
model = pickle.load(open(os.path.join(base_path, "model.pkl"), "rb"))
vectorizer = pickle.load(open(os.path.join(base_path, "vectorizer.pkl"), "rb"))

# get input
text = sys.argv[1]

# transform
X = vectorizer.transform([text])

# prediction
prob = model.predict_proba(X)[0][1]
prediction = model.predict(X)[0]

# suspicious words (basic logic)
keywords = ["lottery", "urgent", "click", "offer", "win", "free"]
found = [word for word in keywords if word in text.lower()]

# explanation
explanation = []
if "lottery" in found:
    explanation.append("Lottery scams are very common")
if "urgent" in found:
    explanation.append("Urgency is used to manipulate users")
if "click" in found:
    explanation.append("Clicking unknown links is risky")

# output JSON
import json
print(json.dumps({
    "probability": round(prob * 100, 2),
    "result": "Scam" if prediction == 1 else "Safe",
    "keywords": found,
    "explanation": explanation
}))