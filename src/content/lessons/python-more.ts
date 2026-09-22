import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";


/**
 * Python lessons added in the second curriculum pass: the fundamentals that
 * were missing from the first release, through objects and classes. Order and
 * module placement are set so they slot into the existing chapters.
 */
export const pythonMoreLessons: Lesson[] = [
  {
    slug: "numbers-math",
    order: 3,
    chapter: "Python Basics",
    kicker: "PYTHON BASICS",
    title: "Numbers and math",
    catalogTitle: "Numbers & math",
    blurb: "Add, divide, round and find remainders with Python's number operators.",
    catalogCode: "minutes % 60",
    intro:
      "Python has two everyday number types: **int** for whole numbers and **float** for numbers with a decimal point. The operators `+`, `-`, `*` and `/` work like a calculator, `//` divides and drops the remainder, `%` gives the remainder, and `**` raises to a power.",
    example: code`stars = 17
groups = 5

print(stars / groups)
print(stars // groups)
print(stars % groups)
print(2 ** 10)
print(round(3.14159, 2))`,
    reads: [
      { dot: DOT_PINK, text: "`/` always gives a float, so `17 / 5` is **3.4**" },
      { dot: DOT_MINT, text: "`//` keeps only the whole part (**3**) and `%` gives what is left over (**2**)" },
      { dot: DOT_LAVENDER, text: "`round(x, 2)` rounds to two decimal places" },
    ],
    tip: "`n % 2 == 0` tests whether a number is even. It is one of the most used tricks in programming.",
    mistakes: [
      "`/` always returns a float, even for `10 / 2` (that is `5.0`, not `5`).",
      "`^` is not a power in Python. Use `**`: `2 ** 3` is 8.",
    ],
    starter: code`# a night of stargazing, in minutes
minutes = 135

hours = minutes // 60
print(hours)`,
    task: {
      prompt: "Also print how many minutes are left over after the whole hours. The program should print `2` and then `15`.",
      expectOutput: ["2", "15"],
      mustInclude: ["%"],
      hint: "The remainder operator `%` gives what is left after dividing: `minutes % 60`.",
      solution: code`minutes = 135

hours = minutes // 60
print(hours)
print(minutes % 60)`,
    },
    practiceSlug: "numbers-math",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "f-strings",
    order: 4,
    chapter: "Python Basics",
    kicker: "PYTHON BASICS",
    title: "Formatted strings",
    catalogTitle: "f-strings",
    blurb: "Drop values straight into text with f-strings.",
    catalogCode: 'f"{name} has {moons} moons"',
    intro:
      "An **f-string** is a string with an `f` before the opening quote. Anything inside `{curly braces}` is worked out and dropped into the text, so you never glue pieces together with `+`. You can even format numbers: `{price:.2f}` always shows two decimal places.",
    example: code`name = "Nova"
stars = 3
price = 4.5

print(f"{name} saw {stars} shooting stars")
print(f"Tickets cost {price:.2f} coins")
print(f"Next year {name} will see {stars * 2}")`,
    reads: [
      { dot: DOT_PINK, text: "The **f** before the quote switches on the braces" },
      { dot: DOT_MINT, text: "Braces can hold any expression, like `{stars * 2}`" },
      { dot: DOT_LAVENDER, text: "`:.2f` after a value formats it with two decimal places" },
    ],
    tip: "f-strings convert numbers to text for you, so there is no need for `str(stars)` when mixing words and numbers.",
    mistakes: [
      "Forgetting the `f`: Python then prints the braces literally.",
      "Using the same quote inside the braces as around the string. Use `'` inside a string wrapped in `\"`.",
    ],
    starter: code`planet = "Mars"
moons = 2
print("The planet is " + planet)`,
    task: {
      prompt: "Use an f-string to print exactly `Mars has 2 moons`, using the two variables.",
      expectOutput: ["Mars has 2 moons"],
      mustInclude: ["f[\"']"],
      hint: "Start the string with `f\"` and put each variable in braces: `f\"{planet} ...\"`.",
      solution: code`planet = "Mars"
moons = 2
print(f"{planet} has {moons} moons")`,
    },
    practiceSlug: "f-strings",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "string-methods",
    order: 5,
    chapter: "Python Basics",
    kicker: "PYTHON BASICS",
    title: "String methods",
    catalogTitle: "String methods",
    blurb: "Clean up, search and split text with built-in methods.",
    catalogCode: "title.strip().upper()",
    intro:
      "Strings come with **methods**: small built-in tools you call with a dot. `.upper()` and `.lower()` change case, `.strip()` trims spaces from both ends, `.replace(a, b)` swaps text, `.split()` breaks a string into a list of words, and `in` checks whether one piece of text is inside another. Methods return a **new** string. The original never changes.",
    example: code`raw = "  Cloudy with a chance of stars  "
clean = raw.strip()

print(clean.upper())
print(clean.replace("stars", "comets"))
print(clean.split())
print("stars" in clean)`,
    reads: [
      { dot: DOT_PINK, text: "`.strip()` removes the spaces at both ends" },
      { dot: DOT_MINT, text: "`.split()` with no argument splits on spaces and returns a **list**" },
      { dot: DOT_LAVENDER, text: "Strings never change in place, so save or print the result" },
    ],
    tip: "Chain methods left to right: `raw.strip().lower()` trims first, then lowercases.",
    mistakes: [
      "Calling `name.upper()` without saving or printing the result. Strings never change in place.",
      "Writing `name.upper` without parentheses gives you the method itself, not the result.",
    ],
    starter: code`title = "  the night sky  "
print(title)`,
    task: {
      prompt: "Print the title trimmed and in capital letters, exactly `THE NIGHT SKY`.",
      expectOutput: ["THE NIGHT SKY"],
      mustInclude: ["\\.strip\\(\\)", "\\.upper\\(\\)"],
      hint: "Chain two methods: `title.strip().upper()`.",
      solution: code`title = "  the night sky  "
print(title.strip().upper())`,
    },
    practiceSlug: "string-methods",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "type-conversion",
    order: 6,
    chapter: "Python Basics",
    kicker: "PYTHON BASICS",
    title: "Converting types",
    catalogTitle: "Type conversion",
    blurb: "Turn text into numbers and back with int(), float() and str().",
    catalogCode: 'int("2") + int("3")',
    intro:
      "Every value has a **type**: `int`, `float`, `str` or `bool`. Ask for it with `type(value)`. Text that looks like a number is still text until you convert it with `int()` or `float()`, and `str()` turns anything into text. It matters because `\"2\" + \"3\"` is `\"23\"`, not `5`.",
    example: code`a = "2"
b = "3"

print(a + b)
print(int(a) + int(b))
print(float("2.5") * 2)
print(str(42) + " stars")
print(type(3.0))`,
    reads: [
      { dot: DOT_PINK, text: "`+` joins strings but adds numbers, so the type decides what happens" },
      { dot: DOT_MINT, text: "`int(\"2\")` makes the number 2 from the text \"2\"" },
      { dot: DOT_LAVENDER, text: "`type(x)` tells you what you are holding" },
    ],
    tip: "`int(\"3.7\")` fails. When text might have a decimal point, convert to `float` first: `int(float(\"3.7\"))` is 3.",
    mistakes: [
      "`int(\"seven\")` raises ValueError. Only text made of digits converts.",
      "`bool(\"False\")` is `True`: any non-empty string counts as true.",
    ],
    starter: code`apples = "4"
pears = "6"
print(apples + pears)`,
    task: {
      prompt: "Change the last line so it prints the real total, `10`.",
      expectOutput: ["10"],
      mustInclude: ["int\\("],
      hint: "Convert each one with `int()` before adding.",
      solution: code`apples = "4"
pears = "6"
print(int(apples) + int(pears))`,
    },
    practiceSlug: "type-conversion",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "input-output",
    order: 7,
    chapter: "Python Basics",
    kicker: "PYTHON BASICS",
    title: "Asking for input",
    catalogTitle: "input()",
    blurb: "Read what the user types with input() and answer back.",
    catalogCode: 'name = input("Name? ")',
    intro:
      "`input()` pauses the program and returns whatever the user types, **always as a string**. Put a message in the parentheses to show a prompt. In this editor you type your answers into the **Input box** under the code: one line for each `input()` call.",
    example: code`name = input("What is your name? ")
age = int(input("How old are you? "))

print(f"Hi {name}!")
print(f"Next year you will be {age + 1}.")`,
    reads: [
      { dot: DOT_PINK, text: "`input(\"...\")` shows the prompt and returns the typed text" },
      { dot: DOT_MINT, text: "Wrap it in `int(...)` when you need a number" },
      { dot: DOT_LAVENDER, text: "Each `input()` reads the next line of the Input box" },
    ],
    tip: "Always convert numeric input: `int(input(...))`. Without it, `age + 1` fails because age is text.",
    mistakes: ["`age = input(\"Age? \")` followed by `age + 1` raises TypeError: you cannot add a number to a string."],
    stdin: "violet\n5",
    starter: code`color = input("Favourite sky colour? ")
print(color)`,
    task: {
      prompt:
        "The Input box already holds two lines. Read the second one as a number of stars with another `input()`, then print exactly `violet sky with 5 stars`.",
      expectOutput: ["violet sky with 5 stars"],
      mustInclude: ["int\\(\\s*input"],
      hint: "Add `stars = int(input(\"How many stars? \"))`, then print an f-string with both values.",
      solution: code`color = input("Favourite sky colour? ")
stars = int(input("How many stars? "))
print(f"{color} sky with {stars} stars")`,
    },
    practiceSlug: "input-output",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "loop-patterns",
    order: 19,
    chapter: "Loops and iteration",
    kicker: "LOOPS",
    title: "Four loop patterns",
    catalogTitle: "Loop patterns",
    blurb: "Sum, count, find the biggest and collect with four classic loop shapes.",
    catalogCode: "if h > highest: highest = h",
    intro:
      "Most loops follow one of a few **patterns**. An **accumulator** starts at 0 and adds as it goes. A **counter** adds 1 when something matches. A **tracker** remembers the best value seen so far. A **collector** starts with an empty list and appends. Learn these four shapes and most loop problems become fill in the blanks.",
    example: code`heights = [120, 340, 90, 500, 210]

total = 0
tall = 0
highest = heights[0]
big = []

for h in heights:
    total += h
    if h > 200:
        tall += 1
        big.append(h)
    if h > highest:
        highest = h

print(total, tall, highest)
print(big)`,
    reads: [
      { dot: DOT_PINK, text: "**Accumulator**: `total += h` adds every value" },
      { dot: DOT_MINT, text: "**Counter** and **collector**: `tall += 1` and `big.append(h)` only when the condition holds" },
      { dot: DOT_LAVENDER, text: "**Tracker**: start with the first item, replace it when something beats it" },
    ],
    tip: "Start a tracker with the first item, not with 0. If every value is negative, starting at 0 gives the wrong answer.",
    starter: code`temps = [14, 9, 21, 17, 6]

total = 0
for t in temps:
    total += t
print(total)`,
    task: {
      prompt: "Use a tracker loop to find the lowest temperature and print it (`6`). Try it without `min()`.",
      expectOutput: ["6"],
      mustInclude: ["\\bfor\\b", "<"],
      hint: "Start with `lowest = temps[0]`, then inside the loop `if t < lowest: lowest = t`.",
      solution: code`temps = [14, 9, 21, 17, 6]

lowest = temps[0]
for t in temps:
    if t < lowest:
        lowest = t
print(lowest)`,
    },
    practiceSlug: "loop-patterns",
    module: "Loops and iteration",
    tier: "beginner",
  },
  {
    slug: "list-methods",
    order: 27,
    chapter: "Collections",
    kicker: "COLLECTIONS",
    title: "List methods",
    catalogTitle: "List methods",
    blurb: "Add, remove, sort and search lists with their built-in methods.",
    catalogCode: 'planets.append("Jupiter")',
    intro:
      "Lists change in place with methods: `.append(x)` adds to the end, `.insert(i, x)` adds at a position, `.remove(x)` deletes the first match, `.pop()` removes and returns the last item, and `.sort()` puts the list in order. `sorted(items)` returns a **new** sorted list and leaves the original alone. `x in items` checks membership and `items.index(x)` finds a position.",
    example: code`planets = ["Mars", "Venus", "Earth"]
planets.append("Jupiter")
planets.insert(0, "Mercury")
planets.remove("Venus")
last = planets.pop()

print(planets)
print(last)
print(sorted(planets))
print("Earth" in planets, planets.index("Earth"))`,
    reads: [
      { dot: DOT_PINK, text: "`.append`, `.insert`, `.remove` and `.pop` change the list itself" },
      { dot: DOT_MINT, text: "`.pop()` also hands back the item it removed" },
      { dot: DOT_LAVENDER, text: "`sorted(planets)` makes a new list, `planets.sort()` reorders the original" },
    ],
    tip: "Reach for `sorted()` when you still need the original order later, and `.sort()` when you do not.",
    mistakes: [
      "`planets = planets.sort()` sets planets to `None`: `.sort()` changes the list and returns nothing.",
      "`.remove(x)` raises ValueError when `x` is not in the list. Check with `in` first.",
    ],
    starter: code`queue = ["Nova", "Luka"]
print(queue)`,
    task: {
      prompt: "Add `\"Mira\"` to the end, remove `\"Nova\"`, then print the list: `['Luka', 'Mira']`.",
      expectOutput: ["['Luka', 'Mira']"],
      mustInclude: ["\\.append\\(", "\\.remove\\("],
      hint: "Call `queue.append(\"Mira\")` and `queue.remove(\"Nova\")` before the print.",
      solution: code`queue = ["Nova", "Luka"]
queue.append("Mira")
queue.remove("Nova")
print(queue)`,
    },
    practiceSlug: "list-methods",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "dict-methods",
    order: 29,
    chapter: "Collections",
    kicker: "COLLECTIONS",
    title: "Dictionary methods",
    catalogTitle: "Dict methods",
    blurb: "Loop over keys and values, read safely with get(), and update in bulk.",
    catalogCode: "for key, value in star.items():",
    intro:
      "`.get(key, default)` reads a value without crashing when the key is missing. `.keys()`, `.values()` and `.items()` let you loop over a dictionary, and `.items()` gives you each key and value together. `.update(other)` merges another dict in, and `.pop(key)` removes an entry and returns its value.",
    example: code`star = {"name": "Vega", "mag": 0.03}

print(star.get("color", "unknown"))
star.update({"color": "white", "mag": 0.0})

for key, value in star.items():
    print(key, "->", value)

print(list(star.keys()))`,
    reads: [
      { dot: DOT_PINK, text: "`.get(\"color\", \"unknown\")` falls back to the default instead of raising KeyError" },
      { dot: DOT_MINT, text: "`.update` adds new keys and overwrites existing ones" },
      { dot: DOT_LAVENDER, text: "`for key, value in star.items()` unpacks each pair" },
    ],
    tip: "Counting things? `counts[word] = counts.get(word, 0) + 1` is the classic one-liner.",
    mistakes: [
      "`d[\"missing\"]` raises KeyError. Use `d.get(\"missing\")` when a key might not be there.",
      "Adding or removing keys while looping over the same dict raises RuntimeError. Loop over `list(d.items())` instead.",
    ],
    starter: code`votes = {"Vega": 3, "Rigel": 5, "Deneb": 2}
print(votes)`,
    task: {
      prompt: "Loop over `votes.items()` and print one line per star in the form `Vega: 3`.",
      expectOutput: ["Vega: 3", "Rigel: 5", "Deneb: 2"],
      mustInclude: ["\\.items\\(\\)"],
      hint: "`for name, count in votes.items():` then `print(f\"{name}: {count}\")`.",
      solution: code`votes = {"Vega": 3, "Rigel": 5, "Deneb": 2}
for name, count in votes.items():
    print(f"{name}: {count}")`,
    },
    practiceSlug: "dict-methods",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "nested-data",
    order: 30,
    chapter: "Collections",
    kicker: "COLLECTIONS",
    title: "Nested data",
    catalogTitle: "Nested data",
    blurb: "Lists of dictionaries and dictionaries of lists: the shape of real data.",
    catalogCode: 'stars[0]["name"]',
    intro:
      "Real data is **nested**: a list of dictionaries (like rows in a table), or a dictionary whose values are lists. Read it one level at a time: `stars[0]` is the first dictionary, and `stars[0][\"name\"]` is its name. Loop over the outer list, then use keys on each item.",
    example: code`stars = [
    {"name": "Sirius", "mag": -1.46, "tags": ["bright", "binary"]},
    {"name": "Vega", "mag": 0.03, "tags": ["bright"]},
    {"name": "Polaris", "mag": 1.97, "tags": ["north"]},
]

print(stars[1]["name"])
print(stars[0]["tags"][1])

for star in stars:
    if "bright" in star["tags"]:
        print(star["name"], star["mag"])`,
    reads: [
      { dot: DOT_PINK, text: "Each index or key goes **one level deeper**: `stars[0][\"tags\"][1]`" },
      { dot: DOT_MINT, text: "Loop over the outer list; each `star` is a whole dictionary" },
      { dot: DOT_LAVENDER, text: "`in` works on the inner list too: `\"bright\" in star[\"tags\"]`" },
    ],
    tip: "Lost in nested data? Print one level at a time: `print(stars[0])`, then `print(stars[0][\"tags\"])`.",
    starter: code`crew = {
    "pilots": ["Nova", "Luka"],
    "engineers": ["Mira"],
}
print(crew)`,
    task: {
      prompt: "Print the second pilot's name (`Luka`), then the total number of crew members (`3`).",
      expectOutput: ["Luka", "3"],
      mustInclude: ["\\[\\s*1\\s*\\]", "len\\("],
      hint: "`crew[\"pilots\"][1]` is the second pilot. Add up `len()` of both lists for the total.",
      solution: code`crew = {
    "pilots": ["Nova", "Luka"],
    "engineers": ["Mira"],
}
print(crew["pilots"][1])
print(len(crew["pilots"]) + len(crew["engineers"]))`,
    },
    practiceSlug: "nested-data",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "py-unpacking",
    order: 35,
    chapter: "Comprehensions and data tools",
    kicker: "PYTHON INTERMEDIATE",
    title: "Unpacking values",
    catalogTitle: "Unpacking",
    blurb: "Pull a tuple or list apart into named variables in one line.",
    catalogCode: "low, high = min_max(values)",
    intro:
      "**Unpacking** assigns several variables at once from a sequence: `x, y = (3, 4)`. It is how you swap two values in one line (`a, b = b, a`) and how a function hands back more than one result. A starred name collects whatever is left: `first, *rest = [1, 2, 3]`.",
    example: code`point = (3, 4)
x, y = point
print(x, y)

a, b = 1, 2
a, b = b, a
print(a, b)

first, *middle, last = [10, 20, 30, 40]
print(first, middle, last)

def min_max(values):
    return min(values), max(values)

low, high = min_max([7, 2, 9])
print(low, high)`,
    reads: [
      { dot: DOT_PINK, text: "The number of names on the left must match the number of values" },
      { dot: DOT_MINT, text: "`return a, b` returns a tuple, which you unpack straight away" },
      { dot: DOT_LAVENDER, text: "`*middle` soaks up the values in between as a list" },
    ],
    tip: "Unpacking works in loops too: `for name, mag in pairs:` unpacks each pair as you go.",
    mistakes: ["`x, y = [1, 2, 3]` raises ValueError: too many values to unpack."],
    starter: code`def stats(numbers):
    return sum(numbers), len(numbers)

result = stats([4, 8, 6])
print(result)`,
    task: {
      prompt: "Unpack the result into `total` and `count`, then print the average: `6.0`.",
      expectOutput: ["6.0"],
      mustInclude: ["total\\s*,\\s*count\\s*="],
      hint: "`total, count = stats([4, 8, 6])` then `print(total / count)`.",
      solution: code`def stats(numbers):
    return sum(numbers), len(numbers)

total, count = stats([4, 8, 6])
print(total / count)`,
    },
    practiceSlug: "py-unpacking",
    module: "Comprehensions and data tools",
    tier: "intermediate",
  },
  {
    slug: "py-args-kwargs",
    order: 37,
    chapter: "Comprehensions and data tools",
    kicker: "PYTHON INTERMEDIATE",
    title: "Flexible arguments",
    catalogTitle: "*args & **kwargs",
    blurb: "Accept any number of values with *args and named options with **kwargs.",
    catalogCode: "def total(*numbers):",
    intro:
      "Put `*` before a parameter and it collects any extra positional arguments into a **tuple**. Put `**` before one and it collects extra keyword arguments into a **dict**. The names `args` and `kwargs` are just a convention. The stars work the other way when calling: `total(*values)` spreads a list into separate arguments.",
    example: code`def total(*numbers):
    return sum(numbers)

def describe(name, **details):
    line = name
    for key, value in details.items():
        line += f" {key}={value}"
    return line

print(total(1, 2, 3))
print(total())
print(describe("Vega", mag=0.03, color="white"))

scores = [4, 5, 6]
print(total(*scores))`,
    reads: [
      { dot: DOT_PINK, text: "`*numbers` is a tuple of every positional argument, even none" },
      { dot: DOT_MINT, text: "`**details` is a dict of every `name=value` argument" },
      { dot: DOT_LAVENDER, text: "`total(*scores)` unpacks the list into three separate arguments" },
    ],
    tip: "Order matters in a definition: normal parameters, then `*args`, then keyword-only ones, then `**kwargs`.",
    starter: code`def shout(word):
    return word.upper() + "!"

print(shout("hello"))`,
    task: {
      prompt:
        "Change `shout` to take any number of words with `*words` and return them in capitals, joined by spaces, so `shout(\"clear\", \"skies\")` prints `CLEAR SKIES!`.",
      expectOutput: ["CLEAR SKIES!"],
      mustInclude: ["\\*words"],
      hint: "`\" \".join(words)` glues the words together with spaces.",
      solution: code`def shout(*words):
    return " ".join(words).upper() + "!"

print(shout("clear", "skies"))`,
    },
    practiceSlug: "py-args-kwargs",
    module: "Comprehensions and data tools",
    tier: "intermediate",
  },
  {
    slug: "py-lambda-sorting",
    order: 38,
    chapter: "Comprehensions and data tools",
    kicker: "PYTHON INTERMEDIATE",
    title: "Sorting with keys and lambda",
    catalogTitle: "Lambda & sorting",
    blurb: "Sort by any rule with key= and tiny lambda functions.",
    catalogCode: 'sorted(stars, key=lambda s: s["mag"])',
    intro:
      "`sorted()` and `.sort()` accept a `key` function that turns each item into the value to sort by. A **lambda** is a tiny one-line function without a name: `lambda s: s[\"mag\"]` takes an item and returns its magnitude. Add `reverse=True` for largest first. `min()` and `max()` accept the same `key`.",
    example: code`stars = [
    {"name": "Deneb", "mag": 1.25},
    {"name": "Sirius", "mag": -1.46},
    {"name": "Vega", "mag": 0.03},
]

by_brightness = sorted(stars, key=lambda s: s["mag"])
print([s["name"] for s in by_brightness])

words = ["nebula", "sky", "comet"]
print(sorted(words, key=len))
print(sorted(words, key=len, reverse=True))
print(max(stars, key=lambda s: s["mag"])["name"])`,
    reads: [
      { dot: DOT_PINK, text: "`key=` is called once per item; the list is ordered by what it returns" },
      { dot: DOT_MINT, text: "`lambda s: s[\"mag\"]` is the same as a small `def` that returns `s[\"mag\"]`" },
      { dot: DOT_LAVENDER, text: "Built-ins like `len` can be keys too: `key=len`" },
    ],
    tip: "To sort by two things, return a tuple: `key=lambda p: (p[\"team\"], p[\"score\"])`.",
    starter: code`crew = [("Nova", 12), ("Luka", 9), ("Mira", 15)]
print(sorted(crew))`,
    task: {
      prompt: "Sort the crew by age, youngest first, and print it: `[('Luka', 9), ('Nova', 12), ('Mira', 15)]`.",
      expectOutput: ["[('Luka', 9), ('Nova', 12), ('Mira', 15)]"],
      mustInclude: ["key\\s*="],
      hint: "Each item is a `(name, age)` tuple, so the key is `lambda person: person[1]`.",
      solution: code`crew = [("Nova", 12), ("Luka", 9), ("Mira", 15)]
print(sorted(crew, key=lambda person: person[1]))`,
    },
    practiceSlug: "py-lambda-sorting",
    module: "Comprehensions and data tools",
    tier: "intermediate",
  },
  {
    slug: "py-raising-errors",
    order: 40,
    chapter: "Errors, Files and Modules",
    kicker: "PYTHON INTERMEDIATE",
    title: "Raising your own errors",
    catalogTitle: "Raising errors",
    blurb: "Stop bad input early with raise and custom exception classes.",
    catalogCode: 'raise ValueError("fuel cannot be negative")',
    intro:
      "When a function receives something it cannot handle, **raise** an exception instead of quietly returning a wrong answer: `raise ValueError(\"message\")`. The caller decides what to do with it using try/except. For problems specific to your program, create a **custom exception** by subclassing `Exception`.",
    example: code`class LaunchError(Exception):
    pass

def launch(fuel):
    if fuel < 0:
        raise ValueError("fuel cannot be negative")
    if fuel < 10:
        raise LaunchError(f"only {fuel} units of fuel")
    return "lift off"

for fuel in [50, 5, -1]:
    try:
        print(launch(fuel))
    except LaunchError as e:
        print("scrubbed:", e)
    except ValueError as e:
        print("bad input:", e)`,
    reads: [
      { dot: DOT_PINK, text: "`raise` stops the function immediately and sends the error up to the caller" },
      { dot: DOT_MINT, text: "`class LaunchError(Exception)` makes a new kind of error you can catch by name" },
      { dot: DOT_LAVENDER, text: "`except ... as e` gives you the error, and `print(e)` shows its message" },
    ],
    tip: "Raise early, catch late: check inputs at the top of a function, and handle errors where you can actually do something about them.",
    starter: code`def set_speed(speed):
    return f"speed set to {speed}"

try:
    print(set_speed(-5))
except ValueError as e:
    print("error:", e)`,
    task: {
      prompt: "Make `set_speed` raise `ValueError(\"speed must be positive\")` for negative speeds, so the program prints `error: speed must be positive`.",
      expectOutput: ["error: speed must be positive"],
      mustInclude: ["raise\\s+ValueError"],
      hint: "Add `if speed < 0: raise ValueError(\"speed must be positive\")` as the first lines of the function.",
      solution: code`def set_speed(speed):
    if speed < 0:
        raise ValueError("speed must be positive")
    return f"speed set to {speed}"

try:
    print(set_speed(-5))
except ValueError as e:
    print("error:", e)`,
    },
    practiceSlug: "py-raising-errors",
    module: "Errors, Files and Modules",
    tier: "intermediate",
  },
  {
    slug: "py-json",
    order: 42,
    chapter: "Errors, Files and Modules",
    kicker: "PYTHON INTERMEDIATE",
    title: "Working with JSON",
    catalogTitle: "JSON",
    blurb: "Turn Python data into JSON text and back with the json module.",
    catalogCode: "json.loads(text)",
    intro:
      "**JSON** is the text format the web uses to send data around. The `json` module converts between JSON text and Python values: `json.dumps(data)` turns a dict or list into a JSON string, and `json.loads(text)` parses JSON text back into Python. Add `indent=2` to make the text easy to read.",
    example: code`import json

report = {"city": "Lumen", "temps": [18, 21], "clear": True}
text = json.dumps(report)
print(text)

back = json.loads('{"city": "Nimbus", "temps": [12, 14], "clear": false}')
print(back["city"], back["temps"][1], back["clear"])`,
    reads: [
      { dot: DOT_PINK, text: "`dumps` means dump to string; `loads` means load from string" },
      { dot: DOT_MINT, text: "Python `True` and `None` become JSON `true` and `null`" },
      { dot: DOT_LAVENDER, text: "Parsed JSON is ordinary Python: dicts, lists, strings and numbers" },
    ],
    tip: "`json.dump(data, file)` and `json.load(file)` (no s) do the same thing straight to and from an open file.",
    mistakes: ["JSON needs double quotes. `json.loads(\"{'a': 1}\")` raises an error because of the single quotes."],
    starter: code`import json

raw = '{"pilot": "Nova", "hours": 42}'
print(raw)`,
    task: {
      prompt: "Parse `raw` with `json.loads` and print just the hours: `42`.",
      expectOutput: ["42"],
      mustInclude: ["json\\.loads\\("],
      hint: "`data = json.loads(raw)` gives you a dict. Then print `data[\"hours\"]`.",
      solution: code`import json

raw = '{"pilot": "Nova", "hours": 42}'
data = json.loads(raw)
print(data["hours"])`,
    },
    practiceSlug: "py-json",
    module: "Errors, Files and Modules",
    tier: "intermediate",
  },
  {
    slug: "py-modules-imports",
    order: 43,
    chapter: "Errors, Files and Modules",
    kicker: "PYTHON INTERMEDIATE",
    title: "Modules and imports",
    catalogTitle: "Modules",
    blurb: "Reuse Python's standard library with import.",
    catalogCode: "from collections import Counter",
    intro:
      "A **module** is a file of code you can reuse. Python ships with a large **standard library**: `math` for maths, `random` for chance, `collections` for handy containers, `datetime` for dates. `import math` gives you `math.sqrt`, `from math import sqrt` imports just that name, and `import datetime as dt` gives a module a shorter alias.",
    example: code`import math
from collections import Counter
from datetime import date

print(math.sqrt(144), math.pi > 3)
print(Counter("mississippi").most_common(2))
print(date(2026, 12, 25) - date(2026, 12, 1))`,
    reads: [
      { dot: DOT_PINK, text: "`import math` then `math.sqrt(...)`: the module name keeps things organised" },
      { dot: DOT_MINT, text: "`from collections import Counter` brings one name in directly" },
      { dot: DOT_LAVENDER, text: "Subtracting two dates gives a `timedelta`, a span of time" },
    ],
    tip: "Before writing a helper, check the standard library. Counting, dates, random choices and file paths are already solved.",
    deeper: [
      {
        title: "Your own modules",
        body: "Any `.py` file is a module. If `helpers.py` defines `def greet():`, another file in the same folder can `import helpers` and call `helpers.greet()`.\n\nCode at the top level of a module runs when it is imported. Guard code that should only run when the file is started directly with `if __name__ == \"__main__\":`.",
        code: code`def main():
    print("running as a script")

if __name__ == "__main__":
    main()`,
      },
    ],
    starter: code`radius = 3
area = 3.14 * radius * radius
print(area)`,
    task: {
      prompt: "Import `math` and use `math.pi`, rounding the area to two decimals. It should print `28.27`.",
      expectOutput: ["28.27"],
      mustInclude: ["import math|from math import"],
      hint: "`round(math.pi * radius ** 2, 2)` is the area to two decimal places.",
      solution: code`import math

radius = 3
print(round(math.pi * radius ** 2, 2))`,
    },
    practiceSlug: "py-modules-imports",
    module: "Errors, Files and Modules",
    tier: "intermediate",
  },
  {
    slug: "py-inheritance",
    order: 45,
    chapter: "Objects and Classes",
    kicker: "OBJECTS",
    title: "Inheritance",
    catalogTitle: "Inheritance",
    blurb: "Build new classes on top of old ones with inheritance and super().",
    catalogCode: "class Comet(SpaceObject):",
    intro:
      "A class can **inherit** from another: `class Comet(SpaceObject):` gets every method of `SpaceObject` for free. **Override** a method by defining it again in the child, and call the parent's version with `super()`. `isinstance(obj, SomeClass)` checks the type, and it counts parent classes too.",
    example: code`class SpaceObject:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"{self.name} drifts through space"

class Comet(SpaceObject):
    def __init__(self, name, tail_km):
        super().__init__(name)
        self.tail_km = tail_km

    def describe(self):
        return super().describe() + f" with a {self.tail_km} km tail"

halley = Comet("Halley", 10000)
print(halley.describe())
print(isinstance(halley, SpaceObject))`,
    reads: [
      { dot: DOT_PINK, text: "`Comet(SpaceObject)` means a Comet **is a** SpaceObject" },
      { dot: DOT_MINT, text: "`super().__init__(name)` runs the parent setup before adding more" },
      { dot: DOT_LAVENDER, text: "Overriding `describe` replaces it, and `super().describe()` still reaches the original" },
    ],
    tip: "Use inheritance for a true \"is a\" relationship. When one object merely uses another, keep it as an attribute instead.",
    starter: code`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

print(Animal("Rex").speak())`,
    task: {
      prompt: "Add a `Dog` class that inherits from `Animal` and overrides `speak` to return `Rex says woof` for a dog named Rex. Print `Dog(\"Rex\").speak()`.",
      expectOutput: ["Rex says woof"],
      mustInclude: ["class\\s+Dog\\s*\\(\\s*Animal\\s*\\)"],
      hint: "Inside `Dog`, define `speak(self)` returning `f\"{self.name} says woof\"`. It inherits `__init__` from Animal.",
      solution: code`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof"

print(Dog("Rex").speak())`,
    },
    practiceSlug: "py-inheritance",
    module: "Objects and Classes",
    tier: "intermediate",
  },
  {
    slug: "py-dunder-methods",
    order: 46,
    chapter: "Objects and Classes",
    kicker: "OBJECTS",
    title: "Special methods",
    catalogTitle: "Dunder methods",
    blurb: "Teach your classes to print, compare and add with __str__, __eq__ and friends.",
    catalogCode: "def __add__(self, other):",
    intro:
      "Methods wrapped in double underscores, like `__init__`, are **special methods** (people call them dunder methods). Python calls them for you: `__str__` when you `print` an object, `__repr__` for a developer view, `__eq__` for `==`, `__add__` for `+` and `__len__` for `len()`. Defining them makes your objects feel built in.",
    example: code`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

a = Vector(1, 2)
b = Vector(3, 4)
print(a + b)
print(a + b == Vector(4, 6))`,
    reads: [
      { dot: DOT_PINK, text: "`a + b` really calls `a.__add__(b)`" },
      { dot: DOT_MINT, text: "Without `__eq__`, `==` only checks whether two names point at the same object" },
      { dot: DOT_LAVENDER, text: "`__str__` decides what `print` shows" },
    ],
    tip: "Define `__repr__` too: it is what you see for objects inside lists and in error messages.",
    starter: code`class Playlist:
    def __init__(self, songs):
        self.songs = songs

p = Playlist(["Nova", "Drift", "Aurora"])
print(p.songs)`,
    task: {
      prompt: "Add `__len__` and `__str__` so `print(len(p))` prints `3` and `print(p)` prints `Playlist of 3 songs`. Print both, in that order.",
      expectOutput: ["3", "Playlist of 3 songs"],
      mustInclude: ["def __len__", "def __str__"],
      hint: "`__len__` returns `len(self.songs)`. `__str__` can call `len(self)`.",
      solution: code`class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)

    def __str__(self):
        return f"Playlist of {len(self)} songs"

p = Playlist(["Nova", "Drift", "Aurora"])
print(len(p))
print(p)`,
    },
    practiceSlug: "py-dunder-methods",
    module: "Objects and Classes",
    tier: "intermediate",
  },
  {
    slug: "py-dataclasses",
    order: 47,
    chapter: "Objects and Classes",
    kicker: "OBJECTS",
    title: "Data classes",
    catalogTitle: "Dataclasses",
    blurb: "Let @dataclass write __init__, __repr__ and __eq__ for you.",
    catalogCode: "@dataclass",
    intro:
      "`@dataclass` writes the repetitive parts of a class for you: `__init__`, a readable `__repr__` and `__eq__`, all generated from the field annotations. Give a field a default with `=`, and use `field(default_factory=list)` when each object needs its own fresh list.",
    example: code`from dataclasses import dataclass, field

@dataclass
class Star:
    name: str
    mag: float
    tags: list = field(default_factory=list)

vega = Star("Vega", 0.03)
vega.tags.append("bright")
print(vega)
print(vega == Star("Vega", 0.03, ["bright"]))`,
    reads: [
      { dot: DOT_PINK, text: "Each `name: type` line becomes a constructor parameter" },
      { dot: DOT_MINT, text: "The generated `__repr__` prints every field" },
      { dot: DOT_LAVENDER, text: "The generated `__eq__` compares field by field" },
    ],
    tip: "Add `frozen=True` (`@dataclass(frozen=True)`) for objects that should never change after they are made.",
    mistakes: ["`tags: list = []` is rejected: a shared list default would be the same list for every object. Use `field(default_factory=list)`."],
    starter: code`class Planet:
    def __init__(self, name, moons):
        self.name = name
        self.moons = moons

print(Planet("Mars", 2).name)`,
    task: {
      prompt: "Rewrite `Planet` as a `@dataclass` with fields `name: str` and `moons: int`, then print `Planet(\"Mars\", 2)` to show `Planet(name='Mars', moons=2)`.",
      expectOutput: ["Planet(name='Mars', moons=2)"],
      mustInclude: ["@dataclass"],
      hint: "Import it first: `from dataclasses import dataclass`. The class body only needs the two annotated fields.",
      solution: code`from dataclasses import dataclass

@dataclass
class Planet:
    name: str
    moons: int

print(Planet("Mars", 2))`,
    },
    practiceSlug: "py-dataclasses",
    module: "Objects and Classes",
    tier: "intermediate",
  },
  {
    slug: "py-type-hints",
    order: 48,
    chapter: "Objects and Classes",
    kicker: "OBJECTS",
    title: "Type hints",
    catalogTitle: "Type hints",
    blurb: "Label what your functions expect and return so tools can catch mistakes.",
    catalogCode: "def average(values: list[float]) -> float:",
    intro:
      "**Type hints** label what a variable or function expects: `def area(w: float, h: float) -> float:`. Python does not enforce them while running, but editors and checkers such as mypy read them to catch mistakes before you run, and they document your code for the next reader. `list[str]`, `dict[str, int]` and `str | None` describe containers and optional values.",
    example: code`def average(values: list[float]) -> float:
    return sum(values) / len(values)

def find(names: list[str], target: str) -> int | None:
    for i, name in enumerate(names):
        if name == target:
            return i
    return None

print(average([2.0, 4.0]))
print(find(["Vega", "Rigel"], "Rigel"))
print(find(["Vega"], "Sirius"))`,
    reads: [
      { dot: DOT_PINK, text: "`name: type` after each parameter, `-> type` for the return value" },
      { dot: DOT_MINT, text: "`int | None` means the function might return nothing" },
      { dot: DOT_LAVENDER, text: "Hints are notes for tools and people; the code runs the same without them" },
    ],
    tip: "Type hints pay off most on functions other people call. Start there.",
    starter: code`def greet(name, times):
    return (name + " ") * times

print(greet("hi", 2))`,
    task: {
      prompt:
        "Add type hints: `name` is a `str`, `times` is an `int`, and the function returns a `str`. Then print `greet.__annotations__` to see them: `{'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}`.",
      expectOutput: ["{'name': <class 'str'>, 'times': <class 'int'>, 'return': <class 'str'>}"],
      mustInclude: ["->\\s*str"],
      hint: "The signature becomes `def greet(name: str, times: int) -> str:`.",
      solution: code`def greet(name: str, times: int) -> str:
    return (name + " ") * times

print(greet.__annotations__)`,
    },
    practiceSlug: "py-type-hints",
    module: "Objects and Classes",
    tier: "intermediate",
  },
];
