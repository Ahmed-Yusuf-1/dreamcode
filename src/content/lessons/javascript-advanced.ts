import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";

const PLANETS_PAGE = `<h1 id="title">Night sky</h1>
<p class="status">Waiting for stars...</p>
<ul id="planets">
  <li>Mercury</li>
  <li>Venus</li>
  <li>Earth</li>
</ul>`;

const LAUNCH_PAGE = `<p>Launches: <strong id="count">0</strong></p>
<button id="launch">Launch</button>
<button id="reset">Reset</button>`;

const STARS_PAGE = `<h2>Tonight's stars</h2>
<ul id="stars"></ul>
<p id="summary"></p>`;

/**
 * JavaScript lessons for async code, the live-page Web API chapter, algorithms,
 * and the expert iteration topics. Two lessons here replace weaker first-pass
 * versions (DOM basics and ES modules) under their original slugs.
 */
export const javascriptAdvancedLessons: Lesson[] = [
  {
    slug: "js-promises",
    order: 32,
    chapter: "JS Async and Errors",
    kicker: "JS ASYNC",
    title: "Promises",
    catalogTitle: "Promises",
    blurb: "Represent a value that arrives later, and chain what happens next.",
    catalogCode: "fetchData().then(show).catch(warn)",
    language: "javascript",
    intro:
      "A **Promise** stands for a value that is not ready yet. It starts **pending**, then either **fulfills** with a value or **rejects** with an error. `.then(fn)` runs when it fulfills, `.catch(fn)` when it rejects, and `.finally(fn)` either way. `Promise.all` waits for several promises and fails as soon as any one rejects; `Promise.allSettled` waits for every one of them no matter what.",
    example: code`const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

wait(20, "stars")
  .then((v) => v.toUpperCase())
  .then((v) => console.log("got", v))
  .finally(() => console.log("done waiting"));

Promise.all([wait(10, 1), wait(5, 2)]).then((values) => console.log(values));

Promise.reject(new Error("no signal")).catch((e) => console.log("caught:", e.message));`,
    reads: [
      { dot: DOT_PINK, text: "Each `.then` receives what the previous step returned" },
      { dot: DOT_MINT, text: "`Promise.all` keeps the results in the order you passed the promises" },
      { dot: DOT_LAVENDER, text: "The rejection is caught first: it needs no timer, so it settles right away" },
    ],
    tip: "Return the next promise from inside `.then` to keep a chain flat instead of nesting callbacks.",
    mistakes: ["A promise chain with no `.catch` hides errors. Every chain should end with a catch, or be awaited inside try...catch."],
    starter: code`const loadStar = (name) =>
  new Promise((resolve, reject) => {
    if (name) resolve(\`\${name} loaded\`);
    else reject(new Error("no name"));
  });

loadStar("Vega").then((msg) => console.log(msg));`,
    task: {
      prompt: "Also call `loadStar(\"\")` and handle its rejection with `.catch`, logging `failed: no name`.",
      expectOutput: ["Vega loaded", "failed: no name"],
      mustInclude: ["\\.catch\\("],
      hint: "`loadStar(\"\").catch((e) => console.log(\"failed:\", e.message));`",
      solution: code`const loadStar = (name) =>
  new Promise((resolve, reject) => {
    if (name) resolve(\`\${name} loaded\`);
    else reject(new Error("no name"));
  });

loadStar("Vega").then((msg) => console.log(msg));
loadStar("").catch((e) => console.log("failed:", e.message));`,
    },
    practiceSlug: "js-promises",
    module: "JS Async and Errors",
    tier: "advanced",
  },
  {
    slug: "js-modules",
    order: 34,
    chapter: "JS Async and Errors",
    kicker: "JS MODULES",
    title: "ES Modules",
    catalogTitle: "ES Modules",
    blurb: "Split code across files with export and import.",
    catalogCode: 'import { add } from "./math.js";',
    language: "javascript",
    runnable: false,
    intro:
      "Real programs are split into many files called **modules**. Each module has its own scope: nothing inside it is visible to other files unless it is **exported**. `export const add = ...` creates a **named export**, imported with braces: `import { add } from \"./math.js\"`. A file can also have one **default export**, imported without braces and under any name you like. This lesson is read and quiz, because modules are about several files working together.",
    example: code`// file: math.js
export const add = (a, b) => a + b;

export default function square(n) {
  return n * n;
}

// file: main.js
import square, { add } from "./math.js";

console.log(add(2, 3), square(4));`,
    reads: [
      { dot: DOT_PINK, text: "`export const add` is a **named** export: import it by its exact name in braces" },
      { dot: DOT_MINT, text: "`export default` marks the file's main value: import it without braces" },
      { dot: DOT_LAVENDER, text: "Everything not exported stays private to its file" },
    ],
    tip: "Prefer named exports in shared code: editors can find them, and a typo in an import fails loudly instead of silently.",
    starter: code`// read the two files above, then answer the questions`,
    quiz: [
      {
        prompt: "How does `main.js` get the default export of `math.js`?",
        options: ['import square from "./math.js"', 'import { default } from "./math.js"', 'require("./math.js").square'],
        answer: 0,
        explain: "A default export is imported without braces, and you choose the local name.",
      },
      {
        prompt: "What does `export const add = (a, b) => a + b;` create?",
        options: ["A named export, imported with braces: `import { add }`", "A default export", "A global variable every file can see"],
        answer: 0,
        explain: "`export const` makes a named export; the importer must use the same name inside braces.",
      },
      {
        prompt: "What happens to a helper function in `math.js` that is not exported?",
        options: ["It stays private to math.js", "Every importing file can call it", "It is exported automatically as default"],
        answer: 0,
        explain: "Modules have their own scope, so only exported names are visible outside the file.",
      },
    ],
    module: "JS Async and Errors",
    tier: "advanced",
  },
  {
    slug: "js-dom-basics",
    order: 35,
    chapter: "JS Web APIs",
    kicker: "JS WEB APIS",
    title: "Finding and Changing Elements",
    catalogTitle: "DOM basics",
    blurb: "Select elements on a real page and change their text and classes.",
    catalogCode: 'document.querySelector("#title")',
    language: "javascript",
    html: PLANETS_PAGE,
    intro:
      "The **DOM** (Document Object Model) is a web page as JavaScript sees it: a tree of elements you can read and change. `document.querySelector(\"selector\")` finds the first element matching a CSS selector, and `querySelectorAll` finds every match. Change what an element says with `.textContent`, its look with `.classList.add`, `.remove` and `.toggle`, and its attributes with `.setAttribute`. The page under the editor is real: run your code and watch it change.",
    example: code`const title = document.querySelector("#title");
title.textContent = "Clear night sky";

const status = document.querySelector(".status");
status.classList.add("glow");

const planets = document.querySelectorAll("#planets li");
console.log(planets.length);
planets[2].textContent += " (home)";`,
    reads: [
      { dot: DOT_PINK, text: "`#title` selects by id and `.status` by class, exactly like CSS" },
      { dot: DOT_MINT, text: "`querySelectorAll` returns a list you can index and loop over" },
      { dot: DOT_LAVENDER, text: "Changing `textContent` or `classList` updates the page immediately" },
    ],
    tip: "Use `textContent`, not `innerHTML`, when showing text that came from a user. It can never be run as HTML.",
    mistakes: ["`querySelector` returns `null` when nothing matches, so a typo in the selector leads to \"Cannot read properties of null\"."],
    starter: code`const status = document.querySelector(".status");
console.log(status.textContent);`,
    task: {
      prompt: "Count the `li` elements and change the status text to `3 planets found` (build it from the count), then log the new text.",
      expectOutput: ["3 planets found"],
      mustInclude: ["querySelectorAll", "textContent\\s*="],
      hint: "`document.querySelectorAll(\"#planets li\").length` gives the count.",
      solution: code`const status = document.querySelector(".status");
const planets = document.querySelectorAll("#planets li");
status.textContent = \`\${planets.length} planets found\`;
console.log(status.textContent);`,
    },
    practiceSlug: "js-dom-basics",
    module: "JS Web APIs",
    tier: "intermediate",
  },
  {
    slug: "js-events",
    order: 36,
    chapter: "JS Web APIs",
    kicker: "JS WEB APIS",
    title: "Events and Listeners",
    catalogTitle: "Events",
    blurb: "React to clicks with addEventListener.",
    catalogCode: 'button.addEventListener("click", handler)',
    language: "javascript",
    html: LAUNCH_PAGE,
    intro:
      "Pages respond to people through **events**. `element.addEventListener(\"click\", handler)` runs `handler` every time the element is clicked. The handler receives an **event object** with details such as `event.target`, the element that was clicked. After you press Run, click the buttons in the page below: your handlers run for real. You can also trigger a click from code with `element.click()`.",
    example: code`const button = document.querySelector("#launch");
const count = document.querySelector("#count");
let launches = 0;

button.addEventListener("click", () => {
  launches++;
  count.textContent = launches;
  console.log("launch", launches);
});

button.click();`,
    reads: [
      { dot: DOT_PINK, text: "The handler does not run when you add it, only when the event happens" },
      { dot: DOT_MINT, text: "`launches` lives outside the handler, so it remembers the count between clicks" },
      { dot: DOT_LAVENDER, text: "`button.click()` fires a real click event from code" },
    ],
    tip: "Pass the function itself, `addEventListener(\"click\", launch)`, not `launch()`. The parentheses would call it once, immediately.",
    starter: code`const button = document.querySelector("#launch");
button.addEventListener("click", () => {
  console.log("lift off");
});`,
    task: {
      prompt: "Make the Reset button set the count back to `0` and log `reset`. Test it by clicking Reset in the page, or by calling `.click()` on it from your code.",
      expectOutput: ["reset"],
      mustInclude: ["#reset", "addEventListener"],
      hint: "Select `#reset` and `#count`, then add a click listener that sets `count.textContent = \"0\"` and logs.",
      solution: code`const button = document.querySelector("#launch");
button.addEventListener("click", () => {
  console.log("lift off");
});

const reset = document.querySelector("#reset");
const count = document.querySelector("#count");
reset.addEventListener("click", () => {
  count.textContent = "0";
  console.log("reset");
});
reset.click();`,
    },
    practiceSlug: "js-events",
    module: "JS Web APIs",
    tier: "intermediate",
  },
  {
    slug: "js-dom-create",
    order: 37,
    chapter: "JS Web APIs",
    kicker: "JS WEB APIS",
    title: "Creating Elements",
    catalogTitle: "Creating elements",
    blurb: "Build new elements from data and add them to the page.",
    catalogCode: 'const li = document.createElement("li");',
    language: "javascript",
    html: STARS_PAGE,
    intro:
      "`document.createElement(\"li\")` makes a new element that is not on the page yet. Set its text and classes, then attach it with `parent.append(element)`. Remove one with `element.remove()`. Turning an array of data into elements, one per item, is one of the most common jobs in front-end code.",
    example: code`const list = document.querySelector("#stars");
const stars = ["Vega", "Sirius", "Deneb"];

for (const name of stars) {
  const li = document.createElement("li");
  li.textContent = name;
  list.append(li);
}

console.log(list.children.length);`,
    reads: [
      { dot: DOT_PINK, text: "`createElement` makes the element in memory only" },
      { dot: DOT_MINT, text: "`append` is what puts it on the page" },
      { dot: DOT_LAVENDER, text: "`children.length` counts the elements inside the list" },
    ],
    tip: "Build all the elements first and append them in one go when you have hundreds of items; it keeps the page fast.",
    starter: code`const list = document.querySelector("#stars");
const li = document.createElement("li");
li.textContent = "Vega";
list.append(li);
console.log(list.children.length);`,
    task: {
      prompt: "With a loop, add one `li` for each name in `[\"Altair\", \"Rigel\", \"Spica\"]`, give the second new one the class `glow`, then log how many items the list has: `4`.",
      expectOutput: ["4"],
      mustInclude: ["for\\s*\\(|forEach", "classList"],
      hint: "`[\"Altair\", \"Rigel\", \"Spica\"].forEach((name, i) => { ... })` gives you the index to find the second one.",
      solution: code`const list = document.querySelector("#stars");
const li = document.createElement("li");
li.textContent = "Vega";
list.append(li);

["Altair", "Rigel", "Spica"].forEach((name, i) => {
  const item = document.createElement("li");
  item.textContent = name;
  if (i === 1) item.classList.add("glow");
  list.append(item);
});
console.log(list.children.length);`,
    },
    practiceSlug: "js-dom-create",
    module: "JS Web APIs",
    tier: "intermediate",
  },
  {
    slug: "js-recursion",
    order: 38,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Recursion",
    catalogTitle: "Recursion",
    blurb: "Solve a problem by solving a smaller copy of it.",
    catalogCode: "n * factorial(n - 1)",
    language: "javascript",
    intro:
      "A **recursive** function calls itself on a smaller piece of the problem. It needs a **base case** that stops the calls and a **recursive case** that moves toward it. Recursion fits problems that are nested by nature, such as arrays inside arrays or folders inside folders.",
    example: code`const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

const flatten = (items) =>
  items.reduce((all, item) => (Array.isArray(item) ? [...all, ...flatten(item)] : [...all, item]), []);

console.log(factorial(5));
console.log(flatten([1, [2, [3, [4]]], 5]));`,
    reads: [
      { dot: DOT_PINK, text: "**Base case**: `n <= 1` answers without another call" },
      { dot: DOT_MINT, text: "`flatten` recurses only into items that are arrays" },
      { dot: DOT_LAVENDER, text: "Each call waits for the smaller call, then builds its own answer" },
    ],
    tip: "Assume the smaller call already works, and only decide how to use its answer.",
    mistakes: ["No base case, or a call that does not shrink the problem, ends in RangeError: Maximum call stack size exceeded."],
    starter: code`const sumTo = (n) => 0;
console.log(sumTo(4));`,
    task: {
      prompt: "Make `sumTo(n)` recursive so it adds every number from n down to 1. `sumTo(4)` should print `10`.",
      expectOutput: ["10"],
      mustInclude: ["sumTo\\(\\s*n\\s*-\\s*1\\s*\\)"],
      hint: "Base case: `n === 0` returns 0. Otherwise return `n + sumTo(n - 1)`.",
      solution: code`const sumTo = (n) => (n === 0 ? 0 : n + sumTo(n - 1));
console.log(sumTo(4));`,
    },
    practiceSlug: "js-recursion",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-searching",
    order: 39,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Binary Search",
    catalogTitle: "Binary search",
    blurb: "Find items in a sorted array by halving the search each step.",
    catalogCode: "const mid = Math.floor((low + high) / 2);",
    language: "javascript",
    intro:
      "`indexOf` and `includes` are **linear searches**: they check items one by one, O(n). **Binary search** needs a sorted array but is O(log n): look at the middle, throw away the half that cannot hold the target, repeat. A million sorted items need about 20 checks instead of a million.",
    example: code`const binarySearch = (items, target) => {
  let low = 0;
  let high = items.length - 1;
  let steps = 0;
  while (low <= high) {
    steps++;
    const mid = Math.floor((low + high) / 2);
    if (items[mid] === target) return { index: mid, steps };
    if (items[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return { index: -1, steps };
};

const heights = Array.from({ length: 200 }, (_, i) => i * 5);
console.log(binarySearch(heights, 735));
console.log(binarySearch(heights, 3));`,
    reads: [
      { dot: DOT_PINK, text: "`low` and `high` bound the part of the array that could still hold the target" },
      { dot: DOT_MINT, text: "`Math.floor` keeps `mid` a whole index" },
      { dot: DOT_LAVENDER, text: "200 items take at most 8 steps" },
    ],
    tip: "Binary search is not only for arrays: you can binary search any yes-or-no question that flips once, like \"is this version broken?\".",
    starter: code`const find = (items, target) => items.indexOf(target);

const sortedIds = [3, 8, 15, 16, 23, 30, 42, 57];
console.log(find(sortedIds, 42));
console.log(find(sortedIds, 5));`,
    task: {
      prompt: "Rewrite `find` as a binary search. It should still print `6` then `-1`.",
      expectOutput: ["6", "-1"],
      mustInclude: ["Math\\.floor", "while"],
      hint: "Keep `low` and `high`, look at the middle, and move one of them past it each step.",
      solution: code`const find = (items, target) => {
  let low = 0;
  let high = items.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (items[mid] === target) return mid;
    if (items[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
};

const sortedIds = [3, 8, 15, 16, 23, 30, 42, 57];
console.log(find(sortedIds, 42));
console.log(find(sortedIds, 5));`,
    },
    practiceSlug: "js-searching",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-sorting-algorithms",
    order: 40,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Sorting Algorithms",
    catalogTitle: "Merge sort",
    blurb: "Write insertion sort and merge sort to see how sorting works.",
    catalogCode: "merge(mergeSort(left), mergeSort(right))",
    language: "javascript",
    intro:
      "The built-in `sort` is fast, but writing a sort yourself teaches how algorithms think. **Insertion sort** grows a sorted section one item at a time: O(n^2), simple, and quick on small or nearly sorted arrays. **Merge sort** splits the array in half, sorts each half recursively, then merges the two sorted halves: O(n log n) every time.",
    example: code`const merge = (left, right) => {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
};

const mergeSort = (items) => {
  if (items.length <= 1) return items;
  const mid = Math.floor(items.length / 2);
  return merge(mergeSort(items.slice(0, mid)), mergeSort(items.slice(mid)));
};

console.log(merge([1, 4, 9], [2, 3, 10]));
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));`,
    reads: [
      { dot: DOT_PINK, text: "`merge` always takes the smaller front item of the two sorted arrays" },
      { dot: DOT_MINT, text: "`mergeSort` splits until each piece has one item" },
      { dot: DOT_LAVENDER, text: "The pieces are merged back up, level by level" },
    ],
    tip: "In real code, use `sort` with a compare function. Writing your own is for learning and for special cases.",
    starter: code`const insertionSort = (items) => {
  const out = [...items];
  // grow a sorted section from the left
  return out;
};

console.log(insertionSort([5, 2, 9, 1, 5, 6]));`,
    task: {
      prompt: "Finish `insertionSort` without calling `sort`. It should print `[ 1, 2, 5, 5, 6, 9 ]`.",
      expectOutput: ["[ 1, 2, 5, 5, 6, 9 ]"],
      mustInclude: ["while|for"],
      hint: "For each index i from 1, save `current = out[i]`, shift bigger items one place right, then drop current into the gap.",
      solution: code`const insertionSort = (items) => {
  const out = [...items];
  for (let i = 1; i < out.length; i++) {
    const current = out[i];
    let j = i - 1;
    while (j >= 0 && out[j] > current) {
      out[j + 1] = out[j];
      j--;
    }
    out[j + 1] = current;
  }
  return out;
};

console.log(insertionSort([5, 2, 9, 1, 5, 6]));`,
    },
    practiceSlug: "js-sorting-algorithms",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-stacks-queues",
    order: 41,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Stacks and Queues",
    catalogTitle: "Stacks & queues",
    blurb: "Last in, first out and first in, first out, with arrays.",
    catalogCode: "stack.push(x); stack.pop();",
    language: "javascript",
    intro:
      "A **stack** is last in, first out: `push` adds to the end and `pop` takes from the end, like a pile of plates. A **queue** is first in, first out: add with `push` and take from the front with `shift`. `shift` has to move every other item, so for big queues keep an index of the front instead. Stacks power undo and bracket matching; queues process work in arrival order.",
    example: code`const history = [];
for (const step of ["type", "bold", "color"]) history.push(step);
console.log("undo", history.pop());

const line = ["Nova", "Luka"];
line.push("Mira");
console.log("serve", line.shift());
console.log(line);`,
    reads: [
      { dot: DOT_PINK, text: "`pop` returns the most recent item: the last action is undone first" },
      { dot: DOT_MINT, text: "`shift` returns the oldest item: first come, first served" },
      { dot: DOT_LAVENDER, text: "Both change the original array" },
    ],
    tip: "Matching things in reverse order, like brackets or HTML tags, is a job for a stack.",
    starter: code`const balanced = (text) => {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  // push openers, pop and compare on closers
  return true;
};

console.log(balanced("(a[b]{c})"));
console.log(balanced("(]"));
console.log(balanced("(("));`,
    task: {
      prompt: "Finish `balanced` with the stack so it prints `true`, `false`, `false`.",
      expectOutput: ["true", "false", "false"],
      mustInclude: ["\\.pop\\(\\)", "\\.push\\("],
      hint: "Push openers. On a closer, the stack must not be empty and `stack.pop()` must equal `pairs[ch]`. At the end the stack must be empty.",
      solution: code`const balanced = (text) => {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of text) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
};

console.log(balanced("(a[b]{c})"));
console.log(balanced("(]"));
console.log(balanced("(("));`,
    },
    practiceSlug: "js-stacks-queues",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-hash-patterns",
    order: 42,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Remember What You Have Seen",
    catalogTitle: "Hash map patterns",
    blurb: "Count, group and pair things in one pass with Map and Set.",
    catalogCode: "if (seen.has(target - n))",
    language: "javascript",
    intro:
      "Maps, Sets and plain objects look things up in O(1) on average, so many problems become fast when you **remember what you have already seen**. Count with a Map. Group into an object of arrays. Find two numbers that add up to a target in one pass by storing each number as you go, instead of checking every pair.",
    example: code`const words = ["sun", "moon", "sun", "star", "moon", "sun"];

const counts = new Map();
for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
console.log([...counts]);

const byLength = {};
for (const w of words) (byLength[w.length] ||= []).push(w);
console.log(byLength);

const twoSum = (nums, target) => {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);
  }
  return null;
};
console.log(twoSum([8, 3, 11, 5], 16));`,
    reads: [
      { dot: DOT_PINK, text: "The Map counts every word in a single pass" },
      { dot: DOT_MINT, text: "`||=` creates the array the first time a length appears" },
      { dot: DOT_LAVENDER, text: "`twoSum` asks \"have I seen the number I need?\" instead of trying every pair" },
    ],
    tip: "Storing what you learn so you never recompute it is the most useful algorithm trick there is.",
    starter: code`const firstRepeat = (letters) => null;

console.log(firstRepeat("abcbd"));
console.log(firstRepeat("xyz"));`,
    task: {
      prompt: "Make `firstRepeat` return the first letter that appears a second time, reading left to right, or `null`. Use a Set. It should print `b` then `null`.",
      expectOutput: ["b", "null"],
      mustInclude: ["new Set"],
      hint: "Loop over the letters: if `seen.has(ch)` return it; otherwise `seen.add(ch)`.",
      solution: code`const firstRepeat = (letters) => {
  const seen = new Set();
  for (const ch of letters) {
    if (seen.has(ch)) return ch;
    seen.add(ch);
  }
  return null;
};

console.log(firstRepeat("abcbd"));
console.log(firstRepeat("xyz"));`,
    },
    practiceSlug: "js-hash-patterns",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-memoization",
    order: 43,
    chapter: "JS Algorithms",
    kicker: "JS ALGORITHMS",
    title: "Memoization",
    catalogTitle: "Memoization",
    blurb: "Cache results of repeated calls to make slow recursion fast.",
    catalogCode: "if (cache.has(n)) return cache.get(n);",
    language: "javascript",
    intro:
      "**Memoization** stores the result of each call so the same input never gets computed twice. Naive recursive Fibonacci recomputes the same values over and over and its work explodes exponentially; with a cache it becomes linear. A small higher-order `memoize` function can add caching to any function of one argument.",
    example: code`let calls = 0;
const slowFib = (n) => {
  calls++;
  return n < 2 ? n : slowFib(n - 1) + slowFib(n - 2);
};
console.log(slowFib(20), calls);

const memoize = (fn) => {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
};

const fastFib = memoize((n) => (n < 2 ? n : fastFib(n - 1) + fastFib(n - 2)));
console.log(fastFib(70));`,
    reads: [
      { dot: DOT_PINK, text: "`slowFib(20)` makes more than 20,000 calls" },
      { dot: DOT_MINT, text: "`memoize` wraps any function with a cache" },
      { dot: DOT_LAVENDER, text: "`fastFib` calls the memoized version, so every n is computed once" },
    ],
    tip: "Memoization only pays off when the same inputs come up again, like overlapping recursive calls.",
    starter: code`const ways = (n) => (n <= 1 ? 1 : ways(n - 1) + ways(n - 2));
console.log(ways(10));`,
    task: {
      prompt: "`ways(n)` counts the ways to climb n stairs 1 or 2 steps at a time. Add a `Map` cache so it never computes the same n twice, then print `ways(60)`: `2504730781961`.",
      expectOutput: ["2504730781961"],
      mustInclude: ["new Map"],
      hint: "Check the cache before recursing, and store the result before returning it.",
      solution: code`const cache = new Map();
const ways = (n) => {
  if (n <= 1) return 1;
  if (cache.has(n)) return cache.get(n);
  const result = ways(n - 1) + ways(n - 2);
  cache.set(n, result);
  return result;
};
console.log(ways(60));`,
    },
    practiceSlug: "js-memoization",
    module: "JS Algorithms",
    tier: "advanced",
  },
  {
    slug: "js-generators",
    order: 44,
    chapter: "JS Expert",
    kicker: "JS EXPERT",
    title: "Generators",
    catalogTitle: "Generators",
    blurb: "Pause and resume a function with function* and yield.",
    catalogCode: "function* ids() { yield 1; }",
    language: "javascript",
    intro:
      "A **generator** function, written `function*`, can pause itself with `yield` and pick up again later. Calling it does not run the body; it returns a **generator object**. Each `next()` runs until the next `yield` and returns `{ value, done }`. Generators produce values lazily, so they can even describe endless sequences, and they work directly with `for...of` and spread.",
    example: code`function* countdown(from) {
  while (from > 0) {
    yield from;
    from--;
  }
}

console.log([...countdown(3)]);

function* ids() {
  let id = 1;
  while (true) yield \`star-\${id++}\`;
}

const gen = ids();
console.log(gen.next().value, gen.next().value);`,
    reads: [
      { dot: DOT_PINK, text: "`yield` hands out one value and pauses the function right there" },
      { dot: DOT_MINT, text: "Spreading `[...countdown(3)]` pulls values until the generator finishes" },
      { dot: DOT_LAVENDER, text: "The endless `ids` generator is safe because values are only made on demand" },
    ],
    tip: "Never spread an endless generator. Take what you need with `next()` or a loop with a `break`.",
    starter: code`function* evens(limit) {
  // yield 0, 2, 4, ... below limit
}

console.log([...evens(7)]);`,
    task: {
      prompt: "Fill in `evens` so `[...evens(7)]` prints `[ 0, 2, 4, 6 ]`.",
      expectOutput: ["[ 0, 2, 4, 6 ]"],
      mustInclude: ["yield"],
      hint: "`for (let n = 0; n < limit; n += 2) yield n;`",
      solution: code`function* evens(limit) {
  for (let n = 0; n < limit; n += 2) yield n;
}

console.log([...evens(7)]);`,
    },
    practiceSlug: "js-generators",
    module: "JS Expert",
    tier: "expert",
  },
  {
    slug: "js-iterators-protocol",
    order: 45,
    chapter: "JS Expert",
    kicker: "JS EXPERT",
    title: "The Iterator Protocol",
    catalogTitle: "Iterables",
    blurb: "Make your own objects work with for...of, spread and destructuring.",
    catalogCode: "[Symbol.iterator]() { ... }",
    language: "javascript",
    intro:
      "`for...of`, spread and array destructuring all work through one agreement, the **iterator protocol**. An object is **iterable** when it has a `[Symbol.iterator]()` method that returns an **iterator**: an object whose `next()` returns `{ value, done }`. Arrays, strings, Maps and Sets all follow it, and any class can join in. A generator method, `*[Symbol.iterator]()`, is the shortest way to implement it.",
    example: code`class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next: () => (current <= end ? { value: current++, done: false } : { value: undefined, done: true }),
    };
  }
}

console.log([...new Range(1, 4)]);
for (const n of new Range(8, 9)) console.log(n);
const [first, second] = new Range(5, 10);
console.log(first, second);`,
    reads: [
      { dot: DOT_PINK, text: "`[Symbol.iterator]()` is what `for...of` looks for" },
      { dot: DOT_MINT, text: "`next()` returns `done: true` to say the sequence is over" },
      { dot: DOT_LAVENDER, text: "Destructuring only pulls as many values as it needs" },
    ],
    tip: "Implementing the protocol makes your data structures feel native: every tool that loops just works.",
    starter: code`class Countdown {
  constructor(from) {
    this.from = from;
  }
}

console.log(new Countdown(3).from);`,
    task: {
      prompt: "Make `Countdown` iterable with a `[Symbol.iterator]` method so `[...new Countdown(3)]` prints `[ 3, 2, 1 ]`.",
      expectOutput: ["[ 3, 2, 1 ]"],
      mustInclude: ["Symbol\\.iterator"],
      hint: "A generator method is simplest: `*[Symbol.iterator]() { for (let n = this.from; n > 0; n--) yield n; }`.",
      solution: code`class Countdown {
  constructor(from) {
    this.from = from;
  }
  *[Symbol.iterator]() {
    for (let n = this.from; n > 0; n--) yield n;
  }
}

console.log([...new Countdown(3)]);`,
    },
    practiceSlug: "js-iterators-protocol",
    module: "JS Expert",
    tier: "expert",
  },
];
