interface Star {
  name: string;
  magnitude?: number;
}

function checkStar(star: Star): string {
  if (star.name.length === 0) return "Invalid Star";
  if (star.magnitude !== undefined) return "Magnitude: " + star.magnitude;
  return "Magnitude: unknown";
}
