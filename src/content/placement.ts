import type { TrackId } from "@/content/types";

/**
 * Placement questions, ordered from the start of each track to the end. Each
 * question checks the idea taught by `lesson`. The placement check walks the
 * list, stops after two misses in a row, and recommends the first lesson whose
 * question was missed.
 *
 * When `code` is present and `checksOutput` is true, the correct option is the
 * exact output of running the code; the content tests verify this.
 */
export interface PlacementQuestion {
  lesson: string;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  checksOutput?: boolean;
}

export const placementBanks: Record<TrackId, PlacementQuestion[]> = {
  python: [
    { lesson: "variables", prompt: "What does this print?", code: "x = 5\nx = x + 2\nprint(x)", options: ["5", "7", "x + 2"], answer: 1, checksOutput: true },
    { lesson: "strings", prompt: "What does this print?", code: 'print("ab" * 2 + "c")', options: ["abc", "ababc", "ab2c"], answer: 1, checksOutput: true },
    { lesson: "if-else", prompt: "What does this print?", code: 'n = 7\nif n > 5:\n    print("big")\nelse:\n    print("small")', options: ["big", "small", "big\nsmall"], answer: 0, checksOutput: true },
    { lesson: "loops", prompt: "What does this print?", code: "total = 0\nfor i in range(4):\n    total += i\nprint(total)", options: ["4", "6", "10"], answer: 1, checksOutput: true },
    { lesson: "return-values", prompt: "What does this print?", code: "def area(w, h=2):\n    return w * h\n\nprint(area(3))", options: ["3", "5", "6"], answer: 2, checksOutput: true },
    { lesson: "dictionaries", prompt: "What does this print?", code: 'd = {"a": 1}\nd["b"] = 2\nprint(len(d))', options: ["1", "2", "3"], answer: 1, checksOutput: true },
    { lesson: "py-list-comprehensions", prompt: "What does this print?", code: "print([x * x for x in range(5) if x % 2 == 0])", options: ["[0, 4, 16]", "[1, 9]", "[0, 1, 4, 9, 16]"], answer: 0, checksOutput: true },
    { lesson: "py-exceptions", prompt: "What does this print?", code: 'try:\n    int("sky")\nexcept ValueError:\n    print("bad number")\nfinally:\n    print("done")', options: ["done", "bad number\ndone", "ValueError"], answer: 1, checksOutput: true },
    { lesson: "py-oop", prompt: "What does this print?", code: 'class Cloud:\n    def __init__(self, size):\n        self.size = size\n\n    def grow(self):\n        self.size += 1\n        return self.size\n\nc = Cloud(3)\nc.grow()\nprint(c.grow())', options: ["3", "4", "5"], answer: 2, checksOutput: true },
    { lesson: "py-generators", prompt: "What does this print?", code: "def count_up(n):\n    for i in range(n):\n        yield i * 10\n\nprint(list(count_up(3)))", options: ["[0, 10, 20]", "[10, 20, 30]", "<generator object>"], answer: 0, checksOutput: true },
    { lesson: "py-decorators", prompt: "What does a decorator written as @log above def f() do?", options: ["It replaces f with whatever log(f) returns", "It runs f once at import time", "It renames f to log"], answer: 0 },
    { lesson: "py-context-managers", prompt: "What does this print?", code: 'class Door:\n    def __enter__(self):\n        print("open")\n        return self\n\n    def __exit__(self, *args):\n        print("close")\n\nwith Door():\n    print("inside")', options: ["open\ninside\nclose", "inside", "open\nclose\ninside"], answer: 0, checksOutput: true },
    { lesson: "py-big-o", prompt: "On average, how does looking up a key in a dictionary grow as the dictionary gets bigger?", options: ["O(1): about the same time at any size", "O(n): twice the keys, twice the time", "O(n log n): a little worse than linear"], answer: 0 },
    { lesson: "py-recursion", prompt: "What does this print?", code: "def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)\n\nprint(total(4))", options: ["4", "10", "24"], answer: 1, checksOutput: true },
    { lesson: "py-memoization", prompt: "What does this print?", code: "from functools import lru_cache\n\ncalls = 0\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    global calls\n    calls += 1\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nfib(10)\nprint(calls)", options: ["11", "177", "10"], answer: 0, checksOutput: true },
    { lesson: "py-descriptors", prompt: "What is a class attribute whose object defines __get__ and __set__ called?", options: ["A data descriptor", "A metaclass", "A decorator"], answer: 0 },
  ],
  javascript: [
    { lesson: "js-variables", prompt: "What does this print?", code: "let a = 2;\na += 3;\nconsole.log(a);", options: ["2", "5", "23"], answer: 1, checksOutput: true },
    { lesson: "js-functions", prompt: "What does this print?", code: "const double = (n) => n * 2;\nconsole.log(double(4));", options: ["8", "undefined", "n * 2"], answer: 0, checksOutput: true },
    { lesson: "js-comparisons", prompt: "What does this print?", code: 'console.log(5 == "5", 5 === "5");', options: ["true true", "true false", "false false"], answer: 1, checksOutput: true },
    { lesson: "js-loops", prompt: "What does this print?", code: "let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);", options: ["3", "6", "123"], answer: 1, checksOutput: true },
    { lesson: "js-objects", prompt: "What does this print?", code: 'const cloud = { name: "Nimbus", height: 900 };\ncloud.height = 1200;\nconsole.log(cloud.height);', options: ["900", "1200", "undefined"], answer: 1, checksOutput: true },
    { lesson: "js-array-methods", prompt: "What does this print?", code: "const nums = [1, 2, 3, 4];\nconsole.log(nums.filter((n) => n % 2 === 0).map((n) => n * 10));", options: ["[ 20, 40 ]", "[ 10, 30 ]", "[ 10, 20, 30, 40 ]"], answer: 0, checksOutput: true },
    { lesson: "js-destructuring", prompt: "What does this print?", code: "const { a, ...rest } = { a: 1, b: 2, c: 3 };\nconsole.log(rest);", options: ["{ b: 2, c: 3 }", "{ a: 1 }", "[ 2, 3 ]"], answer: 0, checksOutput: true },
    { lesson: "js-closures", prompt: "What does this print?", code: "function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = counter();\nnext();\nconsole.log(next());", options: ["0", "1", "2"], answer: 2, checksOutput: true },
    { lesson: "js-array-reduce", prompt: "What does this print?", code: "console.log([3, 4, 5].reduce((sum, n) => sum + n, 10));", options: ["12", "22", "345"], answer: 1, checksOutput: true },
    { lesson: "js-classes", prompt: "What does this print?", code: 'class Star {\n  constructor(name) {\n    this.name = name;\n  }\n  shine() {\n    return `${this.name} shines`;\n  }\n}\nconsole.log(new Star("Vega").shine());', options: ["Vega shines", "undefined shines", "Star shines"], answer: 0, checksOutput: true },
    { lesson: "js-async-await", prompt: "What does this print?", code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");', options: ["A\nB\nC\nD", "A\nD\nC\nB", "A\nD\nB\nC"], answer: 1, checksOutput: true },
    { lesson: "js-dom-basics", prompt: "Which call finds the first element on the page that matches a CSS selector?", options: ['document.querySelector(".star")', 'document.find(".star")', 'document.getElement(".star")'], answer: 0 },
    { lesson: "js-recursion", prompt: "What does this print?", code: 'function countdown(n) {\n  if (n === 0) return "liftoff";\n  return n + " " + countdown(n - 1);\n}\nconsole.log(countdown(3));', options: ["3 2 1 liftoff", "liftoff", "1 2 3 liftoff"], answer: 0, checksOutput: true },
    { lesson: "js-hash-patterns", prompt: "What does this print?", code: "const seen = new Set();\nconst dupes = [];\nfor (const n of [3, 1, 3, 2, 1]) {\n  if (seen.has(n)) dupes.push(n);\n  seen.add(n);\n}\nconsole.log(dupes);", options: ["[ 3, 1 ]", "[ 1, 3 ]", "[ 3, 1, 2 ]"], answer: 0, checksOutput: true },
    { lesson: "js-generators", prompt: "What does this print?", code: "function* ids() {\n  let id = 1;\n  while (true) yield id++;\n}\nconst gen = ids();\ngen.next();\nconsole.log(gen.next().value);", options: ["1", "2", "undefined"], answer: 1, checksOutput: true },
    { lesson: "js-metaprogramming", prompt: "What does the get trap of a Proxy intercept?", options: ["Every read of a property on the proxy", "The moment the object is created", "Garbage collection of the object"], answer: 0 },
  ],
  typescript: [
    { lesson: "ts-types", prompt: "Which line is a type error?", options: ["let stars: number = 100;", 'let stars: number = "many";', "let name: string = 'Vega';"], answer: 1 },
    { lesson: "ts-functions", prompt: "What is the return type of this function?", code: "function add(a: number, b: number) {\n  return a + b;\n}", options: ["number", "any", "void"], answer: 0 },
    { lesson: "ts-interfaces", prompt: "What does the ? in `mag?: number` mean?", options: ["The property is optional", "The property can be any type", "The property is read-only"], answer: 0 },
    { lesson: "ts-unions-narrowing", prompt: "Inside `if (typeof x === \"string\")`, what type does TypeScript give x when x is string | number?", options: ["string", "number", "string | number"], answer: 0 },
    { lesson: "ts-discriminated-unions", prompt: "In `switch (shape.kind)`, what lets TypeScript narrow `shape` inside each case?", options: ["Every member of the union has a literal kind property", "The switch has a default branch", "Each case uses an as cast"], answer: 0 },
    { lesson: "ts-literals-enums", prompt: "Which value fits the type `\"north\" | \"south\"`?", options: ['"north"', '"east"', "0"], answer: 0 },
    { lesson: "ts-generics", prompt: "What does this print?", code: "function first<T>(items: T[]): T {\n  return items[0];\n}\nconsole.log(first([7, 8, 9]));", options: ["7", "[ 7 ]", "T"], answer: 0, checksOutput: true },
    { lesson: "ts-utility-types", prompt: "What does Partial<User> do?", options: ["Makes every property of User optional", "Removes every property", "Makes every property read-only"], answer: 0 },
    { lesson: "ts-conditional-types", prompt: "What is `IsString<42>` if `type IsString<T> = T extends string ? \"yes\" : \"no\"`?", options: ['"no"', '"yes"', "never"], answer: 0 },
    { lesson: "ts-infer", prompt: "What is `ElementOf<string[]>` if `type ElementOf<T> = T extends (infer E)[] ? E : never`?", options: ["string", "string[]", "never"], answer: 0 },
    { lesson: "ts-mapped-types", prompt: "What does `{ [K in keyof T]: boolean }` produce?", options: ["T with every property typed as boolean", "An array of T's keys", "A union of T's values"], answer: 0 },
  ],
  csharp: [
    { lesson: "cs-hello", prompt: "Which line prints text to the console in C#?", options: ['Console.WriteLine("Hi");', 'print("Hi")', 'console.log("Hi");'], answer: 0 },
    { lesson: "cs-variables", prompt: "Which declaration stores a whole number?", options: ["int count = 3;", "number count = 3;", "count := 3"], answer: 0 },
    { lesson: "cs-conditionals", prompt: "What prints if score is 72?", code: 'if (score >= 90) Console.WriteLine("A");\nelse if (score >= 70) Console.WriteLine("C");\nelse Console.WriteLine("F");', options: ["A", "C", "F"], answer: 1 },
    { lesson: "cs-loops", prompt: "How many times does this loop body run?", code: "for (int i = 0; i < 5; i++) { }", options: ["4", "5", "6"], answer: 1 },
    { lesson: "cs-lists", prompt: "Which property tells you how many items a List<T> holds?", options: ["Count", "Length", "Size"], answer: 0 },
    { lesson: "cs-classes", prompt: "What does the new keyword do in `var c = new Cloud();`?", options: ["Creates an object from the Cloud class", "Declares a new class", "Imports Cloud"], answer: 0 },
    { lesson: "cs-linq", prompt: "What does `nums.Where(n => n > 2)` return for nums = {1, 2, 3, 4}?", options: ["3 and 4", "1 and 2", "true"], answer: 0 },
    { lesson: "cs-interfaces", prompt: "What can a class do with an interface?", options: ["Implement it, promising its members exist", "Inherit fields and code from it", "Instantiate it with new"], answer: 0 },
    { lesson: "cs-async-await", prompt: "What does await do inside an async method?", options: ["Pauses the method until the task finishes, without blocking the thread", "Blocks the thread until the task finishes", "Runs the task on a new process"], answer: 0 },
  ],
};
