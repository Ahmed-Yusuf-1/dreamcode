function diffInventory(before, after) {
  const added = [];
  const removed = [];
  const changed = [];
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  for (const item of names) {
    if (!(item in before)) added.push(item);
    else if (!(item in after)) removed.push(item);
    else if (before[item] !== after[item]) changed.push({ item, from: before[item], to: after[item] });
  }
  return { added, removed, changed };
}
