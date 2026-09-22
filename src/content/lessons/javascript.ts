import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";

export const javascriptLessons: Lesson[] = [
  {
    slug: "js-variables",
    order: 1,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Let and Const",
    catalogTitle: "Variables",
    blurb: "Store values in variables that can change (let) or stay solid (const).",
    catalogCode: "let sky = 'neon';",
    intro:
      "In JavaScript, you declare variables using **let** or **const**. Use **let** if the value will change, and **const** for constants that stay the same.",
    example: `let sky = "neon";
const stars = 100;
sky = "dusk";

console.log(sky);
console.log(stars);`,
    reads: [
      { dot: DOT_PINK, text: "**let sky** creates a re-assignable variable named sky" },
      { dot: DOT_MINT, text: "**const stars** creates a read-only constant variable stars" },
      { dot: DOT_LAVENDER, text: "**console.log()** is JavaScript's way of printing output" },
    ],
    tip: "Always default to **const** unless you know the variable needs to be re-assigned.",
    starter: `// practice declaring let and const variables
let mood = "dreamy";
const hours = 8;

console.log(mood);
console.log(hours);`,
    language: "javascript",
    task: {
      prompt: "Change `mood` to `\"curious\"` after it is declared, and add a `const place = \"the roof\";` that is logged last. The output should be `curious`, `8`, `the roof`.",
      expectOutput: ["curious", "8", "the roof"],
      mustInclude: ["mood\\s*=\\s*[\"']curious", "const\\s+place"],
      hint: "`let` variables can be reassigned: `mood = \"curious\";`.",
      solution: code`let mood = "dreamy";
const hours = 8;
mood = "curious";
const place = "the roof";

console.log(mood);
console.log(hours);
console.log(place);`,
    },
    practiceSlug: "js-variables",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-functions",
    order: 5,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Arrow Functions",
    catalogTitle: "Functions",
    blurb: "Compact blocks of logic using the modern fat arrow syntax.",
    catalogCode: "const glow = () => {};",
    intro:
      "JavaScript functions can be written using the compact **arrow function** syntax. They bundle reusable logic under a name.",
    example: `const greet = (name) => {
  return "hello, " + name;
};

console.log(greet("Nova"));`,
    reads: [
      { dot: DOT_PINK, text: "**const greet = (name) => { ... }** defines an arrow function" },
      { dot: DOT_MINT, text: "Inputs go in **parentheses**, followed by the fat arrow **=>**" },
      { dot: DOT_LAVENDER, text: "**return** passes the value back to the caller" },
    ],
    tip: "Arrow functions are the standard in modern JavaScript and React development.",
    starter: `// an arrow function that doubles a number
const double = (n) => {
  return n * 2;
};

console.log(double(4));
console.log(double(21));`,
    language: "javascript",
    task: {
      prompt: "Write an arrow function `square` that returns n times n, and log `square(9)`: `81`.",
      expectOutput: ["81"],
      mustInclude: ["const\\s+square\\s*=\\s*\\(?\\s*n\\s*\\)?\\s*=>"],
      hint: "`const square = (n) => n * n;`",
      solution: code`const square = (n) => n * n;
console.log(square(9));`,
    },
    practiceSlug: "js-functions",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-comparisons",
    order: 6,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Strict Equality",
    catalogTitle: "Comparisons",
    blurb: "Compare values using strict equality === and relational operators.",
    catalogCode: "skyState === 'clear'",
    intro:
      "JavaScript uses **===** (strict equality) and **!==** (strict inequality) to compare both the **value** and the **type**. Avoid **==**, which can coerce types and cause hidden bugs.",
    example: `const altitude = 1000;
const isHigh = altitude > 500;
console.log(isHigh);
console.log(altitude === "1000"); // false`,
    reads: [
      { dot: DOT_PINK, text: "**altitude > 500** compares numbers, returning true" },
      { dot: DOT_MINT, text: "**===** checks if value and type are identical, returning false here" },
    ],
    tip: "Always use strict equality ===. Using double equals == invites unexpected type conversion behavior.",
    starter: `// compare two variables
const stars = 50;
const hasMany = stars >= 100;
console.log(hasMany);`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    task: {
      prompt: "Log whether `stars` is exactly `\"50\"` (the text) using strict equality, then whether it equals the number 50. The output should end with `false` and `true`.",
      expectOutput: ["false", "true"],
      mustInclude: ["===\\s*[\"']50[\"']", "===\\s*50"],
      hint: "`stars === \"50\"` is false because the types differ.",
      solution: code`const stars = 50;
console.log(stars === "50");
console.log(stars === 50);`,
    },
    practiceSlug: "js-comparisons",
  },
  {
    slug: "js-if-else",
    order: 7,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "JavaScript If & Else",
    catalogTitle: "If & Else",
    blurb: "Branch your code using if statements and else blocks in JS.",
    catalogCode: "if (cloudy) { ... } else { ... }",
    intro:
      "An **if** statement evaluates a condition in parentheses. If True, it executes the block in curly braces. An optional **else** block runs if the condition is False.",
    example: `const isRainy = true;
if (isRainy) {
  console.log("Bring umbrella");
} else {
  console.log("Clear sky");
}`,
    reads: [
      { dot: DOT_PINK, text: "**if (isRainy)** checks if the condition inside parentheses is true" },
      { dot: DOT_MINT, text: "Curly braces {} group the statements to execute for each branch" },
    ],
    tip: "Unlike Python, JavaScript does not rely on indentation to find blocks; it uses curly braces. But keep your code indented for readability.",
    starter: `// an if-else statement
const temp = 15;
if (temp < 10) {
  console.log("Cold");
} else {
  console.log("Warm");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    task: {
      prompt: "Change only the value of `temp` so the program takes the first branch and logs `Cold`.",
      expectOutput: ["Cold"],
      mustInclude: ["if\\s*\\(\\s*temp"],
      hint: "The first block runs when `temp < 10`.",
      solution: code`const temp = 4;
if (temp < 10) {
  console.log("Cold");
} else {
  console.log("Warm");
}`,
    },
    practiceSlug: "js-if-else",
  },
  {
    slug: "js-else-if",
    order: 8,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Else If Chains",
    catalogTitle: "Else If",
    blurb: "Link multiple options using else if blocks to check several conditions.",
    catalogCode: "else if (hour < 18)",
    intro:
      "Check multiple conditions using **else if** blocks. JavaScript runs the first block where the condition evaluates to true and skips the rest.",
    example: `const hour = 14;
if (hour < 12) {
  console.log("Morning");
} else if (hour < 18) {
  console.log("Afternoon");
} else {
  console.log("Night");
}`,
    reads: [
      { dot: DOT_PINK, text: "**else if (hour < 18)** runs only if the preceding if statement was false" },
      { dot: DOT_MINT, text: "The final else runs if no conditions were met" },
    ],
    tip: "You can insert as many else if blocks as necessary between the initial if and the final else.",
    starter: `// classify cloud cover
const cloudPercent = 40;
if (cloudPercent === 0) {
  console.log("Sunny");
} else if (cloudPercent < 50) {
  console.log("Partly Cloudy");
} else {
  console.log("Overcast");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    task: {
      prompt: "Add another `else if` so 50 to 79 percent logs `Mostly Cloudy`, then set `cloudPercent` to 65 to see it.",
      expectOutput: ["Mostly Cloudy"],
      mustInclude: ["else\\s+if\\s*\\(\\s*cloudPercent\\s*<\\s*80"],
      hint: "Put `else if (cloudPercent < 80)` before the final else.",
      solution: code`const cloudPercent = 65;
if (cloudPercent === 0) {
  console.log("Sunny");
} else if (cloudPercent < 50) {
  console.log("Partly Cloudy");
} else if (cloudPercent < 80) {
  console.log("Mostly Cloudy");
} else {
  console.log("Overcast");
}`,
    },
    practiceSlug: "js-else-if",
  },
  {
    slug: "js-logical-operators",
    order: 9,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Boolean Operators",
    catalogTitle: "Logical ops",
    blurb: "Combine conditions with && (AND), || (OR), and ! (NOT).",
    catalogCode: "if (sun && !rain)",
    intro:
      "Use **&&** (AND) to require both sides to be true, **||** (OR) to succeed if either side is true, and **!** (NOT) to invert a boolean value.",
    example: `const hasKey = true;
const hasPass = false;
if (hasKey || hasPass) {
  console.log("Access granted");
}
console.log(!hasKey); // false`,
    reads: [
      { dot: DOT_PINK, text: "**hasKey || hasPass** evaluates to true because at least one is true" },
      { dot: DOT_MINT, text: "**!hasKey** flips true to false" },
    ],
    tip: "Logical operators short-circuit: if the result is determined by the first condition, the second condition is not evaluated.",
    starter: `// check stargazing conditions
const clearSky = true;
const lightPollution = false;
if (clearSky && !lightPollution) {
  console.log("Stargaze!");
} else {
  console.log("No view");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    task: {
      prompt: "Add `const raining = true;` and require `!raining` in the condition too, so the program logs `No view`.",
      expectOutput: ["No view"],
      mustInclude: ["!\\s*raining"],
      hint: "The condition becomes `clearSky && !lightPollution && !raining`.",
      solution: code`const clearSky = true;
const lightPollution = false;
const raining = true;
if (clearSky && !lightPollution && !raining) {
  console.log("Stargaze!");
} else {
  console.log("No view");
}`,
    },
    practiceSlug: "js-logical-operators",
  },
  {
    slug: "js-ternary",
    order: 10,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Ternary Operator",
    catalogTitle: "Ternary operator",
    blurb: "Use the shorthand conditional operator for quick inline choices.",
    catalogCode: "const status = rain ? 'wet' : 'dry';",
    intro:
      "The **ternary operator** is a shorthand for simple if-else blocks. It takes a condition followed by a question mark **?**, then the expression to run if true, a colon **:**, and the expression to run if false.",
    example: `const score = 80;
const status = score >= 50 ? "Pass" : "Fail";
console.log(status);`,
    reads: [
      { dot: DOT_PINK, text: "**score >= 50** is evaluated as the condition" },
      { dot: DOT_MINT, text: "**Pass** is returned if the condition is true, **Fail** if false" },
    ],
    tip: "Ternaries are expressions, meaning they resolve to a value that can be assigned directly to a variable.",
    starter: `// a ternary for the light mode
const sunIsUp = true;
const mode = sunIsUp ? "day" : "night";
console.log(mode);`,
    module: "JS Conditionals & Logic",
    tier: "intermediate",
    language: "javascript",
    task: {
      prompt: "Add a second ternary that sets `icon` to `\"sun\"` or `\"moon\"` from `sunIsUp`, set `sunIsUp` to false, and log both: `night` then `moon`.",
      expectOutput: ["night", "moon"],
      mustInclude: ["\\?\\s*[\"']sun[\"']\\s*:\\s*[\"']moon[\"']"],
      hint: "`const icon = sunIsUp ? \"sun\" : \"moon\";`",
      solution: code`const sunIsUp = false;
const mode = sunIsUp ? "day" : "night";
const icon = sunIsUp ? "sun" : "moon";
console.log(mode);
console.log(icon);`,
    },
    practiceSlug: "js-ternary",
  },
  {
    slug: "js-loops",
    order: 12,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Repeating code",
    catalogTitle: "Loops",
    blurb: "Repeat steps using standard for loops and for...of iteration.",
    catalogCode: "for (let i = 0; i < 3; i++)",
    intro:
      "In JavaScript, you can repeat code using a **for** loop. The loop initialization, condition, and increment go inside parentheses, separated by semicolons.",
    example: `for (let i = 0; i < 3; i++) {
  console.log("hop " + i);
}`,
    reads: [
      { dot: DOT_PINK, text: "`let i = 0` initializes a counter variable at 0." },
      { dot: DOT_MINT, text: "`i < 3` keeps looping as long as the counter is less than 3." },
      { dot: DOT_LAVENDER, text: "`i++` adds 1 to the counter at the end of each turn." },
    ],
    tip: "You can also loop over arrays using the modern `for (const item of array)` syntax.",
    starter: `// a loop that counts from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
    language: "javascript",
    task: {
      prompt: "Change the loop so it counts from 10 down to 0 in steps of 2: `10`, `8`, `6`, `4`, `2`, `0`.",
      expectOutput: ["10", "8", "6", "4", "2", "0"],
      exact: true,
      mustInclude: ["for\\s*\\("],
      hint: "Start at 10, keep going while `i >= 0`, and use `i -= 2`.",
      solution: code`for (let i = 10; i >= 0; i -= 2) {
  console.log(i);
}`,
    },
    practiceSlug: "js-loops",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-arrays",
    order: 15,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Array lists",
    catalogTitle: "Arrays",
    blurb: "Keep ordered collections of elements in JavaScript arrays.",
    catalogCode: "const clouds = ['wispy'];",
    intro:
      "JavaScript **arrays** are list-like objects used to store multiple values. They are zero-indexed and support built-in helper functions like `.push()` and `.length`.",
    example: `const clouds = ["cirrus", "stratus"];
console.log(clouds.length);
console.log(clouds[0]);`,
    reads: [
      { dot: DOT_PINK, text: '`["cirrus", "stratus"]` declares an array of two strings.' },
      { dot: DOT_MINT, text: '`clouds.length` gets the number of elements in the array.' },
    ],
    tip: "You can add elements to the end of an array using the `.push(value)` method.",
    starter: `// print the array and push a new cloud
const sky = ["puffy", "grey"];
sky.push("neon");
console.log(sky);
console.log(sky.length);`,
    language: "javascript",
    task: {
      prompt: "Log the last cloud using `sky.length - 1`, then remove it with `pop()` and log the array: `neon` then `[ 'puffy', 'grey' ]`.",
      expectOutput: ["neon", "[ 'puffy', 'grey' ]"],
      mustInclude: ["length\\s*-\\s*1", "\\.pop\\(\\)"],
      hint: "`sky[sky.length - 1]` is the last item.",
      solution: code`const sky = ["puffy", "grey"];
sky.push("neon");
console.log(sky[sky.length - 1]);
sky.pop();
console.log(sky);`,
    },
    practiceSlug: "js-arrays",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-objects",
    order: 16,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Labeled structures",
    catalogTitle: "Objects",
    blurb: "Store keyed collections of properties using JavaScript objects.",
    catalogCode: "const star = { mag: 1 };",
    intro:
      "JavaScript **objects** store key-value properties. You can declare them using curly braces `{}` and retrieve values using dot notation or bracket notation.",
    example: `const star = { name: "Polaris", mag: 1.97 };
console.log(star.name);
console.log(star["mag"]);`,
    reads: [
      { dot: DOT_PINK, text: '`star.name` uses dot notation to read the name property.' },
      { dot: DOT_MINT, text: '`star["mag"]` uses bracket notation to retrieve the magnitude.' },
    ],
    tip: "Objects are similar to Python dictionaries. Use keys (which must be valid strings) to store data.",
    starter: `// read two properties of the cloud object
const cloud = { shape: "wispy", height: 3000 };
console.log(cloud.shape);
console.log(cloud.height);`,
    language: "javascript",
    task: {
      prompt: "Add a `color` property with the value `\"violet\"` and log the whole object: `{ shape: 'wispy', height: 3000, color: 'violet' }`.",
      expectOutput: ["{ shape: 'wispy', height: 3000, color: 'violet' }"],
      mustInclude: ["cloud\\.color\\s*=|cloud\\[\\s*[\"']color[\"']\\s*\\]\\s*="],
      hint: "Assigning to a new property adds it: `cloud.color = \"violet\";`.",
      solution: code`const cloud = { shape: "wispy", height: 3000 };
cloud.color = "violet";
console.log(cloud);`,
    },
    practiceSlug: "js-objects",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-array-methods",
    order: 17,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Map and Filter",
    catalogTitle: "Array methods",
    blurb: "Transform and filter arrays using modern built-in iterators.",
    catalogCode: "arr.map(x => x * 2)",
    intro:
      "JavaScript arrays have built-in helper functions: **.map()** (creates a new array by transforming each element) and **.filter()** (creates a new array keeping only elements that match a check).",
    example: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
console.log(doubled);
console.log(evens);`,
    reads: [
      { dot: DOT_PINK, text: "**nums.map(n => n * 2)** loops over elements and returns their doubled values" },
      { dot: DOT_MINT, text: "**nums.filter(n => n % 2 === 0)** filters elements returning only those matching the condition" },
    ],
    tip: "These methods do not modify the original array; they return a brand new array, helping you keep your data safe.",
    starter: `// add 500 to every height
const heights = [1000, 2000, 3000];
const altered = heights.map(h => h + 500);
console.log(altered);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    task: {
      prompt: "Use `filter` to keep only heights of at least 2000, then `map` them to kilometres (divide by 1000). Log the result: `[ 2, 3 ]`.",
      expectOutput: ["[ 2, 3 ]"],
      mustInclude: ["\\.filter\\(", "\\.map\\("],
      hint: "`heights.filter((h) => h >= 2000).map((h) => h / 1000)`",
      solution: code`const heights = [1000, 2000, 3000];
const km = heights.filter((h) => h >= 2000).map((h) => h / 1000);
console.log(km);`,
    },
    practiceSlug: "js-array-methods",
  },
  {
    slug: "js-destructuring",
    order: 19,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Destructuring & Spread",
    catalogTitle: "Destructure & spread",
    blurb: "Unpack arrays and objects or copy them using the spread operator.",
    catalogCode: "const { name } = star;",
    intro:
      "**Destructuring** lets you unpack values from arrays or properties from objects directly into distinct variables. The **spread operator ...** lets you copy or combine collections easily.",
    example: `const star = { name: "Vega", mag: 0.03 };
const { name, mag } = star;
console.log(name, mag);

const list1 = [1, 2];
const list2 = [...list1, 3, 4];
console.log(list2);`,
    reads: [
      { dot: DOT_PINK, text: "**const { name, mag } = star** creates variables named name and mag from the keys of star" },
      { dot: DOT_MINT, text: "**[...list1, 3, 4]** spreads the elements of list1 into a new array" },
    ],
    tip: "Destructuring makes unpacking function arguments or component props extremely clean and concise.",
    starter: `// destructure properties from the cloud object
const cloud = { shape: "wispy", height: 5000 };
const { shape, height } = cloud;
console.log(shape);
console.log(height);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    task: {
      prompt: "Use the spread operator to make a copy of `cloud` with `height` changed to 6000, and log it: `{ shape: 'wispy', height: 6000 }`.",
      expectOutput: ["{ shape: 'wispy', height: 6000 }"],
      mustInclude: ["\\.\\.\\.cloud"],
      hint: "`const higher = { ...cloud, height: 6000 };` Later properties win.",
      solution: code`const cloud = { shape: "wispy", height: 5000 };
const higher = { ...cloud, height: 6000 };
console.log(higher);`,
    },
    practiceSlug: "js-destructuring",
  },
  {
    slug: "js-object-methods",
    order: 20,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Object Keys & Values",
    catalogTitle: "Object iteration",
    blurb: "Extract keys and values from objects to loop over their properties.",
    catalogCode: "Object.keys(star)",
    intro:
      "To loop over or inspect the properties of an object, use **Object.keys()** (returns an array of keys) or **Object.values()** (returns an array of values).",
    example: `const star = { name: "Sirius", mag: -1.46 };
const keys = Object.keys(star);
console.log(keys);
const values = Object.values(star);
console.log(values);`,
    reads: [
      { dot: DOT_PINK, text: "**Object.keys(star)** returns a list of string keys" },
      { dot: DOT_MINT, text: "**Object.values(star)** returns a list of property values" },
    ],
    tip: "These methods allow you to use array methods like .map() or .forEach() on object data.",
    starter: `// list the keys of the stats object
const stats = { speed: 40, temp: -10 };
const keys = Object.keys(stats);
console.log(keys);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    task: {
      prompt: "Use `Object.entries` to log each stat on its own line as `speed = 40` and `temp = -10`.",
      expectOutput: ["speed = 40", "temp = -10"],
      mustInclude: ["Object\\.entries"],
      hint: "`for (const [key, value] of Object.entries(stats))`",
      solution: code`const stats = { speed: 40, temp: -10 };
for (const [key, value] of Object.entries(stats)) {
  console.log(\`\${key} = \${value}\`);
}`,
    },
    practiceSlug: "js-object-methods",
  },
  {
    slug: "js-loop-iterators",
    order: 21,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "For Of and For In",
    catalogTitle: "Advanced loops",
    blurb: "Iterate over arrays with for...of and object keys with for...in.",
    catalogCode: "for (const item of array)",
    intro:
      "JavaScript provides loops tailored to specific data shapes: **for...of** (loops through array elements directly) and **for...in** (loops through the keys of an object).",
    example: `const stars = ["Vega", "Altair"];
for (const star of stars) {
  console.log(star);
}
const config = { speed: 10, mode: "fast" };
for (const key in config) {
  console.log(key, config[key]);
}`,
    reads: [
      { dot: DOT_PINK, text: "**for (const star of stars)** iterates over the elements themselves" },
      { dot: DOT_MINT, text: "**for (const key in config)** iterates over the object's keys" },
    ],
    tip: "Never use for...in to loop over arrays; it iterates over index strings, which can lead to unexpected type conversion errors.",
    starter: `// iterate over the array of clouds
const clouds = ["cirrus", "cumulus"];
for (const cloud of clouds) {
  console.log(cloud);
}`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    task: {
      prompt: "Add a `for...in` loop over `const sizes = { cirrus: 3, cumulus: 7 }` that logs lines like `cirrus 3` after the clouds.",
      expectOutput: ["cirrus", "cumulus", "cirrus 3", "cumulus 7"],
      mustInclude: ["for\\s*\\(\\s*const\\s+\\w+\\s+in\\s+sizes"],
      hint: "`for (const name in sizes) console.log(name, sizes[name]);`",
      solution: code`const clouds = ["cirrus", "cumulus"];
for (const cloud of clouds) {
  console.log(cloud);
}
const sizes = { cirrus: 3, cumulus: 7 };
for (const name in sizes) {
  console.log(name, sizes[name]);
}`,
    },
    practiceSlug: "js-loop-iterators",
  },
  {
    slug: "js-closures",
    order: 24,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Scope and closures",
    catalogTitle: "Closures",
    blurb: "Learn how nested functions remember variables from their outer scope.",
    catalogCode: "const outer = () => { ... }",
    intro:
      "A **closure** is created when an inner function remembers variables from its outer lexical environment, even after the outer function finishes executing.",
    example: `const counter = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  };
};
const next = counter();
console.log(next());
console.log(next());`,
    reads: [
      { dot: DOT_PINK, text: "**let count = 0** defines a private counter variable" },
      { dot: DOT_MINT, text: "**return () => { ... }** maintains lookup access to the count variable" },
    ],
    tip: "Closures allow you to create private state variables in JavaScript.",
    starter: `// practice closures with a greeting maker
const makeGreeting = (greeting) => {
  return (name) => greeting + ", " + name;
};
const hello = makeGreeting("Hello");
console.log(hello("Nova"));`,
    task: {
      prompt: "Write `makeCounter()` that returns a function adding 1 to a private count each call. Call it three times and log the last result: `3`.",
      expectOutput: ["3"],
      mustInclude: ["makeCounter"],
      hint: "Keep `let count = 0` inside makeCounter and return `() => ++count`.",
      solution: code`const makeCounter = () => {
  let count = 0;
  return () => ++count;
};
const next = makeCounter();
next();
next();
console.log(next());`,
    },
    practiceSlug: "js-closures",
    module: "JS Functions and Classes",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-callbacks",
    order: 25,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Callback functions",
    catalogTitle: "Callbacks",
    blurb: "Pass functions as arguments to execute them later.",
    catalogCode: "setTimeout(() => {}, 100)",
    intro:
      "A **callback** is a function passed into another function as an argument, which is then invoked inside the outer function to complete an action.",
    example: `const fetchCloud = (callback) => {
  const cloud = "cirrus";
  callback(cloud);
};
fetchCloud((name) => {
  console.log("Fetched: " + name);
});`,
    reads: [
      { dot: DOT_PINK, text: "**callback(cloud)** calls the passed-in callback function" },
      { dot: DOT_MINT, text: "**fetchCloud((name) => ...)** passes an anonymous arrow function as callback" },
    ],
    tip: "Callbacks are essential for handling asynchronous operations like timer events and network requests.",
    starter: `// multiply by two and pass to callback
const process = (x, cb) => cb(x * 2);
process(10, (res) => console.log(res));`,
    task: {
      prompt: "Call `process` again with a callback that logs the result with a label, so the output includes `result: 30` for `process(15, ...)`.",
      expectOutput: ["result: 30"],
      mustInclude: ["process\\(\\s*15"],
      hint: "`process(15, (res) => console.log(\"result:\", res));`",
      solution: code`const process = (x, cb) => cb(x * 2);
process(10, (res) => console.log(res));
process(15, (res) => console.log("result:", res));`,
    },
    practiceSlug: "js-callbacks",
    module: "JS Functions and Classes",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-async-await",
    order: 33,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Promises and Async/Await",
    catalogTitle: "Async & await",
    blurb: "Handle asynchronous tasks using Promises and modern await syntax.",
    catalogCode: "async function load() { await fetch(); }",
    intro:
      "**Promises** represent future values. The modern **async/await** syntax lets you write asynchronous code that reads like synchronous code.",
    example: `const loadSky = () => Promise.resolve("neon sky");

const main = async () => {
  const result = await loadSky();
  console.log(result);
};
main();`,
    reads: [
      { dot: DOT_PINK, text: "**async** keyword marks a function as asynchronous" },
      { dot: DOT_MINT, text: "**await** pauses execution until the promise resolves" },
    ],
    tip: "Always wrap your await calls in a try...catch block to handle network errors safely.",
    starter: `// load a delayed value
const delayedGlow = () => new Promise(res => res("glow"));
const run = async () => {
  const x = await delayedGlow();
  console.log(x);
};
run();`,
    task: {
      prompt: "Make `delayedGlow` wait 50 milliseconds with `setTimeout` before resolving, and log `ready` before awaiting it. The output should be `ready` then `glow`.",
      expectOutput: ["ready", "glow"],
      exact: true,
      mustInclude: ["setTimeout"],
      hint: "`new Promise((res) => setTimeout(() => res(\"glow\"), 50))`",
      solution: code`const delayedGlow = () => new Promise((res) => setTimeout(() => res("glow"), 50));
const run = async () => {
  console.log("ready");
  const x = await delayedGlow();
  console.log(x);
};
run();`,
    },
    practiceSlug: "js-async-await",
    module: "JS Async and Errors",
    tier: "advanced",
    language: "javascript",
  },
  {
    slug: "js-classes",
    order: 28,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "JS ES6 Classes",
    catalogTitle: "Classes & OOP",
    blurb: "Create blueprints for objects using standard class syntax.",
    catalogCode: "class Cloud { constructor() {} }",
    intro:
      "JavaScript **classes** are templates for creating objects. They encapsulate data with methods and support constructor methods.",
    example: `class Cloud {
  constructor(shape, alt) {
    this.shape = shape;
    this.alt = alt;
  }
  describe() {
    return this.shape + " at " + this.alt;
  }
}
const c = new Cloud("wispy", 5000);
console.log(c.describe());`,
    reads: [
      { dot: DOT_PINK, text: "**constructor(...)** initializes the new object properties" },
      { dot: DOT_MINT, text: "**this** refers to the specific instance of the class" },
    ],
    tip: "Class syntax is syntactical sugar over JavaScript's existing prototype-based inheritance model.",
    starter: `// a Star class with a name
class Star {
  constructor(name) {
    this.name = name;
  }
}
const s = new Star("Vega");
console.log(s.name);`,
    task: {
      prompt: "Give `Star` a method `describe()` that returns `\"Vega shines\"` (use `this.name`) and log `s.describe()`.",
      expectOutput: ["Vega shines"],
      mustInclude: ["describe\\s*\\(\\s*\\)\\s*\\{"],
      hint: "Add a `describe()` method inside the class that returns a template literal built from `this.name`.",
      solution: code`class Star {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return \`\${this.name} shines\`;
  }
}
const s = new Star("Vega");
console.log(s.describe());`,
    },
    practiceSlug: "js-classes",
    module: "JS Functions and Classes",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-error-handling",
    order: 31,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Catching errors with try-catch",
    catalogTitle: "Error handling",
    blurb: "Prevent program failure using try, catch, and throw.",
    catalogCode: "try { ... } catch (err) { ... }",
    intro:
      "Use **try...catch** to intercept errors. You can throw custom errors using the **throw** statement.",
    example: `try {
  throw new Error("Storm warning");
} catch (error) {
  console.log("Intercepted: " + error.message);
}`,
    reads: [
      { dot: DOT_PINK, text: "**throw new Error(...)** creates and fires an error object" },
      { dot: DOT_MINT, text: "**catch (error)** receives the thrown error" },
    ],
    tip: "You can also use a finally block to execute code regardless of whether an error was thrown.",
    starter: `// catch parsing errors
try {
  const result = JSON.parse("invalid_json");
} catch (e) {
  console.log("Parse failed");
}`,
    task: {
      prompt: "Write `checkAltitude(n)` that throws `new Error(\"too low\")` when n is below 100. Call it with 40 inside try...catch and log `error: too low`.",
      expectOutput: ["error: too low"],
      mustInclude: ["throw\\s+new\\s+Error"],
      hint: "In the catch block, log `\"error: \" + e.message`.",
      solution: code`const checkAltitude = (n) => {
  if (n < 100) throw new Error("too low");
  return n;
};
try {
  checkAltitude(40);
} catch (e) {
  console.log("error: " + e.message);
}`,
    },
    practiceSlug: "js-error-handling",
    module: "JS Async and Errors",
    tier: "advanced",
    language: "javascript",
  },
  {
    slug: "js-array-reduce",
    order: 27,
    chapter: "JavaScript Climbs - Chapter 3",
    kicker: "JAVASCRIPT CLIMBS",
    title: "The Reduce Method",
    catalogTitle: "Array reduce",
    blurb: "Accumulate an array of values into a single result value.",
    catalogCode: "arr.reduce((acc, curr) => acc + curr, 0)",
    intro:
      "The **.reduce()** method executes a reducer function on each element, resulting in a single output value.",
    example: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);
console.log(sum);`,
    reads: [
      { dot: DOT_PINK, text: "**accumulator** accumulates the callbacks' return values" },
      { dot: DOT_MINT, text: "**0** is the initial value of the accumulator parameter" },
    ],
    tip: "The initial value is optional but highly recommended to avoid errors on empty arrays.",
    starter: `// sum the values in the prices array
const prices = [10, 20, 30];
const total = prices.reduce((acc, p) => acc + p, 0);
console.log(total);`,
    task: {
      prompt: "Use `reduce` to find the most expensive price and log it: `30`.",
      expectOutput: ["30"],
      mustInclude: ["\\.reduce\\("],
      hint: "`prices.reduce((max, p) => (p > max ? p : max), prices[0])`",
      solution: code`const prices = [10, 20, 30];
const max = prices.reduce((best, p) => (p > best ? p : best), prices[0]);
console.log(max);`,
    },
    practiceSlug: "js-array-reduce",
    module: "JS Functions and Classes",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-metaprogramming",
    order: 46,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Object observation with Proxies",
    catalogTitle: "Metaprogramming",
    blurb: "Intercept and customize operations on JavaScript objects.",
    catalogCode: "new Proxy(target, handler)",
    intro:
      "A **Proxy** wraps an object to intercept core operations like reads, writes, and key lookups. Combined with **Reflect**, it powers modern reactive frameworks.",
    example: `const target = { sky: "clear" };
const proxy = new Proxy(target, {
  get(obj, prop) {
    return prop in obj ? obj[prop] : "unknown";
  }
});
console.log(proxy.sky);
console.log(proxy.clouds);`,
    reads: [
      { dot: DOT_PINK, text: "**new Proxy(target, handler)** creates an interceptor shell" },
      { dot: DOT_MINT, text: "**get(obj, prop)** intercepts property lookups on the target object" },
    ],
    tip: "Always return Reflect.get(...) inside proxies when forwarding original behavior to target objects.",
    starter: `// log property writes using handler traps
const stats = { stars: 10 };
const obs = new Proxy(stats, {
  set(obj, prop, val) {
    console.log("Setting " + prop + " to " + val);
    obj[prop] = val;
    return true;
  }
});
obs.stars = 20;`,
    task: {
      prompt: "Make the `set` trap refuse negative values: log `rejected -5` and return true without storing it. Try `obs.stars = -5`, then log `stats.stars` (`20`).",
      expectOutput: ["Setting stars to 20", "rejected -5", "20"],
      mustInclude: ["<\\s*0"],
      hint: "At the top of the trap: `if (val < 0) { console.log(\"rejected \" + val); return true; }`",
      solution: code`const stats = { stars: 10 };
const obs = new Proxy(stats, {
  set(obj, prop, val) {
    if (val < 0) {
      console.log("rejected " + val);
      return true;
    }
    console.log("Setting " + prop + " to " + val);
    obj[prop] = val;
    return true;
  }
});
obs.stars = 20;
obs.stars = -5;
console.log(stats.stars);`,
    },
    practiceSlug: "js-metaprogramming",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
  {
    slug: "js-concurrency",
    order: 47,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Microtasks and the Event Loop",
    catalogTitle: "Concurrency",
    blurb: "Understand microtask execution and non-blocking loops.",
    catalogCode: "queueMicrotask(() => {})",
    intro:
      "JavaScript is single-threaded but runs concurrently via the **Event Loop**. Promises queue jobs in the **Microtask Queue**, executing before rendering or the callback macrotask queue.",
    example: `console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");`,
    reads: [
      { dot: DOT_PINK, text: "Microtasks (Promise then, queueMicrotask) run immediately after current script" },
      { dot: DOT_MINT, text: "Macrotasks (setTimeout, event callbacks) run in subsequent tick loops" },
    ],
    tip: "Never block the event loop with long CPU-bound synchronous loops, or UI rendering will freeze.",
    starter: `// trace asynchronous microtask queue order
console.log(1);
queueMicrotask(() => console.log(3));
setTimeout(() => console.log(4), 0);
console.log(2);`,
    task: {
      prompt: "Add a `Promise.resolve().then(...)` right after the queueMicrotask line that logs `2.5`. Predict where it lands, then check: the output should be exactly `1`, `2`, `3`, `2.5`, `4`.",
      expectOutput: ["1", "2", "3", "2.5", "4"],
      exact: true,
      mustInclude: ["Promise\\.resolve\\(\\)\\.then"],
      hint: "Microtasks run in the order they were queued, and all of them run before the setTimeout.",
      solution: code`console.log(1);
queueMicrotask(() => console.log(3));
Promise.resolve().then(() => console.log(2.5));
setTimeout(() => console.log(4), 0);
console.log(2);`,
    },
    practiceSlug: "js-concurrency",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
  {
    slug: "js-internals",
    order: 48,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Prototypes and V8 Engine optimization",
    catalogTitle: "JS Internals",
    blurb: "Deep dive prototype chains, closures, and memory.",
    catalogCode: "Object.getPrototypeOf(obj)",
    intro:
      "V8 compiles JS to machine code via JIT compilation. Objects inherit features through **prototypes**, and closures store references in heap-allocated scopes, risking leaks if not cleaned up.",
    example: `const proto = { sky: "night" };
const obj = Object.create(proto);
console.log(Object.getPrototypeOf(obj) === proto);
console.log(obj.sky);`,
    reads: [
      { dot: DOT_PINK, text: "**Object.create(proto)** links a new object directly to prototype object" },
      { dot: DOT_MINT, text: "Scope references are garbage collected only when closures are released" },
    ],
    tip: "Avoid changing prototypes at runtime since it destroys the engine's hidden class optimizations (inline caches).",
    starter: `const base = { active: true };
const item = Object.create(base);
console.log(item.hasOwnProperty("active"));
console.log(item.active);`,
    task: {
      prompt: "Give `item` its own `active` property set to false, then log `item.hasOwnProperty(\"active\")` (`true`), `item.active` (`false`) and `base.active` (`true`).",
      expectOutput: ["true", "false", "true"],
      mustInclude: ["item\\.active\\s*=\\s*false"],
      hint: "Assigning on the child creates its own property that shadows the prototype's.",
      solution: code`const base = { active: true };
const item = Object.create(base);
item.active = false;
console.log(item.hasOwnProperty("active"));
console.log(item.active);
console.log(base.active);`,
    },
    practiceSlug: "js-internals",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
];
