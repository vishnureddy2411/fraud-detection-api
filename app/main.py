import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_artifacts():
    model_path = os.path.join(BASE_DIR, "models", "fraud_model.pkl")
    scaler_path = os.path.join(BASE_DIR, "models", "scaler.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. Run: python app/model.py"
        )

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)

    return model, scaler


app = FastAPI(
    title="Fraud Detection API",
    description="Detects fraudulent credit card transactions using LightGBM",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

model, scaler = load_artifacts()


class Transaction(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount in USD")
    hour: int = Field(..., ge=0, le=23, description="Hour of day (0-23)")
    v1: float = Field(..., description="PCA feature V1")
    v2: float = Field(..., description="PCA feature V2")
    v3: float = Field(..., description="PCA feature V3")
    v4: float = Field(..., description="PCA feature V4")
    v5: float = Field(..., description="PCA feature V5")
    v6: float = Field(..., description="PCA feature V6")
    v7: float = Field(..., description="PCA feature V7")
    v8: float = Field(..., description="PCA feature V8")
    v9: float = Field(..., description="PCA feature V9")
    v10: float = Field(..., description="PCA feature V10")
    v11: float = Field(..., description="PCA feature V11")
    v12: float = Field(..., description="PCA feature V12")
    v13: float = Field(..., description="PCA feature V13")
    v14: float = Field(..., description="PCA feature V14")
    v15: float = Field(..., description="PCA feature V15")
    v16: float = Field(..., description="PCA feature V16")
    v17: float = Field(..., description="PCA feature V17")
    v18: float = Field(..., description="PCA feature V18")
    v19: float = Field(..., description="PCA feature V19")
    v20: float = Field(..., description="PCA feature V20")
    v21: float = Field(..., description="PCA feature V21")
    v22: float = Field(..., description="PCA feature V22")
    v23: float = Field(..., description="PCA feature V23")
    v24: float = Field(..., description="PCA feature V24")
    v25: float = Field(..., description="PCA feature V25")
    v26: float = Field(..., description="PCA feature V26")
    v27: float = Field(..., description="PCA feature V27")
    v28: float = Field(..., description="PCA feature V28")


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "model": "LightGBM Fraud Detection",
        "version": "1.0.0"
    }


@app.post("/predict")
def predict(transaction: Transaction):
    try:
        amount_scaled = scaler.transform([[transaction.amount]])[0][0]

        features = np.array([[
            transaction.v1, transaction.v2, transaction.v3,
            transaction.v4, transaction.v5, transaction.v6,
            transaction.v7, transaction.v8, transaction.v9,
            transaction.v10, transaction.v11, transaction.v12,
            transaction.v13, transaction.v14, transaction.v15,
            transaction.v16, transaction.v17, transaction.v18,
            transaction.v19, transaction.v20, transaction.v21,
            transaction.v22, transaction.v23, transaction.v24,
            transaction.v25, transaction.v26, transaction.v27,
            transaction.v28, transaction.hour, amount_scaled
        ]])

        fraud_probability = model.predict_proba(features)[0][1]
        is_fraud = bool(fraud_probability >= 0.5)

        return {
            "is_fraud": is_fraud,
            "fraud_probability": round(float(fraud_probability), 4),
            "risk_level": (
                "HIGH" if fraud_probability >= 0.7
                else "MEDIUM" if fraud_probability >= 0.3
                else "LOW"
            )
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
