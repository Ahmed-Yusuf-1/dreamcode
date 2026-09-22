import type { Project } from "@/content/types";
import { code } from "@/content/code";

/**
 * Projects are bigger, multi-step builds graded by a test suite. Guided
 * projects spell out the steps, Independent ones give a goal and tests, and a
 * Capstone pulls a whole track together. Every project has a reference
 * solution in scripts/fixtures/solutions/<id>.<ext> that `npm test` runs.
 */
export const projects: Project[] = [
  /* ------------------------------------------------------------ Python */
  {
    id: "sky-house",
    requires: ["lists"],
    tier: "Guided",
    title: "Sky House",
    desc: "A front door that greets every guest by name.",
    xp: 200,
    language: "Python",
    instructions: `The Sky House needs a doorbell that knows its guests. Write \`build_greeter(names)\`: it takes a list of names and returns a list of greetings, one per name, in the same order.

Each greeting must read exactly \`Hello, NAME! Welcome to the Sky House.\` with the name in place of NAME. Guests sometimes type extra spaces around their name, so trim them first. An empty guest list gives an empty list back.`,
    starter: code`def build_greeter(names):
    greetings = []
    # Write your code here
    return greetings`,
    functionName: "build_greeter",
    steps: [
      "Loop over `names` with a `for` loop.",
      "Trim each name with `.strip()`.",
      "Build the sentence with an f-string and `append` it to `greetings`.",
      "Return the finished list.",
    ],
    hints: [
      "`f\"Hello, {name}! Welcome to the Sky House.\"` builds one greeting.",
      "Call `name.strip()` before you put it in the sentence.",
    ],
    testCases: [
      { label: "two guests", args: [["Nova", "Luka"]], expected: ["Hello, Nova! Welcome to the Sky House.", "Hello, Luka! Welcome to the Sky House."] },
      { label: "nobody home", args: [[]], expected: [] },
      { label: "one guest", args: [["Dreamer"]], expected: ["Hello, Dreamer! Welcome to the Sky House."] },
      { label: "names with stray spaces", args: [["  Ada ", "Grace"]], expected: ["Hello, Ada! Welcome to the Sky House.", "Hello, Grace! Welcome to the Sky House."] },
    ],
  },
  {
    id: "cloud-diary",
    requires: ["sky-house", "string-methods"],
    tier: "Guided",
    title: "Cloud Diary",
    desc: "Search a diary for every entry that mentions a word.",
    xp: 220,
    language: "Python",
    instructions: `Your cloud diary has grown long. Write \`filter_diary(entries, query)\` that returns every entry containing the query, keeping the diary's order.

The search ignores case, so \`"cloud"\` finds \`"Puffy Cloud today"\`. It also ignores spaces around the query. A blank query matches nothing, because searching for nothing should not dump the whole diary.`,
    starter: code`def filter_diary(entries, query):
    matching = []
    # Write your code here
    return matching`,
    functionName: "filter_diary",
    steps: [
      "Clean the query: trim it and lower-case it.",
      "If the cleaned query is empty, return an empty list straight away.",
      "Loop over the entries and keep the ones whose lower-case text contains the query.",
    ],
    hints: [
      "`query.strip().lower()` gives you a clean search word.",
      "`needle in entry.lower()` checks one entry without changing it.",
    ],
    testCases: [
      { label: "finds 'cloud' twice", args: [["Saw a cyan cloud", "Had a starry dream", "Puffy Cloud today"], "cloud"], expected: ["Saw a cyan cloud", "Puffy Cloud today"] },
      { label: "no match", args: [["Clear skies", "Sunset was magenta"], "rain"], expected: [] },
      { label: "query in capitals", args: [["rain again", "sunny"], "RAIN"], expected: ["rain again"] },
      { label: "blank query matches nothing", args: [["anything"], "   "], expected: [] },
    ],
  },
  {
    id: "weather-window",
    requires: ["dictionaries", "cloud-diary"],
    tier: "Independent",
    title: "Weather Window",
    desc: "Turn a week of raw forecasts into a tidy summary.",
    xp: 340,
    language: "Python",
    instructions: `A forecast feed sends a list of dictionaries such as \`{"temp": 20, "condition": "rainy"}\`. Write \`analyze_weather(forecasts)\` that returns a summary dictionary with three keys:

- \`avg_temp\`: the average temperature, rounded to one decimal place
- \`conditions\`: each condition once, in the order it first appears
- \`warmest\`: the condition on the warmest day (the first one if there is a tie)

An empty feed returns \`{"avg_temp": 0, "conditions": [], "warmest": None}\`.`,
    starter: code`def analyze_weather(forecasts):
    # Write your code here
    return {"avg_temp": 0, "conditions": [], "warmest": None}`,
    functionName: "analyze_weather",
    hints: [
      "Handle the empty list first, then you can divide safely.",
      "A list plus an `if condition not in seen` check keeps first-seen order.",
      "`max(forecasts, key=lambda f: f[\"temp\"])` finds the warmest day, and keeps the first on a tie.",
    ],
    testCases: [
      { label: "three days", args: [[{ temp: 20, condition: "rainy" }, { temp: 24, condition: "cloudy" }, { temp: 22, condition: "rainy" }]], expected: { avg_temp: 22.0, conditions: ["rainy", "cloudy"], warmest: "cloudy" } },
      { label: "empty feed", args: [[]], expected: { avg_temp: 0, conditions: [], warmest: null } },
      { label: "average rounds to one place", args: [[{ temp: 10, condition: "fog" }, { temp: 11, condition: "fog" }, { temp: 11, condition: "sun" }]], expected: { avg_temp: 10.7, conditions: ["fog", "sun"], warmest: "fog" } },
      { label: "single day", args: [[{ temp: -3, condition: "snow" }]], expected: { avg_temp: -3.0, conditions: ["snow"], warmest: "snow" } },
    ],
  },
  {
    id: "packing-planner",
    requires: ["py-lambda-sorting", "weather-window"],
    tier: "Independent",
    title: "Packing Planner",
    desc: "Fill a weight-limited bag with the most useful gear first.",
    xp: 360,
    language: "Python",
    instructions: `A balloon basket can only carry so much. Each item is a dictionary like \`{"name": "tent", "weight": 4, "value": 9}\`. Write \`plan_packing(items, capacity)\` using this greedy plan:

1. Rank items by value per unit of weight, best first. Items with the same ratio keep their original order.
2. Walk down the ranking and pack every item that still fits in the remaining capacity. Skip the ones that do not.

Return \`{"packed": [...], "weight": total_weight, "value": total_value}\`, with \`packed\` listing names in the order you packed them.`,
    starter: code`def plan_packing(items, capacity):
    packed = []
    # Write your code here
    return {"packed": packed, "weight": 0, "value": 0}`,
    functionName: "plan_packing",
    hints: [
      "`sorted(items, key=lambda i: i[\"value\"] / i[\"weight\"], reverse=True)` ranks them, and `sorted` is stable.",
      "Keep a running `weight` and only pack an item when `weight + item[\"weight\"] <= capacity`.",
    ],
    testCases: [
      {
        label: "best ratio first, skips what cannot fit",
        args: [[{ name: "tent", weight: 4, value: 8 }, { name: "map", weight: 1, value: 5 }, { name: "stove", weight: 3, value: 3 }, { name: "rope", weight: 2, value: 6 }], 6],
        expected: { packed: ["map", "rope", "stove"], weight: 6, value: 14 },
      },
      { label: "nothing fits", args: [[{ name: "anvil", weight: 50, value: 1 }], 10], expected: { packed: [], weight: 0, value: 0 } },
      { label: "no items", args: [[], 5], expected: { packed: [], weight: 0, value: 0 } },
      {
        label: "ties keep their order",
        args: [[{ name: "a", weight: 2, value: 4 }, { name: "b", weight: 1, value: 2 }, { name: "c", weight: 3, value: 6 }], 3],
        expected: { packed: ["a", "b"], weight: 3, value: 6 },
      },
    ],
  },
  {
    id: "log-lens",
    requires: ["py-regex", "py-hashing-patterns"],
    tier: "Independent",
    title: "Log Lens",
    desc: "Read a server log and report what went wrong, and where.",
    xp: 380,
    language: "Python",
    instructions: `Each log line looks like \`[LEVEL] module: message\`, for example \`[ERROR] auth: token expired\`. Write \`summarize_logs(lines)\` that returns:

- \`counts\`: how many lines had each level, as a dictionary
- \`noisiest\`: the module with the most ERROR lines (the one that appears first on a tie), or \`None\` if there were no errors
- \`skipped\`: how many lines did not match the format at all

Levels are always capital letters and module names are letters, digits or underscores.`,
    starter: code`import re

def summarize_logs(lines):
    counts = {}
    # Write your code here
    return {"counts": counts, "noisiest": None, "skipped": 0}`,
    functionName: "summarize_logs",
    hints: [
      "`re.match(r\"\\[([A-Z]+)\\] (\\w+): \", line)` captures the level and the module.",
      "Count errors per module in their own dictionary, then take `max(errors, key=errors.get)`.",
    ],
    testCases: [
      {
        label: "mixed log",
        args: [["[INFO] web: started", "[ERROR] auth: token expired", "[ERROR] db: timeout", "[ERROR] auth: bad password", "garbage line", "[WARN] web: slow"]],
        expected: { counts: { INFO: 1, ERROR: 3, WARN: 1 }, noisiest: "auth", skipped: 1 },
      },
      { label: "quiet day", args: [["[INFO] web: ok"]], expected: { counts: { INFO: 1 }, noisiest: null, skipped: 0 } },
      { label: "empty log", args: [[]], expected: { counts: {}, noisiest: null, skipped: 0 } },
      { label: "tie goes to the first module", args: [["[ERROR] cache: miss", "[ERROR] queue: full"]], expected: { counts: { ERROR: 2 }, noisiest: "cache", skipped: 0 } },
    ],
  },
  {
    id: "dream-api",
    requires: ["weather-window", "py-json"],
    tier: "Capstone",
    title: "Dream API",
    desc: "The request handler at the heart of a tiny web service.",
    xp: 600,
    language: "Python",
    instructions: `A web framework hands your code a path and waits for a response. Write \`handle_request(path, dream_db)\` for a small dream service. \`dream_db\` maps topics to lists of dream descriptions. Return a dictionary with a \`status\` code and a \`body\`:

- \`/topics\` returns status 200 and the topic names sorted alphabetically.
- \`/dreams/TOPIC\` returns status 200 and that topic's dreams. Topics match without caring about case.
- \`/dreams/TOPIC?limit=N\` returns at most N dreams.
- An unknown topic returns status 404 and the body \`"No dreams found for topic: TOPIC"\`.
- Any other path returns status 400 and the body \`"Bad request"\`.

This is exactly the routing and validation a real Flask or FastAPI endpoint does.`,
    starter: code`def handle_request(path, dream_db):
    # Write your code here
    return {"status": 400, "body": "Bad request"}`,
    functionName: "handle_request",
    steps: [
      "Split off the query string with `path.partition(\"?\")`.",
      "Handle `/topics` first.",
      "For paths starting with `/dreams/`, find the topic ignoring case.",
      "Read `limit` from the query string and slice the list.",
      "Everything else is a 400.",
    ],
    hints: [
      "Build a lookup like `{name.lower(): name for name in dream_db}` to match topics in any case.",
      "`int(value)` turns the limit into a number. If it fails, treat the request as bad.",
    ],
    testCases: [
      {
        label: "/topics lists topics",
        args: ["/topics", { sea: ["Deep blue water"], flight: ["Soaring"] }],
        expected: { status: 200, body: ["flight", "sea"] },
      },
      {
        label: "/dreams/flight",
        args: ["/dreams/flight", { flight: ["Soaring over neon clouds", "Falling gently"], sea: ["Deep blue water"] }],
        expected: { status: 200, body: ["Soaring over neon clouds", "Falling gently"] },
      },
      { label: "topic in capitals", args: ["/dreams/FLIGHT", { flight: ["Soaring"] }], expected: { status: 200, body: ["Soaring"] } },
      {
        label: "limit=1",
        args: ["/dreams/flight?limit=1", { flight: ["Soaring", "Falling", "Gliding"] }],
        expected: { status: 200, body: ["Soaring"] },
      },
      { label: "unknown topic", args: ["/dreams/forest", { flight: ["Soaring"] }], expected: { status: 404, body: "No dreams found for topic: forest" } },
      { label: "unknown path", args: ["/weather", { flight: ["Soaring"] }], expected: { status: 400, body: "Bad request" } },
      { label: "limit is not a number", args: ["/dreams/flight?limit=lots", { flight: ["Soaring"] }], expected: { status: 400, body: "Bad request" } },
    ],
  },
  {
    id: "sky-router",
    requires: ["py-stacks-queues", "dream-api"],
    tier: "Capstone",
    title: "Sky Router",
    desc: "Find the shortest flight through a grid of storm clouds.",
    xp: 650,
    language: "Python",
    instructions: `A map arrives as a list of strings. \`S\` is the start, \`E\` is the end, \`.\` is open sky and \`#\` is a storm you cannot enter. Each move goes one square up, down, left or right.

Write \`shortest_route(grid)\` that returns the fewest moves from S to E, or \`-1\` if no route exists. Use breadth-first search: explore every square one move away, then two, then three. The first time you reach E is guaranteed to be the shortest route.`,
    starter: code`from collections import deque

def shortest_route(grid):
    # find S, then explore outward with a queue
    return -1`,
    functionName: "shortest_route",
    steps: [
      "Scan the grid to find the row and column of `S`.",
      "Put `(row, col, 0)` in a `deque` and mark it visited.",
      "Pop from the left, and if the square is `E` return its distance.",
      "Push each open, unvisited neighbour with distance + 1.",
      "If the queue empties without reaching E, return -1.",
    ],
    hints: [
      "Check bounds with `0 <= r < len(grid) and 0 <= c < len(grid[r])` before reading a square.",
      "Store visited squares in a set of `(row, col)` tuples.",
    ],
    testCases: [
      { label: "open sky", args: [["S..", "...", "..E"]], expected: 4 },
      { label: "storm wall with a gap", args: [["S#.", ".#.", "...", ".#E"]], expected: 5 },
      { label: "no way through", args: [["S#E"]], expected: -1 },
      { label: "neighbours", args: [["SE"]], expected: 1 },
      { label: "switchback", args: [["S....", "####.", "E....", ".####", "....."]], expected: 10 },
      { label: "long detour", args: [["S.#...", "#.#.#.", "..#.#.", ".##.#.", "....#E"]], expected: 19 },
    ],
  },

  /* -------------------------------------------------------- JavaScript */
  {
    id: "habit-tracker",
    requires: ["js-arrays", "js-loop-control"],
    tier: "Guided",
    title: "Habit Tracker",
    desc: "Turn a row of ticks into streaks you can be proud of.",
    xp: 200,
    language: "JavaScript",
    instructions: `A habit app stores one boolean per day: \`true\` when you did the habit. Write \`trackHabit(days)\` that returns an object with three numbers:

- \`total\`: how many days were ticked
- \`longest\`: the longest run of ticked days in a row
- \`current\`: the run that is still going at the end of the list`,
    starter: code`function trackHabit(days) {
  let total = 0;
  let longest = 0;
  let current = 0;
  // Write your code here
  return { total, longest, current };
}`,
    functionName: "trackHabit",
    steps: [
      "Loop over `days` with `for...of`.",
      "On a ticked day, add one to `total` and one to `current`.",
      "After each ticked day, update `longest` with `Math.max(longest, current)`.",
      "On a missed day, reset `current` to 0.",
    ],
    hints: ["The run still going at the end is simply whatever `current` holds when the loop finishes."],
    testCases: [
      { label: "mixed week", args: [[true, true, false, true, true, true, false]], expected: { total: 5, longest: 3, current: 0 } },
      { label: "still going", args: [[false, true, true]], expected: { total: 2, longest: 2, current: 2 } },
      { label: "no days", args: [[]], expected: { total: 0, longest: 0, current: 0 } },
      { label: "every day", args: [[true, true, true, true]], expected: { total: 4, longest: 4, current: 4 } },
    ],
  },
  {
    id: "text-stats",
    requires: ["js-strings", "habit-tracker"],
    tier: "Guided",
    title: "Text Stats",
    desc: "A word counter like the one in every writing app.",
    xp: 220,
    language: "JavaScript",
    instructions: `Write \`textStats(text)\` that returns \`{ words, sentences, longestWord }\` for a piece of writing:

- \`words\`: the number of words, where words are separated by any amount of whitespace
- \`sentences\`: the number of sentences. A sentence ends with one or more of \`.\`, \`!\` or \`?\`, and a final sentence with no ending mark still counts
- \`longestWord\`: the longest word with punctuation stripped from its edges (the first one on a tie), or \`""\` for empty text`,
    starter: code`function textStats(text) {
  // Write your code here
  return { words: 0, sentences: 0, longestWord: "" };
}`,
    functionName: "textStats",
    steps: [
      "Split on whitespace with `text.trim().split(/\\s+/)` and drop empty strings.",
      "Split on `/[.!?]+/` and count the pieces that still contain text after trimming.",
      "Strip punctuation from each word with `replace(/^[^\\w']+|[^\\w']+$/g, \"\")` and keep the longest.",
    ],
    hints: ["`\"\".trim().split(/\\s+/)` gives `[\"\"]`, so filter out empty strings before counting."],
    testCases: [
      { label: "two sentences", args: ["The sky is wide. Clouds drift by!"], expected: { words: 7, sentences: 2, longestWord: "Clouds" } },
      { label: "empty text", args: [""], expected: { words: 0, sentences: 0, longestWord: "" } },
      { label: "no ending mark", args: ["just one thought"], expected: { words: 3, sentences: 1, longestWord: "thought" } },
      { label: "extra spaces and marks", args: ["  Wait...   what?!  Amazing. "], expected: { words: 3, sentences: 3, longestWord: "Amazing" } },
    ],
  },
  {
    id: "star-map",
    requires: ["js-objects", "text-stats"],
    tier: "Independent",
    title: "Star Map",
    desc: "Frame a constellation: find the box that holds every star.",
    xp: 320,
    language: "JavaScript",
    instructions: `To draw a constellation, the map needs to know how much sky to show. Write an arrow function \`getMapBounds(points)\` that takes an array of \`{ x, y }\` points and returns \`{ minX, maxX, minY, maxY, width, height }\`, where width and height are the size of the box.

An empty array returns a box of zeros.`,
    starter: code`const getMapBounds = (points) => {
  // Write your code here
  return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
};`,
    functionName: "getMapBounds",
    hints: [
      "`Math.min(...points.map((p) => p.x))` finds the smallest x in one line.",
      "Width is `maxX - minX`.",
    ],
    testCases: [
      { label: "three stars", args: [[{ x: 2, y: 5 }, { x: 8, y: 1 }, { x: -3, y: 4 }]], expected: { minX: -3, maxX: 8, minY: 1, maxY: 5, width: 11, height: 4 } },
      { label: "no stars", args: [[]], expected: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 } },
      { label: "one star", args: [[{ x: 4, y: -2 }]], expected: { minX: 4, maxX: 4, minY: -2, maxY: -2, width: 0, height: 0 } },
    ],
  },
  {
    id: "inventory-diff",
    requires: ["js-map-set", "star-map"],
    tier: "Independent",
    title: "Inventory Diff",
    desc: "Compare two stock counts and report exactly what changed.",
    xp: 340,
    language: "JavaScript",
    instructions: `A shop counts its stock twice a day. Each count is an object mapping item names to quantities. Write \`diffInventory(before, after)\` that returns:

- \`added\`: items that only exist in \`after\`
- \`removed\`: items that only exist in \`before\`
- \`changed\`: items in both whose quantity changed, as \`{ item, from, to }\`

Sort \`added\` and \`removed\` alphabetically, and sort \`changed\` by item name.`,
    starter: code`function diffInventory(before, after) {
  const added = [];
  const removed = [];
  const changed = [];
  // Write your code here
  return { added, removed, changed };
}`,
    functionName: "diffInventory",
    hints: [
      "`new Set([...Object.keys(before), ...Object.keys(after)])` gives every item name once.",
      "`key in before` tells you whether an item existed in the first count.",
    ],
    testCases: [
      {
        label: "a busy morning",
        args: [{ apples: 5, pears: 2, plums: 7 }, { apples: 3, plums: 7, kiwis: 4 }],
        expected: { added: ["kiwis"], removed: ["pears"], changed: [{ item: "apples", from: 5, to: 3 }] },
      },
      { label: "nothing changed", args: [{ tea: 1 }, { tea: 1 }], expected: { added: [], removed: [], changed: [] } },
      {
        label: "sorted output",
        args: [{ zinc: 1, iron: 2 }, { zinc: 4, iron: 1, gold: 1, copper: 3 }],
        expected: { added: ["copper", "gold"], removed: [], changed: [{ item: "iron", from: 2, to: 1 }, { item: "zinc", from: 1, to: 4 }] },
      },
    ],
  },
  {
    id: "mission-control",
    requires: ["js-higher-order-functions", "js-error-handling", "inventory-diff"],
    tier: "Capstone",
    title: "Mission Control",
    desc: "Run a rocket through a stream of commands, and refuse the unsafe ones.",
    xp: 600,
    language: "JavaScript",
    instructions: `Mission control sends a list of commands. Write \`runMission(commands)\` that starts with \`{ status: "ready", fuel: 0, altitude: 0 }\` and applies each command in order:

- \`{ type: "fuel", amount }\`: only while ready. Adds fuel, but the tank holds at most 100.
- \`{ type: "launch" }\`: only while ready and with at least 50 fuel. Status becomes \`"flying"\` and uses 50 fuel.
- \`{ type: "burn", amount }\`: only while flying and with enough fuel. Uses that much fuel and climbs 10 altitude per unit.
- \`{ type: "land" }\`: only while flying. Status becomes \`"landed"\` and altitude returns to 0.

Any command that breaks a rule, or has an unknown type, is rejected: the state stays the same and its index goes in a \`rejected\` list. Return the final state with \`rejected\` added.`,
    starter: code`function runMission(commands) {
  const state = { status: "ready", fuel: 0, altitude: 0 };
  const rejected = [];
  // Write your code here
  return { ...state, rejected };
}`,
    functionName: "runMission",
    steps: [
      "Loop with `commands.forEach((cmd, i) => ...)` so you have each index.",
      "Use a `switch` on `cmd.type` with one case per command.",
      "Inside each case, check the rules first. If one fails, push `i` to `rejected` and stop.",
      "Only change the state when every rule passes.",
    ],
    hints: [
      "Write a small `reject(i)` helper so every broken rule is handled the same way.",
      "`Math.min(100, state.fuel + cmd.amount)` keeps the tank from overflowing.",
    ],
    testCases: [
      {
        label: "a clean flight",
        args: [[{ type: "fuel", amount: 80 }, { type: "launch" }, { type: "burn", amount: 20 }, { type: "land" }]],
        expected: { status: "landed", fuel: 10, altitude: 0, rejected: [] },
      },
      {
        label: "launch without fuel",
        args: [[{ type: "launch" }, { type: "fuel", amount: 60 }, { type: "launch" }]],
        expected: { status: "flying", fuel: 10, altitude: 0, rejected: [0] },
      },
      {
        label: "tank caps at 100",
        args: [[{ type: "fuel", amount: 70 }, { type: "fuel", amount: 70 }]],
        expected: { status: "ready", fuel: 100, altitude: 0, rejected: [] },
      },
      {
        label: "unsafe burns and odd commands",
        args: [[{ type: "fuel", amount: 55 }, { type: "launch" }, { type: "burn", amount: 9 }, { type: "fuel", amount: 5 }, { type: "dance" }, { type: "burn", amount: 3 }]],
        expected: { status: "flying", fuel: 2, altitude: 30, rejected: [2, 3, 4] },
      },
      { label: "no commands", args: [[]], expected: { status: "ready", fuel: 0, altitude: 0, rejected: [] } },
    ],
  },

  /* -------------------------------------------------------- TypeScript */
  {
    id: "typed-inventory",
    requires: ["ts-interfaces"],
    tier: "Guided",
    title: "Typed Inventory",
    desc: "A restock report where the compiler checks every field.",
    xp: 220,
    language: "TypeScript",
    instructions: `The \`Item\` interface is written for you. Write \`restockReport(items, threshold)\` that returns a \`Report\`:

- \`low\`: names of items whose quantity is below the threshold, sorted alphabetically
- \`value\`: the total value of all stock (quantity times price), rounded to 2 decimal places

Keep the types: the function must accept \`Item[]\` and a \`number\`, and return \`Report\`.`,
    starter: code`interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Report {
  low: string[];
  value: number;
}

function restockReport(items: Item[], threshold: number): Report {
  // Write your code here
  return { low: [], value: 0 };
}`,
    functionName: "restockReport",
    steps: [
      "Use `filter` to keep items with `qty < threshold`, then `map` to their names.",
      "Sort the names with `.sort()`.",
      "Add up `qty * price` with `reduce`.",
      "Round with `Math.round(total * 100) / 100`.",
    ],
    testCases: [
      {
        label: "two items running low",
        args: [[{ name: "rope", qty: 2, price: 4.5 }, { name: "lamp", qty: 10, price: 12 }, { name: "map", qty: 1, price: 3.25 }], 5],
        expected: { low: ["map", "rope"], value: 132.25 },
      },
      { label: "empty shelf", args: [[], 3], expected: { low: [], value: 0 } },
      { label: "prices that need rounding", args: [[{ name: "gum", qty: 3, price: 0.1 }], 1], expected: { low: [], value: 0.3 } },
    ],
  },
  {
    id: "event-router",
    requires: ["ts-discriminated-unions", "typed-inventory"],
    tier: "Independent",
    title: "Event Router",
    desc: "Route clicks, keys and scrolls through one exhaustive switch.",
    xp: 340,
    language: "TypeScript",
    instructions: `An app emits three kinds of event, modelled as a discriminated union on \`kind\`. Write \`describeEvents(events)\` that turns each event into one line of text:

- click: \`click at (X, Y)\`
- key: \`key K\`, or \`shortcut Ctrl+K\` when \`ctrl\` is true
- scroll: \`scroll down N\` for a positive delta, \`scroll up N\` for a negative one (N is always positive)

Handle every kind in a \`switch\`, and finish with a \`never\` check so adding a fourth kind later becomes a compile error instead of a silent bug.`,
    starter: code`type AppEvent =
  | { kind: "click"; x: number; y: number }
  | { kind: "key"; key: string; ctrl: boolean }
  | { kind: "scroll"; delta: number };

function describeEvents(events: AppEvent[]): string[] {
  // Write your code here
  return [];
}`,
    functionName: "describeEvents",
    hints: [
      "Inside `case \"click\":`, TypeScript knows the event has `x` and `y`.",
      "In the `default` branch, `const unreachable: never = event;` proves every kind is handled.",
    ],
    testCases: [
      {
        label: "one of each",
        args: [[{ kind: "click", x: 10, y: 20 }, { kind: "key", key: "s", ctrl: true }, { kind: "scroll", delta: -40 }]],
        expected: ["click at (10, 20)", "shortcut Ctrl+s", "scroll up 40"],
      },
      { label: "plain key and scroll down", args: [[{ kind: "key", key: "Enter", ctrl: false }, { kind: "scroll", delta: 15 }]], expected: ["key Enter", "scroll down 15"] },
      { label: "no events", args: [[]], expected: [] },
    ],
  },
  {
    id: "typed-store",
    requires: ["ts-generics", "ts-utility-types", "event-router"],
    tier: "Capstone",
    title: "Typed Store",
    desc: "A tiny Redux-style store with typed actions and no mutation.",
    xp: 600,
    language: "TypeScript",
    instructions: `Most front-end apps keep their data in a store that changes only through actions. Write \`applyActions(initial, actions)\` that replays a list of actions over a to-do state and returns the final state.

- \`add\`: append a to-do \`{ id, text, done: false }\`, where id is one more than the highest id so far (1 for an empty list)
- \`toggle\`: flip \`done\` on the to-do with that id
- \`rename\`: change the text of the to-do with that id
- \`remove\`: delete the to-do with that id
- \`clearDone\`: delete every finished to-do

Actions that name an id that does not exist change nothing. Never mutate \`initial\` or the to-dos inside it: build new arrays and objects, the same rule React and Redux rely on.`,
    starter: code`interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface State {
  todos: Todo[];
}

type Action =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "rename"; id: number; text: string }
  | { type: "remove"; id: number }
  | { type: "clearDone" };

function reducer(state: State, action: Action): State {
  // Return a new state for each action type
  return state;
}

function applyActions(initial: State, actions: Action[]): State {
  return actions.reduce(reducer, initial);
}`,
    functionName: "applyActions",
    steps: [
      "Write `reducer` as a `switch` on `action.type`.",
      "For `add`, compute the next id with `Math.max(0, ...state.todos.map((t) => t.id)) + 1`.",
      "For `toggle` and `rename`, `map` over the to-dos and spread the one that matches: `{ ...t, done: !t.done }`.",
      "For `remove` and `clearDone`, use `filter`.",
      "`applyActions` is already done: `reduce` replays every action through your reducer.",
    ],
    hints: ["`Readonly<State>` on the reducer's parameter is a nice way to let the compiler catch accidental mutation."],
    testCases: [
      {
        label: "add, toggle, rename",
        args: [{ todos: [] }, [{ type: "add", text: "pack" }, { type: "add", text: "fly" }, { type: "toggle", id: 1 }, { type: "rename", id: 2, text: "fly high" }]],
        expected: { todos: [{ id: 1, text: "pack", done: true }, { id: 2, text: "fly high", done: false }] },
      },
      {
        label: "ids continue after the highest",
        args: [{ todos: [{ id: 7, text: "old", done: false }] }, [{ type: "add", text: "new" }, { type: "remove", id: 7 }]],
        expected: { todos: [{ id: 8, text: "new", done: false }] },
      },
      {
        label: "clearDone keeps open tasks",
        args: [{ todos: [{ id: 1, text: "a", done: true }, { id: 2, text: "b", done: false }, { id: 3, text: "c", done: true }] }, [{ type: "clearDone" }, { type: "add", text: "d" }]],
        expected: { todos: [{ id: 2, text: "b", done: false }, { id: 3, text: "d", done: false }] },
      },
      {
        label: "unknown ids change nothing",
        args: [{ todos: [{ id: 1, text: "a", done: false }] }, [{ type: "toggle", id: 9 }, { type: "rename", id: 9, text: "z" }, { type: "remove", id: 9 }]],
        expected: { todos: [{ id: 1, text: "a", done: false }] },
      },
      { label: "no actions", args: [{ todos: [] }, []], expected: { todos: [] } },
    ],
  },
];
