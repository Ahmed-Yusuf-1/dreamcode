/**
 * Content types for the curriculum. Everything a learner studies (lessons,
 * practice drills, graded challenges, projects, badges) is typed data under
 * src/content, grouped by track. Pages read it through src/lib/curriculum.ts and
 * src/lib/data.ts (server side) or through the lightweight catalog (client side).
 *
 * Text fields documented as "supports **bold**" use a tiny inline syntax rendered
 * by the lesson view. Inline `code` in backticks is also rendered as code.
 */

export type TrackId = "python" | "javascript" | "typescript" | "csharp";
export type Tier = "beginner" | "intermediate" | "advanced" | "expert";

export interface ReadsBullet {
  /** accent dot colour */
  dot: string;
  text: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  /** index into options of the correct answer */
  answer: number;
  explain: string;
}

/**
 * A "Your turn" exercise inside a runnable lesson. After Run, the output and the
 * code are checked; passing marks the task done in the lesson view.
 */
export interface LessonTask {
  /** What to do (supports **bold** and `code`). */
  prompt: string;
  /** Lines that must appear in the output, in this order (compared after trimming). */
  expectOutput?: string[];
  /** When true, the output must be exactly expectOutput, with no other lines. */
  exact?: boolean;
  /** Regular expression sources the code must match, e.g. "\\bfor\\b". */
  mustInclude?: string[];
  /** Shown when the check fails. */
  hint?: string;
  /**
   * One working answer. The lesson offers it after a few attempts, and the
   * content tests run it to prove the task can be passed.
   */
  solution?: string;
}

/** A collapsible "Go deeper" section inside a lesson. */
export interface LessonSection {
  title: string;
  /** Paragraphs separated by blank lines; supports lists, **bold** and `code`. */
  body: string;
  /** Optional code shown under the text (same language as the lesson). */
  code?: string;
}

export interface Lesson {
  slug: string;
  /** Position within the track, starting at 1. */
  order: number;
  /** e.g. "Python Basics - Chapter 1" (legacy label; modules drive grouping) */
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
  /** defaults to "python" when omitted */
  language?: TrackId;
  module?: string;
  tier?: Tier;
  /** false for read + quiz lessons without a client-side runner (e.g. C#) */
  runnable?: boolean;
  /** quiz questions for read + quiz lessons */
  quiz?: QuizQuestion[];
  /** optional "Your turn" exercise checked after Run */
  task?: LessonTask;
  /** Pitfalls learners hit with this idea (supports **bold** and `code`). */
  mistakes?: string[];
  /** Optional deeper sections, collapsed by default. */
  deeper?: LessonSection[];
  /** default text for the Input box, one line per input() call (Python) */
  stdin?: string;
  /**
   * Pyodide packages this lesson needs (for example numpy, pandas). They are
   * fetched once, on the first run, and cached by the browser.
   */
  packages?: string[];
  /**
   * JavaScript lessons with HTML run in a live page preview (a sandboxed
   * iframe) instead of the console-only worker, so the code can use the DOM.
   */
  html?: string;
}

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
  /** Pyodide packages the predict step needs when the learner runs it. */
  packages?: string[];
}

export interface ChallengeTestCase {
  label: string;
  args: unknown[];
  expected: unknown;
}

export type ChallengeLanguage = "Python" | "JavaScript" | "TypeScript";
export type ChallengeLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Challenge {
  slug: string;
  name: string;
  level: ChallengeLevel;
  language: ChallengeLanguage;
  xp: number;
  badge?: string;
  blurb: string;
  instructions: string;
  starter: string;
  functionName: string;
  testCases: ChallengeTestCase[];
  /**
   * Lesson slug that unlocks this challenge as a Problem Peak. Section challenges
   * unlock when their whole module is complete instead (see moduleChallenges).
   */
  requires?: string;
  /** Short nudges, revealed one at a time. Never the full answer. */
  hints?: string[];
  /** Pyodide packages this challenge needs (numpy, pandas). Python only. */
  packages?: string[];
}

export type ProjectTier = "Guided" | "Independent" | "Capstone";

export interface Project {
  id: string;
  tier: ProjectTier;
  title: string;
  desc: string;
  xp: number;
  language: ChallengeLanguage;
  instructions: string;
  starter: string;
  functionName: string;
  testCases: ChallengeTestCase[];
  /** Activity keys (lesson slugs or project ids) that must be complete first. */
  requires?: string[];
  /** Pyodide packages this project needs (numpy, pandas). Python only. */
  packages?: string[];
  /** Ordered build steps shown beside the brief. */
  steps?: string[];
  /** Hints revealed one at a time. */
  hints?: string[];
}

export type BadgeIcon =
  | "loop"
  | "bug"
  | "peak"
  | "flame"
  | "blocks"
  | "moon"
  | "list"
  | "key"
  | "function"
  | "flask"
  | "star"
  | "sunrise"
  | "bolt"
  | "target"
  | "calendar"
  | "crown"
  | "snake"
  | "braces"
  | "shield"
  | "hash"
  | "globe"
  | "trophy"
  | "compass";

/** How hard a badge is to earn. Drives its look, its XP bonus and its sort. */
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

/** Where a rule's required activity keys come from. */
export type BadgeKeySource =
  | { of: "keys"; keys: string[] }
  /** Every lesson in a track, optionally only the ones of one tier. */
  | { of: "trackLessons"; track: TrackId; tier?: Tier }
  /** Every section challenge and standalone peak in a track. */
  | { of: "trackChallenges"; track: TrackId }
  /** Every lesson and every challenge in a track: the whole road. */
  | { of: "trackAll"; track: TrackId };

export type BadgeCountScope = "lesson" | "practice" | "challenge" | "project" | "review";

/**
 * What a badge asks for. Every condition present must hold, so a badge can ask
 * for a set of activities AND a count AND a streak. The same shape is evaluated
 * on the client (src/lib/badges.ts) and in Postgres (badge_rules), so a guest
 * and an account earn exactly the same badges.
 */
export interface BadgeRule {
  /** A set of activities: "any" for a topic badge, "all" for mastery. */
  keys?: { mode: "any" | "all"; source: BadgeKeySource };
  /** How many activities of a kind are complete. */
  count?: { of: BadgeCountScope; n: number; track?: TrackId; tier?: Tier };
  /** Consecutive active days. */
  streak?: number;
  /** Local hour window a lesson was finished in (inclusive). */
  hour?: { from: number; to: number };
  /** Activities finished in one local day. */
  dayCount?: number;
  /** XP earned on all seven days of one week. */
  perfectWeek?: true;
  /** Projects finished in this many different languages. */
  tracksWithProject?: number;
  /** Came back and finished something after this many days away. */
  comebackDays?: number;
  /** Earned from a graded submission rather than a completion. */
  submission?: "failed" | "fail-then-pass" | "first-try";
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: BadgeIcon;
  /** Accent hex (6-digit, so `${accent}77` alpha suffixes stay valid). */
  accent: string;
  rarity: BadgeRarity;
  /** What unlocks it. */
  rule: BadgeRule;
  /** Hidden until earned: the wall shows a locked disc and no name. */
  secret?: boolean;
}
