function trackHabit(days) {
  let total = 0;
  let longest = 0;
  let current = 0;
  for (const done of days) {
    if (done) {
      total += 1;
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return { total, longest, current };
}
