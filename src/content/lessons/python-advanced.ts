import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";


/**
 * Python advanced topics, the Algorithms and Problem Solving chapter, and the
 * extra expert lessons added in the second curriculum pass.
 */
export const pythonAdvancedLessons: Lesson[] = [
  {
    slug: "py-iterators",
    order: 49,
    chapter: "Python Advanced",
    kicker: "PYTHON ADVANCED",
    title: "Iterators and the for loop",
    catalogTitle: "Iterators",
    blurb: "See what a for loop really does with iter(), next() and your own iterator classes.",
    catalogCode: "next(it)",
    intro:
      "A `for` loop works on anything **iterable**. Under the hood it calls `iter()` to get an **iterator**, then calls `next()` on it again and again until the iterator raises `StopIteration`. Build your own iterator by giving a class `__iter__` and `__next__`. Iterators are lazy: they hand out one value at a time instead of building a whole list.",
    example: code`colors = ["red", "gold"]
it = iter(colors)
print(next(it))
print(next(it))
print(next(it, "done"))

class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

print(list(Countdown(3)))`,
    reads: [
      { dot: DOT_PINK, text: "`iter(colors)` gives an iterator; each `next()` hands out one item" },
      { dot: DOT_MINT, text: "`next(it, \"done\")` returns the default instead of raising when it runs out" },
      { dot: DOT_LAVENDER, text: "`__next__` raising **StopIteration** is how a loop knows to stop" },
    ],
    tip: "An iterator can only be walked once. Call `list(...)` if you need to loop over the values twice.",
    starter: code`class Evens:
    def __init__(self, limit):
        self.limit = limit
        self.n = 0

    def __iter__(self):
        return self

    # add __next__ here

print("write __next__ first")`,
    task: {
      prompt: "Give `Evens` a `__next__` method so it hands out 0, 2, 4 and so on below `limit`. `print(list(Evens(7)))` should print `[0, 2, 4, 6]`.",
      expectOutput: ["[0, 2, 4, 6]"],
      mustInclude: ["def __next__"],
      hint: "Raise `StopIteration` once `self.n >= self.limit`; otherwise save `self.n`, add 2, and return the saved value.",
      solution: code`class Evens:
    def __init__(self, limit):
        self.limit = limit
        self.n = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.n >= self.limit:
            raise StopIteration
        value = self.n
        self.n += 2
        return value

print(list(Evens(7)))`,
    },
    practiceSlug: "py-iterators",
    module: "Python Advanced",
    tier: "advanced",
  },
  {
    slug: "py-closures",
    order: 51,
    chapter: "Python Advanced",
    kicker: "PYTHON ADVANCED",
    title: "Closures",
    catalogTitle: "Closures",
    blurb: "Functions that remember the variables around them.",
    catalogCode: "return multiply",
    intro:
      "A function defined inside another function can use the outer function's variables, even after the outer function has finished. The inner function plus the variables it remembers is called a **closure**. Closures let you build customized functions on the fly. Use `nonlocal` when the inner function needs to change a remembered variable.",
    example: code`def make_multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))

def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

tick = make_counter()
tick()
tick()
print(tick())`,
    reads: [
      { dot: DOT_PINK, text: "`multiply` remembers `factor` from the call that created it" },
      { dot: DOT_MINT, text: "Each call to `make_multiplier` makes a separate closure with its own factor" },
      { dot: DOT_LAVENDER, text: "`nonlocal count` lets the inner function update the outer variable" },
    ],
    tip: "Decorators are built from closures: the wrapper function remembers the function it wraps.",
    mistakes: ["Assigning to an outer variable without `nonlocal` makes a new local variable, which raises UnboundLocalError when you read it first."],
    starter: code`def make_greeter(greeting):
    pass

hello = make_greeter("Hello")
print(hello)`,
    task: {
      prompt: "Make `make_greeter` return an inner function that takes a name and returns `\"{greeting}, {name}!\"`. Then `print(hello(\"Nova\"))` should show `Hello, Nova!`.",
      expectOutput: ["Hello, Nova!"],
      mustInclude: ["def\\s+\\w+\\s*\\(\\s*name\\s*\\)"],
      hint: "Inside `make_greeter`, define `def greet(name): return f\"{greeting}, {name}!\"`, then `return greet`.",
      solution: code`def make_greeter(greeting):
    def greet(name):
        return f"{greeting}, {name}!"
    return greet

hello = make_greeter("Hello")
print(hello("Nova"))`,
    },
    practiceSlug: "py-closures",
    module: "Python Advanced",
    tier: "advanced",
  },
  {
    slug: "py-context-managers",
    order: 53,
    chapter: "Python Advanced",
    kicker: "PYTHON ADVANCED",
    title: "Context managers",
    catalogTitle: "Context managers",
    blurb: "Guarantee setup and cleanup with the with statement.",
    catalogCode: "@contextmanager",
    intro:
      "A **context manager** sets something up and guarantees it gets cleaned up, even if an error happens halfway through. `with open(...) as f:` closes the file for you. Write your own with a class that has `__enter__` and `__exit__`, or more simply with `@contextmanager` from `contextlib` around a generator: the code before `yield` is setup, and the code after it is cleanup.",
    example: code`from contextlib import contextmanager

@contextmanager
def announce(task):
    print(f"start {task}")
    try:
        yield task.upper()
    finally:
        print(f"end {task}")

with announce("launch") as label:
    print("inside with", label)`,
    reads: [
      { dot: DOT_PINK, text: "Everything before `yield` runs when the `with` block starts" },
      { dot: DOT_MINT, text: "The yielded value becomes the name after `as`" },
      { dot: DOT_LAVENDER, text: "`finally` makes sure the cleanup runs even if the block raises" },
    ],
    tip: "Reach for a context manager whenever something must be undone: closing files, releasing locks, restoring settings.",
    starter: code`from contextlib import contextmanager

# write indented() here

print("  hello")`,
    task: {
      prompt: "Write a context manager `indented()` with `@contextmanager` that prints `{` before the block and `}` after it, then use it so the program prints `{`, `hello` and `}` on three lines.",
      expectOutput: ["{", "hello", "}"],
      mustInclude: ["@contextmanager", "with\\s+indented\\(\\)"],
      hint: "Inside the generator: `print(\"{\")`, then `yield`, then `print(\"}\")`. Put the hello print inside `with indented():`.",
      solution: code`from contextlib import contextmanager

@contextmanager
def indented():
    print("{")
    yield
    print("}")

with indented():
    print("  hello")`,
    },
    practiceSlug: "py-context-managers",
    module: "Python Advanced",
    tier: "advanced",
  },
  {
    slug: "py-itertools-functools",
    order: 54,
    chapter: "Python Advanced",
    kicker: "PYTHON ADVANCED",
    title: "itertools and functools",
    catalogTitle: "itertools",
    blurb: "Combinations, chains, reduce and partial: loops and functions, pre-built.",
    catalogCode: 'combinations("ABC", 2)',
    intro:
      "The `itertools` module builds efficient loops for you: `chain` joins iterables end to end, `combinations` and `permutations` enumerate choices, `groupby` groups neighbouring items, and `count` counts forever. The `functools` module has tools for functions: `reduce` folds a list into one value, `partial` pre-fills some arguments, and `lru_cache` remembers results.",
    example: code`from itertools import chain, combinations
from functools import reduce, partial

print(list(chain([1, 2], [3])))
print(list(combinations("ABC", 2)))
print(reduce(lambda acc, n: acc * n, [1, 2, 3, 4]))

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(9))`,
    reads: [
      { dot: DOT_PINK, text: "`combinations(items, 2)` gives every pair, ignoring order" },
      { dot: DOT_MINT, text: "`reduce` carries an accumulator through the whole list" },
      { dot: DOT_LAVENDER, text: "`partial(power, exp=2)` is a new function with `exp` already filled in" },
    ],
    tip: "itertools functions return lazy iterators. Wrap them in `list()` when you want to see every value.",
    starter: code`from itertools import combinations

crew = ["Nova", "Luka", "Mira"]
print(crew)`,
    task: {
      prompt: "Print every possible pair from the crew as a list: `[('Nova', 'Luka'), ('Nova', 'Mira'), ('Luka', 'Mira')]`.",
      expectOutput: ["[('Nova', 'Luka'), ('Nova', 'Mira'), ('Luka', 'Mira')]"],
      mustInclude: ["combinations\\("],
      hint: "`list(combinations(crew, 2))`.",
      solution: code`from itertools import combinations

crew = ["Nova", "Luka", "Mira"]
print(list(combinations(crew, 2)))`,
    },
    practiceSlug: "py-itertools-functools",
    module: "Python Advanced",
    tier: "advanced",
  },
  {
    slug: "py-regex",
    order: 55,
    chapter: "Python Advanced",
    kicker: "PYTHON ADVANCED",
    title: "Regular expressions",
    catalogTitle: "Regex",
    blurb: "Find and replace text by pattern with the re module.",
    catalogCode: 're.findall(r"\\d+", text)',
    intro:
      "A **regular expression** is a pattern for matching text. The `re` module searches with it: `re.findall(pattern, text)` returns every match, `re.search` finds the first one, and `re.sub` replaces matches. Common pieces: `\\d` is a digit, `\\w` a word character, `+` means one or more, `*` zero or more, `[aeiou]` any one of these letters, and `( )` captures part of a match. Write patterns as raw strings, `r\"...\"`, so backslashes stay as typed.",
    example: code`import re

log = "Launch at 09:45, landing at 17:20, crew of 3"
print(re.findall(r"\d+", log))
print(re.findall(r"\d\d:\d\d", log))

match = re.search(r"crew of (\d+)", log)
print(match.group(1))
print(re.sub(r"\d", "#", "code 42"))`,
    reads: [
      { dot: DOT_PINK, text: "`\\d+` means one or more digits in a row" },
      { dot: DOT_MINT, text: "The parentheses in `(\\d+)` capture a part you can read with `group(1)`" },
      { dot: DOT_LAVENDER, text: "`re.sub` replaces every match with new text" },
    ],
    tip: "Regex is powerful but easy to misread. For simple jobs like splitting on commas, plain string methods are clearer.",
    mistakes: ["Forgetting the `r` prefix: in a normal string, `\"\\b\"` is a backspace character, not a word boundary."],
    starter: code`import re

message = "Orders: 12 stars, 7 comets, 30 moons"
print(message)`,
    task: {
      prompt: "Use `re.findall` to pull out the numbers, convert them to ints and print their total: `49`.",
      expectOutput: ["49"],
      mustInclude: ["re\\.findall"],
      hint: "`re.findall(r\"\\d+\", message)` returns a list of strings. Convert each with `int()` and add them up.",
      solution: code`import re

message = "Orders: 12 stars, 7 comets, 30 moons"
numbers = re.findall(r"\d+", message)
print(sum(int(n) for n in numbers))`,
    },
    practiceSlug: "py-regex",
    module: "Python Advanced",
    tier: "advanced",
  },
  {
    slug: "py-big-o",
    order: 56,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "How fast is my code?",
    catalogTitle: "Big O",
    blurb: "Count the steps your code takes as the input grows.",
    catalogCode: "O(n) vs O(n^2)",
    intro:
      "**Big O** describes how the amount of work grows as the input grows. Reading a list item by index is **O(1)**: one step no matter how long the list is. A single loop over n items is **O(n)**. A loop inside a loop over the same items is **O(n^2)**: double the input and the work quadruples. Counting the steps yourself is the best way to build a feel for it.",
    example: code`def count_steps_linear(items):
    steps = 0
    for _ in items:
        steps += 1
    return steps

def count_steps_pairs(items):
    steps = 0
    for _ in items:
        for _ in items:
            steps += 1
    return steps

for n in [10, 20, 40]:
    data = list(range(n))
    print(n, count_steps_linear(data), count_steps_pairs(data))`,
    reads: [
      { dot: DOT_PINK, text: "Doubling n doubles the linear count: **O(n)**" },
      { dot: DOT_MINT, text: "Doubling n quadruples the nested count: **O(n^2)**" },
      { dot: DOT_LAVENDER, text: "Checking `x in some_set` is O(1) on average; `x in some_list` is O(n)" },
    ],
    tip: "Ask \"what happens if the input is 1,000 times bigger?\" An O(n^2) answer that is fine for 100 items can take hours for 100,000.",
    deeper: [
      {
        title: "The common growth rates",
        body: "From fastest to slowest:\n\n- **O(1)**: constant, like indexing a list or a dict lookup\n- **O(log n)**: halving each step, like binary search\n- **O(n)**: one pass, like summing a list\n- **O(n log n)**: good sorting algorithms, like `sorted()`\n- **O(n^2)**: comparing every pair\n- **O(2^n)**: trying every subset, only workable for tiny inputs",
      },
    ],
    starter: code`def has_duplicate(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

print(has_duplicate([3, 1, 4, 1]))
print(has_duplicate([2, 7, 5]))`,
    task: {
      prompt: "`has_duplicate` compares every pair: O(n^2). Rewrite it in O(n) by remembering values you have already seen in a set. It should still print `True` then `False`.",
      expectOutput: ["True", "False"],
      mustInclude: ["set\\(\\)"],
      hint: "Start with `seen = set()`. For each item: if it is already in `seen`, return True; otherwise add it.",
      solution: code`def has_duplicate(items):
    seen = set()
    for item in items:
        if item in seen:
            return True
        seen.add(item)
    return False

print(has_duplicate([3, 1, 4, 1]))
print(has_duplicate([2, 7, 5]))`,
    },
    practiceSlug: "py-big-o",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-recursion",
    order: 57,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Recursion",
    catalogTitle: "Recursion",
    blurb: "Solve a problem by solving a smaller copy of it.",
    catalogCode: "return n * factorial(n - 1)",
    intro:
      "A **recursive** function calls itself on a smaller piece of the problem. Every recursive function needs a **base case** that stops the calls and a **recursive case** that moves toward it. Each call waits for the smaller call to finish and then builds its own answer from the result. Recursion shines on problems that are nested by nature, like folders inside folders.",
    example: code`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def total_size(item):
    if isinstance(item, int):
        return item
    return sum(total_size(child) for child in item)

print(factorial(5))
print(total_size([1, [2, 3], [[4], 5]]))`,
    reads: [
      { dot: DOT_PINK, text: "**Base case**: `n <= 1` returns an answer without recursing" },
      { dot: DOT_MINT, text: "**Recursive case**: `factorial(n - 1)` is a smaller version of the same problem" },
      { dot: DOT_LAVENDER, text: "`total_size` handles lists nested to any depth by recursing into each child" },
    ],
    tip: "Trust the recursion: assume the smaller call already works, and only think about how to use its answer.",
    mistakes: [
      "Forgetting the base case gives RecursionError: maximum recursion depth exceeded.",
      "Calling with the same size (`f(n)` instead of `f(n - 1)`) never reaches the base case.",
    ],
    starter: code`def countdown(n):
    print(n)

countdown(3)`,
    task: {
      prompt: "Make `countdown` recursive so it prints 3, 2, 1 and then `liftoff` when n reaches 0.",
      expectOutput: ["3", "2", "1", "liftoff"],
      mustInclude: ["countdown\\(\\s*n\\s*-\\s*1\\s*\\)"],
      hint: "Base case: if `n == 0`, print `liftoff` and return. Otherwise print n and call `countdown(n - 1)`.",
      solution: code`def countdown(n):
    if n == 0:
        print("liftoff")
        return
    print(n)
    countdown(n - 1)

countdown(3)`,
    },
    practiceSlug: "py-recursion",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-searching",
    order: 58,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Searching",
    catalogTitle: "Binary search",
    blurb: "Linear search checks everything; binary search halves the problem each step.",
    catalogCode: "mid = (low + high) // 2",
    intro:
      "**Linear search** checks items one by one: O(n), and it works on any list. **Binary search** needs a **sorted** list, but it is O(log n): look at the middle item, then throw away the half that cannot contain the target, and repeat. A million sorted items need at most about 20 checks.",
    example: code`def binary_search(items, target):
    low, high = 0, len(items) - 1
    steps = 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if items[mid] == target:
            return mid, steps
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps

heights = list(range(0, 1000, 5))
print(len(heights))
print(binary_search(heights, 735))
print(binary_search(heights, 3))`,
    reads: [
      { dot: DOT_PINK, text: "`low` and `high` mark the part of the list that could still hold the target" },
      { dot: DOT_MINT, text: "Each step discards half, so 200 items take at most 8 steps" },
      { dot: DOT_LAVENDER, text: "When `low` passes `high`, the target is not there" },
    ],
    tip: "Python's `bisect` module has binary search built in: `bisect.bisect_left(items, target)`.",
    mistakes: ["Running binary search on an unsorted list silently gives wrong answers."],
    starter: code`def find(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1

sorted_ids = [3, 8, 15, 16, 23, 30, 42, 57]
print(find(sorted_ids, 42))
print(find(sorted_ids, 5))`,
    task: {
      prompt: "Rewrite `find` as a binary search. It should still print `6` then `-1`.",
      expectOutput: ["6", "-1"],
      mustInclude: ["//\\s*2", "while"],
      hint: "Keep `low` and `high`. Look at `mid = (low + high) // 2`, then move `low` or `high` past it.",
      solution: code`def find(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

sorted_ids = [3, 8, 15, 16, 23, 30, 42, 57]
print(find(sorted_ids, 42))
print(find(sorted_ids, 5))`,
    },
    practiceSlug: "py-searching",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-sorting-algorithms",
    order: 59,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Sorting algorithms",
    catalogTitle: "Sorting",
    blurb: "Write insertion sort and merge sort to see how sorting works.",
    catalogCode: "merge(merge_sort(left), merge_sort(right))",
    intro:
      "Python's `sorted()` is fast, but writing a sort yourself teaches how algorithms think. **Insertion sort** grows a sorted section one item at a time, sliding each new item left into place: O(n^2), simple, and quick on small or nearly sorted lists. **Merge sort** splits the list in half, sorts each half recursively, then merges the two sorted halves: O(n log n) every time.",
    example: code`def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]

def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))

print(merge([1, 4, 9], [2, 3, 10]))
print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
    reads: [
      { dot: DOT_PINK, text: "`merge` walks two sorted lists at once, always taking the smaller front item" },
      { dot: DOT_MINT, text: "`merge_sort` splits until lists have one item, which are already sorted" },
      { dot: DOT_LAVENDER, text: "Then it merges back up, level by level" },
    ],
    tip: "In real code, call `sorted()`. It uses Timsort, a hybrid of merge sort and insertion sort tuned for real-world data.",
    starter: code`def insertion_sort(items):
    items = items[:]
    # grow a sorted section from the left
    return items

print(insertion_sort([5, 2, 9, 1, 5, 6]))`,
    task: {
      prompt: "Finish `insertion_sort` without calling `sorted()` or `.sort()`. It should print `[1, 2, 5, 5, 6, 9]`.",
      expectOutput: ["[1, 2, 5, 5, 6, 9]"],
      mustInclude: ["while|for"],
      hint: "For each position i from 1, save `current = items[i]`, shift bigger items one place right, then drop current into the gap.",
      solution: code`def insertion_sort(items):
    items = items[:]
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
    return items

print(insertion_sort([5, 2, 9, 1, 5, 6]))`,
    },
    practiceSlug: "py-sorting-algorithms",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-stacks-queues",
    order: 60,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Stacks and queues",
    catalogTitle: "Stacks & queues",
    blurb: "Last in, first out and first in, first out, with list and deque.",
    catalogCode: "queue.popleft()",
    intro:
      "A **stack** is last in, first out, like a pile of plates: push with `.append()` and pop with `.pop()`. A **queue** is first in, first out, like a line of people: use `collections.deque`, add with `.append()` and remove from the front with `.popleft()`, which is fast (unlike `list.pop(0)`). Stacks power undo and bracket matching; queues schedule work in order.",
    example: code`from collections import deque

stack = []
for step in ["type", "bold", "color"]:
    stack.append(step)
print("undo", stack.pop())

queue = deque(["Nova", "Luka"])
queue.append("Mira")
print("serve", queue.popleft())
print(list(queue))`,
    reads: [
      { dot: DOT_PINK, text: "`stack.pop()` takes the most recent item: the last thing done is the first undone" },
      { dot: DOT_MINT, text: "`queue.popleft()` takes the oldest item: first come, first served" },
      { dot: DOT_LAVENDER, text: "`deque` adds and removes at both ends in O(1)" },
    ],
    tip: "Whenever something must be matched in reverse order (brackets, tags, undo), think stack.",
    starter: code`def balanced(text):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    # push openers, pop and compare on closers
    return True

print(balanced("(a[b]{c})"))
print(balanced("(]"))
print(balanced("(("))`,
    task: {
      prompt: "Finish `balanced` with the stack so it prints `True`, `False`, `False`.",
      expectOutput: ["True", "False", "False"],
      mustInclude: ["\\.pop\\(\\)", "\\.append\\("],
      hint: "Push every opener. On a closer, the stack must be non-empty and `stack.pop()` must equal `pairs[ch]`. At the end the stack must be empty.",
      solution: code`def balanced(text):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(balanced("(a[b]{c})"))
print(balanced("(]"))
print(balanced("(("))`,
    },
    practiceSlug: "py-stacks-queues",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-hashing-patterns",
    order: 61,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Remember what you have seen",
    catalogTitle: "Hash map patterns",
    blurb: "Count, group and pair things in one pass with dicts and sets.",
    catalogCode: "if target - n in seen:",
    intro:
      "Dictionaries and sets look things up in O(1) on average, so many problems become fast when you **remember what you have already seen**. Count things with a dict or `Counter`. Group things with a dict of lists (`defaultdict(list)` saves the setup). Find two numbers that add up to a target in a single pass by storing each number as you go.",
    example: code`from collections import Counter, defaultdict

words = ["sun", "moon", "sun", "star", "moon", "sun"]
print(Counter(words).most_common(1))

by_length = defaultdict(list)
for w in words:
    by_length[len(w)].append(w)
print(dict(by_length))

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return seen[target - n], i
        seen[n] = i
    return None

print(two_sum([8, 3, 11, 5], 16))`,
    reads: [
      { dot: DOT_PINK, text: "`Counter` counts every item in one pass" },
      { dot: DOT_MINT, text: "`defaultdict(list)` creates an empty list the first time a key is used" },
      { dot: DOT_LAVENDER, text: "`two_sum` asks \"have I already seen the number I need?\" instead of checking every pair" },
    ],
    tip: "Trading memory for speed is the most common algorithm trick there is: store what you learn, never recompute it.",
    starter: code`def first_repeat(letters):
    return None

print(first_repeat("abcbd"))
print(first_repeat("xyz"))`,
    task: {
      prompt: "Make `first_repeat` return the first letter that appears for a second time, reading left to right, or `None`. Use a set. It should print `b` then `None`.",
      expectOutput: ["b", "None"],
      mustInclude: ["set\\(\\)"],
      hint: "Loop over the letters. If a letter is already in `seen`, return it; otherwise add it.",
      solution: code`def first_repeat(letters):
    seen = set()
    for ch in letters:
        if ch in seen:
            return ch
        seen.add(ch)
    return None

print(first_repeat("abcbd"))
print(first_repeat("xyz"))`,
    },
    practiceSlug: "py-hashing-patterns",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-memoization",
    order: 62,
    chapter: "Algorithms and Problem Solving",
    kicker: "ALGORITHMS",
    title: "Memoization",
    catalogTitle: "Memoization",
    blurb: "Save answers to repeated calls and turn exponential code into linear code.",
    catalogCode: "@lru_cache(maxsize=None)",
    intro:
      "**Memoization** saves the answer to every call so a repeated call is instant. The naive recursive Fibonacci recomputes the same values over and over, so its work explodes exponentially. Remembering results in a dictionary, or decorating the function with `@functools.lru_cache`, makes it linear. Reusing answers to smaller subproblems is the heart of **dynamic programming**.",
    example: code`from functools import lru_cache

calls = 0

def slow_fib(n):
    global calls
    calls += 1
    return n if n < 2 else slow_fib(n - 1) + slow_fib(n - 2)

print(slow_fib(20), calls)

@lru_cache(maxsize=None)
def fast_fib(n):
    return n if n < 2 else fast_fib(n - 1) + fast_fib(n - 2)

print(fast_fib(80))`,
    reads: [
      { dot: DOT_PINK, text: "`slow_fib(20)` makes over 20,000 calls to get one answer" },
      { dot: DOT_MINT, text: "`@lru_cache` stores each result, so every n is computed only once" },
      { dot: DOT_LAVENDER, text: "`fast_fib(80)` finishes instantly; `slow_fib(80)` would never finish" },
    ],
    tip: "Memoization only helps when the same inputs come up again. Look for recursion with overlapping calls.",
    starter: code`def ways(n):
    # ways to climb n stairs taking 1 or 2 steps at a time
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)

print(ways(10))`,
    task: {
      prompt: "Add a `memo` dictionary so `ways` never computes the same n twice, then print `ways(60)`: `2504730781961`.",
      expectOutput: ["2504730781961"],
      mustInclude: ["memo"],
      hint: "Before recursing, return `memo[n]` if it is there. After computing, store it in `memo[n]`.",
      solution: code`memo = {}

def ways(n):
    if n <= 1:
        return 1
    if n in memo:
        return memo[n]
    memo[n] = ways(n - 1) + ways(n - 2)
    return memo[n]

print(ways(60))`,
    },
    practiceSlug: "py-memoization",
    module: "Algorithms and Problem Solving",
    tier: "advanced",
  },
  {
    slug: "py-descriptors",
    order: 63,
    chapter: "Python Expert",
    kicker: "PYTHON EXPERT",
    title: "Descriptors",
    catalogTitle: "Descriptors",
    blurb: "Control reading and writing an attribute with __get__ and __set__.",
    catalogCode: "def __set__(self, obj, value):",
    intro:
      "A **descriptor** is an object that controls attribute access on another class. Any class with `__get__` (and optionally `__set__`) placed as a class attribute intercepts reads and writes of that attribute on every instance. Properties, methods and `@classmethod` are all built on descriptors. `__set_name__` tells the descriptor which attribute name it was given.",
    example: code`class Positive:
    def __set_name__(self, owner, name):
        self.private = "_" + name

    def __get__(self, obj, owner):
        return getattr(obj, self.private)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.private[1:]} must be positive")
        setattr(obj, self.private, value)

class Rocket:
    fuel = Positive()
    speed = Positive()

    def __init__(self, fuel, speed):
        self.fuel = fuel
        self.speed = speed

r = Rocket(100, 20)
print(r.fuel, r.speed)
try:
    r.speed = -5
except ValueError as e:
    print(e)`,
    reads: [
      { dot: DOT_PINK, text: "`fuel = Positive()` lives on the class, but guards every instance" },
      { dot: DOT_MINT, text: "`self.fuel = fuel` inside `__init__` actually calls `Positive.__set__`" },
      { dot: DOT_LAVENDER, text: "The real value is stored under a private name like `_fuel`" },
    ],
    tip: "One descriptor class can guard many attributes. That is what makes it better than writing a property for each one.",
    starter: code`class Upper:
    def __set_name__(self, owner, name):
        self.private = "_" + name
    # add __get__ and __set__

class Crew:
    name = Upper()

    def __init__(self, name):
        self.name = name

print(Crew("nova").name)`,
    task: {
      prompt: "Give `Upper` a `__get__` and a `__set__` that stores strings in capital letters, so the program prints `NOVA`.",
      expectOutput: ["NOVA"],
      mustInclude: ["def __get__", "def __set__"],
      hint: "`__set__(self, obj, value)` should `setattr(obj, self.private, value.upper())`, and `__get__` reads it back with `getattr`.",
      solution: code`class Upper:
    def __set_name__(self, owner, name):
        self.private = "_" + name

    def __get__(self, obj, owner):
        return getattr(obj, self.private)

    def __set__(self, obj, value):
        setattr(obj, self.private, value.upper())

class Crew:
    name = Upper()

    def __init__(self, name):
        self.name = name

print(Crew("nova").name)`,
    },
    practiceSlug: "py-descriptors",
    module: "Python Expert",
    tier: "expert",
  },
  {
    slug: "py-testing",
    order: 67,
    chapter: "Python Expert",
    kicker: "PYTHON EXPERT",
    title: "Testing your code",
    catalogTitle: "Testing",
    blurb: "Check your functions automatically with assert and unittest.",
    catalogCode: "assert add(2, 2) == 4",
    intro:
      "Tests are code that checks code. The simplest test is an `assert`: `assert add(2, 2) == 4` does nothing when true and raises AssertionError when false. The built-in `unittest` module groups tests into classes with helpful checks like `assertEqual`, and tools such as pytest run them for you. Writing a few tests for a tricky function catches a bug the moment you introduce it.",
    example: code`import unittest

def slugify(title):
    return title.strip().lower().replace(" ", "-")

class SlugifyTests(unittest.TestCase):
    def test_spaces(self):
        self.assertEqual(slugify("Night Sky"), "night-sky")

    def test_trim(self):
        self.assertEqual(slugify("  Moon "), "moon")

suite = unittest.TestLoader().loadTestsFromTestCase(SlugifyTests)
result = unittest.TextTestRunner(verbosity=0).run(suite)
print("all passed:", result.wasSuccessful())`,
    reads: [
      { dot: DOT_PINK, text: "Each `test_` method checks one behaviour" },
      { dot: DOT_MINT, text: "`assertEqual(actual, expected)` explains exactly what differed when it fails" },
      { dot: DOT_LAVENDER, text: "Good tests cover the edges: empty input, spaces, zero, negatives" },
    ],
    tip: "Found a bug? Write a test that fails because of it first, then fix the code. The bug can never quietly come back.",
    starter: code`def is_leap(year):
    return year % 4 == 0

assert is_leap(2024)
print("tests done")`,
    task: {
      prompt:
        "Add `assert not is_leap(1900)` and `assert is_leap(2000)`, then fix `is_leap` so every assert passes (years divisible by 100 are not leap years unless they are also divisible by 400). The program should still print `tests done`.",
      expectOutput: ["tests done"],
      mustInclude: ["assert\\s+not\\s+is_leap\\(\\s*1900\\s*\\)", "assert\\s+is_leap\\(\\s*2000\\s*\\)"],
      hint: "The rule is `year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`.",
      solution: code`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

assert is_leap(2024)
assert not is_leap(1900)
assert is_leap(2000)
print("tests done")`,
    },
    practiceSlug: "py-testing",
    module: "Python Expert",
    tier: "expert",
  },
];
