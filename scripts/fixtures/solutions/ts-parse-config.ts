interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type Result = { ok: true; value: Config } | { ok: false; error: string };

function parseConfig(input: unknown): Result {
  if (typeof input !== "object" || input === null) return { ok: false, error: "config must be an object" };
  const raw = input as Record<string, unknown>;
  if (typeof raw.host !== "string" || raw.host === "") return { ok: false, error: "host must be a non-empty string" };
  if (typeof raw.port !== "number" || !Number.isInteger(raw.port) || raw.port < 1 || raw.port > 65535) {
    return { ok: false, error: "port must be a whole number from 1 to 65535" };
  }
  const debug = raw.debug === undefined ? false : raw.debug;
  if (typeof debug !== "boolean") return { ok: false, error: "debug must be a boolean" };
  return { ok: true, value: { host: raw.host, port: raw.port, debug } };
}
