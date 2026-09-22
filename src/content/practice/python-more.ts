import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";


/** Practice drills for the lessons in lessons/python-more.ts. */
export const pythonMorePractice: Record<string, PracticeDataset> = {
  "numbers-math": {
    prompt: "Arrange the lines to work out an average score.",
    parsonsFragments: [
      { id: "nm1", text: "total = 7 + 8 + 9", indent: 0 },
      { id: "nm2", text: "count = 3", indent: 0 },
      { id: "nm3", text: "average = total / count", indent: 0 },
      { id: "nm4", text: "print(average)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: the remainder of 17 divided by 5, then 2 to the power 3.",
    fadedLines: [
      { text: "print(17 ___ 5)", blanks: ["%"] },
      { text: "print(2 ___ 3)", blanks: ["**"] },
    ],
    fadedExplain: "`%` is the remainder operator and `**` raises to a power.",
    predictCode: code`print(7 // 2, 7 % 2, 7 / 2)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3 1 3.5", correct: true, why: "Floor division gives 3, the remainder is 1, and true division gives 3.5." },
      { id: "b", label: "3.5 1 3", correct: false, why: "`//` drops the fraction, so it gives 3, not 3.5." },
      { id: "c", label: "3 1 3", correct: false, why: "`/` always returns a float, so 7 / 2 is 3.5." },
    ],
  },
  "f-strings": {
    prompt: "Arrange the lines to build a sentence with an f-string.",
    parsonsFragments: [
      { id: "fs1", text: 'name = "Luna"', indent: 0 },
      { id: "fs2", text: "age = 9", indent: 0 },
      { id: "fs3", text: 'line = f"{name} is {age}"', indent: 0 },
      { id: "fs4", text: "print(line)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to switch on the braces and show two decimal places.",
    fadedLines: [
      { text: 'print(___"Total: {3 + 4}")', blanks: ["f"] },
      { text: 'print(f"{2.5:___}")', blanks: [".2f"] },
    ],
    fadedExplain: "The `f` prefix turns on the braces, and `:.2f` formats a number with two decimals.",
    predictCode: code`x = 7
print(f"{x} squared is {x * x}")`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "7 squared is 49", correct: true, why: "Both braces are evaluated: x is 7 and x * x is 49." },
      { id: "b", label: "{x} squared is {x * x}", correct: false, why: "With the f prefix, braces are replaced by their values." },
      { id: "c", label: "7 squared is x * x", correct: false, why: "Everything inside braces is evaluated as Python, including `x * x`." },
    ],
  },
  "string-methods": {
    prompt: "Arrange the lines to split a list of names and shout each one.",
    parsonsFragments: [
      { id: "sm1", text: 'line = "vega,rigel,deneb"', indent: 0 },
      { id: "sm2", text: 'names = line.split(",")', indent: 0 },
      { id: "sm3", text: "for name in names:", indent: 0 },
      { id: "sm4", text: "print(name.upper())", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks: trim the spaces, then swap a dash for a plus sign.",
    fadedLines: [
      { text: 'print("  hi  ".___())', blanks: ["strip"] },
      { text: 'print("a-b".___("-", "+"))', blanks: ["replace"] },
    ],
    fadedExplain: "`.strip()` trims both ends and `.replace(old, new)` swaps text.",
    predictCode: code`word = "stardust"
print(word.replace("dust", "light").title())`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Starlight", correct: true, why: "replace gives \"starlight\" and title() capitalizes the first letter." },
      { id: "b", label: "StarLight", correct: false, why: "title() capitalizes the start of each word, and \"starlight\" is one word." },
      { id: "c", label: "stardust", correct: false, why: "replace returns a new string with \"dust\" swapped out." },
    ],
  },
  "type-conversion": {
    prompt: "Arrange the lines to turn text into a number and double it.",
    parsonsFragments: [
      { id: "tc1", text: 'text = "12"', indent: 0 },
      { id: "tc2", text: "number = int(text)", indent: 0 },
      { id: "tc3", text: "doubled = number * 2", indent: 0 },
      { id: "tc4", text: "print(doubled)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to add two numbers written as text, then build a sentence from a number.",
    fadedLines: [
      { text: 'total = ___("4") + ___("6")', blanks: ["int", "int"] },
      { text: 'print(___(10) + " points")', blanks: ["str"] },
    ],
    fadedExplain: "`int()` turns digit text into a number and `str()` turns a number into text.",
    predictCode: code`print(int("7") * 2, "7" * 2)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "14 77", correct: true, why: "The int doubles to 14, while the string repeats to \"77\"." },
      { id: "b", label: "14 14", correct: false, why: "\"7\" * 2 repeats the text; it does not do arithmetic." },
      { id: "c", label: "77 14", correct: false, why: "int(\"7\") is the number 7, so it doubles to 14 first." },
    ],
  },
  "input-output": {
    prompt: "Arrange the lines to ask for a number and add one to it.",
    parsonsFragments: [
      { id: "io1", text: 'raw = input("Pick a number: ")', indent: 0 },
      { id: "io2", text: "n = int(raw)", indent: 0 },
      { id: "io3", text: "print(n + 1)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to read an age as a number.",
    fadedLines: [{ text: 'age = ___(___("Age? "))', blanks: ["int", "input"] }],
    fadedExplain: "`input()` returns text, so wrap it in `int()` to get a number.",
    predictCode: code`answer = "3"
print(answer * 2)
print(int(answer) * 2)`,
    predictQuestion: "What does this program print? (Remember: input() always hands back text like answer here.)",
    predictOptions: [
      { id: "a", label: "33\n6", correct: true, why: "Text times 2 repeats it; the converted number times 2 is 6." },
      { id: "b", label: "6\n6", correct: false, why: "answer is text, so answer * 2 repeats it to \"33\"." },
      { id: "c", label: "33\n33", correct: false, why: "int(answer) is the number 3, which doubles to 6." },
    ],
  },
  "loop-patterns": {
    prompt: "Arrange the lines to count how many words have exactly three letters.",
    parsonsFragments: [
      { id: "lp1", text: 'words = ["sky", "moon", "sun"]', indent: 0 },
      { id: "lp2", text: "count = 0", indent: 0 },
      { id: "lp3", text: "for w in words:", indent: 0 },
      { id: "lp4", text: "if len(w) == 3:", indent: 1 },
      { id: "lp5", text: "count += 1", indent: 2 },
      { id: "lp6", text: "print(count)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to track the highest value.",
    fadedLines: [
      { text: "best = values[___]", blanks: ["0"] },
      { text: "for v in values:", blanks: [] },
      { text: "    if v ___ best:", blanks: [">"] },
      { text: "        best = v", blanks: [] },
    ],
    fadedExplain: "Start the tracker with the first item and replace it whenever something beats it.",
    predictCode: code`words = ["sky", "moon", "star", "sun"]
count = 0
for w in words:
    if len(w) == 3:
        count += 1
print(count)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "Only \"sky\" and \"sun\" have three letters." },
      { id: "b", label: "4", correct: false, why: "The counter only goes up when the length is exactly 3." },
      { id: "c", label: "3", correct: false, why: "\"moon\" and \"star\" have four letters." },
    ],
  },
  "list-methods": {
    prompt: "Arrange the lines to add a planet, remove another, and print the result.",
    parsonsFragments: [
      { id: "lm1", text: 'planets = ["Mars", "Venus"]', indent: 0 },
      { id: "lm2", text: 'planets.append("Earth")', indent: 0 },
      { id: "lm3", text: 'planets.remove("Venus")', indent: 0 },
      { id: "lm4", text: "print(planets)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: take the last item off, then sort what is left.",
    fadedLines: [
      { text: "last = items.___()", blanks: ["pop"] },
      { text: "items.___()", blanks: ["sort"] },
    ],
    fadedExplain: "`.pop()` removes and returns the last item and `.sort()` orders the list in place.",
    predictCode: code`nums = [3, 1, 2]
result = nums.sort()
print(result, nums)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "None [1, 2, 3]", correct: true, why: "`.sort()` changes the list and returns None." },
      { id: "b", label: "[1, 2, 3] [1, 2, 3]", correct: false, why: "`.sort()` returns None; only `sorted()` returns a new list." },
      { id: "c", label: "None [3, 1, 2]", correct: false, why: "The list itself is sorted in place." },
    ],
  },
  "dict-methods": {
    prompt: "Arrange the lines to print every key and value in a dictionary.",
    parsonsFragments: [
      { id: "dm1", text: 'star = {"name": "Vega", "mag": 0.03}', indent: 0 },
      { id: "dm2", text: "for key, value in star.items():", indent: 0 },
      { id: "dm3", text: "print(key, value)", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks to read a key safely with a default.",
    fadedLines: [{ text: 'color = star.___("color", ___)', blanks: ["get", '"unknown"'] }],
    fadedExplain: "`.get(key, default)` returns the default instead of raising KeyError.",
    predictCode: code`counts = {}
for word in ["sky", "sun", "sky"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "{'sky': 2, 'sun': 1}", correct: true, why: "Each word starts at 0 with get and goes up by one per appearance." },
      { id: "b", label: "{'sky': 1, 'sun': 1}", correct: false, why: "\"sky\" appears twice, so its count reaches 2." },
      { id: "c", label: "KeyError: 'sky'", correct: false, why: "`.get(word, 0)` never raises for a missing key." },
    ],
  },
  "nested-data": {
    prompt: "Arrange the lines to print the name of every star in a list of dictionaries.",
    parsonsFragments: [
      { id: "nd1", text: 'stars = [{"name": "Vega"}, {"name": "Rigel"}]', indent: 0 },
      { id: "nd2", text: "for star in stars:", indent: 0 },
      { id: "nd3", text: 'print(star["name"])', indent: 1 },
    ],
    fadedPrompt: "Fill the blanks to reach the second tag of the first star.",
    fadedLines: [{ text: 'print(stars[___]["tags"][___])', blanks: ["0", "1"] }],
    fadedExplain: "Index 0 is the first star, then index 1 is its second tag.",
    predictCode: code`grid = [[1, 2], [3, 4]]
print(grid[1][0] + grid[0][1])`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "grid[1][0] is 3 and grid[0][1] is 2." },
      { id: "b", label: "3", correct: false, why: "Both values are added: 3 + 2." },
      { id: "c", label: "4", correct: false, why: "grid[1][0] is the first item of the second row, which is 3." },
    ],
  },
  "py-unpacking": {
    prompt: "Arrange the lines to swap two values and print them.",
    parsonsFragments: [
      { id: "up1", text: "a = 1", indent: 0 },
      { id: "up2", text: "b = 2", indent: 0 },
      { id: "up3", text: "a, b = b, a", indent: 0 },
      { id: "up4", text: "print(a, b)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to keep the first item and collect the rest.",
    fadedLines: [{ text: "first, ___rest = [1, 2, 3]", blanks: ["*"] }],
    fadedExplain: "A starred name collects every remaining value into a list.",
    predictCode: code`a, *b = "sky"
print(a, b)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "s ['k', 'y']", correct: true, why: "A string unpacks letter by letter, and *b collects the rest as a list." },
      { id: "b", label: "s ky", correct: false, why: "A starred name always collects into a list." },
      { id: "c", label: "sky []", correct: false, why: "Unpacking a string splits it into characters first." },
    ],
  },
  "py-args-kwargs": {
    prompt: "Arrange the lines to define a function that sums any number of values.",
    parsonsFragments: [
      { id: "ak1", text: "def total(*numbers):", indent: 0 },
      { id: "ak2", text: "result = 0", indent: 1 },
      { id: "ak3", text: "for n in numbers:", indent: 1 },
      { id: "ak4", text: "result += n", indent: 2 },
      { id: "ak5", text: "return result", indent: 1 },
      { id: "ak6", text: "print(total(1, 2, 3))", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to collect keyword arguments, then spread a list into a call.",
    fadedLines: [
      { text: "def show(___options):", blanks: ["**"] },
      { text: "    print(options)", blanks: [] },
      { text: "total(___scores)", blanks: ["*"] },
    ],
    fadedExplain: "`**` collects keyword arguments into a dict and `*` spreads a list into separate arguments.",
    predictCode: code`def f(a, *rest, **opts):
    print(a, rest, opts)

f(1, 2, 3, x=4)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1 (2, 3) {'x': 4}", correct: true, why: "a takes 1, *rest collects (2, 3) as a tuple and **opts collects x=4." },
      { id: "b", label: "1 [2, 3] {'x': 4}", correct: false, why: "*rest is a tuple, which prints with round brackets." },
      { id: "c", label: "1 (2, 3, 4) {}", correct: false, why: "x=4 is a keyword argument, so it lands in opts." },
    ],
  },
  "py-lambda-sorting": {
    prompt: "Arrange the lines to sort words from shortest to longest.",
    parsonsFragments: [
      { id: "ls1", text: 'words = ["nebula", "sky", "comet"]', indent: 0 },
      { id: "ls2", text: "ordered = sorted(words, key=len)", indent: 0 },
      { id: "ls3", text: "print(ordered)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to sort by the second item of each pair, largest first.",
    fadedLines: [{ text: "sorted(pairs, key=___ p: p[1], reverse=___)", blanks: ["lambda", "True"] }],
    fadedExplain: "A lambda returns the value to sort by, and reverse=True puts the largest first.",
    predictCode: code`print(sorted([3, -5, 2], key=abs))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[2, 3, -5]", correct: true, why: "Sorting by absolute value compares 3, 5 and 2, but keeps the original items." },
      { id: "b", label: "[-5, 2, 3]", correct: false, why: "The key is abs, so -5 counts as 5 and goes last." },
      { id: "c", label: "[2, 3, 5]", correct: false, why: "The key only decides the order; the items themselves are unchanged." },
    ],
  },
  "py-raising-errors": {
    prompt: "Arrange the lines to reject a negative number.",
    parsonsFragments: [
      { id: "re1", text: "def check(n):", indent: 0 },
      { id: "re2", text: "if n < 0:", indent: 1 },
      { id: "re3", text: 'raise ValueError("negative")', indent: 2 },
      { id: "re4", text: "return n", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks to make a custom exception and raise it.",
    fadedLines: [
      { text: "class OrbitError(___):", blanks: ["Exception"] },
      { text: "    pass", blanks: [] },
      { text: '___ OrbitError("lost orbit")', blanks: ["raise"] },
    ],
    fadedExplain: "Custom exceptions subclass Exception, and raise throws one.",
    predictCode: code`def check(n):
    if n > 3:
        raise ValueError("too big")
    return n

try:
    print(check(2))
    print(check(5))
    print(check(1))
except ValueError as e:
    print("caught", e)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2\ncaught too big", correct: true, why: "check(5) raises, which jumps straight to except. check(1) never runs." },
      { id: "b", label: "2\ncaught too big\n1", correct: false, why: "Once the error is raised, the rest of the try block is skipped." },
      { id: "c", label: "caught too big", correct: false, why: "check(2) succeeds and prints 2 before the error." },
    ],
  },
  "py-json": {
    prompt: "Arrange the lines to parse JSON text and read one value.",
    parsonsFragments: [
      { id: "js1", text: "import json", indent: 0 },
      { id: "js2", text: "text = '{\"moons\": 2}'", indent: 0 },
      { id: "js3", text: "data = json.loads(text)", indent: 0 },
      { id: "js4", text: 'print(data["moons"])', indent: 0 },
    ],
    fadedPrompt: "Fill the blank to turn a dict into JSON text.",
    fadedLines: [{ text: 'text = json.___({"ok": True})', blanks: ["dumps"] }],
    fadedExplain: "`json.dumps` turns Python data into a JSON string.",
    predictCode: code`import json
print(json.dumps({"ok": True, "n": None}))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: '{"ok": true, "n": null}', correct: true, why: "JSON spells True as true and None as null, with double quotes." },
      { id: "b", label: "{'ok': True, 'n': None}", correct: false, why: "That is how Python prints a dict, not JSON." },
      { id: "c", label: '{"ok": "True", "n": "None"}', correct: false, why: "Booleans and None become JSON values, not strings." },
    ],
  },
  "py-modules-imports": {
    prompt: "Arrange the lines to count letters with the standard library.",
    parsonsFragments: [
      { id: "mi1", text: "from collections import Counter", indent: 0 },
      { id: "mi2", text: 'counts = Counter("sunny")', indent: 0 },
      { id: "mi3", text: 'print(counts["n"])', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to import one function and give a module an alias.",
    fadedLines: [
      { text: "___ math import sqrt", blanks: ["from"] },
      { text: "import datetime ___ dt", blanks: ["as"] },
    ],
    fadedExplain: "`from module import name` brings in one name, and `as` sets an alias.",
    predictCode: code`from math import floor, ceil
print(floor(2.7), ceil(2.1))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2 3", correct: true, why: "floor rounds down and ceil rounds up." },
      { id: "b", label: "3 2", correct: false, why: "floor goes down to 2 and ceil goes up to 3." },
      { id: "c", label: "3 3", correct: false, why: "floor(2.7) rounds down, giving 2." },
    ],
  },
  "py-inheritance": {
    prompt: "Arrange the lines so Comet inherits from SpaceObject.",
    parsonsFragments: [
      { id: "ih1", text: "class SpaceObject:", indent: 0 },
      { id: "ih2", text: "def describe(self):", indent: 1 },
      { id: "ih3", text: 'return "drifting"', indent: 2 },
      { id: "ih4", text: "class Comet(SpaceObject):", indent: 0 },
      { id: "ih5", text: "pass", indent: 1 },
      { id: "ih6", text: "print(Comet().describe())", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to run the parent's setup inside the child.",
    fadedLines: [
      { text: "class Comet(SpaceObject):", blanks: [] },
      { text: "    def __init__(self, name):", blanks: [] },
      { text: "        ___().__init__(___)", blanks: ["super", "name"] },
    ],
    fadedExplain: "`super().__init__(name)` calls the parent class's initializer.",
    predictCode: code`class A:
    def hello(self):
        return "A"

class B(A):
    def hello(self):
        return "B" + super().hello()

print(B().hello())`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "BA", correct: true, why: "B's hello adds its own \"B\" to the result of A's hello." },
      { id: "b", label: "B", correct: false, why: "super().hello() also runs, adding \"A\"." },
      { id: "c", label: "AB", correct: false, why: "\"B\" comes first in the returned string." },
    ],
  },
  "py-dunder-methods": {
    prompt: "Arrange the lines so printing a Star shows its name.",
    parsonsFragments: [
      { id: "du1", text: "class Star:", indent: 0 },
      { id: "du2", text: "def __init__(self, name):", indent: 1 },
      { id: "du3", text: "self.name = name", indent: 2 },
      { id: "du4", text: "def __str__(self):", indent: 1 },
      { id: "du5", text: 'return f"Star {self.name}"', indent: 2 },
      { id: "du6", text: 'print(Star("Vega"))', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks so + and == work on your objects.",
    fadedLines: [
      { text: "def ___(self, other):", blanks: ["__add__"] },
      { text: "def ___(self, other):", blanks: ["__eq__"] },
    ],
    fadedExplain: "`__add__` powers `+` and `__eq__` powers `==`.",
    predictCode: code`class Box:
    def __init__(self, n):
        self.n = n

    def __repr__(self):
        return f"Box({self.n})"

print([Box(1), Box(2)])`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[Box(1), Box(2)]", correct: true, why: "Objects inside a list are shown with __repr__." },
      { id: "b", label: "[1, 2]", correct: false, why: "The list holds Box objects, shown through their __repr__." },
      { id: "c", label: "Box(1) Box(2)", correct: false, why: "Printing a list keeps the square brackets and commas." },
    ],
  },
  "py-dataclasses": {
    prompt: "Arrange the lines to define and print a data class.",
    parsonsFragments: [
      { id: "dc1", text: "from dataclasses import dataclass", indent: 0 },
      { id: "dc2", text: "@dataclass", indent: 0 },
      { id: "dc3", text: "class Moon:", indent: 0 },
      { id: "dc4", text: "name: str", indent: 1 },
      { id: "dc5", text: 'print(Moon("Io"))', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to give each object its own fresh list.",
    fadedLines: [{ text: "tags: list = field(___=list)", blanks: ["default_factory"] }],
    fadedExplain: "`default_factory=list` makes a new empty list for every object.",
    predictCode: code`from dataclasses import dataclass

@dataclass
class P:
    x: int
    y: int = 0

print(P(3), P(1, 2) == P(1, 2))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "P(x=3, y=0) True", correct: true, why: "The generated repr shows every field, and __eq__ compares fields." },
      { id: "b", label: "P(3) False", correct: false, why: "Dataclasses generate __eq__, so equal fields compare equal." },
      { id: "c", label: "P(x=3) True", correct: false, why: "The default y=0 is still a field and appears in the repr." },
    ],
  },
  "py-type-hints": {
    prompt: "Arrange the lines to write a typed function.",
    parsonsFragments: [
      { id: "th1", text: "def area(w: float, h: float) -> float:", indent: 0 },
      { id: "th2", text: "return w * h", indent: 1 },
      { id: "th3", text: "print(area(2.0, 3.5))", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks: a list of strings in, and an int or nothing out.",
    fadedLines: [{ text: "def find(names: ___[str]) -> int ___ None:", blanks: ["list", "|"] }],
    fadedExplain: "`list[str]` describes a list of strings and `int | None` means an int or nothing.",
    predictCode: code`def double(n: int) -> int:
    return n * 2

print(double("ab"))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "abab", correct: true, why: "Type hints are not enforced when the code runs, so \"ab\" * 2 repeats." },
      { id: "b", label: "TypeError: expected int", correct: false, why: "Python never checks hints at run time; tools like mypy would warn instead." },
      { id: "c", label: "4", correct: false, why: "The argument is the string \"ab\", not a number." },
    ],
  },
};
