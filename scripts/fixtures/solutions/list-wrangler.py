def find_cold_days(temps, threshold):
    return [t for t in temps if t < threshold]
