import os
import joblib

BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "category_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "vectorizer.pkl"
)

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict_category(
    merchant_name: str,
    description: str = "",
    transaction_type: str = ""
):

    text = f"{merchant_name} {description} {transaction_type}"

    text = text.lower().strip()

    vector = vectorizer.transform([text])

    probabilities = model.predict_proba(vector)[0]

    best_index = probabilities.argmax()

    confidence = probabilities[best_index]

    predicted_category = model.classes_[best_index]

    print("=" * 50)
    print(f"INPUT       : {text}")
    print(f"PREDICTION  : {predicted_category}")
    print(f"CONFIDENCE  : {confidence:.2f}")
    print("=" * 50)

    if confidence < 0.70:
        return "Uncategorized"

    return predicted_category