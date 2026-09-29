# 👁️ NEWS LENS 3D - AI-Powered News Authenticity & Truth Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://fake-news-detection-application-mai-ten.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Earth-green.svg)](https://threejs.org/)
[![ML Accuracy](https://img.shields.io/badge/ML%20Accuracy-95%25%2B-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-orange.svg)]()

> 🌐 **Live Demo**: [fake-news-detection-application-mai-ten.vercel.app](https://fake-news-detection-application-mai-ten.vercel.app/)
>
> **NEWS LENS 3D** is an advanced 3D web application and machine learning platform designed to detect fake news, verify claim authenticity, and monitor real-time breaking news across the globe. Powered by a **Photorealistic 3D Earth Globe**, **Multi-Modal AI Threat Studio**, and a **5-Model ML Ensemble Stance Engine (94.67% – 100% Accuracy)**.

---

## ✨ Features

- 🌍 **Photorealistic 3D Earth Globe**: Rendered in vibrant blue (`#0077be`) and green (`#2d6a4f`) with realistic atmosphere, specular lighting, and interactive camera fly-to lerp controls.
- 📺 **Auto-Running Category News Reel**: Dynamic left-panel news reel cycling top headlines every 4.5 seconds per category (*Technology, Business, Science, Health, World, All Feed*).
- 🎯 **AI Threat Studio (Multi-Modal Verification)**:
  - 📝 **Single Sentence / Text Analysis**: Instant claim truth verification.
  - 🌐 **Web Article URL Scraper**: Direct full-text article extraction and credibility scoring.
  - 📄 **PDF Document Scanner**: Upload press releases or documents for threat analysis.
  - 🎙️ **Voice Speech Assistant**: Hands-free voice speech-to-text verification.
- 🤖 **High-Accuracy ML Ensemble Engine**:
  - Combines **Logistic Regression**, **Random Forest**, **Naive Bayes**, **Neural Network**, and **Ensemble Stance Classifiers**.
  - Achieves **94.67% – 100.00% accuracy** on Fake vs Real News datasets.
- 📰 **Zero-Key Live Press & Knowledge Cross-Checker**:
  - Live cross-referencing against Google News RSS feeds and Wikipedia Knowledge Base (requires **0 external API keys**).
  - Enforces a **Strict >= 45% Keyword Overlap Threshold** to eliminate false positives on synthetic fake claims.

---

## 📁 Project Structure

```
Fake-News-Detection/
├── api/
│   └── index.py          # Vercel Serverless Function entry point
├── server.py             # Main production HTTP API server & verification engine (Port 5000)
├── index.html            # Master single-page 3D Web UI layout
├── style.css             # Glassmorphism dark mode CSS design system & responsive layout
├── app.js                # Three.js 3D Earth globe, news reel controller & AI Threat Studio logic
├── app.py                # Standalone Streamlit ML Web Application
├── train.py              # ML training pipeline for vectorizer and ensemble model dictionary
├── news_service.py       # Dataset generation and scraper utilities
├── run.py                # Console launcher banner
├── vercel.json           # Vercel deployment and routing configuration
├── README.md             # Project documentation
├── vectorizer.pkl        # TF-IDF Feature Vectorizer artifact
├── models.pkl            # Trained 5-Model Machine Learning Ensemble artifact
├── metrics.pkl           # Trained model accuracy metrics dictionary
├── spam.csv              # Trained Real vs Fake News dataset
└── requirements.txt      # Python dependencies manifest
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
Ensure you have Python 3.10+ installed on your system.

```bash
python --version
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Launch the 3D Production Web App

```bash
python server.py
```

Open your browser and navigate to:
👉 **`http://localhost:5000`**

### 4. Run Standalone Streamlit App (Optional)

```bash
streamlit run app.py
```

---

## 📡 API Endpoints

### 1. Truth Prediction Endpoint
- **URL**: `/api/predict`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "text": "NIST releases post quantum cryptography standards"
  }
  ```
- **Response**:
  ```json
  {
    "prediction": 0,
    "probability": 0.08,
    "truth_score_pct": 92.0,
    "publishers_list": ["Google News Index", "Google News (NIST.gov)"],
    "reasoning": "Verified Authentic Statement: Confirmed on Google News live press networks."
  }
  ```

### 2. Live Category News Endpoint
- **URL**: `/api/news?category=technology`
- **Method**: `GET`

### 3. ML Model Metrics Endpoint
- **URL**: `/api/metrics`
- **Method**: `GET`

---

## 🔬 Model Performance & Metrics

| Classifier Model | Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **100.00%** | 100.00% | 100.00% | 100.00% |
| **Random Forest** | **100.00%** | 100.00% | 100.00% | 100.00% |
| **Naive Bayes** | **94.67%** | 90.48% | 100.00% | 95.00% |
| **Neural Network (MLP)** | **100.00%** | 100.00% | 100.00% | 100.00% |
| **Ensemble Classifier** | **100.00%** | 100.00% | 100.00% | 100.00% |

---

## 📜 License

This project is licensed under the MIT License.
