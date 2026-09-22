/**
 * Database policy test. Applies every migration and both seeds to an in-memory
 * Postgres (PGlite) with small stand-ins for Supabase's auth schema, then checks,
 * as real signed-in and anonymous roles, that:
 *
 *   - learners can only change what the app lets them change,
 *   - XP, streaks and badges are awarded by the server, once,
 *   - every kind of badge rule fires when it should and not before,
 *   - a handle, an emblem and the leaderboard expose nothing else.
 *
 *   npm run test:db
 */
import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db = new PGlite();

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable
    as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema public to anon, authenticated;
  grant usage on schema auth to anon, authenticated;
  -- Supabase grants table and function access by default; policies and
  -- column privileges in the migrations are what actually protect the data.
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
`);

const migrations = fs.readdirSync(path.join(root, "supabase/migrations")).filter((f) => f.endsWith(".sql")).sort();
for (const file of migrations) await db.exec(fs.readFileSync(path.join(root, "supabase/migrations", file), "utf8"));
for (const seed of ["activity_rewards.sql", "badge_catalog.sql"]) {
  await db.exec(fs.readFileSync(path.join(root, "supabase/seed", seed), "utf8"));
}

const A = "11111111-1111-1111-1111-111111111111";
const B = "22222222-2222-2222-2222-222222222222";
const C = "33333333-3333-3333-3333-333333333333";
await db.exec(`insert into auth.users (id, email) values ('${A}', 'a@example.dev'), ('${B}', 'b@example.dev'), ('${C}', 'c@example.dev')`);

async function as(uid, sql, params) {
  await db.exec(
    uid
      ? `set role authenticated; select set_config('request.jwt.claim.sub', '${uid}', false);`
      : `set role anon; select set_config('request.jwt.claim.sub', '', false);`,
  );
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}
const rows = async (uid, sql, params) => (await as(uid, sql, params)).rows;
const one = async (uid, sql, params) => (await rows(uid, sql, params))[0];
const badges = async (uid) => (await rows(uid, "select badge_id from unlocked_badges order by 1")).map((r) => r.badge_id);
const profile = (uid) =>
  one(uid, "select xp, level, streak, longest_streak, tier, name, handle, emblem_badge_id, leaderboard_hidden, week_xp, week_start, settings from profiles where id = $1", [uid]);
/** Awards keys as that learner, at a given local hour. */
const award = (uid, keys, hour = 12) =>
  one(uid, `select award_activities($1::text[], current_date, ${hour}) as n`, [`{${keys.map((k) => `"${k}"`).join(",")}}`]);

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (error) {
    console.error(`FAIL  ${name}\n      ${error.message}`);
    process.exitCode = 1;
  }
}
const denied = (promise) => assert.rejects(promise, /permission denied|violates row-level security|not signed in/i);

/* --------------------------------------------------------- what a learner owns */

await check("signup creates a profile", async () => {
  const p = await profile(A);
  assert.equal(p.xp, 0);
  assert.equal(p.tier, "free");
  assert.equal(p.handle, null);
});
await check("learners cannot promote their own tier", () => denied(as(A, "update profiles set tier = 'pro' where id = $1", [A])));
await check("learners cannot set their own XP", () => denied(as(A, "update profiles set xp = 99999 where id = $1", [A])));
await check("learners cannot write their own handle or emblem", async () => {
  await denied(as(A, "update profiles set handle = 'cheater' where id = $1", [A]));
  await denied(as(A, "update profiles set emblem_badge_id = 'dreamweaver' where id = $1", [A]));
  await denied(as(A, "update profiles set leaderboard_hidden = true where id = $1", [A]));
});
await check("learners can edit name and settings", async () => {
  const r = await one(A, `update profiles set name = 'Ada', settings = settings || '{"soundsEnabled": false}' where id = $1 returning name`, [A]);
  assert.equal(r.name, "Ada");
});
await check("completions and badges cannot be inserted directly", async () => {
  await denied(as(A, "insert into completed_stops (user_id, slug) values ($1, 'variables')", [A]));
  await denied(as(A, "insert into unlocked_badges (user_id, badge_id) values ($1, 'dreamweaver')", [A]));
});
await check("the reward and badge catalogues are read-only", async () => {
  await denied(as(A, "insert into activity_rewards values ('hack', 1000)"));
  await denied(as(A, "insert into badge_catalog values ('hack', 'legendary', 9999, '{}'::jsonb)"));
  await denied(as(A, "update badge_catalog set xp = 9999 where badge_id = 'first-light'"));
  assert.ok((await one(A, "select count(*)::int as n from badge_catalog")).n > 20, "the catalogue is readable");
});

/* ------------------------------------------------------------ awarding rules */

await check("a first lesson pays its XP and the First Light badge", async () => {
  const r = await award(A, ["variables"]);
  assert.equal(r.n, 1);
  const p = await profile(A);
  // 15 for the lesson, 25 for a common badge.
  assert.equal(p.xp, 40);
  assert.deepEqual(await badges(A), ["first-light"]);
});
await check("awards are idempotent, and so are their badges", async () => {
  const r = await award(A, ["variables"]);
  assert.equal(r.n, 0);
  const p = await profile(A);
  assert.equal(p.xp, 40);
  assert.deepEqual(await badges(A), ["first-light"]);
});
await check("a topic badge fires on any one of its lessons", async () => {
  await award(A, ["loops"]);
  assert.ok((await badges(A)).includes("first-loop"));
  assert.equal((await profile(A)).xp, 40 + 15 + 25);
});
await check("the hour rule only fires for a lesson at that hour", async () => {
  await award(A, ["strings"], 12);
  assert.ok(!(await badges(A)).includes("night-owl"), "midday is not night");
  await award(A, ["comparisons"], 2);
  assert.ok((await badges(A)).includes("night-owl"), "2 a.m. is");
});
await check("five activities in one day earn Marathon Mind", async () => {
  assert.ok(!(await badges(B)).includes("marathon-mind"));
  await award(B, ["variables", "strings", "loops", "comparisons", "if-else"]);
  const b = await badges(B);
  assert.ok(b.includes("marathon-mind"), b.join(","));
});
await check("practice drills count toward Drill Runner", async () => {
  await award(B, ["practice:variables", "practice:strings", "practice:loops", "practice:comparisons"]);
  assert.ok(!(await badges(B)).includes("drill-sergeant"), "four is not five");
  await award(B, ["practice:if-else"]);
  assert.ok((await badges(B)).includes("drill-sergeant"));
});
await check("a seventh day in a row earns Streak Keeper", async () => {
  await db.exec(`update profiles set last_active_date = current_date - 1, streak = 6 where id = '${A}'`);
  await award(A, ["elif-chains"]);
  const p = await profile(A);
  assert.equal(p.streak, 7);
  assert.equal(p.longest_streak, 7);
  assert.ok((await badges(A)).includes("streak-keeper"));
});
await check("coming back after a week away earns Return Flight", async () => {
  assert.ok(!(await badges(B)).includes("return-flight"));
  await db.exec(`update profiles set last_active_date = current_date - 9, streak = 1 where id = '${B}'`);
  await award(B, ["nested-conditions"]);
  const b = await badges(B);
  assert.ok(b.includes("return-flight"), b.join(","));
  assert.equal((await profile(B)).streak, 1, "a gap resets the streak");
});
await check("a full week of XP earns Perfect Week", async () => {
  await db.exec(`update profiles set settings = settings || '{"weekActivity":[10,10,10,10,10,10,0]}' where id = '${A}'`);
  await award(A, ["logical-operators"]);
  const b = await badges(A);
  assert.ok(b.includes("perfect-week"), b.join(","));
});
await check("finishing a whole track earns its Master badge", async () => {
  const lessons = (await db.query("select activity_key from activity_meta where kind = 'lesson' and track = 'csharp'")).rows.map((r) => r.activity_key);
  assert.ok(lessons.length > 15, `the C# track has ${lessons.length} lessons`);
  await award(C, lessons.slice(0, -1));
  assert.ok(!(await badges(C)).includes("csharp-master"), "one lesson short is not mastery");
  const before = (await profile(C)).xp;
  await award(C, lessons.slice(-1));
  const b = await badges(C);
  assert.ok(b.includes("csharp-master"), b.join(","));
  assert.ok(b.includes("csharp-adept") && b.includes("csharp-initiate"), "the whole chain lands");
  // The last lesson pays 15, plus 600 for a legendary badge.
  assert.ok((await profile(C)).xp >= before + 615, "the legendary bonus is paid");
});
await check("a project in three languages earns Polyglot", async () => {
  await award(C, ["sky-house", "star-map"]);
  assert.ok(!(await badges(C)).includes("polyglot"), "two languages is not three");
  await award(C, ["typed-inventory"]);
  assert.ok((await badges(C)).includes("polyglot"));
});
await check("badge XP lands in the week total as well", async () => {
  const p = await profile(C);
  assert.ok(p.week_xp >= 600, `week_xp is ${p.week_xp}`);
  assert.equal(p.week_start.toISOString().slice(0, 10), (await db.query("select (current_date - (extract(isodow from current_date)::int - 1))::text as d")).rows[0].d);
});
await check("learners only see their own rows", async () => {
  assert.equal((await one(A, "select count(*)::int as n from completed_stops where user_id = $1", [B])).n, 0);
  assert.equal((await one(A, "select count(*)::int as n from unlocked_badges where user_id = $1", [B])).n, 0);
});
await check("anonymous visitors cannot award anything", () => denied(as(null, "select award_activities(array['strings'], current_date, 1)")));
await check("client dates are clamped to one day either side", async () => {
  const r = await one(A, "select award_activities(array['nested-conditions'], current_date + 30, 10) as n");
  assert.equal(r.n, 1);
  assert.equal((await one(A, "select last_active_date <= current_date + 1 as ok from profiles where id = $1", [A])).ok, true);
});
await check("spend_xp only ever subtracts", async () => {
  const before = (await profile(A)).xp;
  assert.equal((await one(A, "select spend_xp(5) as xp")).xp, before - 5);
  await assert.rejects(as(A, "select spend_xp(-100)"), /invalid amount/);
});

/* -------------------------------------------------------------- submissions */

await check("a failed run earns Test Tamer, then passing earns Bug Catcher", async () => {
  await as(B, "select record_submission('rain-counter', 'x', false)");
  assert.ok((await badges(B)).includes("test-tamer"));
  await as(B, "select record_submission('rain-counter', 'y', true)");
  const b = await badges(B);
  assert.ok(b.includes("bug-catcher"), b.join(","));
  assert.ok(!b.includes("clean-landing"), "a fixed solution is not a clean landing");
});
await check("passing with nothing to fix earns Clean Landing", async () => {
  const before = (await profile(C)).xp;
  await as(C, "select record_submission('star-sorter', 'y', true)");
  const b = await badges(C);
  assert.ok(b.includes("clean-landing"), b.join(","));
  assert.equal((await profile(C)).xp, before + 75, "a rare badge pays 75");
});
await check("submission badges are paid once", async () => {
  const before = (await profile(C)).xp;
  await as(C, "select record_submission('cloud-hopper', 'y', true)");
  assert.equal((await profile(C)).xp, before);
});

/* ------------------------------------------------------------------ identity */

await check("a handle is normalized, unique and checked", async () => {
  assert.equal((await one(A, "select set_handle('  @Nova_42 ') as h")).h, "nova_42");
  assert.equal((await profile(A)).handle, "nova_42");
  await assert.rejects(as(B, "select set_handle('nova_42')"), /handle taken/);
  await assert.rejects(as(B, "select set_handle('no')"), /invalid handle/);
  await assert.rejects(as(B, "select set_handle('way-too-long-a-handle-for-anyone')"), /invalid handle/);
  await assert.rejects(as(B, "select set_handle('bad spaces')"), /invalid handle/);
  await assert.rejects(as(B, "select set_handle('Admin')"), /reserved handle/);
  await assert.rejects(as(B, "select set_handle('dreamcode')"), /reserved handle/);
  await assert.rejects(as(null, "select set_handle('anon')"), /not signed in/);
  // Claiming the same handle again is fine for its owner.
  assert.equal((await one(A, "select set_handle('nova_42') as h")).h, "nova_42");
});
await check("an emblem must be a badge the learner earned", async () => {
  await assert.rejects(as(A, "select set_emblem('dreamweaver')"), /badge not earned/);
  assert.equal((await one(A, "select set_emblem('first-light') as e")).e, "first-light");
  assert.equal((await profile(A)).emblem_badge_id, "first-light");
  assert.equal((await one(A, "select set_emblem(null) as e")).e, null);
  await as(A, "select set_emblem('first-light')");
});

/* --------------------------------------------------------------- leaderboard */

await check("only learners with a handle appear", async () => {
  await as(B, "select set_handle('bee')");
  await as(C, "select set_handle('cee')");
  const board = await rows(A, "select * from leaderboard('all', 50)");
  const handles = board.map((r) => r.handle);
  assert.deepEqual([...handles].sort(), ["bee", "cee", "nova_42"]);
  assert.equal(board[0].handle, "cee", "the highest XP leads");
  assert.equal(Number(board[0].place), 1);
  assert.ok(board.every((r) => r.level >= 1 && r.badges >= 0));
});
await check("the board says which row is yours, and nothing about anyone else", async () => {
  const board = await rows(B, "select * from leaderboard('all', 50)");
  assert.equal(board.filter((r) => r.is_me).length, 1);
  assert.equal(board.find((r) => r.is_me).handle, "bee");
  assert.deepEqual(Object.keys(board[0]).sort(), ["badges", "emblem", "handle", "is_me", "level", "place", "streak", "week_xp", "xp"]);
});
await check("hiding takes a learner off the board and back on", async () => {
  await as(C, "select set_leaderboard_hidden(true)");
  let handles = (await rows(A, "select handle from leaderboard('all', 50)")).map((r) => r.handle);
  assert.ok(!handles.includes("cee"));
  await as(C, "select set_leaderboard_hidden(false)");
  handles = (await rows(A, "select handle from leaderboard('all', 50)")).map((r) => r.handle);
  assert.ok(handles.includes("cee"));
});
await check("the weekly board ranks this week's XP only", async () => {
  await db.exec(`update profiles set week_xp = 5000, week_start = current_date - 30 where id = '${A}'`);
  const week = await rows(A, "select handle, week_xp from leaderboard('week', 50)");
  assert.equal(week.find((r) => r.handle === "nova_42").week_xp, 0, "a stale week does not count");
  assert.notEqual(week[0].handle, "nova_42");
});
await check("a learner can find their own standing", async () => {
  const standing = await one(B, "select * from leaderboard_standing('all')");
  assert.ok(Number(standing.place) >= 1);
  assert.ok(Number(standing.total) >= 3);
  assert.equal(standing.handle, "bee");
  assert.equal((await rows(null, "select * from leaderboard_standing('all')")).length, 0, "an anonymous visitor has no standing");
});
await check("anonymous visitors can read the board but not change it", async () => {
  const board = await rows(null, "select handle, xp from leaderboard('all', 10)");
  assert.ok(board.length >= 3);
  assert.ok(board.every((r) => r.handle !== null));
  await assert.rejects(as(null, "select set_leaderboard_hidden(true)"), /not signed in/);
});
await check("the board size is clamped", async () => {
  assert.ok((await rows(A, "select * from leaderboard('all', 100000)")).length <= 100);
  assert.ok((await rows(A, "select * from leaderboard('all', -5)")).length >= 1);
});
await check("a name never reaches the board", async () => {
  await db.exec(`update profiles set name = 'Real Name' where id = '${B}'`);
  const board = await rows(A, "select * from leaderboard('all', 50)");
  assert.ok(!JSON.stringify(board).includes("Real Name"));
});

console.log(process.exitCode ? `\nDatabase checks FAILED (${passed} passed).` : `Database checks passed: ${passed} checks across ${migrations.length} migrations.`);
