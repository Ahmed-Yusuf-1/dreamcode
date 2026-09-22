import type { Challenge } from "@/content/types";

export const challenges: Record<string, Challenge> = {
  "cloud-hopper": {
    slug: "cloud-hopper",
    requires: "js-loops",
    name: "Cloud Hopper",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    badge: "cloud-hopper",
    blurb: "Count the clouds tall enough to land on.",
    instructions: "You're hopping across the sky, but you can only land on clouds that rise above height k. Given a list of cloud heights, return how many clouds you can land on.",
    starter: `function countTallClouds(heights, k) {
  let count = 0;
  // Loop over the heights and count the ones taller than k
  return count;
}`,
    functionName: "countTallClouds",
    testCases: [
      { label: "[3,7,2,9], k=5 → 2", args: [[3, 7, 2, 9], 5], expected: 2 },
      { label: "[], k=4 → 0", args: [[], 4], expected: 0 },
      { label: "[5,5,5], k=5 → 0", args: [[5, 5, 5], 5], expected: 0 },
    ]
  },
  "rain-counter": {
    slug: "rain-counter",
    requires: "lists",
    name: "Rain Counter",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Total the raindrops in a nested list.",
    instructions: "Given a list of lists of numbers representing raindrops in different sectors of the sky, calculate the total number of raindrops. Return 0 if there are no raindrops.",
    starter: `def total_raindrops(sectors):
    total = 0
    # Write your code here
    return total`,
    functionName: "total_raindrops",
    testCases: [
      { label: "[[1, 2], [3, 4]] → 10", args: [[[1, 2], [3, 4]]], expected: 10 },
      { label: "[[], [5]] → 5", args: [[[], [5]]], expected: 5 },
      { label: "[] → 0", args: [[]], expected: 0 },
    ]
  },
  "star-sorter": {
    slug: "star-sorter",
    requires: "dictionaries",
    name: "Star Sorter",
    level: "Beginner",
    language: "Python",
    xp: 50,
    blurb: "Sort the night sky by brightness.",
    instructions: "Given a list of stars (represented as names and magnitudes), sort them by magnitude in ascending order. Lower magnitude values mean brighter stars.",
    starter: `def sort_stars(stars):
    # stars is a list of dicts, e.g. [{"name": "Sirius", "mag": -1.46}]
    # Return a new list sorted by "mag", smallest first
    return stars`,
    functionName: "sort_stars",
    testCases: [
      {
        label: "Sirius & Vega → Sirius first",
        args: [[{ name: "Vega", mag: 0.03 }, { name: "Sirius", mag: -1.46 }]],
        expected: [{ name: "Sirius", mag: -1.46 }, { name: "Vega", mag: 0.03 }]
      },
      {
        label: "No stars → []",
        args: [[]],
        expected: []
      },
      { label: "three stars", args: [[{ name: "Rigel", mag: 0.13 }, { name: "Deneb", mag: 1.25 }, { name: "Arcturus", mag: -0.05 }]], expected: [{ name: "Arcturus", mag: -0.05 }, { name: "Rigel", mag: 0.13 }, { name: "Deneb", mag: 1.25 }] },
    ]
  },
  "list-wrangler": {
    slug: "list-wrangler",
    requires: "lists",
    name: "List Wrangler",
    level: "Beginner",
    language: "Python",
    xp: 40,
    badge: "list-wrangler",
    blurb: "Filter a list of numbers by a threshold.",
    instructions: "Given a list of numbers representing daily temperatures, write a function `find_cold_days(temps, threshold)` that filters and returns a list of all temperatures that are strictly below the threshold.",
    starter: `def find_cold_days(temps, threshold):
    cold = []
    # Write your code here
    return cold`,
    functionName: "find_cold_days",
    testCases: [
      { label: "temps=[15, 22, 12], threshold=15 → [12]", args: [[15, 22, 12, 25, 9], 15], expected: [12, 9] },
      { label: "empty list → []", args: [[], 0], expected: [] },
      { label: "no cold days → []", args: [[18, 20], 15], expected: [] }
    ]
  },
  "dict-diver": {
    slug: "dict-diver",
    name: "Dict Diver",
    level: "Beginner",
    language: "Python",
    xp: 40,
    badge: "dict-diver",
    blurb: "Find the brightest star in a dictionary.",
    instructions: "Given a dictionary mapping star names to their magnitude values, write a function `find_brightest(stars)` that returns the name of the brightest star (the one with the lowest magnitude). If the dictionary is empty, return None.",
    starter: `def find_brightest(stars):
    # Write your code here
    return None`,
    functionName: "find_brightest",
    testCases: [
      { label: "multiple stars → Sirius", args: [{ "Vega": 0.03, "Sirius": -1.46, "Betelgeuse": 0.50 }], expected: "Sirius" },
      { label: "empty dict → None", args: [{}], expected: null },
      { label: "single star → Polaris", args: [{ "Polaris": 1.97 }], expected: "Polaris" }
    ]
  },
  "js-loops-challenge": {
    slug: "js-loops-challenge",
    name: "Sum Up To",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Repeat arithmetic updates in a loop.",
    instructions: "Write a function `sumUpTo(n)` that takes an integer n and returns the sum of all numbers from 1 to n (inclusive). If n is less than 1, return 0.",
    starter: `function sumUpTo(n) {
  let sum = 0;
  // Write your code here
  return sum;
}`,
    functionName: "sumUpTo",
    testCases: [
      { label: "n=5 → 15", args: [5], expected: 15 },
      { label: "n=0 → 0", args: [0], expected: 0 },
      { label: "n=10 → 55", args: [10], expected: 55 }
    ]
  },
  "js-arrays-challenge": {
    slug: "js-arrays-challenge",
    requires: "js-arrays",
    name: "Double Evens",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Filter and map elements in an array.",
    instructions: "Write a function `doubleEvens(arr)` that takes an array of numbers, filters out the odd numbers, doubles the even numbers, and returns the new array.",
    starter: `function doubleEvens(arr) {
  // Write your code here
  return [];
}`,
    functionName: "doubleEvens",
    testCases: [
      { label: "mix of numbers → evens doubled", args: [[1, 2, 3, 4]], expected: [4, 8] },
      { label: "all odds → []", args: [[5, 7, 9]], expected: [] },
      { label: "empty array → []", args: [[]], expected: [] }
    ]
  },
  "js-objects-challenge": {
    slug: "js-objects-challenge",
    requires: "js-objects",
    name: "Property Lookup",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Validate and lookup properties in objects.",
    instructions: "Write a function `lookupProperty(obj, key)` that takes an object and a key string. If the object has that property (not undefined), return its value. Otherwise, return 'Property not found'.",
    starter: `function lookupProperty(obj, key) {
  // Write your code here
  return "";
}`,
    functionName: "lookupProperty",
    testCases: [
      { label: "key exists → value", args: [{ name: "Nova", level: 4 }, "name"], expected: "Nova" },
      { label: "key missing → not found", args: [{ name: "Nova" }, "xp"], expected: "Property not found" },
      { label: "empty obj → not found", args: [{}], expected: "Property not found" }
    ]
  },
  "js-sky-classifier": {
    slug: "js-sky-classifier",
    name: "JS Sky Classifier",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Classify sky safety based on visibility and weather.",
    instructions: "Write a function `classifySky(visibility, isStormy, isNight)` that takes visibility (number in miles), isStormy (boolean), and isNight (boolean). It should return the sky status as a string:\n- If it is stormy, return 'unsafe'.\n- Otherwise, if visibility is strictly less than 3 miles, or if it is night and visibility is strictly less than 5 miles, return 'restricted'.\n- In all other cases, return 'clear'.",
    starter: `function classifySky(visibility, isStormy, isNight) {
  // Write your code here
  return "";
}`,
    functionName: "classifySky",
    testCases: [
      { label: "stormy check: (10, true, false) → unsafe", args: [10, true, false], expected: "unsafe" },
      { label: "low visibility: (2, false, false) → restricted", args: [2, false, false], expected: "restricted" },
      { label: "night visibility check: (4, false, true) → restricted", args: [4, false, true], expected: "restricted" },
      { label: "night visibility ok: (6, false, true) → clear", args: [6, false, true], expected: "clear" },
      { label: "day visibility ok: (4, false, false) → clear", args: [4, false, false], expected: "clear" },
    ]
  },
  "js-array-transformer": {
    slug: "js-array-transformer",
    name: "JS Array Transformer",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Transform and filter an array of cloud objects.",
    instructions: "Write a function `transformClouds(clouds, minHeight)` that takes an array of cloud objects `{ name: string, height: number }` and a number `minHeight`. It should:\n1. Filter out clouds with heights strictly less than `minHeight`.\n2. Map the remaining clouds to return an array of their name strings in uppercase.\n3. Return this array.\nIf no clouds match, return an empty array.",
    starter: `function transformClouds(clouds, minHeight) {
  // Write your code here
  return [];
}`,
    functionName: "transformClouds",
    testCases: [
      {
        label: "filter and uppercase",
        args: [
          [
            { name: "cumulus", height: 3000 },
            { name: "cirrus", height: 6000 },
            { name: "stratus", height: 1500 }
          ],
          3000
        ],
        expected: ["CUMULUS", "CIRRUS"]
      },
      {
        label: "all filtered out",
        args: [[{ name: "fog", height: 200 }], 1000],
        expected: []
      },
      {
        label: "empty array input",
        args: [[], 500],
        expected: []
      }
    ]
  },
  "py-comprehension-sorter": {
    slug: "py-comprehension-sorter",
    name: "Comprehension Sorter",
    level: "Intermediate",
    language: "Python",
    xp: 50,
    blurb: "Filter and format star entries using dictionary comprehensions.",
    instructions: "Write a function `filter_stars(stars, min_mag)` that takes a list of dictionaries representing stars, e.g. `[{\"name\": \"Sirius\", \"mag\": -1.46}]`, and a float `min_mag`. It should return a dictionary mapping star names to their magnitudes, but only for stars with a magnitude strictly greater than `min_mag` (lower brightness). Use a dictionary comprehension.",
    starter: `def filter_stars(stars, min_mag):
    # Write your code here
    return {}`,
    functionName: "filter_stars",
    testCases: [
      {
        label: "filter brightness",
        args: [[{ "name": "Sirius", "mag": -1.46 }, { "name": "Vega", "mag": 0.03 }], -1.0],
        expected: { "Vega": 0.03 }
      },
      {
        label: "filter all",
        args: [[{ "name": "Sirius", "mag": -1.46 }], 0.0],
        expected: {}
      },
      { label: "empty list", args: [[], 0], expected: {} },
      { label: "all dimmer", args: [[{ name: "Deneb", mag: 1.25 }, { name: "Polaris", mag: 1.97 }], 1], expected: { Deneb: 1.25, Polaris: 1.97 } },
    ]
  },
  "js-reducer": {
    slug: "js-reducer",
    name: "Reducer Sum",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Reduce an array of objects to accumulate a single value.",
    instructions: "Write a function `sumCloudAltitudes(clouds)` that takes an array of cloud objects `{ name: string, altitude: number }` and returns the sum of all their altitudes using the `.reduce()` method. If the array is empty, return 0.",
    starter: `function sumCloudAltitudes(clouds) {
  // Write your code here
  return 0;
}`,
    functionName: "sumCloudAltitudes",
    testCases: [
      {
        label: "sum multiple heights",
        args: [[{ name: "cumulus", altitude: 3000 }, { name: "cirrus", altitude: 6000 }]],
        expected: 9000
      },
      {
        label: "empty array → 0",
        args: [[]],
        expected: 0
      },
      { label: "one cloud", args: [[{ name: "fog", altitude: 150 }]], expected: 150 },
    ]
  },
  "py-basics-density": {
    slug: "py-basics-density",
    requires: "return-values",
    name: "Sky Density Calculator",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Calculate the density of a cloud sector.",
    instructions: "Write a function `calculate_density(mass, volume)` that takes a float `mass` (in kg) and float `volume` (in cubic meters) and returns the density of the cloud sector (mass divided by volume). If the volume is 0 or negative, return 0.0.",
    starter: `def calculate_density(mass, volume):
    # Write your code here
    return 0.0`,
    functionName: "calculate_density",
    testCases: [
      { label: "normal case: 100kg, 50m³ → 2.0", args: [100.0, 50.0], expected: 2.0 },
      { label: "zero mass → 0.0", args: [0.0, 10.0], expected: 0.0 },
      { label: "zero volume → 0.0", args: [50.0, 0.0], expected: 0.0 },
      { label: "negative volume → 0.0", args: [50.0, -5.0], expected: 0.0 }
    ]
  },
  "py-conditionals-altitude": {
    slug: "py-conditionals-altitude",
    requires: "return-values",
    name: "Altitude Classifier",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Classify cloud layer based on altitude.",
    instructions: "Write a function `classify_altitude(altitude)` that takes an integer `altitude` (in meters) and returns: 'low' if altitude is strictly less than 2000; 'mid' if altitude is between 2000 and 6000 (inclusive); and 'high' if altitude is strictly greater than 6000.",
    starter: `def classify_altitude(altitude):
    # Write your code here
    return ""`,
    functionName: "classify_altitude",
    testCases: [
      { label: "altitude 1500 → low", args: [1500], expected: "low" },
      { label: "altitude 2000 → mid", args: [2000], expected: "mid" },
      { label: "altitude 5000 → mid", args: [5000], expected: "mid" },
      { label: "altitude 6000 → mid", args: [6000], expected: "mid" },
      { label: "altitude 7000 → high", args: [7000], expected: "high" }
    ]
  },
  "py-functions-average": {
    slug: "py-functions-average",
    name: "Average Magnitude",
    level: "Beginner",
    language: "Python",
    xp: 40,
    blurb: "Calculate average star magnitude.",
    instructions: "Write a function `average_magnitude(magnitudes)` that takes a list of float `magnitudes` and returns their average, rounded to 2 decimal places using `round(value, 2)`. If the list is empty, return 0.0.",
    starter: `def average_magnitude(magnitudes):
    # Write your code here
    return 0.0`,
    functionName: "average_magnitude",
    testCases: [
      { label: "average check: [1.2, 2.4, 0.6] → 1.4", args: [[1.2, 2.4, 0.6]], expected: 1.4 },
      { label: "rounding check: [0.03, 1.97, 0.5] → 0.83", args: [[0.03, 1.97, 0.5]], expected: 0.83 },
      { label: "empty list → 0.0", args: [[]], expected: 0.0 }
    ]
  },
  "py-intermediate-oop": {
    slug: "py-intermediate-oop",
    name: "Cloud Tracker Class",
    level: "Intermediate",
    language: "Python",
    xp: 50,
    blurb: "Define a class to track cloud height and growth.",
    instructions: "Write a class `CloudTracker` with an initializer `__init__(self, name, height)` (height in meters). Implement a method `grow(self, amount)` that adds `amount` to the height. If `amount` is less than or equal to 0, raise a `ValueError`. Implement a method `get_status(self)` that returns `'{name} is at {height}m'`.\n\nAlso write a helper function `test_tracker(name, height, grow_amount)` that instantiates the class, calls `grow(grow_amount)`, and returns `get_status()`. If a `ValueError` is raised, it should catch it and return `'invalid growth'`.",
    starter: `class CloudTracker:
    # Write your class here
    pass

def test_tracker(name, height, grow_amount):
    # Write your helper function here
    return ""`,
    functionName: "test_tracker",
    testCases: [
      { label: "normal growth: Cumulus 1000m + 500m → 1500m", args: ["Cumulus", 1000, 500], expected: "Cumulus is at 1500m" },
      { label: "negative growth → error", args: ["Nimbus", 2000, -100], expected: "invalid growth" },
      { label: "zero growth → error", args: ["Stratus", 500, 0], expected: "invalid growth" }
    ]
  },
  "py-advanced-decorator": {
    slug: "py-advanced-decorator",
    name: "Observation Logger",
    level: "Advanced",
    language: "Python",
    xp: 60,
    blurb: "Write a decorator that formats string return values.",
    instructions: "Write a decorator `add_telemetry` that wraps a function returning a string. The decorator should prepend `'[Telemetry] '` to the returned string.\n\nAlso write a function `test_decorator(val)` that defines a local function decorated with `@add_telemetry` and returns the result of calling it with `val`.",
    starter: `def add_telemetry(func):
    # Write your decorator here
    pass

def test_decorator(val):
    # Call a function decorated with @add_telemetry
    return ""`,
    functionName: "test_decorator",
    testCases: [
      { label: "clear sky → telemetry prepended", args: ["sky is clear"], expected: "[Telemetry] sky is clear" },
      { label: "storm alert → telemetry prepended", args: ["storm incoming"], expected: "[Telemetry] storm incoming" },
      { label: "empty string → just the tag", args: [""], expected: "[Telemetry] " }
    ]
  },
  "py-expert-descriptor": {
    slug: "py-expert-descriptor",
    name: "Validation Descriptor",
    level: "Advanced",
    language: "Python",
    xp: 70,
    blurb: "Write a Python descriptor that enforces integer constraints.",
    instructions: "Write a descriptor class `IntegerRange` that restricts a class attribute to integers between a minimum and maximum value (inclusive). The `__init__(self, min_val, max_val)` constructor should accept `min_val` and `max_val`. If `__set__(self, instance, value)` is called with a value that is not an integer, or is outside the specified range, raise a `ValueError`.\n\nAlso write a class `Planet` that uses the descriptor for its `gravity` attribute:\n```python\nclass Planet:\n    gravity = IntegerRange(1, 100)\n    def __init__(self, name, gravity):\n        self.name = name\n        self.gravity = gravity\n```\nFinally, write a helper function `test_descriptor(name, gravity)` that instantiates `Planet(name, gravity)`. If it succeeds, return the string `'{name} is at {gravity}g'`. If a `ValueError` is raised, catch it and return `'invalid gravity'`.",
    starter: `class IntegerRange:
    # Write your descriptor class here
    pass

class Planet:
    gravity = IntegerRange(1, 100)
    def __init__(self, name, gravity):
        self.name = name
        self.gravity = gravity

def test_descriptor(name, gravity):
    # Instantiate Planet and return result
    return ""`,
    functionName: "test_descriptor",
    testCases: [
      { label: "Mars 38g → Mars is at 38g", args: ["Mars", 38], expected: "Mars is at 38g" },
      { label: "Jupiter 150g → invalid gravity", args: ["Jupiter", 150], expected: "invalid gravity" },
      { label: "Pluto 0g → invalid gravity", args: ["Pluto", 0], expected: "invalid gravity" },
      { label: "Earth string input → invalid gravity", args: ["Earth", "normal"], expected: "invalid gravity" }
    ]
  },
  "js-basics-formatter": {
    slug: "js-basics-formatter",
    name: "Velocity Formatter",
    level: "Beginner",
    language: "JavaScript",
    xp: 40,
    blurb: "Use arrow functions and template literals to format speed.",
    instructions: "Write an arrow function `formatVelocity` that takes two parameters: `value` (a number) and `unit` (a string). If `unit` is not provided, it should default to `'km/h'`. The function should return a template literal string in the format: `{value} {unit}`. If `value` is negative, return `'Invalid speed'`.",
    starter: `const formatVelocity = (value, unit = 'km/h') => {
  // Write your code here
  return "";
};`,
    functionName: "formatVelocity",
    testCases: [
      { label: "mph formatting", args: [120, "mph"], expected: "120 mph" },
      { label: "default unit formatting", args: [50], expected: "50 km/h" },
      { label: "negative value check", args: [-10], expected: "Invalid speed" },
      { label: "zero speed formatting", args: [0, "m/s"], expected: "0 m/s" }
    ]
  },
  "js-dom-manipulator": {
    slug: "js-dom-manipulator",
    name: "DOM Node Transformer",
    level: "Intermediate",
    language: "JavaScript",
    xp: 50,
    blurb: "Transform elements using DOM properties and classList.",
    instructions: "Write a function `transformElement(element, newText, classToAdd, classToRemove)` that takes a mock DOM element and updates its properties:\n1. Sets `element.textContent` to `newText`.\n2. Adds `classToAdd` using `element.classList.add(...)`.\n3. Removes `classToRemove` using `element.classList.remove(...)`.\n4. Returns the element.\n\nAlso write a helper function `testDOM(textContent, classes, newText, classToAdd, classToRemove)` that:\n1. Creates a mock element:\n```javascript\nconst element = {\n  textContent,\n  classList: {\n    classes: [...classes],\n    add(c) { if (!this.classes.includes(c)) this.classes.push(c); },\n    remove(c) { this.classes = this.classes.filter(x => x !== c); }\n  }\n};\n```\n2. Calls `transformElement(...)` and returns a plain object: `{ text: element.textContent, classes: element.classList.classes }`.",
    starter: `function transformElement(element, newText, classToAdd, classToRemove) {
  // Write your DOM modifier here
  return element;
}

function testDOM(textContent, classes, newText, classToAdd, classToRemove) {
  // Write your test helper here
  return {};
}`,
    functionName: "testDOM",
    testCases: [
      { label: "change text and remove star class", args: ["hello", ["star"], "sky", "cloud", "star"], expected: { text: "sky", classes: ["cloud"] } },
      { label: "keep fade and add glow class", args: ["old", ["fade"], "new", "glow", "none"], expected: { text: "new", classes: ["fade", "glow"] } },
      { label: "no duplicate add, ignore absent remove", args: ["a", ["x", "y"], "b", "x", "z"], expected: { text: "b", classes: ["x", "y"] } }
    ]
  },
  "js-expert-proxy": {
    slug: "js-expert-proxy",
    name: "Secure Object Proxy",
    level: "Advanced",
    language: "JavaScript",
    xp: 70,
    blurb: "Write a Proxy handler that protects object properties.",
    instructions: "Write a function `createSecureObject(target, allowedKeys)` that returns a `Proxy` wrapping `target` and traps property read and write operations:\n1. `get(target, prop)`: If `prop` is NOT in `allowedKeys`, throw an `Error('Access Denied')`. Otherwise, return `target[prop]`.\n2. `set(target, prop, value)`: If `prop` is NOT in `allowedKeys`, throw an `Error('Write Denied')`. Otherwise, set `target[prop] = value` and return `true`.\n\nAlso write a helper function `test_secure_proxy(propToRead, propToWrite, valToWrite)` that:\n1. Creates a target object `{ name: 'Nebula', type: 'gas' }`.\n2. Wraps it using `createSecureObject` and `allowedKeys = ['name', 'type', 'density']`.\n3. Tries to read `propToRead`. If it throws an error, return `'read error'`.\n4. Tries to write `valToWrite` to `propToWrite`. If it throws an error, return `'write error'`.\n5. Returns the value of `propToWrite` on the proxy.",
    starter: `function createSecureObject(target, allowedKeys) {
  // Write your proxy generator here
  return target;
}

function test_secure_proxy(propToRead, propToWrite, valToWrite) {
  // Write your test helper here
  return null;
}`,
    functionName: "test_secure_proxy",
    testCases: [
      { label: "valid read and write", args: ["name", "density", 95], expected: 95 },
      { label: "invalid read access", args: ["secret", "density", 95], expected: "read error" },
      { label: "invalid write access", args: ["name", "secret", 95], expected: "write error" }
    ]
  },
  "ts-basics-challenge": {
    slug: "ts-basics-challenge",
    name: "TS Basics Challenge",
    level: "Beginner",
    language: "TypeScript",
    xp: 40,
    blurb: "Validate star properties using interfaces.",
    instructions: "Write a function `checkStar(star)` that accepts an object conforming to the interface `Star { name: string; magnitude?: number }`. The function should:\n1. If `name` is empty (length 0), return `'Invalid Star'`.\n2. If `magnitude` is present, return `'Magnitude: '` followed by the magnitude value.\n3. If `magnitude` is missing, return `'Magnitude: unknown'`.",
    starter: `interface Star {
  name: string;
  magnitude?: number;
}

function checkStar(star: Star): string {
  // Write your code here
  return "";
}`,
    functionName: "checkStar",
    testCases: [
      { label: "Vega → Magnitude: 0.03", args: [{ name: "Vega", magnitude: 0.03 }], expected: "Magnitude: 0.03" },
      { label: "Polaris no magnitude → unknown", args: [{ name: "Polaris" }], expected: "Magnitude: unknown" },
      { label: "Empty name → Invalid Star", args: [{ name: "", magnitude: 1.5 }], expected: "Invalid Star" }
    ]
  },
  "ts-unions-enums-challenge": {
    slug: "ts-unions-enums-challenge",
    name: "TS Unions & Enums Challenge",
    level: "Intermediate",
    language: "TypeScript",
    xp: 50,
    blurb: "Narrow a union of flight speed values.",
    instructions: "Write a function `parseSpeed(speed)` that takes a union type parameter `speed: string | number`. The function should:\n1. If `speed` is a number, return it directly.\n2. If `speed` is a string, parse it using `parseFloat()`. If the parsed value is not a number (`isNaN`) or is negative, return `-1`.\n3. Otherwise, return the parsed number.",
    starter: `function parseSpeed(speed: string | number): number {
  // Write your code here
  return -1;
}`,
    functionName: "parseSpeed",
    testCases: [
      { label: "number 120 → 120", args: [120], expected: 120 },
      { label: "string '85.5mph' → 85.5", args: ["85.5mph"], expected: 85.5 },
      { label: "invalid string 'fast' → -1", args: ["fast"], expected: -1 },
      { label: "negative number -50 → -1", args: [-50], expected: -1 }
    ]
  },
  "ts-advanced-challenge": {
    slug: "ts-advanced-challenge",
    name: "Generic Sky Box",
    level: "Advanced",
    language: "TypeScript",
    xp: 60,
    blurb: "Build a generic Box<T> that can transform what it holds.",
    instructions: `Finish the generic class \`Box<T>\`:

- \`getValue()\` returns the value the box was created with.
- \`map(fn)\` takes a function from \`T\` to \`U\` and returns a **new** \`Box<U>\` holding \`fn(value)\`. The original box must not change.

Then write \`boxPipeline(start)\`: put \`start\` in a box, map it with "add 1", then map the result with "double it", and return the final value.`,
    starter: `class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    // return the stored value
    throw new Error("getValue is not written yet");
  }

  map<U>(fn: (value: T) => U): Box<U> {
    // return a new Box holding fn(value)
    throw new Error("map is not written yet");
  }
}

function boxPipeline(start: number): number {
  // box it, add 1, double it, unbox it
  return 0;
}`,
    functionName: "boxPipeline",
    testCases: [
      { label: "boxPipeline(3)", args: [3], expected: 8 },
      { label: "boxPipeline(0)", args: [0], expected: 2 },
      { label: "boxPipeline(-1)", args: [-1], expected: 0 },
      { label: "boxPipeline(10)", args: [10], expected: 22 },
    ],
    hints: [
      "Inside the class, the stored value is `this.value`.",
      "`map` should return `new Box(fn(this.value))`, not change `this.value`.",
      "The pipeline reads left to right: `new Box(start).map(...).map(...).getValue()`.",
    ],
  },
  "ts-expert-challenge": {
    slug: "ts-expert-challenge",
    name: "TS Expert Challenge",
    level: "Advanced",
    language: "TypeScript",
    xp: 70,
    blurb: "Write a mapped type query parser.",
    instructions: "Define a mapped type `StringifyProperties<T>` which maps all properties of type `T` to be of type `string`.\n\nWrite a function `stringifyConfig(config)` that takes an object, converts all of its property values to strings using `String()`, and returns the transformed object conforming to `StringifyProperties<T>`. Ensure you iterate through all owned keys of the input object.",
    starter: `type StringifyProperties<T> = {
  [K in keyof T]: string;
};

function stringifyConfig<T extends object>(config: T): StringifyProperties<T> {
  // Write your code here
  return {} as any;
}`,
    functionName: "stringifyConfig",
    testCases: [
      { label: "{ port: 80 } → { port: '80' }", args: [{ port: 80 }], expected: { port: "80" } },
      { label: "{ debug: true, val: 0 } → { debug: 'true', val: '0' }", args: [{ debug: true, val: 0 }], expected: { debug: "true", val: "0" } },
      { label: "{} → {}", args: [{}], expected: {} }
    ]
  },
  "py-signal-parser": {
    slug: "py-signal-parser",
    name: "Signal Parser",
    level: "Intermediate",
    language: "Python",
    xp: 60,
    blurb: "Parse a messy sensor log without letting one bad line crash everything.",
    instructions: `A sensor log arrives as lines like \`"altitude=1200"\`. Write \`parse_readings(lines)\` that returns a dict with two keys:

- \`"values"\`: a dict from each reading name to its whole-number value
- \`"bad"\`: how many lines could not be parsed

A line is bad if it has no \`=\` or its value is not a whole number. Ignore spaces around the name and the value. If a name appears twice, keep the later value. Use try/except for the conversion.`,
    starter: `def parse_readings(lines):
    values = {}
    bad = 0
    # split each line on "=" and convert the value with int()
    return {"values": values, "bad": bad}`,
    functionName: "parse_readings",
    testCases: [
      { label: "two good lines", args: [["altitude=1200", "speed=340"]], expected: { values: { altitude: 1200, speed: 340 }, bad: 0 } },
      { label: "bad lines are counted", args: [["temp=-4", "oops", "wind=fast"]], expected: { values: { temp: -4 }, bad: 2 } },
      { label: "empty log", args: [[]], expected: { values: {}, bad: 0 } },
      { label: "later value wins", args: [["a=1", "a=2"]], expected: { values: { a: 2 }, bad: 0 } },
      { label: "spaces are ignored", args: [[" depth = 30 "]], expected: { values: { depth: 30 }, bad: 0 } },
    ],
    hints: [
      "`line.split(\"=\")` gives a list. A good line splits into exactly two parts.",
      "Wrap `int(value.strip())` in try/except ValueError and add 1 to `bad` in the except.",
    ],
  },
  "py-meteor-windows": {
    slug: "py-meteor-windows",
    name: "Meteor Windows",
    level: "Advanced",
    language: "Python",
    xp: 80,
    blurb: "Merge overlapping observation windows into as few as possible.",
    instructions: `Astronomers booked telescope windows as \`[start, end]\` pairs, in no particular order. Write \`merge_windows(windows)\` that merges every pair of windows that overlap or touch, and returns the merged windows sorted by start time.

For example, \`[1, 3]\` and \`[2, 6]\` overlap, so they become \`[1, 6]\`. \`[1, 4]\` and \`[4, 5]\` touch, so they become \`[1, 5]\`. Aim for O(n log n): sort once, then make a single pass.`,
    starter: `def merge_windows(windows):
    merged = []
    # sort by start time, then extend or start a new window
    return merged`,
    functionName: "merge_windows",
    testCases: [
      { label: "overlaps merge", args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { label: "touching windows merge", args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { label: "no windows", args: [[]], expected: [] },
      { label: "unsorted input", args: [[[5, 7], [1, 2]]], expected: [[1, 2], [5, 7]] },
      { label: "one window swallows others", args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
    ],
    hints: [
      "Sort with `sorted(windows, key=lambda w: w[0])` first.",
      "Compare each window's start with the end of the last merged window.",
      "When they overlap, stretch the last window's end with `max(...)`.",
    ],
  },
  "js-launch-checklist": {
    slug: "js-launch-checklist",
    name: "Launch Checklist",
    level: "Advanced",
    language: "JavaScript",
    xp: 70,
    blurb: "Run every pre-flight check at once and report which ones failed.",
    instructions: `Before launch, every check in \`checks\` must run. Each number is one check: \`runCheck(ms, index)\` (already written) waits that many milliseconds and then passes, or fails with an error when the number is negative.

Write \`async function runChecklist(checks)\` that starts **all** checks at the same time, waits until every one has finished, and returns:

- \`passed\`: how many checks passed
- \`failed\`: the error messages of the failed checks, in the order of \`checks\`

One failing check must not stop the others from being counted.`,
    starter: `const runCheck = (ms, index) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms < 0) reject(new Error(\`check \${index} failed\`));
      else resolve(index);
    }, Math.abs(ms));
  });

async function runChecklist(checks) {
  // start every check, then wait for all of them to settle
  return { passed: 0, failed: [] };
}`,
    functionName: "runChecklist",
    testCases: [
      { label: "all pass", args: [[5, 10, 1]], expected: { passed: 3, failed: [] } },
      { label: "two fail", args: [[5, -1, 3, -2]], expected: { passed: 2, failed: ["check 1 failed", "check 3 failed"] } },
      { label: "empty list", args: [[]], expected: { passed: 0, failed: [] } },
      { label: "all fail", args: [[-4, -1]], expected: { passed: 0, failed: ["check 0 failed", "check 1 failed"] } },
    ],
    hints: [
      "`checks.map((ms, i) => runCheck(ms, i))` starts every check at once.",
      "`await Promise.allSettled(promises)` gives you `{ status, value }` or `{ status, reason }` for each one.",
    ],
  },
  "js-top-words": {
    slug: "js-top-words",
    name: "Top Words",
    level: "Advanced",
    language: "JavaScript",
    xp: 80,
    blurb: "Find the most frequent words in a text, with fair tie-breaking.",
    instructions: `Write \`topWords(text, k)\` that returns the \`k\` most frequent words in \`text\`.

- Words are runs of letters, compared in lowercase (so "Moon" and "moon" are the same word).
- Sort by count, highest first. Break ties alphabetically.
- Return fewer than \`k\` words if the text does not have that many.

Aim for one pass to count, then one sort.`,
    starter: `function topWords(text, k) {
  // count with a Map, then sort the entries
  return [];
}`,
    functionName: "topWords",
    testCases: [
      { label: "counts decide", args: ["the sky the stars the sky", 2], expected: ["the", "sky"] },
      { label: "three words", args: ["b a c b a b", 3], expected: ["b", "a", "c"] },
      { label: "empty text", args: ["", 2], expected: [] },
      { label: "case is ignored", args: ["Moon moon MOON sun", 5], expected: ["moon", "sun"] },
      { label: "ties are alphabetical", args: ["x y z", 2], expected: ["x", "y"] },
    ],
    hints: [
      "`text.toLowerCase().match(/[a-z]+/g) || []` gives you the words.",
      "Sort entries with `(a, b) => b[1] - a[1] || a[0].localeCompare(b[0])`.",
    ],
  },
  "ts-sensor-labels": {
    slug: "ts-sensor-labels",
    name: "Sensor Labels",
    level: "Beginner",
    language: "TypeScript",
    xp: 40,
    requires: "ts-unions-narrowing",
    blurb: "Label temperature readings, including the sensors that went quiet.",
    instructions: `Weather balloons report a temperature in degrees, or \`null\` when a sensor is offline. Write \`labelReadings(readings: (number | null)[]): string[]\` that turns each reading into a label:

- \`null\` becomes \`"offline"\`
- below 0 becomes \`"freezing"\`
- 0 up to and including 25 becomes \`"mild"\`
- above 25 becomes \`"hot"\`

Check for \`null\` first. After that check, TypeScript knows the reading is a number.`,
    starter: `function labelReadings(readings: (number | null)[]): string[] {
  const labels: string[] = [];
  // narrow each reading, then pick its label
  return labels;
}`,
    functionName: "labelReadings",
    testCases: [
      { label: "one of each", args: [[null, -4, 18, 31]], expected: ["offline", "freezing", "mild", "hot"] },
      { label: "edges", args: [[0, 25, 25.5]], expected: ["mild", "mild", "hot"] },
      { label: "all quiet", args: [[null, null]], expected: ["offline", "offline"] },
      { label: "no readings", args: [[]], expected: [] },
    ],
    hints: [
      "`if (r === null)` narrows `r` to `number` in every branch after it.",
      "`readings.map(...)` returns the new array in one step.",
    ],
  },
  "ts-group-by": {
    slug: "ts-group-by",
    name: "Group By Key",
    level: "Intermediate",
    language: "TypeScript",
    xp: 60,
    requires: "ts-keyof-typeof",
    blurb: "A generic groupBy that only accepts keys the items really have.",
    instructions: `Write a generic \`groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]>\` that groups items by the value of one of their properties.

Each group's name is the property value turned into a string, and items keep their original order inside a group. Because \`K extends keyof T\`, calling \`groupBy(stars, "colour")\` on objects without a \`colour\` property is a compile error, not a runtime surprise.`,
    starter: `function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  // put each item in the group named by String(item[key])
  return groups;
}`,
    functionName: "groupBy",
    testCases: [
      {
        label: "stars by colour",
        args: [[{ name: "Vega", colour: "blue" }, { name: "Betelgeuse", colour: "red" }, { name: "Rigel", colour: "blue" }], "colour"],
        expected: { blue: [{ name: "Vega", colour: "blue" }, { name: "Rigel", colour: "blue" }], red: [{ name: "Betelgeuse", colour: "red" }] },
      },
      {
        label: "numbers become group names",
        args: [[{ id: 1, tier: 2 }, { id: 2, tier: 1 }, { id: 3, tier: 2 }], "tier"],
        expected: { "1": [{ id: 2, tier: 1 }], "2": [{ id: 1, tier: 2 }, { id: 3, tier: 2 }] },
      },
      { label: "no items", args: [[], "type"], expected: {} },
    ],
    hints: [
      "`const name = String(item[key]);` gives the group name for one item.",
      "`(groups[name] ??= []).push(item);` creates the group the first time it is needed.",
    ],
  },
  "ts-parse-config": {
    slug: "ts-parse-config",
    name: "Config Gatekeeper",
    level: "Advanced",
    language: "TypeScript",
    xp: 80,
    requires: "ts-unknown-never",
    blurb: "Turn untrusted JSON into a typed config, or explain exactly why not.",
    instructions: `Data from outside your program (a file, a request, a form) arrives as \`unknown\`. Write \`parseConfig(input: unknown): Result\` that checks it before anything trusts it.

A valid config is an object with:

- \`host\`: a non-empty string
- \`port\`: a whole number from 1 to 65535
- \`debug\`: an optional boolean that defaults to \`false\`

Return \`{ ok: true, value: { host, port, debug } }\` (only those three keys) when it is valid. Otherwise return \`{ ok: false, error }\` with the first problem found, checking in this order: \`"config must be an object"\`, \`"host must be a non-empty string"\`, \`"port must be a whole number from 1 to 65535"\`, \`"debug must be a boolean"\`.`,
    starter: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type Result = { ok: true; value: Config } | { ok: false; error: string };

function parseConfig(input: unknown): Result {
  // narrow input step by step before reading any property
  return { ok: false, error: "config must be an object" };
}`,
    functionName: "parseConfig",
    testCases: [
      { label: "valid, debug defaults", args: [{ host: "sky.local", port: 8080 }], expected: { ok: true, value: { host: "sky.local", port: 8080, debug: false } } },
      { label: "extra keys are dropped", args: [{ host: "a", port: 1, debug: true, secret: "x" }], expected: { ok: true, value: { host: "a", port: 1, debug: true } } },
      { label: "not an object", args: ["localhost:80"], expected: { ok: false, error: "config must be an object" } },
      { label: "null is not a config", args: [null], expected: { ok: false, error: "config must be an object" } },
      { label: "empty host", args: [{ host: "", port: 80 }], expected: { ok: false, error: "host must be a non-empty string" } },
      { label: "port out of range", args: [{ host: "a", port: 70000 }], expected: { ok: false, error: "port must be a whole number from 1 to 65535" } },
      { label: "port as text", args: [{ host: "a", port: "80" }], expected: { ok: false, error: "port must be a whole number from 1 to 65535" } },
      { label: "debug as text", args: [{ host: "a", port: 80, debug: "yes" }], expected: { ok: false, error: "debug must be a boolean" } },
    ],
    hints: [
      "`typeof input !== \"object\" || input === null` rules out everything that is not an object (arrays are objects, and fail the host check).",
      "Cast once to read properties safely: `const raw = input as Record<string, unknown>;`.",
      "`Number.isInteger(raw.port)` is false for strings and fractions alike.",
      "Copy `raw.debug` into a local `const` before you check its type. TypeScript narrows a local variable reliably, but not a property read from a `Record`.",
    ],
  },
  "py-data-report": {
    slug: "py-data-report",
    name: "Weather Report",
    level: "Advanced",
    language: "Python",
    xp: 80,
    requires: "py-data-cleaning",
    packages: ["pandas"],
    blurb: "Clean a messy feed of readings with pandas, then report on it.",
    instructions: `A weather feed sends a list of dictionaries such as \`{"city": "Oslo", "temp": "3", "rain_mm": 1.2}\`. The values arrive as text, cities sometimes go missing, and rain is sometimes absent. Write \`summarize_readings(rows)\` that cleans the feed and reports on it.

Clean it in this order:

1. Turn \`temp\` into numbers, with anything unreadable becoming missing.
2. Drop every row with no city.
3. Turn \`rain_mm\` into numbers and fill the gaps with 0.

Then return \`{"rows": how many rows are left, "avg_temp": the mean temperature rounded to one decimal place, "wettest": the city with the most rain}\`. If no rows survive, every value is 0 or None. If no temperature could be read, \`avg_temp\` is None. On a tie for the most rain, the first city wins.`,
    starter: `import pandas as pd

def summarize_readings(rows):
    # build a DataFrame, clean it, then report
    return {"rows": 0, "avg_temp": None, "wettest": None}`,
    functionName: "summarize_readings",
    testCases: [
      {
        label: "a messy feed",
        args: [[{ city: "Oslo", temp: "3", rain_mm: 1.2 }, { city: "Lima", temp: "19", rain_mm: null }, { city: null, temp: "5", rain_mm: 9.9 }, { city: "Bergen", temp: "x", rain_mm: 7.5 }]],
        expected: { rows: 3, avg_temp: 11.0, wettest: "Bergen" },
      },
      { label: "nothing to report", args: [[]], expected: { rows: 0, avg_temp: null, wettest: null } },
      { label: "no readable temperature", args: [[{ city: "A", temp: "warm", rain_mm: 0 }]], expected: { rows: 1, avg_temp: null, wettest: "A" } },
      {
        label: "a tie goes to the first city",
        args: [[{ city: "A", temp: "10", rain_mm: 5 }, { city: "B", temp: "20", rain_mm: 5 }]],
        expected: { rows: 2, avg_temp: 15.0, wettest: "A" },
      },
      {
        label: "rounding to one place",
        args: [[{ city: "A", temp: "1", rain_mm: 0 }, { city: "B", temp: "2", rain_mm: 1 }]],
        expected: { rows: 2, avg_temp: 1.5, wettest: "B" },
      },
    ],
    hints: [
      "`pd.to_numeric(df[\"temp\"], errors=\"coerce\")` turns unreadable text into missing values.",
      "`df.dropna(subset=[\"city\"])` removes the rows with no city.",
      "`df.loc[df[\"rain_mm\"].idxmax(), \"city\"]` finds the wettest city, and keeps the first on a tie.",
      "`mean()` on a column with nothing readable gives NaN: check it with `pd.isna(...)` and return None instead.",
    ],
  },
};

/**
 * Section challenges: module name -> the graded challenge that caps it. Read +
 * quiz modules (C#, the Python read + quiz modules) have none.
 */
export const moduleChallenges: Record<string, string> = {
  "Python for Data Science": "py-data-report",
  // Python. NOTE: graded challenges always test a `functionName`, so a code
  // challenge inherently requires functions. Python teaches functions in the
  // "Functions" module, so the earlier modules (Basics, Conditionals, Loops) get
  // NO section challenge - presenting one there would demand a skill the learner
  // has not met yet. (Their capstones still exist in `challenges` for later use;
  // appropriate early-section capstones would be quiz-style, a content follow-up.)
  "Functions": "py-functions-average",
  "Collections": "dict-diver",
  "Comprehensions and data tools": "py-comprehension-sorter",
  "Errors, Files and Modules": "py-signal-parser",
  "Objects and Classes": "py-intermediate-oop",
  "Python Advanced": "py-advanced-decorator",
  "Algorithms and Problem Solving": "py-meteor-windows",
  "Python Expert": "py-expert-descriptor",
  // JavaScript
  "JS Basics": "js-basics-formatter",
  "JS Conditionals & Logic": "js-sky-classifier",
  "JS Collections & Loops": "js-loops-challenge",
  "JS Collections Depth": "js-array-transformer",
  "JS Functions and Classes": "js-reducer",
  "JS Async and Errors": "js-launch-checklist",
  "JS Web APIs": "js-dom-manipulator",
  "JS Algorithms": "js-top-words",
  "JS Expert": "js-expert-proxy",
  // TypeScript
  "TS Basics": "ts-basics-challenge",
  "TS Unions & Enums": "ts-unions-enums-challenge",
  "TS Advanced": "ts-advanced-challenge",
  "TS Expert": "ts-expert-challenge",
};
