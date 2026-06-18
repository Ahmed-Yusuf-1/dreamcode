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
  language: "Python" | "JavaScript";
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
];

export interface ReviewCard {
  id: string;
  concept: string;
  prompt: string;
  answer: string;
  code?: string;
  language?: "python" | "javascript";
  due: string;
}

export const reviewCards: ReviewCard[] = [
  { id: "r1", concept: "Loops", prompt: "How many times does this loop run?", code: "for cloud in range(3):\n    print(\"hop!\")", language: "python", answer: "3 times - range(3) counts 0, 1, 2.", due: "due now" },
  { id: "r2", concept: "Variables", prompt: "What does sky hold after both lines run?", code: 'sky = "grey"\nsky = "gold"', language: "python", answer: '"gold" - a variable keeps only the latest thing you put in it.', due: "due now" },
  { id: "r3", concept: "Strings", prompt: 'What does "sun" + "set" make?', answer: '"sunset" - the + sign glues strings together.', due: "due now" },
  { id: "r4", concept: "Loops", prompt: "What is the first number range(5) gives you?", answer: "0 - ranges start counting at zero, not one.", due: "due today" },
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
  language: "JavaScript" | "Python";
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
  }
};
