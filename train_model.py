import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score, RandomizedSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import pickle

df = pd.read_csv("train.csv")

df["age"] = df["age"].astype(int)
df = df.drop(columns=["ID", "age_desc"])
df["contry_of_res"] = df["contry_of_res"].replace({
    "Viet Nam": "Vietnam", "AmericanSamoa": "United States", "Hong Kong": "China"
})

df["ethnicity"] = df["ethnicity"].replace({"?": "Others", "others": "Others"})
df["relation"] = df["relation"].replace({"?": "Others", "Relative": "Others", "Parent": "Others",
                                        "Health care professional": "Others"})

object_cols = df.select_dtypes(include=["object"]).columns
encoders = {}
for col in object_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

with open("encoders.pkl", "wb") as f:
    pickle.dump(encoders, f)

X = df.drop(columns=["Class/ASD"])
y = df["Class/ASD"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

models = {
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    "XGBoost": XGBClassifier(random_state=42)
}

cv_scores = {}
for name, model in models.items():
    scores = cross_val_score(model, X_train_smote, y_train_smote, cv=5, scoring="accuracy")
    cv_scores[name] = scores.mean()

best_model_name = max(cv_scores, key=cv_scores.get)
best_model = models[best_model_name]
best_model.fit(X_train_smote, y_train_smote)

with open("best_model.pkl", "wb") as f:
    pickle.dump(best_model, f)

print(f"Best model saved: {best_model_name} with accuracy {cv_scores[best_model_name]:.2f}")