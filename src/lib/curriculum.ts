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
  language?: "python" | "javascript";
  module?: string;
  tier?: "beginner" | "intermediate" | "advanced" | "expert";
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
];

export const lessonCount = lessons.length;

export function getLesson(slug: string): Lesson | null {
  return lessons.find((l) => l.slug === slug) ?? null;
}

export function getAllLessonSlugs(): string[] {
  return lessons.map((l) => l.slug);
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

export function getModules(track: "python" | "javascript"): Module[] {
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
