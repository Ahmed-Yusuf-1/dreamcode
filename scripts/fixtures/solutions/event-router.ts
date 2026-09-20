type AppEvent =
  | { kind: "click"; x: number; y: number }
  | { kind: "key"; key: string; ctrl: boolean }
  | { kind: "scroll"; delta: number };

function describe(event: AppEvent): string {
  switch (event.kind) {
    case "click":
      return `click at (${event.x}, ${event.y})`;
    case "key":
      return event.ctrl ? `shortcut Ctrl+${event.key}` : `key ${event.key}`;
    case "scroll":
      return `scroll ${event.delta < 0 ? "up" : "down"} ${Math.abs(event.delta)}`;
    default: {
      const unreachable: never = event;
      return unreachable;
    }
  }
}

function describeEvents(events: AppEvent[]): string[] {
  return events.map(describe);
}
