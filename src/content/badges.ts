import type { Badge, TrackId } from "@/content/types";

/**
 * Every badge, with the exact rule that unlocks it. The rule is data, not code:
 * the client evaluates it in src/lib/badges.ts and Postgres evaluates the same
 * shape in badge_rules, so a guest and an account earn a badge at the same
 * moment. Ids never change once shipped: they are what a learner owns.
 *
 * Rarity is a promise about how hard a badge is, so it has to stay honest:
 *   common     the first hour or two
 *   rare       a week of real work, or a habit
 *   epic       a chapter of a track, a month of days, a shelf of projects
 *   legendary  a whole track, or a year-shaped habit. Most learners never see one.
 */

const TRACK_LOOK: Record<TrackId, { label: string; icon: Badge["icon"]; accent: string }> = {
  python: { label: "Python", icon: "snake", accent: "#5ad6a0" },
  javascript: { label: "JavaScript", icon: "braces", accent: "#ffd45e" },
  typescript: { label: "TypeScript", icon: "shield", accent: "#6ea8ff" },
  csharp: { label: "C#", icon: "hash", accent: "#b98cff" },
};

/** Lessons deep enough into a track to call someone an adept, per track size. */
const ADEPT_LESSONS: Record<TrackId, number> = { python: 30, javascript: 20, typescript: 12, csharp: 10 };

/** The three badges every track carries: a start, a middle and the whole road. */
function trackBadges(track: TrackId): Badge[] {
  const { label, icon, accent } = TRACK_LOOK[track];
  const runnable = track !== "csharp";
  return [
    {
      id: `${track}-initiate`,
      name: `${label} Initiate`,
      desc: `Finish five ${label} lessons`,
      icon,
      accent,
      rarity: "rare",
      rule: { count: { of: "lesson", n: 5, track } },
    },
    {
      id: `${track}-adept`,
      name: `${label} Adept`,
      desc: `Finish ${ADEPT_LESSONS[track]} ${label} lessons`,
      icon,
      accent,
      rarity: "epic",
      rule: { count: { of: "lesson", n: ADEPT_LESSONS[track], track } },
    },
    {
      id: `${track}-master`,
      name: `${label} Master`,
      desc: runnable
        ? `Finish every ${label} lesson and section challenge, and build a ${label} project`
        : `Finish every ${label} lesson and quiz`,
      icon,
      accent,
      rarity: "legendary",
      rule: {
        keys: { mode: "all", source: { of: "trackAll", track } },
        ...(runnable ? { count: { of: "project" as const, n: 1, track } } : {}),
      },
    },
  ];
}

export const badges: Badge[] = [
  /* ----------------------------------------------------------- common */
  {
    id: "first-light",
    name: "First Light",
    desc: "Finish your first lesson",
    icon: "star",
    accent: "#ffd45e",
    rarity: "common",
    rule: { count: { of: "lesson", n: 1 } },
  },
  {
    id: "first-loop",
    name: "First Loop",
    desc: "Finish a lesson about loops",
    icon: "loop",
    accent: "#38e1ff",
    rarity: "common",
    rule: {
      keys: {
        mode: "any",
        source: { of: "keys", keys: ["loops", "for-over-range", "for-over-collections", "while-loops", "loop-patterns", "js-loops", "js-while-loops", "cs-loops"] },
      },
    },
  },
  {
    id: "list-wrangler",
    name: "List Wrangler",
    desc: "Finish a lesson about lists or arrays",
    icon: "list",
    accent: "#43e6c9",
    rarity: "common",
    rule: {
      keys: {
        mode: "any",
        source: { of: "keys", keys: ["lists", "list-methods", "js-arrays", "js-array-methods", "ts-arrays-tuples", "cs-arrays", "cs-lists"] },
      },
    },
  },
  {
    id: "dict-diver",
    name: "Dict Diver",
    desc: "Finish a lesson about dictionaries, objects or maps",
    icon: "key",
    accent: "#ffd45e",
    rarity: "common",
    rule: {
      keys: {
        mode: "any",
        source: { of: "keys", keys: ["dictionaries", "dict-methods", "js-objects", "js-object-methods", "js-map-set", "ts-object-types"] },
      },
    },
  },
  {
    id: "function-forger",
    name: "Function Forger",
    desc: "Finish a lesson about functions",
    icon: "function",
    accent: "#ff7ad9",
    rarity: "common",
    rule: {
      keys: {
        mode: "any",
        source: { of: "keys", keys: ["functions", "parameters-arguments", "return-values", "js-functions", "ts-functions", "cs-classes"] },
      },
    },
  },
  {
    id: "drill-sergeant",
    name: "Drill Runner",
    desc: "Finish five practice drills",
    icon: "target",
    accent: "#7cff9b",
    rarity: "common",
    rule: { count: { of: "practice", n: 5 } },
  },
  {
    id: "test-tamer",
    name: "Test Tamer",
    desc: "Run the tests before you are sure, and read what they say",
    icon: "flask",
    accent: "#ff6b7d",
    rarity: "common",
    rule: { submission: "failed" },
  },
  {
    id: "cloud-hopper",
    name: "Cloud Hopper",
    desc: "Pass every test on a Problem Peak",
    icon: "peak",
    accent: "#6ea8ff",
    rarity: "common",
    rule: { count: { of: "challenge", n: 1 } },
  },

  /* ------------------------------------------------------------- rare */
  {
    id: "bug-catcher",
    name: "Bug Catcher",
    desc: "Pass the tests after an attempt that failed",
    icon: "bug",
    accent: "#7cff9b",
    rarity: "rare",
    rule: { submission: "fail-then-pass" },
  },
  {
    id: "clean-landing",
    name: "Clean Landing",
    desc: "Pass a Problem Peak on your first run, with nothing to fix",
    icon: "target",
    accent: "#a9ecc9",
    rarity: "rare",
    secret: true,
    rule: { submission: "first-try" },
  },
  {
    id: "sky-builder",
    name: "Sky Builder",
    desc: "Finish a project",
    icon: "blocks",
    accent: "#b98cff",
    rarity: "rare",
    rule: { count: { of: "project", n: 1 } },
  },
  {
    id: "streak-keeper",
    name: "Streak Keeper",
    desc: "Write code seven days in a row",
    icon: "flame",
    accent: "#ff9f45",
    rarity: "rare",
    rule: { streak: 7 },
  },
  {
    id: "night-owl",
    name: "Night Owl",
    desc: "Finish a lesson between midnight and 5 a.m.",
    icon: "moon",
    accent: "#7c8cff",
    rarity: "rare",
    secret: true,
    rule: { hour: { from: 0, to: 4 } },
  },
  {
    id: "early-bird",
    name: "Early Bird",
    desc: "Finish a lesson between 5 a.m. and 7 a.m.",
    icon: "sunrise",
    accent: "#ffb36b",
    rarity: "rare",
    secret: true,
    rule: { hour: { from: 5, to: 6 } },
  },
  {
    id: "return-flight",
    name: "Return Flight",
    desc: "Come back after a week away and finish something anyway",
    icon: "compass",
    accent: "#8de8ff",
    rarity: "rare",
    rule: { comebackDays: 7 },
  },
  {
    id: "marathon-mind",
    name: "Marathon Mind",
    desc: "Finish five activities in one day",
    icon: "bolt",
    accent: "#ffe49a",
    rarity: "rare",
    rule: { dayCount: 5 },
  },
  ...trackBadges("python").filter((b) => b.rarity === "rare"),
  ...trackBadges("javascript").filter((b) => b.rarity === "rare"),
  ...trackBadges("typescript").filter((b) => b.rarity === "rare"),
  ...trackBadges("csharp").filter((b) => b.rarity === "rare"),

  /* ------------------------------------------------------------- epic */
  {
    id: "perfect-week",
    name: "Perfect Week",
    desc: "Earn XP on all seven days of one week",
    icon: "calendar",
    accent: "#ff8ac4",
    rarity: "epic",
    rule: { perfectWeek: true },
  },
  {
    id: "summit-chain",
    name: "Summit Chain",
    desc: "Clear ten Problem Peaks",
    icon: "peak",
    accent: "#8de8ff",
    rarity: "epic",
    rule: { count: { of: "challenge", n: 10 } },
  },
  {
    id: "thirty-nights",
    name: "Thirty Nights",
    desc: "Write code thirty days in a row",
    icon: "flame",
    accent: "#ff6f4d",
    rarity: "epic",
    rule: { streak: 30 },
  },
  {
    id: "scholar",
    name: "Scholar",
    desc: "Finish fifty lessons",
    icon: "compass",
    accent: "#9ad1ff",
    rarity: "epic",
    rule: { count: { of: "lesson", n: 50 } },
  },
  {
    id: "sky-architect",
    name: "Sky Architect",
    desc: "Finish five projects",
    icon: "blocks",
    accent: "#c9b5ff",
    rarity: "epic",
    rule: { count: { of: "project", n: 5 } },
  },
  ...trackBadges("python").filter((b) => b.rarity === "epic"),
  ...trackBadges("javascript").filter((b) => b.rarity === "epic"),
  ...trackBadges("typescript").filter((b) => b.rarity === "epic"),
  ...trackBadges("csharp").filter((b) => b.rarity === "epic"),

  /* -------------------------------------------------------- legendary */
  {
    id: "polyglot",
    name: "Polyglot",
    desc: "Finish a project in three different languages",
    icon: "globe",
    accent: "#7ef2d0",
    rarity: "legendary",
    rule: { tracksWithProject: 3 },
  },
  {
    id: "centurion",
    name: "Centurion",
    desc: "Write code one hundred days in a row",
    icon: "flame",
    accent: "#ffd86b",
    rarity: "legendary",
    secret: true,
    rule: { streak: 100 },
  },
  {
    id: "dreamweaver",
    name: "Dreamweaver",
    desc: "Finish every project in the catalogue",
    icon: "crown",
    accent: "#ffb6d9",
    rarity: "legendary",
    rule: { count: { of: "project", n: 15 } },
  },
  ...trackBadges("python").filter((b) => b.rarity === "legendary"),
  ...trackBadges("javascript").filter((b) => b.rarity === "legendary"),
  ...trackBadges("typescript").filter((b) => b.rarity === "legendary"),
  ...trackBadges("csharp").filter((b) => b.rarity === "legendary"),
];
