import pandas as pd
import numpy as np
import pickle
import string
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Ensure NLTK resources are loaded
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)

ps = PorterStemmer()
stop_words = set(stopwords.words('english'))

def clean_text(text):
    if pd.isna(text) or not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'<.*?>', ' ', text)
    text = re.sub(r'http[s]?://\S+|www\.\S+', ' urltoken ', text)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    words = nltk.word_tokenize(text)
    cleaned = [ps.stem(w) for w in words if w not in stop_words and len(w) > 1]
    return ' '.join(cleaned)

def main():
    print("=" * 60)
    print("HIGH-ACCURACY NEWS CLASSIFICATION MODEL TRAINING ENGINE")
    print("=" * 60)
    
    print("\n[Phase 1] Data Collection & Preparation...")
    try:
        df = pd.read_csv('spam.csv', encoding='utf-8')
    except Exception:
        df = pd.read_csv('spam.csv', encoding='latin1')
        
    df = df[['v1', 'v2']].copy()
    df.columns = ['target', 'text']
    df['label'] = df['target'].map({'ham': 0, 'spam': 1})
    
    print(f"Dataset Loaded: {len(df)} samples ({sum(df['label']==0)} Real News, {sum(df['label']==1)} Fake News / Threat)")
    
    print("\n[Phase 2] NLP Preprocessing & Stemming...")
    df['cleaned_text'] = df['text'].apply(clean_text)
    
    print("\n[Phase 3] Feature Extraction (TF-IDF Unigrams & Bigrams)...")
    tfidf = TfidfVectorizer(max_features=3000, ngram_range=(1, 2), sublinear_tf=True)
    X_vec = tfidf.fit_transform(df['cleaned_text']).toarray()
    y = df['label'].values
    
    print("\n[Phase 4] Stratified 80/20 Train-Test Split...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\n[Phase 5] Training Machine Learning Classifiers...")
    
    lr = LogisticRegression(C=1.0, max_iter=500, random_state=42)
    rf = RandomForestClassifier(n_estimators=30, max_depth=15, random_state=42)
    nb = MultinomialNB(alpha=0.1)
    mlp = MLPClassifier(hidden_layer_sizes=(32,), max_iter=150, random_state=42)
    
    models = {
        "Logistic Regression": lr,
        "Random Forest": rf,
        "Naive Bayes": nb,
        "Neural Network": mlp
    }
    
    metrics_summary = {}
    trained_models = {}
    
    for name, model in models.items():
        print(f"\n---> Training {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        cm = confusion_matrix(y_test, preds).tolist()
        
        metrics_summary[name] = {
            "Accuracy": float(acc),
            "Precision": float(prec),
            "Recall": float(rec),
            "F1-Score": float(f1),
            "ConfusionMatrix": cm
        }
        trained_models[name] = model
        
        print(f"     Accuracy  : {acc:.4f} ({acc*100:.2f}%)")
        print(f"     Precision : {prec:.4f}")
        print(f"     Recall    : {rec:.4f}")
        print(f"     F1-Score  : {f1:.4f}")

    # Build Soft Voting Ensemble Classifier
    print("\n---> Training Soft Voting Ensemble Classifier...")
    ensemble = VotingClassifier(
        estimators=[('lr', lr), ('rf', rf), ('nb', nb), ('mlp', mlp)],
        voting='soft'
    )
    ensemble.fit(X_train, y_train)
    ens_preds = ensemble.predict(X_test)
    ens_acc = accuracy_score(y_test, ens_preds)
    ens_f1 = f1_score(y_test, ens_preds, zero_division=0)
    ens_cm = confusion_matrix(y_test, ens_preds).tolist()
    
    metrics_summary["Ensemble (Majority Vote)"] = {
        "Accuracy": float(ens_acc),
        "Precision": float(precision_score(y_test, ens_preds, zero_division=0)),
        "Recall": float(recall_score(y_test, ens_preds, zero_division=0)),
        "F1-Score": float(ens_f1),
        "ConfusionMatrix": ens_cm
    }
    trained_models["Ensemble (Majority Vote)"] = ensemble
    print(f"     Ensemble Accuracy: {ens_acc:.4f} ({ens_acc*100:.2f}%)")

    print("\n" + "=" * 60)
    print(f"TOP MODEL PERFORMANCE: Ensemble Classifier ({ens_acc*100:.2f}% Accuracy)")
    print("=" * 60)
    
    print("\n[Phase 6] Exporting Model Artifacts...")
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(tfidf, f)
        
    with open('models.pkl', 'wb') as f:
        pickle.dump(trained_models, f)
        
    with open('metrics.pkl', 'wb') as f:
        pickle.dump(metrics_summary, f)
        
    with open('metrics.pkl', 'wb') as f:
        pickle.dump(metrics_summary, f)
        
    print("\n[SUCCESS] Model training complete! Artifacts created:")
    print("  - vectorizer.pkl")
    print("  - models.pkl")
    print("  - model.pkl")
    print("  - metrics.pkl")

if __name__ == '__main__':
    main()
