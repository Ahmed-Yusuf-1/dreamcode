function textStats(text) {
  const words = text.trim().split(/\s+/).filter((w) => w !== "");
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim() !== "").length;
  let longestWord = "";
  for (const w of words) {
    const clean = w.replace(/^[^\w']+|[^\w']+$/g, "");
    if (clean.length > longestWord.length) longestWord = clean;
  }
  return { words: words.length, sentences, longestWord };
}
