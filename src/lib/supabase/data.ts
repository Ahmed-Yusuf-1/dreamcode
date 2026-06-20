import { createClient, getUser } from "./server";

/**
 * Server-side data access. Every function runs through the user's RLS-scoped
 * Supabase session, so it can only ever read or write the current user's rows.
 * These power the /api/* route handlers. The client gamification layer
 * (profile.ts / srs.ts / track.ts) will call those endpoints.
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
}

const XP_PER_LEVEL = 800;

/** Loads the full profile (row + completed stops + badges) for the logged-in user. */
export async function getFullProfile(): Promise<ServerProfile | null> {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();

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
    level: profile.level,
    streak: profile.streak,
    lastActiveDate: profile.last_active_date,
    tier: profile.tier,
    settings: profile.settings ?? {},
    completedStops: (stops ?? []).map((s) => s.slug),
    unlockedBadges: (badges ?? []).map((b) => b.badge_id),
  };
}

export interface ProfilePatch {
  name?: string;
  xp?: number;
  streak?: number;
  lastActiveDate?: string;
  settings?: Record<string, unknown>;
}

/** Updates mutable profile fields. Level is derived from XP (800 XP per level). */
export async function updateProfile(patch: ProfilePatch): Promise<ServerProfile | null> {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();

  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.xp !== undefined) {
    row.xp = patch.xp;
    row.level = Math.floor(patch.xp / XP_PER_LEVEL) + 1;
  }
  if (patch.streak !== undefined) row.streak = patch.streak;
  if (patch.lastActiveDate !== undefined) row.last_active_date = patch.lastActiveDate;
  if (patch.settings !== undefined) row.settings = patch.settings;

  if (Object.keys(row).length > 0) {
    await supabase.from("profiles").update(row).eq("id", user.id);
  }
  return getFullProfile();
}

/** Marks a stop (lesson/practice/challenge/project slug) complete. Idempotent. */
export async function completeStop(slug: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const supabase = await createClient();
  // ignoreDuplicates -> ON CONFLICT DO NOTHING: a re-completion is a no-op that
  // needs only INSERT permission. completed_stops has no UPDATE policy, so the
  // default DO UPDATE branch would be denied by RLS on a redundant call.
  const { error } = await supabase
    .from("completed_stops")
    .upsert({ user_id: user.id, slug }, { onConflict: "user_id,slug", ignoreDuplicates: true });
  return !error;
}

/** Records a code submission and whether it passed. */
export async function recordSubmission(
  slug: string,
  code: string,
  passed: boolean,
): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const supabase = await createClient();
  const { error } = await supabase
    .from("submissions")
    .insert({ user_id: user.id, slug, code, passed });
  return !error;
}

/** Unlocks a badge. Idempotent. */
export async function unlockBadge(badgeId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const supabase = await createClient();
  // ignoreDuplicates -> ON CONFLICT DO NOTHING: unlocked_badges has no UPDATE
  // policy, and a re-unlock should be a no-op insert, not an RLS-denied update.
  const { error } = await supabase
    .from("unlocked_badges")
    .upsert({ user_id: user.id, badge_id: badgeId }, { onConflict: "user_id,badge_id", ignoreDuplicates: true });
  return !error;
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
export async function getSrsCards(): Promise<SrsCard[]> {
  const user = await getUser();
  if (!user) return [];
  const supabase = await createClient();
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
export async function upsertSrsCard(card: SrsCard): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const supabase = await createClient();
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
