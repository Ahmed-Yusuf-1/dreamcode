interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Report {
  low: string[];
  value: number;
}

function restockReport(items: Item[], threshold: number): Report {
  const low = items.filter((i) => i.qty < threshold).map((i) => i.name).sort();
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  return { low, value: Math.round(total * 100) / 100 };
}
