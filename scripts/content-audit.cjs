/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadTs(relativePath) {
  const filename = path.join(process.cwd(), relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  const loaded = { exports: {} };
  new Function("module", "exports", "require", output)(loaded, loaded.exports, require);
  return loaded.exports;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const curriculum = loadTs("src/lib/curriculum.ts");
const data = loadTs("src/lib/data.ts");
const lessons = curriculum.lessons;
const slugs = new Set(lessons.map((lesson) => lesson.slug));

assert(lessons.length >= 100, `Expected at least 100 lessons, found ${lessons.length}`);
assert(slugs.size === lessons.length, "Lesson slugs must be unique");
assert(Object.keys(data.practiceDatasets).length > 0, "Practice catalog is empty");
assert(Object.keys(data.challenges).length > 0, "Challenge catalog is empty");
assert(data.projects.length > 0, "Project catalog is empty");

for (const lesson of lessons) {
  assert(lesson.title && lesson.catalogTitle && lesson.intro, `Lesson ${lesson.slug} is missing required copy`);
  if (lesson.practiceSlug) {
    assert(data.practiceDatasets[lesson.practiceSlug], `Lesson ${lesson.slug} points to missing practice ${lesson.practiceSlug}`);
  }
}

for (const challenge of Object.values(data.challenges)) {
  assert(challenge.testCases.length > 0, `Challenge ${challenge.slug} has no tests`);
  assert(challenge.functionName, `Challenge ${challenge.slug} has no function name`);
}

for (const project of data.projects) {
  assert(project.testCases && project.testCases.length > 0, `Project ${project.id} has no tests`);
}

console.log(`Content audit passed: ${lessons.length} lessons, ${Object.keys(data.practiceDatasets).length} practices, ${Object.keys(data.challenges).length} challenges, ${data.projects.length} projects.`);
