import type { PracticeDataset } from "@/content/types";

export const javascriptPractice: Record<string, PracticeDataset> = {
  "js-variables": {
    prompt: "Arrange the lines to assign 'dusk' to a variable and print it.",
    parsonsFragments: [
      { id: "jv1", text: "const theme = 'dusk';", indent: 0 },
      { id: "jv2", text: "console.log(theme);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to declare a constant variable for speed and a let variable for altitude.",
    fadedLines: [
      { text: "___ speed = 300;", blanks: ["const"] },
      { text: "___ altitude = 5000;", blanks: ["let"] },
      { text: "altitude = 6000;", blanks: [] },
    ],
    fadedExplain: "Use const for values that won't change, and let for variables that can be reassigned.",
    predictCode: "let color = 'cyan';\nconst border = 'solid';\ncolor = 'magenta';\nconsole.log(color);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "cyan", correct: false, why: "The variable color was reassigned to 'magenta'." },
      { id: "b", label: "magenta", correct: true, why: "Since color is declared with let, it can be reassigned." },
      { id: "c", label: "Error", correct: false, why: "Reassigning a let variable is perfectly valid." },
    ]
  },
  "js-functions": {
    prompt: "Arrange the lines to define a simple arrow function that returns the square of a number, then log the result.",
    parsonsFragments: [
      { id: "jf1", text: "const square = (x) => {", indent: 0 },
      { id: "jf2", text: "  return x * x;", indent: 1 },
      { id: "jf3", text: "};", indent: 0 },
      { id: "jf4", text: "console.log(square(5));", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to write a valid arrow function named 'greet' that takes a name and returns a greeting.",
    fadedLines: [
      { text: "const greet = (name) ___ {", blanks: ["=>"] },
      { text: "  ___ 'Hello, ' + name;", blanks: ["return"] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "Arrow functions use the => operator, and return is used to hand a value back to the caller.",
    predictCode: "const add = (a, b) => a + b;\nconsole.log(add(2, 3));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "In arrow functions, if you omit curly braces, the expression is implicitly returned." },
      { id: "b", label: "Error: missing return statement", correct: false, why: "Single-expression arrow functions don't require braces or explicit return." },
      { id: "c", label: "a + b", correct: false, why: "It evaluates the mathematical addition, not string concatenation here." },
    ]
  },
  "js-loops": {
    prompt: "Arrange the lines to run a JS loop that counts from 1 to 3.",
    parsonsFragments: [
      { id: "jl1", text: "for (let i = 1; i <= 3; i++) {", indent: 0 },
      { id: "jl2", text: "  console.log(i);", indent: 1 },
      { id: "jl3", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete a standard loop that runs 4 times (0 to 3).",
    fadedLines: [
      { text: "for (let i = 0; i ___ 4; i___) {", blanks: ["<", "++"] },
      { text: "  console.log(i);", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The condition i < 4 stops the loop when i reaches 4. i++ increments it by 1 on each turn.",
    predictCode: "let sum = 0;\nfor (let i = 1; i < 3; i++) {\n  sum += i;\n}\nconsole.log(sum);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "The loop runs for i=1 and i=2. 1 + 2 = 3." },
      { id: "b", label: "6", correct: false, why: "The condition is i < 3, so it does not run for i=3." },
      { id: "c", label: "0", correct: false, why: "The loop executes and accumulates values in sum." },
    ],
  },
  "js-arrays": {
    prompt: "Arrange the lines to push 'Vega' into the stars array and log it.",
    parsonsFragments: [
      { id: "ja1", text: "const stars = ['Polaris'];", indent: 0 },
      { id: "ja2", text: "stars.push('Vega');", indent: 0 },
      { id: "ja3", text: "console.log(stars);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to log the number of elements in the array.",
    fadedLines: [
      { text: "const clouds = ['cirrus', 'cumulus'];", blanks: [] },
      { text: "console.log(clouds.___);", blanks: ["length"] },
    ],
    fadedExplain: "In JavaScript, the .length property retrieves the number of elements in an array.",
    predictCode: "const arr = [10, 20];\narr[0] = 99;\nconsole.log(arr);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 99, 20 ]", correct: true, why: "Arrays are mutable, so you can overwrite values at specific indexes." },
      { id: "b", label: "[ 10, 20 ]", correct: false, why: "Index 0 was updated to 99." },
      { id: "c", label: "TypeError: Assignment to constant variable.", correct: false, why: "Even though declared with const, the array contents can be modified." },
    ],
  },
  "js-objects": {
    prompt: "Arrange the lines to create an object and access its 'shape' property.",
    parsonsFragments: [
      { id: "jo1", text: "const cloud = {", indent: 0 },
      { id: "jo2", text: "  shape: 'wispy'", indent: 1 },
      { id: "jo3", text: "};", indent: 0 },
      { id: "jo4", text: "console.log(cloud.shape);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to access the magnitude property using bracket notation.",
    fadedLines: [
      { text: "const star = { name: 'Vega', mag: 0.03 };", blanks: [] },
      { text: "console.log(star[___]);", blanks: ["'mag'"] },
    ],
    fadedExplain: "Bracket notation requires the property name to be specified as a string.",
    predictCode: "const user = { name: 'Dreamer' };\nuser.level = 5;\nconsole.log(user.level);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "You can dynamically add properties to JavaScript objects using dot notation." },
      { id: "b", label: "undefined", correct: false, why: "level was successfully added and assigned to 5." },
      { id: "c", label: "Error", correct: false, why: "Adding properties to const-declared objects is fully valid." },
    ],
  },
  "js-comparisons": {
    prompt: "Arrange the lines to check if altitude is strictly equal to 10000, storing the result in isCruising.",
    parsonsFragments: [
      { id: "jcp1", text: "const altitude = 10000;", indent: 0 },
      { id: "jcp2", text: "const isCruising = altitude === 10000;", indent: 0 },
      { id: "jcp3", text: "console.log(isCruising);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to check if the temperature is NOT strictly equal to 0.",
    fadedLines: [
      { text: "const temp = -5;", blanks: [] },
      { text: "const notFreezing = temp ___ 0;", blanks: ["!=="] },
      { text: "console.log(notFreezing);", blanks: [] },
    ],
    fadedExplain: "Use !== for strict inequality checks in JavaScript.",
    predictCode: "const a = 5;\nconst b = '5';\nconsole.log(a === b);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "true", correct: false, why: "=== checks both value and type. a is a number, b is a string." },
      { id: "b", label: "false", correct: true, why: "=== checks value and type strictly. They are of different types." },
      { id: "c", label: "undefined", correct: false, why: "=== evaluates to a boolean value, not undefined." },
    ],
  },
  "js-if-else": {
    prompt: "Arrange the lines to log 'Fly' if clear is true, otherwise log 'Wait'.",
    parsonsFragments: [
      { id: "jie1", text: "const clear = true;", indent: 0 },
      { id: "jie2", text: "if (clear) {", indent: 0 },
      { id: "jie3", text: "  console.log('Fly');", indent: 1 },
      { id: "jie4", text: "} else {", indent: 0 },
      { id: "jie5", text: "  console.log('Wait');", indent: 1 },
      { id: "jie6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete the if-else structure.",
    fadedLines: [
      { text: "const cloud = 'stormy';", blanks: [] },
      { text: "___ (cloud === 'stormy') {", blanks: ["if"] },
      { text: "  console.log('Stay');", blanks: [] },
      { text: "} ___ {", blanks: ["else"] },
      { text: "  console.log('Go');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "An if statement checks a condition in parentheses, and an else block executes if the condition is false.",
    predictCode: "const light = 'red';\nif (light === 'green') {\n  console.log('Go');\n} else {\n  console.log('Stop');\n}",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Go", correct: false, why: "The condition light === 'green' evaluates to false." },
      { id: "b", label: "Stop", correct: true, why: "Since the condition is false, the else block runs." },
      { id: "c", label: "undefined", correct: false, why: "It logs 'Stop' to the console." },
    ],
  },
  "js-else-if": {
    prompt: "Arrange the lines to classify the visibility level based on distance in miles.",
    parsonsFragments: [
      { id: "jei1", text: "if (dist > 5) {", indent: 0 },
      { id: "jei2", text: "  console.log('Clear');", indent: 1 },
      { id: "jei3", text: "} else if (dist > 2) {", indent: 0 },
      { id: "jei4", text: "  console.log('Hazy');", indent: 1 },
      { id: "jei5", text: "} else {", indent: 0 },
      { id: "jei6", text: "  console.log('Foggy');", indent: 1 },
      { id: "jei7", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to test three options in order.",
    fadedLines: [
      { text: "const speed = 40;", blanks: [] },
      { text: "if (speed > 50) {", blanks: [] },
      { text: "  console.log('Fast');", blanks: [] },
      { text: "} ___ if (speed > ___ ) {", blanks: ["else", "20"] },
      { text: "  console.log('Moderate');", blanks: [] },
      { text: "} else {", blanks: [] },
      { text: "  console.log('Slow');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "else if checks another condition if the first one was false. 20 is a logical intermediate threshold.",
    predictCode: "const depth = 15;\nif (depth > 20) {\n  console.log('Deep');\n} else if (depth > 10) {\n  console.log('Mid');\n} else {\n  console.log('Shallow');\n}",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Deep", correct: false, why: "depth is 15, which is not > 20." },
      { id: "b", label: "Mid", correct: true, why: "depth (15) is greater than 10, so the else if block executes." },
      { id: "c", label: "Shallow", correct: false, why: "The else if condition was met, so the else block is skipped." },
    ],
  },
  "js-logical-operators": {
    prompt: "Arrange the lines to allow launch only if fuel is high AND weather is clear.",
    parsonsFragments: [
      { id: "jlo1", text: "const fuelHigh = true;", indent: 0 },
      { id: "jlo2", text: "const clearWeather = true;", indent: 0 },
      { id: "jlo3", text: "if (fuelHigh && clearWeather) {", indent: 0 },
      { id: "jlo4", text: "  console.log('Launch!');", indent: 1 },
      { id: "jlo5", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to log 'Stargaze' if it is dark AND NOT cloudy.",
    fadedLines: [
      { text: "const isDark = true;", blanks: [] },
      { text: "const isCloudy = false;", blanks: [] },
      { text: "if (isDark ___ ___isCloudy) {", blanks: ["&&", "!"] },
      { text: "  console.log('Stargaze');", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use && to require both conditions to be true, and ! to check if a condition is false.",
    predictCode: "const rainy = true;\nconst windy = false;\nconsole.log(rainy || windy);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "true", correct: true, why: "The || (OR) operator returns true if at least one operand is true." },
      { id: "b", label: "false", correct: false, why: "rainy is true, which satisfies the || operator." },
      { id: "c", label: "undefined", correct: false, why: "It returns a boolean value." },
    ],
  },
  "js-ternary": {
    prompt: "Arrange the lines to assign 'hot' or 'cold' to tempStatus using a ternary operator.",
    parsonsFragments: [
      { id: "jt1", text: "const temp = 35;", indent: 0 },
      { id: "jt2", text: "const tempStatus = temp > 30 ? 'hot' : 'cold';", indent: 0 },
      { id: "jt3", text: "console.log(tempStatus);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to assign 'wet' if raining is true, else 'dry'.",
    fadedLines: [
      { text: "const raining = false;", blanks: [] },
      { text: "const state = raining ___ 'wet' ___ 'dry';", blanks: ["?", ":"] },
      { text: "console.log(state);", blanks: [] },
    ],
    fadedExplain: "Ternary operator syntax is condition ? expressionIfTrue : expressionIfFalse.",
    predictCode: "const altitude = 4000;\nconst level = altitude > 5000 ? 'high' : 'low';\nconsole.log(level);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "high", correct: false, why: "altitude (4000) is not greater than 5000." },
      { id: "b", label: "low", correct: true, why: "The condition is false, so the value after the colon is selected." },
      { id: "c", label: "4000", correct: false, why: "The ternary returns one of the two string literals." },
    ],
  },
  "js-array-methods": {
    prompt: "Arrange the lines to double every number in the sequence using .map().",
    parsonsFragments: [
      { id: "jam1", text: "const nums = [1, 2, 3];", indent: 0 },
      { id: "jam2", text: "const doubled = nums.map(n => n * 2);", indent: 0 },
      { id: "jam3", text: "console.log(doubled);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to keep only values strictly greater than 5 using .filter().",
    fadedLines: [
      { text: "const values = [3, 8, 5, 12];", blanks: [] },
      { text: "const high = values.___ (v ___ v > 5);", blanks: ["filter", "=>"] },
      { text: "console.log(high);", blanks: [] },
    ],
    fadedExplain: ".filter() calls a callback function for each element, keeping elements that return true.",
    predictCode: "const arr = [1, 2, 3];\nconst res = arr.map(x => x + 1).filter(x => x > 2);\nconsole.log(res);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 2, 3 ]", correct: false, why: "map makes [2, 3, 4], then filter(x > 2) leaves [3, 4]." },
      { id: "b", label: "[ 3, 4 ]", correct: true, why: "First map adds 1 to get [2, 3, 4], then filter keeps values > 2." },
      { id: "c", label: "[ 2, 3, 4 ]", correct: false, why: "The filter call removes the value 2." },
    ],
  },
  "js-destructuring": {
    prompt: "Arrange the lines to extract x and y from coordinates, then log them.",
    parsonsFragments: [
      { id: "jds1", text: "const coord = { x: 10, y: 20 };", indent: 0 },
      { id: "jds2", text: "const { x, y } = coord;", indent: 0 },
      { id: "jds3", text: "console.log(x, y);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to unpack first and second items from array, then combine with spread.",
    fadedLines: [
      { text: "const colors = ['red', 'green', 'blue'];", blanks: [] },
      { text: "const [first, second] ___ colors;", blanks: ["="] },
      { text: "const list = [___first, 'yellow'];", blanks: ["..."] },
    ],
    fadedExplain: "Destructuring arrays uses square brackets, and the spread operator ... expands elements into a new array.",
    predictCode: "const user = { name: 'Nova', level: 5 };\nconst { level: userLevel } = user;\nconsole.log(userLevel);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: true, why: "Destructuring can rename properties. level is bound to userLevel, which is 5." },
      { id: "b", label: "Nova", correct: false, why: "level refers to the numeric value 5, not the name." },
      { id: "c", label: "undefined", correct: false, why: "userLevel receives the value of user.level." },
    ],
  },
  "js-object-methods": {
    prompt: "Arrange the lines to get the keys of an object and log them.",
    parsonsFragments: [
      { id: "jom1", text: "const cloud = { shape: 'wispy', color: 'pink' };", indent: 0 },
      { id: "jom2", text: "const keys = Object.keys(cloud);", indent: 0 },
      { id: "jom3", text: "console.log(keys);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to extract all values from the configuration object.",
    fadedLines: [
      { text: "const config = { speed: 100, active: true };", blanks: [] },
      { text: "const values = Object.___(config);", blanks: ["values"] },
      { text: "console.log(values);", blanks: [] },
    ],
    fadedExplain: "Object.values(config) returns an array containing the property values of the object.",
    predictCode: "const data = { x: 1, y: 2 };\nconsole.log(Object.keys(data).length);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "Object.keys(data) returns ['x', 'y'], whose length is 2." },
      { id: "b", label: "['x', 'y']", correct: false, why: "The length property counts the items in the key array." },
      { id: "c", label: "undefined", correct: false, why: "An array's length property is always a number." },
    ],
  },
  "js-loop-iterators": {
    prompt: "Arrange the lines to loop over array items using for...of.",
    parsonsFragments: [
      { id: "jli1", text: "const skies = ['neon', 'pastel'];", indent: 0 },
      { id: "jli2", text: "for (const sky of skies) {", indent: 0 },
      { id: "jli3", text: "  console.log(sky);", indent: 1 },
      { id: "jli4", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to iterate over the keys of an object using for...in.",
    fadedLines: [
      { text: "const stats = { wind: 15, temp: 5 };", blanks: [] },
      { text: "for (const key ___ stats) {", blanks: ["in"] },
      { text: "  console.log(key);", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "Use in to iterate over keys of an object, and of to iterate over elements of an array.",
    predictCode: "const items = [10, 20];\nlet total = 0;\nfor (const x of items) {\n  total += x;\n}\nconsole.log(total);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "30", correct: true, why: "for...of yields 10 and 20. 10 + 20 = 30." },
      { id: "b", label: "3", correct: false, why: "It yields values, not indices. Summing indices would be 0 + 1 = 1." },
      { id: "c", label: "Error", correct: false, why: "This is valid JavaScript array iteration." },
    ],
  },
  "js-closures": {
    prompt: "Arrange the lines to create a star tracker closure that increments and returns a count each time it is called.",
    parsonsFragments: [
      { id: "cl1", text: "function createStarTracker() {", indent: 0 },
      { id: "cl2", text: "  let starCount = 0;", indent: 1 },
      { id: "cl3", text: "  return () => ++starCount;", indent: 1 },
      { id: "cl4", text: "}", indent: 0 },
      { id: "cl5", text: "const tracker = createStarTracker();", indent: 0 },
      { id: "cl6", text: "console.log(tracker());", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to return a nested function that accesses the outer function parameter 'base'.",
    fadedLines: [
      { text: "function makeCloudSizer(base) {", blanks: [] },
      { text: "  ___ (factor) => ___ * factor;", blanks: ["return", "base"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The returned inner function forms a closure, allowing it to remember and access the base variable from the outer function's scope.",
    predictCode: "const createSkyMultiplier = (multiplier) => {\n  return (clouds) => clouds * multiplier;\n};\nconst doubleClouds = createSkyMultiplier(2);\nconst tripleClouds = createSkyMultiplier(3);\nconsole.log(doubleClouds(5) + tripleClouds(4));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "22", correct: true, why: "doubleClouds(5) evaluates to 10, and tripleClouds(4) evaluates to 12. Their sum is 22." },
      { id: "b", label: "14", correct: false, why: "This incorrect result assumes both functions share the same multiplier value." },
      { id: "c", label: "Error", correct: false, why: "Each call to createSkyMultiplier successfully creates a new closure with its own independent scope." }
    ]
  },
  "js-callbacks": {
    prompt: "Arrange the lines to call a sky observation function passing a callback that logs the name of the cloud.",
    parsonsFragments: [
      { id: "cb1", text: "const observeSky = (cloud, callback) => {", indent: 0 },
      { id: "cb2", text: "  callback(cloud);", indent: 1 },
      { id: "cb3", text: "};", indent: 0 },
      { id: "cb4", text: "observeSky('cumulus', (name) => {", indent: 0 },
      { id: "cb5", text: "  console.log('Saw ' + name);", indent: 1 },
      { id: "cb6", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a function that accepts a callback and invokes it with the star name.",
    fadedLines: [
      { text: "function loadStarData(star, ___) {", blanks: ["callback"] },
      { text: "  ___(star);", blanks: ["callback"] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The callback parameter receives a function argument, which is then executed by invoking it with parentheses and arguments.",
    predictCode: "const filterStars = (stars, checkFn) => {\n  const result = [];\n  for (const star of stars) {\n    if (checkFn(star)) {\n      result.push(star);\n    }\n  }\n  return result;\n};\nconst skyList = ['Sirius', 'Vega', 'Altair'];\nconst matched = filterStars(skyList, (name) => name.startsWith('A'));\nconsole.log(matched);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[ 'Altair' ]", correct: true, why: "The filterStars function uses the callback to filter the list, and only 'Altair' starts with the letter 'A'." },
      { id: "b", label: "[ 'Sirius', 'Vega', 'Altair' ]", correct: false, why: "The callback check is applied to every item, so only matching items are returned, not the whole array." },
      { id: "c", label: "[]", correct: false, why: "Since 'Altair' matches the start letter 'A' check, the result array is not empty." }
    ]
  },
  "js-async-await": {
    prompt: "Arrange the lines to define an async function that awaits data from a forecast API and calls it.",
    parsonsFragments: [
      { id: "aa1", text: "const fetchSkyData = async () => {", indent: 0 },
      { id: "aa2", text: "  const data = await getForecast();", indent: 1 },
      { id: "aa3", text: "  console.log(data.temp);", indent: 1 },
      { id: "aa4", text: "};", indent: 0 },
      { id: "aa5", text: "fetchSkyData();", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define an asynchronous function and await the result of an asynchronous operation.",
    fadedLines: [
      { text: "___ function countStars() {", blanks: ["async"] },
      { text: "  const list = ___ fetchList();", blanks: ["await"] },
      { text: "  return list.length;", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The async keyword declares that a function returns a Promise, and the await keyword pauses execution inside the function until that Promise is resolved.",
    predictCode: "const getAltitude = async () => 8000;\nconst run = async () => {\n  console.log('Start');\n  const val = await getAltitude();\n  console.log(val);\n};\nrun();\nconsole.log('End');",
    predictQuestion: "What order are the values printed to the console?",
    predictOptions: [
      { id: "a", label: "'Start', then 'End', then 8000", correct: true, why: "The await keyword yields execution back to the caller, allowing the synchronous console.log('End') to run before the promise resolves." },
      { id: "b", label: "'Start', then 8000, then 'End'", correct: false, why: "JavaScript is single-threaded and non-blocking; await does not halt the main thread while waiting." },
      { id: "c", label: "8000, then 'Start', then 'End'", correct: false, why: "The run function executes synchronously up until the await statement, so 'Start' is always printed first." }
    ]
  },
  "js-classes": {
    prompt: "Arrange the lines to define a Cloud class with a constructor and a description method.",
    parsonsFragments: [
      { id: "cs1", text: "class Cloud {", indent: 0 },
      { id: "cs2", text: "  constructor(name) {", indent: 1 },
      { id: "cs3", text: "    this.name = name;", indent: 2 },
      { id: "cs4", text: "  }", indent: 1 },
      { id: "cs5", text: "  describe() { return this.name; }", indent: 1 },
      { id: "cs6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to complete the class constructor and initialize its context.",
    fadedLines: [
      { text: "class Star {", blanks: [] },
      { text: "  ___(name, magnitude) {", blanks: ["constructor"] },
      { text: "    ___.name = name;", blanks: ["this"] },
      { text: "    this.magnitude = magnitude;", blanks: [] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The constructor method automatically runs when instantiating the class, and the this keyword refers to the new object being created.",
    predictCode: "class Cloud {\n  constructor(type) {\n    this.type = type;\n  }\n  getType() {\n    return this.type;\n  }\n}\nclass StormCloud extends Cloud {\n  constructor(type, severity) {\n    super(type);\n    this.severity = severity;\n  }\n  getType() {\n    return 'Stormy ' + super.getType();\n  }\n}\nconst nimbus = new StormCloud('cumulus', 'high');\nconsole.log(nimbus.getType());",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Stormy cumulus", correct: true, why: "The subclass overrides getType() but successfully invokes the parent version with super.getType() to access this.type." },
      { id: "b", label: "Stormy undefined", correct: false, why: "The parent constructor is successfully run via super(type) in the subclass, meaning this.type is correctly set to 'cumulus'." },
      { id: "c", label: "Error", correct: false, why: "This code is fully valid JavaScript class syntax demonstrating standard prototype inheritance and method overriding." }
    ]
  },
  "js-error-handling": {
    prompt: "Arrange the lines to throw an error if the sky is overcast and log the error message in the catch block.",
    parsonsFragments: [
      { id: "eh1", text: "try {", indent: 0 },
      { id: "eh2", text: "  if (clouds > 50) throw new Error('Overcast');", indent: 1 },
      { id: "eh3", text: "  console.log('Clear');", indent: 1 },
      { id: "eh4", text: "} catch (err) {", indent: 0 },
      { id: "eh5", text: "  console.log(err.message);", indent: 1 },
      { id: "eh6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to raise a new error when the star count is invalid.",
    fadedLines: [
      { text: "function estimateStars(count) {", blanks: [] },
      { text: "  if (count < 0) {", blanks: [] },
      { text: "    ___ ___ Error('Invalid count');", blanks: ["throw", "new"] },
      { text: "  }", blanks: [] },
      { text: "}", blanks: [] },
    ],
    fadedExplain: "The throw statement generates user-defined exceptions, and new constructs an instance of the built-in Error object.",
    predictCode: "const analyzeWeather = () => {\n  try {\n    console.log('Trying');\n    throw new Error('Storm');\n    console.log('Sunny');\n  } catch (err) {\n    console.log(err.message);\n  } finally {\n    console.log('Done');\n  }\n};\nanalyzeWeather();",
    predictQuestion: "What order of messages is printed to the console?",
    predictOptions: [
      { id: "a", label: "'Trying', then 'Storm', then 'Done'", correct: true, why: "The error halts the try block, triggers the catch block to print 'Storm', and the finally block runs last." },
      { id: "b", label: "'Trying', then 'Storm'", correct: false, why: "This options omits 'Done' from the finally block, which always executes." },
      { id: "c", label: "'Trying', then 'Sunny', then 'Done'", correct: false, why: "Throwing an error immediately jumps to the catch block, meaning code after the throw is never reached." }
    ]
  },
  "js-array-reduce": {
    prompt: "Arrange the lines to calculate the sum of an array using the reduce method.",
    parsonsFragments: [
      { id: "ar1", text: "const stars = [1, 2, 3];", indent: 0 },
      { id: "ar2", text: "const total = stars.reduce((sum, current) => {", indent: 0 },
      { id: "ar3", text: "  return sum + current;", indent: 1 },
      { id: "ar4", text: "}, 0);", indent: 0 },
      { id: "ar5", text: "console.log(total);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to accumulate the array items starting from an initial value of 0.",
    fadedLines: [
      { text: "const clouds = [10, 20, 30];", blanks: [] },
      { text: "const total = clouds.___( (acc, curr) => acc + curr, ___);", blanks: ["reduce", "0"] },
    ],
    fadedExplain: "The reduce method loops through an array, executing the callback to combine the accumulator (acc) with the current item (curr), starting from the initial value.",
    predictCode: "const starMag = [\n  { name: 'Vega', mag: 0 },\n  { name: 'Polaris', mag: 2 }\n];\nconst result = starMag.reduce((acc, star) => {\n  return acc + star.mag;\n}, 10);\nconsole.log(result);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "12", correct: true, why: "The accumulator starts at 10. The reduce method then adds Vega's mag (0) and Polaris's mag (2), summing up to 12." },
      { id: "b", label: "2", correct: false, why: "This is the sum of magnitudes without adding the initial value of 10." },
      { id: "c", label: "Error", correct: false, why: "Accumulating object properties while starting from a numeric initial value is a common and correct pattern." }
    ]
  },
  "js-metaprogramming": {
    prompt: "Arrange the lines to create a Proxy that intercepts property access and returns a fallback value for missing properties.",
    parsonsFragments: [
      { id: "jmp1", text: "const handler = {", indent: 0 },
      { id: "jmp2", text: "  get(target, prop) {", indent: 1 },
      { id: "jmp3", text: "    return prop in target ? target[prop] : 'unseen star';", indent: 2 },
      { id: "jmp4", text: "  }", indent: 1 },
      { id: "jmp5", text: "};", indent: 0 },
      { id: "jmp6", text: "const proxy = new Proxy({ vega: 'bright' }, handler);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a get trap on the handler and instantiate the Proxy.",
    fadedLines: [
      { text: "const handler = {", blanks: [] },
      { text: "  ___(target, prop) { return target[prop] || 'clear'; }", blanks: ["get"] },
      { text: "};", blanks: [] },
      { text: "const proxy = new ___({ sky: 'blue' }, handler);", blanks: ["Proxy"] },
    ],
    fadedExplain: "The get trap intercepts property access on the target object, and the Proxy constructor wraps the target with the handler.",
    predictCode: "const sky = { clouds: 5 };\nconst handler = {\n  get(target, prop) {\n    return prop in target ? target[prop] * 2 : 0;\n  }\n};\nconst proxy = new Proxy(sky, handler);\nconsole.log(proxy.clouds + proxy.stars);",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "10", correct: true, why: "The proxy get trap doubles the value of clouds to 10, and returns 0 for the missing stars property. 10 + 0 is 10." },
      { id: "b", label: "5", correct: false, why: "The get trap doubles existing properties, so proxy.clouds is 10, not 5." },
      { id: "c", label: "NaN", correct: false, why: "Since the proxy returns 0 instead of undefined for missing properties, the mathematical addition does not produce NaN." }
    ]
  },
  "js-concurrency": {
    prompt: "Arrange the lines to fetch multiple star profiles in parallel and log the final results array.",
    parsonsFragments: [
      { id: "jco1", text: "const fetchStar = async (name) => ({ name, status: 'shining' });", indent: 0 },
      { id: "jco2", text: "const promises = ['Vega', 'Altair'].map(fetchStar);", indent: 0 },
      { id: "jco3", text: "const results = await Promise.all(promises);", indent: 0 },
      { id: "jco4", text: "console.log(results);", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to wait for both resolve operations to complete in parallel.",
    fadedLines: [
      { text: "const loadSky = async () => {", blanks: [] },
      { text: "  const p1 = Promise.resolve('clouds');", blanks: [] },
      { text: "  return ___ Promise.___([p1, Promise.resolve('stars')]);", blanks: ["await", "all"] },
      { text: "};", blanks: [] },
    ],
    fadedExplain: "We use the await keyword to pause execution until the promise resolves, and Promise.all to wait for multiple promises in parallel.",
    predictCode: "const p1 = Promise.resolve('star');\nconst p2 = Promise.reject('cloud error');\nPromise.all([p1, p2])\n  .then(res => console.log('success'))\n  .catch(err => console.log(err));",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "success", correct: false, why: "Since one of the input promises rejects, Promise.all will reject and execute the catch block." },
      { id: "b", label: "cloud error", correct: true, why: "Promise.all fails fast. If any input promise rejects, the entire operation rejects with that error." },
      { id: "c", label: "[ 'star', undefined ]", correct: false, why: "Promise.all does not return partial success arrays if a rejection occurs." }
    ]
  },
  "js-internals": {
    prompt: "Arrange the lines so the program logs the sky, then a cloud via a microtask, and finally a star via a macrotask.",
    parsonsFragments: [
      { id: "jin1", text: "console.log('sky');", indent: 0 },
      { id: "jin2", text: "setTimeout(() => console.log('star'), 0);", indent: 0 },
      { id: "jin3", text: "Promise.resolve().then(() => {", indent: 0 },
      { id: "jin4", text: "  console.log('cloud');", indent: 1 },
      { id: "jin5", text: "});", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to schedule a macrotask and a microtask.",
    fadedLines: [
      { text: "___(() => console.log('macro'), 0);", blanks: ["setTimeout"] },
      { text: "___(() => console.log('micro'));", blanks: ["queueMicrotask"] },
    ],
    fadedExplain: "setTimeout schedules a macrotask on the event loop, while queueMicrotask schedules a microtask to be run immediately after the current script finishes.",
    predictCode: "console.log('sky');\nsetTimeout(() => console.log('star'), 0);\nPromise.resolve().then(() => console.log('cloud'));\nconsole.log('moon');",
    predictQuestion: "In what order are the messages printed?",
    predictOptions: [
      { id: "a", label: "sky, moon, cloud, star", correct: true, why: "sky and moon are synchronous and print first. The microtask queue prints cloud next, followed by the macrotask queue printing star." },
      { id: "b", label: "sky, cloud, moon, star", correct: false, why: "The Promise callback is asynchronous and must wait until all synchronous code (including moon) has executed." },
      { id: "c", label: "sky, moon, star, cloud", correct: false, why: "Microtasks have higher priority than macrotasks, so cloud runs before the setTimeout callback prints star." }
    ]
  },
};
