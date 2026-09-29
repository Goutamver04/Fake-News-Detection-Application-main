# ==========================================
# AI Powered Fake News Detection
# Single Python Script
# ==========================================

import os
import re
import string
import nltk
import requests
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from nltk.corpus import stopwords

from sklearn.utils import shuffle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
)

try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers
    HAS_TF = True
except Exception:
    HAS_TF = False


# ====================================================
# Download NLTK Resources
# ====================================================
nltk.download("stopwords", quiet=True)


# ====================================================
# News API Dataset Generator (Fallback if CSV missing)
# ====================================================

FAKE_PATH = "Fake.csv"
TRUE_PATH = "True.csv"

NEWS_API_KEY = "a342961efa4e4c80898b2c80ac4b0586"

def ensure_datasets():
    if not os.path.exists(FAKE_PATH) or not os.path.exists(TRUE_PATH):
        print("[News API] Generating Fake.csv and True.csv from News API key a342961efa4e...")
        true_articles = []
        try:
            url = f"https://newsapi.org/v2/top-headlines?apiKey={NEWS_API_KEY}&language=en&pageSize=50"
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                arts = resp.json().get('articles', [])
                for a in arts:
                    t = f"{a.get('title', '')} {a.get('description', '')}".strip()
                    if len(t) > 15:
                        true_articles.append({'title': a.get('title', ''), 'text': t, 'subject': 'news', 'date': '2026'})
        except Exception as e:
            print(f"News API fetch notice: {e}")
            
        if not true_articles:
            true_articles = [
                {'title': 'NIST Cryptography Standard', 'text': 'NIST releases post-quantum encryption standards to protect global digital infrastructure.', 'subject': 'tech', 'date': '2026'},
                {'title': 'Fusion Reactor Output Record', 'text': 'Scientists achieve sustained plasma output in record-breaking tokamak experiment.', 'subject': 'science', 'date': '2026'}
            ]
            
        fake_articles = [
            {'title': 'Urgent Bank Suspended', 'text': 'URGENT: Your bank account access has been suspended due to suspicious activity. Verify login immediately at http://secure-bank-update.com', 'subject': 'scam', 'date': '2026'},
            {'title': 'Free Gift Card Winner', 'text': 'CONGRATULATIONS! You have won a $1,000 gift card! Click www.claim-free-prize-now.com to claim before midnight.', 'subject': 'scam', 'date': '2026'}
        ]
        
        pd.DataFrame(fake_articles).to_csv(FAKE_PATH, index=False)
        pd.DataFrame(true_articles).to_csv(TRUE_PATH, index=False)

ensure_datasets()

# ====================================================
# Load Dataset
# ====================================================

fake_df = pd.read_csv(FAKE_PATH)
true_df = pd.read_csv(TRUE_PATH)

fake_df["label"] = 0
true_df["label"] = 1

# Merge and shuffle dataset
df = pd.concat([fake_df, true_df], axis=0)
df = shuffle(df).reset_index(drop=True)

# ====================================================
# Data Cleaning & Preprocessing
# ====================================================

stop_words = set(stopwords.words("english"))

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    words = text.split()
    cleaned = [w for w in words if w not in stop_words]
    return ' '.join(cleaned)

df["text_clean"] = df["text"].apply(clean_text)

# ====================================================
# Train Test Split & Vectorization
# ====================================================

X = df["text_clean"]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

vectorizer = TfidfVectorizer(max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ====================================================
# Train Machine Learning Models
# ====================================================

print("--- Training Logistic Regression ---")
lr_model = LogisticRegression()
lr_model.fit(X_train_vec, y_train)
lr_preds = lr_model.predict(X_test_vec)
print(f"Logistic Regression Accuracy: {accuracy_score(y_test, lr_preds):.4f}")

print("--- Training K-Nearest Neighbors ---")
knn_model = KNeighborsClassifier(n_neighbors=min(5, len(X_train)))
knn_model.fit(X_train_vec, y_train)
knn_preds = knn_model.predict(X_test_vec)
print(f"KNN Accuracy: {accuracy_score(y_test, knn_preds):.4f}")

print("--- Training Random Forest ---")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_vec, y_train)
rf_preds = rf_model.predict(X_test_vec)
print(f"Random Forest Accuracy: {accuracy_score(y_test, rf_preds):.4f}")

# ====================================================
# Train Deep Learning Keras Neural Network
# ====================================================

print("--- Training Keras Neural Network ---")
if HAS_TF:
    nn_model = keras.Sequential([
        layers.Dense(128, activation='relu', input_shape=(X_train_vec.shape[1],)),
        layers.Dropout(0.3),
        layers.Dense(64, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])

    nn_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    nn_model.fit(X_train_vec.toarray(), y_train, epochs=3, batch_size=32, verbose=1)

    nn_preds_prob = nn_model.predict(X_test_vec.toarray())
    nn_preds = (nn_preds_prob > 0.5).astype(int)
    print(f"Neural Network Accuracy: {accuracy_score(y_test, nn_preds):.4f}")
else:
    print("TensorFlow not installed in environment — skipped Keras NN training step.")

# ====================================================
# Model Evaluation Summary
# ====================================================

print("\n" + "=" * 50)
print("FINAL CLASSIFICATION REPORT (Random Forest):")
print("=" * 50)
print(classification_report(y_test, rf_preds))
