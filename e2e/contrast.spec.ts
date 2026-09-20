import { expect, test } from "@playwright/test";

/**
 * Text contrast.
 *
 * The pages sit on a CSS gradient sky, which axe-core cannot resolve (it falls
 * back to white and reports false failures), so contrast is measured here: the
 * sky and its scrim are read from the live design tokens, the colour painted
 * behind each piece of text is reconstructed, and the result is checked against
 * the WCAG AA threshold for its size and weight. Text over a photograph or a
 * gradient fill (the home hero, a primary button) cannot be sampled this way
 * and is skipped.
 */
// The home hero sits on a photograph rather than the scene sky.
const PAGES = [
  "/start",
  "/dashboard",
  "/lessons",
  "/journey",
  "/peaks",
  "/projects",
  "/badges",
  "/leaderboard",
  "/profile",
  "/review",
  "/placement",
  "/industry",
  "/lesson/variables",
  "/practice/variables",
  "/challenge/rain-counter",
  "/project/sky-house",
];

/** Runs in the page: rebuilds what is painted behind each text node. */
function audit() {
  /** Reads #rgb, #rrggbb, rgb() and rgba() into [r, g, b, a?]. */
  const parse = (s: string | null | undefined): number[] => {
    const text = (s || "").trim();
    const hex = text.match(/#([0-9a-f]{3,8})\b/i);
    if (hex && !/^rgb/i.test(text)) {
      let h = hex[1];
      if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
      const n = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
      if (h.length === 8) n.push(parseInt(h.slice(6, 8), 16) / 255);
      return n;
    }
    return (text.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
  };
  const lum = ([r, g, b]: number[]) => {
    const f = (c: number) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a: number[], b: number[]) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const over = (fg: number[], bg: number[]) => {
    const a = fg[3] ?? 1;
    return [0, 1, 2].map((i) => Math.round(fg[i] * a + bg[i] * (1 - a)));
  };

  const root = getComputedStyle(document.documentElement);
  /** Colour stops of the last linear-gradient in a token, as [position, rgba]. */
  const gradientStops = (token: string): [number, number[]][] => {
    const value = root.getPropertyValue(token);
    const start = value.lastIndexOf("linear-gradient(");
    if (start < 0) return [];
    const body = value.slice(start + "linear-gradient(".length);
    const parts: string[] = [];
    let depth = 0;
    let current = "";
    for (const ch of body) {
      if (ch === "(") depth += 1;
      if (ch === ")") {
        if (depth === 0) break;
        depth -= 1;
      }
      if (ch === "," && depth === 0) {
        parts.push(current);
        current = "";
      } else current += ch;
    }
    parts.push(current);
    const stops: [number | null, number[]][] = [];
    for (const part of parts) {
      const text = part.trim();
      if (/^\d+deg|^to /.test(text)) continue;
      const percent = text.match(/([\d.]+)%\s*$/);
      const colour = parse(text);
      if (colour.length < 3) continue;
      stops.push([percent ? Number(percent[1]) / 100 : null, colour]);
    }
    return stops.map((stop, i): [number, number[]] => [stop[0] ?? i / Math.max(1, stops.length - 1), stop[1]]);
  };

  const sample = (stops: [number, number[]][], t: number): number[] | null => {
    if (stops.length === 0) return null;
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i += 1) {
      if (t <= stops[i][0]) {
        const [p0, c0] = stops[i - 1];
        const [p1, c1] = stops[i];
        const k = (t - p0) / (p1 - p0 || 1);
        return c0.map((v: number, j: number) => v + ((c1[j] ?? 1) - v) * k);
      }
    }
    return stops[stops.length - 1][1];
  };

  const sky = gradientStops("--dc-page-sky");
  const scrim = gradientStops("--dc-sky-scrim");
  if (sky.length === 0) throw new Error("could not read the --dc-page-sky token");
  // Both are fixed to the viewport, so the position is the fraction down the screen.
  const skyAt = (y: number) => {
    const t = Math.min(1, Math.max(0, y / window.innerHeight));
    let base = sample(sky, t)?.slice(0, 3).map(Math.round) ?? [255, 255, 255];
    const veil = sample(scrim, t);
    if (veil) base = over(veil, base);
    return base;
  };

  /**
   * The colour painted behind an element, or null when it cannot be worked out
   * (a photo or a gradient other than the scene sky, such as the home hero).
   */
  const painted = (el: Element): number[] | null => {
    const scene = el.closest(".dc-scene");
    if (!scene) return null;
    const layers: number[][] = [];
    let node: Element | null = el;
    while (node && node !== scene) {
      const cs = getComputedStyle(node);
      if (/url\(|gradient/.test(cs.backgroundImage || "")) return null;
      const bg = parse(cs.backgroundColor);
      if (bg.length >= 3 && (bg[3] ?? 1) > 0) layers.unshift(bg);
      node = node.parentElement;
    }
    const box = el.getBoundingClientRect();
    let base = skyAt(box.top + box.height / 2);
    for (const layer of layers) base = over(layer, base);
    return base;
  };

  const findings: { text: string; contrast: number; needed: number; colour: string; background: string; selector: string }[] = [];
  for (const el of document.querySelectorAll("h1, h2, h3, h4, p, span, div, a, li, button, dt, dd, label")) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
    if (!own || own.length > 160) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.95) continue;
    // Gradient fills cannot be sampled this way; they are checked by eye.
    if ([el, el.parentElement].some((n) => n && /gradient/.test(getComputedStyle(n).backgroundImage || ""))) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 4 || box.height < 4 || box.top > window.innerHeight || box.bottom < 0) continue;
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const background = painted(el);
    if (!background) continue;
    const contrast = ratio(over(parse(cs.color), background), background);
    const needed = large ? 3 : 4.5;
    if (contrast + 0.005 < needed) {
      findings.push({
        text: own.slice(0, 48),
        contrast: Number(contrast.toFixed(2)),
        needed,
        colour: cs.color,
        background: `rgb(${background.join(",")})`,
        selector: el.className.toString().slice(0, 60) || el.tagName.toLowerCase(),
      });
    }
  }
  return findings;
}

for (const theme of ["light", "dark"] as const) {
  for (const path of PAGES) {
    test(`${path} meets AA in ${theme}`, async ({ page, context }) => {
      await context.addInitScript((value) => {
        try {
          localStorage.setItem("dc_appearance", value);
        } catch {
          /* private mode */
        }
      }, theme);
      await page.goto(path, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const findings = (await page.evaluate(audit)) as { text: string; contrast: number; needed: number; colour: string; background: string; selector: string }[];
      const seen = new Set<string>();
      const lines: string[] = [];
      for (const f of findings) {
        const key = f.selector + f.contrast;
        if (seen.has(key)) continue;
        seen.add(key);
        lines.push(`${f.contrast} (needs ${f.needed}) "${f.text}" ${f.colour} on ${f.background} [${f.selector}]`);
      }
      expect(lines.join("\n"), lines.join("\n")).toBe("");
    });
  }
}
