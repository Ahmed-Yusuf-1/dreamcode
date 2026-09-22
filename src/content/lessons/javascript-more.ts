import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";

/**
 * JavaScript lessons added in the second curriculum pass: the fundamentals the
 * first release skipped, through functions and classes.
 */
export const javascriptMoreLessons: Lesson[] = [
  {
    slug: "js-numbers-math",
    order: 2,
    chapter: "JS Basics",
    kicker: "JS BASICS",
    title: "Numbers and Math",
    catalogTitle: "Numbers & Math",
    blurb: "Do arithmetic, round, and reach for the Math helpers.",
    catalogCode: "Math.floor(minutes / 60)",
    language: "javascript",
    intro:
      "JavaScript has one **number** type for whole numbers and decimals alike. Use `+`, `-`, `*` and `/` for arithmetic, `%` for the remainder and `**` for powers. The built-in **Math** object has the helpers: `Math.round`, `Math.floor`, `Math.max`, `Math.random` and more. One surprise: `0.1 + 0.2` is not exactly `0.3`, because decimals are stored in binary.",
    example: code`const stars = 17;
const groups = 5;

console.log(stars / groups);
console.log(Math.floor(stars / groups));
console.log(stars % groups);
console.log(2 ** 10);
console.log(Math.max(4, 9, 2));
console.log((0.1 + 0.2).toFixed(2));`,
    reads: [
      { dot: DOT_PINK, text: "`/` keeps the decimals; `Math.floor` rounds down to a whole number" },
      { dot: DOT_MINT, text: "`%` gives the remainder, so `17 % 5` is **2**" },
      { dot: DOT_LAVENDER, text: "`.toFixed(2)` turns a number into text with two decimal places" },
    ],
    tip: "`n % 2 === 0` checks whether a number is even.",
    mistakes: [
      "`\"5\" + 3` is `\"53\"`: `+` joins text whenever either side is a string.",
      "`0.1 + 0.2 === 0.3` is false. Round before comparing decimals.",
    ],
    starter: code`const minutes = 135;
const hours = Math.floor(minutes / 60);
console.log(hours);`,
    task: {
      prompt: "Also print how many minutes are left after the whole hours. The program should print `2` and then `15`.",
      expectOutput: ["2", "15"],
      mustInclude: ["%"],
      hint: "The remainder operator gives what is left over: `minutes % 60`.",
      solution: code`const minutes = 135;
const hours = Math.floor(minutes / 60);
console.log(hours);
console.log(minutes % 60);`,
    },
    practiceSlug: "js-numbers-math",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-strings",
    order: 3,
    chapter: "JS Basics",
    kicker: "JS BASICS",
    title: "Strings and Template Literals",
    catalogTitle: "Strings",
    blurb: "Build text with template literals and clean it up with string methods.",
    catalogCode: "`${name} has ${moons} moons`",
    language: "javascript",
    intro:
      "Wrap text in backticks to make a **template literal**: anything inside `${...}` is worked out and dropped into the string. Strings also come with methods: `.toUpperCase()`, `.trim()`, `.includes()`, `.split()`, `.replace()`, and the `.length` property counts characters. String methods return a new string; the original never changes.",
    example: code`const name = "Nova";
const stars = 3;
console.log(\`\${name} saw \${stars} shooting stars\`);

const raw = "  cloudy with a chance of stars  ";
const clean = raw.trim();
console.log(clean.toUpperCase());
console.log(clean.includes("stars"), clean.length);
console.log(clean.split(" "));`,
    reads: [
      { dot: DOT_PINK, text: "Backticks plus `${...}` drop values straight into text" },
      { dot: DOT_MINT, text: "`.trim()` removes spaces from both ends" },
      { dot: DOT_LAVENDER, text: "`.split(\" \")` breaks text into an array of words" },
    ],
    tip: "Template literals can span several lines, which makes them handy for longer messages.",
    mistakes: ["Using normal quotes with `${name}` prints the braces literally. Only backticks switch them on."],
    starter: code`const planet = "Mars";
const moons = 2;
console.log("The planet is " + planet);`,
    task: {
      prompt: "Use a template literal to print exactly `Mars has 2 moons`, using both variables.",
      expectOutput: ["Mars has 2 moons"],
      mustInclude: ["`[^`]*\\$\\{"],
      hint: "Wrap the text in backticks and put each variable in `${...}`.",
      solution: code`const planet = "Mars";
const moons = 2;
console.log(\`\${planet} has \${moons} moons\`);`,
    },
    practiceSlug: "js-strings",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-type-conversion",
    order: 4,
    chapter: "JS Basics",
    kicker: "JS BASICS",
    title: "Types and Conversion",
    catalogTitle: "Type conversion",
    blurb: "Check types with typeof and convert with Number(), String() and Boolean().",
    catalogCode: 'Number("42") + 1',
    language: "javascript",
    intro:
      "`typeof` tells you what kind of value you have: `\"number\"`, `\"string\"`, `\"boolean\"`, `\"object\"` or `\"undefined\"`. Convert on purpose with `Number(\"42\")`, `String(42)` and `Boolean(value)`. JavaScript also converts automatically in some places, which surprises people: `\"5\" * 2` is `10`, but `\"5\" + 2` is `\"52\"`. The values `0`, `\"\"`, `null`, `undefined` and `NaN` are **falsy**; everything else is truthy.",
    example: code`console.log(typeof 42, typeof "42", typeof true);
console.log(Number("42") + 1);
console.log(String(42) + 1);
console.log("5" * 2, "5" + 2);
console.log(Number("sky"));
console.log(Boolean(""), Boolean("hi"), Boolean(0));`,
    reads: [
      { dot: DOT_PINK, text: "`Number(\"sky\")` cannot convert, so it gives **NaN** (not a number)" },
      { dot: DOT_MINT, text: "`*` always does maths, but `+` joins text if either side is a string" },
      { dot: DOT_LAVENDER, text: "Empty text and 0 are falsy, so `Boolean(\"\")` is false" },
    ],
    tip: "Convert input explicitly with `Number(...)` as soon as you receive it, instead of relying on automatic conversion later.",
    starter: code`const apples = "4";
const pears = "6";
console.log(apples + pears);`,
    task: {
      prompt: "Change the last line so it prints the real total, `10`.",
      expectOutput: ["10"],
      mustInclude: ["Number\\("],
      hint: "Convert each one with `Number()` before adding.",
      solution: code`const apples = "4";
const pears = "6";
console.log(Number(apples) + Number(pears));`,
    },
    practiceSlug: "js-type-conversion",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-switch",
    order: 11,
    chapter: "JS Conditionals & Logic",
    kicker: "JS LOGIC",
    title: "Switch Statements",
    catalogTitle: "Switch",
    blurb: "Pick one of many branches by matching a value.",
    catalogCode: 'case "full":',
    language: "javascript",
    intro:
      "A **switch** compares one value against several `case` labels using `===` and runs the matching block. End each case with `break`, or execution falls through into the next case. A `default` case runs when nothing matches. Stacking two cases with no code between them lets both share one block.",
    example: code`const phase = "full";

switch (phase) {
  case "new":
    console.log("Dark sky");
    break;
  case "half":
    console.log("Half lit");
    break;
  case "full":
    console.log("Bright night");
    break;
  default:
    console.log("Unknown phase");
}`,
    reads: [
      { dot: DOT_PINK, text: "Each `case` is compared with `===` against `phase`" },
      { dot: DOT_MINT, text: "`break` stops the switch after the matching block" },
      { dot: DOT_LAVENDER, text: "`default` catches every value no case matched" },
    ],
    tip: "A switch reads well when you compare one value against many fixed options. For ranges like `score > 90`, use if and else if.",
    mistakes: ["Forgetting `break` makes the code fall through and run the next case too."],
    starter: code`const day = "sat";

switch (day) {
  case "mon":
    console.log("Work day");
    break;
  default:
    console.log("Some day");
}`,
    task: {
      prompt: "Add cases so both `\"sat\"` and `\"sun\"` print `Weekend`. Stack the two cases so they share one block.",
      expectOutput: ["Weekend"],
      mustInclude: ["case\\s+[\"']sat[\"']", "case\\s+[\"']sun[\"']"],
      hint: "Write `case \"sat\":` and `case \"sun\":` on consecutive lines, then the log and a `break`.",
      solution: code`const day = "sat";

switch (day) {
  case "mon":
    console.log("Work day");
    break;
  case "sat":
  case "sun":
    console.log("Weekend");
    break;
  default:
    console.log("Some day");
}`,
    },
    practiceSlug: "js-switch",
    module: "JS Conditionals & Logic",
    tier: "beginner",
  },
  {
    slug: "js-while-loops",
    order: 13,
    chapter: "JS Collections & Loops",
    kicker: "JS LOOPS",
    title: "While Loops",
    catalogTitle: "While loops",
    blurb: "Repeat while a condition stays true.",
    catalogCode: "while (fuel > 0) { ... }",
    language: "javascript",
    intro:
      "A **while** loop repeats its block for as long as the condition is true, checking before every pass. Use it when you do not know in advance how many times to loop. Something inside the loop must change the condition, or it never ends. A `do...while` loop runs its block once before the first check.",
    example: code`let fuel = 10;
let hops = 0;
while (fuel > 0) {
  fuel -= 3;
  hops++;
}
console.log(hops, fuel);

let tries = 0;
do {
  tries++;
} while (tries < 1);
console.log(tries);`,
    reads: [
      { dot: DOT_PINK, text: "The condition is checked before each pass, so the loop may run zero times" },
      { dot: DOT_MINT, text: "`fuel -= 3` moves the loop toward its end" },
      { dot: DOT_LAVENDER, text: "`do...while` always runs at least once" },
    ],
    tip: "If the runner stops your code for running too long, look for a while loop whose condition never becomes false.",
    starter: code`let n = 1;
console.log(n);`,
    task: {
      prompt: "Use a while loop to keep doubling `n` while it is 100 or less, then print it: `128`.",
      expectOutput: ["128"],
      mustInclude: ["while\\s*\\("],
      hint: "`while (n <= 100) { n = n * 2; }` and then log n after the loop.",
      solution: code`let n = 1;
while (n <= 100) {
  n = n * 2;
}
console.log(n);`,
    },
    practiceSlug: "js-while-loops",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-loop-control",
    order: 14,
    chapter: "JS Collections & Loops",
    kicker: "JS LOOPS",
    title: "Break and Continue",
    catalogTitle: "Break & continue",
    blurb: "Skip a pass with continue or leave the loop early with break.",
    catalogCode: "if (n > 7) break;",
    language: "javascript",
    intro:
      "Inside any loop, `continue` skips the rest of the current pass and moves on to the next one, and `break` leaves the loop completely. They keep loops simple: skip what you do not care about, and stop as soon as you have your answer.",
    example: code`for (let n = 1; n <= 10; n++) {
  if (n % 2 === 0) continue;
  if (n > 7) break;
  console.log(n);
}`,
    reads: [
      { dot: DOT_PINK, text: "`continue` skips even numbers without stopping the loop" },
      { dot: DOT_MINT, text: "`break` ends the loop entirely once n passes 7" },
      { dot: DOT_LAVENDER, text: "Both work in `for`, `for...of` and `while` loops" },
    ],
    tip: "Searching for the first match? `break` as soon as you find it and skip the rest of the work.",
    starter: code`const readings = [4, 7, -1, 9, 12, 3];
for (const r of readings) {
  console.log(r);
}`,
    task: {
      prompt: "Skip negative readings with `continue`, and stop the loop with `break` as soon as a reading is above 10. The output should be exactly `4`, `7`, `9`.",
      expectOutput: ["4", "7", "9"],
      exact: true,
      mustInclude: ["continue", "break"],
      hint: "Inside the loop: `if (r < 0) continue;` then `if (r > 10) break;` then log r.",
      solution: code`const readings = [4, 7, -1, 9, 12, 3];
for (const r of readings) {
  if (r < 0) continue;
  if (r > 10) break;
  console.log(r);
}`,
    },
    practiceSlug: "js-loop-control",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-sorting",
    order: 18,
    chapter: "JS Collections Depth",
    kicker: "JS COLLECTIONS",
    title: "Sorting Arrays",
    catalogTitle: "Sorting",
    blurb: "Sort numbers and objects correctly with a compare function.",
    catalogCode: "nums.sort((a, b) => a - b)",
    language: "javascript",
    intro:
      "`array.sort()` sorts **in place** and, by default, compares items as **strings**, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. Pass a **compare function** to sort properly: `(a, b) => a - b` sorts numbers ascending, `(a, b) => b - a` descending, and `a.name.localeCompare(b.name)` sorts text alphabetically. Copy first with `[...arr]` when you need to keep the original order.",
    example: code`const nums = [10, 9, 1, 25];
console.log([...nums].sort());
console.log([...nums].sort((a, b) => a - b));

const stars = [
  { name: "Vega", mag: 0.03 },
  { name: "Sirius", mag: -1.46 },
  { name: "Deneb", mag: 1.25 },
];
stars.sort((a, b) => a.mag - b.mag);
console.log(stars.map((s) => s.name));`,
    reads: [
      { dot: DOT_PINK, text: "Without a compare function, numbers are sorted as text" },
      { dot: DOT_MINT, text: "A negative result puts `a` first, a positive result puts `b` first" },
      { dot: DOT_LAVENDER, text: "Objects sort by whatever the compare function compares" },
    ],
    tip: "Always pass a compare function when sorting numbers. It is one of the most common JavaScript bugs.",
    mistakes: ["`sort()` changes the original array. Copy it first if other code still needs the old order."],
    starter: code`const scores = [42, 7, 100, 18];
console.log(scores.sort());`,
    task: {
      prompt: "Sort the scores from highest to lowest as numbers and print them: `[ 100, 42, 18, 7 ]`.",
      expectOutput: ["[ 100, 42, 18, 7 ]"],
      mustInclude: ["b\\s*-\\s*a"],
      hint: "A compare function of `(a, b) => b - a` sorts descending.",
      solution: code`const scores = [42, 7, 100, 18];
console.log(scores.sort((a, b) => b - a));`,
    },
    practiceSlug: "js-sorting",
    module: "JS Collections Depth",
    tier: "intermediate",
  },
  {
    slug: "js-map-set",
    order: 22,
    chapter: "JS Collections Depth",
    kicker: "JS COLLECTIONS",
    title: "Map and Set",
    catalogTitle: "Map & Set",
    blurb: "Keyed collections with any key type, and collections of unique values.",
    catalogCode: "new Map([[key, value]])",
    language: "javascript",
    intro:
      "A **Set** holds unique values: adding a duplicate does nothing, and `.has()` checks membership quickly. A **Map** stores key-value pairs like an object, but its keys can be any type, it remembers insertion order, and it has a `.size`. Use `.set`, `.get`, `.has` and `.delete`, and loop with `for (const [key, value] of map)`.",
    example: code`const seen = new Set(["vega", "rigel", "vega"]);
seen.add("deneb");
console.log(seen.size, seen.has("rigel"));

const visits = new Map();
visits.set("Mars", 2);
visits.set("Venus", 1);
visits.set("Mars", visits.get("Mars") + 1);
for (const [planet, count] of visits) {
  console.log(planet, count);
}

console.log([...new Set([3, 1, 3, 2, 1])]);`,
    reads: [
      { dot: DOT_PINK, text: "The duplicate \"vega\" is ignored, so the set has **3** items" },
      { dot: DOT_MINT, text: "`visits.get(\"Mars\") + 1` reads, updates and writes back a count" },
      { dot: DOT_LAVENDER, text: "`[...new Set(array)]` is the quickest way to remove duplicates" },
    ],
    tip: "Reach for a Map when keys are added and removed often, or are not strings. Plain objects are fine for fixed shapes.",
    starter: code`const words = ["sun", "moon", "sun", "star", "sun"];
console.log(words.length);`,
    task: {
      prompt: "Count each word with a `Map`, then print one line per word in the order first seen: `sun 3`, `moon 1`, `star 1`.",
      expectOutput: ["sun 3", "moon 1", "star 1"],
      mustInclude: ["new Map"],
      hint: "For each word, `counts.set(word, (counts.get(word) || 0) + 1)`. Then loop over the map.",
      solution: code`const words = ["sun", "moon", "sun", "star", "sun"];
const counts = new Map();
for (const word of words) {
  counts.set(word, (counts.get(word) || 0) + 1);
}
for (const [word, count] of counts) {
  console.log(word, count);
}`,
    },
    practiceSlug: "js-map-set",
    module: "JS Collections Depth",
    tier: "intermediate",
  },
  {
    slug: "js-json",
    order: 23,
    chapter: "JS Collections Depth",
    kicker: "JS COLLECTIONS",
    title: "JSON",
    catalogTitle: "JSON",
    blurb: "Turn objects into JSON text and back with JSON.stringify and JSON.parse.",
    catalogCode: "JSON.parse(text)",
    language: "javascript",
    intro:
      "**JSON** is how data travels between programs and across the web. `JSON.stringify(value)` turns an object or array into JSON text, and `JSON.parse(text)` turns JSON text back into a value. Pass extra arguments like `JSON.stringify(data, null, 2)` for readable, indented output. Functions and `undefined` values are left out of the text.",
    example: code`const report = { city: "Lumen", temps: [18, 21], clear: true };
const text = JSON.stringify(report);
console.log(text);

const back = JSON.parse('{"city":"Nimbus","temps":[12,14]}');
console.log(back.city, back.temps[1]);
console.log(JSON.stringify({ a: 1, skip: undefined }));`,
    reads: [
      { dot: DOT_PINK, text: "`stringify` produces text with double-quoted keys" },
      { dot: DOT_MINT, text: "`parse` gives you a normal object you can read with dots" },
      { dot: DOT_LAVENDER, text: "`undefined` properties disappear from the JSON" },
    ],
    tip: "`JSON.parse` throws on invalid text. Wrap it in try...catch when the text comes from outside your program.",
    starter: code`const raw = '{"pilot":"Nova","hours":42}';
console.log(raw);`,
    task: {
      prompt: "Parse `raw` with `JSON.parse` and print just the hours: `42`.",
      expectOutput: ["42"],
      mustInclude: ["JSON\\.parse\\("],
      hint: "`const data = JSON.parse(raw);` then log `data.hours`.",
      solution: code`const raw = '{"pilot":"Nova","hours":42}';
const data = JSON.parse(raw);
console.log(data.hours);`,
    },
    practiceSlug: "js-json",
    module: "JS Collections Depth",
    tier: "intermediate",
  },
  {
    slug: "js-higher-order-functions",
    order: 26,
    chapter: "JS Functions and Classes",
    kicker: "JS FUNCTIONS",
    title: "Higher-Order Functions",
    catalogTitle: "Higher-order",
    blurb: "Functions that take or return other functions.",
    catalogCode: "const once = (fn) => ...",
    language: "javascript",
    intro:
      "A **higher-order function** takes a function as an argument, returns one, or both. You already use them: `map`, `filter` and `forEach` all take a function. Writing your own lets you capture a pattern once, such as \"do this n times\" or \"only run this once\", and reuse it with any behaviour plugged in.",
    example: code`const repeat = (times, action) => {
  for (let i = 1; i <= times; i++) action(i);
};
repeat(3, (i) => console.log("hop", i));

const once = (fn) => {
  let done = false;
  return (...args) => {
    if (done) return undefined;
    done = true;
    return fn(...args);
  };
};

const launch = once((name) => \`\${name} launched\`);
console.log(launch("Nova"));
console.log(launch("Nova"));`,
    reads: [
      { dot: DOT_PINK, text: "`repeat` takes the action as a parameter and calls it" },
      { dot: DOT_MINT, text: "`once` returns a new function that remembers whether it already ran" },
      { dot: DOT_LAVENDER, text: "`...args` forwards whatever arguments the caller passes" },
    ],
    tip: "When two functions differ only in one small step, pass that step in as a function.",
    starter: code`const numbers = [1, 2, 3, 4];
console.log(numbers);`,
    task: {
      prompt: "Write `applyTwice(fn, x)` that returns `fn(fn(x))`, then print `applyTwice((n) => n * 3, 2)`: `18`.",
      expectOutput: ["18"],
      mustInclude: ["applyTwice"],
      hint: "`const applyTwice = (fn, x) => fn(fn(x));`",
      solution: code`const applyTwice = (fn, x) => fn(fn(x));
console.log(applyTwice((n) => n * 3, 2));`,
    },
    practiceSlug: "js-higher-order-functions",
    module: "JS Functions and Classes",
    tier: "intermediate",
  },
  {
    slug: "js-inheritance",
    order: 29,
    chapter: "JS Functions and Classes",
    kicker: "JS CLASSES",
    title: "Class Inheritance",
    catalogTitle: "Inheritance",
    blurb: "Extend a class with extends and super.",
    catalogCode: "class Comet extends SpaceObject",
    language: "javascript",
    intro:
      "`class Comet extends SpaceObject` creates a class that inherits every method of `SpaceObject`. In the child's constructor, call `super(...)` before you use `this`. Override a method by defining it again, and reach the parent's version with `super.method()`. `instanceof` checks the whole chain of parents.",
    example: code`class SpaceObject {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return \`\${this.name} drifts through space\`;
  }
}

class Comet extends SpaceObject {
  constructor(name, tailKm) {
    super(name);
    this.tailKm = tailKm;
  }
  describe() {
    return \`\${super.describe()} with a \${this.tailKm} km tail\`;
  }
}

const halley = new Comet("Halley", 10000);
console.log(halley.describe());
console.log(halley instanceof SpaceObject);`,
    reads: [
      { dot: DOT_PINK, text: "`extends` sets up the parent class" },
      { dot: DOT_MINT, text: "`super(name)` runs the parent constructor first" },
      { dot: DOT_LAVENDER, text: "`super.describe()` calls the version the child is overriding" },
    ],
    tip: "Keep inheritance shallow. One or two levels is easy to follow; five is a maze.",
    mistakes: ["Using `this` in a child constructor before calling `super()` throws a ReferenceError."],
    starter: code`class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound\`;
  }
}

console.log(new Animal("Rex").speak());`,
    task: {
      prompt: "Add a `Dog` class that extends `Animal` and overrides `speak` so `new Dog(\"Rex\").speak()` returns `Rex says woof`. Print it.",
      expectOutput: ["Rex says woof"],
      mustInclude: ["class\\s+Dog\\s+extends\\s+Animal"],
      hint: "Dog does not need its own constructor; it inherits Animal's. Just define `speak()`.",
      solution: code`class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a sound\`;
  }
}

class Dog extends Animal {
  speak() {
    return \`\${this.name} says woof\`;
  }
}

console.log(new Dog("Rex").speak());`,
    },
    practiceSlug: "js-inheritance",
    module: "JS Functions and Classes",
    tier: "intermediate",
  },
  {
    slug: "js-this-binding",
    order: 30,
    chapter: "JS Functions and Classes",
    kicker: "JS FUNCTIONS",
    title: "Understanding this",
    catalogTitle: "this",
    blurb: "Learn what this points to, and why arrow functions behave differently.",
    catalogCode: "[1, 2].map((n) => this.name)",
    language: "javascript",
    intro:
      "`this` is decided by **how a function is called**. Called as `obj.method()`, `this` is `obj`. Pull the method out and call it on its own, and `this` is lost. **Arrow functions** do not have their own `this`; they use the `this` of the code around them, which makes them ideal for callbacks inside methods. `fn.bind(obj)` returns a copy of a function with `this` locked to `obj`.",
    example: code`const ship = {
  name: "Nova",
  greet() {
    return \`I am \${this.name}\`;
  },
  countdown() {
    return [3, 2, 1].map((n) => \`\${this.name} \${n}\`);
  },
};

console.log(ship.greet());
console.log(ship.countdown());

const bound = ship.greet.bind({ name: "Luka" });
console.log(bound());`,
    reads: [
      { dot: DOT_PINK, text: "`ship.greet()` is called on ship, so `this` is ship" },
      { dot: DOT_MINT, text: "The arrow callback in `countdown` borrows `this` from the method" },
      { dot: DOT_LAVENDER, text: "`bind` makes a new function whose `this` is fixed" },
    ],
    tip: "Inside a method, use an arrow function for any callback that needs `this`.",
    mistakes: ["A regular `function` callback inside a method gets its own `this`, so `this.count` no longer points at your object."],
    starter: code`const counter = {
  count: 0,
  start() {
    [1, 2, 3].forEach(function () {
      this.count++;
    });
    return this.count;
  },
};

console.log(counter.start());`,
    task: {
      prompt: "The callback loses `this`, so the count stays at 0. Rewrite the callback as an arrow function so `start()` counts all three items and prints `3`.",
      expectOutput: ["3"],
      mustInclude: ["forEach\\(\\s*\\(\\s*\\)\\s*=>"],
      hint: "Change `function () {` to `() => {`.",
      solution: code`const counter = {
  count: 0,
  start() {
    [1, 2, 3].forEach(() => {
      this.count++;
    });
    return this.count;
  },
};

console.log(counter.start());`,
    },
    practiceSlug: "js-this-binding",
    module: "JS Functions and Classes",
    tier: "intermediate",
  },
];
