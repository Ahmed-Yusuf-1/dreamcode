def filter_stars(stars, min_mag):
    return {s["name"]: s["mag"] for s in stars if s["mag"] > min_mag}
