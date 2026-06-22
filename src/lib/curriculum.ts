/**
 * The curriculum: the source of truth for lessons. Pages read from here, so the
 * platform is content-driven (add a lesson object and a new page exists, runs
 * real Python, and shows up in the catalog and the journey map).
 *
 * This is mock-free content the learner can actually study. Later phases move it
 * to authored files / a backend, but the shape stays the same.
 *
 * Text fields support a tiny **bold** syntax (rendered by LessonView).
 */

export interface ReadsBullet {
  /** accent dot colour */
  dot: string;
  text: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Lesson {
  slug: string;
  order: number;
  /** e.g. "Python Basics - Chapter 1" */
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
  language?: "python" | "javascript" | "csharp" | "typescript";
  module?: string;
  tier?: "beginner" | "intermediate" | "advanced" | "expert";
  /** false for read + quiz lessons without a client-side runner (e.g. C#) */
  runnable?: boolean;
  /** quiz questions for read + quiz lessons */
  quiz?: QuizQuestion[];
}

const DOT_PINK = "#ffb6d9";
const DOT_MINT = "#a9ecc9";
const DOT_LAVENDER = "#cdb9f7";
const CHAPTER = "Python Basics - Chapter 1";

export const lessons: Lesson[] = [
  {
    slug: "variables",
    order: 1,
    chapter: CHAPTER,
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
    practiceSlug: "variables",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "strings",
    order: 2,
    chapter: CHAPTER,
    kicker: "PYTHON BASICS",
    title: "Words and text",
    catalogTitle: "Strings",
    blurb: "Text lives inside quotes. Join it, repeat it, measure it.",
    catalogCode: 'name = "Nova"',
    intro:
      "A **string** is text wrapped in quotes. You can glue strings together with **+**, repeat them with *****, and ask how long one is with **len()**.",
    example: `first = "night"
second = "sky"

print(first + " " + second)
print(first * 3)
print(len(first))`,
    reads: [
      { dot: DOT_PINK, text: '**+** joins strings end to end, so "night" + "sky" becomes "nightsky"' },
      { dot: DOT_MINT, text: '***** repeats a string, so "night" * 3 is "nightnightnight"' },
      { dot: DOT_LAVENDER, text: "**len(first)** counts the characters, here 5" },
    ],
    tip: "Quotes can be \"double\" or 'single', as long as both ends match.",
    starter: `# build a greeting from pieces
who = "dreamer"
greeting = "hello, " + who

print(greeting)
print(greeting.upper())`,
    practiceSlug: "strings",
    module: "Python Basics",
    tier: "beginner",
  },
  {
    slug: "comparisons",
    order: 3,
    chapter: CHAPTER,
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
    practiceSlug: "comparisons",
  },
  {
    slug: "if-else",
    order: 4,
    chapter: CHAPTER,
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
    starter: `# write an if-else statement to check temperature
temp = 15
if temp > 20:
    print("Warm sky")
else:
    print("Cold sky")`,
    module: "Conditionals and logic",
    tier: "beginner",
    language: "python",
    practiceSlug: "if-else",
  },
  {
    slug: "elif-chains",
    order: 5,
    chapter: CHAPTER,
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
    practiceSlug: "elif-chains",
  },
  {
    slug: "logical-operators",
    order: 6,
    chapter: CHAPTER,
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
    practiceSlug: "logical-operators",
  },
  {
    slug: "nested-conditions",
    order: 7,
    chapter: CHAPTER,
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
    practiceSlug: "nested-conditions",
  },
  {
    slug: "loops",
    order: 8,
    chapter: CHAPTER,
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
    practiceSlug: "loops",
    module: "Loops and iteration",
    tier: "beginner",
  },
  {
    slug: "for-over-range",
    order: 9,
    chapter: CHAPTER,
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
    starter: `# write a loop that prints numbers from 5 to 7
for i in range(5, 8):
    print(i)`,
    practiceSlug: "for-over-range",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "for-over-collections",
    order: 10,
    chapter: CHAPTER,
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
    practiceSlug: "for-over-collections",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "while-loops",
    order: 11,
    chapter: CHAPTER,
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
    practiceSlug: "while-loops",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "break-continue",
    order: 12,
    chapter: CHAPTER,
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
    practiceSlug: "break-continue",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "nested-loops",
    order: 13,
    chapter: CHAPTER,
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
    starter: `# sum the numbers from 1 to 4 using a loop
total = 0
for i in range(1, 5):
    total = total + i
print(total)`,
    practiceSlug: "nested-loops",
    module: "Loops and iteration",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "functions",
    order: 14,
    chapter: CHAPTER,
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
    starter: `# write a function that doubles a number
def double(n):
    return n * 2

print(double(4))
print(double(21))`,
    module: "Functions",
    tier: "beginner",
    language: "python",
  },
  {
    slug: "parameters-arguments",
    order: 15,
    chapter: CHAPTER,
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
    starter: `# define a function that adds two numbers together
def add(a, b):
    print(a + b)

add(5, 7)
add(10, 20)`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    practiceSlug: "parameters-arguments",
  },
  {
    slug: "return-values",
    order: 16,
    chapter: CHAPTER,
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
    starter: `# write a function that multiplies a number by 3 and returns it
def triple(x):
    return x * 3

print(triple(5))`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    practiceSlug: "return-values",
  },
  {
    slug: "default-keyword-args",
    order: 17,
    chapter: CHAPTER,
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
    starter: `# write a function with a default parameter
def set_sky(color="pink"):
    print("The sky is " + color)

set_sky()
set_sky("neon")`,
    module: "Functions",
    tier: "beginner",
    language: "python",
    practiceSlug: "default-keyword-args",
  },
  {
    slug: "variable-scope",
    order: 18,
    chapter: CHAPTER,
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
    practiceSlug: "variable-scope",
  },
  {
    slug: "compose-functions",
    order: 19,
    chapter: CHAPTER,
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
    practiceSlug: "compose-functions",
  },
  {
    slug: "js-variables",
    order: 1,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Let and Const",
    catalogTitle: "Variables",
    blurb: "Store values in variables that can change (let) or stay solid (const).",
    catalogCode: "let sky = 'neon';",
    intro:
      "In JavaScript, you declare variables using **let** or **const**. Use **let** if the value will change, and **const** for constants that stay the same.",
    example: `let sky = "neon";
const stars = 100;
sky = "dusk";

console.log(sky);
console.log(stars);`,
    reads: [
      { dot: DOT_PINK, text: "**let sky** creates a re-assignable variable named sky" },
      { dot: DOT_MINT, text: "**const stars** creates a read-only constant variable stars" },
      { dot: DOT_LAVENDER, text: "**console.log()** is JavaScript's way of printing output" },
    ],
    tip: "Always default to **const** unless you know the variable needs to be re-assigned.",
    starter: `// practice declaring let and const variables
let mood = "dreamy";
const hours = 8;

console.log(mood);
console.log(hours);`,
    language: "javascript",
    practiceSlug: "js-variables",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-functions",
    order: 2,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Arrow Functions",
    catalogTitle: "Functions",
    blurb: "Compact blocks of logic using the modern fat arrow syntax.",
    catalogCode: "const glow = () => {};",
    intro:
      "JavaScript functions can be written using the compact **arrow function** syntax. They bundle reusable logic under a name.",
    example: `const greet = (name) => {
  return "hello, " + name;
};

console.log(greet("Nova"));`,
    reads: [
      { dot: DOT_PINK, text: "**const greet = (name) => { ... }** defines an arrow function" },
      { dot: DOT_MINT, text: "Inputs go in **parentheses**, followed by the fat arrow **=>**" },
      { dot: DOT_LAVENDER, text: "**return** passes the value back to the caller" },
    ],
    tip: "Arrow functions are the standard in modern JavaScript and React development.",
    starter: `// write an arrow function that doubles a number
const double = (n) => {
  return n * 2;
};

console.log(double(4));
console.log(double(21));`,
    language: "javascript",
    practiceSlug: "js-functions",
    module: "JS Basics",
    tier: "beginner",
  },
  {
    slug: "js-comparisons",
    order: 3,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Strict Equality",
    catalogTitle: "Comparisons",
    blurb: "Compare values using strict equality === and relational operators.",
    catalogCode: "skyState === 'clear'",
    intro:
      "JavaScript uses **===** (strict equality) and **!==** (strict inequality) to compare both the **value** and the **type**. Avoid **==**, which can coerce types and cause hidden bugs.",
    example: `const altitude = 1000;
const isHigh = altitude > 500;
console.log(isHigh);
console.log(altitude === "1000"); // false`,
    reads: [
      { dot: DOT_PINK, text: "**altitude > 500** compares numbers, returning true" },
      { dot: DOT_MINT, text: "**===** checks if value and type are identical, returning false here" },
    ],
    tip: "Always use strict equality ===. Using double equals == invites unexpected type conversion behavior.",
    starter: `// compare two variables
const stars = 50;
const hasMany = stars >= 100;
console.log(hasMany);`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    practiceSlug: "js-comparisons",
  },
  {
    slug: "js-if-else",
    order: 4,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "JavaScript If & Else",
    catalogTitle: "If & Else",
    blurb: "Branch your code using if statements and else blocks in JS.",
    catalogCode: "if (cloudy) { ... } else { ... }",
    intro:
      "An **if** statement evaluates a condition in parentheses. If True, it executes the block in curly braces. An optional **else** block runs if the condition is False.",
    example: `const isRainy = true;
if (isRainy) {
  console.log("Bring umbrella");
} else {
  console.log("Clear sky");
}`,
    reads: [
      { dot: DOT_PINK, text: "**if (isRainy)** checks if the condition inside parentheses is true" },
      { dot: DOT_MINT, text: "Curly braces {} group the statements to execute for each branch" },
    ],
    tip: "Unlike Python, JavaScript does not rely on indentation to find blocks; it uses curly braces. But keep your code indented for readability.",
    starter: `// write an if-else statement
const temp = 15;
if (temp < 10) {
  console.log("Cold");
} else {
  console.log("Warm");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    practiceSlug: "js-if-else",
  },
  {
    slug: "js-else-if",
    order: 5,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Else If Chains",
    catalogTitle: "Else If",
    blurb: "Link multiple options using else if blocks to check several conditions.",
    catalogCode: "else if (hour < 18)",
    intro:
      "Check multiple conditions using **else if** blocks. JavaScript runs the first block where the condition evaluates to true and skips the rest.",
    example: `const hour = 14;
if (hour < 12) {
  console.log("Morning");
} else if (hour < 18) {
  console.log("Afternoon");
} else {
  console.log("Night");
}`,
    reads: [
      { dot: DOT_PINK, text: "**else if (hour < 18)** runs only if the preceding if statement was false" },
      { dot: DOT_MINT, text: "The final else runs if no conditions were met" },
    ],
    tip: "You can insert as many else if blocks as necessary between the initial if and the final else.",
    starter: `// classify cloud cover
const cloudPercent = 40;
if (cloudPercent === 0) {
  console.log("Sunny");
} else if (cloudPercent < 50) {
  console.log("Partly Cloudy");
} else {
  console.log("Overcast");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    practiceSlug: "js-else-if",
  },
  {
    slug: "js-logical-operators",
    order: 6,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Boolean Operators",
    catalogTitle: "Logical ops",
    blurb: "Combine conditions with && (AND), || (OR), and ! (NOT).",
    catalogCode: "if (sun && !rain)",
    intro:
      "Use **&&** (AND) to require both sides to be true, **||** (OR) to succeed if either side is true, and **!** (NOT) to invert a boolean value.",
    example: `const hasKey = true;
const hasPass = false;
if (hasKey || hasPass) {
  console.log("Access granted");
}
console.log(!hasKey); // false`,
    reads: [
      { dot: DOT_PINK, text: "**hasKey || hasPass** evaluates to true because at least one is true" },
      { dot: DOT_MINT, text: "**!hasKey** flips true to false" },
    ],
    tip: "Logical operators short-circuit: if the result is determined by the first condition, the second condition is not evaluated.",
    starter: `// check stargazing conditions
const clearSky = true;
const lightPollution = false;
if (clearSky && !lightPollution) {
  console.log("Stargaze!");
} else {
  console.log("No view");
}`,
    module: "JS Conditionals & Logic",
    tier: "beginner",
    language: "javascript",
    practiceSlug: "js-logical-operators",
  },
  {
    slug: "js-ternary",
    order: 7,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Ternary Operator",
    catalogTitle: "Ternary operator",
    blurb: "Use the shorthand conditional operator for quick inline choices.",
    catalogCode: "const status = rain ? 'wet' : 'dry';",
    intro:
      "The **ternary operator** is a shorthand for simple if-else blocks. It takes a condition followed by a question mark **?**, then the expression to run if true, a colon **:**, and the expression to run if false.",
    example: `const score = 80;
const status = score >= 50 ? "Pass" : "Fail";
console.log(status);`,
    reads: [
      { dot: DOT_PINK, text: "**score >= 50** is evaluated as the condition" },
      { dot: DOT_MINT, text: "**Pass** is returned if the condition is true, **Fail** if false" },
    ],
    tip: "Ternaries are expressions, meaning they resolve to a value that can be assigned directly to a variable.",
    starter: `// write a ternary for light status
const sunIsUp = true;
const mode = sunIsUp ? "day" : "night";
console.log(mode);`,
    module: "JS Conditionals & Logic",
    tier: "intermediate",
    language: "javascript",
    practiceSlug: "js-ternary",
  },
  {
    slug: "lists",
    order: 20,
    chapter: CHAPTER,
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
    practiceSlug: "lists",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "dictionaries",
    order: 21,
    chapter: CHAPTER,
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
    starter: `# complete the dictionary and lookup the color
sky_item = {"name": "cloud", "color": "neon"}
print(sky_item["name"])
print(sky_item["color"])`,
    practiceSlug: "dictionaries",
    module: "Collections",
    tier: "beginner",
  },
  {
    slug: "py-list-comprehensions",
    order: 22,
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
    starter: `# complete list comprehension to keep numbers > 10
nums = [5, 12, 8, 21]
result = [x for x in nums if x > 10]
print(result)`,
    practiceSlug: "py-list-comprehensions",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-dict-comprehensions",
    order: 23,
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
    starter: `# complete dict comprehension to map names to their uppercase version
names = ["Alice", "Bob"]
res = {name: name.upper() for name in names}
print(res)`,
    practiceSlug: "py-dict-comprehensions",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-slicing",
    order: 24,
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
    practiceSlug: "py-slicing",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-sets-tuples",
    order: 25,
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
    practiceSlug: "py-sets-tuples",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-enumerate-zip",
    order: 26,
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
    practiceSlug: "py-enumerate-zip",
    module: "Comprehensions and data tools",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-exceptions",
    order: 27,
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
    practiceSlug: "py-exceptions",
    module: "Python Intermediate",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-file-handling",
    order: 28,
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
    starter: `# open and write to log.txt
with open("log.txt", "w") as f:
    f.write("initial log")`,
    practiceSlug: "py-file-handling",
    module: "Python Intermediate",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-oop",
    order: 29,
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
    starter: `# write a cloud class that initializes shape
class Cloud:
    def __init__(self, shape):
        self.shape = shape
c = Cloud("cumulus")
print(c.shape)`,
    practiceSlug: "py-oop",
    module: "Python Intermediate",
    tier: "intermediate",
    language: "python",
  },
  {
    slug: "py-generators",
    order: 30,
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
    starter: `# create a generator that yields "sky" then "stars"
def simple_generator():
    yield "sky"
    yield "stars"

for x in simple_generator():
    print(x)`,
    practiceSlug: "py-generators",
    module: "Python Advanced",
    tier: "advanced",
    language: "python",
  },
  {
    slug: "py-decorators",
    order: 31,
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
    starter: `# complete decorator that prints announced text
def announce(func):
    def wrapper():
        print("Starting")
        func()
    return wrapper

@announce
def task():
    print("Working")

task()`,
    practiceSlug: "py-decorators",
    module: "Python Advanced",
    tier: "advanced",
    language: "python",
  },
  {
    slug: "js-loops",
    order: 8,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Repeating code",
    catalogTitle: "Loops",
    blurb: "Repeat steps using standard for loops and for...of iteration.",
    catalogCode: "for (let i = 0; i < 3; i++)",
    intro:
      "In JavaScript, you can repeat code using a **for** loop. The loop initialization, condition, and increment go inside parentheses, separated by semicolons.",
    example: `for (let i = 0; i < 3; i++) {
  console.log("hop " + i);
}`,
    reads: [
      { dot: DOT_PINK, text: "`let i = 0` initializes a counter variable at 0." },
      { dot: DOT_MINT, text: "`i < 3` keeps looping as long as the counter is less than 3." },
      { dot: DOT_LAVENDER, text: "`i++` adds 1 to the counter at the end of each turn." },
    ],
    tip: "You can also loop over arrays using the modern `for (const item of array)` syntax.",
    starter: `// write a loop that counts from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
    language: "javascript",
    practiceSlug: "js-loops",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-arrays",
    order: 9,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Array lists",
    catalogTitle: "Arrays",
    blurb: "Keep ordered collections of elements in JavaScript arrays.",
    catalogCode: "const clouds = ['wispy'];",
    intro:
      "JavaScript **arrays** are list-like objects used to store multiple values. They are zero-indexed and support built-in helper functions like `.push()` and `.length`.",
    example: `const clouds = ["cirrus", "stratus"];
console.log(clouds.length);
console.log(clouds[0]);`,
    reads: [
      { dot: DOT_PINK, text: '`["cirrus", "stratus"]` declares an array of two strings.' },
      { dot: DOT_MINT, text: '`clouds.length` gets the number of elements in the array.' },
    ],
    tip: "You can add elements to the end of an array using the `.push(value)` method.",
    starter: `// print the array and push a new cloud
const sky = ["puffy", "grey"];
sky.push("neon");
console.log(sky);
console.log(sky.length);`,
    language: "javascript",
    practiceSlug: "js-arrays",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-objects",
    order: 10,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Labeled structures",
    catalogTitle: "Objects",
    blurb: "Store keyed collections of properties using JavaScript objects.",
    catalogCode: "const star = { mag: 1 };",
    intro:
      "JavaScript **objects** store key-value properties. You can declare them using curly braces `{}` and retrieve values using dot notation or bracket notation.",
    example: `const star = { name: "Polaris", mag: 1.97 };
console.log(star.name);
console.log(star["mag"]);`,
    reads: [
      { dot: DOT_PINK, text: '`star.name` uses dot notation to read the name property.' },
      { dot: DOT_MINT, text: '`star["mag"]` uses bracket notation to retrieve the magnitude.' },
    ],
    tip: "Objects are similar to Python dictionaries. Use keys (which must be valid strings) to store data.",
    starter: `// complete the object and read its property
const cloud = { shape: "wispy", height: 3000 };
console.log(cloud.shape);
console.log(cloud.height);`,
    language: "javascript",
    practiceSlug: "js-objects",
    module: "JS Collections & Loops",
    tier: "beginner",
  },
  {
    slug: "js-array-methods",
    order: 11,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Map and Filter",
    catalogTitle: "Array methods",
    blurb: "Transform and filter arrays using modern built-in iterators.",
    catalogCode: "arr.map(x => x * 2)",
    intro:
      "JavaScript arrays have built-in helper functions: **.map()** (creates a new array by transforming each element) and **.filter()** (creates a new array keeping only elements that match a check).",
    example: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
console.log(doubled);
console.log(evens);`,
    reads: [
      { dot: DOT_PINK, text: "**nums.map(n => n * 2)** loops over elements and returns their doubled values" },
      { dot: DOT_MINT, text: "**nums.filter(n => n % 2 === 0)** filters elements returning only those matching the condition" },
    ],
    tip: "These methods do not modify the original array; they return a brand new array, helping you keep your data safe.",
    starter: `// double all numbers in the array
const heights = [1000, 2000, 3000];
const altered = heights.map(h => h + 500);
console.log(altered);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    practiceSlug: "js-array-methods",
  },
  {
    slug: "js-destructuring",
    order: 12,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Destructuring & Spread",
    catalogTitle: "Destructure & spread",
    blurb: "Unpack arrays and objects or copy them using the spread operator.",
    catalogCode: "const { name } = star;",
    intro:
      "**Destructuring** lets you unpack values from arrays or properties from objects directly into distinct variables. The **spread operator ...** lets you copy or combine collections easily.",
    example: `const star = { name: "Vega", mag: 0.03 };
const { name, mag } = star;
console.log(name, mag);

const list1 = [1, 2];
const list2 = [...list1, 3, 4];
console.log(list2);`,
    reads: [
      { dot: DOT_PINK, text: "**const { name, mag } = star** creates variables named name and mag from the keys of star" },
      { dot: DOT_MINT, text: "**[...list1, 3, 4]** spreads the elements of list1 into a new array" },
    ],
    tip: "Destructuring makes unpacking function arguments or component props extremely clean and concise.",
    starter: `// destructure properties from the cloud object
const cloud = { shape: "wispy", height: 5000 };
const { shape, height } = cloud;
console.log(shape);
console.log(height);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    practiceSlug: "js-destructuring",
  },
  {
    slug: "js-object-methods",
    order: 13,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Object Keys & Values",
    catalogTitle: "Object iteration",
    blurb: "Extract keys and values from objects to loop over their properties.",
    catalogCode: "Object.keys(star)",
    intro:
      "To loop over or inspect the properties of an object, use **Object.keys()** (returns an array of keys) or **Object.values()** (returns an array of values).",
    example: `const star = { name: "Sirius", mag: -1.46 };
const keys = Object.keys(star);
console.log(keys);
const values = Object.values(star);
console.log(values);`,
    reads: [
      { dot: DOT_PINK, text: "**Object.keys(star)** returns a list of string keys" },
      { dot: DOT_MINT, text: "**Object.values(star)** returns a list of property values" },
    ],
    tip: "These methods allow you to use array methods like .map() or .forEach() on object data.",
    starter: `// list the keys of the cloud object
const stats = { speed: 40, temp: -10 };
const keys = Object.keys(stats);
console.log(keys);`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    practiceSlug: "js-object-methods",
  },
  {
    slug: "js-loop-iterators",
    order: 14,
    chapter: "JavaScript Climbs - Chapter 1",
    kicker: "JAVASCRIPT CLIMBS",
    title: "For Of and For In",
    catalogTitle: "Advanced loops",
    blurb: "Iterate over arrays with for...of and object keys with for...in.",
    catalogCode: "for (const item of array)",
    intro:
      "JavaScript provides loops tailored to specific data shapes: **for...of** (loops through array elements directly) and **for...in** (loops through the keys of an object).",
    example: `const stars = ["Vega", "Altair"];
for (const star of stars) {
  console.log(star);
}
const config = { speed: 10, mode: "fast" };
for (const key in config) {
  console.log(key, config[key]);
}`,
    reads: [
      { dot: DOT_PINK, text: "**for (const star of stars)** iterates over the elements themselves" },
      { dot: DOT_MINT, text: "**for (const key in config)** iterates over the object's keys" },
    ],
    tip: "Never use for...in to loop over arrays; it iterates over index strings, which can lead to unexpected type conversion errors.",
    starter: `// iterate over the array of clouds
const clouds = ["cirrus", "cumulus"];
for (const cloud of clouds) {
  console.log(cloud);
}`,
    module: "JS Collections Depth",
    tier: "intermediate",
    language: "javascript",
    practiceSlug: "js-loop-iterators",
  },
  {
    slug: "js-closures",
    order: 15,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Scope and closures",
    catalogTitle: "Closures",
    blurb: "Learn how nested functions remember variables from their outer scope.",
    catalogCode: "const outer = () => { ... }",
    intro:
      "A **closure** is created when an inner function remembers variables from its outer lexical environment, even after the outer function finishes executing.",
    example: `const counter = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  };
};
const next = counter();
console.log(next());
console.log(next());`,
    reads: [
      { dot: DOT_PINK, text: "**let count = 0** defines a private counter variable" },
      { dot: DOT_MINT, text: "**return () => { ... }** maintains lookup access to the count variable" },
    ],
    tip: "Closures allow you to create private state variables in JavaScript.",
    starter: `// practice closures with a greeting maker
const makeGreeting = (greeting) => {
  return (name) => greeting + ", " + name;
};
const hello = makeGreeting("Hello");
console.log(hello("Nova"));`,
    practiceSlug: "js-closures",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-callbacks",
    order: 16,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Callback functions",
    catalogTitle: "Callbacks",
    blurb: "Pass functions as arguments to execute them later.",
    catalogCode: "setTimeout(() => {}, 100)",
    intro:
      "A **callback** is a function passed into another function as an argument, which is then invoked inside the outer function to complete an action.",
    example: `const fetchCloud = (callback) => {
  const cloud = "cirrus";
  callback(cloud);
};
fetchCloud((name) => {
  console.log("Fetched: " + name);
});`,
    reads: [
      { dot: DOT_PINK, text: "**callback(cloud)** calls the passed-in callback function" },
      { dot: DOT_MINT, text: "**fetchCloud((name) => ...)** passes an anonymous arrow function as callback" },
    ],
    tip: "Callbacks are essential for handling asynchronous operations like timer events and network requests.",
    starter: `// multiply by two and pass to callback
const process = (x, cb) => cb(x * 2);
process(10, (res) => console.log(res));`,
    practiceSlug: "js-callbacks",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-async-await",
    order: 17,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Promises and Async/Await",
    catalogTitle: "Async & await",
    blurb: "Handle asynchronous tasks using Promises and modern await syntax.",
    catalogCode: "async function load() { await fetch(); }",
    intro:
      "**Promises** represent future values. The modern **async/await** syntax lets you write asynchronous code that reads like synchronous code.",
    example: `const loadSky = () => Promise.resolve("neon sky");

const main = async () => {
  const result = await loadSky();
  console.log(result);
};
main();`,
    reads: [
      { dot: DOT_PINK, text: "**async** keyword marks a function as asynchronous" },
      { dot: DOT_MINT, text: "**await** pauses execution until the promise resolves" },
    ],
    tip: "Always wrap your await calls in a try...catch block to handle network errors safely.",
    starter: `// load a delayed value
const delayedGlow = () => new Promise(res => res("glow"));
const run = async () => {
  const x = await delayedGlow();
  console.log(x);
};
run();`,
    practiceSlug: "js-async-await",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-classes",
    order: 18,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "JS ES6 Classes",
    catalogTitle: "Classes & OOP",
    blurb: "Create blueprints for objects using standard class syntax.",
    catalogCode: "class Cloud { constructor() {} }",
    intro:
      "JavaScript **classes** are templates for creating objects. They encapsulate data with methods and support constructor methods.",
    example: `class Cloud {
  constructor(shape, alt) {
    this.shape = shape;
    this.alt = alt;
  }
  describe() {
    return this.shape + " at " + this.alt;
  }
}
const c = new Cloud("wispy", 5000);
console.log(c.describe());`,
    reads: [
      { dot: DOT_PINK, text: "**constructor(...)** initializes the new object properties" },
      { dot: DOT_MINT, text: "**this** refers to the specific instance of the class" },
    ],
    tip: "Class syntax is syntactical sugar over JavaScript's existing prototype-based inheritance model.",
    starter: `// create a star class and print name
class Star {
  constructor(name) {
    this.name = name;
  }
}
const s = new Star("Vega");
console.log(s.name);`,
    practiceSlug: "js-classes",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-error-handling",
    order: 19,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "Catching errors with try-catch",
    catalogTitle: "Error handling",
    blurb: "Prevent program failure using try, catch, and throw.",
    catalogCode: "try { ... } catch (err) { ... }",
    intro:
      "Use **try...catch** to intercept errors. You can throw custom errors using the **throw** statement.",
    example: `try {
  throw new Error("Storm warning");
} catch (error) {
  console.log("Intercepted: " + error.message);
}`,
    reads: [
      { dot: DOT_PINK, text: "**throw new Error(...)** creates and fires an error object" },
      { dot: DOT_MINT, text: "**catch (error)** receives the thrown error" },
    ],
    tip: "You can also use a finally block to execute code regardless of whether an error was thrown.",
    starter: `// catch parsing errors
try {
  const result = JSON.parse("invalid_json");
} catch (e) {
  console.log("Parse failed");
}`,
    practiceSlug: "js-error-handling",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-modules",
    order: 20,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "JS ES Modules",
    catalogTitle: "ES Modules",
    blurb: "Split code across files using import and export keywords.",
    catalogCode: "export const x = 1; import { x } from './file';",
    intro:
      "ES Modules let you share code between files. Use **export** to expose functions or variables, and **import** to pull them into another file.",
    example: `const math = {
  add: (a, b) => a + b
};
console.log(math.add(5, 10));`,
    reads: [
      { dot: DOT_PINK, text: "**export const add** exports the named function binding" },
      { dot: DOT_MINT, text: "**import { add }** imports it in another file module" },
    ],
    tip: "ES Modules run in strict mode automatically, helping avoid undeclared variables.",
    starter: `// mock dynamic module config loading
const config = { api: "https://api" };
console.log(config.api);`,
    practiceSlug: "js-modules",
    module: "JS Advanced Logic",
    tier: "intermediate",
    language: "javascript",
  },
  {
    slug: "js-array-reduce",
    order: 21,
    chapter: "JavaScript Climbs - Chapter 3",
    kicker: "JAVASCRIPT CLIMBS",
    title: "The Reduce Method",
    catalogTitle: "Array reduce",
    blurb: "Accumulate an array of values into a single result value.",
    catalogCode: "arr.reduce((acc, curr) => acc + curr, 0)",
    intro:
      "The **.reduce()** method executes a reducer function on each element, resulting in a single output value.",
    example: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);
console.log(sum);`,
    reads: [
      { dot: DOT_PINK, text: "**accumulator** accumulates the callbacks' return values" },
      { dot: DOT_MINT, text: "**0** is the initial value of the accumulator parameter" },
    ],
    tip: "The initial value is optional but highly recommended to avoid errors on empty arrays.",
    starter: `// sum the values in the prices array
const prices = [10, 20, 30];
const total = prices.reduce((acc, p) => acc + p, 0);
console.log(total);`,
    practiceSlug: "js-array-reduce",
    module: "JS Advanced Logic",
    tier: "advanced",
    language: "javascript",
  },
  {
    slug: "js-dom-basics",
    order: 22,
    chapter: "JavaScript Climbs - Chapter 2",
    kicker: "JAVASCRIPT CLIMBS",
    title: "DOM Manipulation",
    catalogTitle: "DOM manipulation",
    blurb: "Select elements and respond to web events dynamically.",
    catalogCode: "el.addEventListener('click', ...)",
    intro:
      "The **Document Object Model (DOM)** represents a web page. Use `document.querySelector` to find elements, and `addEventListener` to listen for user interactions.",
    example: `const button = {
  click: () => console.log("Clicked!"),
  addEventListener: (event, cb) => cb()
};
button.addEventListener("click", () => {
  console.log("Triggered");
});`,
    reads: [
      { dot: DOT_PINK, text: "**addEventListener(...)** binds an event type to a callback function" },
    ],
    tip: "Standard DOM events include 'click', 'keydown', 'submit', and 'change'.",
    starter: `// mock DOM operations
const logClick = () => console.log("Event log");
logClick();`,
    practiceSlug: "js-dom-basics",
    module: "JS Web APIs",
    tier: "intermediate",
    language: "javascript",
  },  // --- C# track (read + quiz; execution is deferred until a server-side sandbox).
  {
    slug: "cs-hello",
    order: 1,
    chapter: "C# Foundations - Chapter 1",
    kicker: "C# FOUNDATIONS",
    title: "Your first C# program",
    catalogTitle: "Hello, C#",
    blurb: "Read how a C# program is structured and what prints to the console.",
    catalogCode: 'Console.WriteLine("Hi");',
    intro:
      "C# code lives inside **classes** and **methods**. A program starts in a special method called **Main**. To print a line of text, you call **Console.WriteLine**.",
    example: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, sky!");
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**Console.WriteLine(...)** prints a line of text to the console" },
      { dot: DOT_MINT, text: "**static void Main()** is where the program starts running" },
      { dot: DOT_LAVENDER, text: "**using System;** brings in the namespace that contains Console" },
    ],
    tip: "C# statements end with a semicolon, and every line of code lives inside a class and a method.",
    starter: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, sky!");
    }
}`,
    module: "C# Foundations",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which call prints a line of text to the console in C#?",
        options: ["Console.WriteLine(...)", "print(...)", "console.log(...)", "echo(...)"],
        answer: 0,
        explain: "Console.WriteLine writes a line to the console. print and console.log are Python and JavaScript.",
      },
      {
        prompt: "Where does a C# program begin running?",
        options: ["The Main method", "The first line of the file", "A method named start", "The top of the class"],
        answer: 0,
        explain: "Execution starts in the Main method.",
      },
      {
        prompt: "What ends most C# statements?",
        options: ["A semicolon ;", "A new line", "A colon :", "Nothing"],
        answer: 0,
        explain: "C# uses a semicolon to end a statement; indentation is just for readability.",
      },
    ],
  },
  {
    slug: "cs-variables",
    order: 2,
    chapter: "C# Foundations - Chapter 1",
    kicker: "C# FOUNDATIONS",
    title: "Variables and types",
    catalogTitle: "Variables & types",
    blurb: "C# is statically typed: every variable has a type, set explicitly or inferred.",
    catalogCode: "int stars = 100;",
    intro:
      "C# is **statically typed**, so every variable has a type. Use **int** for whole numbers, **string** for text in double quotes, and **bool** for true or false. The keyword **var** lets the compiler infer the type for you.",
    example: `int stars = 100;
string sky = "neon";
bool isClear = true;
var mood = "dreamy";

Console.WriteLine(stars);
Console.WriteLine(sky);`,
    reads: [
      { dot: DOT_PINK, text: "**int stars = 100;** declares a whole-number variable named stars" },
      { dot: DOT_MINT, text: '**string sky = "neon";** holds text, always in double quotes' },
      { dot: DOT_LAVENDER, text: "**var mood** lets the compiler infer the type from the value" },
    ],
    tip: "In C#, double quotes make a string and single quotes make a single char. They are not interchangeable.",
    starter: `int stars = 100;
string sky = "neon";
bool isClear = true;

Console.WriteLine(stars);`,
    module: "C# Foundations",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which type holds whole numbers?",
        options: ["int", "string", "bool", "char"],
        answer: 0,
        explain: "int stores whole numbers. string is text, bool is true/false, char is a single character.",
      },
      {
        prompt: "How do you write a text (string) value in C#?",
        options: ['In double quotes "..."', "In single quotes '...'", "With backticks", "With no quotes"],
        answer: 0,
        explain: "Strings use double quotes. Single quotes are for a single char.",
      },
      {
        prompt: "What does the `var` keyword do?",
        options: [
          "Lets the compiler infer the variable's type",
          "Makes the variable global",
          "Declares a constant that cannot change",
          "Turns off type checking entirely",
        ],
        answer: 0,
        explain: "var keeps C# statically typed; the compiler infers the type from the assigned value.",
      },
    ],
  },
  {
    slug: "cs-conditionals",
    order: 3,
    chapter: "C# Foundations - Chapter 1",
    kicker: "C# FOUNDATIONS",
    title: "Branching with if and else",
    catalogTitle: "If & Else",
    blurb: "Branch your code using if, else if, and else blocks in C#.",
    catalogCode: 'if (sky == "clear") { }',
    intro:
      "Use **if** statements to run code only when a condition is true. Combine them with **else if** to check other possibilities, and **else** for a default fallback.",
    example: `string sky = "rainy";
if (sky == "clear") {
    Console.WriteLine("Clear sky!");
} else if (sky == "rainy") {
    Console.WriteLine("Take an umbrella.");
} else {
    Console.WriteLine("Unknown sky.");
}`,
    reads: [
      { dot: DOT_PINK, text: "**if (sky == \"clear\")** checks if the variable matches \"clear\"" },
      { dot: DOT_MINT, text: "**else if** checks another condition when the previous ones failed" },
      { dot: DOT_LAVENDER, text: "**else** defines a block that runs if no conditions matched" },
    ],
    tip: "In C#, conditions inside if statements must evaluate to a boolean (bool). You cannot check raw integers or strings directly.",
    starter: `using System;

class Program {
    static void Main() {
        int temp = 15;
        if (temp > 20) {
            Console.WriteLine("Warm");
        } else {
            Console.WriteLine("Cold");
        }
    }
}`,
    module: "C# Foundations",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What type must the condition of an if statement evaluate to in C#?",
        options: ["bool", "int", "string", "any type"],
        answer: 0,
        explain: "C# strictly requires conditions inside control statements like if to be of boolean type.",
      },
      {
        prompt: "Which block runs if all preceding if/else-if conditions evaluate to false?",
        options: ["else", "else if", "then", "catch"],
        answer: 0,
        explain: "The else block handles the fallback case when no other condition is met.",
      },
    ],
  },
  {
    slug: "cs-switch",
    order: 4,
    chapter: "C# Foundations - Chapter 1",
    kicker: "C# FOUNDATIONS",
    title: "Choice with switch",
    catalogTitle: "Switch statements",
    blurb: "Simplify multi-branch conditions using switch statements.",
    catalogCode: "switch (code) { }",
    intro:
      "A **switch statement** evaluates an expression and matches it against one of several **case** blocks. It is cleaner than a long chain of else-if statements when checking a single value.",
    example: `string mood = "dreamy";
switch (mood) {
    case "neon":
        Console.WriteLine("Bright night");
        break;
    case "dreamy":
        Console.WriteLine("Soft stars");
        break;
    default:
        Console.WriteLine("Neutral sky");
        break;
}`,
    reads: [
      { dot: DOT_PINK, text: "**switch (mood)** evaluates the variable mood" },
      { dot: DOT_MINT, text: '**case "neon":** defines a block that runs if mood equals "neon"' },
      { dot: DOT_LAVENDER, text: "**break;** exits the switch statement, avoiding fallthrough" },
    ],
    tip: "C# requires a control flow jump (like break, return, or throw) at the end of each non-empty case block. Case fallthrough is not allowed.",
    starter: `using System;

class Program {
    static void Main() {
        string tier = "pro";
        switch (tier) {
            case "free":
                Console.WriteLine("Basic tools");
                break;
            case "pro":
                Console.WriteLine("All tools");
                break;
            default:
                Console.WriteLine("Invalid tier");
                break;
        }
    }
}`,
    module: "C# Foundations",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What keyword handles unmatched values in a switch statement?",
        options: ["default", "else", "fallback", "catch"],
        answer: 0,
        explain: "The default keyword handles any values that do not match any of the case labels.",
      },
      {
        prompt: "What is required at the end of each non-empty case block in C#?",
        options: ["A jump statement like break", "A semicolon only", "A return statement only", "Nothing"],
        answer: 0,
        explain: "C# does not allow implicit fallthrough; you must explicitly use break, return, or another jump statement.",
      },
    ],
  },
  {
    slug: "cs-loops",
    order: 5,
    chapter: "C# Loops & Arrays - Chapter 1",
    kicker: "C# LOOPS & ARRAYS",
    title: "Repeating with loops",
    catalogTitle: "Loops",
    blurb: "Repeat steps using for, while, and do-while loops in C#.",
    catalogCode: "for (int i = 0; i < 5; i++)",
    intro:
      "C# offers several ways to repeat code: **for** loops (best when you know the count), **while** loops (runs while a condition is true), and **do-while** loops (always runs at least once).",
    example: `for (int i = 0; i < 3; i++) {
    Console.WriteLine("Hop: " + i);
}

int count = 0;
while (count < 2) {
    Console.WriteLine("Count: " + count);
    count++;
}`,
    reads: [
      { dot: DOT_PINK, text: "**int i = 0** declares and initializes a counter variable" },
      { dot: DOT_MINT, text: "**i < 3** tests if the counter is still less than 3" },
      { dot: DOT_LAVENDER, text: "**i++** increments the counter at the end of each iteration" },
    ],
    tip: "Always ensure a while loop has a path to false, otherwise it becomes an infinite loop and hangs the program.",
    starter: `using System;

class Program {
    static void Main() {
        for (int i = 1; i <= 5; i++) {
            Console.WriteLine(i);
        }
    }
}`,
    module: "C# Loops & Arrays",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which loop guarantees that its body runs at least once?",
        options: ["do-while", "while", "for", "foreach"],
        answer: 0,
        explain: "A do-while loop evaluates its condition at the end of the loop, ensuring the body runs once.",
      },
      {
        prompt: "Which statement skips the rest of the current iteration and starts the next one?",
        options: ["continue", "break", "return", "goto"],
        answer: 0,
        explain: "continue jumps straight to the next iteration of the loop, whereas break exits the loop.",
      },
    ],
  },
  {
    slug: "cs-arrays",
    order: 6,
    chapter: "C# Loops & Arrays - Chapter 1",
    kicker: "C# LOOPS & ARRAYS",
    title: "Fixed-size arrays",
    catalogTitle: "Arrays",
    blurb: "Declare and iterate over fixed-length sequences of elements.",
    catalogCode: "int[] numbers = new int[5];",
    intro:
      "An **array** stores multiple elements of the same type in a single variable. Its size is **fixed** when created. Access elements using zero-based indices.",
    example: `string[] clouds = new string[] { "wispy", "puffy", "grey" };
Console.WriteLine(clouds.Length); // 3
Console.WriteLine(clouds[0]); // wispy

foreach (string cloud in clouds) {
    Console.WriteLine(cloud);
}`,
    reads: [
      { dot: DOT_PINK, text: "**string[]** declares a variable that holds an array of strings" },
      { dot: DOT_MINT, text: "**new string[] { ... }** creates the array with starting values" },
      { dot: DOT_LAVENDER, text: "**clouds.Length** returns the number of items in the array" },
    ],
    tip: "Since arrays have a fixed size, you cannot add or remove elements after creation. If you need a dynamic size, use List<T>.",
    starter: `using System;

class Program {
    static void Main() {
        int[] scores = { 90, 85, 100 };
        Console.WriteLine(scores[1]);
    }
}`,
    module: "C# Loops & Arrays",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What property retrieves the total number of elements in a C# array?",
        options: ["Length", "Count", "Size", "Capacity"],
        answer: 0,
        explain: "Arrays use the Length property, whereas Lists use the Count property.",
      },
      {
        prompt: "Which keyword iterates over elements without keeping an explicit index variable?",
        options: ["foreach", "for", "while", "iterate"],
        answer: 0,
        explain: "foreach handles elements directly one by one.",
      },
    ],
  },
  {
    slug: "cs-lists",
    order: 7,
    chapter: "C# Loops & Arrays - Chapter 1",
    kicker: "C# LOOPS & ARRAYS",
    title: "Dynamic generic lists",
    catalogTitle: "Lists",
    blurb: "Use List<T> to manage dynamic sequences that can grow or shrink.",
    catalogCode: "List<string> list = new();",
    intro:
      "The **List<T>** class from System.Collections.Generic represents a strongly-typed list of objects. Unlike arrays, a list grows dynamically as elements are added.",
    example: `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        List<string> stars = new List<string>();
        stars.Add("Sirius");
        stars.Add("Vega");
        Console.WriteLine(stars.Count); // 2
        stars.Remove("Vega");
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**List<string>** defines a list containing strings" },
      { dot: DOT_MINT, text: "**stars.Add(...)** appends a string to the end of the list" },
      { dot: DOT_LAVENDER, text: "**stars.Count** returns the current number of elements" },
    ],
    tip: "The <T> syntax is a generic. You specify the type of elements inside the angle brackets, ensuring type safety.",
    starter: `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        List<int> heights = new List<int> { 2000, 5000 };
        heights.Add(8000);
        Console.WriteLine(heights.Count);
    }
}`,
    module: "C# Loops & Arrays",
    tier: "beginner",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What namespace is required to use List<T>?",
        options: ["System.Collections.Generic", "System.Collections", "System.IO", "System.Linq"],
        answer: 0,
        explain: "List<T> is located in System.Collections.Generic.",
      },
      {
        prompt: "Which property gets the number of elements in a List?",
        options: ["Count", "Length", "Size", "Capacity"],
        answer: 0,
        explain: "Lists use Count, while arrays use Length.",
      },
    ],
  },
  {
    slug: "cs-classes",
    order: 8,
    chapter: "C# OOP - Chapter 2",
    kicker: "C# OOP",
    title: "Objects and classes",
    catalogTitle: "Classes & objects",
    blurb: "Define blueprints for objects with attributes and constructors.",
    catalogCode: "class Star { }",
    intro:
      "C# is an object-oriented language. A **class** is a blueprint, and an **object** is an instance of that class. Use the **new** keyword to instantiate an object.",
    example: `class Cloud {
    public string Shape;
    public int Altitude;

    public Cloud(string shape, int altitude) {
        Shape = shape;
        Altitude = altitude;
    }
}

// In Main:
Cloud myCloud = new Cloud("cumulus", 3000);`,
    reads: [
      { dot: DOT_PINK, text: "**public string Shape** declares a public field" },
      { dot: DOT_MINT, text: "**public Cloud(...)** is a constructor used to initialize the object" },
      { dot: DOT_LAVENDER, text: "**new Cloud(...)** creates a new instance on the heap" },
    ],
    tip: "Fields are marked with access modifiers like public or private. private fields can only be accessed within the class itself.",
    starter: `using System;

class Program {
    static void Main() {
        Star s = new Star("Vega");
        Console.WriteLine(s.Name);
    }
}

class Star {
    public string Name;
    public Star(string name) {
        Name = name;
    }
}`,
    module: "C# Object Oriented Programming",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What keyword is used to instantiate a class in C#?",
        options: ["new", "create", "instantiate", "make"],
        answer: 0,
        explain: "The new keyword allocates memory and invokes the constructor to create a new object.",
      },
      {
        prompt: "What is the primary purpose of a constructor?",
        options: ["Initialize fields of an object", "Destroy an object", "Compile the class", "Format class code"],
        answer: 0,
        explain: "A constructor runs when the object is instantiated to initialize its state.",
      },
    ],
  },
  {
    slug: "cs-properties",
    order: 9,
    chapter: "C# OOP - Chapter 2",
    kicker: "C# OOP",
    title: "Encapsulating with properties",
    catalogTitle: "Properties",
    blurb: "Use properties to control access and validate fields safely.",
    catalogCode: "public string Name { get; set; }",
    intro:
      "**Properties** combine a private field with accessors called **get** and **set**. This protects class data by controlling how values are read or written.",
    example: `class SkyItem {
    private int _density;
    public int Density {
        get { return _density; }
        set {
            if (value >= 0) _density = value;
        }
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**private int _density** hides the internal value" },
      { dot: DOT_MINT, text: "**get { return _density; }** runs when reading the property" },
      { dot: DOT_LAVENDER, text: "**set { ... }** runs when writing, with value representing incoming data" },
    ],
    tip: "Use auto-implemented properties like public string Name { get; set; } when no validation logic is needed.",
    starter: `using System;

class Program {
    static void Main() {
        Cloud c = new Cloud();
        c.Shape = "wispy";
        Console.WriteLine(c.Shape);
    }
}

class Cloud {
    public string Shape { get; set; }
}`,
    module: "C# Object Oriented Programming",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What represents the incoming data in a property set accessor?",
        options: ["value", "input", "incoming", "data"],
        answer: 0,
        explain: "C# automatically assigns the assigned value to the implicit parameter named value.",
      },
      {
        prompt: "What is an auto-implemented property?",
        options: ["A property where the compiler manages the backing field", "A property that writes to the console", "A static property", "A read-only property"],
        answer: 0,
        explain: "An auto-implemented property get; set; tells the compiler to create a hidden backing field automatically.",
      },
    ],
  },
  {
    slug: "cs-inheritance",
    order: 10,
    chapter: "C# OOP - Chapter 2",
    kicker: "C# OOP",
    title: "Inheritance and polymorphism",
    catalogTitle: "Inheritance",
    blurb: "Reuse and extend blueprints using subclass inheritance.",
    catalogCode: "class SubClass : BaseClass",
    intro:
      "**Inheritance** allows a class to derive from a base class, inheriting fields, properties, and methods. Use **virtual** in the base class and **override** in the subclass to redefine behavior.",
    example: `class SkyObject {
    public virtual void Describe() {
        Console.WriteLine("Object in sky");
    }
}

class Star : SkyObject {
    public override void Describe() {
        Console.WriteLine("Bright star");
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**class Star : SkyObject** indicates that Star inherits from SkyObject" },
      { dot: DOT_MINT, text: "**virtual void Describe()** allows subclasses to redefine this method" },
      { dot: DOT_LAVENDER, text: "**override void Describe()** redefines the method in the subclass" },
    ],
    tip: "C# only supports single inheritance for classes. A subclass can only inherit from one direct base class.",
    starter: `using System;

class Program {
    static void Main() {
        SkyObject s = new Star();
        s.Describe();
    }
}

class SkyObject {
    public virtual void Describe() {
        Console.WriteLine("Sky item");
    }
}

class Star : SkyObject {
    public override void Describe() {
        Console.WriteLine("Star item");
    }
}`,
    module: "C# Object Oriented Programming",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which symbol denotes inheritance in C#?",
        options: ["Colon :", "Arrow ->", "Extends keyword", "Equals ="],
        answer: 0,
        explain: "In C#, a colon is used to specify the base class or interfaces.",
      },
      {
        prompt: "What keyword allows a base class method to be overridden in a subclass?",
        options: ["virtual", "override", "abstract", "new"],
        answer: 0,
        explain: "A base class method must be marked virtual (or abstract) to allow overriding.",
      },
    ],
  },
  {
    slug: "cs-exceptions",
    order: 11,
    chapter: "C# Intermediate - Chapter 3",
    kicker: "C# INTERMEDIATE",
    title: "Exception handling",
    catalogTitle: "Exception handling",
    blurb: "Handle C# exceptions safely using try, catch, and finally.",
    catalogCode: "try { } catch (Exception ex) { }",
    intro:
      "C# uses **try-catch-finally** blocks to handle exceptions. The **finally** block executes whether an exception occurs or not, which is ideal for cleaning up resources.",
    example: `try {
    int x = 0;
    int y = 10 / x;
} catch (DivideByZeroException ex) {
    Console.WriteLine("Math error: " + ex.Message);
} finally {
    Console.WriteLine("Execution complete.");
}`,
    reads: [
      { dot: DOT_PINK, text: "**try** blocks hold code that could throw an exception" },
      { dot: DOT_MINT, text: "**catch (DivideByZeroException)** handles specific division by zero arithmetic errors" },
      { dot: DOT_LAVENDER, text: "**finally** always runs at the end of the error handling sequence" },
    ],
    tip: "Always list more specific catch blocks (e.g. DivideByZeroException) before a general catch-all Exception block.",
    starter: `using System;

class Program {
    static void Main() {
        try {
            int[] arr = new int[2];
            Console.WriteLine(arr[5]);
        } catch (IndexOutOfRangeException) {
            Console.WriteLine("Index bounds error");
        }
    }
}`,
    module: "C# Intermediate",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which block in exception handling runs regardless of whether an error was thrown?",
        options: ["finally", "catch", "try", "default"],
        answer: 0,
        explain: "The finally block always runs, ensuring resource cleanup.",
      },
      {
        prompt: "What base class do all built-in C# exceptions derive from?",
        options: ["Exception", "Error", "Throwable", "Crash"],
        answer: 0,
        explain: "All exceptions in .NET derive from System.Exception.",
      },
    ],
  },
  {
    slug: "cs-generics",
    order: 12,
    chapter: "C# Intermediate - Chapter 3",
    kicker: "C# INTERMEDIATE",
    title: "Generics and type safety",
    catalogTitle: "Generics",
    blurb: "Write reusable, type-safe structures using generics.",
    catalogCode: "class Box<T> { }",
    intro:
      "**Generics** introduce the concept of type parameters. They let you design classes and methods that defer the specification of types until instantiated.",
    example: `class Box<T> {
    public T Content { get; set; }
}
// Usage:
Box<int> intBox = new Box<int> { Content = 123 };
Box<string> strBox = new Box<string> { Content = "Vega" };`,
    reads: [
      { dot: DOT_PINK, text: "**<T>** is the placeholder for the generic type parameter" },
      { dot: DOT_MINT, text: "**Box<int>** substitutes the integer type for T in that specific instance" },
    ],
    tip: "Generics maximize code reuse, type safety, and performance, avoiding boxing/unboxing overhead.",
    starter: `using System;

class Program {
    static void Main() {
        Pair<string, int> item = new Pair<string, int>("Nova", 100);
        Console.WriteLine(item.First);
    }
}

class Pair<T1, T2> {
    public T1 First { get; }
    public T2 Second { get; }
    public Pair(T1 first, T2 second) {
        First = first;
        Second = second;
    }
}`,
    module: "C# Intermediate",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What represents the type parameter placeholder in generics?",
        options: ["Angle brackets <T>", "Semicolon", "var keyword", "dynamic keyword"],
        answer: 0,
        explain: "Angle brackets containing a placeholder name like <T> define the type parameter.",
      },
      {
        prompt: "Why are generics preferred over using Object for collections?",
        options: ["They preserve compile-time type safety", "They are slower", "They bypass type checking", "They only hold strings"],
        answer: 0,
        explain: "Generics prevent runtime errors by enforcing type checks at compile time.",
      },
    ],
  },
  {
    slug: "cs-linq",
    order: 13,
    chapter: "C# Intermediate - Chapter 3",
    kicker: "C# INTERMEDIATE",
    title: "LINQ Query Expressions",
    catalogTitle: "LINQ queries",
    blurb: "Query collections cleanly using Language Integrated Query.",
    catalogCode: "from x in list where x > 5 select x",
    intro:
      "**LINQ (Language Integrated Query)** allows you to query collections of data directly in C# using syntax similar to SQL, or using method chains.",
    example: `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        int[] scores = { 45, 78, 92, 60 };
        var highScores = scores.Where(s => s > 70).OrderBy(s => s);
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**scores.Where(s => s > 70)** filters the array elements" },
      { dot: DOT_MINT, text: "**OrderBy(s => s)** sorts the elements in ascending order" },
    ],
    tip: "LINQ methods are extension methods on IEnumerable<T> and require the namespace System.Linq.",
    starter: `using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        List<string> clouds = new List<string> { "cirrus", "stratus", "cumulus" };
        var shortClouds = clouds.Where(c => c.Length < 7);
        Console.WriteLine(shortClouds.Count());
    }
}`,
    module: "C# Intermediate",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What namespace is required to use LINQ extension methods?",
        options: ["System.Linq", "System.Collections", "System.Data", "System.Text"],
        answer: 0,
        explain: "System.Linq contains the standard query operators.",
      },
      {
        prompt: "What is a lambda expression in LINQ, like `s => s > 70`?",
        options: ["An anonymous function", "A class definition", "A constructor", "A database connection string"],
        answer: 0,
        explain: "`s => s > 70` defines a quick inline function that takes s and returns whether s is > 70.",
      },
    ],
  },
  {
    slug: "cs-interfaces",
    order: 14,
    chapter: "C# Intermediate - Chapter 3",
    kicker: "C# INTERMEDIATE",
    title: "Interfaces",
    catalogTitle: "Interfaces",
    blurb: "Define code contracts that classes must implement.",
    catalogCode: "interface IGlowable { void Glow(); }",
    intro:
      "An **interface** is a contract. It declares properties and methods without implementations. Any class that implements the interface must provide the concrete logic.",
    example: `interface ISkyGlow {
    void Glow();
}

class Star : ISkyGlow {
    public void Glow() {
        Console.WriteLine("Star shines");
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**interface ISkyGlow** defines the contract name" },
      { dot: DOT_MINT, text: "**class Star : ISkyGlow** implements the interface contract" },
    ],
    tip: "Interface names in C# are traditionally prefixed with a capital 'I', such as IDisposable or IEnumerable.",
    starter: `using System;

class Program {
    static void Main() {
        IRunnable r = new Robot();
        r.Run();
    }
}

interface IRunnable {
    void Run();
}

class Robot : IRunnable {
    public void Run() {
        Console.WriteLine("Robot running");
    }
}`,
    module: "C# Intermediate",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Can an interface in C# contain implementation code for its methods by default (pre-C# 8)?",
        options: ["No, only declarations", "Yes, always", "Only private methods", "Only constructors"],
        answer: 0,
        explain: "Traditionally, interfaces only declare signatures, leaving the logic to classes.",
      },
      {
        prompt: "What prefix is conventionally used for interface names in C#?",
        options: ["I", "C", "A", "Interface"],
        answer: 0,
        explain: "C# developer standards prefix interface names with a capital letter I.",
      },
    ],
  },
  {
    slug: "cs-abstract-classes",
    order: 15,
    chapter: "C# Intermediate - Chapter 3",
    kicker: "C# INTERMEDIATE",
    title: "Abstract classes",
    catalogTitle: "Abstract classes",
    blurb: "Build base classes that cannot be instantiated directly.",
    catalogCode: "abstract class Shape { }",
    intro:
      "An **abstract class** is a base class that cannot be instantiated. It can contain both abstract methods (no logic, must override) and regular methods (with logic).",
    example: `abstract class SkyEntity {
    public abstract void Update();
    public void Describe() {
        Console.WriteLine("Sky Entity");
    }
}

class Cloud : SkyEntity {
    public override void Update() {
        // Concrete logic
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**abstract class** prevents direct instantiation of the base class" },
      { dot: DOT_MINT, text: "**public abstract void Update()** has no body and must be overridden" },
    ],
    tip: "Unlike interfaces, an abstract class can contain constructors, fields, and default method implementations.",
    starter: `using System;

class Program {
    static void Main() {
        SkyEntity e = new Moon();
        e.Glow();
    }
}

abstract class SkyEntity {
    public abstract void Glow();
}

class Moon : SkyEntity {
    public override void Glow() {
        Console.WriteLine("Moon glow");
    }
}`,
    module: "C# Intermediate",
    tier: "intermediate",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Can you instantiate an abstract class using the new keyword directly?",
        options: ["No", "Yes", "Only in the Main method", "Only if it has a constructor"],
        answer: 0,
        explain: "Abstract classes are incomplete and can only be instantiated through their concrete subclasses.",
      },
      {
        prompt: "What keyword must a subclass use to implement an abstract method?",
        options: ["override", "virtual", "new", "implement"],
        answer: 0,
        explain: "Subclasses use override to provide concrete implementation for abstract methods.",
      },
    ],
  },
  {
    slug: "cs-delegates-lambdas",
    order: 16,
    chapter: "C# Advanced - Chapter 4",
    kicker: "C# ADVANCED",
    title: "Delegates and Lambdas",
    catalogTitle: "Delegates & lambdas",
    blurb: "Pass methods as parameters using delegates and lambda expressions.",
    catalogCode: "Func<int, int> doubleNum = x => x * 2;",
    intro:
      "A **delegate** is a type that represents references to methods. Modern C# uses pre-defined delegates like Action (no return) and Func (returns a value) paired with lambdas.",
    example: `using System;

class Program {
    static void Main() {
        Func<int, int> square = x => x * x;
        Console.WriteLine(square(5));
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**Func<int, int>** is a delegate taking an int and returning an int" },
      { dot: DOT_MINT, text: "**x => x * x** is a lambda expression performing the math operation" },
    ],
    tip: "Use Action for methods that return void (no value), and Func for methods that return a value.",
    starter: `using System;

class Program {
    static void Main() {
        Action<string> log = msg => Console.WriteLine(msg);
        log("Glow");
    }
}`,
    module: "C# Advanced",
    tier: "advanced",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which delegate should you use for a method that does NOT return a value?",
        options: ["Action", "Func", "Predicate", "Task"],
        answer: 0,
        explain: "Action delegates represent void methods. Func delegates always return a value.",
      },
      {
        prompt: "What does the operator => represent in C#?",
        options: ["Lambda operator ('goes to')", "Greater than or equal to", "Pointer dereference", "Inequality"],
        answer: 0,
        explain: "=> is the lambda operator, separating arguments from the function body.",
      },
    ],
  },
  {
    slug: "cs-async-await",
    order: 17,
    chapter: "C# Advanced - Chapter 4",
    kicker: "C# ADVANCED",
    title: "Async and Await in C#",
    catalogTitle: "Async & await",
    blurb: "Write non-blocking code using Task and async/await.",
    catalogCode: "async Task<string> DownloadAsync() { }",
    intro:
      "Use **async** and **await** with **Task** to write asynchronous, non-blocking code. This keeps your apps responsive during heavy operations like network calls.",
    example: `using System;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        string data = await FetchDataAsync();
        Console.WriteLine(data);
    }

    static async Task<string> FetchDataAsync() {
        await Task.Delay(100);
        return "clouds loaded";
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**async Task** defines an asynchronous method returning a Task object" },
      { dot: DOT_MINT, text: "**await** pauses execution of the current method without blocking" },
    ],
    tip: "Asynchronous methods should always end with the suffix 'Async' by convention.",
    starter: `using System;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        await Task.Delay(10);
        Console.WriteLine("Done");
    }
}`,
    module: "C# Advanced",
    tier: "advanced",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What return type should a C# async method return if it does not return any data value?",
        options: ["Task", "void", "async", "Thread"],
        answer: 0,
        explain: "Async methods should return Task (or Task<T> if they return a value). Use of void is discouraged except for event handlers.",
      },
      {
        prompt: "What keyword is placed before a Task call to yield control back to the caller while it finishes?",
        options: ["await", "async", "yield", "defer"],
        answer: 0,
        explain: "await pauses execution of the current method without blocking the executing thread.",
      },
    ],
  },
  {
    slug: "cs-file-io",
    order: 18,
    chapter: "C# Advanced - Chapter 4",
    kicker: "C# ADVANCED",
    title: "File I/O operations",
    catalogTitle: "File I/O",
    blurb: "Read and write files on the disk using the System.IO namespace.",
    catalogCode: "File.WriteAllText('file.txt', text);",
    intro:
      "The **System.IO** namespace contains classes for handling file operations. Standard static methods on the File class allow reading and writing in single operations.",
    example: `using System;
using System.IO;

class Program {
    static void Main() {
        string path = "sky.txt";
        File.WriteAllText(path, "starry");
        string content = File.ReadAllText(path);
        Console.WriteLine(content);
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**File.WriteAllText(...)** writes a string to a file (creates or overwrites it)" },
      { dot: DOT_MINT, text: "**File.ReadAllText(...)** reads all text from a file into a single string" },
    ],
    tip: "Use static classes like File for quick, simple operations. For advanced streaming, use StreamReader or StreamWriter.",
    starter: `using System;
using System.IO;

class Program {
    static void Main() {
        string file = "test.txt";
        File.WriteAllText(file, "hello");
        Console.WriteLine(File.Exists(file));
    }
}`,
    module: "C# Advanced",
    tier: "advanced",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which namespace contains the File class?",
        options: ["System.IO", "System.Files", "System.Text", "System.Storage"],
        answer: 0,
        explain: "The File class is located in the System.IO namespace.",
      },
      {
        prompt: "Which method reads all contents of a file into a single string?",
        options: ["File.ReadAllText", "File.Read", "File.Load", "File.Open"],
        answer: 0,
        explain: "File.ReadAllText reads the entire text file and returns a string.",
      },
    ],
  },
  {
    slug: "py-metaprogramming",
    order: 32,
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
    practiceSlug: "py-metaprogramming",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-concurrency",
    order: 33,
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
    practiceSlug: "py-concurrency",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "py-internals",
    order: 34,
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
    practiceSlug: "py-internals",
    module: "Python Expert",
    tier: "expert",
    language: "python",
  },
  {
    slug: "js-metaprogramming",
    order: 23,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Object observation with Proxies",
    catalogTitle: "Metaprogramming",
    blurb: "Intercept and customize operations on JavaScript objects.",
    catalogCode: "new Proxy(target, handler)",
    intro:
      "A **Proxy** wraps an object to intercept core operations like reads, writes, and key lookups. Combined with **Reflect**, it powers modern reactive frameworks.",
    example: `const target = { sky: "clear" };
const proxy = new Proxy(target, {
  get(obj, prop) {
    return prop in obj ? obj[prop] : "unknown";
  }
});
console.log(proxy.sky);
console.log(proxy.clouds);`,
    reads: [
      { dot: DOT_PINK, text: "**new Proxy(target, handler)** creates an interceptor shell" },
      { dot: DOT_MINT, text: "**get(obj, prop)** intercepts property lookups on the target object" },
    ],
    tip: "Always return Reflect.get(...) inside proxies when forwarding original behavior to target objects.",
    starter: `// log property writes using handler traps
const stats = { stars: 10 };
const obs = new Proxy(stats, {
  set(obj, prop, val) {
    console.log("Setting " + prop + " to " + val);
    obj[prop] = val;
    return true;
  }
});
obs.stars = 20;`,
    practiceSlug: "js-metaprogramming",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
  {
    slug: "js-concurrency",
    order: 24,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Microtasks and the Event Loop",
    catalogTitle: "Concurrency",
    blurb: "Understand microtask execution and non-blocking loops.",
    catalogCode: "queueMicrotask(() => {})",
    intro:
      "JavaScript is single-threaded but runs concurrently via the **Event Loop**. Promises queue jobs in the **Microtask Queue**, executing before rendering or the callback macrotask queue.",
    example: `console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");`,
    reads: [
      { dot: DOT_PINK, text: "Microtasks (Promise then, queueMicrotask) run immediately after current script" },
      { dot: DOT_MINT, text: "Macrotasks (setTimeout, event callbacks) run in subsequent tick loops" },
    ],
    tip: "Never block the event loop with long CPU-bound synchronous loops, or UI rendering will freeze.",
    starter: `// trace asynchronous microtask queue order
console.log(1);
queueMicrotask(() => console.log(3));
setTimeout(() => console.log(4), 0);
console.log(2);`,
    practiceSlug: "js-concurrency",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
  {
    slug: "js-internals",
    order: 25,
    chapter: "JavaScript Expert - Chapter 1",
    kicker: "JS EXPERT",
    title: "Prototypes and V8 Engine optimization",
    catalogTitle: "JS Internals",
    blurb: "Deep dive prototype chains, closures, and memory.",
    catalogCode: "Object.getPrototypeOf(obj)",
    intro:
      "V8 compiles JS to machine code via JIT compilation. Objects inherit features through **prototypes**, and closures store references in heap-allocated scopes, risking leaks if not cleaned up.",
    example: `const proto = { sky: "night" };
const obj = Object.create(proto);
console.log(Object.getPrototypeOf(obj) === proto);
console.log(obj.sky);`,
    reads: [
      { dot: DOT_PINK, text: "**Object.create(proto)** links a new object directly to prototype object" },
      { dot: DOT_MINT, text: "Scope references are garbage collected only when closures are released" },
    ],
    tip: "Avoid changing prototypes at runtime since it destroys the engine's hidden class optimizations (inline caches).",
    starter: `const base = { active: true };
const item = Object.create(base);
console.log(item.hasOwnProperty("active"));
console.log(item.active);`,
    practiceSlug: "js-internals",
    module: "JS Expert",
    tier: "expert",
    language: "javascript",
  },
  {
    slug: "cs-metaprogramming",
    order: 19,
    chapter: "C# Expert - Chapter 1",
    kicker: "C# EXPERT",
    title: "Reflection and custom attributes",
    catalogTitle: "Reflection",
    blurb: "Scan metadata, types, and invoke methods dynamically.",
    catalogCode: "typeof(Program).GetMethods()",
    intro:
      "Use **Reflection** via `System.Reflection` to inspect metadata at runtime. Retrieve types, read custom attributes, and instantiate objects or call methods dynamically.",
    example: `using System;
using System.Reflection;

class Program {
    static void Main() {
        Type t = typeof(Program);
        foreach (var method in t.GetMethods()) {
            Console.WriteLine(method.Name);
        }
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**typeof(T)** retrieves the metadata definition for type T" },
      { dot: DOT_MINT, text: "Reflection enables dependency injection, serialization, and dynamic routing plugins" },
    ],
    tip: "Reflection is highly versatile but incurs a performance cost; cache type lookups where possible.",
    starter: `using System;
using System.Reflection;

class Program {
    static void Main() {
        Type t = typeof(string);
        Console.WriteLine(t.FullName);
    }
}`,
    module: "C# Expert",
    tier: "expert",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which namespace contains C# Reflection classes?",
        options: ["System.Reflection", "System.Metadata", "System.Types", "System.Runtime"],
        answer: 0,
        explain: "The System.Reflection namespace contains metadata inspection types like Type, MethodInfo, and Assembly.",
      },
      {
        prompt: "What is the performance implication of using Reflection extensively?",
        options: ["It incurs a CPU overhead cost compared to static typing", "It speeds up runtime code execution", "It bypasses RAM allocation", "None"],
        answer: 0,
        explain: "Reflection scans metadata dynamically at runtime, making it slower than direct compiled calls.",
      },
    ],
  },
  {
    slug: "cs-concurrency",
    order: 20,
    chapter: "C# Expert - Chapter 1",
    kicker: "C# EXPERT",
    title: "Thread safety and lock synchronization",
    catalogTitle: "Concurrency",
    blurb: "Manage shared resource access with lock blocks and TPL.",
    catalogCode: "lock (syncObj) { count++; }",
    intro:
      "The **Task Parallel Library (TPL)** executes tasks concurrently. When threads modify shared state, use the **lock** statement to restrict critical region access to one thread at a time.",
    example: `using System;
using System.Threading.Tasks;

class Program {
    static readonly object _lock = new object();
    static int _count = 0;

    static void Main() {
        Parallel.For(0, 100, i => {
            lock (_lock) {
                _count++;
            }
        });
        Console.WriteLine(_count);
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**lock (_lock)** ensures only one thread enters the body block at a time" },
      { dot: DOT_MINT, text: "**Parallel.For** executes actions in parallel using multiple threads" },
    ],
    tip: "Only lock reference types (usually a private dedicated object), never lock value types or strings.",
    starter: `using System;
using System.Threading.Tasks;

class Program {
    static object sync = new object();
    static void Main() {
        lock (sync) {
            Console.WriteLine("Locked");
        }
    }
}`,
    module: "C# Expert",
    tier: "expert",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "What can happen if two threads lock resources in a circular dependency order?",
        options: ["A deadlock occurs", "The program executes faster", "Variables are auto-merged", "Threads split automatically"],
        answer: 0,
        explain: "Circular lock dependencies prevent either thread from progressing, causing a deadlock.",
      },
      {
        prompt: "Which keyword guarantees mutual exclusion across C# threads?",
        options: ["lock", "async", "await", "unsafe"],
        answer: 0,
        explain: "The lock keyword synchronizes access by acquiring a mutual exclusion lock on a designated object.",
      },
    ],
  },
  {
    slug: "cs-internals",
    order: 21,
    chapter: "C# Expert - Chapter 1",
    kicker: "C# EXPERT",
    title: "Garbage collection generations and Span memory",
    catalogTitle: "C# Internals",
    blurb: "Deep dive CLR garbage collection, stack, heap, and Span.",
    catalogCode: "Span<int> slice = stackalloc int[10];",
    intro:
      "The Common Language Runtime (CLR) manages memory via a **Garbage Collector** with three generations (Gen 0, 1, 2) for short/long-lived objects. Modern C# uses **Span<T>** for zero-allocation stack slices.",
    example: `using System;

class Program {
    static void Main() {
        Span<int> numbers = stackalloc int[] { 1, 2, 3 };
        Span<int> slice = numbers.Slice(1, 2);
        Console.WriteLine(slice[0]);
    }
}`,
    reads: [
      { dot: DOT_PINK, text: "**Span<T>** provides type-safe, contiguous memory access (stack or heap)" },
      { dot: DOT_MINT, text: "**stackalloc** allocates memory on stack, skipping GC overhead entirely" },
    ],
    tip: "Garbage collection promotes surviving items from Generation 0 to Gen 1, and eventually to Gen 2.",
    starter: `using System;

class Program {
    static void Main() {
        ReadOnlySpan<char> text = "starlight".AsSpan();
        Console.WriteLine(text.Length);
    }
}`,
    module: "C# Expert",
    tier: "expert",
    language: "csharp",
    runnable: false,
    quiz: [
      {
        prompt: "Which GC generation contains short-lived temporary objects?",
        options: ["Generation 0", "Generation 1", "Generation 2", "Large Object Heap (LOH)"],
        answer: 0,
        explain: "New objects start in Generation 0. Survival promotes them to Gen 1 and then Gen 2.",
      },
      {
        prompt: "What is a primary benefit of using Span<T> in C#?",
        options: ["Zero-allocation, high performance memory slicing", "Automatic parallel compilation", "Converting heap objects to classes", "Eliminating syntax errors"],
        answer: 0,
        explain: "Span<T> provides direct, type-safe representation of contiguous memory segments without creating copies or allocating heap space.",
      },
    ],
  },
  // --- Python expert / applied tier (read + quiz; web frameworks and data-science
  // libraries cannot run in the browser sandbox).
  {
    slug: "py-web-backend-basics",
    order: 35,
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
    order: 36,
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
    order: 37,
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
    order: 38,
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
    order: 39,
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
    order: 40,
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
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "Why are NumPy arrays faster than Python lists for math operations?",
        options: ["They store data in contiguous memory and use vectorized C code", "They use GPU acceleration by default", "They skip type checking entirely", "They compress the data"],
        answer: 0,
        explain: "NumPy stores homogeneous data in contiguous memory blocks and delegates math to optimized C routines.",
      },
      {
        prompt: "What does np.array([1, 2, 3]) * 2 return?",
        options: ["array([2, 4, 6])", "[1, 2, 3, 1, 2, 3]", "6", "An error"],
        answer: 0,
        explain: "NumPy multiplies each element by 2 (element-wise). Python lists would repeat the list instead.",
      },
      {
        prompt: "Which method computes the average of all elements in a NumPy array?",
        options: [".mean()", ".avg()", ".average()", ".sum() / len()"],
        answer: 0,
        explain: "The .mean() method returns the arithmetic average of all values in the array.",
      },
    ],
  },
  {
    slug: "py-pandas-dataframes",
    order: 41,
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
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What Pandas function loads a CSV file into a DataFrame?",
        options: ["pd.read_csv()", "pd.load()", "pd.open()", "pd.import_csv()"],
        answer: 0,
        explain: "pd.read_csv() reads a comma-separated file and returns a DataFrame.",
      },
      {
        prompt: "How do you filter a DataFrame to rows where column 'x' is greater than 5?",
        options: ["df[df['x'] > 5]", "df.filter('x > 5')", "df.where(x > 5)", "df.select('x', gt=5)"],
        answer: 0,
        explain: "Boolean indexing with df[condition] is the standard way to filter rows in Pandas.",
      },
      {
        prompt: "What method provides a statistical summary of numeric columns?",
        options: [".describe()", ".summary()", ".stats()", ".info()"],
        answer: 0,
        explain: ".describe() returns count, mean, std, min, quartiles, and max for each numeric column.",
      },
    ],
  },
  {
    slug: "py-data-cleaning",
    order: 42,
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
    module: "Python for Data Science",
    tier: "expert",
    language: "python",
    runnable: false,
    quiz: [
      {
        prompt: "What does NaN represent in a Pandas DataFrame?",
        options: ["A missing or undefined value", "The number zero", "An empty string", "A boolean False"],
        answer: 0,
        explain: "NaN (Not a Number) is the standard marker for missing data in Pandas and NumPy.",
      },
      {
        prompt: "Which method removes rows that have missing values in specific columns?",
        options: [".dropna(subset=[...])", ".remove_null()", ".clean()", ".strip_na()"],
        answer: 0,
        explain: ".dropna(subset=['col']) drops rows where the specified columns contain NaN.",
      },
      {
        prompt: "What does pd.to_numeric(series, errors='coerce') do with non-numeric strings?",
        options: ["Converts them to NaN", "Raises an error", "Converts them to 0", "Removes the row"],
        answer: 0,
        explain: "errors='coerce' turns unparseable values into NaN instead of raising an exception.",
      },
    ],
  },
  {
    slug: "py-data-plotting",
    order: 43,
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
    order: 44,
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
  // ---- TypeScript track ----------------------------------------------------
  // Full beginner -> expert curriculum. TS lessons run via /api/transpile (type-strip) then the JS engine.
  {
    slug: "ts-types",
    order: 1,
    chapter: "TypeScript Basics - Chapter 1",
    kicker: "TYPESCRIPT",
    title: "Typing your variables",
    catalogTitle: "Types",
    blurb: "Add type annotations so the compiler catches mistakes early.",
    catalogCode: "let n: number = 5;",
    intro:
      "**TypeScript** is JavaScript with **types**. You annotate a variable with `: type` to specify the data it should hold. These annotations are checked during compilation and stripped in the running JavaScript.",
    example: `let mood: string = "dreamy";
let altitude: number = 5000;
const isNight: boolean = true;
console.log(mood, altitude, isNight);`,
    reads: [
      { dot: DOT_PINK, text: "**: string / : number / : boolean** specify variable types" },
      { dot: DOT_MINT, text: "Types are strictly checked by the compiler before running" },
    ],
    tip: "Let inference do the work: if you assign a value immediately, TypeScript can infer the type automatically.",
    starter: `// give each variable the right type annotation
let constellation: string = "Orion";
let starCount: number = 1200;
console.log(constellation, "has", starCount, "stars");`,
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-types",
  },
  {
    slug: "ts-functions",
    order: 2,
    chapter: "TypeScript Basics - Chapter 1",
    kicker: "TYPESCRIPT",
    title: "Function parameter and return types",
    catalogTitle: "Functions",
    blurb: "Declare parameter and return types to ensure clean interfaces.",
    catalogCode: "function fn(x: number): string",
    intro:
      "In TypeScript, you must annotate function **parameters** and their **return types**. This ensures callers pass the correct arguments and receive the expected outputs.",
    example: `function formatAltitude(meters: number): string {
  return meters + "m above the clouds";
}
const status = formatAltitude(8500);
console.log(status);`,
    reads: [
      { dot: DOT_PINK, text: "**(meters: number)** restricts parameter inputs to numbers only" },
      { dot: DOT_MINT, text: "**: string** asserts that the function must return a string" },
    ],
    tip: "Functions that do not return any value should be annotated with a return type of **void**.",
    starter: `function doubleCount(stars: number): number {
  return stars * 2;
}
console.log(doubleCount(150));`,
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-functions",
  },
  {
    slug: "ts-arrays-tuples",
    order: 3,
    chapter: "TypeScript Basics - Chapter 1",
    kicker: "TYPESCRIPT",
    title: "Typed Arrays and Tuples",
    catalogTitle: "Arrays",
    blurb: "Lock down array elements or define strict, fixed-length tuples.",
    catalogCode: "let arr: number[] = [1, 2];",
    intro:
      "Define arrays using `type[]`. For fixed-length arrays with specific types at exact index positions, use **Tuples** (e.g. `[string, number]`).",
    example: `let altitudes: number[] = [1000, 2000, 3000];
let coordinates: [number, number] = [45.1, -122.3];
console.log(altitudes.length, coordinates[0]);`,
    reads: [
      { dot: DOT_PINK, text: "**number[]** declares an array containing only numbers" },
      { dot: DOT_MINT, text: "**[number, number]** restricts coordinates to a fixed length of 2 numbers" },
    ],
    tip: "Tuples are highly useful for return values like coordinates or key-value pairs.",
    starter: `let starNames: string[] = ["Vega", "Sirius", "Altair"];
let location: [string, number] = ["Orion", 450];
console.log(starNames, location);`,
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-arrays-tuples",
  },
  {
    slug: "ts-interfaces",
    order: 4,
    chapter: "TypeScript Basics - Chapter 1",
    kicker: "TYPESCRIPT",
    title: "Describing objects with interfaces",
    catalogTitle: "Interfaces",
    blurb: "Define the shape of an object once and reuse it everywhere.",
    catalogCode: "interface Cloud { name: string }",
    intro:
      "An **interface** names the shape of an object: which properties it has and their types. Annotate a value with the interface and the compiler enforces the shape.",
    example: `interface Cloud {
  name: string;
  altitude: number;
  isFluffy?: boolean;
}
const c: Cloud = { name: "cirrus", altitude: 8000 };
console.log(c.name, "floats at", c.altitude);`,
    reads: [
      { dot: DOT_PINK, text: "**interface Cloud { ... }** names a reusable object shape" },
      { dot: DOT_MINT, text: "**isFluffy?** marks the altitude-related field as optional" },
    ],
    tip: "Use optional properties with a question mark to allow fields to be omitted safely.",
    starter: `interface Star {
  name: string;
  magnitude: number;
}
const vega: Star = { name: "Vega", magnitude: 0.03 };
console.log(vega.name, "magnitude", vega.magnitude);`,
    language: "typescript",
    module: "TS Basics",
    tier: "beginner",
    practiceSlug: "ts-interfaces",
  },
  {
    slug: "ts-unions-narrowing",
    order: 5,
    chapter: "TypeScript Basics - Chapter 2",
    kicker: "TYPESCRIPT",
    title: "Unions and Type Narrowing",
    catalogTitle: "Unions",
    blurb: "Allow multiple types and narrow them using typeof.",
    catalogCode: "let val: string | number;",
    intro:
      "A **Union Type** (`A | B`) allows a variable to hold values of multiple types. To safely interact with the value, you use **Type Narrowing** via conditionals to isolate the active type.",
    example: `function printId(id: string | number) {
  if (typeof id === "string") {
    console.log("String ID:", id.toUpperCase());
  } else {
    console.log("Numeric ID:", id * 10);
  }
}
printId("nebula");
printId(101);`,
    reads: [
      { dot: DOT_PINK, text: "**string | number** allows id to be either a string or a number" },
      { dot: DOT_MINT, text: "**typeof id === 'string'** acts as a type guard to narrow the type" },
    ],
    tip: "Type guards like typeof or instanceof allow safe, type-specific code execution.",
    starter: `function processSignal(sig: string | number) {
  if (typeof sig === "string") {
    console.log(sig.trim());
  } else {
    console.log(sig.toFixed(2));
  }
}
processSignal("  pulse  ");
processSignal(45.678);`,
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-unions-narrowing",
  },
  {
    slug: "ts-aliases-vs-interfaces",
    order: 6,
    chapter: "TypeScript Basics - Chapter 2",
    kicker: "TYPESCRIPT",
    title: "Type Aliases vs Interfaces",
    catalogTitle: "Aliases",
    blurb: "Choose when to use type aliases or object interfaces.",
    catalogCode: "type Signal = string | number;",
    intro:
      "**Type Aliases** (`type`) name any type, including primitives, unions, and tuples. **Interfaces** (`interface`) describe object structures and support declaration merging. Use interfaces for objects and type aliases for unions/primitives.",
    example: `type ID = string | number;
interface Coordinate {
  lat: number;
  lng: number;
}
const mainId: ID = "star-01";
const pos: Coordinate = { lat: 34, lng: -118 };
console.log(mainId, pos.lat);`,
    reads: [
      { dot: DOT_PINK, text: "**type ID** defines a name for a union or generic type" },
      { dot: DOT_MINT, text: "**interface Coordinate** is strictly for object shapes" },
    ],
    tip: "Interfaces can be extended using the extends keyword, making them great for class descriptions.",
    starter: `type Status = "active" | "dormant";
interface Starship {
  name: string;
  status: Status;
}
const voyager: Starship = { name: "Voyager", status: "active" };
console.log(voyager.name, voyager.status);`,
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-aliases-vs-interfaces",
  },
  {
    slug: "ts-literals-enums",
    order: 7,
    chapter: "TypeScript Basics - Chapter 2",
    kicker: "TYPESCRIPT",
    title: "Literal Types and Enums",
    catalogTitle: "Enums",
    blurb: "Restrict values to exact options or use numeric/string Enums.",
    catalogCode: "type Mode = 'dusk' | 'dawn';",
    intro:
      "**Literal Types** restrict values to specific strings or numbers. **Enums** group related constants, providing a named list of numeric or string options.",
    example: `type ColorTheme = "dusk" | "neon" | "cloud";
enum Direction {
  North = "NORTH",
  South = "SOUTH"
}
let currentTheme: ColorTheme = "dusk";
let heading: Direction = Direction.North;
console.log(currentTheme, heading);`,
    reads: [
      { dot: DOT_PINK, text: "**'dusk' | 'neon'** forces the theme to match only those literals" },
      { dot: DOT_MINT, text: "**enum Direction** creates lookup constants available at runtime" },
    ],
    tip: "Default to union literal types for simplicity unless you need lookup constants.",
    starter: `type CloudTier = "low" | "mid" | "high";
enum FlightState {
  Ground = 0,
  Flight = 1
}
let ct: CloudTier = "high";
let fs: FlightState = FlightState.Flight;
console.log(ct, fs);`,
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-literals-enums",
  },
  {
    slug: "ts-classes",
    order: 8,
    chapter: "TypeScript Basics - Chapter 2",
    kicker: "TYPESCRIPT",
    title: "Classes and visibility modifiers",
    catalogTitle: "Classes",
    blurb: "Use public, private, and protected to enforce access limits.",
    catalogCode: "class Star { private size: number }",
    intro:
      "TypeScript classes extend JavaScript classes by adding **types** and **visibility modifiers**: `public` (accessible anywhere), `private` (accessible only inside the class), and `protected` (accessible inside the class and its subclasses).",
    example: `class Cloud {
  public name: string;
  private altitude: number;
  constructor(name: string, altitude: number) {
    this.name = name;
    this.altitude = altitude;
  }
  public getAlt() { return this.altitude; }
}
const c = new Cloud("cumulus", 3000);
console.log(c.name, c.getAlt());`,
    reads: [
      { dot: DOT_PINK, text: "**private altitude** prevents external access to this property" },
      { dot: DOT_MINT, text: "**public name** allows normal reading and writing from outside" },
    ],
    tip: "You can declare class properties directly in the constructor parameters as public/private as a shorthand.",
    starter: `class Spaceship {
  private crew: number;
  constructor(public name: string, crew: number) {
    this.crew = crew;
  }
  public getCrew() { return this.crew; }
}
const ship = new Spaceship("Apollo", 3);
console.log(ship.name, ship.getCrew());`,
    language: "typescript",
    module: "TS Unions & Enums",
    tier: "intermediate",
    practiceSlug: "ts-classes",
  },
  {
    slug: "ts-generics",
    order: 9,
    chapter: "TypeScript Basics - Chapter 3",
    kicker: "TYPESCRIPT",
    title: "Reusable code with generics",
    catalogTitle: "Generics",
    blurb: "Write one function that keeps its types for any input.",
    catalogCode: "function first<T>(a: T[]): T",
    intro:
      "**Generics** let a function work over many types while keeping the link between input and output. `<T>` is a type variable filled in when the function is called.",
    example: `function first<T>(items: T[]): T {
  return items[0];
}
console.log(first<string>(["pink", "blue"]));
console.log(first<number>([10, 20]));`,
    reads: [
      { dot: DOT_PINK, text: "**<T>** is a type placeholder bound when the function is called" },
      { dot: DOT_MINT, text: "first(items: T[]): T returns the same type the array holds" },
    ],
    tip: "You rarely need to pass <string> explicitly; TypeScript infers T from the argument you give.",
    starter: `function last<T>(items: T[]): T {
  return items[items.length - 1];
}
console.log(last(["dawn", "dusk", "night"]));`,
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-generics",
  },
  {
    slug: "ts-intersections-assertions",
    order: 10,
    chapter: "TypeScript Basics - Chapter 3",
    kicker: "TYPESCRIPT",
    title: "Intersections and Assertions",
    catalogTitle: "Assertions",
    blurb: "Combine shapes with intersections and override types with assertions.",
    catalogCode: "const val = data as string;",
    intro:
      "**Intersection Types** (`A & B`) combine multiple types into one. **Type Assertions** (`as Type`) tell the compiler that a value has a specific type, bypassing regular type inference.",
    example: `interface Named { name: string; }
interface Aged { age: number; }
type Person = Named & Aged;
const p: Person = { name: "Alice", age: 30 };

let rawData: unknown = "hello cloud";
let len = (rawData as string).length;
console.log(p.name, len);`,
    reads: [
      { dot: DOT_PINK, text: "**Named & Aged** combines properties of both interfaces" },
      { dot: DOT_MINT, text: "**as string** forces the compiler to treat rawData as a string" },
    ],
    tip: "Use assertions sparingly: they tell the compiler 'trust me, I know what I am doing' and can hide real runtime errors if you are wrong.",
    starter: `interface Logged { timestamp: number; }
interface ErrorMsg { error: string; }
type CrashLog = Logged & ErrorMsg;
const crash: CrashLog = { timestamp: Date.now(), error: "Engine Failure" };

let response: unknown = "Success status code";
let msg = response as string;
console.log(crash.error, msg.length);`,
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-intersections-assertions",
  },
  {
    slug: "ts-utility-types",
    order: 11,
    chapter: "TypeScript Basics - Chapter 3",
    kicker: "TYPESCRIPT",
    title: "Readonly and Utility Types",
    catalogTitle: "Utilities",
    blurb: "Quickly transform shapes using Partial, Pick, Omit, and Readonly.",
    catalogCode: "type Info = Pick<User, 'id'>;",
    intro:
      "TypeScript provides built-in **Utility Types** to transform shapes: `Partial<T>` makes all fields optional, `Readonly<T>` makes all fields immutable, `Pick<T, Keys>` selects specific fields, and `Omit<T, Keys>` removes specific fields.",
    example: `interface Flight {
  id: string;
  altitude: number;
  pilot: string;
}
const f: Readonly<Flight> = { id: "FL-12", altitude: 8000, pilot: "Leo" };
type Summary = Pick<Flight, "id" | "pilot">;
const s: Summary = { id: "FL-12", pilot: "Leo" };
console.log(f.id, s.pilot);`,
    reads: [
      { dot: DOT_PINK, text: "**Readonly<Flight>** prevents writing to any property after creation" },
      { dot: DOT_MINT, text: "**Pick<Flight, 'id' | 'pilot'>** creates a type containing only those fields" },
    ],
    tip: "Utility types save you from duplicating similar object shapes across your code.",
    starter: `interface Star {
  name: string;
  constellation: string;
  brightness: number;
}
type PartialStar = Partial<Star>;
type DimStar = Omit<Star, "brightness">;
const p: PartialStar = { name: "Vega" };
const d: DimStar = { name: "Altair", constellation: "Aquila" };
console.log(p.name, d.constellation);`,
    language: "typescript",
    module: "TS Advanced",
    tier: "advanced",
    practiceSlug: "ts-utility-types",
  },
  {
    slug: "ts-conditional-types",
    order: 12,
    chapter: "TypeScript Basics - Chapter 4",
    kicker: "TYPESCRIPT",
    title: "Conditional Types",
    catalogTitle: "Conditional",
    blurb: "Select types dynamically based on generic checks.",
    catalogCode: "type IsString<T> = T extends string ? true : false;",
    intro:
      "**Conditional Types** let you select types dynamically by checking if type `T` extends type `U`. They work like ternary conditional operators (`T extends U ? X : Y`).",
    example: `type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
const answerA: A = "yes";
const answerB: B = "no";
console.log(answerA, answerB);`,
    reads: [
      { dot: DOT_PINK, text: "**T extends string** tests if the generic type extends a string" },
      { dot: DOT_MINT, text: "**? 'yes' : 'no'** resolves to different types depending on the check" },
    ],
    tip: "Conditional types are the core of advanced type manipulation and libraries.",
    starter: `type NonNull<T> = T extends null | undefined ? never : T;
type Cleaned = NonNull<string | null>; // resolves to string
const val: Cleaned = "clean signal";
console.log(val);`,
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-conditional-types",
  },
  {
    slug: "ts-mapped-types",
    order: 13,
    chapter: "TypeScript Basics - Chapter 4",
    kicker: "TYPESCRIPT",
    title: "Mapped Types",
    catalogTitle: "Mapped",
    blurb: "Iterate over object property keys to transform entire types.",
    catalogCode: "type ReadOnly<T> = { readonly [P in keyof T]: T[P] };",
    intro:
      "**Mapped Types** build new types by iterating over the keys of an existing type. They map every property of a type to a new type structure, similar to `Array.prototype.map()` but for type properties.",
    example: `interface Config {
  port: number;
  host: string;
}
type Stringify<T> = {
  [K in keyof T]: string;
};
const strConf: Stringify<Config> = { port: "8080", host: "localhost" };
console.log(strConf.port, strConf.host);`,
    reads: [
      { dot: DOT_PINK, text: "**[K in keyof T]** iterates over all keys K inside type T" },
      { dot: DOT_MINT, text: "**T[K]** accesses the type of property K in type T" },
    ],
    tip: "Mapped types are useful for converting API responses or validation payloads dynamically.",
    starter: `interface Pilot {
  name: string;
  xp: number;
}
type Optional<T> = {
  [K in keyof T]?: T[K];
};
const copilot: Optional<Pilot> = { name: "Ava" };
console.log(copilot.name);`,
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-mapped-types",
  },
  {
    slug: "ts-template-literals",
    order: 14,
    chapter: "TypeScript Basics - Chapter 4",
    kicker: "TYPESCRIPT",
    title: "Template Literal Types",
    catalogTitle: "Template",
    blurb: "Construct type combinations using string template literals.",
    catalogCode: "type Event = `on${Action}`;",
    intro:
      "**Template Literal Types** construct types by manipulating strings inside template literal types. They build unions of string literals by combining strings dynamically.",
    example: `type Status = "success" | "error";
type ResponseEvent = \`on_\${Status}\`;
const successEvent: ResponseEvent = "on_success";
const errorEvent: ResponseEvent = "on_error";
console.log(successEvent, errorEvent);`,
    reads: [
      { dot: DOT_PINK, text: "**\`on_\${Status}\`** generates on_success | on_error dynamically" },
      { dot: DOT_MINT, text: "They combine literal strings into type definitions directly" },
    ],
    tip: "Template literal types make it easy to type CSS class names, event names, or database queries.",
    starter: `type Direction = "Left" | "Right" | "Up";
type MoveCommand = \`move\${Direction}\`;
const action: MoveCommand = "moveRight";
console.log(action);`,
    language: "typescript",
    module: "TS Expert",
    tier: "expert",
    practiceSlug: "ts-template-literals",
  },
];

export const lessonCount = lessons.length;

export function getLesson(slug: string): Lesson | null {
  return lessons.find((l) => l.slug === slug) ?? null;
}

export function getAllLessonSlugs(): string[] {
  return lessons.map((l) => l.slug);
}

type TrackName = "python" | "javascript" | "csharp" | "typescript";

/** The first lesson of a track, by order (the true "lesson 1" / start here). */
export function getFirstLesson(track: TrackName): Lesson | null {
  const ls = lessons
    .filter((l) => (l.language || "python") === track)
    .sort((a, b) => a.order - b.order);
  return ls[0] ?? null;
}

/**
 * The learner's next lesson in a track: the first not-yet-completed one by order,
 * or the last lesson once every one is done. Drives the guided "continue" CTAs so a
 * brand-new learner always begins at lesson 1, never mid-curriculum.
 */
export function getNextLesson(track: TrackName, completedStops: string[]): Lesson | null {
  const ls = lessons
    .filter((l) => (l.language || "python") === track)
    .sort((a, b) => a.order - b.order);
  if (ls.length === 0) return null;
  return ls.find((l) => !completedStops.includes(l.slug)) ?? ls[ls.length - 1];
}

export interface LessonLink {
  slug: string;
  title: string;
}

export function getAdjacent(slug: string): { prev: LessonLink | null; next: LessonLink | null } {
  const currentLesson = getLesson(slug);
  if (!currentLesson) return { prev: null, next: null };

  const lang = currentLesson.language || "python";
  const filtered = lessons.filter((l) => (l.language || "python") === lang);

  const i = filtered.findIndex((l) => l.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const toLink = (l: Lesson): LessonLink => ({ slug: l.slug, title: l.catalogTitle });
  return {
    prev: i > 0 ? toLink(filtered[i - 1]) : null,
    next: i < filtered.length - 1 ? toLink(filtered[i + 1]) : null,
  };
}

export interface Module {
  name: string;
  tier: "beginner" | "intermediate" | "advanced" | "expert";
  lessons: Lesson[];
}

export function getModules(track: "python" | "javascript" | "csharp" | "typescript"): Module[] {
  const trackLessons = lessons
    .filter((l) => (l.language || "python") === track)
    .sort((a, b) => a.order - b.order);

  const modules: Module[] = [];
  const moduleMap = new Map<string, Module>();

  for (const lesson of trackLessons) {
    const moduleName = lesson.module || lesson.chapter || "Basics";
    const moduleTier = lesson.tier || "beginner";

    let mod = moduleMap.get(moduleName);
    if (!mod) {
      mod = {
        name: moduleName,
        tier: moduleTier,
        lessons: [],
      };
      moduleMap.set(moduleName, mod);
      modules.push(mod);
    }
    mod.lessons.push(lesson);
  }

  return modules;
}
