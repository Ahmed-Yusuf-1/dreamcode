def analyze_weather(forecasts):
    if not forecasts:
        return {"avg_temp": 0, "conditions": [], "warmest": None}
    total = sum(f["temp"] for f in forecasts)
    conditions = []
    for f in forecasts:
        if f["condition"] not in conditions:
            conditions.append(f["condition"])
    warmest = max(forecasts, key=lambda f: f["temp"])
    return {
        "avg_temp": round(total / len(forecasts), 1),
        "conditions": conditions,
        "warmest": warmest["condition"],
    }
