import type { User } from "@supabase/supabase-js";
import { createClient, getUser } from "./server";
import { isSupabaseConfigured } from "./config";
import { getActivityReward, isLessonActivity } from "@/lib/rewards";
import { buildCatalog } from "@/lib/catalog.server";
import { badgeXp, evaluateBadges, type BadgeSnapshot } from "@/lib/badges";
import type { Catalog } from "@/lib/catalog";

/**
 * Server-side data access. Every function runs through the user's RLS-scoped
 * Supabase session, so it can only ever read or write the current user's rows.
 *
 * Progress-changing writes (XP, streak, completions, badges) go through
 * SECURITY DEFINER database functions from migration 0003, which look rewards up
 * in the server-owned activity_rewards table and apply them in one transaction.
 * Until that migration is applied, a compatible fallback path is used.
 */

export interface ServerProfile {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  tier: "free" | "pro";
  settings: Record<string, unknown>;
  completedStops: string[];
  unlockedBadges: string[];
  createdAt: string | null;
  /** Public handle on the leaderboard, null until claimed. */
  handle: string | null;
  /** Badge worn as an emblem, null when none. */
  emblem: string | null;
  leaderboardHidden: boolean;
  longestStreak: number;
}

export interface DbContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User;
}

const XP_PER_LEVEL = 800;
const SETTINGS_KEYS = ["soundsEnabled", "guideEnabled", "remindersEnabled", "activeTrack"] as const;

/** One verified session lookup per request; null when signed out. */
export async function getDbContext(): Promise<DbContext | null> {
  const user = await getUser();
  if (!user) return null;
  return { supabase: await createClient(), user };
}

/** Postgres "function does not exist" (migration 0003 not applied yet). */
function isMissingFunction(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return error.code === "PGRST202" || error.code === "42883" || /could not find the function/i.test(error.message || "");
}

/** Loads the full profile (row + completed stops + badges) for the logged-in user. */
export async function getFullProfile(ctx: DbContext): Promise<ServerProfile | null> {
  const { supabase, user } = ctx;
  const [{ data: profile }, { data: stops }, { data: badges }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("completed_stops").select("slug").eq("user_id", user.id),
    supabase.from("unlocked_badges").select("badge_id").eq("user_id", user.id),
  ]);
  if (!profile) return null;
  return {
    id: profile.id,
    name: profile.name,
    xp: profile.xp,
    level: Math.floor((profile.xp ?? 0) / XP_PER_LEVEL) + 1,
    streak: profile.streak,
    lastActiveDate: profile.last_active_date,
    tier: profile.tier === "pro" ? "pro" : "free",
    settings: profile.settings ?? {},
    completedStops: (stops ?? []).map((s) => s.slug),
    unlockedBadges: (badges ?? []).map((b) => b.badge_id),
    createdAt: profile.created_at ?? null,
    handle: profile.handle ?? null,
    emblem: profile.emblem_badge_id ?? null,
    leaderboardHidden: profile.leaderboard_hidden === true,
    longestStreak: profile.longest_streak ?? profile.streak ?? 0,
  };
}

export interface ProfilePatch {
  name?: string;
  settings?: Record<string, unknown>;
}

/**
 * Updates the learner-editable fields: display name and a whitelisted set of
 * settings. Settings are merged into the stored object so unrelated keys (the
 * weekly activity chart) are never wiped by a preference change.
 */
export class HandleTakenError extends Error {}

/**
 * Identity changes go through SECURITY DEFINER functions: the learner has no
 * write privilege on these columns, and the functions check that a handle is
 * free and that an emblem is a badge they have actually earned.
 */
export async function setHandle(ctx: DbContext, handle: string): Promise<ServerProfile | null> {
  const { error } = await ctx.supabase.rpc("set_handle", { p_handle: handle });
  if (error) {
    if (/handle taken|duplicate key|unique/i.test(error.message)) throw new HandleTakenError(error.message);
    throw new Error(error.message);
  }
  return getFullProfile(ctx);
}

export async function setEmblem(ctx: DbContext, badgeId: string | null): Promise<ServerProfile | null> {
  const { error } = await ctx.supabase.rpc("set_emblem", { p_badge_id: badgeId });
  if (error) throw new Error(error.message);
  return getFullProfile(ctx);
}

export async function setLeaderboardHidden(ctx: DbContext, hidden: boolean): Promise<ServerProfile | null> {
  const { error } = await ctx.supabase.rpc("set_leaderboard_hidden", { p_hidden: hidden });
  if (error) throw new Error(error.message);
  return getFullProfile(ctx);
}

export interface LeaderboardRow {
  place: number;
  handle: string;
  emblem: string | null;
  level: number;
  xp: number;
  weekXp: number;
  streak: number;
  badges: number;
  isMe: boolean;
}

export interface LeaderboardStanding {
  place: number;
  total: number;
  handle: string;
}

/** The public board. Only handles, emblems and progress numbers come back. */
export async function getLeaderboard(ctx: DbContext | null, scope: "all" | "week", limit = 50): Promise<LeaderboardRow[]> {
  // Without Supabase there is no board, and a guest browser must still work.
  if (!ctx && !isSupabaseConfigured()) return [];
  const supabase = ctx ? ctx.supabase : await createClient();
  const { data, error } = await supabase.rpc("leaderboard", { p_scope: scope, p_limit: limit });
  if (error || !Array.isArray(data)) return [];
  return data.map((row) => ({
    place: Number(row.place),
    handle: String(row.handle),
    emblem: row.emblem ?? null,
    level: Number(row.level),
    xp: Number(row.xp),
    weekXp: Number(row.week_xp),
    streak: Number(row.streak),
    badges: Number(row.badges),
    isMe: row.is_me === true,
  }));
}

/** Where the signed-in learner stands, even when they are below the top. */
export async function getLeaderboardStanding(ctx: DbContext, scope: "all" | "week"): Promise<LeaderboardStanding | null> {
  const { data, error } = await ctx.supabase.rpc("leaderboard_standing", { p_scope: scope });
  if (error || !Array.isArray(data) || data.length === 0) return null;
  const row = data[0];
  return { place: Number(row.place), total: Number(row.total), handle: String(row.handle) };
}

export async function updateProfile(ctx: DbContext, patch: ProfilePatch): Promise<ServerProfile | null> {
  const { supabase, user } = ctx;
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name.trim().slice(0, 60) || "Dreamer";
  if (patch.settings !== undefined) {
    const { data } = await supabase.from("profiles").select("settings").eq("id", user.id).single();
    const next: Record<string, unknown> = { ...((data?.settings as Record<string, unknown>) ?? {}) };
    for (const key of SETTINGS_KEYS) {
      if (key in patch.settings) next[key] = patch.settings[key];
    }
    row.settings = next;
  }
  if (Object.keys(row).length > 0) {
    await supabase.from("profiles").update(row).eq("id", user.id);
  }
  return getFullProfile(ctx);
}

/** Decreases XP for an in-product purchase. This can never mint XP. */
export async function spendXp(ctx: DbContext, amount: number): Promise<ServerProfile | null> {
  const { supabase, user } = ctx;
  const cost = Math.max(0, Math.floor(amount));
  const { error } = await supabase.rpc("spend_xp", { p_amount: cost });
  if (error && isMissingFunction(error)) {
    const { data } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
    if (!data) return null;
    const xp = Math.max(0, data.xp - cost);
    await supabase.from("profiles").update({ xp, level: Math.floor(xp / XP_PER_LEVEL) + 1 }).eq("id", user.id);
  }
  return getFullProfile(ctx);
}

export interface AwardOptions {
  /** Learner's local calendar date (YYYY-MM-DD); clamped server side. */
  clientDate?: string;
  /** Learner's local hour 0..23, for the night-owl badge. */
  localHour?: number;
}

function clampClientDate(clientDate?: string): string {
  const serverToday = new Date();
  const day = (offset: number) => {
    const d = new Date(serverToday);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  const [min, max] = [day(-1), day(1)];
  if (!clientDate || !/^\d{4}-\d{2}-\d{2}$/.test(clientDate)) return day(0);
  return clientDate < min ? min : clientDate > max ? max : clientDate;
}

/**
 * Awards catalog-validated activities once each. Returns how many were new.
 * Unknown keys are ignored; a review key only counts on the learner's today.
 */
export async function awardActivities(ctx: DbContext, keys: string[], options: AwardOptions = {}): Promise<number> {
  const { supabase } = ctx;
  const today = clampClientDate(options.clientDate);
  const localHour = Number.isInteger(options.localHour) ? Math.min(23, Math.max(0, options.localHour as number)) : new Date().getUTCHours();

  const { data, error } = await supabase.rpc("award_activities", {
    p_keys: keys,
    p_client_date: today,
    p_local_hour: localHour,
  });
  if (!error) return typeof data === "number" ? data : 0;
  if (!isMissingFunction(error)) {
    console.error("award_activities failed", error.message);
    return 0;
  }
  let awarded = 0;
  for (const key of keys) {
    if (await legacyAward(ctx, key, today, localHour)) awarded += 1;
  }
  return awarded;
}

/** Pre-0003 path: same rules, applied with separate statements. */
async function legacyAward(ctx: DbContext, activityKey: string, today: string, localHour: number): Promise<boolean> {
  const { supabase, user } = ctx;
  const catalog = buildCatalog();
  const reward = getActivityReward(activityKey, catalog);
  if (!reward) return false;
  if (activityKey.startsWith("review:") && activityKey.split(":")[1] !== today) return false;

  const { data: inserted, error: insertError } = await supabase
    .from("completed_stops")
    .upsert({ user_id: user.id, slug: activityKey }, { onConflict: "user_id,slug", ignoreDuplicates: true })
    .select("slug");
  if (insertError || !inserted || inserted.length === 0) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak, last_active_date, settings")
    .eq("id", user.id)
    .single();
  if (!profile) return false;

  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const last = profile.last_active_date as string | null;
  const streak = last === today ? profile.streak : last === yesterday.toISOString().slice(0, 10) ? profile.streak + 1 : 1;
  const xp = profile.xp + reward.xp;

  const settings = { ...(profile.settings ?? {}) } as Record<string, unknown>;
  const todayDate = new Date(`${today}T00:00:00Z`);
  const dayIndex = (todayDate.getUTCDay() + 6) % 7;
  const monday = new Date(todayDate);
  monday.setUTCDate(monday.getUTCDate() - dayIndex);
  const weekStart = monday.toISOString().slice(0, 10);
  const activity =
    settings.weekStart === weekStart && Array.isArray(settings.weekActivity)
      ? [...(settings.weekActivity as number[])]
      : [0, 0, 0, 0, 0, 0, 0];
  activity[dayIndex] = (activity[dayIndex] || 0) + reward.xp;
  settings.weekActivity = activity;
  settings.weekStart = weekStart;
  // Activities finished today, for the daily goal and the day badges.
  const dayCount = (settings.dayDate === today && typeof settings.dayCount === "number" ? settings.dayCount : 0) + 1;
  settings.dayDate = today;
  settings.dayCount = dayCount;

  await supabase
    .from("profiles")
    .update({ xp, level: Math.floor(xp / XP_PER_LEVEL) + 1, streak, last_active_date: today, settings })
    .eq("id", user.id);

  const daysAway = last ? Math.max(0, Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${last}T00:00:00Z`)) / 86_400_000)) : 0;
  await awardEarnedBadges(ctx, catalog, {
    streak,
    weekActivity: activity,
    dayCount,
    daysAway,
    ...(isLessonActivity(activityKey, catalog) ? { lessonHour: localHour } : {}),
  });
  return true;
}

/**
 * Evaluates every badge rule against the learner's current state and stores the
 * ones they have just earned, with their rarity bonus XP. Used by the pre-0004
 * fallback path; with the migration applied, Postgres does this itself.
 */
async function awardEarnedBadges(ctx: DbContext, catalog: Catalog, extra: Partial<BadgeSnapshot>): Promise<string[]> {
  const { supabase, user } = ctx;
  const [{ data: stops }, { data: owned }] = await Promise.all([
    supabase.from("completed_stops").select("slug").eq("user_id", user.id),
    supabase.from("unlocked_badges").select("badge_id").eq("user_id", user.id),
  ]);
  const snapshot: BadgeSnapshot = {
    completed: (stops ?? []).map((row) => row.slug),
    streak: 0,
    weekActivity: [0, 0, 0, 0, 0, 0, 0],
    dayCount: 0,
    ...extra,
  };
  const earned = evaluateBadges(snapshot, catalog, (owned ?? []).map((row) => row.badge_id));
  if (earned.length === 0) return [];

  await supabase.from("unlocked_badges").upsert(
    earned.map((badgeId) => ({ user_id: user.id, badge_id: badgeId })),
    { onConflict: "user_id,badge_id", ignoreDuplicates: true },
  );
  const bonus = badgeXp(earned, catalog);
  if (bonus > 0) {
    const { data: row } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
    const xp = (row?.xp ?? 0) + bonus;
    await supabase.from("profiles").update({ xp, level: Math.floor(xp / XP_PER_LEVEL) + 1 }).eq("id", user.id);
  }
  return earned;
}

/** Records a code submission and evaluates the Test Tamer / Bug Catcher badges. */
export async function recordSubmission(ctx: DbContext, slug: string, code: string, passed: boolean): Promise<boolean> {
  const { supabase, user } = ctx;
  const { error } = await supabase.rpc("record_submission", { p_slug: slug, p_code: code, p_passed: passed });
  if (!error) return true;
  if (!isMissingFunction(error)) return false;

  const { data: priorFailures } = await supabase
    .from("submissions")
    .select("id")
    .eq("user_id", user.id)
    .eq("slug", slug)
    .eq("passed", false)
    .limit(1);
  const failedBefore = (priorFailures ?? []).length > 0;
  const { error: insertError } = await supabase.from("submissions").insert({ user_id: user.id, slug, code, passed });
  if (insertError) return false;
  await awardEarnedBadges(ctx, buildCatalog(), {
    submission: { failed: !passed, failThenPass: passed && failedBefore, firstTry: passed && !failedBefore },
  });
  return true;
}

export interface SrsCard {
  cardId: string;
  dueAt: string;
  stability: number;
  difficulty: number;
  reps: number;
  updatedAt?: string;
}

/** Returns all SRS cards for the user. */
export async function getSrsCards(ctx: DbContext): Promise<SrsCard[]> {
  const { supabase, user } = ctx;
  const { data } = await supabase
    .from("srs_cards")
    .select("card_id, due_at, stability, difficulty, reps, updated_at")
    .eq("user_id", user.id);
  return (data ?? []).map((c) => ({
    cardId: c.card_id,
    dueAt: c.due_at,
    stability: c.stability,
    difficulty: c.difficulty,
    reps: c.reps,
    updatedAt: c.updated_at,
  }));
}

/** Inserts or updates one SRS card's scheduling state. */
export async function upsertSrsCard(ctx: DbContext, card: SrsCard): Promise<boolean> {
  const { supabase, user } = ctx;
  const { error } = await supabase.from("srs_cards").upsert(
    {
      user_id: user.id,
      card_id: card.cardId,
      due_at: card.dueAt,
      stability: card.stability,
      difficulty: card.difficulty,
      reps: card.reps,
      updated_at: card.updatedAt || new Date().toISOString(),
    },
    { onConflict: "user_id,card_id" },
  );
  return !error;
}

export interface TelemetryEvent {
  name: string;
  props?: Record<string, unknown>;
}

/** Appends one or more telemetry events for the current user. */
export async function recordEvents(ctx: DbContext, events: TelemetryEvent[]): Promise<boolean> {
  if (events.length === 0) return true;
  const { supabase, user } = ctx;
  const rows = events.map((e) => ({ user_id: user.id, name: e.name, props: e.props ?? {} }));
  const { error } = await supabase.from("events").insert(rows);
  return !error;
}

export interface StoredEvent {
  name: string;
  props: Record<string, unknown>;
  createdAt: string;
}

/** Returns the current user's most recent events (newest first). */
export async function getEvents(ctx: DbContext, limit = 200): Promise<StoredEvent[]> {
  const { supabase, user } = ctx;
  const { data } = await supabase
    .from("events")
    .select("name, props, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 500));
  return (data ?? []).map((e) => ({
    name: e.name,
    props: (e.props ?? {}) as Record<string, unknown>,
    createdAt: e.created_at,
  }));
}
