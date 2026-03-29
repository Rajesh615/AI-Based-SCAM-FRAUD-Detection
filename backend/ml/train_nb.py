import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

# Load dataset
data = pd.read_csv("data/scam_data.csv")

X = data["text"]
y = data["label"]

# TF-IDF
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Model
model = MultinomialNB()
model.fit(X_vec, y)

# Save
joblib.dump(model, "models/model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("✅ Model trained and saved")