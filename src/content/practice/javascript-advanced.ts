import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";

/** Practice drills for the lessons in lessons/javascript-advanced.ts. */
export const javascriptAdvancedPractice: Record<string, PracticeDataset> = {
  "js-promises": {
    prompt: "Arrange the lines to chain a promise and handle failure.",
    parsonsFragments: [
      { id: "pr1", text: "loadSky()", indent: 0 },
      { id: "pr2", text: ".then((sky) => sky.toUpperCase())", indent: 1 },
      { id: "pr3", text: ".then((sky) => console.log(sky))", indent: 1 },
      { id: "pr4", text: '.catch((e) => console.log("failed", e.message));', indent: 1 },
    ],
    fadedPrompt: "Fill the blanks to wait for several promises, keeping every outcome.",
    fadedLines: [{ text: "const results = await Promise.___([a, b, c]);", blanks: ["allSettled"] }],
    fadedExplain: "`Promise.allSettled` waits for every promise and never rejects, so you can inspect each outcome.",
    predictCode: code`console.log("A");
Promise.resolve("B").then((v) => console.log(v));
console.log("C");`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "A\nC\nB", correct: true, why: "`.then` callbacks wait until the current code has finished running." },
      { id: "b", label: "A\nB\nC", correct: false, why: "Even an already resolved promise runs its then callback later, as a microtask." },
      { id: "c", label: "B\nA\nC", correct: false, why: "Synchronous logs run in order first; the callback comes after." },
    ],
  },
  "js-dom-basics": {
    prompt: "Arrange the lines to find the status paragraph and change it.",
    parsonsFragments: [
      { id: "db1", text: 'const status = document.querySelector(".status");', indent: 0 },
      { id: "db2", text: 'status.textContent = "Stars found";', indent: 0 },
      { id: "db3", text: 'status.classList.add("glow");', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to select every list item and hide the first one.",
    fadedLines: [
      { text: 'const items = document.___("li");', blanks: ["querySelectorAll"] },
      { text: 'items[0].classList.___("hidden");', blanks: ["add"] },
    ],
    fadedExplain: "`querySelectorAll` returns every match, and `classList.add` applies a class.",
    predictCode: code`const items = document.querySelectorAll("li");
items[0].textContent = "Sun";
console.log(items.length, items[0].textContent);`,
    predictQuestion: "What does this program print? (The page has three planets in a list.)",
    predictOptions: [
      { id: "a", label: "3 Sun", correct: true, why: "There are three li elements, and the first one's text was just changed." },
      { id: "b", label: "3 Mercury", correct: false, why: "The text was replaced before it was logged." },
      { id: "c", label: "1 Sun", correct: false, why: "querySelectorAll returns every match, not just the first." },
    ],
  },
  "js-events": {
    prompt: "Arrange the lines to log a message whenever the button is clicked.",
    parsonsFragments: [
      { id: "ev1", text: 'const button = document.querySelector("#launch");', indent: 0 },
      { id: "ev2", text: 'button.addEventListener("click", () => {', indent: 0 },
      { id: "ev3", text: 'console.log("clicked");', indent: 1 },
      { id: "ev4", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to listen for clicks and fire one from code.",
    fadedLines: [
      { text: 'reset.___("click", onReset);', blanks: ["addEventListener"] },
      { text: "reset.___();", blanks: ["click"] },
    ],
    fadedExplain: "`addEventListener` registers the handler and `click()` fires a click from code.",
    predictCode: code`const button = document.querySelector("#launch");
let clicks = 0;
button.addEventListener("click", () => clicks++);
button.click();
button.click();
console.log(clicks);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "Each click() runs the handler once." },
      { id: "b", label: "0", correct: false, why: "click() fires real click events, so the handler runs." },
      { id: "c", label: "1", correct: false, why: "The listener stays attached and runs for every click." },
    ],
  },
  "js-dom-create": {
    prompt: "Arrange the lines to add a new item to the list.",
    parsonsFragments: [
      { id: "dc1", text: 'const list = document.querySelector("#stars");', indent: 0 },
      { id: "dc2", text: 'const li = document.createElement("li");', indent: 0 },
      { id: "dc3", text: 'li.textContent = "Vega";', indent: 0 },
      { id: "dc4", text: "list.append(li);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to make an element and later take it off the page.",
    fadedLines: [
      { text: 'const note = document.___("p");', blanks: ["createElement"] },
      { text: "note.___();", blanks: ["remove"] },
    ],
    fadedExplain: "`createElement` makes a new element and `remove` detaches it from the page.",
    predictCode: code`const p = document.querySelector("#summary");
const b = document.createElement("b");
b.textContent = "bright";
p.append("Very ", b);
console.log(p.textContent);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Very bright", correct: true, why: "append adds the text and the element, and textContent reads all the text inside." },
      { id: "b", label: "Very <b>bright</b>", correct: false, why: "textContent returns text only, never the tags." },
      { id: "c", label: "bright", correct: false, why: "The text \"Very \" was appended too." },
    ],
  },
  "js-recursion": {
    prompt: "Arrange the lines of a recursive countdown.",
    parsonsFragments: [
      { id: "re1", text: "const countdown = (n) => {", indent: 0 },
      { id: "re2", text: "if (n === 0) return;", indent: 1 },
      { id: "re3", text: "console.log(n);", indent: 1 },
      { id: "re4", text: "countdown(n - 1);", indent: 1 },
      { id: "re5", text: "};", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks for the base case and the smaller call.",
    fadedLines: [{ text: "const fact = (n) => (n <= ___ ? 1 : n * fact(___));", blanks: ["1", "n - 1"] }],
    fadedExplain: "The base case stops at 1 and each call works on n - 1.",
    predictCode: code`const f = (n) => (n === 0 ? "" : f(n - 1) + n);
console.log(f(3));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "123", correct: true, why: "The deepest call returns \"\" and each level adds its n on the way back up." },
      { id: "b", label: "321", correct: false, why: "n is added after the smaller call returns, so smaller numbers come first." },
      { id: "c", label: "6", correct: false, why: "Adding a number to a string joins them as text." },
    ],
  },
  "js-searching": {
    prompt: "Arrange the lines of a binary search loop.",
    parsonsFragments: [
      { id: "bs1", text: "while (low <= high) {", indent: 0 },
      { id: "bs2", text: "const mid = Math.floor((low + high) / 2);", indent: 1 },
      { id: "bs3", text: "if (items[mid] < target) low = mid + 1;", indent: 1 },
      { id: "bs4", text: "else high = mid - 1;", indent: 1 },
      { id: "bs5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to set up the search window.",
    fadedLines: [
      { text: "let low = ___;", blanks: ["0"] },
      { text: "let high = items.length - ___;", blanks: ["1"] },
    ],
    fadedExplain: "The window starts at the first index and ends at the last one.",
    predictCode: code`const items = [2, 4, 6, 8, 10, 12, 14];
const low = 0;
const high = items.length - 1;
const mid = Math.floor((low + high) / 2);
console.log(mid, items[mid]);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3 8", correct: true, why: "(0 + 6) / 2 is 3, and index 3 holds 8." },
      { id: "b", label: "3 6", correct: false, why: "Index 3 is the fourth item, which is 8." },
      { id: "c", label: "3.5 8", correct: false, why: "Math.floor keeps the index a whole number." },
    ],
  },
  "js-sorting-algorithms": {
    prompt: "Arrange the lines of merge sort.",
    parsonsFragments: [
      { id: "ms1", text: "const mergeSort = (items) => {", indent: 0 },
      { id: "ms2", text: "if (items.length <= 1) return items;", indent: 1 },
      { id: "ms3", text: "const mid = Math.floor(items.length / 2);", indent: 1 },
      { id: "ms4", text: "return merge(mergeSort(items.slice(0, mid)), mergeSort(items.slice(mid)));", indent: 1 },
      { id: "ms5", text: "};", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: shift bigger items to the right while inserting.",
    fadedLines: [
      { text: "while (j >= 0 && out[j] ___ current) {", blanks: [">"] },
      { text: "  out[j + 1] = out[___];", blanks: ["j"] },
      { text: "  j--;", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Insertion sort moves each larger item one place right to open a gap.",
    predictCode: code`console.log([5, 1, 4].toSorted((a, b) => a - b), [5, 1, 4].length);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 1, 4, 5 ] 3", correct: true, why: "toSorted returns a new sorted array and leaves the original alone." },
      { id: "b", label: "[ 5, 4, 1 ] 3", correct: false, why: "a - b sorts ascending." },
      { id: "c", label: "[ 1, 4, 5 ] undefined", correct: false, why: "The second array still has three items." },
    ],
  },
  "js-stacks-queues": {
    prompt: "Arrange the lines to serve a queue in arrival order.",
    parsonsFragments: [
      { id: "sq1", text: 'const line = ["Nova", "Luka"];', indent: 0 },
      { id: "sq2", text: "while (line.length > 0) {", indent: 0 },
      { id: "sq3", text: "console.log(line.shift());", indent: 1 },
      { id: "sq4", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: push onto a stack, then take the top.",
    fadedLines: [
      { text: 'stack.___("page");', blanks: ["push"] },
      { text: "const top = stack.___();", blanks: ["pop"] },
    ],
    fadedExplain: "push adds to the end and pop removes from the end: last in, first out.",
    predictCode: code`const stack = [];
stack.push(1);
stack.push(2);
stack.pop();
stack.push(3);
console.log(stack);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 1, 3 ]", correct: true, why: "pop removed the 2, then 3 was pushed." },
      { id: "b", label: "[ 2, 3 ]", correct: false, why: "pop takes the most recent item, which was 2." },
      { id: "c", label: "[ 1, 2, 3 ]", correct: false, why: "pop removed one item before 3 was added." },
    ],
  },
  "js-hash-patterns": {
    prompt: "Arrange the lines to count letters with a Map.",
    parsonsFragments: [
      { id: "hp1", text: "const counts = new Map();", indent: 0 },
      { id: "hp2", text: 'for (const ch of "moon") {', indent: 0 },
      { id: "hp3", text: "counts.set(ch, (counts.get(ch) || 0) + 1);", indent: 1 },
      { id: "hp4", text: "}", indent: 0 },
      { id: "hp5", text: 'console.log(counts.get("o"));', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to check for and record a number you have seen.",
    fadedLines: [
      { text: "if (seen.___(target - n)) return true;", blanks: ["has"] },
      { text: "seen.___(n);", blanks: ["add"] },
    ],
    fadedExplain: "A Set answers `has` in constant time, so one pass is enough.",
    predictCode: code`const counts = {};
for (const ch of "banana") counts[ch] = (counts[ch] || 0) + 1;
console.log(counts);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "{ b: 1, a: 3, n: 2 }", correct: true, why: "Keys appear in the order first seen, with how often each letter occurs." },
      { id: "b", label: "{ a: 3, b: 1, n: 2 }", correct: false, why: "Object keys keep insertion order, and b was seen first." },
      { id: "c", label: "{ b: 1, a: 1, n: 1 }", correct: false, why: "Each repeat adds one to the existing count." },
    ],
  },
  "js-memoization": {
    prompt: "Arrange the lines of a memoize helper.",
    parsonsFragments: [
      { id: "me1", text: "const memoize = (fn) => {", indent: 0 },
      { id: "me2", text: "const cache = new Map();", indent: 1 },
      { id: "me3", text: "return (n) => {", indent: 1 },
      { id: "me4", text: "if (!cache.has(n)) cache.set(n, fn(n));", indent: 2 },
      { id: "me5", text: "return cache.get(n);", indent: 2 },
      { id: "me6", text: "};", indent: 1 },
      { id: "me7", text: "};", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to read from the cache before computing.",
    fadedLines: [{ text: "if (cache.___(n)) return cache.___(n);", blanks: ["has", "get"] }],
    fadedExplain: "Check with has, then return the stored value with get.",
    predictCode: code`const memo = new Map();
const square = (n) => {
  if (memo.has(n)) return "cached";
  memo.set(n, n * n);
  return memo.get(n);
};
console.log(square(4), square(4));`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "16 cached", correct: true, why: "The first call stores 16; the second finds 4 in the map." },
      { id: "b", label: "16 16", correct: false, why: "This function returns \"cached\" when the value is already stored." },
      { id: "c", label: "cached cached", correct: false, why: "The map starts empty, so the first call computes the square." },
    ],
  },
  "js-generators": {
    prompt: "Arrange the lines of a generator that yields three names.",
    parsonsFragments: [
      { id: "ge1", text: "function* crew() {", indent: 0 },
      { id: "ge2", text: 'yield "Nova";', indent: 1 },
      { id: "ge3", text: 'yield "Luka";', indent: 1 },
      { id: "ge4", text: 'yield "Mira";', indent: 1 },
      { id: "ge5", text: "}", indent: 0 },
      { id: "ge6", text: "console.log([...crew()]);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to declare a generator and hand out a value.",
    fadedLines: [
      { text: "function___ counter() {", blanks: ["*"] },
      { text: "  ___ 1;", blanks: ["yield"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The star marks a generator function and yield hands out a value.",
    predictCode: code`function* g() {
  yield 1;
  yield 2;
}
const it = g();
console.log(it.next(), it.next().value, it.next().done);`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "{ value: 1, done: false } 2 true", correct: true, why: "The first next gives the full result object; after two yields the third is done." },
      { id: "b", label: "1 2 true", correct: false, why: "next() returns an object with value and done, not just the value." },
      { id: "c", label: "{ value: 1, done: false } 2 false", correct: false, why: "After the last yield the generator finishes, so done is true." },
    ],
  },
  "js-iterators-protocol": {
    prompt: "Arrange the lines to make an object iterable with a generator method.",
    parsonsFragments: [
      { id: "ip1", text: "const trio = {", indent: 0 },
      { id: "ip2", text: "*[Symbol.iterator]() {", indent: 1 },
      { id: "ip3", text: "yield 1; yield 2; yield 3;", indent: 2 },
      { id: "ip4", text: "},", indent: 1 },
      { id: "ip5", text: "};", indent: 0 },
      { id: "ip6", text: "console.log([...trio]);", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks for the method name and the result shape.",
    fadedLines: [
      { text: "[Symbol.___]() {", blanks: ["iterator"] },
      { text: "  return { next: () => ({ value: 1, ___: true }) };", blanks: ["done"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Iterables expose Symbol.iterator, and each next() returns { value, done }.",
    predictCode: code`const it = [10, 20][Symbol.iterator]();
it.next();
console.log(it.next());`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "{ value: 20, done: false }", correct: true, why: "The first next() used up 10, so the second returns 20 and is not done yet." },
      { id: "b", label: "{ value: 10, done: false }", correct: false, why: "The first call already consumed 10." },
      { id: "c", label: "{ value: undefined, done: true }", correct: false, why: "Only after a third call is the array exhausted." },
    ],
  },
};
