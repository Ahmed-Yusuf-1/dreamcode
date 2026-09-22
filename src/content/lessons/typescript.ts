import type { Lesson } from "@/content/types";
import { DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";

export const typescriptLessons: Lesson[] = [
  {
    slug: "ts-types",
    order: 1,
    chapter: "TS Basics",
    kicker: "TYPESCRIPT",
    title: "Typing your variables",
    catalogTitle: "Types",
    blurb: "Add type annotations so the compiler catches mistakes early.",
    catalogCode: "let n: number = 5;",
    intro:
      "**TypeScript** is JavaScript with **types**. You annotate a variable with `: type` to specify the data it should hold. These annotations are checked during compilation and stripped in the running JavaScript.",
    example: `let mood: string = "dreamy";
let altitude: number = 5000;
const isNight: boolean = true;
console.log(mood, altitude, isNight);`,
    reads: [
      { dot: DOT_PINK, text: "**: string / : number / : boolean** specify variable types" },
      { dot: DOT_MINT, text: "Types are strictly checked by the compiler before running" },
    ],
    tip: "Let inference do the work: if you assign a value immediately, TypeScript can infer the type automatically.",
    starter: `// give each variable the right type annotation
let constellation: string = "Orion";
let starCount: number = 1200;
console.log(constellation, "has", starCount, "stars");`,
    task: {
      prompt: "Add a `boolean` variable `visible` set to `true` and log it after the sentence.",
      expectOutput: ["Orion has 1200 stars", "true"],
      mustInclude: ["visible\\s*:\\s*boolean"],
      hint: "`let visible: boolean = true;`",
      solution: code`let constellation: string = "Orion";
let starCount: number = 1200;
let visible: boolean = true;
console.log(constellation, "has", starCount, "stars");
console.log(visible);`,
    },
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-types",
  },
  {
    slug: "ts-functions",
    order: 3,
    chapter: "TS Basics",
    kicker: "TYPESCRIPT",
    title: "Function parameter and return types",
    catalogTitle: "Functions",
    blurb: "Declare parameter and return types to ensure clean interfaces.",
    catalogCode: "function fn(x: number): string",
    intro:
      "In TypeScript, you must annotate function **parameters** and their **return types**. This ensures callers pass the correct arguments and receive the expected outputs.",
    example: `function formatAltitude(meters: number): string {
  return meters + "m above the clouds";
}
const status = formatAltitude(8500);
console.log(status);`,
    reads: [
      { dot: DOT_PINK, text: "**(meters: number)** restricts parameter inputs to numbers only" },
      { dot: DOT_MINT, text: "**: string** asserts that the function must return a string" },
    ],
    tip: "Functions that do not return any value should be annotated with a return type of **void**.",
    starter: `function doubleCount(stars: number): number {
  return stars * 2;
}
console.log(doubleCount(150));`,
    task: {
      prompt: "Write `average(values: number[]): number` and log `average([2, 4, 9])`: `5`.",
      expectOutput: ["5"],
      mustInclude: ["average\\s*\\(\\s*values\\s*:\\s*number\\[\\]\\s*\\)\\s*:\\s*number"],
      hint: "Add them up with reduce, then divide by `values.length`.",
      solution: code`function average(values: number[]): number {
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}
console.log(average([2, 4, 9]));`,
    },
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-functions",
  },
  {
    slug: "ts-arrays-tuples",
    order: 4,
    chapter: "TS Basics",
    kicker: "TYPESCRIPT",
    title: "Typed Arrays and Tuples",
    catalogTitle: "Arrays",
    blurb: "Lock down array elements or define strict, fixed-length tuples.",
    catalogCode: "let arr: number[] = [1, 2];",
    intro:
      "Define arrays using `type[]`. For fixed-length arrays with specific types at exact index positions, use **Tuples** (e.g. `[string, number]`).",
    example: `let altitudes: number[] = [1000, 2000, 3000];
let coordinates: [number, number] = [45.1, -122.3];
console.log(altitudes.length, coordinates[0]);`,
    reads: [
      { dot: DOT_PINK, text: "**number[]** declares an array containing only numbers" },
      { dot: DOT_MINT, text: "**[number, number]** restricts coordinates to a fixed length of 2 numbers" },
    ],
    tip: "Tuples are highly useful for return values like coordinates or key-value pairs.",
    starter: `let starNames: string[] = ["Vega", "Sirius", "Altair"];
let location: [string, number] = ["Orion", 450];
console.log(starNames, location);`,
    task: {
      prompt: "Write `swap(pair: [string, number]): [number, string]` that flips a pair, and log `swap(location)`: `[ 450, 'Orion' ]`.",
      expectOutput: ["[ 450, 'Orion' ]"],
      mustInclude: ["\\[\\s*number\\s*,\\s*string\\s*\\]"],
      hint: "`return [pair[1], pair[0]];`",
      solution: code`let location: [string, number] = ["Orion", 450];

function swap(pair: [string, number]): [number, string] {
  return [pair[1], pair[0]];
}

console.log(swap(location));`,
    },
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-arrays-tuples",
  },
  {
    slug: "ts-interfaces",
    order: 6,
    chapter: "TS Basics",
    kicker: "TYPESCRIPT",
    title: "Describing objects with interfaces",
    catalogTitle: "Interfaces",
    blurb: "Define the shape of an object once and reuse it everywhere.",
    catalogCode: "interface Cloud { name: string }",
    intro:
      "An **interface** names the shape of an object: which properties it has and their types. Annotate a value with the interface and the compiler enforces the shape.",
    example: `interface Cloud {
  name: string;
  altitude: number;
  isFluffy?: boolean;
}
const c: Cloud = { name: "cirrus", altitude: 8000 };
console.log(c.name, "floats at", c.altitude);`,
    reads: [
      { dot: DOT_PINK, text: "**interface Cloud { ... }** names a reusable object shape" },
      { dot: DOT_MINT, text: "**isFluffy?** marks the altitude-related field as optional" },
    ],
    tip: "Use optional properties with a question mark to allow fields to be omitted safely.",
    starter: `interface Star {
  name: string;
  magnitude: number;
}
const vega: Star = { name: "Vega", magnitude: 0.03 };
console.log(vega.name, "magnitude", vega.magnitude);`,
    task: {
      prompt: "Add an optional `constellation?: string` to `Star`, create `deneb` with the constellation `\"Cygnus\"`, and log `deneb.constellation`.",
      expectOutput: ["Cygnus"],
      mustInclude: ["constellation\\?\\s*:\\s*string"],
      hint: "`const deneb: Star = { name: \"Deneb\", magnitude: 1.25, constellation: \"Cygnus\" };`",
      solution: code`interface Star {
  name: string;
  magnitude: number;
  constellation?: string;
}
const deneb: Star = { name: "Deneb", magnitude: 1.25, constellation: "Cygnus" };
console.log(deneb.constellation);`,
    },
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-interfaces",
  },
  {
    slug: "ts-unions-narrowing",
    order: 7,
    chapter: "TS Unions & Enums",
    kicker: "TYPESCRIPT",
    title: "Unions and Type Narrowing",
    catalogTitle: "Unions",
    blurb: "Allow multiple types and narrow them using typeof.",
    catalogCode: "let val: string | number;",
    intro:
      "A **Union Type** (`A | B`) allows a variable to hold values of multiple types. To safely interact with the value, you use **Type Narrowing** via conditionals to isolate the active type.",
    example: `function printId(id: string | number) {
  if (typeof id === "string") {
    console.log("String ID:", id.toUpperCase());
  } else {
    console.log("Numeric ID:", id * 10);
  }
}
printId("nebula");
printId(101);`,
    reads: [
      { dot: DOT_PINK, text: "**string | number** allows id to be either a string or a number" },
      { dot: DOT_MINT, text: "**typeof id === 'string'** acts as a type guard to narrow the type" },
    ],
    tip: "Type guards like typeof or instanceof allow safe, type-specific code execution.",
    starter: `function processSignal(sig: string | number) {
  if (typeof sig === "string") {
    console.log(sig.trim());
  } else {
    console.log(sig.toFixed(2));
  }
}
processSignal("  pulse  ");
processSignal(45.678);`,
    task: {
      prompt: "Add `boolean` to the union and handle it by logging `on` for true and `off` for false. Call `processSignal(true)`.",
      expectOutput: ["on"],
      mustInclude: ["typeof\\s+sig\\s*===\\s*[\"']boolean[\"']"],
      hint: "Check `typeof sig === \"boolean\"` before the other branches.",
      solution: code`function processSignal(sig: string | number | boolean) {
  if (typeof sig === "boolean") {
    console.log(sig ? "on" : "off");
  } else if (typeof sig === "string") {
    console.log(sig.trim());
  } else {
    console.log(sig.toFixed(2));
  }
}
processSignal(true);`,
    },
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-unions-narrowing",
  },
  {
    slug: "ts-aliases-vs-interfaces",
    order: 10,
    chapter: "TS Unions & Enums",
    kicker: "TYPESCRIPT",
    title: "Type Aliases vs Interfaces",
    catalogTitle: "Aliases",
    blurb: "Choose when to use type aliases or object interfaces.",
    catalogCode: "type Signal = string | number;",
    intro:
      "**Type Aliases** (`type`) name any type, including primitives, unions, and tuples. **Interfaces** (`interface`) describe object structures and support declaration merging. Use interfaces for objects and type aliases for unions/primitives.",
    example: `type ID = string | number;
interface Coordinate {
  lat: number;
  lng: number;
}
const mainId: ID = "star-01";
const pos: Coordinate = { lat: 34, lng: -118 };
console.log(mainId, pos.lat);`,
    reads: [
      { dot: DOT_PINK, text: "**type ID** defines a name for a union or generic type" },
      { dot: DOT_MINT, text: "**interface Coordinate** is strictly for object shapes" },
    ],
    tip: "Interfaces can be extended using the extends keyword, making them great for class descriptions.",
    starter: `type Status = "active" | "dormant";
interface Starship {
  name: string;
  status: Status;
}
const voyager: Starship = { name: "Voyager", status: "active" };
console.log(voyager.name, voyager.status);`,
    task: {
      prompt: "Add `\"retired\"` to `Status`, create `pioneer` with that status, and log `pioneer.status`: `retired`.",
      expectOutput: ["retired"],
      mustInclude: ["type\\s+Status\\s*=[^;]*[\"']retired[\"']"],
      hint: "`type Status = \"active\" | \"dormant\" | \"retired\";`",
      solution: code`type Status = "active" | "dormant" | "retired";
interface Starship {
  name: string;
  status: Status;
}
const pioneer: Starship = { name: "Pioneer", status: "retired" };
console.log(pioneer.status);`,
    },
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-aliases-vs-interfaces",
  },
  {
    slug: "ts-literals-enums",
    order: 11,
    chapter: "TS Unions & Enums",
    kicker: "TYPESCRIPT",
    title: "Literal Types and Enums",
    catalogTitle: "Enums",
    blurb: "Restrict values to exact options or use numeric/string Enums.",
    catalogCode: "type Mode = 'dusk' | 'dawn';",
    intro:
      "**Literal Types** restrict values to specific strings or numbers. **Enums** group related constants, providing a named list of numeric or string options.",
    example: `type ColorTheme = "dusk" | "neon" | "cloud";
enum Direction {
  North = "NORTH",
  South = "SOUTH"
}
let currentTheme: ColorTheme = "dusk";
let heading: Direction = Direction.North;
console.log(currentTheme, heading);`,
    reads: [
      { dot: DOT_PINK, text: "**'dusk' | 'neon'** forces the theme to match only those literals" },
      { dot: DOT_MINT, text: "**enum Direction** creates lookup constants available at runtime" },
    ],
    tip: "Default to union literal types for simplicity unless you need lookup constants.",
    starter: `type CloudTier = "low" | "mid" | "high";
enum FlightState {
  Ground = 0,
  Flight = 1
}
let ct: CloudTier = "high";
let fs: FlightState = FlightState.Flight;
console.log(ct, fs);`,
    task: {
      prompt: "Add `Orbit = 2` to `FlightState`, then log `FlightState.Orbit` and `FlightState[2]`: `2` then `Orbit`.",
      expectOutput: ["2", "Orbit"],
      mustInclude: ["Orbit\\s*=\\s*2"],
      hint: "Numeric enums work both ways: from name to number and from number back to name.",
      solution: code`enum FlightState {
  Ground = 0,
  Flight = 1,
  Orbit = 2
}
console.log(FlightState.Orbit);
console.log(FlightState[2]);`,
    },
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-literals-enums",
  },
  {
    slug: "ts-classes",
    order: 12,
    chapter: "TS Unions & Enums",
    kicker: "TYPESCRIPT",
    title: "Classes and visibility modifiers",
    catalogTitle: "Classes",
    blurb: "Use public, private, and protected to enforce access limits.",
    catalogCode: "class Star { private size: number }",
    intro:
      "TypeScript classes extend JavaScript classes by adding **types** and **visibility modifiers**: `public` (accessible anywhere), `private` (accessible only inside the class), and `protected` (accessible inside the class and its subclasses).",
    example: `class Cloud {
  public name: string;
  private altitude: number;
  constructor(name: string, altitude: number) {
    this.name = name;
    this.altitude = altitude;
  }
  public getAlt() { return this.altitude; }
}
const c = new Cloud("cumulus", 3000);
console.log(c.name, c.getAlt());`,
    reads: [
      { dot: DOT_PINK, text: "**private altitude** prevents external access to this property" },
      { dot: DOT_MINT, text: "**public name** allows normal reading and writing from outside" },
    ],
    tip: "You can declare class properties directly in the constructor parameters as public/private as a shorthand.",
    starter: `class Spaceship {
  private crew: number;
  constructor(public name: string, crew: number) {
    this.crew = crew;
  }
  public getCrew() { return this.crew; }
}
const ship = new Spaceship("Apollo", 3);
console.log(ship.name, ship.getCrew());`,
    task: {
      prompt: "Add a public method `addCrew(n: number)` that increases the private crew and returns the new count. Log `ship.addCrew(2)`: `5`.",
      expectOutput: ["5"],
      mustInclude: ["addCrew\\s*\\(\\s*n\\s*:\\s*number\\s*\\)"],
      hint: "Inside the method, `this.crew += n; return this.crew;`.",
      solution: code`class Spaceship {
  private crew: number;
  constructor(public name: string, crew: number) {
    this.crew = crew;
  }
  public getCrew() { return this.crew; }
  public addCrew(n: number) {
    this.crew += n;
    return this.crew;
  }
}
const ship = new Spaceship("Apollo", 3);
console.log(ship.addCrew(2));`,
    },
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-classes",
  },
  {
    slug: "ts-generics",
    order: 13,
    chapter: "TS Advanced",
    kicker: "TYPESCRIPT",
    title: "Reusable code with generics",
    catalogTitle: "Generics",
    blurb: "Write one function that keeps its types for any input.",
    catalogCode: "function first<T>(a: T[]): T",
    intro:
      "**Generics** let a function work over many types while keeping the link between input and output. `<T>` is a type variable filled in when the function is called.",
    example: `function first<T>(items: T[]): T {
  return items[0];
}
console.log(first<string>(["pink", "blue"]));
console.log(first<number>([10, 20]));`,
    reads: [
      { dot: DOT_PINK, text: "**<T>** is a type placeholder bound when the function is called" },
      { dot: DOT_MINT, text: "first(items: T[]): T returns the same type the array holds" },
    ],
    tip: "You rarely need to pass <string> explicitly; TypeScript infers T from the argument you give.",
    starter: `function last<T>(items: T[]): T {
  return items[items.length - 1];
}
console.log(last(["dawn", "dusk", "night"]));`,
    task: {
      prompt: "Write a generic `pair<A, B>(a: A, b: B): [A, B]` and log `pair(\"Vega\", 0.03)`: `[ 'Vega', 0.03 ]`.",
      expectOutput: ["[ 'Vega', 0.03 ]"],
      mustInclude: ["pair\\s*<\\s*A\\s*,\\s*B\\s*>"],
      hint: "`function pair<A, B>(a: A, b: B): [A, B] { return [a, b]; }`",
      solution: code`function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
console.log(pair("Vega", 0.03));`,
    },
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-generics",
  },
  {
    slug: "ts-intersections-assertions",
    order: 16,
    chapter: "TS Advanced",
    kicker: "TYPESCRIPT",
    title: "Intersections and Assertions",
    catalogTitle: "Assertions",
    blurb: "Combine shapes with intersections and override types with assertions.",
    catalogCode: "const val = data as string;",
    intro:
      "**Intersection Types** (`A & B`) combine multiple types into one. **Type Assertions** (`as Type`) tell the compiler that a value has a specific type, bypassing regular type inference.",
    example: `interface Named { name: string; }
interface Aged { age: number; }
type Person = Named & Aged;
const p: Person = { name: "Alice", age: 30 };

let rawData: unknown = "hello cloud";
let len = (rawData as string).length;
console.log(p.name, len);`,
    reads: [
      { dot: DOT_PINK, text: "**Named & Aged** combines properties of both interfaces" },
      { dot: DOT_MINT, text: "**as string** forces the compiler to treat rawData as a string" },
    ],
    tip: "Use assertions sparingly: they tell the compiler 'trust me, I know what I am doing' and can hide real runtime errors if you are wrong.",
    starter: `interface Logged { timestamp: number; }
interface ErrorMsg { error: string; }
type CrashLog = Logged & ErrorMsg;
const crash: CrashLog = { timestamp: Date.now(), error: "Engine Failure" };

let response: unknown = "Success status code";
let msg = response as string;
console.log(crash.error, msg.length);`,
    task: {
      prompt: "Create `type Timed = { startedAt: number }` and `type Task = { title: string }`, make `const job: Timed & Task = { startedAt: 5, title: \"launch\" }`, and log `job.title.toUpperCase()`: `LAUNCH`.",
      expectOutput: ["LAUNCH"],
      mustInclude: ["Timed\\s*&\\s*Task"],
      hint: "An intersection needs every property from both types.",
      solution: code`type Timed = { startedAt: number };
type Task = { title: string };
const job: Timed & Task = { startedAt: 5, title: "launch" };
console.log(job.title.toUpperCase());`,
    },
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-intersections-assertions",
  },
  {
    slug: "ts-utility-types",
    order: 17,
    chapter: "TS Advanced",
    kicker: "TYPESCRIPT",
    title: "Readonly and Utility Types",
    catalogTitle: "Utilities",
    blurb: "Quickly transform shapes using Partial, Pick, Omit, and Readonly.",
    catalogCode: "type Info = Pick<User, 'id'>;",
    intro:
      "TypeScript provides built-in **Utility Types** to transform shapes: `Partial<T>` makes all fields optional, `Readonly<T>` makes all fields immutable, `Pick<T, Keys>` selects specific fields, and `Omit<T, Keys>` removes specific fields.",
    example: `interface Flight {
  id: string;
  altitude: number;
  pilot: string;
}
const f: Readonly<Flight> = { id: "FL-12", altitude: 8000, pilot: "Leo" };
type Summary = Pick<Flight, "id" | "pilot">;
const s: Summary = { id: "FL-12", pilot: "Leo" };
console.log(f.id, s.pilot);`,
    reads: [
      { dot: DOT_PINK, text: "**Readonly<Flight>** prevents writing to any property after creation" },
      { dot: DOT_MINT, text: "**Pick<Flight, 'id' | 'pilot'>** creates a type containing only those fields" },
    ],
    tip: "Utility types save you from duplicating similar object shapes across your code.",
    starter: `interface Star {
  name: string;
  constellation: string;
  brightness: number;
}
type PartialStar = Partial<Star>;
type DimStar = Omit<Star, "brightness">;
const p: PartialStar = { name: "Vega" };
const d: DimStar = { name: "Altair", constellation: "Aquila" };
console.log(p.name, d.constellation);`,
    task: {
      prompt: "Use `Pick<Star, \"name\" | \"brightness\">` to type `const glow = { name: \"Sirius\", brightness: 10 }`, then log `glow.brightness * 2`: `20`.",
      expectOutput: ["20"],
      mustInclude: ["Pick\\s*<"],
      hint: "`const glow: Pick<Star, \"name\" | \"brightness\"> = { ... };`",
      solution: code`interface Star {
  name: string;
  constellation: string;
  brightness: number;
}
const glow: Pick<Star, "name" | "brightness"> = { name: "Sirius", brightness: 10 };
console.log(glow.brightness * 2);`,
    },
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-utility-types",
  },
  {
    slug: "ts-conditional-types",
    order: 20,
    chapter: "TS Expert",
    kicker: "TYPESCRIPT",
    title: "Conditional Types",
    catalogTitle: "Conditional",
    blurb: "Select types dynamically based on generic checks.",
    catalogCode: "type IsString<T> = T extends string ? true : false;",
    intro:
      "**Conditional Types** let you select types dynamically by checking if type `T` extends type `U`. They work like ternary conditional operators (`T extends U ? X : Y`).",
    example: `type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
const answerA: A = "yes";
const answerB: B = "no";
console.log(answerA, answerB);`,
    reads: [
      { dot: DOT_PINK, text: "**T extends string** tests if the generic type extends a string" },
      { dot: DOT_MINT, text: "**? 'yes' : 'no'** resolves to different types depending on the check" },
    ],
    tip: "Conditional types are the core of advanced type manipulation and libraries.",
    starter: `type NonNull<T> = T extends null | undefined ? never : T;
type Cleaned = NonNull<string | null>; // resolves to string
const val: Cleaned = "clean signal";
console.log(val);`,
    task: {
      prompt: "Write `type IsArray<T> = T extends unknown[] ? \"array\" : \"single\"`, declare `const kind: IsArray<number[]> = \"array\"`, and log it.",
      expectOutput: ["array"],
      mustInclude: ["extends\\s+unknown\\[\\]"],
      hint: "The conditional type picks the first branch because number[] is an array.",
      solution: code`type IsArray<T> = T extends unknown[] ? "array" : "single";
const kind: IsArray<number[]> = "array";
console.log(kind);`,
    },
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-conditional-types",
  },
  {
    slug: "ts-mapped-types",
    order: 22,
    chapter: "TS Expert",
    kicker: "TYPESCRIPT",
    title: "Mapped Types",
    catalogTitle: "Mapped",
    blurb: "Iterate over object property keys to transform entire types.",
    catalogCode: "type ReadOnly<T> = { readonly [P in keyof T]: T[P] };",
    intro:
      "**Mapped Types** build new types by iterating over the keys of an existing type. They map every property of a type to a new type structure, similar to `Array.prototype.map()` but for type properties.",
    example: `interface Config {
  port: number;
  host: string;
}
type Stringify<T> = {
  [K in keyof T]: string;
};
const strConf: Stringify<Config> = { port: "8080", host: "localhost" };
console.log(strConf.port, strConf.host);`,
    reads: [
      { dot: DOT_PINK, text: "**[K in keyof T]** iterates over all keys K inside type T" },
      { dot: DOT_MINT, text: "**T[K]** accesses the type of property K in type T" },
    ],
    tip: "Mapped types are useful for converting API responses or validation payloads dynamically.",
    starter: `interface Pilot {
  name: string;
  xp: number;
}
type Optional<T> = {
  [K in keyof T]?: T[K];
};
const copilot: Optional<Pilot> = { name: "Ava" };
console.log(copilot.name);`,
    task: {
      prompt: "Write a mapped type `Flags<T>` that turns every property into a `boolean`, then `const shown: Flags<Pilot> = { name: true, xp: false }` and log `shown.xp`: `false`.",
      expectOutput: ["false"],
      mustInclude: ["\\[\\s*K\\s+in\\s+keyof\\s+T\\s*\\]\\s*:\\s*boolean"],
      hint: "`type Flags<T> = { [K in keyof T]: boolean };`",
      solution: code`interface Pilot {
  name: string;
  xp: number;
}
type Flags<T> = {
  [K in keyof T]: boolean;
};
const shown: Flags<Pilot> = { name: true, xp: false };
console.log(shown.xp);`,
    },
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-mapped-types",
  },
  {
    slug: "ts-template-literals",
    order: 23,
    chapter: "TS Expert",
    kicker: "TYPESCRIPT",
    title: "Template Literal Types",
    catalogTitle: "Template",
    blurb: "Construct type combinations using string template literals.",
    catalogCode: "type Event = `on${Action}`;",
    intro:
      "**Template Literal Types** construct types by manipulating strings inside template literal types. They build unions of string literals by combining strings dynamically.",
    example: `type Status = "success" | "error";
type ResponseEvent = \`on_\${Status}\`;
const successEvent: ResponseEvent = "on_success";
const errorEvent: ResponseEvent = "on_error";
console.log(successEvent, errorEvent);`,
    reads: [
      { dot: DOT_PINK, text: "**\`on_\${Status}\`** generates on_success | on_error dynamically" },
      { dot: DOT_MINT, text: "They combine literal strings into type definitions directly" },
    ],
    tip: "Template literal types make it easy to type CSS class names, event names, or database queries.",
    starter: `type Direction = "Left" | "Right" | "Up";
type MoveCommand = \`move\${Direction}\`;
const action: MoveCommand = "moveRight";
console.log(action);`,
    task: {
      prompt: "Make `type Size = \"sm\" | \"lg\"` and `type Color = \"red\" | \"blue\"`, combine them into `type Token` with a template literal type, then declare `const t: Token = \"lg-blue\"` and log it.",
      expectOutput: ["lg-blue"],
      mustInclude: ["`\\$\\{Size\\}-\\$\\{Color\\}`"],
      hint: "Put both unions inside one template literal type, joined by a dash. TypeScript builds all four combinations.",
      solution: code`type Size = "sm" | "lg";
type Color = "red" | "blue";
type Token = \`\${Size}-\${Color}\`;
const t: Token = "lg-blue";
console.log(t);`,
    },
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-template-literals",
  },
];
