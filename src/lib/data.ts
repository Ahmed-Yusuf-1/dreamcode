// Mock data for the dreamcode frontend. Everything here will eventually be
// served by the backend (Postgres + curriculum files); for now it powers the UI.

export type NodeState = "done" | "current" | "locked";

export interface JourneyNode {
  id: string;
  index: number;
  title: string;
  state: NodeState;
  xp: number;
  sub: string;
  href: string;
}

export const journeyNodes: JourneyNode[] = [
  { id: "variables", index: 1, title: "Variables", state: "done", xp: 60, sub: "Complete · +60 XP", href: "/lesson/loops" },
  { id: "strings", index: 2, title: "Strings", state: "done", xp: 60, sub: "Complete · +60 XP", href: "/lesson/loops" },
  { id: "loops", index: 3, title: "Loops", state: "current", xp: 60, sub: "Lesson 3 of 5 · Continue →", href: "/lesson/loops" },
  { id: "functions", index: 4, title: "Functions", state: "locked", xp: 60, sub: "Finish Loops to unlock", href: "" },
];

export interface Badge {
  id: string;
  name: string;
  desc: string;
  img: string;
  found: boolean;
}

const neon = (n: number) => `/assets/clouds-neon/cutout-cloud-neon-1-0${n}.webp`;

export const badges: Badge[] = [
  { id: "first-loop", name: "First Loop", desc: "Run your first for loop", img: neon(1), found: true },
  { id: "bug-catcher", name: "Bug Catcher", desc: "Fix a broken program", img: neon(2), found: true },
  { id: "cloud-hopper", name: "Cloud Hopper", desc: "Pass every test on a peak", img: neon(4), found: true },
  { id: "streak-keeper", name: "Streak Keeper", desc: "Code 7 days in a row", img: neon(5), found: true },
  { id: "sky-builder", name: "Sky Builder", desc: "Finish a chapter project", img: neon(3), found: true },
  { id: "night-owl", name: "Night Owl", desc: "Finish a lesson after midnight", img: neon(1), found: false },
  { id: "list-wrangler", name: "List Wrangler", desc: "Master lists & indexes", img: neon(2), found: false },
  { id: "dict-diver", name: "Dict Diver", desc: "Look up 50 keys", img: neon(4), found: false },
  { id: "function-forger", name: "Function Forger", desc: "Write 10 functions", img: neon(5), found: false },
  { id: "test-tamer", name: "Test Tamer", desc: "Write your first failing test", img: neon(3), found: false },
];

export interface LessonStop {
  stop: string;
  title: string;
  desc: string;
  code: string;
  language: "python" | "javascript";
}

export const lessonStops: LessonStop[] = [
  { stop: "STOP 01", title: "Variables", desc: "Name a piece of data and keep it in a box you can open later.", code: 'sky = "wide open"', language: "python" },
  { stop: "STOP 02", title: "Loops", desc: "Do it again, once per cloud - without copying a single line.", code: "for cloud in sky:", language: "python" },
  { stop: "STOP 03", title: "Functions", desc: "Wrap your best tricks in a name and reuse them anywhere.", code: "def dream():", language: "python" },
  { stop: "STOP 04", title: "Lists", desc: "Keep many things in one place, in the order you put them.", code: 'clouds = ["wispy", "puffy"]', language: "python" },
  { stop: "STOP 05", title: "Dictionaries", desc: "Label every value with a name so you can find it fast.", code: 'cloud = {"shape": "puffy"}', language: "python" },
  { stop: "STOP 06", title: "Problem solving", desc: "Break a big wish into tiny steps a computer can follow.", code: "# plan first, then code", language: "python" },
];

export interface Peak {
  id: string;
  name: string;
  blurb: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "Python" | "JavaScript" | "TypeScript";
  xp: number;
  badge?: string;
  state: NodeState;
}

export const peaks: Peak[] = [
  { id: "cloud-hopper", name: "Cloud Hopper", blurb: "Count the clouds tall enough to land on.", level: "Beginner", language: "JavaScript", xp: 40, badge: "Cloud Hopper badge", state: "current" },
  { id: "rain-counter", name: "Rain Counter", blurb: "Total the raindrops in a nested list.", level: "Beginner", language: "Python", xp: 40, state: "done" },
  { id: "star-sorter", name: "Star Sorter", blurb: "Sort the night sky by brightness.", level: "Beginner", language: "Python", xp: 50, state: "done" },
  { id: "fog-filter", name: "Fog Filter", blurb: "Keep only the clouds you can see through.", level: "Intermediate", language: "JavaScript", xp: 60, state: "locked" },
  { id: "wind-weaver", name: "Wind Weaver", blurb: "Merge two breezes into one sorted gust.", level: "Intermediate", language: "Python", xp: 70, state: "locked" },
  { id: "storm-chaser", name: "Storm Chaser", blurb: "Find the longest calm stretch between storms.", level: "Advanced", language: "JavaScript", xp: 90, state: "locked" },
  { id: "js-sky-classifier", name: "JS Sky Classifier", blurb: "Classify sky safety based on visibility and weather.", level: "Beginner", language: "JavaScript", xp: 40, state: "locked" },
  { id: "js-array-transformer", name: "JS Array Transformer", blurb: "Transform and filter an array of cloud objects.", level: "Intermediate", language: "JavaScript", xp: 50, state: "locked" },
  { id: "py-comprehension-sorter", name: "Comprehension Sorter", blurb: "Filter and format star entries using dictionary comprehensions.", level: "Intermediate", language: "Python", xp: 50, state: "locked" },
  { id: "js-reducer", name: "Reducer Sum", blurb: "Reduce an array of objects to accumulate a single value.", level: "Intermediate", language: "JavaScript", xp: 50, state: "locked" },
  { id: "py-basics-density", name: "Sky Density Calculator", blurb: "Calculate the density of a cloud sector.", level: "Beginner", language: "Python", xp: 40, state: "locked" },
  { id: "py-conditionals-altitude", name: "Altitude Classifier", blurb: "Classify cloud layer based on altitude.", level: "Beginner", language: "Python", xp: 40, state: "locked" },
  { id: "py-functions-average", name: "Average Magnitude", blurb: "Calculate average star magnitude.", level: "Beginner", language: "Python", xp: 40, state: "locked" },
  { id: "py-intermediate-oop", name: "Cloud Tracker Class", blurb: "Define a class to track cloud height and growth.", level: "Intermediate", language: "Python", xp: 50, state: "locked" },
  { id: "py-advanced-decorator", name: "Observation Logger", blurb: "Write a decorator that formats string return values.", level: "Advanced", language: "Python", xp: 60, state: "locked" },
  { id: "py-expert-descriptor", name: "Validation Descriptor", blurb: "Write a Python descriptor that enforces integer constraints.", level: "Advanced", language: "Python", xp: 70, state: "locked" },
  { id: "js-basics-formatter", name: "Velocity Formatter", blurb: "Use arrow functions and template literals to format speed.", level: "Beginner", language: "JavaScript", xp: 40, state: "locked" },
  { id: "js-dom-manipulator", name: "DOM Node Transformer", blurb: "Transform elements using DOM properties and classList.", level: "Intermediate", language: "JavaScript", xp: 50, state: "locked" },
  { id: "js-expert-proxy", name: "Secure Object Proxy", blurb: "Write a Proxy handler that protects object properties.", level: "Advanced", language: "JavaScript", xp: 70, state: "locked" },
  { id: "dict-diver", name: "Dict Diver", blurb: "Find the brightest star in a dictionary.", level: "Beginner", language: "Python", xp: 40, state: "locked" },
  { id: "js-loops-challenge", name: "Sum Up To", blurb: "Repeat arithmetic updates in a loop.", level: "Beginner", language: "JavaScript", xp: 40, state: "locked" },
  { id: "ts-basics-challenge", name: "TS Basics Challenge", blurb: "Validate star properties using interfaces.", level: "Beginner", language: "TypeScript", xp: 40, state: "locked" },
  { id: "ts-unions-enums-challenge", name: "TS Unions & Enums Challenge", blurb: "Narrow a union of flight speed values.", level: "Intermediate", language: "TypeScript", xp: 50, state: "locked" },
  { id: "ts-advanced-challenge", name: "TS Advanced Challenge", blurb: "Implement a generic Box container.", level: "Advanced", language: "TypeScript", xp: 60, state: "locked" },
  { id: "ts-expert-challenge", name: "TS Expert Challenge", blurb: "Write a mapped type query parser.", level: "Advanced", language: "TypeScript", xp: 70, state: "locked" },
];

export interface ReviewCard {
  id: string;
  concept: string;
  prompt: string;
  answer: string;
  code?: string;
  language?: "python" | "javascript" | "csharp" | "typescript";
  due: string;
}

export const reviewCards: ReviewCard[] = [
  { id: "r1", concept: "Loops", prompt: "How many times does this loop run?", code: "for cloud in range(3):\n    print(\"hop!\")", language: "python", answer: "3 times - range(3) counts 0, 1, 2.", due: "due now" },
  { id: "r2", concept: "Variables", prompt: "What does sky hold after both lines run?", code: 'sky = "grey"\nsky = "gold"', language: "python", answer: '"gold" - a variable keeps only the latest thing you put in it.', due: "due now" },
  { id: "r3", concept: "Strings", prompt: 'What does "sun" + "set" make?', answer: '"sunset" - the + sign glues strings together.', due: "due now" },
  { id: "r4", concept: "Loops", prompt: "What is the first number range(5) gives you?", answer: "0 - ranges start counting at zero, not one.", due: "due today" },
  { id: "rc1", concept: "Syntax", prompt: "How do you print a line of text to the console in C#?", answer: "Use Console.WriteLine(\"...\");", due: "due now", language: "csharp" },
  { id: "rc2", concept: "Variables", prompt: "Is C# statically typed or dynamically typed?", answer: "Statically typed - every variable has a declared or inferred type at compile time.", due: "due now", language: "csharp" },
  { id: "rts1", concept: "Types", prompt: "How do you annotate a variable as a string in TypeScript?", code: "let star: string = 'Vega';", language: "typescript", answer: "Use : string, e.g. let star: string = 'Vega';", due: "due now" },
  { id: "rts2", concept: "Unions", prompt: "What operator is used to create a union type in TypeScript?", answer: "The pipe operator (|), e.g. string | number.", due: "due now", language: "typescript" },
];

export interface Project {
  id: string;
  tier: "Guided" | "Independent" | "Capstone";
  title: string;
  desc: string;
  xp: number;
  state: NodeState;
  language: "Python" | "JavaScript";
  instructions?: string;
  starter?: string;
  functionName?: string;
  testCases?: ChallengeTestCase[];
}

export const projects: Project[] = [
  {
    id: "sky-house",
    tier: "Guided",
    title: "Sky House",
    desc: "Build a tiny program of your own - a greeter that remembers names.",
    xp: 200,
    state: "current",
    language: "Python",
    instructions: "Write a function `build_greeter(names)` that takes a list of name strings and returns a list of greeting strings. Each greeting should be 'Hello, [name]! Welcome to the Sky House.' (Note: casing and punctuation must match exactly).",
    starter: `def build_greeter(names):
    greetings = []
    # Write your code here
    return greetings`,
    functionName: "build_greeter",
    testCases: [
      { label: "['Nova', 'Luka'] -> greetings", args: [["Nova", "Luka"]], expected: ["Hello, Nova! Welcome to the Sky House.", "Hello, Luka! Welcome to the Sky House."] },
      { label: "[] -> []", args: [[]], expected: [] },
      { label: "['Dreamer'] -> greetings", args: [["Dreamer"]], expected: ["Hello, Dreamer! Welcome to the Sky House."] }
    ]
  },
  {
    id: "cloud-diary",
    tier: "Guided",
    title: "Cloud Diary",
    desc: "A journal that saves a line a day and reads it back.",
    xp: 220,
    state: "locked",
    language: "Python",
    instructions: "Write a function `filter_diary(entries, query)` that takes a list of diary entry strings and a query string. Return a new list of entries that contain the query string (case-insensitive).",
    starter: `def filter_diary(entries, query):
    matching = []
    # Write your code here
    return matching`,
    functionName: "filter_diary",
    testCases: [
      { label: "['Saw a cyan cloud', 'Had a starry dream', 'Puffy cloud today'], query='cloud'", args: [["Saw a cyan cloud", "Had a starry dream", "Puffy cloud today"], "cloud"], expected: ["Saw a cyan cloud", "Puffy cloud today"] },
      { label: "['Clear skies', 'Sunset was magenta'], query='rain'", args: [["Clear skies", "Sunset was magenta"], "rain"], expected: [] }
    ]
  },
  {
    id: "star-map",
    tier: "Independent",
    title: "Star Map",
    desc: "Plot constellations from a list of points - your plan, your code.",
    xp: 320,
    state: "locked",
    language: "JavaScript",
    instructions: "Write an arrow function `getMapBounds(points)` that takes an array of points, where each point is an object `{ x: number, y: number }`. Return an object `{ minX, maxX, minY, maxY }` representing the bounding box. If the array is empty, return `{ minX: 0, maxX: 0, minY: 0, maxY: 0 }`.",
    starter: `const getMapBounds = (points) => {
  // Write your code here
  return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
};`,
    functionName: "getMapBounds",
    testCases: [
      { label: "points with coords -> box", args: [[{ x: 2, y: 5 }, { x: 8, y: 1 }, { x: -3, y: 4 }]], expected: { minX: -3, maxX: 8, minY: 1, maxY: 5 } },
      { label: "[] -> zero box", args: [[]], expected: { minX: 0, maxX: 0, minY: 0, maxY: 0 } }
    ]
  },
  {
    id: "weather-window",
    tier: "Independent",
    title: "Weather Window",
    desc: "Pull a forecast and paint it in the console.",
    xp: 340,
    state: "locked",
    language: "Python",
    instructions: "Write a function `analyze_weather(forecasts)` that takes a list of dictionary forecasts (each containing 'temp' and 'condition' keys). Return a dictionary with the average temperature ('avg_temp') and a list of unique conditions ('conditions'). If the input list is empty, return {'avg_temp': 0, 'conditions': []}.",
    starter: `def analyze_weather(forecasts):
    # Write your code here
    return {"avg_temp": 0, "conditions": []}`,
    functionName: "analyze_weather",
    testCases: [
      { label: "forecasts list -> analysis", args: [[{ "temp": 20, "condition": "rainy" }, { "temp": 24, "condition": "cloudy" }, { "temp": 22, "condition": "rainy" }]], expected: { "avg_temp": 22.0, "conditions": ["rainy", "cloudy"] } },
      { label: "[] -> empty", args: [[]], expected: { "avg_temp": 0, "conditions": [] } }
    ]
  },
  {
    id: "dream-api",
    tier: "Capstone",
    title: "Dream API",
    desc: "A small web service that serves dreams on request. The first real one.",
    xp: 600,
    state: "locked",
    language: "Python",
    instructions: "Write a function `parse_dream_query(query, dream_db)` that takes a query string and a dictionary database of dreams (mapping topic strings to list of dream descriptions). Search the topics. If a topic matches the query (case-insensitive), return the list of dreams. If no topic matches, return the message 'No dreams found for topic: [query]'.",
    starter: `def parse_dream_query(query, dream_db):
    # Write your code here
    return []`,
    functionName: "parse_dream_query",
    testCases: [
      { label: "topic matches -> list", args: ["flight", { "flight": ["Soaring over neon clouds", "Falling gently"], "sea": ["Deep blue water"] }], expected: ["Soaring over neon clouds", "Falling gently"] },
      { label: "no match -> message", args: ["forest", { "flight": ["Soaring"] }], expected: "No dreams found for topic: forest" }
    ]
  }
];

export const user = {
  name: "Dreamer",
  initial: "D",
  level: 4,
  xp: 540,
  xpNext: 800,
  streak: 7,
  badgesFound: 5,
  badgesTotal: 48,
  dueReviews: 4,
  weekActivity: [20, 45, 15, 60, 30, 75, 40], // XP earned Mon..Sun
};

export interface ParsonsFragment {
  id: string;
  text: string;
  indent: number;
}

export interface PracticeDataset {
  prompt: string;
  parsonsFragments: ParsonsFragment[];
  fadedPrompt: string;
  fadedLines: { text: string; blanks: string[] }[];
  fadedExplain: string;
  predictCode: string;
  predictQuestion: string;
  predictOptions: { id: string; label: string; correct: boolean; why: string }[];
}

export const practiceDatasets: Record<string, PracticeDataset> = {
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
  loops: {
    prompt: "Arrange the lines so the program greets every cloud in the sky.",
    parsonsFragments: [
      { id: "p1", text: 'sky = ["cumulus", "cirrus", "stratus"]', indent: 0 },
      { id: "p2", text: "for cloud in sky:", indent: 0 },
      { id: "p3", text: 'print("hello,", cloud)', indent: 1 },
    ],
    fadedPrompt: "Fill the blanks so the loop hops exactly 4 times.",
    fadedLines: [
      { text: "___ hop in range(___):", blanks: ["for", "4"] },
      { text: '    print("hop", hop)', blanks: [] },
    ],
    fadedExplain: "for starts the loop and range(4) counts 0, 1, 2, 3 - four hops.",
    predictCode: 'sky = ["wispy", "puffy"]\nfor cloud in sky:\n    print(cloud)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "wispy then puffy, each on its own line", correct: true, why: "The loop visits each item in order and prints it." },
      { id: "b", label: "sky printed twice", correct: false, why: "cloud takes the *items* of sky, not the word sky." },
      { id: "c", label: "wispy puffy on one line", correct: false, why: "Each print() call starts a new line." },
    ],
  },
  variables: {
    prompt: "Arrange the lines to swap the values of x and y (using a temporary variable temp).",
    parsonsFragments: [
      { id: "v1", text: "temp = x", indent: 0 },
      { id: "v2", text: "x = y", indent: 0 },
      { id: "v3", text: "y = temp", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to assign the text 'dreamy' to the variable mood.",
    fadedLines: [
      { text: "mood ___ 'dreamy'", blanks: ["="] },
      { text: "print(mood)", blanks: [] },
    ],
    fadedExplain: "In Python, the = operator assigns the value on the right to the variable on the left.",
    predictCode: 'x = 10\ny = 20\nx = y\nprint(x)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "10", correct: false, why: "x was re-assigned to the value of y." },
      { id: "b", label: "20", correct: true, why: "x now holds 20 because of the assignment x = y." },
      { id: "c", label: "30", correct: false, why: "Assignment replaces the value, it does not add them." },
    ],
  },
  strings: {
    prompt: "Arrange the lines to print 'starry night' by combining two variables.",
    parsonsFragments: [
      { id: "s1", text: "a = 'starry'", indent: 0 },
      { id: "s2", text: "b = 'night'", indent: 0 },
      { id: "s3", text: "print(a + ' ' + b)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to print the length of the word 'dreamcode'.",
    fadedLines: [
      { text: "print(___('dreamcode'))", blanks: ["len"] },
    ],
    fadedExplain: "The len() function calculates the number of characters in a string.",
    predictCode: "print('cloud' * 3)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "cloudcloudcloud", correct: true, why: "The * operator repeats the string 3 times." },
      { id: "b", label: "cloud 3", correct: false, why: "* repeats, it does not print the number." },
      { id: "c", label: "Error", correct: false, why: "Multiplying a string by an integer is valid in Python." },
    ]
  },
  "js-variables": {
    prompt: "Arrange the lines to assign 'dusk' to a variable and print it.",
    parsonsFragments: [
      { id: "jv1", text: "const theme = 'dusk';", indent: 0 },
      { id: "jv2", text: "console.log(theme);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a constant variable for speed and a let variable for altitude.",
    fadedLines: [
      { text: "___ speed = 300;", blanks: ["const"] },
      { text: "___ altitude = 5000;", blanks: ["let"] },
      { text: "altitude = 6000;", blanks: [] },
    ],
    fadedExplain: "Use const for values that won't change, and let for variables that can be reassigned.",
    predictCode: "let color = 'cyan';\nconst border = 'solid';\ncolor = 'magenta';\nconsole.log(color);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "cyan", correct: false, why: "The variable color was reassigned to 'magenta'." },
      { id: "b", label: "magenta", correct: true, why: "Since color is declared with let, it can be reassigned." },
      { id: "c", label: "Error", correct: false, why: "Reassigning a let variable is perfectly valid." },
    ]
  },
  "js-functions": {
    prompt: "Arrange the lines to define a simple arrow function that returns the square of a number, then log the result.",
    parsonsFragments: [
      { id: "jf1", text: "const square = (x) => {", indent: 0 },
      { id: "jf2", text: "  return x * x;", indent: 1 },
      { id: "jf3", text: "};", indent: 0 },
      { id: "jf4", text: "console.log(square(5));", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to write a valid arrow function named 'greet' that takes a name and returns a greeting.",
    fadedLines: [
      { text: "const greet = (name) ___ {", blanks: ["=>"] },
      { text: "  ___ 'Hello, ' + name;", blanks: ["return"] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "Arrow functions use the => operator, and return is used to hand a value back to the caller.",
    predictCode: "const add = (a, b) => a + b;\nconsole.log(add(2, 3));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "In arrow functions, if you omit curly braces, the expression is implicitly returned." },
      { id: "b", label: "Error: missing return statement", correct: false, why: "Single-expression arrow functions don't require braces or explicit return." },
      { id: "c", label: "a + b", correct: false, why: "It evaluates the mathematical addition, not string concatenation here." },
    ]
  },
  lists: {
    prompt: "Arrange the lines to append 'cirrus' to the clouds list and print it.",
    parsonsFragments: [
      { id: "l1", text: "clouds = ['cumulus', 'stratus']", indent: 0 },
      { id: "l2", text: "clouds.append('cirrus')", indent: 0 },
      { id: "l3", text: "print(clouds)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to print the first cloud in the list.",
    fadedLines: [
      { text: "clouds = ['cumulus', 'stratus', 'cirrus']", blanks: [] },
      { text: "print(clouds[___])", blanks: ["0"] },
    ],
    fadedExplain: "Lists are 0-indexed, so index 0 retrieves the very first element.",
    predictCode: "items = [10, 20, 30]\nprint(len(items))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "len() counts the number of items in the list." },
      { id: "b", label: "2", correct: false, why: "Lists have 3 items, even though the max index is 2." },
      { id: "c", label: "30", correct: false, why: "It prints the length, not the last item." },
    ],
  },
  dictionaries: {
    prompt: "Arrange the lines to create a dictionary representing a star and print its name.",
    parsonsFragments: [
      { id: "d1", text: "star = {", indent: 0 },
      { id: "d2", text: "  'name': 'Vega',", indent: 1 },
      { id: "d3", text: "  'mag': 0.03", indent: 1 },
      { id: "d4", text: "}", indent: 0 },
      { id: "d5", text: "print(star['name'])", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to retrieve the altitude of a cloud.",
    fadedLines: [
      { text: "cloud = {'shape': 'wispy', 'altitude': 5000}", blanks: [] },
      { text: "print(cloud[___])", blanks: ["'altitude'"] },
    ],
    fadedExplain: "Keys in dictionaries are strings; you must wrap the key name in quotes.",
    predictCode: "data = {'x': 10}\ndata['y'] = 20\nprint(len(data))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1", correct: false, why: "y was added to the dictionary, making the length 2." },
      { id: "b", label: "2", correct: true, why: "The dictionary has two keys: 'x' and 'y'." },
      { id: "c", label: "Error", correct: false, why: "Adding keys dynamically is completely valid in Python." },
    ],
  },
  "js-loops": {
    prompt: "Arrange the lines to run a JS loop that counts from 1 to 3.",
    parsonsFragments: [
      { id: "jl1", text: "for (let i = 1; i <= 3; i++) {", indent: 0 },
      { id: "jl2", text: "  console.log(i);", indent: 1 },
      { id: "jl3", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete a standard loop that runs 4 times (0 to 3).",
    fadedLines: [
      { text: "for (let i = 0; i ___ 4; i___) {", blanks: ["<", "++"] },
      { text: "  console.log(i);", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The condition i < 4 stops the loop when i reaches 4. i++ increments it by 1 on each turn.",
    predictCode: "let sum = 0;\nfor (let i = 1; i < 3; i++) {\n  sum += i;\n}\nconsole.log(sum);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "The loop runs for i=1 and i=2. 1 + 2 = 3." },
      { id: "b", label: "6", correct: false, why: "The condition is i < 3, so it does not run for i=3." },
      { id: "c", label: "0", correct: false, why: "The loop executes and accumulates values in sum." },
    ],
  },
  "js-arrays": {
    prompt: "Arrange the lines to push 'Vega' into the stars array and log it.",
    parsonsFragments: [
      { id: "ja1", text: "const stars = ['Polaris'];", indent: 0 },
      { id: "ja2", text: "stars.push('Vega');", indent: 0 },
      { id: "ja3", text: "console.log(stars);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to log the number of elements in the array.",
    fadedLines: [
      { text: "const clouds = ['cirrus', 'cumulus'];", blanks: [] },
      { text: "console.log(clouds.___);", blanks: ["length"] },
    ],
    fadedExplain: "In JavaScript, the .length property retrieves the number of elements in an array.",
    predictCode: "const arr = [10, 20];\narr[0] = 99;\nconsole.log(arr);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[99, 20]", correct: true, why: "Arrays are mutable, so you can overwrite values at specific indexes." },
      { id: "b", label: "[10, 20]", correct: false, why: "Index 0 was updated to 99." },
      { id: "c", label: "Error", correct: false, why: "Even though declared with const, the array contents can be modified." },
    ],
  },
  "js-objects": {
    prompt: "Arrange the lines to create an object and access its 'shape' property.",
    parsonsFragments: [
      { id: "jo1", text: "const cloud = {", indent: 0 },
      { id: "jo2", text: "  shape: 'wispy'", indent: 1 },
      { id: "jo3", text: "};", indent: 0 },
      { id: "jo4", text: "console.log(cloud.shape);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to access the magnitude property using bracket notation.",
    fadedLines: [
      { text: "const star = { name: 'Vega', mag: 0.03 };", blanks: [] },
      { text: "console.log(star[___]);", blanks: ["'mag'"] },
    ],
    fadedExplain: "Bracket notation requires the property name to be specified as a string.",
    predictCode: "const user = { name: 'Dreamer' };\nuser.level = 5;\nconsole.log(user.level);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "You can dynamically add properties to JavaScript objects using dot notation." },
      { id: "b", label: "undefined", correct: false, why: "level was successfully added and assigned to 5." },
      { id: "c", label: "Error", correct: false, why: "Adding properties to const-declared objects is fully valid." },
    ],
  },
  "js-comparisons": {
    prompt: "Arrange the lines to check if altitude is strictly equal to 10000, storing the result in isCruising.",
    parsonsFragments: [
      { id: "jcp1", text: "const altitude = 10000;", indent: 0 },
      { id: "jcp2", text: "const isCruising = altitude === 10000;", indent: 0 },
      { id: "jcp3", text: "console.log(isCruising);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to check if the temperature is NOT strictly equal to 0.",
    fadedLines: [
      { text: "const temp = -5;", blanks: [] },
      { text: "const notFreezing = temp ___ 0;", blanks: ["!=="] },
      { text: "console.log(notFreezing);", blanks: [] },
    ],
    fadedExplain: "Use !== for strict inequality checks in JavaScript.",
    predictCode: "const a = 5;\nconst b = '5';\nconsole.log(a === b);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "true", correct: false, why: "=== checks both value and type. a is a number, b is a string." },
      { id: "b", label: "false", correct: true, why: "=== checks value and type strictly. They are of different types." },
      { id: "c", label: "undefined", correct: false, why: "=== evaluates to a boolean value, not undefined." },
    ],
  },
  "js-if-else": {
    prompt: "Arrange the lines to log 'Fly' if clear is true, otherwise log 'Wait'.",
    parsonsFragments: [
      { id: "jie1", text: "const clear = true;", indent: 0 },
      { id: "jie2", text: "if (clear) {", indent: 0 },
      { id: "jie3", text: "  console.log('Fly');", indent: 1 },
      { id: "jie4", text: "} else {", indent: 0 },
      { id: "jie5", text: "  console.log('Wait');", indent: 1 },
      { id: "jie6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete the if-else structure.",
    fadedLines: [
      { text: "const cloud = 'stormy';", blanks: [] },
      { text: "___ (cloud === 'stormy') {", blanks: ["if"] },
      { text: "  console.log('Stay');", blanks: [] },
      { text: "} ___ {", blanks: ["else"] },
      { text: "  console.log('Go');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "An if statement checks a condition in parentheses, and an else block executes if the condition is false.",
    predictCode: "const light = 'red';\nif (light === 'green') {\n  console.log('Go');\n} else {\n  console.log('Stop');\n}",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Go", correct: false, why: "The condition light === 'green' evaluates to false." },
      { id: "b", label: "Stop", correct: true, why: "Since the condition is false, the else block runs." },
      { id: "c", label: "undefined", correct: false, why: "It logs 'Stop' to the console." },
    ],
  },
  "js-else-if": {
    prompt: "Arrange the lines to classify the visibility level based on distance in miles.",
    parsonsFragments: [
      { id: "jei1", text: "if (dist > 5) {", indent: 0 },
      { id: "jei2", text: "  console.log('Clear');", indent: 1 },
      { id: "jei3", text: "} else if (dist > 2) {", indent: 0 },
      { id: "jei4", text: "  console.log('Hazy');", indent: 1 },
      { id: "jei5", text: "} else {", indent: 0 },
      { id: "jei6", text: "  console.log('Foggy');", indent: 1 },
      { id: "jei7", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to test three options in order.",
    fadedLines: [
      { text: "const speed = 40;", blanks: [] },
      { text: "if (speed > 50) {", blanks: [] },
      { text: "  console.log('Fast');", blanks: [] },
      { text: "} ___ if (speed > ___ ) {", blanks: ["else", "20"] },
      { text: "  console.log('Moderate');", blanks: [] },
      { text: "} else {", blanks: [] },
      { text: "  console.log('Slow');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "else if checks another condition if the first one was false. 20 is a logical intermediate threshold.",
    predictCode: "const depth = 15;\nif (depth > 20) {\n  console.log('Deep');\n} else if (depth > 10) {\n  console.log('Mid');\n} else {\n  console.log('Shallow');\n}",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Deep", correct: false, why: "depth is 15, which is not > 20." },
      { id: "b", label: "Mid", correct: true, why: "depth (15) is greater than 10, so the else if block executes." },
      { id: "c", label: "Shallow", correct: false, why: "The else if condition was met, so the else block is skipped." },
    ],
  },
  "js-logical-operators": {
    prompt: "Arrange the lines to allow launch only if fuel is high AND weather is clear.",
    parsonsFragments: [
      { id: "jlo1", text: "const fuelHigh = true;", indent: 0 },
      { id: "jlo2", text: "const clearWeather = true;", indent: 0 },
      { id: "jlo3", text: "if (fuelHigh && clearWeather) {", indent: 0 },
      { id: "jlo4", text: "  console.log('Launch!');", indent: 1 },
      { id: "jlo5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to log 'Stargaze' if it is dark AND NOT cloudy.",
    fadedLines: [
      { text: "const isDark = true;", blanks: [] },
      { text: "const isCloudy = false;", blanks: [] },
      { text: "if (isDark ___ ___isCloudy) {", blanks: ["&&", "!"] },
      { text: "  console.log('Stargaze');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use && to require both conditions to be true, and ! to check if a condition is false.",
    predictCode: "const rainy = true;\nconst windy = false;\nconsole.log(rainy || windy);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "true", correct: true, why: "The || (OR) operator returns true if at least one operand is true." },
      { id: "b", label: "false", correct: false, why: "rainy is true, which satisfies the || operator." },
      { id: "c", label: "undefined", correct: false, why: "It returns a boolean value." },
    ],
  },
  "js-ternary": {
    prompt: "Arrange the lines to assign 'hot' or 'cold' to tempStatus using a ternary operator.",
    parsonsFragments: [
      { id: "jt1", text: "const temp = 35;", indent: 0 },
      { id: "jt2", text: "const tempStatus = temp > 30 ? 'hot' : 'cold';", indent: 0 },
      { id: "jt3", text: "console.log(tempStatus);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to assign 'wet' if raining is true, else 'dry'.",
    fadedLines: [
      { text: "const raining = false;", blanks: [] },
      { text: "const state = raining ___ 'wet' ___ 'dry';", blanks: ["?", ":"] },
      { text: "console.log(state);", blanks: [] },
    ],
    fadedExplain: "Ternary operator syntax is condition ? expressionIfTrue : expressionIfFalse.",
    predictCode: "const altitude = 4000;\nconst level = altitude > 5000 ? 'high' : 'low';\nconsole.log(level);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "high", correct: false, why: "altitude (4000) is not greater than 5000." },
      { id: "b", label: "low", correct: true, why: "The condition is false, so the value after the colon is selected." },
      { id: "c", label: "4000", correct: false, why: "The ternary returns one of the two string literals." },
    ],
  },
  "js-array-methods": {
    prompt: "Arrange the lines to double every number in the sequence using .map().",
    parsonsFragments: [
      { id: "jam1", text: "const nums = [1, 2, 3];", indent: 0 },
      { id: "jam2", text: "const doubled = nums.map(n => n * 2);", indent: 0 },
      { id: "jam3", text: "console.log(doubled);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to keep only values strictly greater than 5 using .filter().",
    fadedLines: [
      { text: "const values = [3, 8, 5, 12];", blanks: [] },
      { text: "const high = values.___ (v ___ v > 5);", blanks: ["filter", "=>"] },
      { text: "console.log(high);", blanks: [] },
    ],
    fadedExplain: ".filter() calls a callback function for each element, keeping elements that return true.",
    predictCode: "const arr = [1, 2, 3];\nconst res = arr.map(x => x + 1).filter(x => x > 2);\nconsole.log(res);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[2, 3]", correct: false, why: "map makes [2, 3, 4], then filter(x > 2) leaves [3, 4]." },
      { id: "b", label: "[3, 4]", correct: true, why: "First map adds 1 to get [2, 3, 4], then filter keeps values > 2." },
      { id: "c", label: "[2, 3, 4]", correct: false, why: "The filter call removes the value 2." },
    ],
  },
  "js-destructuring": {
    prompt: "Arrange the lines to extract x and y from coordinates, then log them.",
    parsonsFragments: [
      { id: "jds1", text: "const coord = { x: 10, y: 20 };", indent: 0 },
      { id: "jds2", text: "const { x, y } = coord;", indent: 0 },
      { id: "jds3", text: "console.log(x, y);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to unpack first and second items from array, then combine with spread.",
    fadedLines: [
      { text: "const colors = ['red', 'green', 'blue'];", blanks: [] },
      { text: "const [first, second] ___ colors;", blanks: ["="] },
      { text: "const list = [___first, 'yellow'];", blanks: ["..."] },
    ],
    fadedExplain: "Destructuring arrays uses square brackets, and the spread operator ... expands elements into a new array.",
    predictCode: "const user = { name: 'Nova', level: 5 };\nconst { level: userLevel } = user;\nconsole.log(userLevel);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "Destructuring can rename properties. level is bound to userLevel, which is 5." },
      { id: "b", label: "Nova", correct: false, why: "level refers to the numeric value 5, not the name." },
      { id: "c", label: "undefined", correct: false, why: "userLevel receives the value of user.level." },
    ],
  },
  "js-object-methods": {
    prompt: "Arrange the lines to get the keys of an object and log them.",
    parsonsFragments: [
      { id: "jom1", text: "const cloud = { shape: 'wispy', color: 'pink' };", indent: 0 },
      { id: "jom2", text: "const keys = Object.keys(cloud);", indent: 0 },
      { id: "jom3", text: "console.log(keys);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to extract all values from the configuration object.",
    fadedLines: [
      { text: "const config = { speed: 100, active: true };", blanks: [] },
      { text: "const values = Object.___(config);", blanks: ["values"] },
      { text: "console.log(values);", blanks: [] },
    ],
    fadedExplain: "Object.values(config) returns an array containing the property values of the object.",
    predictCode: "const data = { x: 1, y: 2 };\nconsole.log(Object.keys(data).length);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "Object.keys(data) returns ['x', 'y'], whose length is 2." },
      { id: "b", label: "['x', 'y']", correct: false, why: "The length property counts the items in the key array." },
      { id: "c", label: "undefined", correct: false, why: "An array's length property is always a number." },
    ],
  },
  "js-loop-iterators": {
    prompt: "Arrange the lines to loop over array items using for...of.",
    parsonsFragments: [
      { id: "jli1", text: "const skies = ['neon', 'pastel'];", indent: 0 },
      { id: "jli2", text: "for (const sky of skies) {", indent: 0 },
      { id: "jli3", text: "  console.log(sky);", indent: 1 },
      { id: "jli4", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to iterate over the keys of an object using for...in.",
    fadedLines: [
      { text: "const stats = { wind: 15, temp: 5 };", blanks: [] },
      { text: "for (const key ___ stats) {", blanks: ["in"] },
      { text: "  console.log(key);", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use in to iterate over keys of an object, and of to iterate over elements of an array.",
    predictCode: "const items = [10, 20];\nlet total = 0;\nfor (const x of items) {\n  total += x;\n}\nconsole.log(total);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "30", correct: true, why: "for...of yields 10 and 20. 10 + 20 = 30." },
      { id: "b", label: "3", correct: false, why: "It yields values, not indices. Summing indices would be 0 + 1 = 1." },
      { id: "c", label: "Error", correct: false, why: "This is valid JavaScript array iteration." },
    ],
  },
  comparisons: {
    prompt: "Arrange the lines to check if altitude is higher than 4000 and lower than or equal to 1000, then print both results.",
    parsonsFragments: [
      { id: "cp1", text: "altitude = 4500", indent: 0 },
      { id: "cp2", text: "is_high = altitude > 4000", indent: 0 },
      { id: "cp3", text: "is_low = altitude <= 1000", indent: 0 },
      { id: "cp4", text: "print(is_high)", indent: 0 },
      { id: "cp5", text: "print(is_low)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to check if the count of stars is exactly 10 and if the sky is not clear.",
    fadedLines: [
      { text: "stars = 10", blanks: [] },
      { text: "sky_state = 'cloudy'", blanks: [] },
      { text: "is_ten = stars ___ 10", blanks: ["=="] },
      { text: "not_clear = sky_state ___ 'clear'", blanks: ["!="] },
    ],
    fadedExplain: "Use == to compare for equality, and != to check if two values are not equal.",
    predictCode: "cloud_count = 5\nstar_count = 12\nresult = cloud_count <= star_count\nprint(result)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True", correct: true, why: "5 is less than or equal to 12, so cloud_count <= star_count evaluates to True." },
      { id: "b", label: "False", correct: false, why: "The <= operator means less than or equal to, and 5 is indeed less than 12." },
      { id: "c", label: "Error", correct: false, why: "Comparing two integer variables using <= is perfectly valid Python." }
    ]
  },
  "if-else": {
    prompt: "Arrange the lines to check if the sky is stormy and set stay_home accordingly.",
    parsonsFragments: [
      { id: "ie1", text: "sky_status = 'stormy'", indent: 0 },
      { id: "ie2", text: "if sky_status == 'stormy':", indent: 0 },
      { id: "ie3", text: "    stay_home = True", indent: 1 },
      { id: "ie4", text: "else:", indent: 0 },
      { id: "ie5", text: "    stay_home = False", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to complete this if/else block that checks if there are clouds in the sky.",
    fadedLines: [
      { text: "has_clouds = True", blanks: [] },
      { text: "___ has_clouds:", blanks: ["if"] },
      { text: "    print('Sky is cloudy')", blanks: [] },
      { text: "___:", blanks: ["else"] },
      { text: "    print('Sky is clear')", blanks: [] },
    ],
    fadedExplain: "The if keyword starts a conditional check, and else covers the case where the condition is False.",
    predictCode: "clouds = 3\nif clouds > 5:\n    print('Many clouds')\nelse:\n    print('Few clouds')",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Many clouds", correct: false, why: "The condition clouds > 5 evaluates to False because 3 is not greater than 5." },
      { id: "b", label: "Few clouds", correct: true, why: "Since 3 is not greater than 5, the else block runs and prints 'Few clouds'." },
      { id: "c", label: "Nothing is printed", correct: false, why: "One of the two blocks must execute because the condition is either True or False." }
    ]
  },
  "elif-chains": {
    prompt: "Arrange the lines to evaluate the sky view based on star count.",
    parsonsFragments: [
      { id: "ec1", text: "if stars > 100:", indent: 0 },
      { id: "ec2", text: "    sky_view = 'superb'", indent: 1 },
      { id: "ec3", text: "elif stars > 50:", indent: 0 },
      { id: "ec4", text: "    sky_view = 'good'", indent: 1 },
      { id: "ec5", text: "else:", indent: 0 },
      { id: "ec6", text: "    sky_view = 'poor'", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to complete the conditional chain.",
    fadedLines: [
      { text: "if brightness > 80:", blanks: [] },
      { text: "    sky_type = 'bright'", blanks: [] },
      { text: "___ brightness > 30:", blanks: ["elif"] },
      { text: "    sky_type = 'dim'", blanks: [] },
      { text: "___:", blanks: ["else"] },
    ],
    fadedExplain: "Python uses elif for additional conditional checks, and else for the final fallback case.",
    predictCode: "cloud_height = 6000\nif cloud_height > 10000:\n    category = 'high'\nelif cloud_height > 5000:\n    category = 'mid'\nelse:\n    category = 'low'\nprint(category)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "high", correct: false, why: "6000 is not greater than 10000, so the first condition is False." },
      { id: "b", label: "mid", correct: true, why: "6000 is not greater than 10000, but it is greater than 5000, so the elif block runs." },
      { id: "c", label: "low", correct: false, why: "The elif condition was True, so the else block is skipped." }
    ]
  },
  "logical-operators": {
    prompt: "Arrange the lines to determine if you can see stars tonight.",
    parsonsFragments: [
      { id: "lo1", text: "is_clear = True", indent: 0 },
      { id: "lo2", text: "star_count = 80", indent: 0 },
      { id: "lo3", text: "can_see_stars = is_clear and star_count > 50", indent: 0 },
      { id: "lo4", text: "print(can_see_stars)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to check if the sky is cloudy or if it is currently raining, and then invert the result using the not operator.",
    fadedLines: [
      { text: "is_cloudy = False", blanks: [] },
      { text: "is_raining = True", blanks: [] },
      { text: "is_bad_weather = is_cloudy ___ is_raining", blanks: ["or"] },
      { text: "is_good_weather = ___ is_bad_weather", blanks: ["not"] },
    ],
    fadedExplain: "The or operator returns True if at least one operand is True. The not operator inverts the boolean value.",
    predictCode: "has_sun = True\nhas_clouds = False\nshow_rainbow = has_sun and not has_clouds\nprint(show_rainbow)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True", correct: true, why: "has_sun is True and not has_clouds is also True (not False is True). True and True is True." },
      { id: "b", label: "False", correct: false, why: "Both has_sun and not has_clouds evaluate to True, so the overall condition evaluates to True." },
      { id: "c", label: "Error", correct: false, why: "Using and and not in a boolean expression is valid in Python." }
    ]
  },
  "nested-conditions": {
    prompt: "Arrange the lines to determine how many stars are visible based on whether it is night and if there are clouds.",
    parsonsFragments: [
      { id: "nc1", text: "if is_night:", indent: 0 },
      { id: "nc2", text: "    if has_clouds:", indent: 1 },
      { id: "nc3", text: "        stars_visible = 0", indent: 2 },
      { id: "nc4", text: "    else:", indent: 1 },
      { id: "nc5", text: "        stars_visible = 100", indent: 2 },
    ],
    fadedPrompt: "Fill in the blanks to complete the nested conditional statement.",
    fadedLines: [
      { text: "sky_clear = True", blanks: [] },
      { text: "is_day = False", blanks: [] },
      { text: "if sky_clear:", blanks: [] },
      { text: "    ___ is_day:", blanks: ["if"] },
      { text: "        message = 'Sunny day'", blanks: [] },
      { text: "    ___:", blanks: ["else"] },
    ],
    fadedExplain: "A nested if statement is placed inside another if statement to perform secondary checks.",
    predictCode: "is_raining = True\nhas_umbrella = False\nif is_raining:\n    if has_umbrella:\n        status = 'dry'\n    else:\n        status = 'wet'\nelse:\n    status = 'fine'\nprint(status)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "dry", correct: false, why: "Since is_raining is True, the outer block executes. However, has_umbrella is False, so status is set to 'wet'." },
      { id: "b", label: "wet", correct: true, why: "The outer condition is True, but the nested condition has_umbrella is False, leading to the nested else block." },
      { id: "c", label: "fine", correct: false, why: "The outer else block is not executed because is_raining is True." }
    ]
  },
  "for-over-range": {
    prompt: "Arrange the lines to count stars by adding 2 stars in each of the 5 iterations.",
    parsonsFragments: [
      { id: "fr1", text: "total_stars = 0", indent: 0 },
      { id: "fr2", text: "for i in range(5):", indent: 0 },
      { id: "fr3", text: "    total_stars += 2", indent: 1 },
      { id: "fr4", text: "print(total_stars)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to write a loop that prints the numbers 1, 2, and 3.",
    fadedLines: [
      { text: "___ num in range(1, ___):", blanks: ["for", "4"] },
      { text: "    print('counting:', num)", blanks: [] },
    ],
    fadedExplain: "The range(1, 4) function generates numbers starting at 1 and ending just before 4 (1, 2, 3).",
    predictCode: "sum_val = 0\nfor i in range(2, 5):\n    sum_val += i\nprint(sum_val)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "9", correct: true, why: "range(2, 5) produces 2, 3, and 4. The sum is 2 + 3 + 4 = 9." },
      { id: "b", label: "14", correct: false, why: "range(2, 5) does not include 5, so it only adds 2, 3, and 4." },
      { id: "c", label: "5", correct: false, why: "The loop iterates three times, adding 2, 3, and then 4 to sum_val." }
    ]
  },
  "for-over-collections": {
    prompt: "Arrange the lines to print each star's designation in the constellation list.",
    parsonsFragments: [
      { id: "fc1", text: "constellation = ['alpha', 'beta', 'gamma']", indent: 0 },
      { id: "fc2", text: "for star in constellation:", indent: 0 },
      { id: "fc3", text: "    print('bright:', star)", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to loop through the dictionary keys representing cloud levels and print their heights.",
    fadedLines: [
      { text: "clouds = {'low': 1000, 'mid': 5000, 'high': 10000}", blanks: [] },
      { text: "___ level in clouds:", blanks: ["for"] },
      { text: "    print(level, 'is at', clouds[___], 'meters')", blanks: ["level"] },
    ],
    fadedExplain: "Looping over a dictionary iterates through its keys. You can retrieve each value using the key index clouds[level].",
    predictCode: "sky_objects = ['star', 'cloud', 'planet']\ncount = 0\nfor obj in sky_objects:\n    count += len(obj)\nprint(count)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: false, why: "The code adds the length of each string, not the number of items in the list." },
      { id: "b", label: "15", correct: true, why: "The lengths of 'star', 'cloud', and 'planet' are 4, 5, and 6 respectively. 4 + 5 + 6 = 15." },
      { id: "c", label: "Error", correct: false, why: "Iterating over a list of strings and calculating their lengths using len() is valid." }
    ]
  },
  "while-loops": {
    prompt: "Arrange the lines to increase altitude by 1000 on each iteration until it reaches or exceeds 4000.",
    parsonsFragments: [
      { id: "wl1", text: "altitude = 1000", indent: 0 },
      { id: "wl2", text: "while altitude < 4000:", indent: 0 },
      { id: "wl3", text: "    altitude += 1000", indent: 1 },
      { id: "wl4", text: "print(altitude)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to count down the remaining stars from 3 to 1.",
    fadedLines: [
      { text: "stars = 3", blanks: [] },
      { text: "___ stars > 0:", blanks: ["while"] },
      { text: "    print(stars)", blanks: [] },
      { text: "    stars ___ 1", blanks: ["-="] },
    ],
    fadedExplain: "A while loop runs as long as the condition is True. Subtracting 1 from stars on each iteration ensures the loop terminates.",
    predictCode: "count = 1\nwhile count < 4:\n    count *= 2\nprint(count)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: true, why: "First iteration: count becomes 2. Second iteration: count becomes 4. Since 4 is not less than 4, the loop terminates and prints 4." },
      { id: "b", label: "3", correct: false, why: "The variable count starts at 1, doubles to 2, then doubles to 4. It does not increment by 1." },
      { id: "c", label: "8", correct: false, why: "The loop terminates immediately when count reaches 4, so it does not multiply by 2 again." }
    ]
  },
  "break-continue": {
    prompt: "Arrange the lines to print altitudes but stop the loop completely when the altitude is 3000.",
    parsonsFragments: [
      { id: "bc1", text: "for altitude in [1000, 2000, 3000, 4000]:", indent: 0 },
      { id: "bc2", text: "    if altitude == 3000:", indent: 1 },
      { id: "bc3", text: "        break", indent: 2 },
      { id: "bc4", text: "    print(altitude)", indent: 1 },
    ],
    fadedPrompt: "Fill in the blank to skip printing the cloud if its type is 'stormy', but continue iterating over the rest.",
    fadedLines: [
      { text: "clouds = ['wispy', 'stormy', 'puffy']", blanks: [] },
      { text: "for cloud in clouds:", blanks: [] },
      { text: "    if cloud == 'stormy':", blanks: [] },
      { text: "        ___", blanks: ["continue"] },
      { text: "    print('cloud:', cloud)", blanks: [] },
    ],
    fadedExplain: "The continue statement skips the rest of the current iteration and jumps directly to the next loop cycle.",
    predictCode: "total = 0\nfor count in [1, 2, 3, 4]:\n    if count == 3:\n        continue\n    if count == 4:\n        break\n    total += count\nprint(total)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "For count=1, total becomes 1. For count=2, total becomes 3. For count=3, continue skips it. For count=4, break stops the loop. The final total is 3." },
      { id: "b", label: "6", correct: false, why: "The count of 3 is skipped by continue, and 4 is not added because break stops the loop before addition." },
      { id: "c", label: "10", correct: false, why: "The loop does not finish adding all elements because of the continue and break statements." }
    ]
  },
  "nested-loops": {
    prompt: "Arrange the lines to print each constellation paired with stars numbered 1 and 2.",
    parsonsFragments: [
      { id: "nl1", text: "constellations = ['Orion', 'Ursa']", indent: 0 },
      { id: "nl2", text: "for const in constellations:", indent: 0 },
      { id: "nl3", text: "    for star in [1, 2]:", indent: 1 },
      { id: "nl4", text: "        print(const, star)", indent: 2 },
    ],
    fadedPrompt: "Fill in the blanks to complete the nested loop that generates a grid representing coordinates in the sky.",
    fadedLines: [
      { text: "for x in range(2):", blanks: [] },
      { text: "    ___ y in range(2):", blanks: ["for"] },
      { text: "        print('Coord:', x, ___)", blanks: ["y"] },
    ],
    fadedExplain: "Nested loops are loops inside other loops. The inner loop completes all its iterations for every single step of the outer loop.",
    predictCode: "stars = 0\nfor sky in [1, 2]:\n    for cloud in [1, 2, 3]:\n        stars += 1\nprint(stars)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: false, why: "The outer loop runs 2 times and the inner loop runs 3 times for each outer iteration, making the total executions 2 * 3 = 6." },
      { id: "b", label: "6", correct: true, why: "The inner loop adds 1 to stars exactly 3 times for each of the 2 outer loop iterations, resulting in 6." },
      { id: "c", label: "9", correct: false, why: "The loop does not run 3 * 3 times; the outer loop sequence only has 2 elements." }
    ]
  },

  "parameters-arguments": {
    prompt: "Arrange the lines to define a function `track_cloud` with parameters `name` and `speed`, print those values, and call it with arguments `\"Cumulus\"` and `15`.",
    parsonsFragments: [
      { id: "pa1", text: "def track_cloud(name, speed):", indent: 0 },
      { id: "pa2", text: "    print(\"Cloud:\", name)", indent: 1 },
      { id: "pa3", text: "    print(\"Speed:\", speed)", indent: 1 },
      { id: "pa4", text: "track_cloud(\"Cumulus\", 15)", indent: 0 }
    ],
    fadedPrompt: "Fill in the parameter and the argument to complete the star tagging script.",
    fadedLines: [
      { text: "def tag_star(___, brightness):", blanks: ["name"] },
      { text: "    print(name + \" has brightness \" + str(brightness))", blanks: [] },
      { text: "tag_star(\"Vega\", ___)", blanks: ["1.5"] }
    ],
    fadedExplain: "The parameter name receives the string argument \"Vega\", while the brightness parameter receives the numeric argument 1.5.",
    predictCode: "def describe_cloud(color, height):\n    return color + \" cloud at \" + str(height) + \" feet\"\n\nresult = describe_cloud(\"silver\", 5000)\nprint(result)",
    predictQuestion: "What is the output of this Python code?",
    predictOptions: [
      {
        id: "a",
        label: "silver cloud at 5000 feet",
        correct: true,
        why: "The argument 'silver' is assigned to color, and 5000 is assigned to height. The combined string is returned and printed."
      },
      {
        id: "b",
        label: "describe_cloud silver 5000",
        correct: false,
        why: "The function call executes its body and returns the formatted string, it does not output the function name."
      },
      {
        id: "c",
        label: "5000 cloud at silver feet",
        correct: false,
        why: "Arguments are matched to parameters in the order they are passed, so 'silver' maps to color and 5000 maps to height."
      }
    ]
  },
  "return-values": {
    prompt: "Arrange the lines to define a function `get_altitude` that returns `8000` if the cloud type is `\"cirrus\"` and returns `2000` otherwise. Then call it with `\"cirrus\"`. ",
    parsonsFragments: [
      { id: "rv1", text: "def get_altitude(cloud_type):", indent: 0 },
      { id: "rv2", text: "    if cloud_type == \"cirrus\":", indent: 1 },
      { id: "rv3", text: "        return 8000", indent: 2 },
      { id: "rv4", text: "    return 2000", indent: 1 },
      { id: "rv5", text: "height = get_altitude(\"cirrus\")", indent: 0 }
    ],
    fadedPrompt: "Fill in the blanks to return the total star count and assign the function result to a variable.",
    fadedLines: [
      { text: "def calculate_stars(rows, cols):", blanks: [] },
      { text: "    total = rows * cols", blanks: [] },
      { text: "    ___ total", blanks: ["return"] },
      { text: "result = ___(5, 10)", blanks: ["calculate_stars"] }
    ],
    fadedExplain: "The return keyword sends the value of total back to the caller. We call the function calculate_stars and assign its returned value to the result variable.",
    predictCode: "def get_star_color(temperature):\n    if temperature > 10000:\n        return \"blue\"\n    return \"red\"\n\nstar = get_star_color(12000)\nprint(star)",
    predictQuestion: "What is printed when this code runs?",
    predictOptions: [
      {
        id: "a",
        label: "blue",
        correct: true,
        why: "The temperature is 12000, which is greater than 10000. The function executes the first return statement and returns 'blue'."
      },
      {
        id: "b",
        label: "red",
        correct: false,
        why: "The temperature condition is met, so the function returns 'blue' and exits before reaching the return statement for 'red'."
      },
      {
        id: "c",
        label: "None",
        correct: false,
        why: "The function returns a valid string value, so the print statement prints that returned string rather than None."
      }
    ]
  },
  "default-keyword-args": {
    prompt: "Arrange the lines to define a function `create_sky` with default parameters `color=\"blue\"` and `stars=10`. Then call the function, overriding the stars value with a keyword argument of `50`.",
    parsonsFragments: [
      { id: "dk1", text: "def create_sky(color=\"blue\", stars=10):", indent: 0 },
      { id: "dk2", text: "    print(\"Sky color:\", color)", indent: 1 },
      { id: "dk3", text: "    print(\"Stars count:\", stars)", indent: 1 },
      { id: "dk4", text: "create_sky(stars=50)", indent: 0 }
    ],
    fadedPrompt: "Fill in the default value for shape, then call the function specifying the size keyword argument.",
    fadedLines: [
      { text: "def make_cloud(shape=___, size=\"large\"):", blanks: ["\"fluffy\""] },
      { text: "    return shape + \" and \" + size", blanks: [] },
      { text: "sky_cloud = make_cloud(___=\"huge\")", blanks: ["size"] }
    ],
    fadedExplain: "The parameter shape is assigned a default value of 'fluffy'. The function is called by specifying size as a keyword argument with the value 'huge'.",
    predictCode: "def describe_sky(color=\"dark blue\", moon=True):\n    if moon:\n        return color + \" with a moon\"\n    return color + \" and empty\"\n\nresult = describe_sky(moon=False)\nprint(result)",
    predictQuestion: "What is the output of this Python code?",
    predictOptions: [
      {
        id: "a",
        label: "dark blue and empty",
        correct: true,
        why: "The color parameter defaults to 'dark blue' and moon is set to False. This executes the second return block."
      },
      {
        id: "b",
        label: "dark blue with a moon",
        correct: false,
        why: "The moon argument was explicitly set to False, so the first condition if moon is not met."
      },
      {
        id: "c",
        label: "empty",
        correct: false,
        why: "The color parameter defaults to 'dark blue', which is prefixed to the returned string."
      }
    ]
  },
  "variable-scope": {
    prompt: "Arrange the lines to define a global variable `sky_color`, create a function that defines a local variable with the same name, and call that function.",
    parsonsFragments: [
      { id: "vs1", text: "sky_color = \"midnight blue\"", indent: 0 },
      { id: "vs2", text: "def change_sky():", indent: 0 },
      { id: "vs3", text: "    sky_color = \"sunset pink\"", indent: 1 },
      { id: "vs4", text: "    print(\"Inside:\", sky_color)", indent: 1 },
      { id: "vs5", text: "change_sky()", indent: 0 }
    ],
    fadedPrompt: "Fill in the local variable assignment and reference to observe how variable scope functions.",
    fadedLines: [
      { text: "sky_star = \"polaris\"", blanks: [] },
      { text: "def show():", blanks: [] },
      { text: "    sky_star = ___", blanks: ["\"sirius\""] },
      { text: "    print(sky_star)", blanks: [] }
    ],
    fadedExplain: "The variable sky_star inside show is a local variable. Defining it does not affect the global variable of the same name defined outside.",
    predictCode: "cloud_count = 10\n\ndef add_clouds():\n    cloud_count = 5\n    return cloud_count\n\nadd_clouds()\nprint(cloud_count)",
    predictQuestion: "What is printed when this Python code is executed?",
    predictOptions: [
      {
        id: "a",
        label: "10",
        correct: true,
        why: "The assignment cloud_count = 5 inside the function creates a local variable. The global variable remains unchanged at 10."
      },
      {
        id: "b",
        label: "5",
        correct: false,
        why: "The print statement is outside the function scope, so it references the global cloud_count variable, not the local one."
      },
      {
        id: "c",
        label: "15",
        correct: false,
        why: "The global and local variables are in completely separate scopes and are not added together."
      }
    ]
  },
  "compose-functions": {
    prompt: "Arrange the lines to define two functions: one that counts items in a sky list and another that checks if the count is crowded. Then compose them.",
    parsonsFragments: [
      { id: "cf1", text: "def count_stars(sky):", indent: 0 },
      { id: "cf2", text: "    return len(sky)", indent: 1 },
      { id: "cf3", text: "def is_crowded(count):", indent: 0 },
      { id: "cf4", text: "    return count > 5", indent: 1 },
      { id: "cf5", text: "stars = [\"polaris\", \"sirius\", \"vega\"]", indent: 0 },
      { id: "cf6", text: "crowded = is_crowded(count_stars(stars))", indent: 0 }
    ],
    fadedPrompt: "Complete the function composition by nesting the call to add_stars inside another call to add_stars.",
    fadedLines: [
      { text: "def add_stars(n):", blanks: [] },
      { text: "    return n + 5", blanks: [] },
      { text: "total = add_stars(___(10))", blanks: ["add_stars"] }
    ],
    fadedExplain: "The inner call add_stars(10) runs first and evaluates to 15. This result is then passed as the argument to the outer add_stars function call.",
    predictCode: "def add_star(sky):\n    return sky + \" star\"\n\ndef shine(light):\n    return light.upper() + \"!\"\n\nresult = shine(add_star(\"bright\"))\nprint(result)",
    predictQuestion: "What does this code print?",
    predictOptions: [
      {
        id: "a",
        label: "BRIGHT STAR!",
        correct: true,
        why: "The function add_star('bright') runs first, returning 'bright star'. This result is passed to shine, which returns 'BRIGHT STAR!'."
      },
      {
        id: "b",
        label: "bright star!",
        correct: false,
        why: "The shine function calls upper() on the input string, which converts all its characters to uppercase."
      },
      {
        id: "c",
        label: "BRIGHT!",
        correct: false,
        why: "The add_star function appends ' star' to the input first, so that substring is also capitalized by shine."
      }
    ]
  },

  "py-list-comprehensions": {
    prompt: "Arrange the lines to create a list of uppercase star names for stars with names longer than 4 characters.",
    parsonsFragments: [
      { id: "lc1", text: 'stars = ["sirius", "vega", "rigel", "altair"]', indent: 0 },
      { id: "lc2", text: "bright_stars = [", indent: 0 },
      { id: "lc3", text: "s.upper()", indent: 1 },
      { id: "lc4", text: "for s in stars if len(s) > 4", indent: 1 },
      { id: "lc5", text: "]", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to build a list of cloud names that have exactly 5 letters.",
    fadedLines: [
      { text: 'clouds = ["cumulus", "stratus", "cirrus", "fog"]', blanks: [] },
      { text: "five_letter_clouds = [c ___ c ___ clouds ___ len(c) == 5]", blanks: ["for", "in", "if"] },
    ],
    fadedExplain: "We use 'for c in clouds' to loop through the clouds, and 'if len(c) == 5' to filter for 5-letter names.",
    predictCode: 'clouds = ["cumulus", "cirrus", "fog"]\nlengths = [len(c) for c in clouds]\nprint(lengths)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[7, 6, 3]", correct: true, why: "The list comprehension calculates the length of each cloud name and stores the results in a new list." },
      { id: "b", label: '["cumulus", "cirrus", "fog"]', correct: false, why: "This would be the original list of clouds, not their lengths." },
      { id: "c", label: "[len, len, len]", correct: false, why: "len is a function, but len(c) evaluates to an integer representing the length of the string." },
    ],
  },
  "py-dict-comprehensions": {
    prompt: "Arrange the lines to create a dictionary that maps star names to their character lengths, but only for stars with names shorter than 6 characters.",
    parsonsFragments: [
      { id: "dc1", text: 'stars = ["sirius", "vega", "rigel", "polaris"]', indent: 0 },
      { id: "dc2", text: "star_lengths = {", indent: 0 },
      { id: "dc3", text: "name: len(name)", indent: 1 },
      { id: "dc4", text: "for name in stars", indent: 1 },
      { id: "dc5", text: "if len(name) < 6", indent: 1 },
      { id: "dc6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to create a dictionary mapping cloud names to their uppercase versions.",
    fadedLines: [
      { text: 'clouds = ["cumulus", "cirrus"]', blanks: [] },
      { text: "upper_clouds = {c ___ c.upper() ___ c ___ clouds}", blanks: [":", "for", "in"] },
    ],
    fadedExplain: "A dictionary comprehension uses the key:value syntax, followed by a standard loop over the source list.",
    predictCode: 'stars = {"sirius": 8, "vega": 5, "rigel": 6}\nbright = {k: v for k, v in stars.items() if v > 5}\nprint(bright)',
    predictQuestion: "What is printed by this code?",
    predictOptions: [
      { id: "a", label: '{"sirius": 8, "rigel": 6}', correct: true, why: "The dictionary comprehension iterates through the key-value pairs of the original dictionary and filters for values strictly greater than 5." },
      { id: "b", label: '{"vega": 5}', correct: false, why: "This would be the result if we filtered for values less than or equal to 5." },
      { id: "c", label: '{"sirius": 8, "vega": 5, "rigel": 6}', correct: false, why: "This is the entire original dictionary without any filtering applied." },
    ],
  },
  "py-slicing": {
    prompt: "Arrange the lines to slice the last two elements of the cloud list and print them.",
    parsonsFragments: [
      { id: "sl1", text: 'clouds = ["cirrus", "cumulus", "stratus", "nimbus"]', indent: 0 },
      { id: "sl2", text: "last_two = clouds[-2:]", indent: 0 },
      { id: "sl3", text: "print(last_two)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to slice the string from index 2 up to, but not including, index 7.",
    fadedLines: [
      { text: 'text = "starlight"', blanks: [] },
      { text: "sub = text[___:___]", blanks: ["2", "7"] },
    ],
    fadedExplain: "Slicing syntax uses start:stop, where start is inclusive and stop is exclusive.",
    predictCode: 'sky_colors = ["blue", "pink", "purple", "orange", "gold"]\nsubset = sky_colors[1:4:2]\nprint(subset)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: '["pink", "purple"]', correct: false, why: "This would be the slice if the step was 1, up to index 3." },
      { id: "b", label: '["pink", "orange"]', correct: true, why: "Slicing starting at index 1 up to 4 with a step of 2 retrieves indices 1 and 3." },
      { id: "c", label: '["pink", "purple", "orange"]', correct: false, why: "This would be the slice with a step of 1, i.e., sky_colors[1:4]." },
    ],
  },
  "py-sets-tuples": {
    prompt: "Arrange the lines to create a set of unique cloud types from a list of clouds, then check if 'cirrus' is in that set.",
    parsonsFragments: [
      { id: "st1", text: 'cloud_list = ["cumulus", "cirrus", "cumulus", "stratus"]', indent: 0 },
      { id: "st2", text: "unique_clouds = set(cloud_list)", indent: 0 },
      { id: "st3", text: 'has_cirrus = "cirrus" in unique_clouds', indent: 0 },
      { id: "st4", text: "print(has_cirrus)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define an immutable tuple of coordinates representing a star and access its first value.",
    fadedLines: [
      { text: "star_coords = ___10.5, 42.0___", blanks: ["(", ")"] },
      { text: "x_coord = star_coords___0___", blanks: ["[", "]"] },
    ],
    fadedExplain: "Tuples are defined using parentheses, and indexing elements uses square brackets.",
    predictCode: 'clouds = {"cumulus", "stratus"}\nclouds.add("cumulus")\nclouds.add("nimbus")\nprint(len(clouds))',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: false, why: "Sets do not allow duplicate values, so adding 'cumulus' a second time has no effect." },
      { id: "b", label: "3", correct: true, why: "The set starts with 2 elements, 'cumulus' is not duplicated, and 'nimbus' is added, making it 3 elements." },
      { id: "c", label: "2", correct: false, why: "This would be the size if 'nimbus' was not added." },
    ],
  },
  "py-enumerate-zip": {
    prompt: "Arrange the lines to iterate over a list of star names and print each star's position (starting from 1) and its name.",
    parsonsFragments: [
      { id: "ez1", text: 'stars = ["sirius", "vega", "polaris"]', indent: 0 },
      { id: "ez2", text: "for i, star in enumerate(stars, start=1):", indent: 0 },
      { id: "ez3", text: 'print(f"Star {i}: {star}")', indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to pair cloud names with their corresponding altitudes using zip.",
    fadedLines: [
      { text: 'names = ["stratus", "cirrus"]', blanks: [] },
      { text: "altitudes = [1000, 6000]", blanks: [] },
      { text: "for name, alt ___ zip(names, altitudes)___", blanks: ["in", ":"] },
      { text: "    print(name, alt)", blanks: [] },
    ],
    fadedExplain: "The zip function combines parallel iterables, and we loop over it using the 'in' keyword followed by a colon.",
    predictCode: 'names = ["vega", "rigel"]\nbrightness = [1, 2, 3]\nfor name, level in zip(names, brightness):\n    print(name, level)',
    predictQuestion: "How many times does the print statement execute?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "zip stops when the shortest input iterable is exhausted, which is the names list with 2 items." },
      { id: "b", label: "3", correct: false, why: "This would assume zip loops until the longest list is finished, but zip is lazy and stops early." },
      { id: "c", label: "5", correct: false, why: "This is the sum of both lists, but zip pairs them instead of concatenating." },
    ],
  },
  "py-exceptions": {
    prompt: "Arrange the lines to safely convert a star's brightness value to an integer, returning 0 if a ValueError occurs.",
    parsonsFragments: [
      { id: "ex1", text: 'brightness_str = "dim"', indent: 0 },
      { id: "ex2", text: "try:", indent: 0 },
      { id: "ex3", text: "val = int(brightness_str)", indent: 1 },
      { id: "ex4", text: "except ValueError:", indent: 0 },
      { id: "ex5", text: "val = 0", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to handle a ZeroDivisionError when calculating average cloud density.",
    fadedLines: [
      { text: "___:", blanks: ["try"] },
      { text: "    density = mass / volume", blanks: [] },
      { text: "___ ZeroDivisionError:", blanks: ["except"] },
      { text: "    density = 0", blanks: [] },
    ],
    fadedExplain: "We use 'try' to wrap code that might fail, and 'except' to handle specific errors like ZeroDivisionError.",
    predictCode: 'try:\n    stars = ["sirius", "vega"]\n    selected = stars[2]\nexcept IndexError:\n    selected = "unknown"\nfinally:\n    print("Done")\nprint(selected)',
    predictQuestion: "What is printed when this program is run?",
    predictOptions: [
      { id: "a", label: '"unknown" then "Done"', correct: false, why: "The finally block always runs before control leaves the try-except statement, so 'Done' is printed before the outer print(selected)." },
      { id: "b", label: '"Done" then "unknown"', correct: true, why: "The Index error triggers the except block, but the finally block executes before the final print statement." },
      { id: "c", label: "IndexError exception details", correct: false, why: "The IndexError is caught by the except block, so the program does not crash with an error trace." },
    ],
  },
  "py-file-handling": {
    prompt: "Arrange the lines to open a file named 'stars.txt' for writing, write 'Sirius' to it, and output a confirmation message.",
    parsonsFragments: [
      { id: "fh1", text: 'with open("stars.txt", "w") as f:', indent: 0 },
      { id: "fh2", text: 'f.write("Sirius\\n")', indent: 1 },
      { id: "fh3", text: 'print("Star saved")', indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to open 'clouds.txt' in read mode and read all its lines.",
    fadedLines: [
      { text: '___ open("clouds.txt", "___") ___ file:', blanks: ["with", "r", "as"] },
      { text: "    lines = file.___()", blanks: ["readlines"] },
    ],
    fadedExplain: "The 'with' statement handles resource closing. 'r' is for reading, 'as' names the file variable, and readlines() reads all lines.",
    predictCode: 'with open("sky.txt", "r") as f:\n    content = f.read()\nprint(f.closed)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False", correct: false, why: "The context manager automatically closes the file upon exiting the block, so f.closed is not False." },
      { id: "b", label: "True", correct: true, why: "The with statement acts as a context manager that automatically closes the file object once the block finishes." },
      { id: "c", label: '"Beautiful Clouds"', correct: false, why: "This is the content of the file, but we print f.closed, not content." },
    ],
  },
  "py-oop": {
    prompt: "Arrange the lines to define a Star class with an initializer that sets name and brightness, then create an instance of it.",
    parsonsFragments: [
      { id: "op1", text: "class Star:", indent: 0 },
      { id: "op2", text: "def __init__(self, name, brightness):", indent: 1 },
      { id: "op3", text: "self.name = name", indent: 2 },
      { id: "op4", text: "self.brightness = brightness", indent: 2 },
      { id: "op5", text: 'vega = Star("Vega", 5)', indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a Star class with a name attribute.",
    fadedLines: [
      { text: "class Star:", blanks: [] },
      { text: "    def ___(___, name):", blanks: ["__init__", "self"] },
      { text: "        self.name = name", blanks: [] },
    ],
    fadedExplain: "We define constructors in Python with __init__ and refer to the current instance using self.",
    predictCode: 'class Sky:\n    def __init__(self, color):\n        self.color = color\n    def get_color(self):\n        return self.color\n\nday_sky = Sky("blue")\nprint(day_sky.get_color())',
    predictQuestion: "What is the output of this code?",
    predictOptions: [
      { id: "a", label: "None", correct: false, why: "The get_color method returns self.color, which was initialized to 'blue', not None." },
      { id: "b", label: '"blue"', correct: true, why: "The instance day_sky is created with the color 'blue', which is returned by get_color() and printed." },
      { id: "c", label: '"color"', correct: false, why: "self.color holds the value passed to the constructor ('blue'), not the string literal 'color'." },
    ],
  },
  "py-generators": {
    prompt: "Arrange the lines to create a generator that produces numbered star names, allowing the caller to send a new index using a send() call.",
    parsonsFragments: [
      { id: "ge1", text: "def star_generator(limit):", indent: 0 },
      { id: "ge2", text: "    count = 1", indent: 1 },
      { id: "ge3", text: "    while count <= limit:", indent: 1 },
      { id: "ge4", text: "        val = yield f\"Star {count}\"", indent: 2 },
      { id: "ge5", text: "        count = val if val is not None else count + 1", indent: 2 }
    ],
    fadedPrompt: "Fill in the blanks to delegate generator execution to a sub-generator and yield the final returned string.",
    fadedLines: [
      { text: "def stream():", blanks: [] },
      { text: "    ___ [\"star\", \"cloud\"]", blanks: ["yield from"] },
      { text: "    return \"done\"", blanks: [] },
      { text: "def run():", blanks: [] },
      { text: "    result = ___ stream()", blanks: ["yield from"] },
      { text: "    yield result", blanks: [] }
    ],
    fadedExplain: "The yield from expression delegates generator operations to another iterable or generator, and it evaluates to the value returned by that sub-generator.",
    predictCode: "def star_accumulator():\n    total = 0\n    while True:\n        value = yield total\n        if value is None:\n            break\n        total += value\n\ng = star_accumulator()\nprint(next(g), g.send(5), g.send(10))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "0 5 15", correct: true, why: "The first next(g) starts the generator and yields the initial total of 0. Subsequent send() calls resume the generator and add the sent value to the total, returning the new total." },
      { id: "b", label: "5 10 15", correct: false, why: "The first next(g) call returns 0 before any value is sent or accumulated." },
      { id: "c", label: "0 0 5", correct: false, why: "Each send() call updates the total and yields it on the next loop iteration, so the sent values are accumulated." }
    ]
  },
  "py-decorators": {
    prompt: "Arrange the lines to define a basic decorator that prints a message before calling the original function.",
    parsonsFragments: [
      { id: "de1", text: "def star_log(func):", indent: 0 },
      { id: "de2", text: "    def wrapper(*args, **kwargs):", indent: 1 },
      { id: "de3", text: "        print(\"Star scan started\")", indent: 2 },
      { id: "de4", text: "        return func(*args, **kwargs)", indent: 2 },
      { id: "de5", text: "    return wrapper", indent: 1 }
    ],
    fadedPrompt: "Fill in the blanks to use wraps to preserve the original function metadata on the decorated wrapper.",
    fadedLines: [
      { text: "from functools import wraps", blanks: [] },
      { text: "def cloud_decorator(func):", blanks: [] },
      { text: "    @___(func)", blanks: ["wraps"] },
      { text: "    def ___():", blanks: ["wrapper"] },
      { text: "        return func().upper()", blanks: [] },
      { text: "    return wrapper", blanks: [] }
    ],
    fadedExplain: "functools.wraps is a decorator helper that copies metadata such as the function name and docstring from the original function to the wrapper.",
    predictCode: "class StarCache:\n    def __init__(self, func):\n        self.func = func\n        self.cache = {}\n    def __call__(self, name):\n        if name not in self.cache:\n            self.cache[name] = self.func(name)\n        return self.cache[name]\n\n@StarCache\ndef get_star(name):\n    return f\"Star:{name}\"\n\ng1 = get_star(\"Sirius\")\ng2 = get_star(\"Sirius\")\nprint(g1 == g2, len(get_star.cache))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True 1", correct: true, why: "The class-based decorator caches the result of the call. The second call uses the cached result, so the cache dictionary has a single entry, and both return values are equal." },
      { id: "b", label: "True 2", correct: false, why: "The second call returns from the cache instead of computing it again, so no second item is added." },
      { id: "c", label: "False 1", correct: false, why: "Both variables reference the exact same string from the cache, so the equality check is True." }
    ]
  },
  "py-metaprogramming": {
    prompt: "Arrange the lines to create a metaclass that injects a default galaxy attribute into all classes that use it.",
    parsonsFragments: [
      { id: "mp1", text: "class StarMeta(type):", indent: 0 },
      { id: "mp2", text: "    def __new__(cls, name, bases, attrs):", indent: 1 },
      { id: "mp3", text: "        attrs[\"galaxy\"] = \"Milky Way\"", indent: 2 },
      { id: "mp4", text: "        return super().__new__(cls, name, bases, attrs)", indent: 2 }
    ],
    fadedPrompt: "Fill in the blanks to complete a base class that automatically registers all its subclasses using init_subclass.",
    fadedLines: [
      { text: "class CloudRegistry:", blanks: [] },
      { text: "    subclasses = []", blanks: [] },
      { text: "    def __init_subclass__(cls, **kwargs):", blanks: [] },
      { text: "        super().___(**kwargs)", blanks: ["__init_subclass__"] },
      { text: "        cls.subclasses.append(cls)", blanks: [] }
    ],
    fadedExplain: "The __init_subclass__ method is called on the parent class whenever a subclass is created, allowing lightweight registration or validation.",
    predictCode: "class StarMeta(type):\n    def __new__(cls, name, bases, attrs):\n        new_attrs = {}\n        for key, val in attrs.items():\n            if not key.startswith(\"__\"):\n                new_attrs[key.upper()] = val\n            else:\n                new_attrs[key] = val\n        return super().__new__(cls, name, bases, new_attrs)\n\nclass Nebula(metaclass=StarMeta):\n    star_name = \"Orion\"\n\nn = Nebula()\nprint(hasattr(n, \"star_name\"), hasattr(n, \"STAR_NAME\"))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False True", correct: true, why: "The metaclass intercepts class creation and capitalizes all attributes that do not start with a double underscore, leaving star_name renamed to STAR_NAME." },
      { id: "b", label: "True False", correct: false, why: "The attribute star_name was renamed by the metaclass during class creation, so it does not exist under its original name." },
      { id: "c", label: "True True", correct: false, why: "The metaclass replaces the original lower-case attribute with the upper-case version, rather than duplicating it." }
    ]
  },
  "py-concurrency": {
    prompt: "Arrange the lines to create a coroutine that runs two tasks concurrently and returns their aggregated results.",
    parsonsFragments: [
      { id: "co1", text: "async def scan_sky():", indent: 0 },
      { id: "co2", text: "    tasks = [fetch(\"stars\"), fetch(\"clouds\")]", indent: 1 },
      { id: "co3", text: "    results = await asyncio.gather(*tasks)", indent: 1 },
      { id: "co4", text: "    return results", indent: 1 }
    ],
    fadedPrompt: "Fill in the blanks to protect a block of code using an asynchronous context manager lock.",
    fadedLines: [
      { text: "async def safe_write(lock):", blanks: [] },
      { text: "    ___ with lock:", blanks: ["async"] },
      { text: "        ___ asyncio.sleep(0.01)", blanks: ["await"] }
    ],
    fadedExplain: "Use async with to acquire and release locks or manage resources in an asynchronous context.",
    predictCode: "import asyncio\n\nasync def star_task(name, delay):\n    await asyncio.sleep(delay)\n    return name\n\nasync def main():\n    t1 = asyncio.create_task(star_task(\"Sirius\", 0.2))\n    t2 = asyncio.create_task(star_task(\"Vega\", 0.1))\n    await asyncio.sleep(0.15)\n    print(t1.done(), t2.done())\n\nasyncio.run(main())",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False True", correct: true, why: "The sleep(0.15) call yields control to the event loop. The task that requires 0.1 seconds (t2) completes, while the task requiring 0.2 seconds (t1) is still running." },
      { id: "b", label: "True True", correct: false, why: "At 0.15 seconds, the task taking 0.2 seconds (t1) has not finished yet." },
      { id: "c", label: "False False", correct: false, why: "The task taking 0.1 seconds (t2) is finished because 0.15 seconds have passed." }
    ]
  },
  "py-internals": {
    prompt: "Arrange the lines to access the code object of a function and inspect its local variable names.",
    parsonsFragments: [
      { id: "pi1", text: "def star_fn(x):", indent: 0 },
      { id: "pi2", text: "    return x + 1", indent: 1 },
      { id: "pi3", text: "code = star_fn.__code__", indent: 0 },
      { id: "pi4", text: "print(code.co_varnames)", indent: 0 }
    ],
    fadedPrompt: "Fill in the blanks to intern a string so that both variables reference the exact same object in CPython's memory.",
    fadedLines: [
      { text: "import sys", blanks: [] },
      { text: "a = sys.___(\"sky_limit\")", blanks: ["intern"] },
      { text: "b = sys.intern(\"sky_limit\")", blanks: [] },
      { text: "result = a ___ b", blanks: ["is"] }
    ],
    fadedExplain: "sys.intern registers a string in Python's internal string table, ensuring that identical interned strings share the same memory location, allowing fast identity checks using is.",
    predictCode: "import sys\n\na = [1, 2, 3]\nb = a\nc = [a]\nprint(sys.getrefcount(a))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: true, why: "The reference count of the list is 4: one from a, one from b, one from the nested list c, and one temporary reference passed to the sys.getrefcount function." },
      { id: "b", label: "3", correct: false, why: "The sys.getrefcount function itself creates a temporary reference during evaluation, which increases the count by 1." },
      { id: "c", label: "2", correct: false, why: "Both b and the nested list c hold references to the list, in addition to a." }
    ]
  },

  "js-closures": {
    prompt: "Arrange the lines to create a star tracker closure that increments and returns a count each time it is called.",
    parsonsFragments: [
      { id: "cl1", text: "function createStarTracker() {", indent: 0 },
      { id: "cl2", text: "  let starCount = 0;", indent: 1 },
      { id: "cl3", text: "  return () => ++starCount;", indent: 1 },
      { id: "cl4", text: "}", indent: 0 },
      { id: "cl5", text: "const tracker = createStarTracker();", indent: 0 },
      { id: "cl6", text: "console.log(tracker());", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to return a nested function that accesses the outer function parameter 'base'.",
    fadedLines: [
      { text: "function makeCloudSizer(base) {", blanks: [] },
      { text: "  ___ (factor) => ___ * factor;", blanks: ["return", "base"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The returned inner function forms a closure, allowing it to remember and access the base variable from the outer function's scope.",
    predictCode: "const createSkyMultiplier = (multiplier) => {\n  return (clouds) => clouds * multiplier;\n};\nconst doubleClouds = createSkyMultiplier(2);\nconst tripleClouds = createSkyMultiplier(3);\nconsole.log(doubleClouds(5) + tripleClouds(4));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "22", correct: true, why: "doubleClouds(5) evaluates to 10, and tripleClouds(4) evaluates to 12. Their sum is 22." },
      { id: "b", label: "14", correct: false, why: "This incorrect result assumes both functions share the same multiplier value." },
      { id: "c", label: "Error", correct: false, why: "Each call to createSkyMultiplier successfully creates a new closure with its own independent scope." }
    ]
  },
  "js-callbacks": {
    prompt: "Arrange the lines to call a sky observation function passing a callback that logs the name of the cloud.",
    parsonsFragments: [
      { id: "cb1", text: "const observeSky = (cloud, callback) => {", indent: 0 },
      { id: "cb2", text: "  callback(cloud);", indent: 1 },
      { id: "cb3", text: "};", indent: 0 },
      { id: "cb4", text: "observeSky('cumulus', (name) => {", indent: 0 },
      { id: "cb5", text: "  console.log('Saw ' + name);", indent: 1 },
      { id: "cb6", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a function that accepts a callback and invokes it with the star name.",
    fadedLines: [
      { text: "function loadStarData(star, ___) {", blanks: ["callback"] },
      { text: "  ___(star);", blanks: ["callback"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The callback parameter receives a function argument, which is then executed by invoking it with parentheses and arguments.",
    predictCode: "const filterStars = (stars, checkFn) => {\n  const result = [];\n  for (const star of stars) {\n    if (checkFn(star)) {\n      result.push(star);\n    }\n  }\n  return result;\n};\nconst skyList = ['Sirius', 'Vega', 'Altair'];\nconst matched = filterStars(skyList, (name) => name.startsWith('A'));\nconsole.log(matched);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "['Altair']", correct: true, why: "The filterStars function uses the callback to filter the list, and only 'Altair' starts with the letter 'A'." },
      { id: "b", label: "['Sirius', 'Vega', 'Altair']", correct: false, why: "The callback check is applied to every item, so only matching items are returned, not the whole array." },
      { id: "c", label: "[]", correct: false, why: "Since 'Altair' matches the start letter 'A' check, the result array is not empty." }
    ]
  },
  "js-async-await": {
    prompt: "Arrange the lines to define an async function that awaits data from a forecast API and calls it.",
    parsonsFragments: [
      { id: "aa1", text: "const fetchSkyData = async () => {", indent: 0 },
      { id: "aa2", text: "  const data = await getForecast();", indent: 1 },
      { id: "aa3", text: "  console.log(data.temp);", indent: 1 },
      { id: "aa4", text: "};", indent: 0 },
      { id: "aa5", text: "fetchSkyData();", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define an asynchronous function and await the result of an asynchronous operation.",
    fadedLines: [
      { text: "___ function countStars() {", blanks: ["async"] },
      { text: "  const list = ___ fetchList();", blanks: ["await"] },
      { text: "  return list.length;", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The async keyword declares that a function returns a Promise, and the await keyword pauses execution inside the function until that Promise is resolved.",
    predictCode: "const getAltitude = async () => 8000;\nconst run = async () => {\n  console.log('Start');\n  const val = await getAltitude();\n  console.log(val);\n};\nrun();\nconsole.log('End');",
    predictQuestion: "What order are the values printed to the console?",
    predictOptions: [
      { id: "a", label: "'Start', then 'End', then 8000", correct: true, why: "The await keyword yields execution back to the caller, allowing the synchronous console.log('End') to run before the promise resolves." },
      { id: "b", label: "'Start', then 8000, then 'End'", correct: false, why: "JavaScript is single-threaded and non-blocking; await does not halt the main thread while waiting." },
      { id: "c", label: "8000, then 'Start', then 'End'", correct: false, why: "The run function executes synchronously up until the await statement, so 'Start' is always printed first." }
    ]
  },
  "js-classes": {
    prompt: "Arrange the lines to define a Cloud class with a constructor and a description method.",
    parsonsFragments: [
      { id: "cs1", text: "class Cloud {", indent: 0 },
      { id: "cs2", text: "  constructor(name) {", indent: 1 },
      { id: "cs3", text: "    this.name = name;", indent: 2 },
      { id: "cs4", text: "  }", indent: 1 },
      { id: "cs5", text: "  describe() { return this.name; }", indent: 1 },
      { id: "cs6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete the class constructor and initialize its context.",
    fadedLines: [
      { text: "class Star {", blanks: [] },
      { text: "  ___(name, magnitude) {", blanks: ["constructor"] },
      { text: "    ___.name = name;", blanks: ["this"] },
      { text: "    this.magnitude = magnitude;", blanks: [] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The constructor method automatically runs when instantiating the class, and the this keyword refers to the new object being created.",
    predictCode: "class Cloud {\n  constructor(type) {\n    this.type = type;\n  }\n  getType() {\n    return this.type;\n  }\n}\nclass StormCloud extends Cloud {\n  constructor(type, severity) {\n    super(type);\n    this.severity = severity;\n  }\n  getType() {\n    return 'Stormy ' + super.getType();\n  }\n}\nconst nimbus = new StormCloud('cumulus', 'high');\nconsole.log(nimbus.getType());",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "'Stormy cumulus'", correct: true, why: "The subclass overrides getType() but successfully invokes the parent version with super.getType() to access this.type." },
      { id: "b", label: "'Stormy undefined'", correct: false, why: "The parent constructor is successfully run via super(type) in the subclass, meaning this.type is correctly set to 'cumulus'." },
      { id: "c", label: "Error", correct: false, why: "This code is fully valid JavaScript class syntax demonstrating standard prototype inheritance and method overriding." }
    ]
  },
  "js-error-handling": {
    prompt: "Arrange the lines to throw an error if the sky is overcast and log the error message in the catch block.",
    parsonsFragments: [
      { id: "eh1", text: "try {", indent: 0 },
      { id: "eh2", text: "  if (clouds > 50) throw new Error('Overcast');", indent: 1 },
      { id: "eh3", text: "  console.log('Clear');", indent: 1 },
      { id: "eh4", text: "} catch (err) {", indent: 0 },
      { id: "eh5", text: "  console.log(err.message);", indent: 1 },
      { id: "eh6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to raise a new error when the star count is invalid.",
    fadedLines: [
      { text: "function estimateStars(count) {", blanks: [] },
      { text: "  if (count < 0) {", blanks: [] },
      { text: "    ___ ___ Error('Invalid count');", blanks: ["throw", "new"] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The throw statement generates user-defined exceptions, and new constructs an instance of the built-in Error object.",
    predictCode: "const analyzeWeather = () => {\n  try {\n    console.log('Trying');\n    throw new Error('Storm');\n    console.log('Sunny');\n  } catch (err) {\n    console.log(err.message);\n  } finally {\n    console.log('Done');\n  }\n};\nanalyzeWeather();",
    predictQuestion: "What order of messages is printed to the console?",
    predictOptions: [
      { id: "a", label: "'Trying', then 'Storm', then 'Done'", correct: true, why: "The error halts the try block, triggers the catch block to print 'Storm', and the finally block runs last." },
      { id: "b", label: "'Trying', then 'Storm'", correct: false, why: "This options omits 'Done' from the finally block, which always executes." },
      { id: "c", label: "'Trying', then 'Sunny', then 'Done'", correct: false, why: "Throwing an error immediately jumps to the catch block, meaning code after the throw is never reached." }
    ]
  },
  "js-modules": {
    prompt: "Arrange the lines to define a module that exports two constants and a default function.",
    parsonsFragments: [
      { id: "md1", text: "export const constellation = 'Orion';", indent: 0 },
      { id: "md2", text: "export const stars = 7;", indent: 0 },
      { id: "md3", text: "export default function mapConstellation() {", indent: 0 },
      { id: "md4", text: "  return constellation + ' has ' + stars;", indent: 1 },
      { id: "md5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to import a named export from another module.",
    fadedLines: [
      { text: "___ { constellation } ___ './sky.js';", blanks: ["import", "from"] },
      { text: "import getStars from './stars.js';", blanks: [] },
    ],
    fadedExplain: "Use the import and from keywords to bring named exports (wrapped in curly braces) into the current file from another module.",
    predictCode: "// sky.js\nexport const constellation = 'Ursa Major';\nexport default 'Polaris';\n\n// app.js\nimport northStar, { constellation } from './sky.js';\nconsole.log(constellation + ' points to ' + northStar);",
    predictQuestion: "What is logged when app.js runs?",
    predictOptions: [
      { id: "a", label: "'Ursa Major points to Polaris'", correct: true, why: "The default export 'Polaris' maps to the local variable northStar, and the named export matches 'Ursa Major'." },
      { id: "b", label: "'Polaris points to Ursa Major'", correct: false, why: "The default export 'Polaris' was bound to northStar, while 'Ursa Major' was bound to constellation." },
      { id: "c", label: "Error", correct: false, why: "Importing both a default export and named exports in a single line is standard ES6 module syntax." }
    ]
  },
  "js-array-reduce": {
    prompt: "Arrange the lines to calculate the sum of an array using the reduce method.",
    parsonsFragments: [
      { id: "ar1", text: "const stars = [1, 2, 3];", indent: 0 },
      { id: "ar2", text: "const total = stars.reduce((sum, current) => {", indent: 0 },
      { id: "ar3", text: "  return sum + current;", indent: 1 },
      { id: "ar4", text: "}, 0);", indent: 0 },
      { id: "ar5", text: "console.log(total);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to accumulate the array items starting from an initial value of 0.",
    fadedLines: [
      { text: "const clouds = [10, 20, 30];", blanks: [] },
      { text: "const total = clouds.___( (acc, curr) => acc + curr, ___);", blanks: ["reduce", "0"] },
    ],
    fadedExplain: "The reduce method loops through an array, executing the callback to combine the accumulator (acc) with the current item (curr), starting from the initial value.",
    predictCode: "const starMag = [\n  { name: 'Vega', mag: 0 },\n  { name: 'Polaris', mag: 2 }\n];\nconst result = starMag.reduce((acc, star) => {\n  return acc + star.mag;\n}, 10);\nconsole.log(result);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "12", correct: true, why: "The accumulator starts at 10. The reduce method then adds Vega's mag (0) and Polaris's mag (2), summing up to 12." },
      { id: "b", label: "2", correct: false, why: "This is the sum of magnitudes without adding the initial value of 10." },
      { id: "c", label: "Error", correct: false, why: "Accumulating object properties while starting from a numeric initial value is a common and correct pattern." }
    ]
  },
  "js-dom-basics": {
    prompt: "Arrange the lines to query a button and a status element, and update the status text when clicked.",
    parsonsFragments: [
      { id: "db1", text: "const btn = document.querySelector('#btn');", indent: 0 },
      { id: "db2", text: "const status = document.querySelector('#status');", indent: 0 },
      { id: "db3", text: "btn.addEventListener('click', () => {", indent: 0 },
      { id: "db4", text: "  status.textContent = 'Cleared';", indent: 1 },
      { id: "db5", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to create a new DOM element and add it to the body.",
    fadedLines: [
      { text: "const star = document.___('div');", blanks: ["createElement"] },
      { text: "star.classList.add('glow');", blanks: [] },
      { text: "document.body.___(star);", blanks: ["appendChild"] },
    ],
    fadedExplain: "The createElement method defines a new HTML element in memory, while appendChild inserts it into the active DOM tree under the document body.",
    predictCode: "// HTML: <div id='sky'>Cloudy</div>\nconst element = document.getElementById('sky');\nelement.className = 'dark';\nelement.textContent = 'Starry';",
    predictQuestion: "What is the updated HTML representation of this element?",
    predictOptions: [
      { id: "a", label: "'<div id=\"sky\" class=\"dark\">Starry</div>'", correct: true, why: "className changes or sets the class attribute, and textContent overwrites the text inside the tag." },
      { id: "b", label: "'<div id=\"sky\" class=\"dark\">CloudyStarry</div>'", correct: false, why: "Setting textContent replaces all children and existing text; it does not append to them." },
      { id: "c", label: "'<div class=\"dark\">Starry</div>'", correct: false, why: "Updating the className does not delete the element's existing id attribute." }
    ]
  },

  "js-metaprogramming": {
    prompt: "Arrange the lines to create a Proxy that intercepts property access and returns a fallback value for missing properties.",
    parsonsFragments: [
      { id: "jmp1", text: "const handler = {", indent: 0 },
      { id: "jmp2", text: "  get(target, prop) {", indent: 1 },
      { id: "jmp3", text: "    return prop in target ? target[prop] : 'unseen star';", indent: 2 },
      { id: "jmp4", text: "  }", indent: 1 },
      { id: "jmp5", text: "};", indent: 0 },
      { id: "jmp6", text: "const proxy = new Proxy({ vega: 'bright' }, handler);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a get trap on the handler and instantiate the Proxy.",
    fadedLines: [
      { text: "const handler = {", blanks: [] },
      { text: "  ___(target, prop) { return target[prop] || 'clear'; }", blanks: ["get"] },
      { text: "};", blanks: [] },
      { text: "const proxy = new ___({ sky: 'blue' }, handler);", blanks: ["Proxy"] },
    ],
    fadedExplain: "The get trap intercepts property access on the target object, and the Proxy constructor wraps the target with the handler.",
    predictCode: "const sky = { clouds: 5 };\nconst handler = {\n  get(target, prop) {\n    return prop in target ? target[prop] * 2 : 0;\n  }\n};\nconst proxy = new Proxy(sky, handler);\nconsole.log(proxy.clouds + proxy.stars);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "10", correct: true, why: "The proxy get trap doubles the value of clouds to 10, and returns 0 for the missing stars property. 10 + 0 is 10." },
      { id: "b", label: "5", correct: false, why: "The get trap doubles existing properties, so proxy.clouds is 10, not 5." },
      { id: "c", label: "NaN", correct: false, why: "Since the proxy returns 0 instead of undefined for missing properties, the mathematical addition does not produce NaN." }
    ]
  },
  "js-concurrency": {
    prompt: "Arrange the lines to fetch multiple star profiles in parallel and log the final results array.",
    parsonsFragments: [
      { id: "jco1", text: "const fetchStar = async (name) => ({ name, status: 'shining' });", indent: 0 },
      { id: "jco2", text: "const promises = ['Vega', 'Altair'].map(fetchStar);", indent: 0 },
      { id: "jco3", text: "const results = await Promise.all(promises);", indent: 0 },
      { id: "jco4", text: "console.log(results);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to wait for both resolve operations to complete in parallel.",
    fadedLines: [
      { text: "const loadSky = async () => {", blanks: [] },
      { text: "  const p1 = Promise.resolve('clouds');", blanks: [] },
      { text: "  return ___ Promise.___([p1, Promise.resolve('stars')]);", blanks: ["await", "all"] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "We use the await keyword to pause execution until the promise resolves, and Promise.all to wait for multiple promises in parallel.",
    predictCode: "const p1 = Promise.resolve('star');\nconst p2 = Promise.reject('cloud error');\nPromise.all([p1, p2])\n  .then(res => console.log('success'))\n  .catch(err => console.log(err));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "success", correct: false, why: "Since one of the input promises rejects, Promise.all will reject and execute the catch block." },
      { id: "b", label: "cloud error", correct: true, why: "Promise.all fails fast. If any input promise rejects, the entire operation rejects with that error." },
      { id: "c", label: "[ 'star', undefined ]", correct: false, why: "Promise.all does not return partial success arrays if a rejection occurs." }
    ]
  },
  "js-internals": {
    prompt: "Arrange the lines so the program logs the sky, then a cloud via a microtask, and finally a star via a macrotask.",
    parsonsFragments: [
      { id: "jin1", text: "console.log('sky');", indent: 0 },
      { id: "jin2", text: "setTimeout(() => console.log('star'), 0);", indent: 0 },
      { id: "jin3", text: "Promise.resolve().then(() => {", indent: 0 },
      { id: "jin4", text: "  console.log('cloud');", indent: 1 },
      { id: "jin5", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to schedule a macrotask and a microtask.",
    fadedLines: [
      { text: "___(() => console.log('macro'), 0);", blanks: ["setTimeout"] },
      { text: "___(() => console.log('micro'));", blanks: ["queueMicrotask"] },
    ],
    fadedExplain: "setTimeout schedules a macrotask on the event loop, while queueMicrotask schedules a microtask to be run immediately after the current script finishes.",
    predictCode: "console.log('sky');\nsetTimeout(() => console.log('star'), 0);\nPromise.resolve().then(() => console.log('cloud'));\nconsole.log('moon');",
    predictQuestion: "In what order are the messages printed?",
    predictOptions: [
      { id: "a", label: "sky, moon, cloud, star", correct: true, why: "sky and moon are synchronous and print first. The microtask queue prints cloud next, followed by the macrotask queue printing star." },
      { id: "b", label: "sky, cloud, moon, star", correct: false, why: "The Promise callback is asynchronous and must wait until all synchronous code (including moon) has executed." },
      { id: "c", label: "sky, moon, star, cloud", correct: false, why: "Microtasks have higher priority than macrotasks, so cloud runs before the setTimeout callback prints star." }
    ]
  }

};

export interface ChallengeTestCase {
  label: string;
  args: unknown[];
  expected: unknown;
}

export interface Challenge {
  slug: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "JavaScript" | "Python" | "TypeScript";
  xp: number;
  badge?: string;
  blurb: string;
  instructions: string;
  starter: string;
  functionName: string;
  testCases: ChallengeTestCase[];
}

export const challenges: Record<string, Challenge> = {
  "cloud-hopper": {
    slug: "cloud-hopper",
    name: "Cloud Hopper",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    badge: "cloud-hopper",
    blurb: "Count the clouds tall enough to land on.",
    instructions: "You're hopping across the sky, but you can only land on clouds that rise above height k. Given a list of cloud heights, return how many clouds you can land on.",
    starter: `function countTallClouds(heights, k) {
  let count = 0;
  for (const h of heights) {
    if (h > k) {
      count = count + 1;
    }
  }
  return count;
}`,
    functionName: "countTallClouds",
    testCases: [
      { label: "[3,7,2,9], k=5 → 2", args: [[3, 7, 2, 9], 5], expected: 2 },
      { label: "[], k=4 → 0", args: [[], 4], expected: 0 },
      { label: "[5,5,5], k=5 → 0", args: [[5, 5, 5], 5], expected: 0 },
    ]
  },
  "rain-counter": {
    slug: "rain-counter",
    name: "Rain Counter",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Total the raindrops in a nested list.",
    instructions: "Given a list of lists of numbers representing raindrops in different sectors of the sky, calculate the total number of raindrops. Return 0 if there are no raindrops.",
    starter: `def total_raindrops(sectors):
    total = 0
    # Write your code here
    return total`,
    functionName: "total_raindrops",
    testCases: [
      { label: "[[1, 2], [3, 4]] → 10", args: [[[1, 2], [3, 4]]], expected: 10 },
      { label: "[[], [5]] → 5", args: [[[], [5]]], expected: 5 },
      { label: "[] → 0", args: [[]], expected: 0 },
    ]
  },
  "star-sorter": {
    slug: "star-sorter",
    name: "Star Sorter",
    level: "Beginner",
    language: "Python",
    xp: 50,
    blurb: "Sort the night sky by brightness.",
    instructions: "Given a list of stars (represented as names and magnitudes), sort them by magnitude in ascending order. Lower magnitude values mean brighter stars.",
    starter: `def sort_stars(stars):
    # stars is a list of dicts, e.g. [{"name": "Sirius", "mag": -1.46}]
    # Sort them by "mag" and return the sorted list
    return sorted(stars, key=lambda s: s["mag"])`,
    functionName: "sort_stars",
    testCases: [
      {
        label: "Sirius & Vega -> Sirius first",
        args: [[{ name: "Vega", mag: 0.03 }, { name: "Sirius", mag: -1.46 }]],
        expected: [{ name: "Sirius", mag: -1.46 }, { name: "Vega", mag: 0.03 }]
      },
      {
        label: "No stars -> []",
        args: [[]],
        expected: []
      }
    ]
  },
  "list-wrangler": {
    slug: "list-wrangler",
    name: "List Wrangler",
    level: "Beginner",
    language: "Python",
    xp: 40,
    badge: "list-wrangler",
    blurb: "Filter a list of numbers by a threshold.",
    instructions: "Given a list of numbers representing daily temperatures, write a function `find_cold_days(temps, threshold)` that filters and returns a list of all temperatures that are strictly below the threshold.",
    starter: `def find_cold_days(temps, threshold):
    cold = []
    # Write your code here
    return cold`,
    functionName: "find_cold_days",
    testCases: [
      { label: "temps=[15, 22, 12], threshold=15 -> [12]", args: [[15, 22, 12, 25, 9], 15], expected: [12, 9] },
      { label: "empty list -> []", args: [[], 0], expected: [] },
      { label: "no cold days -> []", args: [[18, 20], 15], expected: [] }
    ]
  },
  "dict-diver": {
    slug: "dict-diver",
    name: "Dict Diver",
    level: "Beginner",
    language: "Python",
    xp: 40,
    badge: "dict-diver",
    blurb: "Find the brightest star in a dictionary.",
    instructions: "Given a dictionary mapping star names to their magnitude values, write a function `find_brightest(stars)` that returns the name of the brightest star (the one with the lowest magnitude). If the dictionary is empty, return None.",
    starter: `def find_brightest(stars):
    # Write your code here
    return None`,
    functionName: "find_brightest",
    testCases: [
      { label: "multiple stars -> Sirius", args: [{ "Vega": 0.03, "Sirius": -1.46, "Betelgeuse": 0.50 }], expected: "Sirius" },
      { label: "empty dict -> None", args: [{}], expected: null },
      { label: "single star -> Polaris", args: [{ "Polaris": 1.97 }], expected: "Polaris" }
    ]
  },
  "js-loops-challenge": {
    slug: "js-loops-challenge",
    name: "Sum Up To",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Repeat arithmetic updates in a loop.",
    instructions: "Write a function `sumUpTo(n)` that takes an integer n and returns the sum of all numbers from 1 to n (inclusive). If n is less than 1, return 0.",
    starter: `function sumUpTo(n) {
  let sum = 0;
  // Write your code here
  return sum;
}`,
    functionName: "sumUpTo",
    testCases: [
      { label: "n=5 -> 15", args: [5], expected: 15 },
      { label: "n=0 -> 0", args: [0], expected: 0 },
      { label: "n=10 -> 55", args: [10], expected: 55 }
    ]
  },
  "js-arrays-challenge": {
    slug: "js-arrays-challenge",
    name: "Double Evens",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Filter and map elements in an array.",
    instructions: "Write a function `doubleEvens(arr)` that takes an array of numbers, filters out the odd numbers, doubles the even numbers, and returns the new array.",
    starter: `function doubleEvens(arr) {
  // Write your code here
  return [];
}`,
    functionName: "doubleEvens",
    testCases: [
      { label: "mix of numbers -> evens doubled", args: [[1, 2, 3, 4]], expected: [4, 8] },
      { label: "all odds -> []", args: [[5, 7, 9]], expected: [] },
      { label: "empty array -> []", args: [[]], expected: [] }
    ]
  },
  "js-objects-challenge": {
    slug: "js-objects-challenge",
    name: "Property Lookup",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Validate and lookup properties in objects.",
    instructions: "Write a function `lookupProperty(obj, key)` that takes an object and a key string. If the object has that property (not undefined), return its value. Otherwise, return 'Property not found'.",
    starter: `function lookupProperty(obj, key) {
  // Write your code here
  return "";
}`,
    functionName: "lookupProperty",
    testCases: [
      { label: "key exists -> value", args: [{ name: "Nova", level: 4 }, "name"], expected: "Nova" },
      { label: "key missing -> not found", args: [{ name: "Nova" }, "xp"], expected: "Property not found" },
      { label: "empty obj -> not found", args: [{}], expected: "Property not found" }
    ]
  },
  "js-sky-classifier": {
    slug: "js-sky-classifier",
    name: "JS Sky Classifier",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Classify sky safety based on visibility and weather.",
    instructions: "Write a function `classifySky(visibility, isStormy, isNight)` that takes visibility (number in miles), isStormy (boolean), and isNight (boolean). It should return the sky status as a string:\n- If it is stormy, return 'unsafe'.\n- Otherwise, if visibility is strictly less than 3 miles, or if it is night and visibility is strictly less than 5 miles, return 'restricted'.\n- In all other cases, return 'clear'.",
    starter: `function classifySky(visibility, isStormy, isNight) {
  // Write your code here
  return "";
}`,
    functionName: "classifySky",
    testCases: [
      { label: "stormy check: (10, true, false) → unsafe", args: [10, true, false], expected: "unsafe" },
      { label: "low visibility: (2, false, false) → restricted", args: [2, false, false], expected: "restricted" },
      { label: "night visibility check: (4, false, true) → restricted", args: [4, false, true], expected: "restricted" },
      { label: "night visibility ok: (6, false, true) → clear", args: [6, false, true], expected: "clear" },
      { label: "day visibility ok: (4, false, false) → clear", args: [4, false, false], expected: "clear" },
    ]
  },
  "js-array-transformer": {
    slug: "js-array-transformer",
    name: "JS Array Transformer",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Transform and filter an array of cloud objects.",
    instructions: "Write a function `transformClouds(clouds, minHeight)` that takes an array of cloud objects `{ name: string, height: number }` and a number `minHeight`. It should:\n1. Filter out clouds with heights strictly less than `minHeight`.\n2. Map the remaining clouds to return an array of their name strings in uppercase.\n3. Return this array.\nIf no clouds match, return an empty array.",
    starter: `function transformClouds(clouds, minHeight) {
  // Write your code here
  return [];
}`,
    functionName: "transformClouds",
    testCases: [
      {
        label: "filter and uppercase",
        args: [
          [
            { name: "cumulus", height: 3000 },
            { name: "cirrus", height: 6000 },
            { name: "stratus", height: 1500 }
          ],
          3000
        ],
        expected: ["CUMULUS", "CIRRUS"]
      },
      {
        label: "all filtered out",
        args: [[{ name: "fog", height: 200 }], 1000],
        expected: []
      },
      {
        label: "empty array input",
        args: [[], 500],
        expected: []
      }
    ]
  },
  "py-comprehension-sorter": {
    slug: "py-comprehension-sorter",
    name: "Comprehension Sorter",
    level: "Intermediate",
    language: "Python",
    xp: 50,
    blurb: "Filter and format star entries using dictionary comprehensions.",
    instructions: "Write a function `filter_stars(stars, min_mag)` that takes a list of dictionaries representing stars, e.g. `[{\"name\": \"Sirius\", \"mag\": -1.46}]`, and a float `min_mag`. It should return a dictionary mapping star names to their magnitudes, but only for stars with a magnitude strictly greater than `min_mag` (lower brightness). Use a dictionary comprehension.",
    starter: `def filter_stars(stars, min_mag):
    # Write your code here
    return {}`,
    functionName: "filter_stars",
    testCases: [
      {
        label: "filter brightness",
        args: [[{ "name": "Sirius", "mag": -1.46 }, { "name": "Vega", "mag": 0.03 }], -1.0],
        expected: { "Vega": 0.03 }
      },
      {
        label: "filter all",
        args: [[{ "name": "Sirius", "mag": -1.46 }], 0.0],
        expected: {}
      }
    ]
  },
  "js-reducer": {
    slug: "js-reducer",
    name: "Reducer Sum",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Reduce an array of objects to accumulate a single value.",
    instructions: "Write a function `sumCloudAltitudes(clouds)` that takes an array of cloud objects `{ name: string, altitude: number }` and returns the sum of all their altitudes using the `.reduce()` method. If the array is empty, return 0.",
    starter: `function sumCloudAltitudes(clouds) {
  // Write your code here
  return 0;
}`,
    functionName: "sumCloudAltitudes",
    testCases: [
      {
        label: "sum multiple heights",
        args: [[{ name: "cumulus", altitude: 3000 }, { name: "cirrus", altitude: 6000 }]],
        expected: 9000
      },
      {
        label: "empty array -> 0",
        args: [[]],
        expected: 0
      }
    ]
  },
  "py-basics-density": {
    slug: "py-basics-density",
    name: "Sky Density Calculator",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Calculate the density of a cloud sector.",
    instructions: "Write a function `calculate_density(mass, volume)` that takes a float `mass` (in kg) and float `volume` (in cubic meters) and returns the density of the cloud sector (mass divided by volume). If the volume is 0 or negative, return 0.0.",
    starter: `def calculate_density(mass, volume):
    # Write your code here
    return 0.0`,
    functionName: "calculate_density",
    testCases: [
      { label: "normal case: 100kg, 50m³ -> 2.0", args: [100.0, 50.0], expected: 2.0 },
      { label: "zero mass -> 0.0", args: [0.0, 10.0], expected: 0.0 },
      { label: "zero volume -> 0.0", args: [50.0, 0.0], expected: 0.0 },
      { label: "negative volume -> 0.0", args: [50.0, -5.0], expected: 0.0 }
    ]
  },
  "py-conditionals-altitude": {
    slug: "py-conditionals-altitude",
    name: "Altitude Classifier",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Classify cloud layer based on altitude.",
    instructions: "Write a function `classify_altitude(altitude)` that takes an integer `altitude` (in meters) and returns: 'low' if altitude is strictly less than 2000; 'mid' if altitude is between 2000 and 6000 (inclusive); and 'high' if altitude is strictly greater than 6000.",
    starter: `def classify_altitude(altitude):
    # Write your code here
    return ""`,
    functionName: "classify_altitude",
    testCases: [
      { label: "altitude 1500 -> low", args: [1500], expected: "low" },
      { label: "altitude 2000 -> mid", args: [2000], expected: "mid" },
      { label: "altitude 5000 -> mid", args: [5000], expected: "mid" },
      { label: "altitude 6000 -> mid", args: [6000], expected: "mid" },
      { label: "altitude 7000 -> high", args: [7000], expected: "high" }
    ]
  },
  "py-functions-average": {
    slug: "py-functions-average",
    name: "Average Magnitude",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Calculate average star magnitude.",
    instructions: "Write a function `average_magnitude(magnitudes)` that takes a list of float `magnitudes` and returns their average, rounded to 2 decimal places using `round(value, 2)`. If the list is empty, return 0.0.",
    starter: `def average_magnitude(magnitudes):
    # Write your code here
    return 0.0`,
    functionName: "average_magnitude",
    testCases: [
      { label: "average check: [1.2, 2.4, 0.6] -> 1.4", args: [[1.2, 2.4, 0.6]], expected: 1.4 },
      { label: "rounding check: [0.03, 1.97, 0.5] -> 0.83", args: [[0.03, 1.97, 0.5]], expected: 0.83 },
      { label: "empty list -> 0.0", args: [[]], expected: 0.0 }
    ]
  },
  "py-intermediate-oop": {
    slug: "py-intermediate-oop",
    name: "Cloud Tracker Class",
    level: "Intermediate",
    language: "Python",
    xp: 50,
    blurb: "Define a class to track cloud height and growth.",
    instructions: "Write a class `CloudTracker` with an initializer `__init__(self, name, height)` (height in meters). Implement a method `grow(self, amount)` that adds `amount` to the height. If `amount` is less than or equal to 0, raise a `ValueError`. Implement a method `get_status(self)` that returns `'{name} is at {height}m'`.\n\nAlso write a helper function `test_tracker(name, height, grow_amount)` that instantiates the class, calls `grow(grow_amount)`, and returns `get_status()`. If a `ValueError` is raised, it should catch it and return `'invalid growth'`.",
    starter: `class CloudTracker:
    # Write your class here
    pass

def test_tracker(name, height, grow_amount):
    # Write your helper function here
    return ""`,
    functionName: "test_tracker",
    testCases: [
      { label: "normal growth: Cumulus 1000m + 500m -> 1500m", args: ["Cumulus", 1000, 500], expected: "Cumulus is at 1500m" },
      { label: "negative growth -> error", args: ["Nimbus", 2000, -100], expected: "invalid growth" },
      { label: "zero growth -> error", args: ["Stratus", 500, 0], expected: "invalid growth" }
    ]
  },
  "py-advanced-decorator": {
    slug: "py-advanced-decorator",
    name: "Observation Logger",
    level: "Advanced",
    language: "Python",
    xp: 60,
    blurb: "Write a decorator that formats string return values.",
    instructions: "Write a decorator `add_telemetry` that wraps a function returning a string. The decorator should prepend `'[Telemetry] '` to the returned string.\n\nAlso write a function `test_decorator(val)` that defines a local function decorated with `@add_telemetry` and returns the result of calling it with `val`.",
    starter: `def add_telemetry(func):
    # Write your decorator here
    pass

def test_decorator(val):
    # Call a function decorated with @add_telemetry
    return ""`,
    functionName: "test_decorator",
    testCases: [
      { label: "clear sky -> telemetry prepended", args: ["sky is clear"], expected: "[Telemetry] sky is clear" },
      { label: "storm alert -> telemetry prepended", args: ["storm incoming"], expected: "[Telemetry] storm incoming" },
      { label: "empty string -> just the tag", args: [""], expected: "[Telemetry] " }
    ]
  },
  "py-expert-descriptor": {
    slug: "py-expert-descriptor",
    name: "Validation Descriptor",
    level: "Advanced",
    language: "Python",
    xp: 70,
    blurb: "Write a Python descriptor that enforces integer constraints.",
    instructions: "Write a descriptor class `IntegerRange` that restricts a class attribute to integers between a minimum and maximum value (inclusive). The `__init__(self, min_val, max_val)` constructor should accept `min_val` and `max_val`. If `__set__(self, instance, value)` is called with a value that is not an integer, or is outside the specified range, raise a `ValueError`.\n\nAlso write a class `Planet` that uses the descriptor for its `gravity` attribute:\n```python\nclass Planet:\n    gravity = IntegerRange(1, 100)\n    def __init__(self, name, gravity):\n        self.name = name\n        self.gravity = gravity\n```\nFinally, write a helper function `test_descriptor(name, gravity)` that instantiates `Planet(name, gravity)`. If it succeeds, return the string `'{name} is at {gravity}g'`. If a `ValueError` is raised, catch it and return `'invalid gravity'`.",
    starter: `class IntegerRange:
    # Write your descriptor class here
    pass

class Planet:
    gravity = IntegerRange(1, 100)
    def __init__(self, name, gravity):
        self.name = name
        self.gravity = gravity

def test_descriptor(name, gravity):
    # Instantiate Planet and return result
    return ""`,
    functionName: "test_descriptor",
    testCases: [
      { label: "Mars 38g -> Mars is at 38g", args: ["Mars", 38], expected: "Mars is at 38g" },
      { label: "Jupiter 150g -> invalid gravity", args: ["Jupiter", 150], expected: "invalid gravity" },
      { label: "Pluto 0g -> invalid gravity", args: ["Pluto", 0], expected: "invalid gravity" },
      { label: "Earth string input -> invalid gravity", args: ["Earth", "normal"], expected: "invalid gravity" }
    ]
  },
  "js-basics-formatter": {
    slug: "js-basics-formatter",
    name: "Velocity Formatter",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Use arrow functions and template literals to format speed.",
    instructions: "Write an arrow function `formatVelocity` that takes two parameters: `value` (a number) and `unit` (a string). If `unit` is not provided, it should default to `'km/h'`. The function should return a template literal string in the format: `{value} {unit}`. If `value` is negative, return `'Invalid speed'`.",
    starter: `const formatVelocity = (value, unit = 'km/h') => {
  // Write your code here
  return "";
};`,
    functionName: "formatVelocity",
    testCases: [
      { label: "mph formatting", args: [120, "mph"], expected: "120 mph" },
      { label: "default unit formatting", args: [50], expected: "50 km/h" },
      { label: "negative value check", args: [-10], expected: "Invalid speed" },
      { label: "zero speed formatting", args: [0, "m/s"], expected: "0 m/s" }
    ]
  },
  "js-dom-manipulator": {
    slug: "js-dom-manipulator",
    name: "DOM Node Transformer",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Transform elements using DOM properties and classList.",
    instructions: "Write a function `transformElement(element, newText, classToAdd, classToRemove)` that takes a mock DOM element and updates its properties:\n1. Sets `element.textContent` to `newText`.\n2. Adds `classToAdd` using `element.classList.add(...)`.\n3. Removes `classToRemove` using `element.classList.remove(...)`.\n4. Returns the element.\n\nAlso write a helper function `testDOM(textContent, classes, newText, classToAdd, classToRemove)` that:\n1. Creates a mock element:\n```javascript\nconst element = {\n  textContent,\n  classList: {\n    classes: [...classes],\n    add(c) { if (!this.classes.includes(c)) this.classes.push(c); },\n    remove(c) { this.classes = this.classes.filter(x => x !== c); }\n  }\n};\n```\n2. Calls `transformElement(...)` and returns a plain object: `{ text: element.textContent, classes: element.classList.classes }`.",
    starter: `function transformElement(element, newText, classToAdd, classToRemove) {
  // Write your DOM modifier here
  return element;
}

function testDOM(textContent, classes, newText, classToAdd, classToRemove) {
  // Write your test helper here
  return {};
}`,
    functionName: "testDOM",
    testCases: [
      { label: "change text and remove star class", args: ["hello", ["star"], "sky", "cloud", "star"], expected: { text: "sky", classes: ["cloud"] } },
      { label: "keep fade and add glow class", args: ["old", ["fade"], "new", "glow", "none"], expected: { text: "new", classes: ["fade", "glow"] } },
      { label: "no duplicate add, ignore absent remove", args: ["a", ["x", "y"], "b", "x", "z"], expected: { text: "b", classes: ["x", "y"] } }
    ]
  },
  "js-expert-proxy": {
    slug: "js-expert-proxy",
    name: "Secure Object Proxy",
    level: "Advanced",
    language: "JavaScript",
    xp: 70,
    blurb: "Write a Proxy handler that protects object properties.",
    instructions: "Write a function `createSecureObject(target, allowedKeys)` that returns a `Proxy` wrapping `target` and traps property read and write operations:\n1. `get(target, prop)`: If `prop` is NOT in `allowedKeys`, throw an `Error('Access Denied')`. Otherwise, return `target[prop]`.\n2. `set(target, prop, value)`: If `prop` is NOT in `allowedKeys`, throw an `Error('Write Denied')`. Otherwise, set `target[prop] = value` and return `true`.\n\nAlso write a helper function `test_secure_proxy(propToRead, propToWrite, valToWrite)` that:\n1. Creates a target object `{ name: 'Nebula', type: 'gas' }`.\n2. Wraps it using `createSecureObject` and `allowedKeys = ['name', 'type', 'density']`.\n3. Tries to read `propToRead`. If it throws an error, return `'read error'`.\n4. Tries to write `valToWrite` to `propToWrite`. If it throws an error, return `'write error'`.\n5. Returns the value of `propToWrite` on the proxy.",
    starter: `function createSecureObject(target, allowedKeys) {
  // Write your proxy generator here
  return target;
}

function test_secure_proxy(propToRead, propToWrite, valToWrite) {
  // Write your test helper here
  return null;
}`,
    functionName: "test_secure_proxy",
    testCases: [
      { label: "valid read and write", args: ["name", "density", 95], expected: 95 },
      { label: "invalid read access", args: ["secret", "density", 95], expected: "read error" },
      { label: "invalid write access", args: ["name", "secret", 95], expected: "write error" }
    ]
  },
  "ts-basics-challenge": {
    slug: "ts-basics-challenge",
    name: "TS Basics Challenge",
    level: "Beginner",
    language: "TypeScript",
    xp: 40,
    blurb: "Validate star properties using interfaces.",
    instructions: "Write a function `checkStar(star)` that accepts an object conforming to the interface `Star { name: string; magnitude?: number }`. The function should:\n1. If `name` is empty (length 0), return `'Invalid Star'`.\n2. If `magnitude` is present, return `'Magnitude: '` followed by the magnitude value.\n3. If `magnitude` is missing, return `'Magnitude: unknown'`.",
    starter: `interface Star {
  name: string;
  magnitude?: number;
}

function checkStar(star: Star): string {
  // Write your code here
  return "";
}`,
    functionName: "checkStar",
    testCases: [
      { label: "Vega -> Magnitude: 0.03", args: [{ name: "Vega", magnitude: 0.03 }], expected: "Magnitude: 0.03" },
      { label: "Polaris no magnitude -> unknown", args: [{ name: "Polaris" }], expected: "Magnitude: unknown" },
      { label: "Empty name -> Invalid Star", args: [{ name: "", magnitude: 1.5 }], expected: "Invalid Star" }
    ]
  },
  "ts-unions-enums-challenge": {
    slug: "ts-unions-enums-challenge",
    name: "TS Unions & Enums Challenge",
    level: "Intermediate",
    language: "TypeScript",
    xp: 50,
    blurb: "Narrow a union of flight speed values.",
    instructions: "Write a function `parseSpeed(speed)` that takes a union type parameter `speed: string | number`. The function should:\n1. If `speed` is a number, return it directly.\n2. If `speed` is a string, parse it using `parseFloat()`. If the parsed value is not a number (`isNaN`) or is negative, return `-1`.\n3. Otherwise, return the parsed number.",
    starter: `function parseSpeed(speed: string | number): number {
  // Write your code here
  return -1;
}`,
    functionName: "parseSpeed",
    testCases: [
      { label: "number 120 -> 120", args: [120], expected: 120 },
      { label: "string '85.5mph' -> 85.5", args: ["85.5mph"], expected: 85.5 },
      { label: "invalid string 'fast' -> -1", args: ["fast"], expected: -1 },
      { label: "negative number -50 -> -1", args: [-50], expected: -1 }
    ]
  },
  "ts-advanced-challenge": {
    slug: "ts-advanced-challenge",
    name: "TS Advanced Challenge",
    level: "Advanced",
    language: "TypeScript",
    xp: 60,
    blurb: "Implement a generic Box container.",
    instructions: "Define a generic interface `Container<T>` that specifies a method `getValue(): T`.\n\nImplement a class `Box<T>` that implements `Container<T>`. The class constructor should accept a value of type `T` and store it privately. Implement `getValue()` to return the stored value.\n\nFinally, write a function `createBoxAndRetrieve(val)` that instantiates the `Box<T>` with the given value, and returns the result of calling `getValue()`.",
    starter: `interface Container<T> {
  getValue(): T;
}

class Box<T> implements Container<T> {
  // Write your class here
}

function createBoxAndRetrieve<T>(val: T): T {
  // Write your helper here
  return val;
}`,
    functionName: "createBoxAndRetrieve",
    testCases: [
      { label: "string value -> 'nebula'", args: ["nebula"], expected: "nebula" },
      { label: "number value -> 42", args: [42], expected: 42 },
      { label: "object value -> { x: 10 }", args: [{ x: 10 }], expected: { x: 10 } }
    ]
  },
  "ts-expert-challenge": {
    slug: "ts-expert-challenge",
    name: "TS Expert Challenge",
    level: "Advanced",
    language: "TypeScript",
    xp: 70,
    blurb: "Write a mapped type query parser.",
    instructions: "Define a mapped type `StringifyProperties<T>` which maps all properties of type `T` to be of type `string`.\n\nWrite a function `stringifyConfig(config)` that takes an object, converts all of its property values to strings using `String()`, and returns the transformed object conforming to `StringifyProperties<T>`. Ensure you iterate through all owned keys of the input object.",
    starter: `type StringifyProperties<T> = {
  [K in keyof T]: string;
};

function stringifyConfig<T extends object>(config: T): StringifyProperties<T> {
  // Write your code here
  return {} as any;
}`,
    functionName: "stringifyConfig",
    testCases: [
      { label: "{ port: 80 } -> { port: '80' }", args: [{ port: 80 }], expected: { port: "80" } },
      { label: "{ debug: true, val: 0 } -> { debug: 'true', val: '0' }", args: [{ debug: true, val: 0 }], expected: { debug: "true", val: "0" } },
      { label: "{} -> {}", args: [{}], expected: {} }
    ]
  }

};

/**
 * Section challenges: each RUNNABLE module maps to one difficulty-matched coding
 * challenge (a key in `challenges` above). The /journey map surfaces this as a
 * "Section challenge" node after the module's lessons (unlocked once the module is
 * complete) and LessonView shows a CTA on the module's last lesson. The challenge
 * level is matched to the module tier (beginner -> Beginner, intermediate ->
 * Intermediate, advanced/expert -> Advanced).
 *
 * Read + quiz modules (all C#, and the Python read + quiz expert modules) are
 * intentionally absent - they keep using their lesson quizzes, no code challenge.
 *
 * Keyed by the module name (Lesson.module). Add an entry when a new per-module
 * challenge is authored; modules without an entry simply show no section challenge.
 */
export const moduleChallenges: Record<string, string> = {
  // Python
  "Python Basics": "py-basics-density",
  "Conditionals and logic": "py-conditionals-altitude",
  "Loops and iteration": "rain-counter",
  "Functions": "py-functions-average",
  "Collections": "dict-diver",
  "Comprehensions and data tools": "py-comprehension-sorter",
  "Python Intermediate": "py-intermediate-oop",
  "Python Advanced": "py-advanced-decorator",
  "Python Expert": "py-expert-descriptor",
  // JavaScript
  "JS Basics": "js-basics-formatter",
  "JS Conditionals & Logic": "js-sky-classifier",
  "JS Collections & Loops": "js-loops-challenge",
  "JS Collections Depth": "js-array-transformer",
  "JS Advanced Logic": "js-reducer",
  "JS Web APIs": "js-dom-manipulator",
  "JS Expert": "js-expert-proxy",
  // TypeScript
  "TS Basics": "ts-basics-challenge",
  "TS Unions & Enums": "ts-unions-enums-challenge",
  "TS Advanced": "ts-advanced-challenge",
  "TS Expert": "ts-expert-challenge",
};

/** The section challenge for a module, or null if none is mapped/authored yet. */
export function getModuleChallenge(moduleName: string): Challenge | null {
  const slug = moduleChallenges[moduleName];
  if (!slug) return null;
  return challenges[slug] ?? null;
}
