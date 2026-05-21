# Fraud Detection API

A real-time credit card fraud detection system built with FastAPI and LightGBM,
trained on 284,807 real transactions from the Kaggle Credit Card Fraud dataset.

## Tech Stack

- **Backend:** FastAPI, Python 3.11, LightGBM, scikit-learn
- **Frontend:** React (Vite)
- **Deployment:** Docker, AWS EC2
- **CI/CD:** GitHub Actions

## Model Performance

| Metric | Score |
|--------|-------|
| AUC-ROC | 0.9135 |
| Fraud Recall | 0.84 |
| Training data | 284,807 transactions |
| Fraud rate | 0.17% |

## Project Structure

fraud-detection-api/
app/
main.py        # FastAPI endpoints
model.py       # LightGBM training script
frontend/        # React UI
notebooks/       # EDA and data exploration
Dockerfile
requirements.txt

## Running Locally

**Backend:**
```bash
pip install -r requirements.txt
python app/model.py        # train model (run once)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Docker:**
```bash
docker build -t fraud-detection-api .
docker run -p 8000:8000 fraud-detection-api
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| POST | /predict | Predict fraud probability |

## Dataset

Kaggle Credit Card Fraud Detection dataset — 284,807 European cardholder
transactions (2013). Features V1-V28 are PCA-transformed for privacy.