import type { PracticeDataset } from "@/content/types";
import { code } from "@/content/code";


/** Practice drills for the lessons in lessons/python-advanced.ts. */
export const pythonAdvancedPractice: Record<string, PracticeDataset> = {
  "py-iterators": {
    prompt: "Arrange the lines to walk an iterator by hand.",
    parsonsFragments: [
      { id: "it1", text: 'it = iter(["a", "b"])', indent: 0 },
      { id: "it2", text: "print(next(it))", indent: 0 },
      { id: "it3", text: "print(next(it))", indent: 0 },
      { id: "it4", text: 'print(next(it, "end"))', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks for the two methods every iterator needs.",
    fadedLines: [
      { text: "def ___(self):", blanks: ["__iter__"] },
      { text: "    return self", blanks: [] },
      { text: "def ___(self):", blanks: ["__next__"] },
      { text: "    raise ___", blanks: ["StopIteration"] },
    ],
    fadedExplain: "`__iter__` returns the iterator and `__next__` hands out values until it raises StopIteration.",
    predictCode: code`it = iter([1, 2, 3])
print(next(it))
print(list(it))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1\n[2, 3]", correct: true, why: "next() used up the 1, so list() only collects what is left." },
      { id: "b", label: "1\n[1, 2, 3]", correct: false, why: "An iterator remembers its position; the 1 is already consumed." },
      { id: "c", label: "[1, 2, 3]\n1", correct: false, why: "The prints run in order: the next() call happens first." },
    ],
  },
  "py-closures": {
    prompt: "Arrange the lines to build a function that adds a fixed amount.",
    parsonsFragments: [
      { id: "cl1", text: "def make_adder(amount):", indent: 0 },
      { id: "cl2", text: "def add(n):", indent: 1 },
      { id: "cl3", text: "return n + amount", indent: 2 },
      { id: "cl4", text: "return add", indent: 1 },
      { id: "cl5", text: "print(make_adder(5)(10))", indent: 0 },
    ],
    fadedPrompt: "Fill the blank so the inner function can update the counter.",
    fadedLines: [
      { text: "def increment():", blanks: [] },
      { text: "    ___ count", blanks: ["nonlocal"] },
      { text: "    count += 1", blanks: [] },
    ],
    fadedExplain: "`nonlocal` tells Python the name belongs to the enclosing function.",
    predictCode: code`def outer():
    x = 1
    def inner():
        return x + 1
    x = 10
    return inner

print(outer()())`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "11", correct: true, why: "A closure reads the variable when it runs, and by then x is 10." },
      { id: "b", label: "2", correct: false, why: "Closures remember the variable, not its value at the moment inner was defined." },
      { id: "c", label: "NameError: name 'x' is not defined", correct: false, why: "inner can see x from outer's scope." },
    ],
  },
  "py-context-managers": {
    prompt: "Arrange the lines to write and use a context manager.",
    parsonsFragments: [
      { id: "cm1", text: "from contextlib import contextmanager", indent: 0 },
      { id: "cm2", text: "@contextmanager", indent: 0 },
      { id: "cm3", text: "def fence():", indent: 0 },
      { id: "cm4", text: 'print("open")', indent: 1 },
      { id: "cm5", text: "yield", indent: 1 },
      { id: "cm6", text: 'print("close")', indent: 1 },
      { id: "cm7", text: "with fence():", indent: 0 },
      { id: "cm8", text: 'print("inside")', indent: 1 },
    ],
    fadedPrompt: "Fill the blanks for a class-based context manager.",
    fadedLines: [
      { text: "def ___(self):", blanks: ["__enter__"] },
      { text: "    return self", blanks: [] },
      { text: "def ___(self, *args):", blanks: ["__exit__"] },
      { text: '    print("cleanup")', blanks: [] },
    ],
    fadedExplain: "`__enter__` runs at the start of the with block and `__exit__` runs at the end.",
    predictCode: code`class Door:
    def __enter__(self):
        print("open")
        return self

    def __exit__(self, *args):
        print("close")

with Door():
    print("walk through")`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "open\nwalk through\nclose", correct: true, why: "__enter__ runs first, then the block, then __exit__." },
      { id: "b", label: "walk through", correct: false, why: "The with statement calls __enter__ and __exit__ around the block." },
      { id: "c", label: "open\nclose\nwalk through", correct: false, why: "__exit__ waits until the block has finished." },
    ],
  },
  "py-itertools-functools": {
    prompt: "Arrange the lines to multiply a list together with reduce.",
    parsonsFragments: [
      { id: "if1", text: "from functools import reduce", indent: 0 },
      { id: "if2", text: "nums = [2, 3, 4]", indent: 0 },
      { id: "if3", text: "product = reduce(lambda a, b: a * b, nums)", indent: 0 },
      { id: "if4", text: "print(product)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to join two lists and pre-fill an argument.",
    fadedLines: [
      { text: "both = list(___([1], [2]))", blanks: ["chain"] },
      { text: "square = ___(power, exp=2)", blanks: ["partial"] },
    ],
    fadedExplain: "`chain` joins iterables and `partial` fixes some arguments in advance.",
    predictCode: code`from itertools import permutations
print(len(list(permutations([1, 2, 3]))))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "6", correct: true, why: "Three items can be ordered in 3 x 2 x 1 = 6 ways." },
      { id: "b", label: "3", correct: false, why: "That would be combinations of two, where order does not matter." },
      { id: "c", label: "9", correct: false, why: "Permutations do not reuse items, so there are 6, not 3 x 3." },
    ],
  },
  "py-regex": {
    prompt: "Arrange the lines to find every number in a sentence.",
    parsonsFragments: [
      { id: "rx1", text: "import re", indent: 0 },
      { id: "rx2", text: 'text = "3 moons and 12 stars"', indent: 0 },
      { id: "rx3", text: 'numbers = re.findall(r"\\d+", text)', indent: 0 },
      { id: "rx4", text: "print(numbers)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to replace every digit with a star.",
    fadedLines: [{ text: 're.___(r"___", "*", "a1b2")', blanks: ["sub", "\\d"] }],
    fadedExplain: "`re.sub(pattern, replacement, text)` replaces every match, and `\\d` matches one digit.",
    predictCode: code`import re
print(re.findall(r"[aeiou]", "nebula"))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "['e', 'u', 'a']", correct: true, why: "The character class matches each vowel in order." },
      { id: "b", label: "['n', 'b', 'l']", correct: false, why: "`[aeiou]` matches vowels, not consonants." },
      { id: "c", label: "3", correct: false, why: "findall returns the matches themselves, not a count." },
    ],
  },
  "py-big-o": {
    prompt: "Arrange the lines to check for duplicates in one pass.",
    parsonsFragments: [
      { id: "bo1", text: "seen = set()", indent: 0 },
      { id: "bo2", text: "for x in items:", indent: 0 },
      { id: "bo3", text: "if x in seen:", indent: 1 },
      { id: "bo4", text: 'print("duplicate")', indent: 2 },
      { id: "bo5", text: "seen.add(x)", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks with the growth rate of each operation.",
    fadedLines: [
      { text: "# looking up a key in a dict: O(___)", blanks: ["1"] },
      { text: "# comparing every pair in a list: O(n^___)", blanks: ["2"] },
    ],
    fadedExplain: "Dict lookups take constant time, while comparing every pair grows with n squared.",
    predictCode: code`steps = 0
n = 8
while n > 1:
    n = n // 2
    steps += 1
print(steps)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "8 halves to 4, 2, then 1: three steps. Halving loops are O(log n)." },
      { id: "b", label: "8", correct: false, why: "The loop halves n each time instead of counting down by one." },
      { id: "c", label: "4", correct: false, why: "The loop stops once n reaches 1, after three halvings." },
    ],
  },
  "py-recursion": {
    prompt: "Arrange the lines to add up the numbers from n down to 1 recursively.",
    parsonsFragments: [
      { id: "rc1", text: "def total(n):", indent: 0 },
      { id: "rc2", text: "if n == 0:", indent: 1 },
      { id: "rc3", text: "return 0", indent: 2 },
      { id: "rc4", text: "return n + total(n - 1)", indent: 1 },
      { id: "rc5", text: "print(total(3))", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks for the base case and the smaller call.",
    fadedLines: [
      { text: "def factorial(n):", blanks: [] },
      { text: "    if n <= ___:", blanks: ["1"] },
      { text: "        return 1", blanks: [] },
      { text: "    return n * factorial(___)", blanks: ["n - 1"] },
    ],
    fadedExplain: "The base case stops at 1, and each call works on n - 1.",
    predictCode: code`def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)

print(f(4))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "10", correct: true, why: "4 + 3 + 2 + 1 + 0 = 10." },
      { id: "b", label: "4", correct: false, why: "Each call adds its n to the result of the smaller call." },
      { id: "c", label: "RecursionError: maximum recursion depth exceeded", correct: false, why: "The base case n == 0 stops the calls." },
    ],
  },
  "py-searching": {
    prompt: "Arrange the lines of a binary search loop.",
    parsonsFragments: [
      { id: "sr1", text: "while low <= high:", indent: 0 },
      { id: "sr2", text: "mid = (low + high) // 2", indent: 1 },
      { id: "sr3", text: "if items[mid] < target:", indent: 1 },
      { id: "sr4", text: "low = mid + 1", indent: 2 },
      { id: "sr5", text: "else:", indent: 1 },
      { id: "sr6", text: "high = mid - 1", indent: 2 },
    ],
    fadedPrompt: "Fill the blanks to set up the search window.",
    fadedLines: [{ text: "low, high = ___, len(items) - ___", blanks: ["0", "1"] }],
    fadedExplain: "The window starts at index 0 and ends at the last index, len(items) - 1.",
    predictCode: code`items = [1, 3, 5, 7, 9, 11, 13]
low, high = 0, len(items) - 1
mid = (low + high) // 2
print(mid, items[mid])`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3 7", correct: true, why: "(0 + 6) // 2 is 3, and items[3] is 7." },
      { id: "b", label: "3 5", correct: false, why: "Index 3 is the fourth item, which is 7." },
      { id: "c", label: "3.5 7", correct: false, why: "`//` floor divides, so mid is the whole number 3." },
    ],
  },
  "py-sorting-algorithms": {
    prompt: "Arrange the lines of merge sort.",
    parsonsFragments: [
      { id: "so1", text: "def merge_sort(items):", indent: 0 },
      { id: "so2", text: "if len(items) <= 1:", indent: 1 },
      { id: "so3", text: "return items", indent: 2 },
      { id: "so4", text: "mid = len(items) // 2", indent: 1 },
      { id: "so5", text: "left = merge_sort(items[:mid])", indent: 1 },
      { id: "so6", text: "right = merge_sort(items[mid:])", indent: 1 },
      { id: "so7", text: "return merge(left, right)", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks: shift bigger items right while inserting.",
    fadedLines: [
      { text: "while j >= 0 and items[j] ___ current:", blanks: [">"] },
      { text: "    items[j + 1] = items[___]", blanks: ["j"] },
      { text: "    j -= 1", blanks: [] },
    ],
    fadedExplain: "Insertion sort moves each larger item one place right to open a gap for current.",
    predictCode: code`print(sorted([3, 1, 2]) == [1, 2, 3], sorted("bca"))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True ['a', 'b', 'c']", correct: true, why: "sorted returns a list, even when you give it a string." },
      { id: "b", label: "True abc", correct: false, why: "sorted always returns a list of the characters." },
      { id: "c", label: "False ['a', 'b', 'c']", correct: false, why: "sorted([3, 1, 2]) is exactly [1, 2, 3]." },
    ],
  },
  "py-stacks-queues": {
    prompt: "Arrange the lines to serve a queue in order.",
    parsonsFragments: [
      { id: "sq1", text: "from collections import deque", indent: 0 },
      { id: "sq2", text: 'line = deque(["Nova", "Luka"])', indent: 0 },
      { id: "sq3", text: "while line:", indent: 0 },
      { id: "sq4", text: "print(line.popleft())", indent: 1 },
    ],
    fadedPrompt: "Fill the blanks: push onto a stack, then take the top.",
    fadedLines: [
      { text: 'stack.___("page")', blanks: ["append"] },
      { text: "top = stack.___()", blanks: ["pop"] },
    ],
    fadedExplain: "A list works as a stack with append to push and pop to take the most recent item.",
    predictCode: code`from collections import deque
q = deque([1, 2, 3])
q.append(4)
q.popleft()
q.appendleft(0)
print(list(q))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[0, 2, 3, 4]", correct: true, why: "4 joins the back, 1 leaves the front, then 0 joins the front." },
      { id: "b", label: "[0, 1, 2, 3, 4]", correct: false, why: "popleft removed the 1." },
      { id: "c", label: "[2, 3, 4, 0]", correct: false, why: "appendleft adds to the front, not the back." },
    ],
  },
  "py-hashing-patterns": {
    prompt: "Arrange the lines to count words with a dict.",
    parsonsFragments: [
      { id: "hp1", text: "counts = {}", indent: 0 },
      { id: "hp2", text: "for w in words:", indent: 0 },
      { id: "hp3", text: "counts[w] = counts.get(w, 0) + 1", indent: 1 },
      { id: "hp4", text: "print(counts)", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to group words by their first letter.",
    fadedLines: [
      { text: "groups = defaultdict(___)", blanks: ["list"] },
      { text: "groups[w[0]].___(w)", blanks: ["append"] },
    ],
    fadedExplain: "defaultdict(list) makes a fresh list for each new key, ready to append to.",
    predictCode: code`from collections import Counter
print(Counter("banana")["a"])`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "\"banana\" has three a's." },
      { id: "b", label: "2", correct: false, why: "Count them: b-a-n-a-n-a has three." },
      { id: "c", label: "KeyError: 'a'", correct: false, why: "Counter counts every letter, and a is present." },
    ],
  },
  "py-memoization": {
    prompt: "Arrange the lines to cache a recursive function.",
    parsonsFragments: [
      { id: "me1", text: "from functools import lru_cache", indent: 0 },
      { id: "me2", text: "@lru_cache(maxsize=None)", indent: 0 },
      { id: "me3", text: "def fib(n):", indent: 0 },
      { id: "me4", text: "return n if n < 2 else fib(n - 1) + fib(n - 2)", indent: 1 },
      { id: "me5", text: "print(fib(50))", indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to check the memo before computing.",
    fadedLines: [
      { text: "if n ___ memo:", blanks: ["in"] },
      { text: "    return memo[___]", blanks: ["n"] },
    ],
    fadedExplain: "If the answer is already stored, return it instead of recomputing.",
    predictCode: code`memo = {}

def f(n):
    if n in memo:
        return "cached"
    memo[n] = n * n
    return memo[n]

print(f(3), f(3))`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "9 cached", correct: true, why: "The first call computes and stores 9; the second finds it in memo." },
      { id: "b", label: "9 9", correct: false, why: "This f returns the word \"cached\" when the key already exists." },
      { id: "c", label: "cached cached", correct: false, why: "memo starts empty, so the first call computes 9." },
    ],
  },
  "py-descriptors": {
    prompt: "Arrange the lines of a descriptor that doubles what it stores.",
    parsonsFragments: [
      { id: "de1", text: "class Doubled:", indent: 0 },
      { id: "de2", text: "def __set_name__(self, owner, name):", indent: 1 },
      { id: "de3", text: 'self.private = "_" + name', indent: 2 },
      { id: "de4", text: "def __get__(self, obj, owner):", indent: 1 },
      { id: "de5", text: "return getattr(obj, self.private) * 2", indent: 2 },
    ],
    fadedPrompt: "Fill the blanks for the method that runs on assignment.",
    fadedLines: [
      { text: "def ___(self, obj, value):", blanks: ["__set__"] },
      { text: "    ___(obj, self.private, value)", blanks: ["setattr"] },
    ],
    fadedExplain: "`__set__` runs on every assignment and stores the value with setattr.",
    predictCode: code`class Loud:
    def __get__(self, obj, owner):
        return "LOUD"

class A:
    x = Loud()

a = A()
print(a.x, A.x)`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "LOUD LOUD", correct: true, why: "__get__ runs for reads through both the instance and the class." },
      { id: "b", label: "LOUD <__main__.Loud object>", correct: false, why: "This __get__ ignores obj, so class access returns LOUD too." },
      { id: "c", label: "AttributeError: x", correct: false, why: "x is defined on the class as a descriptor." },
    ],
  },
  "py-testing": {
    prompt: "Arrange the lines of a small unittest test case.",
    parsonsFragments: [
      { id: "te1", text: "import unittest", indent: 0 },
      { id: "te2", text: "class MathTests(unittest.TestCase):", indent: 0 },
      { id: "te3", text: "def test_add(self):", indent: 1 },
      { id: "te4", text: "self.assertEqual(1 + 1, 2)", indent: 2 },
    ],
    fadedPrompt: "Fill the blank to check a value with a plain assert.",
    fadedLines: [{ text: '___ slugify("A B") == "a-b"', blanks: ["assert"] }],
    fadedExplain: "`assert condition` raises AssertionError when the condition is false.",
    predictCode: code`def half(n):
    return n // 2

assert half(10) == 5
assert half(7) == 3
print("ok")`,
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "ok", correct: true, why: "7 // 2 is 3, so both asserts hold and the print runs." },
      { id: "b", label: "AssertionError", correct: false, why: "Floor division makes half(7) equal 3, so the assert passes." },
      { id: "c", label: "Nothing at all", correct: false, why: "Passing asserts are silent, then print runs." },
    ],
  },
};
