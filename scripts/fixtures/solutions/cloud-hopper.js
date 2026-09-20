function countTallClouds(heights, k) {
  let count = 0;
  for (const h of heights) {
    if (h > k) count += 1;
  }
  return count;
}
