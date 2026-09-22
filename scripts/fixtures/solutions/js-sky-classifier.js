function classifySky(visibility, isStormy, isNight) {
  if (isStormy) return "unsafe";
  if (visibility < 3 || (isNight && visibility < 5)) return "restricted";
  return "clear";
}
