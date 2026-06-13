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

// Correct order is the array order; presented shuffled.
export const parsonsLoops: { prompt: string; fragments: ParsonsFragment[] } = {
  prompt: "Arrange the lines so the program greets every cloud in the sky.",
  fragments: [
    { id: "p1", text: 'sky = ["cumulus", "cirrus", "stratus"]', indent: 0 },
    { id: "p2", text: "for cloud in sky:", indent: 0 },
    { id: "p3", text: 'print("hello,", cloud)', indent: 1 },
  ],
};

export const fadedLoops = {
  prompt: "Fill the blanks so the loop hops exactly 4 times.",
  lines: [
    { text: "___ hop in range(___):", blanks: ["for", "4"] },
    { text: '    print("hop", hop)', blanks: [] },
  ],
  explain: "for starts the loop and range(4) counts 0, 1, 2, 3 - four hops.",
};

export const predictLoops = {
  code: 'sky = ["wispy", "puffy"]\nfor cloud in sky:\n    print(cloud)',
  question: "What does this program print?",
  options: [
    { id: "a", label: "wispy then puffy, each on its own line", correct: true, why: "The loop visits each item in order and prints it." },
    { id: "b", label: "sky printed twice", correct: false, why: "cloud takes the *items* of sky, not the word sky." },
    { id: "c", label: "wispy puffy on one line", correct: false, why: "Each print() call starts a new line." },
  ],
};
