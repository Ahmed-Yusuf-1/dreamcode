const formatVelocity = (value, unit = "km/h") => {
  if (value < 0) return "Invalid speed";
  return `${value} ${unit}`;
};
