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
}

export const projects: Project[] = [
  { id: "sky-house", tier: "Guided", title: "Sky House", desc: "Build a tiny program of your own - a greeter that remembers names.", xp: 200, state: "current", language: "Python" },
  { id: "cloud-diary", tier: "Guided", title: "Cloud Diary", desc: "A journal that saves a line a day and reads it back.", xp: 220, state: "locked", language: "Python" },
  { id: "star-map", tier: "Independent", title: "Star Map", desc: "Plot constellations from a list of points - your plan, your code.", xp: 320, state: "locked", language: "JavaScript" },
  { id: "weather-window", tier: "Independent", title: "Weather Window", desc: "Pull a forecast and paint it in the console.", xp: 340, state: "locked", language: "Python" },
  { id: "dream-api", tier: "Capstone", title: "Dream API", desc: "A small web service that serves dreams on request. The first real one.", xp: 600, state: "locked", language: "Python" },
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
  }
};

export interface ChallengeTestCase {
  label: string;
  args: any[];
  expected: any;
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
        label: "Sirius & Vega → Sirius first",
        args: [[{ name: "Vega", mag: 0.03 }, { name: "Sirius", mag: -1.46 }]],
        expected: [{ name: "Sirius", mag: -1.46 }, { name: "Vega", mag: 0.03 }]
      },
      {
        label: "No stars → []",
        args: [[]],
        expected: []
      }
    ]
  }
};
