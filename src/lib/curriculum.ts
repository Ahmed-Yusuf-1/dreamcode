/**
 * The curriculum: the source of truth for lessons. Pages read from here, so the
 * platform is content-driven (add a lesson object and a new page exists, runs
 * real Python, and shows up in the catalog and the journey map).
 *
 * This is mock-free content the learner can actually study. Later phases move it
 * to authored files / a backend, but the shape stays the same.
 *
 * Text fields support a tiny **bold** syntax (rendered by LessonView).
 */

export interface ReadsBullet {
  /** accent dot colour */
  dot: string;
  text: string;
}

export interface Lesson {
  slug: string;
  order: number;
  /** e.g. "Python Basics - Chapter 1" */
  chapter: string;
  /** small label above the title, e.g. "PYTHON BASICS" */
  kicker: string;
  /** full lesson title, e.g. "The for loop" */
  title: string;
  /** short title for the catalog and the journey map, e.g. "Loops" */
  catalogTitle: string;
  /** one line for the catalog card */
  blurb: string;
  /** the tiny code line shown on the catalog card */
  catalogCode: string;
  /** teaching paragraph (supports **bold**) */
  intro: string;
  /** a worked example, shown read-only with syntax highlighting */
  example: string;
  /** "how it reads" bullets (text supports **bold**) */
  reads: ReadsBullet[];
  /** the cloud tip (supports **bold**) */
  tip: string;
  /** the starter code in the editable editor */
  starter: string;
  /** slug of a matching practice flow, if one exists */
  practiceSlug?: string;
  language?: "python" | "javascript";
}

const DOT_PINK = "#ffb6d9";
const DOT_MINT = "#a9ecc9";
const DOT_LAVENDER = "#cdb9f7";
const CHAPTER = "Python Basics - Chapter 1";

export const lessons: Lesson[] = [
  {
    slug: "variables",
    order: 1,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Boxes with names",
    catalogTitle: "Variables",
    blurb: "Name a piece of data and keep it in a box you can open later.",
    catalogCode: 'sky = "wide open"',
    intro:
      'A **variable** is a name you give to a value so you can use it again. Write the name, an equals sign, then the value. From then on the name stands in for the value.',
    example: `sky = "wide open"
stars = 100

print(sky)
print(stars)`,
    reads: [
      { dot: DOT_PINK, text: '**sky = "wide open"** stores the text on the right under the name sky' },
      { dot: DOT_MINT, text: "The name goes on the **left**, the value on the **right** of the =" },
      { dot: DOT_LAVENDER, text: "**print(sky)** shows whatever sky is holding right now" },
    ],
    tip: 'An **=** in Python means "put this value into this name". It is not the equals from math.',
    starter: `# give two things a name, then show them
mood = "dreamy"
hours = 8

print(mood)
print(hours)`,
    practiceSlug: "variables",
  },
  {
    slug: "strings",
    order: 2,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Words and text",
    catalogTitle: "Strings",
    blurb: "Text lives inside quotes. Join it, repeat it, measure it.",
    catalogCode: 'name = "Nova"',
    intro:
      "A **string** is text wrapped in quotes. You can glue strings together with **+**, repeat them with *****, and ask how long one is with **len()**.",
    example: `first = "night"
second = "sky"

print(first + " " + second)
print(first * 3)
print(len(first))`,
    reads: [
      { dot: DOT_PINK, text: '**+** joins strings end to end, so "night" + "sky" becomes "nightsky"' },
      { dot: DOT_MINT, text: '***** repeats a string, so "night" * 3 is "nightnightnight"' },
      { dot: DOT_LAVENDER, text: "**len(first)** counts the characters, here 5" },
    ],
    tip: "Quotes can be \"double\" or 'single', as long as both ends match.",
    starter: `# build a greeting from pieces
who = "dreamer"
greeting = "hello, " + who

print(greeting)
print(greeting.upper())`,
    practiceSlug: "strings",
  },
  {
    slug: "loops",
    order: 3,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "The for loop",
    catalogTitle: "Loops",
    blurb: "Do it again, once per cloud, without copying a single line.",
    catalogCode: "for cloud in sky:",
    intro:
      "Sometimes you want to do the same thing many times, say hello to every cloud in the sky. Instead of copying a line over and over, a **for loop** repeats it for you, once per item.",
    example: `for cloud in range(3):
    print("hop!")`,
    reads: [
      { dot: DOT_PINK, text: '**for cloud in range(3)** means "for each of 3 turns, call the current turn cloud"' },
      { dot: DOT_MINT, text: "The **indented line** is the part that repeats. Python knows it belongs to the loop because of the spaces" },
      { dot: DOT_LAVENDER, text: "**range(3)** counts 0, 1, 2, three numbers, starting at zero" },
    ],
    tip: "Loops start counting at 0, not 1. Nearly every programmer has tripped on this, now you won't.",
    starter: `# hop across every cloud in the sky
sky = ["cumulus", "cirrus", "stratus"]

for cloud in sky:
    print("hop →", cloud)`,
    practiceSlug: "loops",
  },
  {
    slug: "functions",
    order: 4,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Wrap it in a name",
    catalogTitle: "Functions",
    blurb: "Bundle a few steps under a name and reuse them anywhere.",
    catalogCode: "def dream():",
    intro:
      "A **function** is a named bundle of steps. Define it once with **def**, then **call** it by name whenever you need it. Functions can take **inputs** in the parentheses and hand back a result with **return**.",
    example: `def greet(name):
    return "hello, " + name

print(greet("Nova"))
print(greet("sky"))`,
    reads: [
      { dot: DOT_PINK, text: "**def greet(name):** defines a function called greet that takes one input, name" },
      { dot: DOT_MINT, text: "The **indented body** runs only when you call the function" },
      { dot: DOT_LAVENDER, text: "**return** hands a value back to whoever called it" },
    ],
    tip: "Define a function once, call it as many times as you like. That is how you stop repeating yourself.",
    starter: `# write a function that doubles a number
def double(n):
    return n * 2

print(double(4))
print(double(21))`,
  },
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
    practiceSlug: "js-variables",
  },
  {
    slug: "js-functions",
    order: 2,
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
    starter: `// write an arrow function that doubles a number
const double = (n) => {
  return n * 2;
};

console.log(double(4));
console.log(double(21));`,
    language: "javascript",
    practiceSlug: "js-functions",
  },
  {
    slug: "lists",
    order: 5,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Lists of things",
    catalogTitle: "Lists",
    blurb: "Keep many things in one place, in the order you put them.",
    catalogCode: 'clouds = ["wispy", "puffy"]',
    intro:
      "A **list** keeps multiple values together. Write square brackets with commas in between. Access individual items with square brackets and their **index** (position), starting at **0**.",
    example: `clouds = ["wispy", "puffy"]
print(len(clouds))
print(clouds[1])`,
    reads: [
      { dot: DOT_PINK, text: '`["wispy", "puffy"]` creates a list with two text items.' },
      { dot: DOT_MINT, text: '`clouds[1]` looks up the item at position 1 (the second item).' },
      { dot: DOT_LAVENDER, text: '`len(clouds)` counts the total items in the list, here 2.' },
    ],
    tip: "Indexes start at 0. So the first item is `clouds[0]`, and the second is `clouds[1]`.",
    starter: `# print the list, then print the first item
clouds = ["cirrus", "cumulus", "stratus"]
print(clouds)
print(clouds[0])`,
    practiceSlug: "lists",
  },
  {
    slug: "dictionaries",
    order: 6,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Labeling values",
    catalogTitle: "Dictionaries",
    blurb: "Label every value with a key so you can find it fast.",
    catalogCode: 'cloud = {"shape": "puffy"}',
    intro:
      "A **dictionary** stores values mapped to **keys** (labels). Define it with curly braces `{}` and key-value pairs separated by colons. Retrieve values using their keys.",
    example: `star = {"name": "Sirius", "mag": -1.46}
print(star["name"])
print(star["mag"])`,
    reads: [
      { dot: DOT_PINK, text: '`{"name": "Sirius"}` maps the key `"name"` to the value `"Sirius"`.' },
      { dot: DOT_MINT, text: '`star["name"]` retrieves the value stored under the key `"name"`.' },
    ],
    tip: "If you try to look up a key that doesn't exist, Python will raise a KeyError. Check spelling.",
    starter: `# complete the dictionary and lookup the color
sky_item = {"name": "cloud", "color": "neon"}
print(sky_item["name"])
print(sky_item["color"])`,
    practiceSlug: "dictionaries",
  },
  {
    slug: "js-loops",
    order: 3,
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
    starter: `// write a loop that counts from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
    language: "javascript",
    practiceSlug: "js-loops",
  },
  {
    slug: "js-arrays",
    order: 4,
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
    practiceSlug: "js-arrays",
  },
  {
    slug: "js-objects",
    order: 5,
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
    starter: `// complete the object and read its property
const cloud = { shape: "wispy", height: 3000 };
console.log(cloud.shape);
console.log(cloud.height);`,
    language: "javascript",
    practiceSlug: "js-objects",
  },
];

export const lessonCount = lessons.length;

export function getLesson(slug: string): Lesson | null {
  return lessons.find((l) => l.slug === slug) ?? null;
}

export function getAllLessonSlugs(): string[] {
  return lessons.map((l) => l.slug);
}

export interface LessonLink {
  slug: string;
  title: string;
}

export function getAdjacent(slug: string): { prev: LessonLink | null; next: LessonLink | null } {
  const currentLesson = getLesson(slug);
  if (!currentLesson) return { prev: null, next: null };

  const lang = currentLesson.language || "python";
  const filtered = lessons.filter((l) => (l.language || "python") === lang);

  const i = filtered.findIndex((l) => l.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const toLink = (l: Lesson): LessonLink => ({ slug: l.slug, title: l.catalogTitle });
  return {
    prev: i > 0 ? toLink(filtered[i - 1]) : null,
    next: i < filtered.length - 1 ? toLink(filtered[i + 1]) : null,
  };
}
