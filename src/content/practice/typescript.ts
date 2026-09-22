import type { PracticeDataset } from "@/content/types";

export const typescriptPractice: Record<string, PracticeDataset> = {
  "ts-types": {
    prompt: "Arrange the lines to type-annotate a string and a number variable.",
    parsonsFragments: [
      { id: "tst1", text: "let constellation: string = 'Orion';", indent: 0 },
      { id: "tst2", text: "let stars: number = 100;", indent: 0 },
      { id: "tst3", text: "console.log(constellation, stars);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to annotate a string and a boolean.",
    fadedLines: [
      { text: "let pilot: ___ = 'Leo';", blanks: ["string"] },
      { text: "const isFlying: ___ = true;", blanks: ["boolean"] },
    ],
    fadedExplain: "Use : string for text values and : boolean for true/false flags.",
    predictCode: "let count: number = 5;\n// count = 'ten';\nconsole.log(count);",
    predictQuestion: "What would happen if you uncommented the second line?",
    predictOptions: [
      { id: "a", label: "It prints 'ten'", correct: false, why: "TypeScript prevents reassigning a number to a string value." },
      { id: "b", label: "It throws a compiler type error", correct: true, why: "Since count is typed as a number, it cannot hold a string." },
      { id: "c", label: "It prints 5 and ignores 'ten'", correct: false, why: "TypeScript checks types at compile time and reports errors directly." },
    ]
  },
  "ts-functions": {
    prompt: "Arrange the lines to define a function taking a number and returning a string.",
    parsonsFragments: [
      { id: "tsf1", text: "function getAlt(m: number): string {", indent: 0 },
      { id: "tsf2", text: "  return m + ' meters';", indent: 1 },
      { id: "tsf3", text: "}", indent: 0 },
      { id: "tsf4", text: "console.log(getAlt(5000));", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define parameter type and return type.",
    fadedLines: [
      { text: "function double(x: ___): ___ {", blanks: ["number", "number"] },
      { text: "  return x * 2;", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Define number as both input parameter type and return type.",
    predictCode: "function sayHi(name: string): void {\n  console.log('Hi ' + name);\n}\nsayHi('Luna');",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Hi Luna", correct: true, why: "The function prints 'Hi Luna' and returns void (nothing)." },
      { id: "b", label: "undefined", correct: false, why: "We are calling sayHi('Luna'), which executes the console.log internally." },
      { id: "c", label: "Compiler Error", correct: false, why: "This is a perfectly valid TypeScript function returning void." },
    ]
  },
  "ts-arrays-tuples": {
    prompt: "Arrange the lines to define an array of strings and a tuple of coordinates.",
    parsonsFragments: [
      { id: "tsat1", text: "let list: string[] = ['A', 'B'];", indent: 0 },
      { id: "tsat2", text: "let pair: [number, number] = [45, -122];", indent: 0 },
      { id: "tsat3", text: "console.log(list[0], pair[1]);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a string array and a string-number tuple.",
    fadedLines: [
      { text: "let tags: ___ = ['neon', 'dusk'];", blanks: ["string[]"] },
      { text: "let user: [___, ___] = ['Leo', 101];", blanks: ["string", "number"] },
    ],
    fadedExplain: "Use string[] for string arrays, and [string, number] for a specific 2-element tuple.",
    predictCode: "let spot: [string, number] = ['Dock', 22];\n// spot[0] = 99;\nconsole.log(spot[0]);",
    predictQuestion: "What happens if you uncomment the second line?",
    predictOptions: [
      { id: "a", label: "It throws a compilation error", correct: true, why: "A tuple element must match the exact type declared for that index position." },
      { id: "b", label: "It prints 99", correct: false, why: "TypeScript prevents assigning number 99 to a string slot." },
      { id: "c", label: "It runs normally with warning", correct: false, why: "Type violations are treated as errors, not warnings." },
    ]
  },
  "ts-interfaces": {
    prompt: "Arrange the fragments to define a Star interface and make an object.",
    parsonsFragments: [
      { id: "tsi1", text: "interface Star {", indent: 0 },
      { id: "tsi2", text: "  name: string;", indent: 1 },
      { id: "tsi3", text: "  mag?: number;", indent: 1 },
      { id: "tsi4", text: "}", indent: 0 },
      { id: "tsi5", text: "const s: Star = { name: 'Vega' };", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to describe a Cloud interface with name and optional altitude.",
    fadedLines: [
      { text: "interface Cloud ___", blanks: ["{"] },
      { text: "  name: string;", blanks: [] },
      { text: "  altitude___ number;", blanks: ["?:"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Interfaces use braces and optional fields are marked with a question mark (?).",
    predictCode: "interface User { id: number; name: string; }\nconst u: User = { id: 1 };",
    predictQuestion: "Why does this code fail to compile?",
    predictOptions: [
      { id: "a", label: "Because name is missing from u", correct: true, why: "All non-optional interface fields must be present when declaring objects." },
      { id: "b", label: "Because u is a const", correct: false, why: "Const is valid, but object properties must match the interface." },
      { id: "c", label: "Because User should be a class", correct: false, why: "Interfaces can be implemented by objects directly without classes." },
    ]
  },
  "ts-unions-narrowing": {
    prompt: "Arrange the fragments to write a function that handles string or number signals.",
    parsonsFragments: [
      { id: "tsun1", text: "function process(sig: string | number) {", indent: 0 },
      { id: "tsun2", text: "  if (typeof sig === 'string') {", indent: 1 },
      { id: "tsun3", text: "    console.log(sig.toUpperCase());", indent: 2 },
      { id: "tsun4", text: "  } else {", indent: 1 },
      { id: "tsun5", text: "    console.log(sig * 2);", indent: 2 },
      { id: "tsun6", text: "  }", indent: 1 },
      { id: "tsun7", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to write a union parameter and typeof narrowing guard.",
    fadedLines: [
      { text: "function handle(input: string ___ number) {", blanks: ["|"] },
      { text: "  if (___ input === 'string') {", blanks: ["typeof"] },
      { text: "    return input.length;", blanks: [] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use | for union types and typeof input === 'string' for type narrowing.",
    predictCode: "function len(x: string | number) {\n  return x.length;\n}",
    predictQuestion: "Why does this code throw a compiler error?",
    predictOptions: [
      { id: "a", label: "Because length is not defined on number", correct: true, why: "TypeScript requires you to narrow the type before calling type-specific properties." },
      { id: "b", label: "Because x can only be one type", correct: false, why: "Unions are valid, but you must check the type before using type-specific fields." },
      { id: "c", label: "Because len should return string", correct: false, why: "Return type is inferred as number, which is fine, but accessing .length is unsafe." },
    ]
  },
  "ts-aliases-vs-interfaces": {
    prompt: "Arrange the lines to define a type alias union and use it in an interface.",
    parsonsFragments: [
      { id: "tsai1", text: "type Status = 'open' | 'closed';", indent: 0 },
      { id: "tsai2", text: "interface Gate {", indent: 0 },
      { id: "tsai3", text: "  id: number;", indent: 1 },
      { id: "tsai4", text: "  state: Status;", indent: 1 },
      { id: "tsai5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a Status type alias and assign it.",
    fadedLines: [
      { text: "___ Status = 'on' | 'off';", blanks: ["type"] },
      { text: "interface Switch {", blanks: [] },
      { text: "  state: ___;", blanks: ["Status"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use the type keyword to declare a type alias for union literal sets.",
    predictCode: "interface Client { id: number; }\ninterface Client { name: string; }\nconst c: Client = { id: 1, name: 'Alice' };",
    predictQuestion: "Is this code valid TypeScript?",
    predictOptions: [
      { id: "a", label: "Yes, interfaces with the same name automatically merge", correct: true, why: "Declaration merging is a unique capability of interfaces." },
      { id: "b", label: "No, duplicate interface names throw an error", correct: false, why: "TypeScript allows merging matching interfaces." },
      { id: "c", label: "No, name is duplicate", correct: false, why: "The fields are distinct and merged successfully." },
    ]
  },
  "ts-literals-enums": {
    prompt: "Arrange the fragments to define a Direction enum and log it.",
    parsonsFragments: [
      { id: "tsle1", text: "enum Direction {", indent: 0 },
      { id: "tsle2", text: "  North = 'N',", indent: 1 },
      { id: "tsle3", text: "  South = 'S',", indent: 1 },
      { id: "tsle4", text: "}", indent: 0 },
      { id: "tsle5", text: "console.log(Direction.North);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a literal type union and a variable.",
    fadedLines: [
      { text: "type Mode = 'dark' ___ 'light';", blanks: ["|"] },
      { text: "let current: ___ = 'dark';", blanks: ["Mode"] },
    ],
    fadedExplain: "Use | to separate string literals in a literal union type.",
    predictCode: "enum Status { Active = 1, Idle = 2 }\nconsole.log(Status.Active);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1", correct: true, why: "The enum value evaluates to its initialized numeric value." },
      { id: "b", label: "Active", correct: false, why: "It returns 1, which is the value bound to Status.Active." },
      { id: "c", label: "Status.Active", correct: false, why: "Enums resolve to their values, not the key name strings." },
    ]
  },
  "ts-classes": {
    prompt: "Arrange the fragments to define a class with private and public fields.",
    parsonsFragments: [
      { id: "tsc1", text: "class User {", indent: 0 },
      { id: "tsc2", text: "  private key: string;", indent: 1 },
      { id: "tsc3", text: "  constructor(key: string) {", indent: 1 },
      { id: "tsc4", text: "    this.key = key;", indent: 2 },
      { id: "tsc5", text: "  }", indent: 1 },
      { id: "tsc6", text: "  public getKey() { return this.key; }", indent: 1 },
      { id: "tsc7", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a private property inside the constructor parameter shorthand.",
    fadedLines: [
      { text: "class Engine {", blanks: [] },
      { text: "  constructor(___ id: number) {}", blanks: ["private"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Declaring a modifier like private in constructor parameters automatically generates that property.",
    predictCode: "class Safe {\n  private password = 'secret';\n}\nconst s = new Safe();\nconsole.log(s.password);",
    predictQuestion: "What happens when compiling this code?",
    predictOptions: [
      { id: "a", label: "Compiler error: password is private", correct: true, why: "Private properties are strictly guarded from external access by the compiler." },
      { id: "b", label: "It prints 'secret'", correct: false, why: "The compiler blocks compilation due to the private modifier violation." },
      { id: "c", label: "It prints undefined", correct: false, why: "Private fields generate regular properties but compiler prevents their direct access." },
    ]
  },
  "ts-generics": {
    prompt: "Arrange the fragments to write a generic ident function.",
    parsonsFragments: [
      { id: "tsg1", text: "function ident<T>(val: T): T {", indent: 0 },
      { id: "tsg2", text: "  return val;", indent: 1 },
      { id: "tsg3", text: "}", indent: 0 },
      { id: "tsg4", text: "console.log(ident<string>('hello'));", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a generic type placeholder T.",
    fadedLines: [
      { text: "function wrap___(item: T): T {", blanks: ["<T>"] },
      { text: "  return ___;", blanks: ["item"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use <T> right after function name to introduce a generic type variable.",
    predictCode: "function first<T>(arr: T[]): T {\n  return arr[0];\n}\nconsole.log(first([1, 2, 3]));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1", correct: true, why: "T is inferred as number from [1, 2, 3], returning the first element." },
      { id: "b", label: "Error: generic type must be passed", correct: false, why: "TypeScript automatically infers T from the arguments if omitted." },
      { id: "c", label: "undefined", correct: false, why: "The array has elements, so arr[0] resolves to 1." },
    ]
  },
  "ts-intersections-assertions": {
    prompt: "Arrange the lines to define intersection type and use type assertion.",
    parsonsFragments: [
      { id: "tsia1", text: "type A = { x: number };", indent: 0 },
      { id: "tsia2", text: "type B = { y: string };", indent: 0 },
      { id: "tsia3", text: "type C = A & B;", indent: 0 },
      { id: "tsia4", text: "let val: unknown = 'test';", indent: 0 },
      { id: "tsia5", text: "let len = (val as string).length;", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to combine types and perform assertion.",
    fadedLines: [
      { text: "type FlyState = Grounded ___ Airborne;", blanks: ["&"] },
      { text: "let raw: unknown = 'cirrus';", blanks: [] },
      { text: "let name = raw ___ string;", blanks: ["as"] },
    ],
    fadedExplain: "Use & to create intersection types and 'as' to perform type assertions.",
    predictCode: "let val: any = 5;\nconsole.log((val as string).length);",
    predictQuestion: "What is the runtime result of this code?",
    predictOptions: [
      { id: "a", label: "undefined", correct: true, why: "Type assertion only satisfies the compiler, but at runtime number 5 has no .length, resulting in undefined." },
      { id: "b", label: "Compiler Error", correct: false, why: "The assertion as string convinces the compiler, so no compile error is thrown." },
      { id: "c", label: "Throws a type error", correct: false, why: "JavaScript does not throw errors for undefined property access." },
    ]
  },
  "ts-utility-types": {
    prompt: "Arrange the fragments to make all fields of an interface optional.",
    parsonsFragments: [
      { id: "tsut1", text: "interface User { id: number; name: string; }", indent: 0 },
      { id: "tsut2", text: "type PartialUser = Partial<User>;", indent: 0 },
      { id: "tsut3", text: "const u: PartialUser = { id: 1 };", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to pick specific properties from an interface.",
    fadedLines: [
      { text: "interface Ship { id: number; name: string; speed: number; }", blanks: [] },
      { text: "type Summary = ___<Ship, 'name' | 'speed'>;", blanks: ["Pick"] },
    ],
    fadedExplain: "Use the Pick utility type to create a type with a selected subset of keys.",
    predictCode: "interface Star { name: string; magnitude: number; }\nconst s: Readonly<Star> = { name: 'Vega', magnitude: 0.03 };\n// s.magnitude = 0.5;",
    predictQuestion: "What happens if you uncomment the third line?",
    predictOptions: [
      { id: "a", label: "Compiler error: read-only property cannot be reassigned", correct: true, why: "The Readonly utility type makes all properties of the interface read-only." },
      { id: "b", label: "It compiles and updates normally", correct: false, why: "Readonly prevents reassignments at compile-time." },
      { id: "c", label: "It compiles but fails at runtime", correct: false, why: "The error is caught at compile-time by TypeScript." },
    ]
  },
  "ts-conditional-types": {
    prompt: "Arrange the lines to define a conditional type and assert it.",
    parsonsFragments: [
      { id: "tsct1", text: "type Check<T> = T extends string ? true : false;", indent: 0 },
      { id: "tsct2", text: "type Result = Check<string>;", indent: 0 },
      { id: "tsct3", text: "const val: Result = true;", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a conditional generic check.",
    fadedLines: [
      { text: "type IsNumber<T> = T ___ number ? 'yes' : 'no';", blanks: ["extends"] },
      { text: "type Answer = IsNumber<___>;", blanks: ["number"] },
    ],
    fadedExplain: "Conditional types use 'extends' followed by a ternary check.",
    predictCode: "type Check<T> = T extends number ? string : boolean;\nlet x: Check<number> = 'hello';\nlet y: Check<string> = true;",
    predictQuestion: "Is this code valid TypeScript?",
    predictOptions: [
      { id: "a", label: "Yes, Check<number> is string and Check<string> is boolean", correct: true, why: "The conditional type resolves exactly to those types." },
      { id: "b", label: "No, Check<number> should be number", correct: false, why: "Conditional types can resolve to arbitrary types like string." },
      { id: "c", label: "No, y assignment fails", correct: false, why: "y has type boolean which matches true." },
    ]
  },
  "ts-mapped-types": {
    prompt: "Arrange the fragments to define a mapped type making all properties string types.",
    parsonsFragments: [
      { id: "tsmt1", text: "type Stringify<T> = {", indent: 0 },
      { id: "tsmt2", text: "  [K in keyof T]: string;", indent: 1 },
      { id: "tsmt3", text: "};", indent: 0 },
      { id: "tsmt4", text: "type Config = { port: number };", indent: 0 },
      { id: "tsmt5", text: "const c: Stringify<Config> = { port: '80' };", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a mapped type that iterates over keys.",
    fadedLines: [
      { text: "type Optional<T> = {", blanks: [] },
      { text: "  [K ___ keyof T]?: T[___];", blanks: ["in", "K"] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "Use K in keyof T to iterate over properties, and T[K] to look up their types.",
    predictCode: "type ReadOnly<T> = { readonly [K in keyof T]: T[K] };\ninterface Point { x: number; }\nconst p: ReadOnly<Point> = { x: 5 };",
    predictQuestion: "What type modifier is added by this mapped type?",
    predictOptions: [
      { id: "a", label: "readonly", correct: true, why: "The readonly prefix makes all mapped properties immutable." },
      { id: "b", label: "optional", correct: false, why: "No ? was added, so properties remain required." },
      { id: "c", label: "string conversion", correct: false, why: "T[K] preserves the original property type." },
    ]
  },
  "ts-template-literals": {
    prompt: "Arrange the lines to create a template literal type for action events.",
    parsonsFragments: [
      { id: "tstl1", text: "type Action = 'click' | 'hover';", indent: 0 },
      { id: "tstl2", text: "type Event = `on_${Action}`;", indent: 0 },
      { id: "tstl3", text: "const clickEvent: Event = 'on_click';", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a template literal type prefix.",
    fadedLines: [
      { text: "type Color = 'red' | 'blue';", blanks: [] },
      { text: "type TextColor = ___dark-${___}___;", blanks: ["`", "Color", "`"] },
    ],
    fadedExplain: "Template literal types use backticks and ${} to insert type unions.",
    predictCode: "type Size = 'sm' | 'md';\ntype Padding = `p-${Size}`;\nconst pad: Padding = 'p-sm';",
    predictQuestion: "Is 'p-lg' a valid value for Padding?",
    predictOptions: [
      { id: "a", label: "No, lg is not in the Size union", correct: true, why: "Template literal types restrict values strictly to the combination of the unions." },
      { id: "b", label: "Yes, it matches the p- prefix", correct: false, why: "The prefix is checked but the suffix must be in Size." },
      { id: "c", label: "Yes, any string is valid", correct: false, why: "TypeScript enforces string template checks strictly." },
    ]
  },
};
