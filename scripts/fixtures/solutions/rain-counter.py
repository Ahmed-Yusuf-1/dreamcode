def total_raindrops(sectors):
    total = 0
    for sector in sectors:
        for drops in sector:
            total += drops
    return total
