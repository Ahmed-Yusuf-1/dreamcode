import pandas as pd

def summarize_readings(rows):
    empty = {"rows": 0, "avg_temp": None, "wettest": None}
    if not rows:
        return empty
    df = pd.DataFrame(rows)
    df["temp"] = pd.to_numeric(df["temp"], errors="coerce")
    df = df.dropna(subset=["city"])
    df["rain_mm"] = pd.to_numeric(df["rain_mm"], errors="coerce").fillna(0)
    if len(df) == 0:
        return empty
    mean = df["temp"].mean()
    return {
        "rows": int(len(df)),
        "avg_temp": None if pd.isna(mean) else round(float(mean), 1),
        "wettest": df.loc[df["rain_mm"].idxmax(), "city"],
    }
