class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

function boxPipeline(start: number): number {
  return new Box(start)
    .map((n) => n + 1)
    .map((n) => n * 2)
    .getValue();
}
