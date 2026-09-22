import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";

/** TypeScript lessons added in the second curriculum pass. */
export const typescriptMoreLessons: Lesson[] = [
  {
    slug: "ts-type-inference",
    order: 2,
    chapter: "TS Basics",
    kicker: "TS BASICS",
    title: "Type Inference",
    catalogTitle: "Inference",
    blurb: "Let TypeScript work out types from your values.",
    catalogCode: "let stars = 100; // number",
    language: "typescript",
    intro:
      "You rarely need to annotate everything. TypeScript **infers** types from values: `let stars = 100` is a `number` with no annotation at all, and a function's return type is inferred from what it returns. Once a variable's type is inferred it is fixed, so assigning text to `stars` later is an error. Annotate function **parameters** (they cannot be inferred) and places where you want to state your intent.",
    example: code`let stars = 100;
const planet = "Mars";
const moons = [1, 2];

function double(n: number) {
  return n * 2;
}

const result = double(stars);
console.log(typeof stars, typeof planet, Array.isArray(moons), result);`,
    reads: [
      { dot: DOT_PINK, text: "`stars` is inferred as `number` from its first value" },
      { dot: DOT_MINT, text: "`double` has no return annotation, but TypeScript knows it returns a number" },
      { dot: DOT_LAVENDER, text: "Parameters like `n` still need an annotation" },
    ],
    tip: "Let inference handle local variables, and annotate the edges: parameters and public function return types.",
    mistakes: ["`let x;` with no value and no annotation becomes `any`, and TypeScript stops checking it. Give it a type or a starting value."],
    starter: code`let count = 3;
console.log(count);`,
    task: {
      prompt: "Write a function `describe(name: string, moons: number)`, without a return annotation, that returns a sentence. Log `describe(\"Mars\", 2)`: `Mars has 2 moons`.",
      expectOutput: ["Mars has 2 moons"],
      mustInclude: ["function\\s+describe\\s*\\(\\s*name\\s*:\\s*string"],
      hint: "Return a template literal: `${name} has ${moons} moons`.",
      solution: code`function describe(name: string, moons: number) {
  return \`\${name} has \${moons} moons\`;
}

console.log(describe("Mars", 2));`,
    },
    practiceSlug: "ts-type-inference",
    module: "TS Basics",
    tier: "beginner",
  },
  {
    slug: "ts-object-types",
    order: 5,
    chapter: "TS Basics",
    kicker: "TS BASICS",
    title: "Object Types and Optional Properties",
    catalogTitle: "Object types",
    blurb: "Describe an object's shape and mark some properties as optional.",
    catalogCode: "{ name: string; mag?: number }",
    language: "typescript",
    intro:
      "You can describe an object's shape right where you use it: `star: { name: string; mag?: number }`. A `?` makes a property **optional**: it may be missing, so its type includes `undefined`, and TypeScript makes you check before using it. Object literals are checked exactly: a missing required property and a misspelled extra one are both errors.",
    example: code`function describe(star: { name: string; mag?: number }) {
  if (star.mag === undefined) {
    return \`\${star.name}: brightness unknown\`;
  }
  return \`\${star.name}: magnitude \${star.mag}\`;
}

console.log(describe({ name: "Vega", mag: 0.03 }));
console.log(describe({ name: "Nova" }));`,
    reads: [
      { dot: DOT_PINK, text: "`mag?: number` means the property can be left out" },
      { dot: DOT_MINT, text: "Checking `=== undefined` narrows `mag` to a plain number afterwards" },
      { dot: DOT_LAVENDER, text: "When the shape is used in many places, give it a name with an interface" },
    ],
    tip: "`value ?? fallback` supplies a default only when the value is `null` or `undefined`.",
    starter: code`function label(planet: { name: string }) {
  return planet.name;
}

console.log(label({ name: "Mars" }));`,
    task: {
      prompt: "Add an optional `moons?: number` to the parameter type, and make `label` return `Mars (2 moons)` when moons is given. Log `label({ name: \"Mars\", moons: 2 })`.",
      expectOutput: ["Mars (2 moons)"],
      mustInclude: ["moons\\?\\s*:\\s*number"],
      hint: "Check `planet.moons === undefined` before building the longer text.",
      solution: code`function label(planet: { name: string; moons?: number }) {
  if (planet.moons === undefined) return planet.name;
  return \`\${planet.name} (\${planet.moons} moons)\`;
}

console.log(label({ name: "Mars", moons: 2 }));`,
    },
    practiceSlug: "ts-object-types",
    module: "TS Basics",
    tier: "beginner",
  },
  {
    slug: "ts-type-guards",
    order: 8,
    chapter: "TS Unions & Enums",
    kicker: "TS UNIONS",
    title: "Type Guards",
    catalogTitle: "Type guards",
    blurb: "Narrow unions with typeof, in, instanceof and your own guard functions.",
    catalogCode: "function isFish(p): p is Fish",
    language: "typescript",
    intro:
      "TypeScript narrows a union whenever you check it: `typeof x === \"string\"`, `\"swim\" in pet`, or `value instanceof Date`. When the check is too involved for that, write a **type guard**: a function whose return type is `pet is Fish`. Wherever it returns true, TypeScript treats the value as a Fish.",
    example: code`interface Fish {
  swim: () => string;
}
interface Bird {
  fly: () => string;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

function move(pet: Fish | Bird) {
  return isFish(pet) ? pet.swim() : pet.fly();
}

console.log(move({ swim: () => "splash" }));
console.log(move({ fly: () => "whoosh" }));`,
    reads: [
      { dot: DOT_PINK, text: "`pet is Fish` tells TypeScript what a true result means" },
      { dot: DOT_MINT, text: "In the true branch, `pet.swim()` is allowed; in the false branch, only Bird is left" },
      { dot: DOT_LAVENDER, text: "`\"swim\" in pet` checks for the property at run time" },
    ],
    tip: "A type guard is only as honest as its body. If the check is wrong, TypeScript will trust it anyway.",
    starter: code`type Reading = number | string;

function toCelsius(r: Reading) {
  return r;
}

console.log(toCelsius(21));`,
    task: {
      prompt: "Write a type guard `isNumber(r: Reading): r is number`. Make `toCelsius` return numbers unchanged and parse text like `\"19C\"` with `parseFloat`, returning a `number`. Log `toCelsius(\"19C\") + 1`: `20`.",
      expectOutput: ["20"],
      mustInclude: ["r\\s+is\\s+number"],
      hint: "`return isNumber(r) ? r : parseFloat(r);` and annotate `toCelsius` to return `number`.",
      solution: code`type Reading = number | string;

function isNumber(r: Reading): r is number {
  return typeof r === "number";
}

function toCelsius(r: Reading): number {
  return isNumber(r) ? r : parseFloat(r);
}

console.log(toCelsius("19C") + 1);`,
    },
    practiceSlug: "ts-type-guards",
    module: "TS Unions & Enums",
    tier: "intermediate",
  },
  {
    slug: "ts-discriminated-unions",
    order: 9,
    chapter: "TS Unions & Enums",
    kicker: "TS UNIONS",
    title: "Discriminated Unions",
    catalogTitle: "Tagged unions",
    blurb: "Model one-of-several shapes with a shared tag and handle every case.",
    catalogCode: 'switch (shape.kind) { case "circle": ... }',
    language: "typescript",
    intro:
      "A **discriminated union** is a union of object types that share one literal property, the **tag**, such as `kind: \"circle\"` or `kind: \"square\"`. Checking the tag narrows to exactly one member, so each branch knows which properties exist. Add a `never` check in the `default` branch and TypeScript will flag any member you forget to handle.",
    example: code`type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rect"; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.round(Math.PI * s.radius ** 2);
    case "square":
      return s.side ** 2;
    case "rect":
      return s.w * s.h;
    default: {
      const unreachable: never = s;
      return unreachable;
    }
  }
}

console.log(area({ kind: "circle", radius: 2 }), area({ kind: "square", side: 3 }), area({ kind: "rect", w: 2, h: 5 }));`,
    reads: [
      { dot: DOT_PINK, text: "`kind` is the tag every member shares" },
      { dot: DOT_MINT, text: "Inside `case \"circle\"`, only `radius` is available" },
      { dot: DOT_LAVENDER, text: "Assigning to `never` fails to compile if a case was missed" },
    ],
    tip: "Tagged unions are the TypeScript way to model states: loading, success, error. Each state carries only the data that makes sense for it.",
    starter: code`type MissionEvent =
  | { type: "launch"; rocket: string }
  | { type: "land"; rocket: string; site: string };

function describe(e: MissionEvent): string {
  switch (e.type) {
    case "launch":
      return \`\${e.rocket} launched\`;
    default:
      return "unknown";
  }
}

console.log(describe({ type: "land", rocket: "Nova", site: "Moon" }));`,
    task: {
      prompt: "Handle the `\"land\"` case so it returns `Nova landed on Moon` for the event in the starter.",
      expectOutput: ["Nova landed on Moon"],
      mustInclude: ["case\\s+[\"']land[\"']"],
      hint: "Inside the land case, `e.site` is available because the tag narrowed the type.",
      solution: code`type MissionEvent =
  | { type: "launch"; rocket: string }
  | { type: "land"; rocket: string; site: string };

function describe(e: MissionEvent): string {
  switch (e.type) {
    case "launch":
      return \`\${e.rocket} launched\`;
    case "land":
      return \`\${e.rocket} landed on \${e.site}\`;
    default:
      return "unknown";
  }
}

console.log(describe({ type: "land", rocket: "Nova", site: "Moon" }));`,
    },
    practiceSlug: "ts-discriminated-unions",
    module: "TS Unions & Enums",
    tier: "intermediate",
  },
  {
    slug: "ts-generic-constraints",
    order: 14,
    chapter: "TS Advanced",
    kicker: "TS ADVANCED",
    title: "Generic Constraints",
    catalogTitle: "Constraints",
    blurb: "Require a shape from a generic type with extends.",
    catalogCode: "<T extends { length: number }>",
    language: "typescript",
    intro:
      "A plain `<T>` accepts any type, which means you cannot use any of its properties. Add a **constraint** with `extends` to require a shape: `<T extends { length: number }>` accepts strings, arrays and anything else with a length. `<K extends keyof T>` limits a key to the real keys of `T`, which is how you write a type-safe property getter.",
    example: code`function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

console.log(longest("comet", "sun"));
console.log(longest([1, 2], [1, 2, 3]));

const stars = [
  { name: "Vega", mag: 0.03 },
  { name: "Rigel", mag: 0.13 },
];
console.log(pluck(stars, "name"));`,
    reads: [
      { dot: DOT_PINK, text: "The constraint is what makes `a.length` legal inside `longest`" },
      { dot: DOT_MINT, text: "`K extends keyof T` rejects keys the objects do not have" },
      { dot: DOT_LAVENDER, text: "`T[K][]` is \"an array of whatever type that property has\"" },
    ],
    tip: "Start generic functions unconstrained, then add exactly the constraint the body needs and no more.",
    starter: code`function firstWithId<T>(items: T[]) {
  return items[0];
}

console.log(firstWithId([{ id: 7, name: "Nova" }]));`,
    task: {
      prompt: "Constrain `T` to objects with an `id: number`, and make `firstWithId` return just the first item's `id`. Log it: `7`.",
      expectOutput: ["7"],
      mustInclude: ["T\\s+extends\\s*\\{\\s*id\\s*:\\s*number"],
      hint: "`function firstWithId<T extends { id: number }>(items: T[]): number`",
      solution: code`function firstWithId<T extends { id: number }>(items: T[]): number {
  return items[0].id;
}

console.log(firstWithId([{ id: 7, name: "Nova" }]));`,
    },
    practiceSlug: "ts-generic-constraints",
    module: "TS Advanced",
    tier: "advanced",
  },
  {
    slug: "ts-keyof-typeof",
    order: 15,
    chapter: "TS Advanced",
    kicker: "TS ADVANCED",
    title: "keyof and typeof",
    catalogTitle: "keyof & typeof",
    blurb: "Derive types from your real data so they never drift apart.",
    catalogCode: "type Name = keyof typeof palette;",
    language: "typescript",
    intro:
      "`keyof T` is the union of a type's property names: `keyof { a: number; b: string }` is `\"a\" | \"b\"`. In a type position, `typeof value` gives you the type of a real value. Together they derive types from your data instead of writing them twice, so the types update automatically when the data changes.",
    example: code`const palette = {
  dusk: "#58365f",
  dawn: "#f3a35f",
  night: "#090d26",
};

type Palette = typeof palette;
type ColorName = keyof Palette;

function color(name: ColorName): string {
  return palette[name];
}

const names = Object.keys(palette) as ColorName[];
console.log(color("dawn"), names.length);`,
    reads: [
      { dot: DOT_PINK, text: "`typeof palette` copies the object's shape into a type" },
      { dot: DOT_MINT, text: "`keyof` turns that shape into `\"dusk\" | \"dawn\" | \"night\"`" },
      { dot: DOT_LAVENDER, text: "Add a color to the object and `ColorName` grows by itself" },
    ],
    tip: "`Object.keys` always returns `string[]`. Cast it with `as (keyof T)[]` only when you know the object has no extra keys.",
    starter: code`const settings = { volume: 7, theme: "dark", captions: true };

function read(key: string) {
  return key;
}

console.log(read("volume"));`,
    task: {
      prompt: "Type the parameter as `keyof typeof settings` and return `settings[key]`, so `read(\"theme\")` logs `dark`.",
      expectOutput: ["dark"],
      mustInclude: ["keyof\\s+typeof\\s+settings"],
      hint: "`function read(key: keyof typeof settings) { return settings[key]; }`",
      solution: code`const settings = { volume: 7, theme: "dark", captions: true };

function read(key: keyof typeof settings) {
  return settings[key];
}

console.log(read("theme"));`,
    },
    practiceSlug: "ts-keyof-typeof",
    module: "TS Advanced",
    tier: "advanced",
  },
  {
    slug: "ts-readonly-const",
    order: 18,
    chapter: "TS Advanced",
    kicker: "TS ADVANCED",
    title: "Readonly and as const",
    catalogTitle: "Readonly",
    blurb: "Lock values against change and keep exact literal types.",
    catalogCode: '["north", "south"] as const',
    language: "typescript",
    intro:
      "`readonly` stops a property from being reassigned, and `readonly T[]` removes changing methods like `push`. Writing `as const` after a literal locks the whole value: every property becomes readonly and every value keeps its exact literal type, so `[\"north\", \"south\"] as const` has the type `readonly [\"north\", \"south\"]`. These checks exist only at compile time; they catch mistakes before the code runs.",
    example: code`interface Config {
  readonly apiUrl: string;
  retries: number;
}

const config: Config = { apiUrl: "https://sky.example", retries: 3 };
config.retries = 5;

const DIRECTIONS = ["north", "south", "east", "west"] as const;
type Direction = (typeof DIRECTIONS)[number];

const heading: Direction = "east";
console.log(config.retries, heading, DIRECTIONS.length);`,
    reads: [
      { dot: DOT_PINK, text: "`config.apiUrl = ...` would be a compile error; `retries` can change" },
      { dot: DOT_MINT, text: "`as const` keeps each direction as its own literal type" },
      { dot: DOT_LAVENDER, text: "`(typeof DIRECTIONS)[number]` turns the array into the union of its values" },
    ],
    tip: "The `as const` array plus `[number]` pattern gives you a runtime list and a matching type from one source.",
    starter: code`const LEVELS = ["low", "mid", "high"];

function next(level: string) {
  const i = LEVELS.indexOf(level);
  return LEVELS[Math.min(i + 1, LEVELS.length - 1)];
}

console.log(next("low"));`,
    task: {
      prompt: "Add `as const` to `LEVELS`, create `type Level = (typeof LEVELS)[number]`, and make `next` take and return a `Level`. Log `next(\"mid\")`: `high`.",
      expectOutput: ["high"],
      mustInclude: ["as\\s+const", "type\\s+Level\\s*="],
      hint: "The signature becomes `function next(level: Level): Level`.",
      solution: code`const LEVELS = ["low", "mid", "high"] as const;
type Level = (typeof LEVELS)[number];

function next(level: Level): Level {
  const i = LEVELS.indexOf(level);
  return LEVELS[Math.min(i + 1, LEVELS.length - 1)];
}

console.log(next("mid"));`,
    },
    practiceSlug: "ts-readonly-const",
    module: "TS Advanced",
    tier: "advanced",
  },
  {
    slug: "ts-unknown-never",
    order: 19,
    chapter: "TS Advanced",
    kicker: "TS ADVANCED",
    title: "unknown and never",
    catalogTitle: "unknown & never",
    blurb: "Handle outside data safely with unknown, and mark the impossible with never.",
    catalogCode: "const data: unknown = JSON.parse(text);",
    language: "typescript",
    intro:
      "`any` switches type checking off. `unknown` is its safe twin: a value you must check before you can use it, which makes it the right type for anything from outside your program, like parsed JSON. `never` is the type of something that cannot happen: a function that always throws returns `never`, and a value narrowed until no options are left has type `never`.",
    example: code`function describe(value: unknown): string {
  if (typeof value === "string") return \`text of length \${value.length}\`;
  if (typeof value === "number") return \`number \${value.toFixed(1)}\`;
  if (Array.isArray(value)) return \`list of \${value.length}\`;
  return "something else";
}

function fail(message: string): never {
  throw new Error(message);
}

const data: unknown = JSON.parse("[1, 2, 3]");
console.log(describe(data), describe("hi"));

try {
  fail("stop");
} catch (e) {
  console.log((e as Error).message);
}`,
    reads: [
      { dot: DOT_PINK, text: "Each `typeof` check unlocks the methods of that one type" },
      { dot: DOT_MINT, text: "`fail` never returns normally, so its return type is `never`" },
      { dot: DOT_LAVENDER, text: "A caught error is `unknown` too, so check or cast it before reading `.message`" },
    ],
    tip: "Type data at the boundary: accept `unknown`, validate it once, and pass a precise type to the rest of your code.",
    starter: code`const raw: unknown = JSON.parse('{"name": "Nova", "age": 12}');
console.log(raw);`,
    task: {
      prompt: "Narrow `raw` safely: check it is a non-null object that has a string `name`, then log the name: `Nova`.",
      expectOutput: ["Nova"],
      mustInclude: ["[\"']name[\"']\\s+in\\s+raw"],
      hint: "`typeof raw === \"object\" && raw !== null && \"name\" in raw && typeof raw.name === \"string\"`",
      solution: code`const raw: unknown = JSON.parse('{"name": "Nova", "age": 12}');
if (typeof raw === "object" && raw !== null && "name" in raw && typeof raw.name === "string") {
  console.log(raw.name);
}`,
    },
    practiceSlug: "ts-unknown-never",
    module: "TS Advanced",
    tier: "advanced",
  },
  {
    slug: "ts-infer",
    order: 21,
    chapter: "TS Expert",
    kicker: "TS EXPERT",
    title: "Inferring Types with infer",
    catalogTitle: "infer",
    blurb: "Pull a type out of another type inside a conditional type.",
    catalogCode: "T extends Promise<infer V> ? V : T",
    language: "typescript",
    intro:
      "Inside a conditional type, `infer` declares a type variable that TypeScript fills in from the match. `T extends Promise<infer V> ? V : T` extracts what a promise resolves to, and `F extends (...args: any[]) => infer R ? R : never` extracts a function's return type. The built-in helpers `ReturnType` and `Awaited` are written exactly this way.",
    example: code`type Unwrap<T> = T extends Promise<infer V> ? V : T;
type ElementOf<T> = T extends (infer E)[] ? E : never;
type Result<F> = F extends (...args: any[]) => infer R ? R : never;

function makeStar() {
  return { name: "Vega", mag: 0.03 };
}

type Star = Result<typeof makeStar>;
const star: Star = { name: "Altair", mag: 0.77 };
const loaded: Unwrap<Promise<number>> = 42;
const first: ElementOf<string[]> = "comet";

console.log(star.name, loaded, first);`,
    reads: [
      { dot: DOT_PINK, text: "`infer V` captures whatever sits inside `Promise<...>`" },
      { dot: DOT_MINT, text: "`Result<typeof makeStar>` derives the Star type from the function itself" },
      { dot: DOT_LAVENDER, text: "When the pattern does not match, the false branch is used" },
    ],
    tip: "Reach for `infer` when you want a type that is buried inside another one; it keeps derived types in sync with their source.",
    starter: code`type FirstArg<F> = unknown;

function greet(name: string, times: number) {
  return name.repeat(times);
}

const arg: FirstArg<typeof greet> = "Nova";
console.log(arg);`,
    task: {
      prompt: "Rewrite `FirstArg` with `infer` so it extracts the type of a function's first parameter. The `const arg` line should still type-check. Then log `greet(arg, 2)`: `NovaNova`.",
      expectOutput: ["NovaNova"],
      mustInclude: ["infer\\s+A"],
      hint: "`type FirstArg<F> = F extends (first: infer A, ...rest: any[]) => any ? A : never;`",
      solution: code`type FirstArg<F> = F extends (first: infer A, ...rest: any[]) => any ? A : never;

function greet(name: string, times: number) {
  return name.repeat(times);
}

const arg: FirstArg<typeof greet> = "Nova";
console.log(greet(arg, 2));`,
    },
    practiceSlug: "ts-infer",
    module: "TS Expert",
    tier: "expert",
  },
  {
    slug: "ts-overloads",
    order: 24,
    chapter: "TS Expert",
    kicker: "TS EXPERT",
    title: "Function Overloads",
    catalogTitle: "Overloads",
    blurb: "Give one function several precise signatures.",
    catalogCode: "function parse(input: string): number;",
    language: "typescript",
    intro:
      "**Overloads** describe a function that returns different types for different arguments. Write several signatures without bodies, then one implementation whose signature covers them all. Callers only see the overload signatures, so every call gets an exact return type: `parse(\"42\")` returns a `number`, and `parse([\"1\", \"2\"])` returns `number[]`.",
    example: code`function parse(input: string): number;
function parse(input: string[]): number[];
function parse(input: string | string[]): number | number[] {
  return Array.isArray(input) ? input.map(Number) : Number(input);
}

const one = parse("42");
const many = parse(["1", "2", "3"]);
console.log(one + 1, many.length);`,
    reads: [
      { dot: DOT_PINK, text: "The first two lines are what callers see" },
      { dot: DOT_MINT, text: "The implementation signature must accept every overload's arguments" },
      { dot: DOT_LAVENDER, text: "`one` is a `number` and `many` is a `number[]`, no casts needed" },
    ],
    tip: "If a union parameter and a union return type would do, prefer that. Use overloads when the return type depends on the argument type.",
    starter: code`function format(value: number | Date): string {
  return String(value);
}

console.log(format(3.14159));`,
    task: {
      prompt: "Add two overload signatures above the implementation: `format(value: number, digits: number): string;` and `format(value: Date): string;`. Give the implementation an optional `digits` and use `toFixed(digits)` for numbers. Log `format(3.14159, 2)`: `3.14`.",
      expectOutput: ["3.14"],
      mustInclude: ["function\\s+format\\s*\\(\\s*value\\s*:\\s*number\\s*,\\s*digits\\s*:\\s*number\\s*\\)\\s*:\\s*string\\s*;"],
      hint: "The implementation is `function format(value: number | Date, digits?: number): string { ... }`.",
      solution: code`function format(value: number, digits: number): string;
function format(value: Date): string;
function format(value: number | Date, digits?: number): string {
  return typeof value === "number" ? value.toFixed(digits) : value.toISOString();
}

console.log(format(3.14159, 2));`,
    },
    practiceSlug: "ts-overloads",
    module: "TS Expert",
    tier: "expert",
  },
  {
    slug: "ts-branded-types",
    order: 25,
    chapter: "TS Expert",
    kicker: "TS EXPERT",
    title: "Branded Types",
    catalogTitle: "Branded types",
    blurb: "Stop mixing up values that share a type but mean different things.",
    catalogCode: 'string & { readonly __brand: "UserId" }',
    language: "typescript",
    intro:
      "A user id and an order id are both strings, so TypeScript happily lets you pass one where the other belongs. A **branded type** adds an invisible tag, `string & { readonly __brand: \"UserId\" }`, so the two no longer mix. Branded values are created only through a small function that validates and casts, which makes that function the single gate every value must pass through.",
    example: code`type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function userId(raw: string): UserId {
  if (!raw.startsWith("u_")) throw new Error(\`not a user id: \${raw}\`);
  return raw as UserId;
}

function orderId(raw: string): OrderId {
  return raw as OrderId;
}

function loadUser(id: UserId) {
  return \`user \${id}\`;
}

console.log(loadUser(userId("u_42")));
const order = orderId("o_7");
console.log(order.length);`,
    reads: [
      { dot: DOT_PINK, text: "`loadUser(order)` would be a compile error: an OrderId is not a UserId" },
      { dot: DOT_MINT, text: "`userId` checks the format before branding" },
      { dot: DOT_LAVENDER, text: "At run time a branded id is just a string" },
    ],
    tip: "Brand units too: meters and feet, cents and dollars. Mixed units have crashed real spacecraft.",
    starter: code`type Meters = number;
type Feet = number;

function climb(height: Meters) {
  return \`climbed \${height} m\`;
}

const tower: Feet = 300;
console.log(climb(tower));`,
    task: {
      prompt: "Brand `Meters` and `Feet` so passing feet to `climb` becomes a type error. Add `feet(n: number)` to create Feet and `toMeters(ft: Feet): Meters` (multiply by 0.3048 and round). Log `climb(toMeters(feet(300)))`: `climbed 91 m`.",
      expectOutput: ["climbed 91 m"],
      mustInclude: ["__brand"],
      hint: "`type Meters = number & { readonly __brand: \"Meters\" };` and cast with `as Meters` inside toMeters.",
      solution: code`type Meters = number & { readonly __brand: "Meters" };
type Feet = number & { readonly __brand: "Feet" };

const feet = (n: number) => n as Feet;
const toMeters = (ft: Feet) => Math.round(ft * 0.3048) as Meters;

function climb(height: Meters) {
  return \`climbed \${height} m\`;
}

console.log(climb(toMeters(feet(300))));`,
    },
    practiceSlug: "ts-branded-types",
    module: "TS Expert",
    tier: "expert",
  },
  {
    slug: "ts-async-types",
    order: 26,
    chapter: "TS Expert",
    kicker: "TS EXPERT",
    title: "Typing Async Code",
    catalogTitle: "Async types",
    blurb: "Type promises, async functions and Promise.all results.",
    catalogCode: "async function load(): Promise<Star[]>",
    language: "typescript",
    intro:
      "An `async` function always returns a `Promise`, and TypeScript tracks what it resolves to: `async function load(): Promise<Star[]>`. `await` unwraps it, so the awaited value has the inner type. `Promise.all` keeps each position's type in a tuple, and `Awaited<T>` does the unwrapping at the type level. Give data-loading functions an explicit return type so every caller is checked against it.",
    example: code`interface Star {
  name: string;
  mag: number;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function loadStars(): Promise<Star[]> {
  await wait(10);
  return [
    { name: "Vega", mag: 0.03 },
    { name: "Deneb", mag: 1.25 },
  ];
}

async function main() {
  const [stars, count] = await Promise.all([loadStars(), Promise.resolve(2)]);
  const brightest: Star = stars[0];
  console.log(brightest.name, count + 1);
}

main();`,
    reads: [
      { dot: DOT_PINK, text: "`Promise<Star[]>` is checked against every `return` inside the function" },
      { dot: DOT_MINT, text: "`await` turns `Promise<Star[]>` into `Star[]`" },
      { dot: DOT_LAVENDER, text: "`Promise.all` gives a tuple: `[Star[], number]`" },
    ],
    tip: "An `async` function can never return a plain value to its caller. Remember to `await` it, or the caller gets a Promise.",
    starter: code`async function fetchTemp(city: string) {
  return city.length * 3;
}

fetchTemp("Lumen").then((t) => console.log(t));`,
    task: {
      prompt: "Give `fetchTemp` the explicit return type `Promise<number>`. Then write `async function report()` that awaits the temperatures for `\"Lumen\"` and `\"Nimbus\"` and logs their sum, `33`. Call `report()` instead of the `.then` line.",
      expectOutput: ["33"],
      mustInclude: [":\\s*Promise<number>", "await"],
      hint: "`const a = await fetchTemp(\"Lumen\");` inside the async report function.",
      solution: code`async function fetchTemp(city: string): Promise<number> {
  return city.length * 3;
}

async function report() {
  const a = await fetchTemp("Lumen");
  const b = await fetchTemp("Nimbus");
  console.log(a + b);
}

report();`,
    },
    practiceSlug: "ts-async-types",
    module: "TS Expert",
    tier: "expert",
  },
];
