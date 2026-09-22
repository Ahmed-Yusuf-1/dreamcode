function labelReadings(readings: (number | null)[]): string[] {
  return readings.map((r) => {
    if (r === null) return "offline";
    if (r < 0) return "freezing";
    return r <= 25 ? "mild" : "hot";
  });
}
