function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const name = String(item[key]);
    (groups[name] ??= []).push(item);
  }
  return groups;
}
