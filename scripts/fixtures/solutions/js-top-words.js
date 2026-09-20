function topWords(text, k) {
  const counts = new Map();
  for (const word of text.toLowerCase().match(/[a-z]+/g) || []) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, k)
    .map(([word]) => word);
}
