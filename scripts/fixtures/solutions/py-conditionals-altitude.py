def classify_altitude(altitude):
    if altitude < 2000:
        return "low"
    if altitude <= 6000:
        return "mid"
    return "high"
