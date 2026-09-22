import type { PracticeDataset } from "@/content/types";

export const pythonPractice: Record<string, PracticeDataset> = {
  functions: {
    prompt: "Arrange the lines to define a greeting function and call it.",
    parsonsFragments: [
      { id: "fn1", text: "def greet(name):", indent: 0 },
      { id: "fn2", text: 'return "hi " + name', indent: 1 },
      { id: "fn3", text: 'print(greet("Nova"))', indent: 0 },
    ],
    fadedPrompt: "Fill the blanks to define a function that squares a number.",
    fadedLines: [
      { text: "___ square(n):", blanks: ["def"] },
      { text: "    ___ n * n", blanks: ["return"] },
    ],
    fadedExplain: "`def` starts a function definition and `return` hands the result back.",
    predictCode: 'def shout(word):\n    return word.upper()\n\nshout("quiet")\nprint(shout("loud"))',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "LOUD", correct: true, why: "The first call's result is thrown away; only the second is printed." },
      { id: "b", label: "QUIET\nLOUD", correct: false, why: "Returning a value does not print it. Only print() shows output." },
      { id: "c", label: "loud", correct: false, why: "shout returns the word in capitals." },
    ],
  },
  loops: {
    prompt: "Arrange the lines so the program greets every cloud in the sky.",
    parsonsFragments: [
      { id: "p1", text: 'sky = ["cumulus", "cirrus", "stratus"]', indent: 0 },
      { id: "p2", text: "for cloud in sky:", indent: 0 },
      { id: "p3", text: 'print("hello,", cloud)', indent: 1 },
    ],
    fadedPrompt: "Fill the blanks so the loop hops exactly 4 times.",
    fadedLines: [
      { text: "___ hop in range(___):", blanks: ["for", "4"] },
      { text: '    print("hop", hop)', blanks: [] },
    ],
    fadedExplain: "for starts the loop and range(4) counts 0, 1, 2, 3 - four hops.",
    predictCode: 'sky = ["wispy", "puffy"]\nfor cloud in sky:\n    print(cloud)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "wispy\npuffy", correct: true, why: "The loop visits each item in order and prints it." },
      { id: "b", label: "sky\nsky", correct: false, why: "cloud takes the items of sky, not the word sky." },
      { id: "c", label: "wispy puffy", correct: false, why: "Each print() call starts a new line." },
    ],
  },
  variables: {
    prompt: "Arrange the lines to swap the values of x and y (using a temporary variable temp).",
    parsonsFragments: [
      { id: "v1", text: "temp = x", indent: 0 },
      { id: "v2", text: "x = y", indent: 0 },
      { id: "v3", text: "y = temp", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to assign the text 'dreamy' to the variable mood.",
    fadedLines: [
      { text: "mood ___ 'dreamy'", blanks: ["="] },
      { text: "print(mood)", blanks: [] },
    ],
    fadedExplain: "In Python, the = operator assigns the value on the right to the variable on the left.",
    predictCode: 'x = 10\ny = 20\nx = y\nprint(x)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "10", correct: false, why: "x was re-assigned to the value of y." },
      { id: "b", label: "20", correct: true, why: "x now holds 20 because of the assignment x = y." },
      { id: "c", label: "30", correct: false, why: "Assignment replaces the value, it does not add them." },
    ],
  },
  strings: {
    prompt: "Arrange the lines to print 'starry night' by combining two variables.",
    parsonsFragments: [
      { id: "s1", text: "a = 'starry'", indent: 0 },
      { id: "s2", text: "b = 'night'", indent: 0 },
      { id: "s3", text: "print(a + ' ' + b)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to print the length of the word 'dreamcode'.",
    fadedLines: [
      { text: "print(___('dreamcode'))", blanks: ["len"] },
    ],
    fadedExplain: "The len() function calculates the number of characters in a string.",
    predictCode: "print('cloud' * 3)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "cloudcloudcloud", correct: true, why: "The * operator repeats the string 3 times." },
      { id: "b", label: "cloud 3", correct: false, why: "* repeats, it does not print the number." },
      { id: "c", label: "Error", correct: false, why: "Multiplying a string by an integer is valid in Python." },
    ]
  },
  lists: {
    prompt: "Arrange the lines to append 'cirrus' to the clouds list and print it.",
    parsonsFragments: [
      { id: "l1", text: "clouds = ['cumulus', 'stratus']", indent: 0 },
      { id: "l2", text: "clouds.append('cirrus')", indent: 0 },
      { id: "l3", text: "print(clouds)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to print the first cloud in the list.",
    fadedLines: [
      { text: "clouds = ['cumulus', 'stratus', 'cirrus']", blanks: [] },
      { text: "print(clouds[___])", blanks: ["0"] },
    ],
    fadedExplain: "Lists are 0-indexed, so index 0 retrieves the very first element.",
    predictCode: "items = [10, 20, 30]\nprint(len(items))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "len() counts the number of items in the list." },
      { id: "b", label: "2", correct: false, why: "Lists have 3 items, even though the max index is 2." },
      { id: "c", label: "30", correct: false, why: "It prints the length, not the last item." },
    ],
  },
  dictionaries: {
    prompt: "Arrange the lines to create a dictionary representing a star and print its name.",
    parsonsFragments: [
      { id: "d1", text: "star = {", indent: 0 },
      { id: "d2", text: "  'name': 'Vega',", indent: 1 },
      { id: "d3", text: "  'mag': 0.03", indent: 1 },
      { id: "d4", text: "}", indent: 0 },
      { id: "d5", text: "print(star['name'])", indent: 0 },
    ],
    fadedPrompt: "Fill in the blank to retrieve the altitude of a cloud.",
    fadedLines: [
      { text: "cloud = {'shape': 'wispy', 'altitude': 5000}", blanks: [] },
      { text: "print(cloud[___])", blanks: ["'altitude'"] },
    ],
    fadedExplain: "Keys in dictionaries are strings; you must wrap the key name in quotes.",
    predictCode: "data = {'x': 10}\ndata['y'] = 20\nprint(len(data))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "1", correct: false, why: "y was added to the dictionary, making the length 2." },
      { id: "b", label: "2", correct: true, why: "The dictionary has two keys: 'x' and 'y'." },
      { id: "c", label: "Error", correct: false, why: "Adding keys dynamically is completely valid in Python." },
    ],
  },
  comparisons: {
    prompt: "Arrange the lines to check if altitude is higher than 4000 and lower than or equal to 1000, then print both results.",
    parsonsFragments: [
      { id: "cp1", text: "altitude = 4500", indent: 0 },
      { id: "cp2", text: "is_high = altitude > 4000", indent: 0 },
      { id: "cp3", text: "is_low = altitude <= 1000", indent: 0 },
      { id: "cp4", text: "print(is_high)", indent: 0 },
      { id: "cp5", text: "print(is_low)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to check if the count of stars is exactly 10 and if the sky is not clear.",
    fadedLines: [
      { text: "stars = 10", blanks: [] },
      { text: "sky_state = 'cloudy'", blanks: [] },
      { text: "is_ten = stars ___ 10", blanks: ["=="] },
      { text: "not_clear = sky_state ___ 'clear'", blanks: ["!="] },
    ],
    fadedExplain: "Use == to compare for equality, and != to check if two values are not equal.",
    predictCode: "cloud_count = 5\nstar_count = 12\nresult = cloud_count <= star_count\nprint(result)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True", correct: true, why: "5 is less than or equal to 12, so cloud_count <= star_count evaluates to True." },
      { id: "b", label: "False", correct: false, why: "The <= operator means less than or equal to, and 5 is indeed less than 12." },
      { id: "c", label: "Error", correct: false, why: "Comparing two integer variables using <= is perfectly valid Python." }
    ]
  },
  "if-else": {
    prompt: "Arrange the lines to check if the sky is stormy and set stay_home accordingly.",
    parsonsFragments: [
      { id: "ie1", text: "sky_status = 'stormy'", indent: 0 },
      { id: "ie2", text: "if sky_status == 'stormy':", indent: 0 },
      { id: "ie3", text: "    stay_home = True", indent: 1 },
      { id: "ie4", text: "else:", indent: 0 },
      { id: "ie5", text: "    stay_home = False", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to complete this if/else block that checks if there are clouds in the sky.",
    fadedLines: [
      { text: "has_clouds = True", blanks: [] },
      { text: "___ has_clouds:", blanks: ["if"] },
      { text: "    print('Sky is cloudy')", blanks: [] },
      { text: "___:", blanks: ["else"] },
      { text: "    print('Sky is clear')", blanks: [] },
    ],
    fadedExplain: "The if keyword starts a conditional check, and else covers the case where the condition is False.",
    predictCode: "clouds = 3\nif clouds > 5:\n    print('Many clouds')\nelse:\n    print('Few clouds')",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "Many clouds", correct: false, why: "The condition clouds > 5 evaluates to False because 3 is not greater than 5." },
      { id: "b", label: "Few clouds", correct: true, why: "Since 3 is not greater than 5, the else block runs and prints 'Few clouds'." },
      { id: "c", label: "Nothing is printed", correct: false, why: "One of the two blocks must execute because the condition is either True or False." }
    ]
  },
  "elif-chains": {
    prompt: "Arrange the lines to evaluate the sky view based on star count.",
    parsonsFragments: [
      { id: "ec1", text: "if stars > 100:", indent: 0 },
      { id: "ec2", text: "    sky_view = 'superb'", indent: 1 },
      { id: "ec3", text: "elif stars > 50:", indent: 0 },
      { id: "ec4", text: "    sky_view = 'good'", indent: 1 },
      { id: "ec5", text: "else:", indent: 0 },
      { id: "ec6", text: "    sky_view = 'poor'", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to complete the conditional chain.",
    fadedLines: [
      { text: "if brightness > 80:", blanks: [] },
      { text: "    sky_type = 'bright'", blanks: [] },
      { text: "___ brightness > 30:", blanks: ["elif"] },
      { text: "    sky_type = 'dim'", blanks: [] },
      { text: "___:", blanks: ["else"] },
    ],
    fadedExplain: "Python uses elif for additional conditional checks, and else for the final fallback case.",
    predictCode: "cloud_height = 6000\nif cloud_height > 10000:\n    category = 'high'\nelif cloud_height > 5000:\n    category = 'mid'\nelse:\n    category = 'low'\nprint(category)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "high", correct: false, why: "6000 is not greater than 10000, so the first condition is False." },
      { id: "b", label: "mid", correct: true, why: "6000 is not greater than 10000, but it is greater than 5000, so the elif block runs." },
      { id: "c", label: "low", correct: false, why: "The elif condition was True, so the else block is skipped." }
    ]
  },
  "logical-operators": {
    prompt: "Arrange the lines to determine if you can see stars tonight.",
    parsonsFragments: [
      { id: "lo1", text: "is_clear = True", indent: 0 },
      { id: "lo2", text: "star_count = 80", indent: 0 },
      { id: "lo3", text: "can_see_stars = is_clear and star_count > 50", indent: 0 },
      { id: "lo4", text: "print(can_see_stars)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to check if the sky is cloudy or if it is currently raining, and then invert the result using the not operator.",
    fadedLines: [
      { text: "is_cloudy = False", blanks: [] },
      { text: "is_raining = True", blanks: [] },
      { text: "is_bad_weather = is_cloudy ___ is_raining", blanks: ["or"] },
      { text: "is_good_weather = ___ is_bad_weather", blanks: ["not"] },
    ],
    fadedExplain: "The or operator returns True if at least one operand is True. The not operator inverts the boolean value.",
    predictCode: "has_sun = True\nhas_clouds = False\nshow_rainbow = has_sun and not has_clouds\nprint(show_rainbow)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True", correct: true, why: "has_sun is True and not has_clouds is also True (not False is True). True and True is True." },
      { id: "b", label: "False", correct: false, why: "Both has_sun and not has_clouds evaluate to True, so the overall condition evaluates to True." },
      { id: "c", label: "Error", correct: false, why: "Using and and not in a boolean expression is valid in Python." }
    ]
  },
  "nested-conditions": {
    prompt: "Arrange the lines to determine how many stars are visible based on whether it is night and if there are clouds.",
    parsonsFragments: [
      { id: "nc1", text: "if is_night:", indent: 0 },
      { id: "nc2", text: "    if has_clouds:", indent: 1 },
      { id: "nc3", text: "        stars_visible = 0", indent: 2 },
      { id: "nc4", text: "    else:", indent: 1 },
      { id: "nc5", text: "        stars_visible = 100", indent: 2 },
    ],
    fadedPrompt: "Fill in the blanks to complete the nested conditional statement.",
    fadedLines: [
      { text: "sky_clear = True", blanks: [] },
      { text: "is_day = False", blanks: [] },
      { text: "if sky_clear:", blanks: [] },
      { text: "    ___ is_day:", blanks: ["if"] },
      { text: "        message = 'Sunny day'", blanks: [] },
      { text: "    ___:", blanks: ["else"] },
    ],
    fadedExplain: "A nested if statement is placed inside another if statement to perform secondary checks.",
    predictCode: "is_raining = True\nhas_umbrella = False\nif is_raining:\n    if has_umbrella:\n        status = 'dry'\n    else:\n        status = 'wet'\nelse:\n    status = 'fine'\nprint(status)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "dry", correct: false, why: "Since is_raining is True, the outer block executes. However, has_umbrella is False, so status is set to 'wet'." },
      { id: "b", label: "wet", correct: true, why: "The outer condition is True, but the nested condition has_umbrella is False, leading to the nested else block." },
      { id: "c", label: "fine", correct: false, why: "The outer else block is not executed because is_raining is True." }
    ]
  },
  "for-over-range": {
    prompt: "Arrange the lines to count stars by adding 2 stars in each of the 5 iterations.",
    parsonsFragments: [
      { id: "fr1", text: "total_stars = 0", indent: 0 },
      { id: "fr2", text: "for i in range(5):", indent: 0 },
      { id: "fr3", text: "    total_stars += 2", indent: 1 },
      { id: "fr4", text: "print(total_stars)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to write a loop that prints the numbers 1, 2, and 3.",
    fadedLines: [
      { text: "___ num in range(1, ___):", blanks: ["for", "4"] },
      { text: "    print('counting:', num)", blanks: [] },
    ],
    fadedExplain: "The range(1, 4) function generates numbers starting at 1 and ending just before 4 (1, 2, 3).",
    predictCode: "sum_val = 0\nfor i in range(2, 5):\n    sum_val += i\nprint(sum_val)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "9", correct: true, why: "range(2, 5) produces 2, 3, and 4. The sum is 2 + 3 + 4 = 9." },
      { id: "b", label: "14", correct: false, why: "range(2, 5) does not include 5, so it only adds 2, 3, and 4." },
      { id: "c", label: "5", correct: false, why: "The loop iterates three times, adding 2, 3, and then 4 to sum_val." }
    ]
  },
  "for-over-collections": {
    prompt: "Arrange the lines to print each star's designation in the constellation list.",
    parsonsFragments: [
      { id: "fc1", text: "constellation = ['alpha', 'beta', 'gamma']", indent: 0 },
      { id: "fc2", text: "for star in constellation:", indent: 0 },
      { id: "fc3", text: "    print('bright:', star)", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to loop through the dictionary keys representing cloud levels and print their heights.",
    fadedLines: [
      { text: "clouds = {'low': 1000, 'mid': 5000, 'high': 10000}", blanks: [] },
      { text: "___ level in clouds:", blanks: ["for"] },
      { text: "    print(level, 'is at', clouds[___], 'meters')", blanks: ["level"] },
    ],
    fadedExplain: "Looping over a dictionary iterates through its keys. You can retrieve each value using the key index clouds[level].",
    predictCode: "sky_objects = ['star', 'cloud', 'planet']\ncount = 0\nfor obj in sky_objects:\n    count += len(obj)\nprint(count)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: false, why: "The code adds the length of each string, not the number of items in the list." },
      { id: "b", label: "15", correct: true, why: "The lengths of 'star', 'cloud', and 'planet' are 4, 5, and 6 respectively. 4 + 5 + 6 = 15." },
      { id: "c", label: "Error", correct: false, why: "Iterating over a list of strings and calculating their lengths using len() is valid." }
    ]
  },
  "while-loops": {
    prompt: "Arrange the lines to increase altitude by 1000 on each iteration until it reaches or exceeds 4000.",
    parsonsFragments: [
      { id: "wl1", text: "altitude = 1000", indent: 0 },
      { id: "wl2", text: "while altitude < 4000:", indent: 0 },
      { id: "wl3", text: "    altitude += 1000", indent: 1 },
      { id: "wl4", text: "print(altitude)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to count down the remaining stars from 3 to 1.",
    fadedLines: [
      { text: "stars = 3", blanks: [] },
      { text: "___ stars > 0:", blanks: ["while"] },
      { text: "    print(stars)", blanks: [] },
      { text: "    stars ___ 1", blanks: ["-="] },
    ],
    fadedExplain: "A while loop runs as long as the condition is True. Subtracting 1 from stars on each iteration ensures the loop terminates.",
    predictCode: "count = 1\nwhile count < 4:\n    count *= 2\nprint(count)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: true, why: "First iteration: count becomes 2. Second iteration: count becomes 4. Since 4 is not less than 4, the loop terminates and prints 4." },
      { id: "b", label: "3", correct: false, why: "The variable count starts at 1, doubles to 2, then doubles to 4. It does not increment by 1." },
      { id: "c", label: "8", correct: false, why: "The loop terminates immediately when count reaches 4, so it does not multiply by 2 again." }
    ]
  },
  "break-continue": {
    prompt: "Arrange the lines to print altitudes but stop the loop completely when the altitude is 3000.",
    parsonsFragments: [
      { id: "bc1", text: "for altitude in [1000, 2000, 3000, 4000]:", indent: 0 },
      { id: "bc2", text: "    if altitude == 3000:", indent: 1 },
      { id: "bc3", text: "        break", indent: 2 },
      { id: "bc4", text: "    print(altitude)", indent: 1 },
    ],
    fadedPrompt: "Fill in the blank to skip printing the cloud if its type is 'stormy', but continue iterating over the rest.",
    fadedLines: [
      { text: "clouds = ['wispy', 'stormy', 'puffy']", blanks: [] },
      { text: "for cloud in clouds:", blanks: [] },
      { text: "    if cloud == 'stormy':", blanks: [] },
      { text: "        ___", blanks: ["continue"] },
      { text: "    print('cloud:', cloud)", blanks: [] },
    ],
    fadedExplain: "The continue statement skips the rest of the current iteration and jumps directly to the next loop cycle.",
    predictCode: "total = 0\nfor count in [1, 2, 3, 4]:\n    if count == 3:\n        continue\n    if count == 4:\n        break\n    total += count\nprint(total)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "3", correct: true, why: "For count=1, total becomes 1. For count=2, total becomes 3. For count=3, continue skips it. For count=4, break stops the loop. The final total is 3." },
      { id: "b", label: "6", correct: false, why: "The count of 3 is skipped by continue, and 4 is not added because break stops the loop before addition." },
      { id: "c", label: "10", correct: false, why: "The loop does not finish adding all elements because of the continue and break statements." }
    ]
  },
  "nested-loops": {
    prompt: "Arrange the lines to print each constellation paired with stars numbered 1 and 2.",
    parsonsFragments: [
      { id: "nl1", text: "constellations = ['Orion', 'Ursa']", indent: 0 },
      { id: "nl2", text: "for const in constellations:", indent: 0 },
      { id: "nl3", text: "    for star in [1, 2]:", indent: 1 },
      { id: "nl4", text: "        print(const, star)", indent: 2 },
    ],
    fadedPrompt: "Fill in the blanks to complete the nested loop that generates a grid representing coordinates in the sky.",
    fadedLines: [
      { text: "for x in range(2):", blanks: [] },
      { text: "    ___ y in range(2):", blanks: ["for"] },
      { text: "        print('Coord:', x, ___)", blanks: ["y"] },
    ],
    fadedExplain: "Nested loops are loops inside other loops. The inner loop completes all its iterations for every single step of the outer loop.",
    predictCode: "stars = 0\nfor sky in [1, 2]:\n    for cloud in [1, 2, 3]:\n        stars += 1\nprint(stars)",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "5", correct: false, why: "The outer loop runs 2 times and the inner loop runs 3 times for each outer iteration, making the total executions 2 * 3 = 6." },
      { id: "b", label: "6", correct: true, why: "The inner loop adds 1 to stars exactly 3 times for each of the 2 outer loop iterations, resulting in 6." },
      { id: "c", label: "9", correct: false, why: "The loop does not run 3 * 3 times; the outer loop sequence only has 2 elements." }
    ]
  },
  "parameters-arguments": {
    prompt: "Arrange the lines to define a function `track_cloud` with parameters `name` and `speed`, print those values, and call it with arguments `\"Cumulus\"` and `15`.",
    parsonsFragments: [
      { id: "pa1", text: "def track_cloud(name, speed):", indent: 0 },
      { id: "pa2", text: "    print(\"Cloud:\", name)", indent: 1 },
      { id: "pa3", text: "    print(\"Speed:\", speed)", indent: 1 },
      { id: "pa4", text: "track_cloud(\"Cumulus\", 15)", indent: 0 }
    ],
    fadedPrompt: "Fill in the parameter and the argument to complete the star tagging script.",
    fadedLines: [
      { text: "def tag_star(___, brightness):", blanks: ["name"] },
      { text: "    print(name + \" has brightness \" + str(brightness))", blanks: [] },
      { text: "tag_star(\"Vega\", ___)", blanks: ["1.5"] }
    ],
    fadedExplain: "The parameter name receives the string argument \"Vega\", while the brightness parameter receives the numeric argument 1.5.",
    predictCode: "def describe_cloud(color, height):\n    return color + \" cloud at \" + str(height) + \" feet\"\n\nresult = describe_cloud(\"silver\", 5000)\nprint(result)",
    predictQuestion: "What is the output of this Python code?",
    predictOptions: [
      {
        id: "a",
        label: "silver cloud at 5000 feet",
        correct: true,
        why: "The argument 'silver' is assigned to color, and 5000 is assigned to height. The combined string is returned and printed."
      },
      {
        id: "b",
        label: "describe_cloud silver 5000",
        correct: false,
        why: "The function call executes its body and returns the formatted string, it does not output the function name."
      },
      {
        id: "c",
        label: "5000 cloud at silver feet",
        correct: false,
        why: "Arguments are matched to parameters in the order they are passed, so 'silver' maps to color and 5000 maps to height."
      }
    ]
  },
  "return-values": {
    prompt: "Arrange the lines to define a function `get_altitude` that returns `8000` if the cloud type is `\"cirrus\"` and returns `2000` otherwise. Then call it with `\"cirrus\"`. ",
    parsonsFragments: [
      { id: "rv1", text: "def get_altitude(cloud_type):", indent: 0 },
      { id: "rv2", text: "    if cloud_type == \"cirrus\":", indent: 1 },
      { id: "rv3", text: "        return 8000", indent: 2 },
      { id: "rv4", text: "    return 2000", indent: 1 },
      { id: "rv5", text: "height = get_altitude(\"cirrus\")", indent: 0 }
    ],
    fadedPrompt: "Fill in the blanks to return the total star count and assign the function result to a variable.",
    fadedLines: [
      { text: "def calculate_stars(rows, cols):", blanks: [] },
      { text: "    total = rows * cols", blanks: [] },
      { text: "    ___ total", blanks: ["return"] },
      { text: "result = ___(5, 10)", blanks: ["calculate_stars"] }
    ],
    fadedExplain: "The return keyword sends the value of total back to the caller. We call the function calculate_stars and assign its returned value to the result variable.",
    predictCode: "def get_star_color(temperature):\n    if temperature > 10000:\n        return \"blue\"\n    return \"red\"\n\nstar = get_star_color(12000)\nprint(star)",
    predictQuestion: "What is printed when this code runs?",
    predictOptions: [
      {
        id: "a",
        label: "blue",
        correct: true,
        why: "The temperature is 12000, which is greater than 10000. The function executes the first return statement and returns 'blue'."
      },
      {
        id: "b",
        label: "red",
        correct: false,
        why: "The temperature condition is met, so the function returns 'blue' and exits before reaching the return statement for 'red'."
      },
      {
        id: "c",
        label: "None",
        correct: false,
        why: "The function returns a valid string value, so the print statement prints that returned string rather than None."
      }
    ]
  },
  "default-keyword-args": {
    prompt: "Arrange the lines to define a function `create_sky` with default parameters `color=\"blue\"` and `stars=10`. Then call the function, overriding the stars value with a keyword argument of `50`.",
    parsonsFragments: [
      { id: "dk1", text: "def create_sky(color=\"blue\", stars=10):", indent: 0 },
      { id: "dk2", text: "    print(\"Sky color:\", color)", indent: 1 },
      { id: "dk3", text: "    print(\"Stars count:\", stars)", indent: 1 },
      { id: "dk4", text: "create_sky(stars=50)", indent: 0 }
    ],
    fadedPrompt: "Fill in the default value for shape, then call the function specifying the size keyword argument.",
    fadedLines: [
      { text: "def make_cloud(shape=___, size=\"large\"):", blanks: ["\"fluffy\""] },
      { text: "    return shape + \" and \" + size", blanks: [] },
      { text: "sky_cloud = make_cloud(___=\"huge\")", blanks: ["size"] }
    ],
    fadedExplain: "The parameter shape is assigned a default value of 'fluffy'. The function is called by specifying size as a keyword argument with the value 'huge'.",
    predictCode: "def describe_sky(color=\"dark blue\", moon=True):\n    if moon:\n        return color + \" with a moon\"\n    return color + \" and empty\"\n\nresult = describe_sky(moon=False)\nprint(result)",
    predictQuestion: "What is the output of this Python code?",
    predictOptions: [
      {
        id: "a",
        label: "dark blue and empty",
        correct: true,
        why: "The color parameter defaults to 'dark blue' and moon is set to False. This executes the second return block."
      },
      {
        id: "b",
        label: "dark blue with a moon",
        correct: false,
        why: "The moon argument was explicitly set to False, so the first condition if moon is not met."
      },
      {
        id: "c",
        label: "empty",
        correct: false,
        why: "The color parameter defaults to 'dark blue', which is prefixed to the returned string."
      }
    ]
  },
  "variable-scope": {
    prompt: "Arrange the lines to define a global variable `sky_color`, create a function that defines a local variable with the same name, and call that function.",
    parsonsFragments: [
      { id: "vs1", text: "sky_color = \"midnight blue\"", indent: 0 },
      { id: "vs2", text: "def change_sky():", indent: 0 },
      { id: "vs3", text: "    sky_color = \"sunset pink\"", indent: 1 },
      { id: "vs4", text: "    print(\"Inside:\", sky_color)", indent: 1 },
      { id: "vs5", text: "change_sky()", indent: 0 }
    ],
    fadedPrompt: "Fill in the local variable assignment and reference to observe how variable scope functions.",
    fadedLines: [
      { text: "sky_star = \"polaris\"", blanks: [] },
      { text: "def show():", blanks: [] },
      { text: "    sky_star = ___", blanks: ["\"sirius\""] },
      { text: "    print(sky_star)", blanks: [] }
    ],
    fadedExplain: "The variable sky_star inside show is a local variable. Defining it does not affect the global variable of the same name defined outside.",
    predictCode: "cloud_count = 10\n\ndef add_clouds():\n    cloud_count = 5\n    return cloud_count\n\nadd_clouds()\nprint(cloud_count)",
    predictQuestion: "What is printed when this Python code is executed?",
    predictOptions: [
      {
        id: "a",
        label: "10",
        correct: true,
        why: "The assignment cloud_count = 5 inside the function creates a local variable. The global variable remains unchanged at 10."
      },
      {
        id: "b",
        label: "5",
        correct: false,
        why: "The print statement is outside the function scope, so it references the global cloud_count variable, not the local one."
      },
      {
        id: "c",
        label: "15",
        correct: false,
        why: "The global and local variables are in completely separate scopes and are not added together."
      }
    ]
  },
  "compose-functions": {
    prompt: "Arrange the lines to define two functions: one that counts items in a sky list and another that checks if the count is crowded. Then compose them.",
    parsonsFragments: [
      { id: "cf1", text: "def count_stars(sky):", indent: 0 },
      { id: "cf2", text: "    return len(sky)", indent: 1 },
      { id: "cf3", text: "def is_crowded(count):", indent: 0 },
      { id: "cf4", text: "    return count > 5", indent: 1 },
      { id: "cf5", text: "stars = [\"polaris\", \"sirius\", \"vega\"]", indent: 0 },
      { id: "cf6", text: "crowded = is_crowded(count_stars(stars))", indent: 0 }
    ],
    fadedPrompt: "Complete the function composition by nesting the call to add_stars inside another call to add_stars.",
    fadedLines: [
      { text: "def add_stars(n):", blanks: [] },
      { text: "    return n + 5", blanks: [] },
      { text: "total = add_stars(___(10))", blanks: ["add_stars"] }
    ],
    fadedExplain: "The inner call add_stars(10) runs first and evaluates to 15. This result is then passed as the argument to the outer add_stars function call.",
    predictCode: "def add_star(sky):\n    return sky + \" star\"\n\ndef shine(light):\n    return light.upper() + \"!\"\n\nresult = shine(add_star(\"bright\"))\nprint(result)",
    predictQuestion: "What does this code print?",
    predictOptions: [
      {
        id: "a",
        label: "BRIGHT STAR!",
        correct: true,
        why: "The function add_star('bright') runs first, returning 'bright star'. This result is passed to shine, which returns 'BRIGHT STAR!'."
      },
      {
        id: "b",
        label: "bright star!",
        correct: false,
        why: "The shine function calls upper() on the input string, which converts all its characters to uppercase."
      },
      {
        id: "c",
        label: "BRIGHT!",
        correct: false,
        why: "The add_star function appends ' star' to the input first, so that substring is also capitalized by shine."
      }
    ]
  },
  "py-list-comprehensions": {
    prompt: "Arrange the lines to create a list of uppercase star names for stars with names longer than 4 characters.",
    parsonsFragments: [
      { id: "lc1", text: 'stars = ["sirius", "vega", "rigel", "altair"]', indent: 0 },
      { id: "lc2", text: "bright_stars = [", indent: 0 },
      { id: "lc3", text: "s.upper()", indent: 1 },
      { id: "lc4", text: "for s in stars if len(s) > 4", indent: 1 },
      { id: "lc5", text: "]", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to build a list of cloud names that have exactly 5 letters.",
    fadedLines: [
      { text: 'clouds = ["cumulus", "stratus", "cirrus", "fog"]', blanks: [] },
      { text: "five_letter_clouds = [c ___ c ___ clouds ___ len(c) == 5]", blanks: ["for", "in", "if"] },
    ],
    fadedExplain: "We use 'for c in clouds' to loop through the clouds, and 'if len(c) == 5' to filter for 5-letter names.",
    predictCode: 'clouds = ["cumulus", "cirrus", "fog"]\nlengths = [len(c) for c in clouds]\nprint(lengths)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "[7, 6, 3]", correct: true, why: "The list comprehension calculates the length of each cloud name and stores the results in a new list." },
      { id: "b", label: '["cumulus", "cirrus", "fog"]', correct: false, why: "This would be the original list of clouds, not their lengths." },
      { id: "c", label: "[len, len, len]", correct: false, why: "len is a function, but len(c) evaluates to an integer representing the length of the string." },
    ],
  },
  "py-dict-comprehensions": {
    prompt: "Arrange the lines to create a dictionary that maps star names to their character lengths, but only for stars with names shorter than 6 characters.",
    parsonsFragments: [
      { id: "dc1", text: 'stars = ["sirius", "vega", "rigel", "polaris"]', indent: 0 },
      { id: "dc2", text: "star_lengths = {", indent: 0 },
      { id: "dc3", text: "name: len(name)", indent: 1 },
      { id: "dc4", text: "for name in stars", indent: 1 },
      { id: "dc5", text: "if len(name) < 6", indent: 1 },
      { id: "dc6", text: "}", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to create a dictionary mapping cloud names to their uppercase versions.",
    fadedLines: [
      { text: 'clouds = ["cumulus", "cirrus"]', blanks: [] },
      { text: "upper_clouds = {c ___ c.upper() ___ c ___ clouds}", blanks: [":", "for", "in"] },
    ],
    fadedExplain: "A dictionary comprehension uses the key:value syntax, followed by a standard loop over the source list.",
    predictCode: 'stars = {"sirius": 8, "vega": 5, "rigel": 6}\nbright = {k: v for k, v in stars.items() if v > 5}\nprint(bright)',
    predictQuestion: "What is printed by this code?",
    predictOptions: [
      { id: "a", label: "{'sirius': 8, 'rigel': 6}", correct: true, why: "The dictionary comprehension iterates through the key-value pairs of the original dictionary and filters for values strictly greater than 5." },
      { id: "b", label: "{'vega': 5}", correct: false, why: "This would be the result if we filtered for values less than or equal to 5." },
      { id: "c", label: "{'sirius': 8, 'vega': 5, 'rigel': 6}", correct: false, why: "This is the entire original dictionary without any filtering applied." },
    ],
  },
  "py-slicing": {
    prompt: "Arrange the lines to slice the last two elements of the cloud list and print them.",
    parsonsFragments: [
      { id: "sl1", text: 'clouds = ["cirrus", "cumulus", "stratus", "nimbus"]', indent: 0 },
      { id: "sl2", text: "last_two = clouds[-2:]", indent: 0 },
      { id: "sl3", text: "print(last_two)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to slice the string from index 2 up to, but not including, index 7.",
    fadedLines: [
      { text: 'text = "starlight"', blanks: [] },
      { text: "sub = text[___:___]", blanks: ["2", "7"] },
    ],
    fadedExplain: "Slicing syntax uses start:stop, where start is inclusive and stop is exclusive.",
    predictCode: 'sky_colors = ["blue", "pink", "purple", "orange", "gold"]\nsubset = sky_colors[1:4:2]\nprint(subset)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "['pink', 'purple']", correct: false, why: "This would be the slice if the step was 1, up to index 3." },
      { id: "b", label: "['pink', 'orange']", correct: true, why: "Slicing starting at index 1 up to 4 with a step of 2 retrieves indices 1 and 3." },
      { id: "c", label: "['pink', 'purple', 'orange']", correct: false, why: "This would be the slice with a step of 1, i.e., sky_colors[1:4]." },
    ],
  },
  "py-sets-tuples": {
    prompt: "Arrange the lines to create a set of unique cloud types from a list of clouds, then check if 'cirrus' is in that set.",
    parsonsFragments: [
      { id: "st1", text: 'cloud_list = ["cumulus", "cirrus", "cumulus", "stratus"]', indent: 0 },
      { id: "st2", text: "unique_clouds = set(cloud_list)", indent: 0 },
      { id: "st3", text: 'has_cirrus = "cirrus" in unique_clouds', indent: 0 },
      { id: "st4", text: "print(has_cirrus)", indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define an immutable tuple of coordinates representing a star and access its first value.",
    fadedLines: [
      { text: "star_coords = ___10.5, 42.0___", blanks: ["(", ")"] },
      { text: "x_coord = star_coords___0___", blanks: ["[", "]"] },
    ],
    fadedExplain: "Tuples are defined using parentheses, and indexing elements uses square brackets.",
    predictCode: 'clouds = {"cumulus", "stratus"}\nclouds.add("cumulus")\nclouds.add("nimbus")\nprint(len(clouds))',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: false, why: "Sets do not allow duplicate values, so adding 'cumulus' a second time has no effect." },
      { id: "b", label: "3", correct: true, why: "The set starts with 2 elements, 'cumulus' is not duplicated, and 'nimbus' is added, making it 3 elements." },
      { id: "c", label: "2", correct: false, why: "This would be the size if 'nimbus' was not added." },
    ],
  },
  "py-enumerate-zip": {
    prompt: "Arrange the lines to iterate over a list of star names and print each star's position (starting from 1) and its name.",
    parsonsFragments: [
      { id: "ez1", text: 'stars = ["sirius", "vega", "polaris"]', indent: 0 },
      { id: "ez2", text: "for i, star in enumerate(stars, start=1):", indent: 0 },
      { id: "ez3", text: 'print(f"Star {i}: {star}")', indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to pair cloud names with their corresponding altitudes using zip.",
    fadedLines: [
      { text: 'names = ["stratus", "cirrus"]', blanks: [] },
      { text: "altitudes = [1000, 6000]", blanks: [] },
      { text: "for name, alt ___ zip(names, altitudes)___", blanks: ["in", ":"] },
      { text: "    print(name, alt)", blanks: [] },
    ],
    fadedExplain: "The zip function combines parallel iterables, and we loop over it using the 'in' keyword followed by a colon.",
    predictCode: 'names = ["vega", "rigel"]\nbrightness = [1, 2, 3]\nfor name, level in zip(names, brightness):\n    print(name, level)',
    predictQuestion: "How many times does the print statement execute?",
    predictOptions: [
      { id: "a", label: "2", correct: true, why: "zip stops when the shortest input iterable is exhausted, which is the names list with 2 items." },
      { id: "b", label: "3", correct: false, why: "This would assume zip loops until the longest list is finished, but zip is lazy and stops early." },
      { id: "c", label: "5", correct: false, why: "This is the sum of both lists, but zip pairs them instead of concatenating." },
    ],
  },
  "py-exceptions": {
    prompt: "Arrange the lines to safely convert a star's brightness value to an integer, returning 0 if a ValueError occurs.",
    parsonsFragments: [
      { id: "ex1", text: 'brightness_str = "dim"', indent: 0 },
      { id: "ex2", text: "try:", indent: 0 },
      { id: "ex3", text: "val = int(brightness_str)", indent: 1 },
      { id: "ex4", text: "except ValueError:", indent: 0 },
      { id: "ex5", text: "val = 0", indent: 1 },
    ],
    fadedPrompt: "Fill in the blanks to handle a ZeroDivisionError when calculating average cloud density.",
    fadedLines: [
      { text: "___:", blanks: ["try"] },
      { text: "    density = mass / volume", blanks: [] },
      { text: "___ ZeroDivisionError:", blanks: ["except"] },
      { text: "    density = 0", blanks: [] },
    ],
    fadedExplain: "We use 'try' to wrap code that might fail, and 'except' to handle specific errors like ZeroDivisionError.",
    predictCode: 'try:\n    stars = ["sirius", "vega"]\n    selected = stars[2]\nexcept IndexError:\n    selected = "unknown"\nfinally:\n    print("Done")\nprint(selected)',
    predictQuestion: "What is printed when this program is run?",
    predictOptions: [
      { id: "a", label: "unknown\nDone", correct: false, why: "The finally block always runs before control leaves the try-except statement, so 'Done' is printed before the outer print(selected)." },
      { id: "b", label: "Done\nunknown", correct: true, why: "The IndexError triggers the except block, but the finally block executes before the final print statement." },
      { id: "c", label: "IndexError: list index out of range", correct: false, why: "The IndexError is caught by the except block, so the program does not crash with an error trace." },
    ],
  },
  "py-file-handling": {
    prompt: "Arrange the lines to open a file named 'stars.txt' for writing, write 'Sirius' to it, and output a confirmation message.",
    parsonsFragments: [
      { id: "fh1", text: 'with open("stars.txt", "w") as f:', indent: 0 },
      { id: "fh2", text: 'f.write("Sirius\\n")', indent: 1 },
      { id: "fh3", text: 'print("Star saved")', indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to open 'clouds.txt' in read mode and read all its lines.",
    fadedLines: [
      { text: '___ open("clouds.txt", "___") ___ file:', blanks: ["with", "r", "as"] },
      { text: "    lines = file.___()", blanks: ["readlines"] },
    ],
    fadedExplain: "The 'with' statement handles resource closing. 'r' is for reading, 'as' names the file variable, and readlines() reads all lines.",
    predictCode: 'with open("sky.txt", "r") as f:\n    content = f.read()\nprint(f.closed)',
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False", correct: false, why: "The context manager automatically closes the file upon exiting the block, so f.closed is not False." },
      { id: "b", label: "True", correct: true, why: "The with statement acts as a context manager that automatically closes the file object once the block finishes." },
      { id: "c", label: '"Beautiful Clouds"', correct: false, why: "This is the content of the file, but we print f.closed, not content." },
    ],
  },
  "py-oop": {
    prompt: "Arrange the lines to define a Star class with an initializer that sets name and brightness, then create an instance of it.",
    parsonsFragments: [
      { id: "op1", text: "class Star:", indent: 0 },
      { id: "op2", text: "def __init__(self, name, brightness):", indent: 1 },
      { id: "op3", text: "self.name = name", indent: 2 },
      { id: "op4", text: "self.brightness = brightness", indent: 2 },
      { id: "op5", text: 'vega = Star("Vega", 5)', indent: 0 },
    ],
    fadedPrompt: "Fill in the blanks to define a Star class with a name attribute.",
    fadedLines: [
      { text: "class Star:", blanks: [] },
      { text: "    def ___(___, name):", blanks: ["__init__", "self"] },
      { text: "        self.name = name", blanks: [] },
    ],
    fadedExplain: "We define constructors in Python with __init__ and refer to the current instance using self.",
    predictCode: 'class Sky:\n    def __init__(self, color):\n        self.color = color\n    def get_color(self):\n        return self.color\n\nday_sky = Sky("blue")\nprint(day_sky.get_color())',
    predictQuestion: "What is the output of this code?",
    predictOptions: [
      { id: "a", label: "None", correct: false, why: "The get_color method returns self.color, which was initialized to 'blue', not None." },
      { id: "b", label: "blue", correct: true, why: "The instance day_sky is created with the color 'blue', which is returned by get_color() and printed." },
      { id: "c", label: "color", correct: false, why: "self.color holds the value passed to the constructor ('blue'), not the string literal 'color'." },
    ],
  },
  "py-generators": {
    prompt: "Arrange the lines to create a generator that produces numbered star names, allowing the caller to send a new index using a send() call.",
    parsonsFragments: [
      { id: "ge1", text: "def star_generator(limit):", indent: 0 },
      { id: "ge2", text: "    count = 1", indent: 1 },
      { id: "ge3", text: "    while count <= limit:", indent: 1 },
      { id: "ge4", text: "        val = yield f\"Star {count}\"", indent: 2 },
      { id: "ge5", text: "        count = val if val is not None else count + 1", indent: 2 }
    ],
    fadedPrompt: "Fill in the blanks to delegate generator execution to a sub-generator and yield the final returned string.",
    fadedLines: [
      { text: "def stream():", blanks: [] },
      { text: "    ___ [\"star\", \"cloud\"]", blanks: ["yield from"] },
      { text: "    return \"done\"", blanks: [] },
      { text: "def run():", blanks: [] },
      { text: "    result = ___ stream()", blanks: ["yield from"] },
      { text: "    yield result", blanks: [] }
    ],
    fadedExplain: "The yield from expression delegates generator operations to another iterable or generator, and it evaluates to the value returned by that sub-generator.",
    predictCode: "def star_accumulator():\n    total = 0\n    while True:\n        value = yield total\n        if value is None:\n            break\n        total += value\n\ng = star_accumulator()\nprint(next(g), g.send(5), g.send(10))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "0 5 15", correct: true, why: "The first next(g) starts the generator and yields the initial total of 0. Subsequent send() calls resume the generator and add the sent value to the total, returning the new total." },
      { id: "b", label: "5 10 15", correct: false, why: "The first next(g) call returns 0 before any value is sent or accumulated." },
      { id: "c", label: "0 0 5", correct: false, why: "Each send() call updates the total and yields it on the next loop iteration, so the sent values are accumulated." }
    ]
  },
  "py-decorators": {
    prompt: "Arrange the lines to define a basic decorator that prints a message before calling the original function.",
    parsonsFragments: [
      { id: "de1", text: "def star_log(func):", indent: 0 },
      { id: "de2", text: "    def wrapper(*args, **kwargs):", indent: 1 },
      { id: "de3", text: "        print(\"Star scan started\")", indent: 2 },
      { id: "de4", text: "        return func(*args, **kwargs)", indent: 2 },
      { id: "de5", text: "    return wrapper", indent: 1 }
    ],
    fadedPrompt: "Fill in the blanks to use wraps to preserve the original function metadata on the decorated wrapper.",
    fadedLines: [
      { text: "from functools import wraps", blanks: [] },
      { text: "def cloud_decorator(func):", blanks: [] },
      { text: "    @___(func)", blanks: ["wraps"] },
      { text: "    def ___():", blanks: ["wrapper"] },
      { text: "        return func().upper()", blanks: [] },
      { text: "    return wrapper", blanks: [] }
    ],
    fadedExplain: "functools.wraps is a decorator helper that copies metadata such as the function name and docstring from the original function to the wrapper.",
    predictCode: "class StarCache:\n    def __init__(self, func):\n        self.func = func\n        self.cache = {}\n    def __call__(self, name):\n        if name not in self.cache:\n            self.cache[name] = self.func(name)\n        return self.cache[name]\n\n@StarCache\ndef get_star(name):\n    return f\"Star:{name}\"\n\ng1 = get_star(\"Sirius\")\ng2 = get_star(\"Sirius\")\nprint(g1 == g2, len(get_star.cache))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "True 1", correct: true, why: "The class-based decorator caches the result of the call. The second call uses the cached result, so the cache dictionary has a single entry, and both return values are equal." },
      { id: "b", label: "True 2", correct: false, why: "The second call returns from the cache instead of computing it again, so no second item is added." },
      { id: "c", label: "False 1", correct: false, why: "Both variables reference the exact same string from the cache, so the equality check is True." }
    ]
  },
  "py-metaprogramming": {
    prompt: "Arrange the lines to create a metaclass that injects a default galaxy attribute into all classes that use it.",
    parsonsFragments: [
      { id: "mp1", text: "class StarMeta(type):", indent: 0 },
      { id: "mp2", text: "    def __new__(cls, name, bases, attrs):", indent: 1 },
      { id: "mp3", text: "        attrs[\"galaxy\"] = \"Milky Way\"", indent: 2 },
      { id: "mp4", text: "        return super().__new__(cls, name, bases, attrs)", indent: 2 }
    ],
    fadedPrompt: "Fill in the blanks to complete a base class that automatically registers all its subclasses using init_subclass.",
    fadedLines: [
      { text: "class CloudRegistry:", blanks: [] },
      { text: "    subclasses = []", blanks: [] },
      { text: "    def __init_subclass__(cls, **kwargs):", blanks: [] },
      { text: "        super().___(**kwargs)", blanks: ["__init_subclass__"] },
      { text: "        cls.subclasses.append(cls)", blanks: [] }
    ],
    fadedExplain: "The __init_subclass__ method is called on the parent class whenever a subclass is created, allowing lightweight registration or validation.",
    predictCode: "class StarMeta(type):\n    def __new__(cls, name, bases, attrs):\n        new_attrs = {}\n        for key, val in attrs.items():\n            if not key.startswith(\"__\"):\n                new_attrs[key.upper()] = val\n            else:\n                new_attrs[key] = val\n        return super().__new__(cls, name, bases, new_attrs)\n\nclass Nebula(metaclass=StarMeta):\n    star_name = \"Orion\"\n\nn = Nebula()\nprint(hasattr(n, \"star_name\"), hasattr(n, \"STAR_NAME\"))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False True", correct: true, why: "The metaclass intercepts class creation and capitalizes all attributes that do not start with a double underscore, leaving star_name renamed to STAR_NAME." },
      { id: "b", label: "True False", correct: false, why: "The attribute star_name was renamed by the metaclass during class creation, so it does not exist under its original name." },
      { id: "c", label: "True True", correct: false, why: "The metaclass replaces the original lower-case attribute with the upper-case version, rather than duplicating it." }
    ]
  },
  "py-concurrency": {
    prompt: "Arrange the lines to create a coroutine that runs two tasks concurrently and returns their aggregated results.",
    parsonsFragments: [
      { id: "co1", text: "async def scan_sky():", indent: 0 },
      { id: "co2", text: "    tasks = [fetch(\"stars\"), fetch(\"clouds\")]", indent: 1 },
      { id: "co3", text: "    results = await asyncio.gather(*tasks)", indent: 1 },
      { id: "co4", text: "    return results", indent: 1 }
    ],
    fadedPrompt: "Fill in the blanks to protect a block of code using an asynchronous context manager lock.",
    fadedLines: [
      { text: "async def safe_write(lock):", blanks: [] },
      { text: "    ___ with lock:", blanks: ["async"] },
      { text: "        ___ asyncio.sleep(0.01)", blanks: ["await"] }
    ],
    fadedExplain: "Use async with to acquire and release locks or manage resources in an asynchronous context.",
    predictCode: "import asyncio\n\nasync def star_task(name, delay):\n    await asyncio.sleep(delay)\n    return name\n\nasync def main():\n    t1 = asyncio.create_task(star_task(\"Sirius\", 0.2))\n    t2 = asyncio.create_task(star_task(\"Vega\", 0.1))\n    await asyncio.sleep(0.15)\n    print(t1.done(), t2.done())\n\nasyncio.run(main())",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "False True", correct: true, why: "The sleep(0.15) call yields control to the event loop. The task that requires 0.1 seconds (t2) completes, while the task requiring 0.2 seconds (t1) is still running." },
      { id: "b", label: "True True", correct: false, why: "At 0.15 seconds, the task taking 0.2 seconds (t1) has not finished yet." },
      { id: "c", label: "False False", correct: false, why: "The task taking 0.1 seconds (t2) is finished because 0.15 seconds have passed." }
    ]
  },
  "py-internals": {
    prompt: "Arrange the lines to access the code object of a function and inspect its local variable names.",
    parsonsFragments: [
      { id: "pi1", text: "def star_fn(x):", indent: 0 },
      { id: "pi2", text: "    return x + 1", indent: 1 },
      { id: "pi3", text: "code = star_fn.__code__", indent: 0 },
      { id: "pi4", text: "print(code.co_varnames)", indent: 0 }
    ],
    fadedPrompt: "Fill in the blanks to intern a string so that both variables reference the exact same object in CPython's memory.",
    fadedLines: [
      { text: "import sys", blanks: [] },
      { text: "a = sys.___(\"sky_limit\")", blanks: ["intern"] },
      { text: "b = sys.intern(\"sky_limit\")", blanks: [] },
      { text: "result = a ___ b", blanks: ["is"] }
    ],
    fadedExplain: "sys.intern registers a string in Python's internal string table, ensuring that identical interned strings share the same memory location, allowing fast identity checks using is.",
    predictCode: "import sys\n\na = [1, 2, 3]\nb = a\nc = [a]\nprint(sys.getrefcount(a))",
    predictQuestion: "What does this program print?",
    predictOptions: [
      { id: "a", label: "4", correct: true, why: "The reference count of the list is 4: one from a, one from b, one from the nested list c, and one temporary reference passed to the sys.getrefcount function." },
      { id: "b", label: "3", correct: false, why: "The sys.getrefcount function itself creates a temporary reference during evaluation, which increases the count by 1." },
      { id: "c", label: "2", correct: false, why: "Both b and the nested list c hold references to the list, in addition to a." }
    ]
  },
};
