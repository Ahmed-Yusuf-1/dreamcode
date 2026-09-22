function parseSpeed(speed: string | number): number {
  const value = typeof speed === "number" ? speed : parseFloat(speed);
  if (isNaN(value) || value < 0) return -1;
  return value;
}
