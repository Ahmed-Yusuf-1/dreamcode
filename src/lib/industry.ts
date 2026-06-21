/**
 * "Where this language is used in the tech industry" content. This is read-only
 * reference material (no code execution), shown on /industry. It exists for all
 * three planned languages - Python, JavaScript, and C# / .NET - even before each
 * one's full lesson track is authored, so a learner can see where a language
 * leads before committing to it.
 *
 * Voice: plain prose, no em dashes or decorative emoji.
 */

export interface IndustryDomain {
  /** the area of the industry, e.g. "Data science and machine learning" */
  title: string;
  /** one or two sentences a beginner can understand */
  blurb: string;
  /** the tools, frameworks, and libraries a professional reaches for here */
  tools: string[];
  /** job titles that live in this area */
  roles: string[];
}

export interface IndustryProfile {
  id: "python" | "javascript" | "csharp" | "typescript";
  name: string;
  /** short label under the name */
  tagline: string;
  /** a paragraph on the language's standing in the industry */
  summary: string;
  domains: IndustryDomain[];
}

export const industryProfiles: IndustryProfile[] = [
  {
    id: "python",
    name: "Python",
    tagline: "The general-purpose workhorse",
    summary:
      "Python is one of the most widely used languages in the industry. Its clear syntax makes it a common first language, and the same readability makes it a favorite for fast-moving teams. It dominates data work and automation, has a strong web back-end story, and is the default language of modern machine learning.",
    domains: [
      {
        title: "Data science and analytics",
        blurb:
          "Loading, cleaning, analyzing, and charting data to answer business questions. Most analytics teams write Python in notebooks day to day.",
        tools: ["pandas", "NumPy", "Jupyter", "Matplotlib", "Polars"],
        roles: ["Data Analyst", "Data Scientist"],
      },
      {
        title: "Machine learning and AI",
        blurb:
          "Training and serving models, from recommendation systems to large language models. Python is the standard language for this entire field.",
        tools: ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face"],
        roles: ["Machine Learning Engineer", "AI Researcher"],
      },
      {
        title: "Web back-ends and APIs",
        blurb:
          "The server side of web apps: handling requests, talking to databases, and exposing APIs that front-ends and mobile apps call.",
        tools: ["Django", "Flask", "FastAPI", "SQLAlchemy"],
        roles: ["Backend Engineer", "Full-Stack Engineer"],
      },
      {
        title: "Automation, scripting, and DevOps",
        blurb:
          "Gluing systems together, automating repetitive tasks, and running infrastructure. Python is the everyday tool for scripts that just need to work.",
        tools: ["requests", "Ansible", "Boto3 (AWS)", "Click"],
        roles: ["DevOps Engineer", "Site Reliability Engineer", "Platform Engineer"],
      },
      {
        title: "Scientific and quantitative computing",
        blurb:
          "Research, engineering, and finance use Python for simulations, modeling, and number crunching that used to require specialized tools.",
        tools: ["SciPy", "SymPy", "QuantLib", "Numba"],
        roles: ["Research Engineer", "Quantitative Analyst"],
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    tagline: "The language of the web",
    summary:
      "JavaScript runs in every web browser, which makes it unavoidable for anything users see and click. With Node.js it also runs on servers, so a single language can power an entire product from the interface down to the API. TypeScript, a typed layer on top, is the professional default for larger codebases.",
    domains: [
      {
        title: "Front-end web development",
        blurb:
          "Everything that happens in the browser: layout, interactivity, and state. This is the largest single use of JavaScript in the industry.",
        tools: ["React", "Vue", "Angular", "TypeScript", "Tailwind CSS"],
        roles: ["Front-End Engineer", "UI Engineer"],
      },
      {
        title: "Back-end and APIs (Node.js)",
        blurb:
          "Servers, APIs, and real-time services written in JavaScript on the Node.js runtime, so teams can share one language across the stack.",
        tools: ["Node.js", "Express", "NestJS", "Prisma"],
        roles: ["Backend Engineer", "Full-Stack Engineer"],
      },
      {
        title: "Full-stack frameworks",
        blurb:
          "Frameworks that handle both the front-end and the server in one project, which is how most new web products are built today.",
        tools: ["Next.js", "Remix", "SvelteKit", "Nuxt"],
        roles: ["Full-Stack Engineer", "Product Engineer"],
      },
      {
        title: "Mobile and desktop apps",
        blurb:
          "Cross-platform apps built once in JavaScript and shipped to phones and desktops, instead of writing separate native code for each.",
        tools: ["React Native", "Electron", "Expo"],
        roles: ["Mobile Engineer", "Cross-Platform Engineer"],
      },
      {
        title: "Tooling and build systems",
        blurb:
          "The bundlers, compilers, and test runners that the whole web ecosystem depends on, many of them written in or for JavaScript.",
        tools: ["Vite", "esbuild", "Webpack", "Vitest", "Playwright"],
        roles: ["Developer Experience Engineer", "Build Engineer"],
      },
    ],
  },
  {
    id: "csharp",
    name: "C# / .NET",
    tagline: "Microsoft's cross-platform powerhouse",
    summary:
      "C# is a modern, statically typed language that runs on the .NET platform. It is a mainstay of enterprise software and a leading choice for game development through Unity. Once tied to Windows, .NET is now fully cross-platform and runs on Linux and macOS, which keeps C# in heavy demand for business systems, cloud services, and games.",
    domains: [
      {
        title: "Enterprise and web applications",
        blurb:
          "Large business systems, internal tools, and web APIs. ASP.NET Core is one of the most performant web frameworks in the industry.",
        tools: ["ASP.NET Core", "Entity Framework Core", "Blazor", "SQL Server"],
        roles: [".NET Developer", "Enterprise Software Engineer"],
      },
      {
        title: "Game development",
        blurb:
          "C# is the scripting language of Unity, one of the most popular game engines, used for mobile, console, PC, and AR/VR games.",
        tools: ["Unity", "Godot (C#)", "MonoGame"],
        roles: ["Game Developer", "Gameplay Programmer"],
      },
      {
        title: "Desktop applications",
        blurb:
          "Rich Windows and cross-platform desktop apps, from line-of-business software to creative tools.",
        tools: ["WPF", "WinForms", ".NET MAUI", "Avalonia"],
        roles: ["Desktop Application Developer", "Software Engineer"],
      },
      {
        title: "Cloud and microservices",
        blurb:
          "Scalable back-end services and serverless functions, especially on Microsoft Azure where .NET is a first-class citizen.",
        tools: ["Azure", "Docker", "gRPC", "Dapr"],
        roles: ["Cloud Engineer", "Backend Engineer"],
      },
      {
        title: "Cross-platform and mobile",
        blurb:
          "Shared codebases that target Windows, macOS, Android, and iOS from one C# project, common in companies already invested in .NET.",
        tools: [".NET MAUI", "Xamarin", "Uno Platform"],
        roles: ["Mobile Engineer", "Cross-Platform Engineer"],
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    tagline: "JavaScript with type safety",
    summary:
      "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. Developed by Microsoft, it has become the standard for professional web development. By adding type safety, it catches bugs early, documents code automatically, and enables confident refactoring.",
    domains: [
      {
        title: "Large-scale web apps",
        blurb:
          "Structuring complex web platforms with strict type interfaces to coordinate work across large engineering teams.",
        tools: ["Next.js", "React", "Angular", "ts-node"],
        roles: ["Software Engineer", "Frontend Architect"],
      },
      {
        title: "API and server development",
        blurb:
          "Writing backend services and database access layers where type accuracy ensures database and request payloads are correct.",
        tools: ["NestJS", "Prisma", "Zod", "tRPC"],
        roles: ["Backend Engineer", "Full-Stack Engineer"],
      },
      {
        title: "Library and SDK design",
        blurb:
          "Creating open source packages and software development kits where type definitions guide the developer's imports.",
        tools: ["tsup", "dts-cli", "Rollup"],
        roles: ["Library Author", "Developer Relations Engineer"],
      },
    ],
  },
];

export function getIndustryProfile(id: string): IndustryProfile | undefined {
  return industryProfiles.find((p) => p.id === id);
}
