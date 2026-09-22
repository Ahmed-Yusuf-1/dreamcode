/**
 * A stable shuffle of answer positions, so the right answer is not always in
 * the same spot. The order is derived from the question's own text, which keeps
 * it identical on the server and the client (no hydration mismatch) and across
 * visits (a learner who comes back sees the same layout).
 */
export function optionOrder(count: number, seedText: string): number[] {
  const random = seededRandom(seedText);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** FNV-1a hash of the text feeding a mulberry32 generator: small, fast and well mixed. */
export function seededRandom(text: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    state ^= text.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
