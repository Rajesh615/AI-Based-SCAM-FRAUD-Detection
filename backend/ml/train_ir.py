import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load data
data = pd.read_csv("data/scam_data.csv")

# Split
X = data["text"]
y = data["label"]

# TF-IDF
vectorizer = TfidfVectorizer()
X_vec = vectorizer.fit_transform(X)

# Model
model = LogisticRegression()
model.fit(X_vec, y)

# Save
joblib.dump(model, "models/lr_model.pkl")
joblib.dump(vectorizer, "models/lr_vectorizer.pkl")

print("✅ Logistic Regression Model Saved")