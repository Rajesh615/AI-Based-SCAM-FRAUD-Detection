import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# Sample dataset (you can expand later)
data = {
    "text": [
        "You won a lottery click here",
        "Urgent account verification needed",
        "Free money offer now",
        "Hello how are you",
        "Let's meet tomorrow",
        "Project meeting at 5pm"
    ],
    "label": [1, 1, 1, 0, 0, 0]  # 1 = Scam, 0 = Safe
}

df = pd.DataFrame(data)

# Convert text → numbers
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])

y = df["label"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Save model + vectorizer
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("✅ Model trained and saved")