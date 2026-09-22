import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";
import { code } from "@/content/code";


export const pythonLessons: Lesson[] = [
  {
    slug: "variables",
    order: 1,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Boxes with names",
    catalogTitle: "Variables",
    blurb: "Name a piece of data and keep it in a box you can open later.",
    catalogCode: 'sky = "wide open"',
    intro:
      'A **variable** is a name you give to a value so you can use it again. Write the name, an equals sign, then the value. From then on the name stands in for the value.',
    example: `sky = "wide open"
stars = 100

print(sky)
print(stars)`,
    reads: [
      { dot: DOT_PINK, text: '**sky = "wide open"** stores the text on the right under the name sky' },
      { dot: DOT_MINT, text: "The name goes on the **left**, the value on the **right** of the =" },
      { dot: DOT_LAVENDER, text: "**print(sky)** shows whatever sky is holding right now" },
    ],
    tip: 'An **=** in Python means "put this value into this name". It is not the equals from math.',
    starter: `# give two things a name, then show them
mood = "dreamy"
hours = 8

print(mood)
print(hours)`,
    task: {
      prompt: "Add a third variable `place` holding `\"the roof\"` and print it last, so the output ends with `the roof`.",
      expectOutput: ["dreamy", "8", "the roof"],
      mustInclude: ["place\\s*="],
      hint: "Write `place = \"the roof\"` and add `print(place)` at the end.",
      solution: code`mood = "dreamy"
hours = 8
place = "the roof"

print(mood)
print(hours)
print(place)`,
    },
    practiceSlug: "variables",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "strings",
    order: 2,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Words and text",
    catalogTitle: "Strings",
    blurb: "Text lives inside quotes. Join it, repeat it, measure it.",
    catalogCode: 'name = "Nova"',
    intro:
      "A **string** is text wrapped in quotes. You can glue strings together with **+**, repeat them with `*`, and ask how long one is with **len()**.",
    example: `first = "night"
second = "sky"

print(first + " " + second)
print(first * 3)
print(len(first))`,
    reads: [
      { dot: DOT_PINK, text: '**+** joins strings end to end, so "night" + "sky" becomes "nightsky"' },
      { dot: DOT_MINT, text: '`*` repeats a string, so "night" * 3 is "nightnightnight"' },
      { dot: DOT_LAVENDER, text: "**len(first)** counts the characters, here 5" },
    ],
    tip: "Quotes can be \"double\" or 'single', as long as both ends match.",
    starter: `# build a greeting from pieces
who = "dreamer"
greeting = "hello, " + who

print(greeting)
print(greeting.upper())`,
    task: {
      prompt: "Print how many characters are in `greeting`. It should print `14`.",
      expectOutput: ["14"],
      mustInclude: ["len\\("],
      hint: "`len(greeting)` counts every character, including the comma and the space.",
      solution: code`who = "dreamer"
greeting = "hello, " + who

print(greeting)
print(greeting.upper())
print(len(greeting))`,
    },
    practiceSlug: "strings",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "comparisons",
    order: 8,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Comparing values",
    catalogTitle: "Comparisons",
    blurb: "Compare numbers and strings to produce True or False answers.",
    catalogCode: "sky_is_clear = clouds < 3",
    intro:
      "A **comparison** evaluates two values and returns a **boolean** value: either **True** or **False**. Use **==** to check if values are equal, **!=** for not equal, and **<**, **>**, **<=**, **>=** for numeric ordering.",
    example: `clouds = 2
clear = clouds < 5
print(clear)
print(clouds == 10)
print(clouds != 0)`,
    reads: [
      { dot: DOT_PINK, text: "**clouds < 5** checks if clouds is less than 5, giving True" },
      { dot: DOT_MINT, text: "**clouds == 10** checks for equality, giving False" },
      { dot: DOT_LAVENDER, text: "**clouds != 0** checks if clouds is not equal to 0, giving True" },
    ],
    tip: "In Python, double equals == is used to compare two things, while a single equals = is used to store a value in a variable.",
    starter: `# test comparisons on star counts
stars = 150
many_stars = stars > 100
print(many_stars)`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Add a second check that prints whether `stars` is between 100 and 200 using a chained comparison like `100 < stars < 200`. The output should be `True` and then `True`.",
      expectOutput: ["True", "True"],
      mustInclude: ["<\\s*stars\\s*<"],
      hint: "Python lets you chain comparisons: `print(100 < stars < 200)`.",
      solution: code`stars = 150
many_stars = stars > 100
print(many_stars)
print(100 < stars < 200)`,
    },
    practiceSlug: "comparisons",
  },
  {
    slug: "if-else",
    order: 9,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Branching paths",
    catalogTitle: "If & Else",
    blurb: "Use if and else to make your program take different paths.",
    catalogCode: "if clouds > 5:",
    intro:
      "An **if statement** runs a block of code only if a condition is **True**. An optional **else** block runs instead if the condition is **False**. Indent the code inside each block using spaces.",
    example: `sky = "rainy"
if sky == "clear":
    print("Go outside!")
else:
    print("Stay indoors.")`,
    reads: [
      { dot: DOT_PINK, text: '**if sky == "clear":** checks if the variable matches "clear"' },
      { dot: DOT_MINT, text: "The indented lines run only if their corresponding condition is met" },
      { dot: DOT_LAVENDER, text: "**else:** captures any case where the condition was False" },
    ],
    tip: "Python uses indentation (4 spaces) to group blocks of code. Always make sure your indentation matches.",
    starter: `# an if-else statement that checks the temperature
temp = 15
if temp > 20:
    print("Warm sky")
else:
    print("Cold sky")`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Change only the value of `temp` so the program takes the other branch and prints `Warm sky`.",
      expectOutput: ["Warm sky"],
      mustInclude: ["if\\s+temp"],
      hint: "The if branch runs when `temp > 20`. Try `temp = 27`.",
      solution: code`temp = 27
if temp > 20:
    print("Warm sky")
else:
    print("Cold sky")`,
    },
    practiceSlug: "if-else",
  },
  {
    slug: "elif-chains",
    order: 10,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Multiple choices",
    catalogTitle: "Elif chains",
    blurb: "Link multiple conditions together to handle many different cases.",
    catalogCode: "elif status == 'dawn':",
    intro:
      "When you have more than two possibilities, use **elif** (short for else-if) to check additional conditions. Python checks them in order and runs the first one that is **True**.",
    example: `hour = 12
if hour < 12:
    print("Morning")
elif hour < 18:
    print("Afternoon")
else:
    print("Night")`,
    reads: [
      { dot: DOT_PINK, text: "**if hour < 12:** is checked first" },
      { dot: DOT_MINT, text: "**elif hour < 18:** is checked only if the first condition was False" },
      { dot: DOT_LAVENDER, text: "**else:** runs if none of the conditions above were True" },
    ],
    tip: "You can have as many elif blocks as you need, but you can only have one if at the start and one else at the end.",
    starter: `# categorize cloud cover
clouds = 8
if clouds == 0:
    print("Sunny")
elif clouds < 5:
    print("Partly cloudy")
else:
    print("Overcast")`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Add another `elif` so 5 or 6 clouds prints `Mostly cloudy`, then set `clouds = 6` to see it.",
      expectOutput: ["Mostly cloudy"],
      mustInclude: ["elif"],
      hint: "Branches are checked top to bottom, so put `elif clouds < 7:` before the else.",
      solution: code`clouds = 6
if clouds == 0:
    print("Sunny")
elif clouds < 5:
    print("Partly cloudy")
elif clouds < 7:
    print("Mostly cloudy")
else:
    print("Overcast")`,
    },
    practiceSlug: "elif-chains",
  },
  {
    slug: "logical-operators",
    order: 11,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Combining checks",
    catalogTitle: "Boolean operators",
    blurb: "Use and, or, and not to combine multiple conditions together.",
    catalogCode: "if sun and not rain:",
    intro:
      "Combine boolean values using logical operators: **and** (True if both sides are True), **or** (True if at least one side is True), and **not** (flips True to False and vice versa).",
    example: `day = "Sunday"
temp = 25
if day == "Sunday" and temp > 20:
    print("Picnic time!")
if not (temp < 10):
    print("Not freezing")`,
    reads: [
      { dot: DOT_PINK, text: "**day == \"Sunday\" and temp > 20** requires both statements to be True" },
      { dot: DOT_MINT, text: "**not (temp < 10)** returns True if temp is 10 or greater" },
    ],
    tip: "Use parentheses to group logical checks and make the order of comparison clear.",
    starter: `# check if you can see stars
clear_sky = True
lights_off = False
if clear_sky and lights_off:
    print("Stars visible")
else:
    print("No stargazing")`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Add `raining = False` and include `not raining` in the check, then set `lights_off = True` so the program prints `Stars visible`.",
      expectOutput: ["Stars visible"],
      mustInclude: ["\\bnot\\s+raining\\b"],
      hint: "The condition becomes `clear_sky and lights_off and not raining`.",
      solution: code`clear_sky = True
lights_off = True
raining = False
if clear_sky and lights_off and not raining:
    print("Stars visible")
else:
    print("No stargazing")`,
    },
    practiceSlug: "logical-operators",
  },
  {
    slug: "nested-conditions",
    order: 12,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Indented checks",
    catalogTitle: "Nested checks",
    blurb: "Nesting if statements inside other if statements or loops.",
    catalogCode: "if a:\n    if b:",
    intro:
      "You can place if statements **inside** other if statements. This is called nesting. The inner check only runs if the outer check succeeds. You can also nest conditionals inside loops.",
    example: `sky = "cloudy"
rain = True
if sky == "cloudy":
    if rain:
        print("Bring umbrella!")
    else:
        print("Just cloudy")`,
    reads: [
      { dot: DOT_PINK, text: "**if sky == \"cloudy\":** checks the outer condition" },
      { dot: DOT_MINT, text: "**if rain:** checks the inner condition only when the outer is True" },
    ],
    tip: "Every level of nesting adds another 4 spaces of indentation. Keep nesting shallow so your code stays readable.",
    starter: `# check coordinate values
x = 5
y = 10
if x > 0:
    if y > 0:
        print("Positive quadrant")`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Give the inner check an `else` that prints `Fourth quadrant`, then set `y = -3` to reach it.",
      expectOutput: ["Fourth quadrant"],
      mustInclude: ["else"],
      hint: "Indent the `else:` to line up with the inner `if y > 0:`.",
      solution: code`x = 5
y = -3
if x > 0:
    if y > 0:
        print("Positive quadrant")
    else:
        print("Fourth quadrant")`,
    },
    practiceSlug: "nested-conditions",
  },
  {
    slug: "loops",
    order: 13,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "The for loop",
    catalogTitle: "Loops",
    blurb: "Do it again, once per cloud, without copying a single line.",
    catalogCode: "for cloud in sky:",
    intro:
      "Sometimes you want to do the same thing many times, say hello to every cloud in the sky. Instead of copying a line over and over, a **for loop** repeats it for you, once per item.",
    example: `for cloud in range(3):
    print("hop!")`,
    reads: [
      { dot: DOT_PINK, text: '**for cloud in range(3)** means "for each of 3 turns, call the current turn cloud"' },
      { dot: DOT_MINT, text: "The **indented line** is the part that repeats. Python knows it belongs to the loop because of the spaces" },
      { dot: DOT_LAVENDER, text: "**range(3)** counts 0, 1, 2, three numbers, starting at zero" },
    ],
    tip: "Loops start counting at 0, not 1. Nearly every programmer has tripped on this, now you won't.",
    starter: `# hop across every cloud in the sky
sky = ["cumulus", "cirrus", "stratus"]

for cloud in sky:
    print("hop →", cloud)`,
    task: {
      prompt: "Add `\"nimbus\"` to the list, and after the loop print how many clouds there are in the form `4 clouds`, using `len(sky)`.",
      expectOutput: ["4 clouds"],
      mustInclude: ["nimbus", "len\\(\\s*sky\\s*\\)"],
      hint: "After the loop (not indented), `print(len(sky), \"clouds\")`.",
      solution: code`sky = ["cumulus", "cirrus", "stratus", "nimbus"]

for cloud in sky:
    print("hop", cloud)
print(len(sky), "clouds")`,
    },
    practiceSlug: "loops",
    module: "Loops and iteration",
    tier: "beginner",
  },
  {
    slug: "for-over-range",
    order: 14,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Counting with range",
    catalogTitle: "Range loops",
    blurb: "Generate sequences of numbers to repeat blocks of code dynamically.",
    catalogCode: "for i in range(1, 6):",
    intro:
      "The **range()** function is incredibly flexible. You can tell it where to **start** and where to **stop**. Remember, Python stops **just before** the stop number.",
    example: `for i in range(1, 4):
    print(i)`,
    reads: [
      { dot: DOT_PINK, text: "**range(1, 4)** generates numbers starting at 1 and stopping before 4 (1, 2, 3)" },
      { dot: DOT_MINT, text: "**print(i)** runs once for each of those numbers" },
    ],
    tip: "If you call range(stop), it starts at 0. If you call range(start, stop), it starts at start.",
    starter: `# a loop that prints the numbers from 5 to 7
for i in range(5, 8):
    print(i)`,
    task: {
      prompt: "Change the range so the loop counts down from 10 to 0 in steps of 2: `10`, `8`, `6`, `4`, `2`, `0`.",
      expectOutput: ["10", "8", "6", "4", "2", "0"],
      mustInclude: ["range\\("],
      hint: "`range(start, stop, step)` with a negative step counts down, and stop is not included: `range(10, -1, -2)`.",
      solution: code`for i in range(10, -1, -2):
    print(i)`,
    },
    practiceSlug: "for-over-range",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "for-over-collections",
    order: 15,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Climbing collections",
    catalogTitle: "Collection loops",
    blurb: "Iterate through lists and strings to process every item.",
    catalogCode: "for char in word:",
    intro:
      "You can loop over lists, but did you know you can also loop over **strings**? A loop over a string goes character by character, processing one letter at a time.",
    example: `word = "neon"
for char in word:
    print(char.upper())`,
    reads: [
      { dot: DOT_PINK, text: "**for char in word:** assigns each letter of \"neon\" to char in sequence" },
      { dot: DOT_MINT, text: "**char.upper()** converts the current letter to uppercase" },
    ],
    tip: "Looping through characters or items is called **iteration**. It is one of the most common tasks in programming.",
    starter: `# print each character of the sky name
sky = "dusk"
for letter in sky:
    print("letter:", letter)`,
    task: {
      prompt: "Loop over the letters of `\"moonlight\"` and count the vowels (a, e, i, o, u). Print the count: `3`.",
      expectOutput: ["3"],
      mustInclude: ["for\\s+\\w+\\s+in"],
      hint: "Start `count = 0`, and inside the loop `if letter in \"aeiou\": count += 1`.",
      solution: code`word = "moonlight"
count = 0
for letter in word:
    if letter in "aeiou":
        count += 1
print(count)`,
    },
    practiceSlug: "for-over-collections",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "while-loops",
    order: 16,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Looping while true",
    catalogTitle: "While loops",
    blurb: "Keep repeating your code as long as a condition remains true.",
    catalogCode: "while battery > 0:",
    intro:
      "A **while loop** keeps running as long as a **condition** remains **True**. You must make sure the condition eventually becomes **False**, or your loop will run forever (an infinite loop).",
    example: `stars = 3
while stars > 0:
    print("star!")
    stars = stars - 1`,
    reads: [
      { dot: DOT_PINK, text: "**while stars > 0:** checks the condition before each turn" },
      { dot: DOT_MINT, text: "**stars = stars - 1** decreases the counter so the loop eventually stops" },
    ],
    tip: "Always modify the variable in your condition inside the loop body, otherwise you will get stuck in an infinite loop.",
    starter: `# count down from 3 to 1
countdown = 3
while countdown > 0:
    print(countdown)
    countdown = countdown - 1`,
    task: {
      prompt: "Start with `n = 1` and use a while loop to keep doubling it while it is 100 or less. Print the result: `128`.",
      expectOutput: ["128"],
      mustInclude: ["while"],
      hint: "`while n <= 100: n = n * 2`, then print n after the loop.",
      solution: code`n = 1
while n <= 100:
    n = n * 2
print(n)`,
    },
    practiceSlug: "while-loops",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "break-continue",
    order: 17,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Escaping loops",
    catalogTitle: "Break & Continue",
    blurb: "Skip turns with continue, or exit the entire loop early with break.",
    catalogCode: "if found: break",
    intro:
      "Use **break** to exit a loop immediately. Use **continue** to skip the rest of the current turn and jump straight to the next one.",
    example: `for num in range(5):
    if num == 2:
        continue
    if num == 4:
        break
    print(num)`,
    reads: [
      { dot: DOT_PINK, text: "**continue** skips printing 2 and jumps to the next turn" },
      { dot: DOT_MINT, text: "**break** exits the loop before printing 4" },
    ],
    tip: "break and continue work in both for loops and while loops.",
    starter: `# skip the number 1, and stop at 3
for n in range(5):
    if n == 1:
        continue
    if n == 3:
        break
    print(n)`,
    task: {
      prompt: "Loop over `[4, 7, 9, 12, 15]` and print the first number divisible by 3, then stop with `break`. It should print `9` and nothing else.",
      expectOutput: ["9"],
      mustInclude: ["break"],
      hint: "Inside the loop: `if n % 3 == 0:` print it, then `break`.",
      solution: code`for n in [4, 7, 9, 12, 15]:
    if n % 3 == 0:
        print(n)
        break`,
    },
    practiceSlug: "break-continue",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "nested-loops",
    order: 18,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Loops inside loops",
    catalogTitle: "Nested loops",
    blurb: "Accumulate values or run loops inside other loops.",
    catalogCode: "for x in row:",
    intro:
      "A loop inside another loop is a **nested loop**. The inner loop runs completely from start to finish for **each turn** of the outer loop. We can also accumulate values inside a loop.",
    example: `total = 0
for x in range(3):
    for y in range(2):
        total = total + 1
print(total)`,
    reads: [
      { dot: DOT_PINK, text: "The inner loop runs 2 times for each of the outer loop's 3 turns (6 times total)" },
      { dot: DOT_MINT, text: "**total = total + 1** accumulates the count" },
    ],
    tip: "Nested loops are common for working with grids, tables, coordinates, or multi-dimensional data.",
    starter: `# every row paired with every column
for row in range(2):
    for col in range(3):
        print(row, col)`,
    task: {
      prompt: "Use a loop inside a loop to print a 3 by 3 grid: three lines of `* * *`.",
      expectOutput: ["* * *", "* * *", "* * *"],
      mustInclude: ["for[\\s\\S]*\\n\\s+for"],
      hint: "The outer loop makes rows. The inner loop adds `\"* \"` three times to a line, then print the line.",
      solution: code`for row in range(3):
    line = ""
    for col in range(3):
        line += "* "
    print(line.strip())`,
    },
    practiceSlug: "nested-loops",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "functions",
    order: 20,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Wrap it in a name",
    catalogTitle: "Functions",
    blurb: "Bundle a few steps under a name and reuse them anywhere.",
    catalogCode: "def dream():",
    intro:
      "A **function** is a named bundle of steps. Define it once with **def**, then **call** it by name whenever you need it. Functions can take **inputs** in the parentheses and hand back a result with **return**.",
    example: `def greet(name):
    return "hello, " + name

print(greet("Nova"))
print(greet("sky"))`,
    reads: [
      { dot: DOT_PINK, text: "**def greet(name):** defines a function called greet that takes one input, name" },
      { dot: DOT_MINT, text: "The **indented body** runs only when you call the function" },
      { dot: DOT_LAVENDER, text: "**return** hands a value back to whoever called it" },
    ],
    tip: "Define a function once, call it as many times as you like. That is how you stop repeating yourself.",
    starter: `# a function that doubles a number
def double(n):
    return n * 2

print(double(4))
print(double(21))`,
    task: {
      prompt: "Write a function `square(n)` that returns n times n, then print `square(9)`. It should print `81`.",
      expectOutput: ["81"],
      mustInclude: ["def\\s+square\\s*\\("],
      hint: "`def square(n):` then `return n * n` indented under it.",
      solution: code`def square(n):
    return n * n

print(square(9))`,
    },
    practiceSlug: "functions",
    module: "Functions",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "parameters-arguments",
    order: 21,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Inputs to functions",
    catalogTitle: "Parameters",
    blurb: "Pass data into your functions to make them dynamic and flexible.",
    catalogCode: "def greet(name, time):",
    intro:
      "To make a function do different things depending on the situation, we give it **parameters** (inputs). When we call the function, we pass **arguments** (values) into those parameters.",
    example: `def greet(name, time):
    print("Good " + time + ", " + name)

greet("Nova", "morning")
greet("sky", "night")`,
    reads: [
      { dot: DOT_PINK, text: "**def greet(name, time):** defines two parameters, name and time" },
      { dot: DOT_MINT, text: '**greet("Nova", "morning")** calls the function, passing "Nova" into name and "morning" into time' },
      { dot: DOT_LAVENDER, text: "The arguments must be passed in the same order as the parameters" },
    ],
    tip: "Parameters are the names listed in the function definition. Arguments are the actual values you send to the function when calling it.",
    starter: `# a function that adds two numbers together
def add(a, b):
    print(a + b)

add(5, 7)
add(10, 20)`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Add a third parameter `c` so `add(1, 2, 3)` prints `6`. Call it with those three numbers.",
      expectOutput: ["6"],
      mustInclude: ["def\\s+add\\s*\\(\\s*a\\s*,\\s*b\\s*,\\s*c\\s*\\)"],
      hint: "Change the definition to `def add(a, b, c):` and print `a + b + c`.",
      solution: code`def add(a, b, c):
    print(a + b + c)

add(1, 2, 3)`,
    },
    practiceSlug: "parameters-arguments",
  },
  {
    slug: "return-values",
    order: 22,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Sending data back",
    catalogTitle: "Return values",
    blurb: "Make your functions calculate a value and hand it back to the caller.",
    catalogCode: "return result",
    intro:
      "A function can calculate a result and send it back to the caller using the **return** keyword. Once a function returns, it exits immediately. If you do not write return, the function returns None.",
    example: `def double(x):
    return x * 2

result = double(10)
print(result)`,
    reads: [
      { dot: DOT_PINK, text: "**return x * 2** calculates the value and immediately finishes the function" },
      { dot: DOT_MINT, text: "**result = double(10)** captures the returned value (20) and stores it in result" },
    ],
    tip: "Do not confuse print() and return. print() displays text to the screen, while return passes data back to your code so you can use it in other calculations.",
    starter: `# a function that multiplies a number by 3 and returns it
def triple(x):
    return x * 3

print(triple(5))`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Write `is_even(n)` that returns `True` or `False`, then print `is_even(10)` and `is_even(7)`.",
      expectOutput: ["True", "False"],
      mustInclude: ["def\\s+is_even", "return"],
      hint: "`return n % 2 == 0` hands back the result of the comparison.",
      solution: code`def is_even(n):
    return n % 2 == 0

print(is_even(10))
print(is_even(7))`,
    },
    practiceSlug: "return-values",
  },
  {
    slug: "default-keyword-args",
    order: 23,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Defaults and keywords",
    catalogTitle: "Default & keyword args",
    blurb: "Provide optional values for parameters or pass them in by name.",
    catalogCode: "def glow(color='neon'):",
    intro:
      "You can give parameters **default values**. If the caller leaves them out, Python uses the default. You can also pass arguments by **keyword** (by name) instead of position.",
    example: `def glow(color="neon", brightness=5):
    print("Glowing " + color + " at level " + str(brightness))

glow()
glow(brightness=10)
glow("blue", brightness=8)`,
    reads: [
      { dot: DOT_PINK, text: '**color="neon"** sets a default value for color' },
      { dot: DOT_MINT, text: "**glow(brightness=10)** specifies brightness by name, while color defaults to \"neon\"" },
      { dot: DOT_LAVENDER, text: "**str(brightness)** converts the integer to text so we can add it to other text" },
    ],
    tip: "All parameters with default values must come after parameters without default values.",
    starter: `# a function with a default parameter
def set_sky(color="pink"):
    print("The sky is " + color)

set_sky()
set_sky("neon")`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    task: {
      prompt: "Add a second parameter `mood` with the default `\"calm\"`, so `set_sky()` prints `The sky is pink and calm`, then call `set_sky(mood=\"wild\")` to print `The sky is pink and wild`.",
      expectOutput: ["The sky is pink and calm", "The sky is pink and wild"],
      mustInclude: ["mood\\s*=\\s*[\"']calm", "mood\\s*=\\s*[\"']wild"],
      hint: "`def set_sky(color=\"pink\", mood=\"calm\"):` and print both values.",
      solution: code`def set_sky(color="pink", mood="calm"):
    print("The sky is " + color + " and " + mood)

set_sky()
set_sky(mood="wild")`,
    },
    practiceSlug: "default-keyword-args",
  },
  {
    slug: "variable-scope",
    order: 24,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Local and global variables",
    catalogTitle: "Variable scope",
    blurb: "Understand where your variables live and where they can be accessed.",
    catalogCode: "global sky_type",
    intro:
      "Variables created inside a function are **local** to that function. They cannot be seen or used outside. Variables created outside functions are **global** and can be read anywhere.",
    example: `sky = "neon"

def paint():
    cloud = "puffy"
    print("Inside:", sky, cloud)

paint()
print("Outside:", sky)`,
    reads: [
      { dot: DOT_PINK, text: "**sky = \"neon\"** is a global variable accessible inside and outside paint()" },
      { dot: DOT_MINT, text: "**cloud = \"puffy\"** is a local variable only accessible inside paint()" },
    ],
    tip: "Keeping variables local helps prevent errors, because different functions won't accidentally overwrite each other's data.",
    starter: `# try reading global and local variables
theme = "sunset"

def show_theme():
    mode = "dark"
    print("Theme:", theme)
    print("Mode:", mode)

show_theme()`,
    module: "Functions",
    tier: "intermediate",
    language: "python",
    task: {
      prompt: "Add a global `visits = 0` and a function `visit()` that uses `global visits` to add 1. Call it twice, then print `visits`: `2`.",
      expectOutput: ["2"],
      mustInclude: ["global\\s+visits"],
      hint: "Without `global visits`, `visits += 1` inside the function would fail.",
      solution: code`visits = 0

def visit():
    global visits
    visits += 1

visit()
visit()
print(visits)`,
    },
    practiceSlug: "variable-scope",
  },
  {
    slug: "compose-functions",
    order: 25,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Combining functions",
    catalogTitle: "Helper functions",
    blurb: "Build complex actions by composing smaller, simpler helper functions.",
    catalogCode: "result = f(g(x))",
    intro:
      "Great programs are built from tiny, reusable blocks. You can call functions from **inside other functions**, passing the output of one function as the input to another.",
    example: `def add_stars(count):
    return count + 10

def format_sky(stars):
    return "Sky with " + str(stars) + " stars"

total = add_stars(5)
message = format_sky(total)
print(message)`,
    reads: [
      { dot: DOT_PINK, text: "**add_stars(5)** returns 15" },
      { dot: DOT_MINT, text: '**format_sky(total)** takes 15 and returns "Sky with 15 stars"' },
    ],
    tip: "Writing small helper functions makes your code much easier to read, test, and debug.",
    starter: `# compose two helper functions
def double(n):
    return n * 2

def subtract_one(n):
    return n - 1

# double 5, then subtract 1
result = subtract_one(double(5))
print(result)`,
    module: "Functions",
    tier: "intermediate",
    language: "python",
    task: {
      prompt: "Add a helper `square(n)` and print `square(double(3))`, which is `36`.",
      expectOutput: ["36"],
      mustInclude: ["def\\s+square", "square\\(\\s*double\\("],
      hint: "The inner call runs first: double(3) is 6, then square(6) is 36.",
      solution: code`def double(n):
    return n * 2

def square(n):
    return n * n

print(square(double(3)))`,
    },
    practiceSlug: "compose-functions",
  },
  {
    slug: "lists",
    order: 26,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Lists of things",
    catalogTitle: "Lists",
    blurb: "Keep many things in one place, in the order you put them.",
    catalogCode: 'clouds = ["wispy", "puffy"]',
    intro:
      "A **list** keeps multiple values together. Write square brackets with commas in between. Access individual items with square brackets and their **index** (position), starting at **0**.",
    example: `clouds = ["wispy", "puffy"]
print(len(clouds))
print(clouds[1])`,
    reads: [
      { dot: DOT_PINK, text: '`["wispy", "puffy"]` creates a list with two text items.' },
      { dot: DOT_MINT, text: '`clouds[1]` looks up the item at position 1 (the second item).' },
      { dot: DOT_LAVENDER, text: '`len(clouds)` counts the total items in the list, here 2.' },
    ],
    tip: "Indexes start at 0. So the first item is `clouds[0]`, and the second is `clouds[1]`.",
    starter: `# print the list, then print the first item
clouds = ["cirrus", "cumulus", "stratus"]
print(clouds)
print(clouds[0])`,
    task: {
      prompt: "Print the last cloud using a negative index, then print how many clouds there are. The output should end with `stratus` and `3`.",
      expectOutput: ["stratus", "3"],
      mustInclude: ["\\[\\s*-1\\s*\\]", "len\\("],
      hint: "`clouds[-1]` is the last item and `len(clouds)` counts them.",
      solution: code`clouds = ["cirrus", "cumulus", "stratus"]
print(clouds[-1])
print(len(clouds))`,
    },
    practiceSlug: "lists",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "dictionaries",
    order: 28,
    chapter: "Python Basics - Chapter 1",
    kicker: "PYTHON BASICS",
    title: "Labeling values",
    catalogTitle: "Dictionaries",
    blurb: "Label every value with a key so you can find it fast.",
    catalogCode: 'cloud = {"shape": "puffy"}',
    intro:
      "A **dictionary** stores values mapped to **keys** (labels). Define it with curly braces `{}` and key-value pairs separated by colons. Retrieve values using their keys.",
    example: `star = {"name": "Sirius", "mag": -1.46}
print(star["name"])
print(star["mag"])`,
    reads: [
      { dot: DOT_PINK, text: '`{"name": "Sirius"}` maps the key `"name"` to the value `"Sirius"`.' },
      { dot: DOT_MINT, text: '`star["name"]` retrieves the value stored under the key `"name"`.' },
    ],
    tip: "If you try to look up a key that doesn't exist, Python will raise a KeyError. Check spelling.",
    starter: `# look up two values in a dictionary
sky_item = {"name": "cloud", "color": "neon"}
print(sky_item["name"])
print(sky_item["color"])`,
    task: {
      prompt: "Add a `\"height\"` key with the value `3000`, then print the whole dictionary: `{'name': 'cloud', 'color': 'neon', 'height': 3000}`.",
      expectOutput: ["{'name': 'cloud', 'color': 'neon', 'height': 3000}"],
      mustInclude: ["\\[\\s*[\"']height[\"']\\s*\\]\\s*="],
      hint: "Assigning to a new key adds it: `sky_item[\"height\"] = 3000`.",
      solution: code`sky_item = {"name": "cloud", "color": "neon"}
sky_item["height"] = 3000
print(sky_item)`,
    },
    practiceSlug: "dictionaries",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "py-list-comprehensions",
    order: 31,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "List comprehensions",
    catalogTitle: "List comprehensions",
    blurb: "Build new lists in a single readable line of code.",
    catalogCode: "[x * 2 for x in nums]",
    intro:
      "A **list comprehension** is a concise way to create lists. It replaces standard loops with a single line: `[expression for item in iterable if condition]`.",
    example: `nums = [1, 2, 3, 4]
doubled_evens = [x * 2 for x in nums if x % 2 == 0]
print(doubled_evens)`,
    reads: [
      { dot: DOT_PINK, text: "**[x * 2 for x in nums]** loops through nums and returns doubled values" },
      { dot: DOT_MINT, text: "**if x % 2 == 0** filters the input list keeping only evens" },
    ],
    tip: "Comprehensions are faster and more readable, but do not make them too complex or nested.",
    starter: `# a list comprehension that keeps numbers greater than 10
nums = [5, 12, 8, 21]
result = [x for x in nums if x > 10]
print(result)`,
    task: {
      prompt: "Build `squares` with a comprehension that holds the square of every number in `nums`, then print it: `[25, 144, 64, 441]`.",
      expectOutput: ["[25, 144, 64, 441]"],
      mustInclude: ["for\\s+\\w+\\s+in\\s+nums"],
      hint: "`[x * x for x in nums]`",
      solution: code`nums = [5, 12, 8, 21]
squares = [x * x for x in nums]
print(squares)`,
    },
    practiceSlug: "py-list-comprehensions",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-dict-comprehensions",
    order: 32,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Dictionary comprehensions",
    catalogTitle: "Dict comprehensions",
    blurb: "Build dictionaries dynamically using comprehension syntax.",
    catalogCode: "{k: v for k, v in data}",
    intro:
      "A **dictionary comprehension** builds dictionaries using key-value expressions: `{key_expr: value_expr for item in iterable}`.",
    example: `names = ["Nova", "Vega"]
lengths = {n: len(n) for n in names}
print(lengths)`,
    reads: [
      { dot: DOT_PINK, text: "**{n: len(n) ...}** maps name to its length as key and value" },
      { dot: DOT_MINT, text: "**for n in names** defines the source iterable loop" },
    ],
    tip: "Like list comprehensions, you can add conditional if checks at the end of a dict comprehension.",
    starter: `# a dict comprehension that maps names to their uppercase version
names = ["Alice", "Bob"]
res = {name: name.upper() for name in names}
print(res)`,
    task: {
      prompt: "Build a dict that maps each name to its length and print it: `{'Alice': 5, 'Bob': 3}`.",
      expectOutput: ["{'Alice': 5, 'Bob': 3}"],
      mustInclude: ["len\\(\\s*name\\s*\\)"],
      hint: "`{name: len(name) for name in names}`",
      solution: code`names = ["Alice", "Bob"]
lengths = {name: len(name) for name in names}
print(lengths)`,
    },
    practiceSlug: "py-dict-comprehensions",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-slicing",
    order: 33,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Slicing sequences",
    catalogTitle: "Slicing",
    blurb: "Extract sub-lists or substrings using slice boundaries.",
    catalogCode: "nums[start:stop:step]",
    intro:
      "**Slicing** extracts a portion of a list or string using `[start:stop:step]`. Omitted values default to the beginning, end, or a step of 1.",
    example: `nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])
print(nums[::2])
print(nums[::-1])`,
    reads: [
      { dot: DOT_PINK, text: "**nums[1:4]** gets index 1 up to (but not including) index 4" },
      { dot: DOT_MINT, text: "**nums[::-1]** reverses the sequence" },
    ],
    tip: "Negative indices count from the end of the list, e.g., nums[-1] is the last item.",
    starter: `# print first 5 characters and last 4 characters of the word
word = "dreamcode"
print(word[:5])
print(word[5:])`,
    task: {
      prompt: "Print the word reversed using a slice with a negative step: `edocmaerd`.",
      expectOutput: ["edocmaerd"],
      mustInclude: ["\\[\\s*::\\s*-1\\s*\\]"],
      hint: "`word[::-1]` walks the whole string backwards.",
      solution: code`word = "dreamcode"
print(word[::-1])`,
    },
    practiceSlug: "py-slicing",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-sets-tuples",
    order: 34,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Sets and tuples",
    catalogTitle: "Sets & tuples",
    blurb: "Store unique elements (sets) or immutable values (tuples).",
    catalogCode: "unique = {1, 2}; pair = (3, 4)",
    intro:
      "A **tuple** is an immutable list written with parentheses `()`. A **set** is an unordered collection of unique elements written with curly braces `{}`.",
    example: `point = (10, 20)
unique_clouds = {"wispy", "puffy", "wispy"}
print(unique_clouds)
print(point[0])`,
    reads: [
      { dot: DOT_PINK, text: "**point = (10, 20)** defines an immutable tuple" },
      { dot: DOT_MINT, text: '**{"wispy", "puffy", "wispy"}** creates a set, filtering out duplicates' },
    ],
    tip: "Use sets when checking membership or removing duplicates, and tuples for structured coordinates or records.",
    starter: `# create a set from a list to remove duplicates
items = [1, 2, 2, 3, 3, 3]
unique_items = set(items)
print(unique_items)`,
    task: {
      prompt: "Print how many unique items there are (`3`), then whether `4` is in the set (`False`).",
      expectOutput: ["3", "False"],
      mustInclude: ["len\\(\\s*unique_items\\s*\\)", "in\\s+unique_items"],
      hint: "`len(unique_items)` and `4 in unique_items`.",
      solution: code`items = [1, 2, 2, 3, 3, 3]
unique_items = set(items)
print(len(unique_items))
print(4 in unique_items)`,
    },
    practiceSlug: "py-sets-tuples",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-enumerate-zip",
    order: 36,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Enumerate and zip",
    catalogTitle: "Enumerate & zip",
    blurb: "Iterate with indices or loop over multiple lists in parallel.",
    catalogCode: "for i, x in enumerate(items)",
    intro:
      "**enumerate()** yields index-value pairs during iteration. **zip()** pairs up elements from multiple lists in parallel.",
    example: `names = ["Nova", "Vega"]
scores = [100, 95]
for index, name in enumerate(names):
    print(index, name)

for name, score in zip(names, scores):
    print(name, score)`,
    reads: [
      { dot: DOT_PINK, text: "**enumerate(names)** yields index and value pairs" },
      { dot: DOT_MINT, text: "**zip(names, scores)** pairs up elements from lists in parallel" },
    ],
    tip: "zip() stops pairing as soon as the shortest input list is exhausted.",
    starter: `# print each element with its index
items = ["a", "b", "c"]
for i, item in enumerate(items):
    print(i, item)`,
    task: {
      prompt: "Use `zip` to pair `items` with `[10, 20, 30]` and print `a 10`, `b 20` and `c 30` on three lines.",
      expectOutput: ["a 10", "b 20", "c 30"],
      mustInclude: ["zip\\("],
      hint: "`for item, score in zip(items, [10, 20, 30]):`",
      solution: code`items = ["a", "b", "c"]
for item, score in zip(items, [10, 20, 30]):
    print(item, score)`,
    },
    practiceSlug: "py-enumerate-zip",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-exceptions",
    order: 39,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Exceptions",
    catalogTitle: "Exceptions",
    blurb: "Catch and handle errors gracefully using try blocks.",
    catalogCode: "try: ... except ValueError: ...",
    intro:
      "Use **try** and **except** blocks to handle exceptions. This prevents your program from crashing when a runtime error occurs.",
    example: `try:
    number = int("not_a_number")
except ValueError as e:
    print("Failed to convert:", e)`,
    reads: [
      { dot: DOT_PINK, text: "**try:** wraps the code that might fail at runtime" },
      { dot: DOT_MINT, text: "**except ValueError:** catches and handles specific ValueErrors" },
    ],
    tip: "Always catch specific errors (like ValueError or KeyError) instead of a generic Exception.",
    starter: `# catch zero division error
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")`,
    task: {
      prompt: "Convert the text `\"12x\"` with `int()` inside a try block, catch `ValueError`, and print `not a number`.",
      expectOutput: ["not a number"],
      mustInclude: ["except\\s+ValueError"],
      hint: "`int(\"12x\")` raises ValueError, so the except block runs.",
      solution: code`try:
    value = int("12x")
    print(value)
except ValueError:
    print("not a number")`,
    },
    practiceSlug: "py-exceptions",
    module: "Errors, Files and Modules",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-file-handling",
    order: 41,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "File handling",
    catalogTitle: "File handling",
    blurb: "Open, read, and write local files safely using context managers.",
    catalogCode: "with open('file.txt', 'r') as f:",
    intro:
      "Use the **with** statement and **open()** function to open files. The context manager automatically closes the file when the block ends.",
    example: `with open("sky.txt", "w") as f:
    f.write("starry night")

with open("sky.txt", "r") as f:
    content = f.read()
    print(content)`,
    reads: [
      { dot: DOT_PINK, text: '**open("sky.txt", "w")** opens a file named sky.txt for writing' },
      { dot: DOT_MINT, text: "**with ... as f** automatically closes the file object" },
    ],
    tip: "Always prefer with open(...) to manual file opening to prevent memory leaks.",
    starter: `# write two lines to log.txt, then read them back
with open("log.txt", "w") as f:
    f.write("initial log\\n")
    f.write("second entry\\n")

with open("log.txt") as f:
    for line in f:
        print(line.strip())`,
    task: {
      prompt: "Before reading the file back, open it again in append mode (`\"a\"`) and add a third line `third entry`. All three lines should print.",
      expectOutput: ["initial log", "second entry", "third entry"],
      mustInclude: ["open\\([^)]*[\"']a[\"']"],
      hint: "`with open(\"log.txt\", \"a\") as f:` then `f.write(\"third entry\\n\")`.",
      solution: code`with open("log.txt", "w") as f:
    f.write("initial log\n")
    f.write("second entry\n")

with open("log.txt", "a") as f:
    f.write("third entry\n")

with open("log.txt") as f:
    for line in f:
        print(line.strip())`,
    },
    practiceSlug: "py-file-handling",
    module: "Errors, Files and Modules",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-oop",
    order: 44,
    chapter: "Python Intermediate - Chapter 2",
    kicker: "PYTHON INTERMEDIATE",
    title: "Object-oriented programming",
    catalogTitle: "OOP",
    blurb: "Define classes and instantiate objects with local state.",
    catalogCode: "class Cloud:\n    def __init__(self):",
    intro:
      "Python supports **Object-Oriented Programming (OOP)**. Define a class using `class`, and initialize fields inside `__init__(self)`.",
    example: `class Star:
    def __init__(self, name, mag):
        self.name = name
        self.mag = mag

    def glow(self):
        return f"{self.name} glows at {self.mag}"

s = Star("Vega", 0.03)
print(s.glow())`,
    reads: [
      { dot: DOT_PINK, text: "**def __init__(self, name)** defines the constructor method" },
      { dot: DOT_MINT, text: "**self** refers to the specific instance of the object class" },
    ],
    tip: "Methods must receive self as their first parameter to access object fields.",
    starter: `# a Cloud class that stores its shape
class Cloud:
    def __init__(self, shape):
        self.shape = shape
c = Cloud("cumulus")
print(c.shape)`,
    task: {
      prompt: "Add a method `describe(self)` that returns `\"A cumulus cloud\"` built from `self.shape`, and print `c.describe()`.",
      expectOutput: ["A cumulus cloud"],
      mustInclude: ["def\\s+describe\\s*\\(\\s*self\\s*\\)"],
      hint: "`return f\"A {self.shape} cloud\"`",
      solution: code`class Cloud:
    def __init__(self, shape):
        self.shape = shape

    def describe(self):
        return f"A {self.shape} cloud"

c = Cloud("cumulus")
print(c.describe())`,
    },
    practiceSlug: "py-oop",
    module: "Objects and Classes",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-generators",
    order: 50,
    chapter: "Python Advanced - Chapter 3",
    kicker: "PYTHON ADVANCED",
    title: "Generators and Yield",
    catalogTitle: "Generators",
    blurb: "Generate items lazily without keeping the whole sequence in memory.",
    catalogCode: "yield value",
    intro:
      "A **generator** function yields values one by one using the **yield** keyword. It pauses execution after each yield, saving memory.",
    example: `def count_up_to(limit):
    count = 1
    while count <= limit:
        yield count
        count += 1

for number in count_up_to(3):
    print(number)`,
    reads: [
      { dot: DOT_PINK, text: "**yield count** returns a value and pauses the function state" },
      { dot: DOT_MINT, text: "**for number in ...** calls next() implicitly to retrieve values" },
    ],
    tip: "Generators are perfect for looping over very large datasets or files that don't fit in memory.",
    starter: `# a generator that yields "sky" then "stars"
def simple_generator():
    yield "sky"
    yield "stars"

for x in simple_generator():
    print(x)`,
    task: {
      prompt: "Write a generator `count_to(n)` that yields 1 up to n, and print `list(count_to(4))`: `[1, 2, 3, 4]`.",
      expectOutput: ["[1, 2, 3, 4]"],
      mustInclude: ["def\\s+count_to", "yield"],
      hint: "Loop with `for i in range(1, n + 1):` and `yield i`.",
      solution: code`def count_to(n):
    for i in range(1, n + 1):
        yield i

print(list(count_to(4)))`,
    },
    practiceSlug: "py-generators",
    module: "Python Advanced",
    tier: "advanced",
    language: "python",
  },
  {
    slug: "py-decorators",
    order: 52,
    chapter: "Python Advanced - Chapter 3",
    kicker: "PYTHON ADVANCED",
    title: "Custom decorators",
    catalogTitle: "Decorators",
    blurb: "Modify or wrap function behavior dynamically using @ decorators.",
    catalogCode: "@log_call\ndef func():",
    intro:
      "A **decorator** wraps another function to modify its behavior without changing its code. They are denoted with **@decorator_name**.",
    example: `def yell(func):
    def wrapper(text):
        return func(text).upper()
    return wrapper

@yell
def greet(name):
    return f"hello {name}"

print(greet("Nova"))`,
    reads: [
      { dot: DOT_PINK, text: "**def wrapper(text)** defines the inner wrapping function that runs" },
      { dot: DOT_MINT, text: "**@yell** wraps the greet function inside yell" },
    ],
    tip: "Decorators are functions that take another function as an argument and return a new function.",
    starter: `# a decorator that announces the task before it runs
def announce(func):
    def wrapper():
        print("Starting")
        func()
    return wrapper

@announce
def task():
    print("Working")

task()`,
    task: {
      prompt: "Make the wrapper also print `Done` after it calls `func()`, so the output is `Starting`, `Working`, `Done`.",
      expectOutput: ["Starting", "Working", "Done"],
      mustInclude: ["[\"']Done[\"']"],
      hint: "Add `print(\"Done\")` inside `wrapper`, after `func()`.",
      solution: code`def announce(func):
    def wrapper():
        print("Starting")
        func()
        print("Done")
    return wrapper

@announce
def task():
    print("Working")

task()`,
    },
    practiceSlug: "py-decorators",
    module: "Python Advanced",
    tier: "advanced",
    language: "python",
  },
  {
    slug: "py-metaprogramming",
    order: 64,
    chapter: "Python Expert - Chapter 1",
    kicker: "PYTHON EXPERT",
    title: "Dynamic properties and descriptors",
    catalogTitle: "Metaprogramming",
    blurb: "Intercept object attribute lookup using magic methods.",
    catalogCode: "def __getattr__(self, name):",
    intro:
      "Python lets you customize attribute access using **metaprogramming**. Override `__getattr__` to intercept missing attributes, `__setattr__` for writes, and use **property descriptors** to manage class variables.",
    example: `class Sky:
    def __getattr__(self, name):
        return f"The {name} is clear"

s = Sky()
print(s.stars)`,
    reads: [
      { dot: DOT_PINK, text: "**__getattr__(self, name)** runs only when the attribute does not exist" },
      { dot: DOT_MINT, text: "It returns a computed value dynamically" },
    ],
    tip: "Use __getattr__ for fallback lookup; use __getattribute__ to intercept every attribute access (but watch out for infinite recursion).",
    starter: `# intercept calls to get missing configuration keys
class Config:
    def __init__(self, data):
        self.data = data
    def __getattr__(self, key):
        return self.data.get(key, "default")

c = Config({"mode": "dreamy"})
print(c.mode)
print(c.stars)`,
    task: {
      prompt: "Use `setattr(c, \"level\", 3)` to add an attribute by name, then print `c.level` (`3`) and `getattr(c, \"mode\")` (`dreamy`).",
      expectOutput: ["3", "dreamy"],
      mustInclude: ["setattr\\(", "getattr\\("],
      hint: "`setattr(obj, name, value)` and `getattr(obj, name)` work with attribute names as strings.",
      solution: code`class Config:
    def __init__(self, data):
        self.data = data

    def __getattr__(self, key):
        return self.data.get(key, "default")

c = Config({"mode": "dreamy"})
setattr(c, "level", 3)
print(c.level)
print(getattr(c, "mode"))`,
    },
    practiceSlug: "py-metaprogramming",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-concurrency",
    order: 65,
    chapter: "Python Expert - Chapter 1",
    kicker: "PYTHON EXPERT",
    title: "Asynchronous task execution",
    catalogTitle: "Concurrency",
    blurb: "Run non-blocking cooperative code with asyncio.",
    catalogCode: "await asyncio.gather(*tasks)",
    intro:
      "Use **asyncio** to write concurrent code using the `async` and `await` syntax. Cooperative multitasking yields control back to the event loop during I/O operations.",
    example: `import asyncio

async def flash_star():
    await asyncio.sleep(0.01)
    return "star flashed"

async def main():
    res = await asyncio.gather(flash_star(), flash_star())
    print(res)

asyncio.run(main())`,
    reads: [
      { dot: DOT_PINK, text: "**await asyncio.gather(...)** runs multiple coroutines concurrently" },
      { dot: DOT_MINT, text: "**asyncio.sleep** yields control back to the loop without blocking" },
    ],
    tip: "Multithreading is CPU-bound limited by the GIL in Python; asyncio is perfect for I/O-bound concurrency.",
    starter: `import asyncio

async def delay_print(msg):
    await asyncio.sleep(0.01)
    print(msg)

async def main():
    await asyncio.gather(delay_print("A"), delay_print("B"))

asyncio.run(main())`,
    task: {
      prompt: "Add a third call so `asyncio.gather` runs `delay_print(\"C\")` too. The output should be `A`, `B`, `C`.",
      expectOutput: ["A", "B", "C"],
      mustInclude: ["delay_print\\(\\s*[\"']C[\"']\\s*\\)"],
      hint: "gather takes any number of coroutines: `asyncio.gather(delay_print(\"A\"), delay_print(\"B\"), delay_print(\"C\"))`.",
      solution: code`import asyncio

async def delay_print(msg):
    await asyncio.sleep(0.01)
    print(msg)

async def main():
    await asyncio.gather(delay_print("A"), delay_print("B"), delay_print("C"))

asyncio.run(main())`,
    },
    practiceSlug: "py-concurrency",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-internals",
    order: 66,
    chapter: "Python Expert - Chapter 1",
    kicker: "PYTHON EXPERT",
    title: "Bytecode, GIL, and memory management",
    catalogTitle: "Python Internals",
    blurb: "Deep dive into CPython execution, compilation, and gc.",
    catalogCode: "sys.getrefcount(x)",
    intro:
      "CPython compiles source code to **bytecode** (.pyc) executed by the virtual machine. Memory is managed via **reference counting** and a cyclic **garbage collector**, thread-locked by the **Global Interpreter Lock**.",
    example: `import sys
x = []
print(sys.getrefcount(x))`,
    reads: [
      { dot: DOT_PINK, text: "**sys.getrefcount(...)** returns references pointing to the object" },
      { dot: DOT_MINT, text: "CPython's GIL prevents multiple native threads from executing bytecodes at once" },
    ],
    tip: "Reference counting deletes objects immediately when count drops to 0; cycle GC handles self-referencing loops.",
    starter: `import sys
a = [1, 2]
b = a
print(sys.getrefcount(a))`,
    task: {
      prompt: "Show that `b` is the same list as `a`: append `3` to `b`, then print `a` (`[1, 2, 3]`) and `a is b` (`True`).",
      expectOutput: ["[1, 2, 3]", "True"],
      mustInclude: ["\\bis\\b"],
      hint: "Both names point at one list object, so changing it through b is visible through a.",
      solution: code`a = [1, 2]
b = a
b.append(3)
print(a)
print(a is b)`,
    },
    practiceSlug: "py-internals",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-web-backend-basics",
    order: 68,
    chapter: "Python Applied - Chapter 1",
    kicker: "PYTHON APPLIED",
    title: "What a backend does",
    catalogTitle: "Backend basics",
    blurb: "Understand the role of a web server, HTTP, and how Python fits into backend development.",
    catalogCode: "GET /api/items HTTP/1.1",
    intro:
      "A **backend** is a server that listens for HTTP requests and returns responses. It handles data storage, business rules, and authentication. Python is one of the most popular backend languages because of its readable syntax and rich ecosystem of web frameworks.",
    example: `# Conceptual flow of a backend request:
#
# 1. Browser sends:  GET /api/stars
# 2. Server receives the request
# 3. Server queries a database
# 4. Server sends JSON back:
#    {"stars": ["Vega", "Sirius", "Polaris"]}`,
    reads: [
      { dot: DOT_PINK, text: "**HTTP** is the protocol browsers and servers use to communicate" },
      { dot: DOT_MINT, text: "A backend typically reads from and writes to a **database**" },
      { dot: DOT_LAVENDER, text: "Python frameworks like Flask, Django, and FastAPI handle HTTP for you" },
    ],
    tip: "The frontend (HTML, CSS, JS) runs in the browser. The backend runs on a server and sends data the frontend displays.",
    starter: `# A simplified request-response model
request = {"method": "GET", "path": "/api/stars"}
print(f"Received {request['method']} {request['path']}")

response = {"status": 200, "body": ["Vega", "Sirius"]}
print(f"Responding with status {response['status']}")`,
    module: "Python for Web Development",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What protocol do web browsers use to communicate with backend servers?",
        options: ["HTTP", "FTP", "SMTP", "SSH"],
        answer: 0,
        explain: "HTTP (HyperText Transfer Protocol) is the standard protocol for web communication between clients and servers.",
      },
      {
        prompt: "Which of these is NOT a common responsibility of a backend server?",
        options: ["Rendering CSS styles in the browser", "Storing data in a database", "Authenticating users", "Processing business logic"],
        answer: 0,
        explain: "CSS rendering happens in the browser (frontend). The backend handles data, authentication, and logic.",
      },
      {
        prompt: "What format is commonly used to send structured data between a backend and a frontend?",
        options: ["JSON", "CSV", "PDF", "DOCX"],
        answer: 0,
        explain: "JSON (JavaScript Object Notation) is the standard data interchange format for web APIs.",
      },
    ],
  },
  {
    slug: "py-flask-basics",
    order: 69,
    chapter: "Python Applied - Chapter 1",
    kicker: "PYTHON APPLIED",
    title: "Building routes with Flask",
    catalogTitle: "Flask basics",
    blurb: "Create a minimal web server with Flask routes and return JSON responses.",
    catalogCode: "@app.route('/stars')",
    intro:
      "**Flask** is a lightweight Python web framework. You define **routes** that map URL paths to Python functions. Each route function returns a response, often as JSON data that a frontend can consume.",
    example: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/stars")
def get_stars():
    stars = ["Vega", "Sirius", "Polaris"]
    return jsonify(stars)

# Run with: flask run
# Visit: http://localhost:5000/api/stars`,
    reads: [
      { dot: DOT_PINK, text: "**@app.route(\"/api/stars\")** maps the URL path to the function below it" },
      { dot: DOT_MINT, text: "**jsonify(stars)** converts a Python list into a JSON HTTP response" },
      { dot: DOT_LAVENDER, text: "**Flask(__name__)** creates the application instance" },
    ],
    tip: "Flask is called a 'micro' framework because it gives you only the essentials. You add extensions (like Flask-SQLAlchemy) as you need them.",
    starter: `from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/clouds")
def get_clouds():
    return jsonify(["cirrus", "cumulus", "stratus"])

if __name__ == "__main__":
    app.run(debug=True)`,
    module: "Python for Web Development",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What does the @app.route decorator do in Flask?",
        options: ["Maps a URL path to a Python function", "Creates a database table", "Imports a module", "Starts the development server"],
        answer: 0,
        explain: "The route decorator tells Flask which function should handle requests to a given URL path.",
      },
      {
        prompt: "What does jsonify() return?",
        options: ["A Flask Response object with JSON content type", "A Python dictionary", "A raw string", "An HTML page"],
        answer: 0,
        explain: "jsonify converts Python data to JSON and wraps it in a proper HTTP response with the application/json content type.",
      },
      {
        prompt: "Why is Flask called a 'micro' framework?",
        options: ["It provides only the core essentials and lets you add extensions", "It only works for small projects", "It has fewer than 100 lines of code", "It cannot handle databases"],
        answer: 0,
        explain: "Flask is minimal by design. It handles routing and requests but leaves choices like databases and auth to the developer.",
      },
    ],
  },
  {
    slug: "py-django-overview",
    order: 70,
    chapter: "Python Applied - Chapter 1",
    kicker: "PYTHON APPLIED",
    title: "Django: the batteries-included framework",
    catalogTitle: "Django overview",
    blurb: "Understand Django's project structure, ORM, and admin panel.",
    catalogCode: "python manage.py runserver",
    intro:
      "**Django** is a full-featured Python web framework that follows the **Model-View-Template** pattern. It comes with a built-in ORM for database queries, an admin panel, authentication, and URL routing out of the box.",
    example: `# models.py - define your data shape
from django.db import models

class Star(models.Model):
    name = models.CharField(max_length=100)
    magnitude = models.FloatField()

    def __str__(self):
        return self.name

# views.py - handle HTTP requests
from django.http import JsonResponse
from .models import Star

def star_list(request):
    stars = list(Star.objects.values("name", "magnitude"))
    return JsonResponse(stars, safe=False)`,
    reads: [
      { dot: DOT_PINK, text: "**models.Model** turns a Python class into a database table via the ORM" },
      { dot: DOT_MINT, text: "**Star.objects.values(...)** queries the database and returns matching rows" },
      { dot: DOT_LAVENDER, text: "**JsonResponse** sends data back to the client as JSON" },
    ],
    tip: "Django's ORM lets you query the database using Python instead of writing raw SQL. Migrations keep your database schema in sync with your models.",
    starter: `# A simplified Django model definition
class Cloud(models.Model):
    shape = models.CharField(max_length=50)
    altitude = models.IntegerField()

    def __str__(self):
        return f"{self.shape} at {self.altitude}m"`,
    module: "Python for Web Development",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What design pattern does Django follow?",
        options: ["Model-View-Template (MVT)", "Model-View-Controller (MVC)", "Observer pattern", "Singleton pattern"],
        answer: 0,
        explain: "Django uses Model-View-Template. Models define data, views handle logic, and templates render HTML.",
      },
      {
        prompt: "What does Django's ORM allow you to do?",
        options: ["Query databases using Python instead of raw SQL", "Write JavaScript in Python files", "Run code in the browser", "Compile Python to machine code"],
        answer: 0,
        explain: "The Object-Relational Mapper translates Python class operations into database queries automatically.",
      },
      {
        prompt: "Which command starts the Django development server?",
        options: ["python manage.py runserver", "django start", "flask run", "python app.py"],
        answer: 0,
        explain: "manage.py is Django's command-line utility. The runserver command starts a local development server.",
      },
    ],
  },
  {
    slug: "py-fastapi-rest",
    order: 71,
    chapter: "Python Applied - Chapter 1",
    kicker: "PYTHON APPLIED",
    title: "FastAPI and REST APIs",
    catalogTitle: "FastAPI + REST",
    blurb: "Build typed REST endpoints with FastAPI and automatic documentation.",
    catalogCode: "@app.get('/items/{item_id}')",
    intro:
      "**FastAPI** is a modern Python framework built on type hints. It generates interactive API documentation automatically, validates request data using **Pydantic** models, and supports async handlers natively.",
    example: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Star(BaseModel):
    name: str
    magnitude: float

@app.get("/api/stars")
async def list_stars():
    return [
        {"name": "Vega", "magnitude": 0.03},
        {"name": "Sirius", "magnitude": -1.46},
    ]

@app.post("/api/stars")
async def create_star(star: Star):
    return {"created": star.name}`,
    reads: [
      { dot: DOT_PINK, text: "**@app.get** and **@app.post** map HTTP methods to handler functions" },
      { dot: DOT_MINT, text: "**BaseModel** validates incoming JSON against the type hints automatically" },
      { dot: DOT_LAVENDER, text: "**async def** lets FastAPI handle concurrent requests efficiently" },
    ],
    tip: "Visit /docs on a running FastAPI server to see auto-generated Swagger UI documentation for every endpoint.",
    starter: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Cloud(BaseModel):
    shape: str
    altitude: int

@app.post("/api/clouds")
async def add_cloud(cloud: Cloud):
    return {"added": cloud.shape, "alt": cloud.altitude}`,
    module: "Python for Web Development",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What library does FastAPI use for request data validation?",
        options: ["Pydantic", "SQLAlchemy", "Marshmallow", "WTForms"],
        answer: 0,
        explain: "Pydantic uses Python type hints to validate and parse incoming data automatically.",
      },
      {
        prompt: "What URL path shows auto-generated API documentation on a FastAPI server?",
        options: ["/docs", "/admin", "/api", "/help"],
        answer: 0,
        explain: "FastAPI generates Swagger UI documentation at /docs and ReDoc at /redoc by default.",
      },
      {
        prompt: "What advantage does 'async def' provide in FastAPI handlers?",
        options: ["Non-blocking concurrent request handling", "Faster CPU computation", "Automatic database connections", "Browser-side execution"],
        answer: 0,
        explain: "Async handlers let the server process other requests while waiting for I/O operations like database queries.",
      },
    ],
  },
  {
    slug: "py-requests-responses",
    order: 72,
    chapter: "Python Applied - Chapter 1",
    kicker: "PYTHON APPLIED",
    title: "Handling HTTP requests and responses",
    catalogTitle: "Requests + responses",
    blurb: "Parse query parameters, read JSON bodies, set status codes, and return headers.",
    catalogCode: "request.args.get('q')",
    intro:
      "Every web request carries data: **query parameters** in the URL, **headers** with metadata, and optionally a **body** with JSON or form data. Your backend reads these inputs, processes them, and returns a response with a **status code** indicating success or failure.",
    example: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/search")
def search():
    query = request.args.get("q", "")
    limit = request.args.get("limit", 10, type=int)

    results = [s for s in ["Vega", "Sirius", "Venus"]
               if query.lower() in s.lower()]

    return jsonify({
        "query": query,
        "results": results[:limit],
        "count": len(results),
    }), 200`,
    reads: [
      { dot: DOT_PINK, text: "**request.args.get('q')** reads a query parameter from the URL" },
      { dot: DOT_MINT, text: "**200** is the HTTP status code meaning the request succeeded" },
      { dot: DOT_LAVENDER, text: "The response body is a JSON object with query, results, and count" },
    ],
    tip: "Common status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error.",
    starter: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/filter")
def filter_items():
    min_alt = request.args.get("min", 0, type=int)
    clouds = [
        {"name": "cirrus", "alt": 8000},
        {"name": "stratus", "alt": 2000},
    ]
    filtered = [c for c in clouds if c["alt"] >= min_alt]
    return jsonify(filtered)`,
    module: "Python for Web Development",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "How do you read a URL query parameter named 'q' in Flask?",
        options: ["request.args.get('q')", "request.body['q']", "request.query('q')", "request.params.q"],
        answer: 0,
        explain: "Flask stores query parameters in request.args, a dictionary-like object.",
      },
      {
        prompt: "What HTTP status code means 'resource not found'?",
        options: ["404", "200", "500", "301"],
        answer: 0,
        explain: "404 Not Found tells the client that the requested resource does not exist on the server.",
      },
      {
        prompt: "What part of an HTTP request typically carries JSON data?",
        options: ["The request body", "The URL path", "The status code", "The response headers"],
        answer: 0,
        explain: "JSON payloads are sent in the request body, usually with POST or PUT methods.",
      },
    ],
  },
  {
    slug: "py-numpy-arrays",
    order: 73,
    chapter: "Python Applied - Chapter 2",
    kicker: "PYTHON APPLIED",
    title: "NumPy arrays and vectorized math",
    catalogTitle: "NumPy arrays",
    blurb: "Perform fast element-wise math on arrays without writing loops.",
    catalogCode: "np.array([1, 2, 3]) * 2",
    intro:
      "**NumPy** is the foundation of scientific Python. Its **ndarray** stores homogeneous data in contiguous memory, enabling vectorized operations that run orders of magnitude faster than Python loops.",
    example: `import numpy as np

temps = np.array([15.2, 18.7, 22.1, 19.5, 25.0])

# Vectorized operations (no loop needed)
celsius_to_f = temps * 9 / 5 + 32
print("Fahrenheit:", celsius_to_f)

# Statistical summaries
print("Mean:", temps.mean())
print("Max:", temps.max())
print("Std:", temps.std().round(2))`,
    reads: [
      { dot: DOT_PINK, text: "**np.array([...])** creates a NumPy array from a Python list" },
      { dot: DOT_MINT, text: "**temps * 9 / 5 + 32** applies math to every element at once (vectorized)" },
      { dot: DOT_LAVENDER, text: "**.mean()**, **.max()**, **.std()** compute statistics without loops" },
    ],
    tip: "NumPy arrays must contain elements of the same type (all ints or all floats). This constraint enables the speed gains.",
    starter: `import numpy as np

altitudes = np.array([2000, 5000, 8000, 3500])
print("Doubled:", altitudes * 2)
print("Sum:", altitudes.sum())
print("Shape:", altitudes.shape)`,
    task: {
      prompt: "Use a boolean mask to keep the altitudes above 3000, print that array, then print its mean.",
      expectOutput: ["[5000 8000 3500]", "5500.0"],
      mustInclude: ["altitudes\\s*>\\s*3000"],
      hint: "`high = altitudes[altitudes > 3000]` keeps only the values where the test is True.",
      solution: code`import numpy as np

altitudes = np.array([2000, 5000, 8000, 3500])
high = altitudes[altitudes > 3000]
print(high)
print(high.mean())`,
    },
    packages: ["numpy"],
    practiceSlug: "py-numpy-arrays",
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-pandas-dataframes",
    order: 74,
    chapter: "Python Applied - Chapter 2",
    kicker: "PYTHON APPLIED",
    title: "Tabular data with Pandas DataFrames",
    catalogTitle: "Pandas DataFrames",
    blurb: "Load, inspect, and query structured tables using Pandas.",
    catalogCode: "df = pd.read_csv('data.csv')",
    intro:
      "**Pandas** builds on NumPy to provide **DataFrames**, two-dimensional labeled tables. You can load data from CSV files, filter rows, select columns, and compute aggregates with concise syntax.",
    example: `import pandas as pd

data = {
    "star": ["Vega", "Sirius", "Polaris", "Betelgeuse"],
    "magnitude": [0.03, -1.46, 1.98, 0.42],
    "distance_ly": [25, 8.6, 433, 700],
}
df = pd.DataFrame(data)

print(df.head())
print("Brightest:", df.loc[df["magnitude"].idxmin(), "star"])
print("Close stars:", df[df["distance_ly"] < 100])`,
    reads: [
      { dot: DOT_PINK, text: "**pd.DataFrame(data)** creates a table from a dictionary of columns" },
      { dot: DOT_MINT, text: "**df[df['distance_ly'] < 100]** filters rows where the condition is True" },
      { dot: DOT_LAVENDER, text: "**.idxmin()** finds the index of the minimum value in a column" },
    ],
    tip: "Use df.info() to see column types and missing value counts, and df.describe() for statistical summaries of every numeric column.",
    starter: `import pandas as pd

clouds = pd.DataFrame({
    "type": ["cirrus", "cumulus", "stratus"],
    "altitude_m": [8000, 2000, 1500],
    "rain": [False, True, True],
})
print(clouds)
print(clouds[clouds["rain"] == True])`,
    task: {
      prompt: "Add an `altitude_km` column (the metres divided by 1000), then print `clouds[\"altitude_km\"].tolist()`.",
      expectOutput: ["[8.0, 2.0, 1.5]"],
      mustInclude: ["altitude_km"],
      hint: "`clouds[\"altitude_km\"] = clouds[\"altitude_m\"] / 1000` builds the whole column at once.",
      solution: code`import pandas as pd

clouds = pd.DataFrame({
    "type": ["cirrus", "cumulus", "stratus"],
    "altitude_m": [8000, 2000, 1500],
    "rain": [False, True, True],
})
clouds["altitude_km"] = clouds["altitude_m"] / 1000
print(clouds["altitude_km"].tolist())`,
    },
    packages: ["pandas"],
    practiceSlug: "py-pandas-dataframes",
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-data-cleaning",
    order: 75,
    chapter: "Python Applied - Chapter 2",
    kicker: "PYTHON APPLIED",
    title: "Loading and cleaning messy data",
    catalogTitle: "Data cleaning",
    blurb: "Handle missing values, fix types, and reshape raw datasets for analysis.",
    catalogCode: "df.dropna(subset=['col'])",
    intro:
      "Real-world data is messy. Columns may have **missing values** (NaN), incorrect types, or inconsistent formatting. Pandas provides tools to detect, fill, drop, and convert bad data before analysis.",
    example: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "city": ["Tokyo", "Paris", None, "Lima"],
    "temp": ["22", "18", "30", "missing"],
    "humidity": [65, np.nan, 80, 55],
})

# Convert temp to numeric (invalid becomes NaN)
df["temp"] = pd.to_numeric(df["temp"], errors="coerce")

# Fill missing humidity with the column median
df["humidity"] = df["humidity"].fillna(df["humidity"].median())

# Drop rows with missing city
df = df.dropna(subset=["city"])
print(df)`,
    reads: [
      { dot: DOT_PINK, text: "**pd.to_numeric(..., errors='coerce')** converts invalid strings to NaN" },
      { dot: DOT_MINT, text: "**.fillna(median)** replaces missing values with the column's median" },
      { dot: DOT_LAVENDER, text: "**.dropna(subset=['city'])** removes rows where city is missing" },
    ],
    tip: "Always inspect your data with df.info() and df.isna().sum() before analysis to understand the scope of missing or mistyped values.",
    starter: `import pandas as pd
import numpy as np

weather = pd.DataFrame({
    "day": ["Mon", "Tue", "Wed"],
    "rain_mm": [5.0, np.nan, 12.0],
})
weather["rain_mm"] = weather["rain_mm"].fillna(0)
print(weather)`,
    task: {
      prompt: "Add a `temp` column from the readings `[\"18\", \"x\", \"21\"]` with `pd.to_numeric(..., errors=\"coerce\")`, fill the missing value with 0, then print `weather[\"temp\"].tolist()`.",
      expectOutput: ["[18.0, 0.0, 21.0]"],
      mustInclude: ["to_numeric", "errors\\s*=\\s*[\"']coerce[\"']"],
      hint: "`errors=\"coerce\"` turns anything that is not a number into NaN, and `.fillna(0)` replaces it.",
      solution: code`import pandas as pd
import numpy as np

weather = pd.DataFrame({
    "day": ["Mon", "Tue", "Wed"],
    "rain_mm": [5.0, np.nan, 12.0],
})
weather["rain_mm"] = weather["rain_mm"].fillna(0)
weather["temp"] = pd.to_numeric(["18", "x", "21"], errors="coerce")
weather["temp"] = weather["temp"].fillna(0)
print(weather["temp"].tolist())`,
    },
    packages: ["pandas", "numpy"],
    practiceSlug: "py-data-cleaning",
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-data-plotting",
    order: 76,
    chapter: "Python Applied - Chapter 2",
    kicker: "PYTHON APPLIED",
    title: "Visualizing data with Matplotlib",
    catalogTitle: "Data plotting",
    blurb: "Create line charts, bar charts, and scatter plots to explore patterns in data.",
    catalogCode: "plt.plot(x, y)",
    intro:
      "**Matplotlib** is Python's foundational plotting library. Its **pyplot** interface lets you create line plots, bar charts, scatter plots, and histograms with just a few function calls.",
    example: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
temps = [2, 5, 11, 16, 21]

plt.figure(figsize=(8, 4))
plt.plot(months, temps, marker="o", color="#7b68ee")
plt.title("Average Temperature")
plt.ylabel("Celsius")
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("temps.png")
plt.show()`,
    reads: [
      { dot: DOT_PINK, text: "**plt.plot(x, y)** draws a line chart connecting the data points" },
      { dot: DOT_MINT, text: "**marker='o'** adds circular markers at each data point" },
      { dot: DOT_LAVENDER, text: "**plt.savefig('temps.png')** saves the chart to an image file" },
    ],
    tip: "For quick DataFrame plots, use df.plot() directly. It calls Matplotlib under the hood but saves you from manual axis setup.",
    starter: `import matplotlib.pyplot as plt

clouds = ["cirrus", "cumulus", "stratus"]
altitudes = [8000, 2000, 1500]

plt.bar(clouds, altitudes, color=["#cdb9f7", "#a9ecc9", "#ffb6d9"])
plt.title("Cloud Altitudes")
plt.ylabel("Meters")
plt.show()`,
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "Which function creates a line chart in Matplotlib?",
        options: ["plt.plot()", "plt.line()", "plt.draw()", "plt.chart()"],
        answer: 0,
        explain: "plt.plot(x, y) is the core function for creating line charts in Matplotlib's pyplot interface.",
      },
      {
        prompt: "How do you save a Matplotlib chart to a file?",
        options: ["plt.savefig('filename.png')", "plt.save('filename.png')", "plt.export('filename.png')", "plt.write('filename.png')"],
        answer: 0,
        explain: "plt.savefig() writes the current figure to a file in formats like PNG, PDF, or SVG.",
      },
      {
        prompt: "Which chart type is best for comparing category counts?",
        options: ["Bar chart", "Line chart", "Scatter plot", "Pie chart"],
        answer: 0,
        explain: "Bar charts excel at comparing discrete categories. Line charts are better for continuous trends over time.",
      },
    ],
  },
  {
    slug: "py-ml-intro",
    order: 77,
    chapter: "Python Applied - Chapter 2",
    kicker: "PYTHON APPLIED",
    title: "Intro to machine learning with scikit-learn",
    catalogTitle: "ML with sklearn",
    blurb: "Train a simple classifier, evaluate accuracy, and make predictions using scikit-learn.",
    catalogCode: "model.fit(X_train, y_train)",
    intro:
      "**scikit-learn** provides a consistent API for machine learning in Python. The core workflow is: prepare data, split into training and test sets, choose a model, call **.fit()** to train, and **.predict()** to classify or regress on new data.",
    example: `from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Sample dataset: cloud features -> rain prediction
X = [[8000, 10], [2000, 80], [1500, 90], [7000, 15],
     [2500, 75], [9000, 5], [1800, 85], [6000, 20]]
y = [0, 1, 1, 0, 1, 0, 1, 0]  # 0 = no rain, 1 = rain

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))`,
    reads: [
      { dot: DOT_PINK, text: "**train_test_split** divides data into training and evaluation portions" },
      { dot: DOT_MINT, text: "**model.fit(X_train, y_train)** trains the model on labeled examples" },
      { dot: DOT_LAVENDER, text: "**model.predict(X_test)** generates predictions on unseen data" },
    ],
    tip: "Always evaluate on a held-out test set, never on training data. Training accuracy can be misleadingly high if the model memorizes rather than generalizes.",
    starter: `from sklearn.tree import DecisionTreeClassifier

# altitude (m) and humidity (%)
X = [[8000, 10], [2000, 80], [1500, 90], [7000, 15]]
y = [0, 1, 1, 0]  # 0 = clear, 1 = rain

model = DecisionTreeClassifier()
model.fit(X, y)

new_cloud = [[3000, 70]]
print("Prediction:", model.predict(new_cloud))`,
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What does model.fit(X, y) do in scikit-learn?",
        options: ["Trains the model on the provided data and labels", "Makes predictions on new data", "Loads a pre-trained model from disk", "Splits data into train and test sets"],
        answer: 0,
        explain: ".fit() is the training step. It adjusts the model's internal parameters to learn patterns from X and y.",
      },
      {
        prompt: "Why should you split data into training and test sets?",
        options: ["To evaluate how well the model generalizes to unseen data", "To make training faster", "To reduce memory usage", "Because scikit-learn requires it"],
        answer: 0,
        explain: "Testing on unseen data reveals whether the model learned general patterns or just memorized the training examples.",
      },
      {
        prompt: "What does accuracy_score measure?",
        options: ["The fraction of correct predictions", "The speed of the model", "The amount of training data used", "The number of features"],
        answer: 0,
        explain: "accuracy_score computes the ratio of correct predictions to total predictions on the test set.",
      },
    ],
  },
];
