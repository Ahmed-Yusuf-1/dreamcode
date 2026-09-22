def find_brightest(stars):
    if not stars:
        return None
    return min(stars, key=stars.get)
