import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";

/** Practice drills for the lessons in lessons/typescript-more.ts. */
export const typescriptMorePractice: Record<string, PracticeDataset> = {
  "ts-type-inference": {
    prompt: "Arrange the lines: an inferred variable passed to a typed function.",
    parsonsFragments: [
      { id: "ti1", text: "let stars = 100;", indent: 0 },
      { id: "ti2", text: "function half(n: number) {", indent: 0 },
      { id: "ti3", text: "return n / 2;", indent: 1 },
      { id: "ti4", text: "}", indent: 0 },
      { id: "ti5", text: "console.log(half(stars));", indent: 0 },
    ],
    fadedPrompt: "Fill the blank: parameters still need a type.",
    fadedLines: [{ text: "function shout(word: ___) {", blanks: ["string"] }],
    fadedExplain: "TypeScript cannot infer parameter types, so annotate them.",
    predictCode: code`const values = [1, 2, 3];
const total = values.reduce((sum, n) => sum + n, 0);
console.log(total, typeof total);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "6 number", correct: true, why: "The sum is 6, and both TypeScript and JavaScript agree it is a number." },
      { id: "b", label: "123 string", correct: false, why: "The numbers are added, not joined, because the start value is 0." },
      { id: "c", label: "6 object", correct: false, why: "typeof a number is \"number\"." },
    ],
  },
  "ts-object-types": {
    prompt: "Arrange the lines to type an object with an optional property.",
    parsonsFragments: [
      { id: "ot1", text: "const star: { name: string; mag?: number } = {", indent: 0 },
      { id: "ot2", text: 'name: "Vega",', indent: 1 },
      { id: "ot3", text: "};", indent: 0 },
      { id: "ot4", text: "console.log(star.name);", indent: 0 },
    ],
    fadedPrompt: "Fill the blank to mark a property as optional.",
    fadedLines: [{ text: "let ship: { name: string; crew___ number };", blanks: ["?:"] }],
    fadedExplain: "A question mark before the colon makes the property optional.",
    predictCode: code`const star: { name: string; mag?: number } = { name: "Rigel" };
console.log(star.mag ?? "unknown");`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "unknown", correct: true, why: "mag was left out, so it is undefined and ?? uses the fallback." },
      { id: "b", label: "undefined", correct: false, why: "?? replaces undefined with the right-hand value." },
      { id: "c", label: "0", correct: false, why: "A missing property is undefined, not 0." },
    ],
  },
  "ts-type-guards": {
    prompt: "Arrange the lines of a type guard function.",
    parsonsFragments: [
      { id: "tg1", text: "function isText(v: string | number): v is string {", indent: 0 },
      { id: "tg2", text: 'return typeof v === "string";', indent: 1 },
      { id: "tg3", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: check for a property, then for a class.",
    fadedLines: [
      { text: 'if ("swim" ___ pet) pet.swim();', blanks: ["in"] },
      { text: "if (value ___ Date) value.getFullYear();", blanks: ["instanceof"] },
    ],
    fadedExplain: "`in` checks for a property and `instanceof` checks the class, and both narrow the type.",
    predictCode: code`function size(x: string | string[]) {
  return Array.isArray(x) ? x.length : x.length * 10;
}
console.log(size(["a", "b"]), size("ab"));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2 20", correct: true, why: "The array has 2 items; the string branch multiplies its length 2 by 10." },
      { id: "b", label: "2 2", correct: false, why: "Strings take the second branch, which multiplies by 10." },
      { id: "c", label: "20 2", correct: false, why: "Array.isArray is true for the array, so it returns its length directly." },
    ],
  },
  "ts-discriminated-unions": {
    prompt: "Arrange the lines to handle both members of a tagged union.",
    parsonsFragments: [
      { id: "du1", text: "switch (msg.kind) {", indent: 0 },
      { id: "du2", text: 'case "text":', indent: 1 },
      { id: "du3", text: "return msg.body;", indent: 2 },
      { id: "du4", text: 'case "ping":', indent: 1 },
      { id: "du5", text: 'return "pong";', indent: 2 },
      { id: "du6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blank for the type that proves every case was handled.",
    fadedLines: [{ text: "const unreachable: ___ = msg;", blanks: ["never"] }],
    fadedExplain: "After every case, nothing is left, so the value's type is never.",
    predictCode: code`type Msg = { kind: "text"; body: string } | { kind: "ping" };
const msgs: Msg[] = [{ kind: "ping" }, { kind: "text", body: "hi" }];
console.log(msgs.map((m) => (m.kind === "text" ? m.body : "*")).join(""));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "*hi", correct: true, why: "The ping becomes \"*\" and the text message contributes its body." },
      { id: "b", label: "hi*", correct: false, why: "The ping comes first in the array." },
      { id: "c", label: "pinghi", correct: false, why: "Non-text messages map to \"*\", not their kind." },
    ],
  },
  "ts-generic-constraints": {
    prompt: "Arrange the lines of a constrained generic function.",
    parsonsFragments: [
      { id: "gc1", text: "function size<T extends { length: number }>(item: T): number {", indent: 0 },
      { id: "gc2", text: "return item.length;", indent: 1 },
      { id: "gc3", text: "}", indent: 0 },
      { id: "gc4", text: 'console.log(size("comet"), size([1, 2]));', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks so a key must be one of the object's keys.",
    fadedLines: [{ text: "function get<T, K ___ ___ T>(obj: T, key: K) {", blanks: ["extends", "keyof"] }],
    fadedExplain: "`K extends keyof T` limits K to real property names of T.",
    predictCode: code`function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
console.log(getProp({ a: 1, b: "two" }, "b"));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "two", correct: true, why: "The key \"b\" reads the value \"two\"." },
      { id: "b", label: "b", correct: false, why: "The function returns the value stored under the key." },
      { id: "c", label: "1", correct: false, why: "1 belongs to the key a." },
    ],
  },
  "ts-keyof-typeof": {
    prompt: "Arrange the lines to derive a type from an object.",
    parsonsFragments: [
      { id: "kt1", text: "const sizes = { s: 1, m: 2, l: 3 };", indent: 0 },
      { id: "kt2", text: "type Size = keyof typeof sizes;", indent: 0 },
      { id: "kt3", text: 'const pick: Size = "m";', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to copy an object's shape into a type.",
    fadedLines: [{ text: "type Theme = ___ palette;", blanks: ["typeof"] }],
    fadedExplain: "In a type position, typeof gives you the type of a value.",
    predictCode: code`const sizes = { s: 1, m: 2, l: 3 };
type Size = keyof typeof sizes;
const pick: Size = "m";
console.log(pick, sizes[pick]);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "m 2", correct: true, why: "pick holds the key \"m\", which maps to 2." },
      { id: "b", label: "2 m", correct: false, why: "The key is logged first, then its value." },
      { id: "c", label: "m undefined", correct: false, why: "\"m\" is a real key of sizes." },
    ],
  },
  "ts-readonly-const": {
    prompt: "Arrange the lines to build a union type from a constant array.",
    parsonsFragments: [
      { id: "rc1", text: 'const LEVELS = ["low", "mid", "high"] as const;', indent: 0 },
      { id: "rc2", text: "type Level = (typeof LEVELS)[number];", indent: 0 },
      { id: "rc3", text: 'const current: Level = "mid";', indent: 0 },
    ],
    fadedPrompt: "Fill the blank to stop a property from being reassigned.",
    fadedLines: [{ text: "interface Config { ___ apiUrl: string }", blanks: ["readonly"] }],
    fadedExplain: "A readonly property can be set when the object is created, then never changed.",
    predictCode: code`const point = { x: 1, y: 2 } as const;
const copy = { ...point, x: 5 };
console.log(copy.x, point.x);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5 1", correct: true, why: "The spread makes a new object; the original point is untouched." },
      { id: "b", label: "5 5", correct: false, why: "copy is a separate object, so point.x stays 1." },
      { id: "c", label: "1 1", correct: false, why: "The later x: 5 overrides the copied value in copy." },
    ],
  },
  "ts-unknown-never": {
    prompt: "Arrange the lines to use an unknown value safely.",
    parsonsFragments: [
      { id: "un1", text: 'const data: unknown = JSON.parse("42");', indent: 0 },
      { id: "un2", text: 'if (typeof data === "number") {', indent: 0 },
      { id: "un3", text: "console.log(data + 1);", indent: 1 },
      { id: "un4", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blank for a function that always throws.",
    fadedLines: [{ text: "function fail(msg: string): ___ {", blanks: ["never"] }],
    fadedExplain: "A function that never returns normally has the return type never.",
    predictCode: code`const value: unknown = 42;
console.log(typeof value === "number" ? value + 1 : "not a number");`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "43", correct: true, why: "The typeof check narrows value to number, so adding 1 works." },
      { id: "b", label: "not a number", correct: false, why: "42 is a number, so the first branch runs." },
      { id: "c", label: "421", correct: false, why: "value is a number, so + adds instead of joining." },
    ],
  },
  "ts-infer": {
    prompt: "Arrange the lines of a type that unwraps a promise.",
    parsonsFragments: [
      { id: "if1", text: "type Unwrap<T> = T extends Promise<infer V>", indent: 0 },
      { id: "if2", text: "? V", indent: 1 },
      { id: "if3", text: ": T;", indent: 1 },
      { id: "if4", text: "const n: Unwrap<Promise<number>> = 5;", indent: 0 },
    ],
    fadedPrompt: "Fill the blank to capture an array's element type.",
    fadedLines: [{ text: "type ElementOf<T> = T extends (___ E)[] ? E : never;", blanks: ["infer"] }],
    fadedExplain: "`infer E` lets TypeScript fill in the element type from the match.",
    predictCode: code`type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;
const tail: Last<[1, 2, "three"]> = "three";
console.log(tail.toUpperCase());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "THREE", correct: true, why: "Last extracts the string \"three\", so toUpperCase is allowed and runs." },
      { id: "b", label: "three", correct: false, why: "toUpperCase changes it to capitals." },
      { id: "c", label: "2", correct: false, why: "Last picks the final element of the tuple type." },
    ],
  },
  "ts-overloads": {
    prompt: "Arrange the overload signatures and the implementation.",
    parsonsFragments: [
      { id: "ov1", text: "function len(x: string): number;", indent: 0 },
      { id: "ov2", text: "function len(x: unknown[]): number;", indent: 0 },
      { id: "ov3", text: "function len(x: string | unknown[]): number {", indent: 0 },
      { id: "ov4", text: "return x.length;", indent: 1 },
      { id: "ov5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blank: the implementation must accept every overload.",
    fadedLines: [{ text: "function parse(input: string ___ string[]): number | number[] {", blanks: ["|"] }],
    fadedExplain: "The implementation signature takes the union of all overload parameter types.",
    predictCode: code`function double(x: number): number;
function double(x: string): string;
function double(x: number | string): number | string {
  return typeof x === "number" ? x * 2 : x + x;
}
console.log(double(4), double("ab"));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "8 abab", correct: true, why: "Numbers are multiplied and strings are repeated." },
      { id: "b", label: "8 ab2", correct: false, why: "The string branch returns x + x." },
      { id: "c", label: "44 abab", correct: false, why: "4 takes the number branch: 4 * 2." },
    ],
  },
  "ts-branded-types": {
    prompt: "Arrange the lines to create a branded id type.",
    parsonsFragments: [
      { id: "br1", text: 'type UserId = string & { readonly __brand: "UserId" };', indent: 0 },
      { id: "br2", text: "const toUserId = (raw: string) => raw as UserId;", indent: 0 },
      { id: "br3", text: 'const id = toUserId("u_1");', indent: 0 },
    ],
    fadedPrompt: "Fill the blank to cast a checked value to its brand.",
    fadedLines: [{ text: "return raw ___ OrderId;", blanks: ["as"] }],
    fadedExplain: "The brand is applied with a cast inside the one function allowed to create it.",
    predictCode: code`type Id = string & { readonly __brand: "Id" };
const id = "abc" as Id;
console.log(typeof id, id.toUpperCase());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "string ABC", correct: true, why: "Brands exist only for the type checker; at run time it is a plain string." },
      { id: "b", label: "object ABC", correct: false, why: "The intersection with an object type is only a compile-time label." },
      { id: "c", label: "Id ABC", correct: false, why: "typeof reports JavaScript types, and there is no Id type at run time." },
    ],
  },
  "ts-async-types": {
    prompt: "Arrange the lines of a typed async function.",
    parsonsFragments: [
      { id: "as1", text: "async function total(): Promise<number> {", indent: 0 },
      { id: "as2", text: "const a = await Promise.resolve(2);", indent: 1 },
      { id: "as3", text: "return a + 3;", indent: 1 },
      { id: "as4", text: "}", indent: 0 },
      { id: "as5", text: "total().then((n) => console.log(n));", indent: 0 },
    ],
    fadedPrompt: "Fill the blank for a function that resolves to a list of strings.",
    fadedLines: [{ text: "async function names(): ___<string[]> {", blanks: ["Promise"] }],
    fadedExplain: "An async function returns a Promise of whatever it returns.",
    predictCode: code`async function value(): Promise<number> {
  return 5;
}
const p = value();
console.log(p instanceof Promise);
p.then((v) => console.log(v + 1));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "true\n6", correct: true, why: "Calling an async function gives a Promise right away; its value arrives afterwards." },
      { id: "b", label: "false\n6", correct: false, why: "An async function always returns a Promise." },
      { id: "c", label: "6\ntrue", correct: false, why: "The synchronous log runs before the then callback." },
    ],
  },
};
