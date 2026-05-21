# import os
# import pickle
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
# from sklearn.preprocessing import StandardScaler
# from sklearn.calibration import CalibratedClassifierCV
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report, roc_auc_score, f1_score
# import lightgbm as lgb
# import xgboost as xgb

# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# DATA_PATH = os.path.join(BASE_DIR, "data", "creditcard.csv")
# MODEL_DIR = os.path.join(BASE_DIR, "models")


# def load_and_prepare_data():
#     df = pd.read_csv(DATA_PATH)
#     df["hour"] = (df["Time"] / 3600 % 24).astype(int)
#     scaler = StandardScaler()
#     df["amount_scaled"] = scaler.fit_transform(df[["Amount"]])
#     feature_columns = [col for col in df.columns
#                        if col not in ["Time", "Amount", "Class"]]
#     X = df[feature_columns]
#     y = df["Class"]
#     return X, y, scaler


# def build_models(scale_pos_weight):
#     models = {
#         "LightGBM": {
#             "estimator": lgb.LGBMClassifier(
#                 scale_pos_weight=scale_pos_weight,
#                 random_state=42,
#                 verbose=-1
#             ),
#             "params": {
#                 "n_estimators": [200, 500],
#                 "learning_rate": [0.05, 0.1],
#                 "num_leaves": [31, 63],
#             }
#         },
#         "XGBoost": {
#             "estimator": xgb.XGBClassifier(
#                 scale_pos_weight=scale_pos_weight,
#                 random_state=42,
#                 eval_metric="logloss",
#                 verbosity=0
#             ),
#             "params": {
#                 "n_estimators": [200, 500],
#                 "learning_rate": [0.05, 0.1],
#                 "max_depth": [4, 6],
#             }
#         },
#         "RandomForest": {
#             "estimator": RandomForestClassifier(
#                 class_weight="balanced",
#                 random_state=42,
#                 n_jobs=-1
#             ),
#             "params": {
#                 "n_estimators": [100, 200],
#                 "max_depth": [10, 20],
#                 "min_samples_leaf": [1, 2],
#             }
#         }
#     }
#     return models


# def train_and_compare(X_train, X_test, y_train, y_test, scale_pos_weight):
#     models = build_models(scale_pos_weight)
#     cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
#     results = {}

#     print("\n" + "="*60)
#     print("TRAINING AND COMPARING THREE MODELS")
#     print("="*60)

#     for name, config in models.items():
#         print(f"\n[{name}] Running GridSearchCV...")

#         grid = GridSearchCV(
#             estimator=config["estimator"],
#             param_grid=config["params"],
#             cv=cv,
#             scoring="roc_auc",
#             n_jobs=-1,
#             verbose=0
#         )
#         grid.fit(X_train, y_train)

#         best = grid.best_estimator_

#         print(f"[{name}] Best params: {grid.best_params_}")
#         print(f"[{name}] Calibrating probabilities...")

#         calibrated = CalibratedClassifierCV(
#             best, cv=3, method="isotonic"
#         )
#         calibrated.fit(X_train, y_train)

#         y_pred = calibrated.predict(X_test)
#         y_prob = calibrated.predict_proba(X_test)[:, 1]

#         auc = roc_auc_score(y_test, y_prob)
#         f1 = f1_score(y_test, y_pred)

#         results[name] = {
#             "model": calibrated,
#             "auc": auc,
#             "f1": f1,
#             "y_pred": y_pred,
#             "y_prob": y_prob,
#             "best_params": grid.best_params_
#         }

#         print(f"[{name}] AUC-ROC: {auc:.4f} | F1 (fraud): {f1:.4f}")

#     print("\n" + "="*60)
#     print("RESULTS SUMMARY")
#     print("="*60)
#     print(f"{'Model':<20} {'AUC-ROC':<12} {'F1 (Fraud)':<12}")
#     print("-"*44)
#     for name, r in results.items():
#         print(f"{name:<20} {r['auc']:<12.4f} {r['f1']:<12.4f}")

#     best_name = max(results, key=lambda k: results[k]["auc"])
#     print(f"\nWinner: {best_name} (AUC-ROC: {results[best_name]['auc']:.4f})")
#     print("="*60)

#     return results, best_name


# def evaluate_model(name, result, y_test):
#     print(f"\n=== FULL EVALUATION: {name} ===")
#     print(f"AUC-ROC: {result['auc']:.4f}")
#     print()
#     print(classification_report(
#         y_test, result["y_pred"],
#         target_names=["Legitimate", "Fraud"]
#     ))


# def save_model(model, scaler, model_name):
#     os.makedirs(MODEL_DIR, exist_ok=True)
#     model_path = os.path.join(MODEL_DIR, "fraud_model.pkl")
#     scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
#     meta_path = os.path.join(MODEL_DIR, "model_meta.pkl")

#     with open(model_path, "wb") as f:
#         pickle.dump(model, f)

#     with open(scaler_path, "wb") as f:
#         pickle.dump(scaler, f)

#     with open(meta_path, "wb") as f:
#         pickle.dump({"model_name": model_name}, f)

#     print(f"\nSaved: {model_path}")
#     print(f"Saved: {scaler_path}")
#     print(f"Model type: {model_name}")


# if __name__ == "__main__":
#     print("Loading and preparing data...")
#     X, y, scaler = load_and_prepare_data()

#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42, stratify=y
#     )

#     scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
#     print(f"Scale pos weight: {scale_pos_weight:.1f}")

#     results, best_name = train_and_compare(
#         X_train, X_test, y_train, y_test, scale_pos_weight
#     )

#     evaluate_model(best_name, results[best_name], y_test)

#     save_model(results[best_name]["model"], scaler, best_name)
#     print("\nDone.")

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score
import lightgbm as lgb

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "creditcard.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

def load_and_prepare_data():
    df = pd.read_csv(DATA_PATH)

    df["hour"] = (df["Time"] / 3600 % 24).astype(int)

    scaler = StandardScaler()
    df["amount_scaled"] = scaler.fit_transform(df[["Amount"]])

    feature_columns = [col for col in df.columns
                       if col not in ["Time", "Amount", "Class"]]

    X = df[feature_columns]
    y = df["Class"]

    return X, y, scaler

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    model = lgb.LGBMClassifier(
        scale_pos_weight=scale_pos_weight,
        n_estimators=500,
        learning_rate=0.05,
        num_leaves=31,
        random_state=42,
        verbose=-1
    )

    model.fit(X_train, y_train)

    return model, X_test, y_test

def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    auc = roc_auc_score(y_test, y_prob)

    print("=== MODEL EVALUATION ===")
    print(f"AUC-ROC Score: {auc:.4f}")
    print()
    print(classification_report(y_test, y_pred,
                                target_names=["Legitimate", "Fraud"]))
    return auc

def save_model(model, scaler):
    os.makedirs(MODEL_DIR, exist_ok=True)

    model_path = os.path.join(MODEL_DIR, "fraud_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")

    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    with open(scaler_path, "wb") as f:
        pickle.dump(scaler, f)

    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")


if __name__ == "__main__":
    print("Loading and preparing data...")
    X, y, scaler = load_and_prepare_data()

    print("Training model...")
    model, X_test, y_test = train_model(X, y)

    print("Evaluating model...")
    evaluate_model(model, X_test, y_test)

    save_model(model, scaler)
    print("Done.")