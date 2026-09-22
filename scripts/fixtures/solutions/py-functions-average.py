def average_magnitude(magnitudes):
    if not magnitudes:
        return 0.0
    return round(sum(magnitudes) / len(magnitudes), 2)
