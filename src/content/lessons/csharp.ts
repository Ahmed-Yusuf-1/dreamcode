import type { Lesson } from "@/content/types";
import { DOT_LAVENDER, DOT_MINT, DOT_PINK } from "@/content/dots";

export const csharpLessons: Lesson[] = [
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
      "C# code lives inside **classes** and **methods**. A program starts in a special method called **Main**. To print a line of text, you call **Console.WriteLine**. Newer project templates let you skip writing Main by using top-level statements, but the compiler still creates it for you behind the scenes.",
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
        prompt: "Which namespace does List<T> live in?",
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
        prompt: "Which keyword marks a base class method, one that already has a body, as safe to override?",
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
        prompt: "Which namespace provides the LINQ extension methods such as Where and Select?",
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
        prompt: "What is the cost of leaning heavily on Reflection?",
        options: ["It is slower than calling members directly", "It speeds up runtime code execution", "It bypasses RAM allocation", "None"],
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
];
