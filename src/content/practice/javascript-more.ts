import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";

/** Practice drills for the lessons in lessons/javascript-more.ts. */
export const javascriptMorePractice: Record<string, PracticeDataset> = {
  "js-numbers-math": {
    prompt: "Arrange the lines to work out an average and round it.",
    parsonsFragments: [
      { id: "jn1", text: "const total = 7 + 8 + 10;", indent: 0 },
      { id: "jn2", text: "const average = total / 3;", indent: 0 },
      { id: "jn3", text: "console.log(Math.round(average));", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: the remainder of 17 divided by 5, then the largest of three numbers.",
    fadedLines: [
      { text: "console.log(17 ___ 5);", blanks: ["%"] },
      { text: "console.log(Math.___(4, 9, 2));", blanks: ["max"] },
    ],
    fadedExplain: "`%` gives the remainder and `Math.max` returns the largest argument.",
    predictCode: code`console.log(7 % 3, 2 ** 3, Math.round(2.5));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1 8 3", correct: true, why: "7 % 3 is 1, 2 ** 3 is 8, and Math.round rounds 2.5 up to 3." },
      { id: "b", label: "1 6 2", correct: false, why: "`**` is a power, not multiplication, and Math.round(2.5) is 3." },
      { id: "c", label: "2 8 3", correct: false, why: "7 divided by 3 leaves a remainder of 1." },
    ],
  },
  "js-strings": {
    prompt: "Arrange the lines to build and print a greeting.",
    parsonsFragments: [
      { id: "js1", text: 'const name = "Luna";', indent: 0 },
      { id: "js2", text: "const greeting = `Hi, ${name}!`;", indent: 0 },
      { id: "js3", text: "console.log(greeting.toUpperCase());", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: trim the spaces, then check whether a word is inside.",
    fadedLines: [
      { text: 'const clean = raw.___();', blanks: ["trim"] },
      { text: 'console.log(clean.___("moon"));', blanks: ["includes"] },
    ],
    fadedExplain: "`.trim()` removes surrounding spaces and `.includes()` checks for a substring.",
    predictCode: code`const word = "stardust";
console.log(word.replace("dust", "light").length);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "9", correct: true, why: "replace gives \"starlight\", which has 9 characters." },
      { id: "b", label: "8", correct: false, why: "That is the length of \"stardust\", but replace returned \"starlight\"." },
      { id: "c", label: "starlight", correct: false, why: "`.length` gives a number, not the text." },
    ],
  },
  "js-type-conversion": {
    prompt: "Arrange the lines to turn text into a number and double it.",
    parsonsFragments: [
      { id: "jt1", text: 'const text = "12";', indent: 0 },
      { id: "jt2", text: "const n = Number(text);", indent: 0 },
      { id: "jt3", text: "console.log(n * 2);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to check a type and convert a number to text.",
    fadedLines: [
      { text: "console.log(___ 42);", blanks: ["typeof"] },
      { text: 'console.log(___(42) + "!");', blanks: ["String"] },
    ],
    fadedExplain: "`typeof` names the type and `String()` converts a value to text.",
    predictCode: code`console.log(typeof null, typeof undefined);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "object undefined", correct: true, why: "typeof null is \"object\": a famous quirk kept for backwards compatibility." },
      { id: "b", label: "null undefined", correct: false, why: "There is no \"null\" type name; typeof null reports \"object\"." },
      { id: "c", label: "undefined undefined", correct: false, why: "null and undefined are different values with different typeof results." },
    ],
  },
  "js-switch": {
    prompt: "Arrange the lines of a switch with a default case.",
    parsonsFragments: [
      { id: "sw1", text: "switch (mode) {", indent: 0 },
      { id: "sw2", text: 'case "day":', indent: 1 },
      { id: "sw3", text: 'console.log("sun");', indent: 2 },
      { id: "sw4", text: "break;", indent: 2 },
      { id: "sw5", text: "default:", indent: 1 },
      { id: "sw6", text: 'console.log("moon");', indent: 2 },
      { id: "sw7", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to stop after a match and catch everything else.",
    fadedLines: [
      { text: 'case "full":', blanks: [] },
      { text: '  console.log("bright");', blanks: [] },
      { text: "  ___;", blanks: ["break"] },
      { text: "___:", blanks: ["default"] },
    ],
    fadedExplain: "`break` stops the switch after a match, and `default` handles any other value.",
    predictCode: code`const n = 2;
switch (n) {
  case 1:
    console.log("one");
  case 2:
    console.log("two");
  case 3:
    console.log("three");
}`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "two\nthree", correct: true, why: "Without break, execution falls through from case 2 into case 3." },
      { id: "b", label: "two", correct: false, why: "There is no break after case 2, so case 3 runs too." },
      { id: "c", label: "one\ntwo\nthree", correct: false, why: "The switch starts at the matching case, which is 2." },
    ],
  },
  "js-while-loops": {
    prompt: "Arrange the lines to count down from 3 with a while loop.",
    parsonsFragments: [
      { id: "wl1", text: "let n = 3;", indent: 0 },
      { id: "wl2", text: "while (n > 0) {", indent: 0 },
      { id: "wl3", text: "console.log(n);", indent: 1 },
      { id: "wl4", text: "n--;", indent: 1 },
      { id: "wl5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks for a loop that always runs once.",
    fadedLines: [
      { text: "___ {", blanks: ["do"] },
      { text: "  tries++;", blanks: [] },
      { text: "} ___ (tries < 3);", blanks: ["while"] },
    ],
    fadedExplain: "A do...while loop runs the block first, then checks the condition.",
    predictCode: code`let i = 0;
while (i < 3) {
  i += 2;
}
console.log(i);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: true, why: "i goes 0, 2, 4. At 4 the condition fails and the loop stops." },
      { id: "b", label: "3", correct: false, why: "i only ever takes even values: 0, 2, 4." },
      { id: "c", label: "2", correct: false, why: "2 is still less than 3, so the loop runs once more." },
    ],
  },
  "js-loop-control": {
    prompt: "Arrange the lines to print odd numbers only.",
    parsonsFragments: [
      { id: "lc1", text: "for (let n = 1; n <= 5; n++) {", indent: 0 },
      { id: "lc2", text: "if (n % 2 === 0) continue;", indent: 1 },
      { id: "lc3", text: "console.log(n);", indent: 1 },
      { id: "lc4", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blank to stop searching once you find the target.",
    fadedLines: [
      { text: "if (item === target) {", blanks: [] },
      { text: '  console.log("found");', blanks: [] },
      { text: "  ___;", blanks: ["break"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "`break` leaves the loop as soon as the answer is found.",
    predictCode: code`let total = 0;
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  total += i;
}
console.log(total);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "8", correct: true, why: "0 + 1 + 3 + 4: the 2 is skipped by continue." },
      { id: "b", label: "10", correct: false, why: "continue skips adding 2." },
      { id: "c", label: "1", correct: false, why: "continue only skips one pass; the loop keeps going." },
    ],
  },
  "js-sorting": {
    prompt: "Arrange the lines to sort numbers from smallest to largest.",
    parsonsFragments: [
      { id: "so1", text: "const nums = [10, 2, 33];", indent: 0 },
      { id: "so2", text: "nums.sort((a, b) => a - b);", indent: 0 },
      { id: "so3", text: "console.log(nums);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to sort names alphabetically.",
    fadedLines: [{ text: "names.sort((a, b) => a.___(___));", blanks: ["localeCompare", "b"] }],
    fadedExplain: "`a.localeCompare(b)` returns a negative, zero or positive number, exactly what sort wants.",
    predictCode: code`console.log([3, 20, 100].sort());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 100, 20, 3 ]", correct: true, why: "Without a compare function the numbers are compared as text: \"100\" < \"20\" < \"3\"." },
      { id: "b", label: "[ 3, 20, 100 ]", correct: false, why: "Default sort compares strings, not numbers." },
      { id: "c", label: "[ 100, 3, 20 ]", correct: false, why: "As text, \"20\" comes before \"3\"." },
    ],
  },
  "js-map-set": {
    prompt: "Arrange the lines to remove duplicates with a Set.",
    parsonsFragments: [
      { id: "ms1", text: "const tags = ['sky', 'moon', 'sky'];", indent: 0 },
      { id: "ms2", text: "const unique = [...new Set(tags)];", indent: 0 },
      { id: "ms3", text: "console.log(unique);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to store and read a value in a Map.",
    fadedLines: [
      { text: 'orbits.___("Mars", 687);', blanks: ["set"] },
      { text: 'console.log(orbits.___("Mars"));', blanks: ["get"] },
    ],
    fadedExplain: "Maps store entries with `set` and read them with `get`.",
    predictCode: code`const s = new Set([1, 2, 2, 3]);
s.add(2);
console.log(s.size);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "A set keeps each value once: 1, 2 and 3." },
      { id: "b", label: "5", correct: false, why: "Duplicates are ignored, both at creation and in add." },
      { id: "c", label: "4", correct: false, why: "The starting array has only three distinct values." },
    ],
  },
  "js-json": {
    prompt: "Arrange the lines to save an object as JSON and read it back.",
    parsonsFragments: [
      { id: "jj1", text: "const data = { moons: 2 };", indent: 0 },
      { id: "jj2", text: "const text = JSON.stringify(data);", indent: 0 },
      { id: "jj3", text: "const back = JSON.parse(text);", indent: 0 },
      { id: "jj4", text: "console.log(back.moons);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to print indented JSON.",
    fadedLines: [{ text: "console.log(JSON.___(data, null, ___));", blanks: ["stringify", "2"] }],
    fadedExplain: "The third argument to JSON.stringify sets the indentation.",
    predictCode: code`const copy = JSON.parse(JSON.stringify({ n: 1, when: new Date(0) }));
console.log(typeof copy.when);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "string", correct: true, why: "Dates become text in JSON, and parse does not turn them back into dates." },
      { id: "b", label: "object", correct: false, why: "JSON has no date type, so the date travels as a string." },
      { id: "c", label: "number", correct: false, why: "stringify writes dates as ISO text, not as a timestamp." },
    ],
  },
  "js-higher-order-functions": {
    prompt: "Arrange the lines to build a function that multiplies by a fixed factor.",
    parsonsFragments: [
      { id: "ho1", text: "const times = (factor) => {", indent: 0 },
      { id: "ho2", text: "return (n) => n * factor;", indent: 1 },
      { id: "ho3", text: "};", indent: 0 },
      { id: "ho4", text: "console.log(times(3)(5));", indent: 0 },
    ],
    fadedPrompt: "Fill the blank to call the function that was passed in.",
    fadedLines: [
      { text: "const twice = (fn) => {", blanks: [] },
      { text: "  ___();", blanks: ["fn"] },
      { text: "  fn();", blanks: [] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "A function passed as an argument is called like any other: `fn()`.",
    predictCode: code`const makeAdder = (a) => (b) => a + b;
const addFive = makeAdder(5);
console.log(addFive(10), makeAdder(1)(1));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "15 2", correct: true, why: "addFive remembers 5 and adds 10; makeAdder(1)(1) is 2." },
      { id: "b", label: "15 11", correct: false, why: "Each makeAdder call creates its own remembered value." },
      { id: "c", label: "[Function] 2", correct: false, why: "addFive(10) calls the returned function, which gives a number." },
    ],
  },
  "js-inheritance": {
    prompt: "Arrange the lines so Comet extends SpaceObject.",
    parsonsFragments: [
      { id: "in1", text: "class SpaceObject {", indent: 0 },
      { id: "in2", text: 'describe() { return "drifting"; }', indent: 1 },
      { id: "in3", text: "}", indent: 0 },
      { id: "in4", text: "class Comet extends SpaceObject {}", indent: 0 },
      { id: "in5", text: "console.log(new Comet().describe());", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to call the parent constructor.",
    fadedLines: [
      { text: "class Comet ___ SpaceObject {", blanks: ["extends"] },
      { text: "  constructor(name) {", blanks: [] },
      { text: "    ___(name);", blanks: ["super"] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "`extends` names the parent, and `super(name)` runs its constructor.",
    predictCode: code`class A {
  hello() {
    return "A";
  }
}

class B extends A {
  hello() {
    return "B" + super.hello();
  }
}

console.log(new B().hello());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "BA", correct: true, why: "B's hello puts \"B\" before the parent's result." },
      { id: "b", label: "B", correct: false, why: "super.hello() also runs and adds \"A\"." },
      { id: "c", label: "AB", correct: false, why: "The child's \"B\" comes first in the returned string." },
    ],
  },
  "js-this-binding": {
    prompt: "Arrange the lines so the callback keeps the object's this.",
    parsonsFragments: [
      { id: "tb1", text: "const ship = {", indent: 0 },
      { id: "tb2", text: 'name: "Nova",', indent: 1 },
      { id: "tb3", text: "launch() {", indent: 1 },
      { id: "tb4", text: "return [1, 2].map((n) => this.name + n);", indent: 2 },
      { id: "tb5", text: "},", indent: 1 },
      { id: "tb6", text: "};", indent: 0 },
    ],
    fadedPrompt: "Fill the blank to lock this to an object.",
    fadedLines: [{ text: "const fixed = greet.___(ship);", blanks: ["bind"] }],
    fadedExplain: "`bind` returns a copy of the function whose this is always the given object.",
    predictCode: code`const user = {
  name: "Mira",
  hi() {
    return "hi " + this.name;
  },
};
const other = { name: "Luka", hi: user.hi };
console.log(user.hi(), other.hi());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "hi Mira hi Luka", correct: true, why: "this is whatever object the method is called on." },
      { id: "b", label: "hi Mira hi Mira", correct: false, why: "The function is shared, but this depends on the call: other.hi() uses other." },
      { id: "c", label: "hi undefined hi undefined", correct: false, why: "Both calls have an object before the dot, so this is set." },
    ],
  },
};
