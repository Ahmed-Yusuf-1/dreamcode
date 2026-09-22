"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getActivityReward, isLessonActivity } from "@/lib/rewards";
import { getClientCatalog } from "@/lib/catalogStore";
import { isTrackId } from "@/lib/catalog";
import { badgeXp, evaluateBadges, type BadgeSnapshot } from "@/lib/badges";

export const XP_PER_LEVEL = 800;

export interface UserProfile {
  name: string;
  initial: string;
  level: number;
  xp: number; // XP within current level
  xpNext: number; // XP required for next level (always 800)
  /** Consecutive active days as of lastActiveDate. Use currentStreak() for display. */
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD, learner's local calendar
  unlockedBadges: string[];
  weekActivity: number[]; // XP earned Mon..Sun of weekStart's week
  /** Monday (YYYY-MM-DD) of the week weekActivity belongs to. */
  weekStart: string | null;
  /** The learner's local day dayCount belongs to. */
  dayDate: string | null;
  /** Activities finished on dayDate (drives the daily goal and day badges). */
  dayCount: number;
  /** Best streak ever reached, which a bad week can never take away. */
  longestStreak: number;
  /** Public name on the leaderboard. Null until the learner picks one. */
  handle: string | null;
  /** Badge worn as their emblem. Must be one they have earned. */
  emblem: string | null;
  /** Set when the learner would rather not appear on the leaderboard. */
  leaderboardHidden: boolean;
  soundsEnabled: boolean;
  guideEnabled: boolean;
  remindersEnabled: boolean;
  completedStops: string[];
  activeTrack?: string;
  tier: "free" | "pro";
  createdAt?: string | null;
}

// A brand-new learner starts empty. This mirrors the server's fresh-signup row
// (xp 0, level 1, streak 0, no stops/badges).
const DEFAULT_PROFILE: UserProfile = {
  name: "Dreamer",
  initial: "D",
  level: 1,
  xp: 0,
  xpNext: XP_PER_LEVEL,
  streak: 0,
  lastActiveDate: null,
  unlockedBadges: [],
  weekActivity: [0, 0, 0, 0, 0, 0, 0],
  weekStart: null,
  dayDate: null,
  dayCount: 0,
  longestStreak: 0,
  handle: null,
  emblem: null,
  leaderboardHidden: false,
  soundsEnabled: true,
  guideEnabled: true,
  remindersEnabled: false,
  completedStops: [],
  activeTrack: "python",
  tier: "free",
  createdAt: null,
};

const PROFILE_KEY = "dc_user_profile";
/** "guest" or the Supabase user id the cached profile belongs to. */
const OWNER_KEY = "dc_profile_owner";
/** Guest completions waiting for the learner to accept or decline a merge. */
export const GUEST_MERGE_KEY = "dc_guest_merge";
export const GUEST_MERGE_EVENT = "dc_guest_merge_change";

let isUserSignedIn = false;
let authResolved = false;
let currentUserId: string | null = null;
let supabase: ReturnType<typeof createClient> | null = null;
let activitySyncQueue: Promise<void> = Promise.resolve();

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage can be unavailable (private mode); progress stays in memory */
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Updates the cached sign-in flag and notifies listeners when it changes. */
function setSignedIn(value: boolean, userId: string | null) {
  const changed = isUserSignedIn !== value || !authResolved;
  isUserSignedIn = value;
  currentUserId = userId;
  authResolved = true;
  if (changed && typeof window !== "undefined") {
    window.dispatchEvent(new Event("dc_auth_change"));
  }
}

/**
 * A signed-out browser must never keep showing the last account's progress. When
 * the cached profile belonged to a user and nobody is signed in, start a fresh
 * guest profile (and a fresh review schedule).
 */
function resetToGuestIfOwnedByUser() {
  const owner = safeGet(OWNER_KEY);
  if (owner && owner !== "guest") {
    safeRemove(PROFILE_KEY);
    safeRemove("dc_srs_full_states");
    safeSet(OWNER_KEY, "guest");
    window.dispatchEvent(new Event("dc_profile_change"));
    window.dispatchEvent(new Event("dc_srs_change"));
  }
}

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase = createClient();
  supabase.auth.getSession().then(({ data }) => {
    const session = data.session;
    setSignedIn(!!session, session?.user.id ?? null);
    if (session) syncProfileFromApi();
    else resetToGuestIfOwnedByUser();
  });
  supabase.auth.onAuthStateChange((event, session) => {
    setSignedIn(!!session, session?.user.id ?? null);
    if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED")) {
      syncProfileFromApi();
    } else if (!session) {
      resetToGuestIfOwnedByUser();
    }
  });
} else if (typeof window !== "undefined") {
  authResolved = true;
}

/** Whether a Supabase session is currently active. */
export function getIsSignedIn(): boolean {
  return isUserSignedIn;
}

function localDate(date = new Date()): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/** Monday of the current local week, as YYYY-MM-DD. */
export function currentWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
  d.setDate(d.getDate() - day);
  return localDate(d);
}

/** Index 0..6 (Mon..Sun) of today. */
export function todayIndex(date = new Date()): number {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(`${b}T00:00:00Z`).getTime() - new Date(`${a}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/** The streak as it stands today: it lapses if the learner skipped a whole day. */
export function currentStreak(profile: Pick<UserProfile, "streak" | "lastActiveDate">, today = localDate()): number {
  if (!profile.lastActiveDate) return 0;
  const gap = daysBetween(profile.lastActiveDate, today);
  return gap <= 1 ? profile.streak : 0;
}

/** This week's XP bars; last week's numbers never leak into a new week. */
export function thisWeekActivity(profile: Pick<UserProfile, "weekActivity" | "weekStart">): number[] {
  if (profile.weekStart !== currentWeekStart()) return [0, 0, 0, 0, 0, 0, 0];
  return profile.weekActivity;
}

function withTodayXp(profile: UserProfile, xp: number) {
  const week = currentWeekStart();
  const activity = profile.weekStart === week ? [...profile.weekActivity] : [0, 0, 0, 0, 0, 0, 0];
  activity[todayIndex()] = (activity[todayIndex()] || 0) + xp;
  profile.weekActivity = activity;
  profile.weekStart = week;
}

/** Activities finished today, resetting when the local day rolls over. */
export function todayCount(profile: Pick<UserProfile, "dayDate" | "dayCount">, today = localDate()): number {
  return profile.dayDate === today ? profile.dayCount : 0;
}

/** XP earned today, from the week chart. */
export function todayXp(profile: Pick<UserProfile, "weekActivity" | "weekStart">): number {
  return thisWeekActivity(profile)[todayIndex()] || 0;
}

/** Everything a badge rule can ask about, built from the cached profile. */
export function badgeSnapshot(profile: UserProfile, extra: Partial<BadgeSnapshot> = {}): BadgeSnapshot {
  return {
    completed: profile.completedStops || [],
    streak: currentStreak(profile),
    weekActivity: thisWeekActivity(profile),
    dayCount: todayCount(profile),
    ...extra,
  };
}

/** Fired with the ids of badges that have just been earned. */
export const BADGE_UNLOCK_EVENT = "dc_badge_unlock";

function announceBadges(badgeIds: string[]) {
  if (badgeIds.length === 0 || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BADGE_UNLOCK_EVENT, { detail: badgeIds }));
}

interface ServerProfilePayload {
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  tier: string;
  settings?: Record<string, unknown>;
  completedStops?: string[];
  unlockedBadges?: string[];
  createdAt?: string | null;
  handle?: string | null;
  emblem?: string | null;
  leaderboardHidden?: boolean;
  longestStreak?: number;
}

/** Synchronizes the client profile cache with the database. */
async function syncProfileFromApi() {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = await res.json();
    const serverProfile = data.profile as ServerProfilePayload | null;
    if (!serverProfile) return;

    // Remember guest progress before the account's profile replaces it, so the
    // learner can choose to bring it into their account.
    const owner = safeGet(OWNER_KEY);
    if (!owner || owner === "guest") {
      const guest = readCachedProfile();
      const serverStops = new Set(serverProfile.completedStops || []);
      const newKeys = (guest?.completedStops || []).filter((k) => !serverStops.has(k));
      if (newKeys.length > 0) {
        safeSet(GUEST_MERGE_KEY, JSON.stringify(newKeys));
        window.dispatchEvent(new Event(GUEST_MERGE_EVENT));
      }
    }

    const settings = serverProfile.settings || {};
    const merged: UserProfile = {
      name: serverProfile.name,
      initial: serverProfile.name.charAt(0).toUpperCase() || "D",
      level: Math.floor(serverProfile.xp / XP_PER_LEVEL) + 1,
      xp: serverProfile.xp % XP_PER_LEVEL,
      xpNext: XP_PER_LEVEL,
      streak: serverProfile.streak,
      lastActiveDate: serverProfile.lastActiveDate,
      unlockedBadges: serverProfile.unlockedBadges || [],
      weekActivity: Array.isArray(settings.weekActivity) ? (settings.weekActivity as number[]) : [0, 0, 0, 0, 0, 0, 0],
      weekStart: typeof settings.weekStart === "string" ? settings.weekStart : null,
      dayDate: typeof settings.dayDate === "string" ? settings.dayDate : null,
      dayCount: typeof settings.dayCount === "number" ? settings.dayCount : 0,
      longestStreak: typeof serverProfile.longestStreak === "number" ? serverProfile.longestStreak : serverProfile.streak,
      handle: serverProfile.handle ?? null,
      emblem: serverProfile.emblem ?? null,
      leaderboardHidden: serverProfile.leaderboardHidden === true,
      soundsEnabled: settings.soundsEnabled !== false,
      guideEnabled: settings.guideEnabled !== false,
      remindersEnabled: settings.remindersEnabled === true,
      completedStops: serverProfile.completedStops || [],
      activeTrack: isTrackId(settings.activeTrack) ? settings.activeTrack : "python",
      tier: serverProfile.tier === "pro" ? "pro" : "free",
      createdAt: serverProfile.createdAt ?? null,
    };

    safeSet(PROFILE_KEY, JSON.stringify(merged));
    if (currentUserId) safeSet(OWNER_KEY, currentUserId);
    window.dispatchEvent(new Event("dc_profile_change"));

    if (isTrackId(settings.activeTrack)) {
      safeSet("dc_active_track", settings.activeTrack);
      window.dispatchEvent(new Event("dc_track_change"));
    }
  } catch (e) {
    console.error("Failed to sync profile from API", e);
  }
}

function readCachedProfile(): UserProfile | null {
  const saved = safeGet(PROFILE_KEY);
  if (!saved) return null;
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  } catch {
    return null;
  }
}

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const cached = readCachedProfile();
  if (cached) return cached;
  const initialProfile: UserProfile = { ...DEFAULT_PROFILE };
  saveUserProfile(initialProfile);
  if (!safeGet(OWNER_KEY)) safeSet(OWNER_KEY, "guest");
  return initialProfile;
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  safeSet(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("dc_profile_change"));
}

function settingsPayload(profile: UserProfile) {
  return {
    soundsEnabled: profile.soundsEnabled,
    guideEnabled: profile.guideEnabled,
    remindersEnabled: profile.remindersEnabled,
    activeTrack: profile.activeTrack || safeGet("dc_active_track") || "python",
  };
}

/**
 * Spends XP (e.g. the cost of a Dream Guide hint). Clamped so total XP never
 * goes below zero; level is re-derived from the remaining total.
 */
export function spendXP(amount: number): UserProfile {
  const profile = getUserProfile();
  const cost = Math.max(0, Math.floor(amount));
  const totalXp = Math.max(0, (profile.level - 1) * XP_PER_LEVEL + profile.xp - cost);
  profile.level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  profile.xp = totalXp % XP_PER_LEVEL;
  saveUserProfile(profile);

  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/spend-xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cost }),
    }).catch((err) => console.error("Failed to sync XP spend", err));
  }
  return profile;
}

/** Adds XP, re-derives the level and records it on today's bar of the week chart. */
function addXp(profile: UserProfile, xp: number) {
  if (xp <= 0) return;
  const total = (profile.level - 1) * XP_PER_LEVEL + profile.xp + xp;
  profile.level = Math.floor(total / XP_PER_LEVEL) + 1;
  profile.xp = total % XP_PER_LEVEL;
  withTodayXp(profile, xp);
}

function applyStreak(profile: UserProfile, today: string) {
  if (!profile.lastActiveDate) {
    profile.streak = 1;
  } else {
    const gap = daysBetween(profile.lastActiveDate, today);
    if (gap === 1) profile.streak += 1;
    else if (gap > 1) profile.streak = 1;
    else if (gap < 0) return; // clock moved backwards: leave the streak alone
  }
  profile.lastActiveDate = today;
  profile.longestStreak = Math.max(profile.longestStreak || 0, profile.streak);
}

export interface CompletionResult {
  profile: UserProfile;
  /** False when the activity was already complete (no XP was awarded). */
  isNew: boolean;
  xp: number;
  newBadges: string[];
  leveledUp: boolean;
}

/**
 * Completes and rewards an authored activity as one idempotent client action.
 * Replaying an already-completed lesson/challenge/project never grants XP.
 * The server independently looks up the reward and ignores client-supplied XP.
 */
export function completeActivity(activityKey: string): CompletionResult {
  const profile = getUserProfile();
  const catalog = getClientCatalog();
  const reward = catalog ? getActivityReward(activityKey, catalog) : null;
  if (!reward) {
    console.error(`Unknown reward activity: ${activityKey}`);
    return { profile, isNew: false, xp: 0, newBadges: [], leveledUp: false };
  }
  if ((profile.completedStops || []).includes(activityKey)) {
    return { profile, isNew: false, xp: 0, newBadges: [], leveledUp: false };
  }

  const levelBefore = profile.level;
  const now = new Date();
  const today = localDate(now);
  // How long they were away, measured before today's activity lands.
  const daysAway = profile.lastActiveDate ? Math.max(0, daysBetween(profile.lastActiveDate, today)) : 0;
  profile.completedStops = [...(profile.completedStops || []), activityKey];
  addXp(profile, reward.xp);
  applyStreak(profile, today);
  profile.dayCount = (profile.dayDate === today ? profile.dayCount : 0) + 1;
  profile.dayDate = today;

  // Badges are earned from the learner's whole history, so they are evaluated
  // after the completion lands. The server does the same and wins any argument.
  const earned = catalog
    ? evaluateBadges(
        badgeSnapshot(profile, {
          daysAway,
          ...(isLessonActivity(activityKey, catalog) ? { lessonHour: now.getHours() } : {}),
        }),
        catalog,
        profile.unlockedBadges,
      )
    : [];
  if (earned.length > 0) {
    profile.unlockedBadges = [...profile.unlockedBadges, ...earned];
    addXp(profile, badgeXp(earned, catalog!));
  }
  saveUserProfile(profile);
  announceBadges(earned);

  if (isUserSignedIn && isSupabaseConfigured()) {
    const localHour = now.getHours();
    const clientDate = localDate(now);
    activitySyncQueue = activitySyncQueue.then(async () => {
      try {
        await fetch("/api/complete-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityKey, localHour, clientDate }),
        });
        await syncProfileFromApi();
      } catch (error) {
        console.error("Failed to sync completed activity", error);
      }
    });
  }

  return {
    profile,
    isNew: true,
    xp: reward.xp + (catalog ? badgeXp(earned, catalog) : 0),
    newBadges: earned,
    leveledUp: profile.level > levelBefore,
  };
}

/** Sends the learner's guest completions to their account (server validates each). */
export async function acceptGuestMerge(): Promise<number> {
  const raw = safeGet(GUEST_MERGE_KEY);
  safeRemove(GUEST_MERGE_KEY);
  window.dispatchEvent(new Event(GUEST_MERGE_EVENT));
  if (!raw || !isUserSignedIn) return 0;
  let keys: string[] = [];
  try {
    keys = (JSON.parse(raw) as unknown[]).filter((k): k is string => typeof k === "string").slice(0, 400);
  } catch {
    return 0;
  }
  if (keys.length === 0) return 0;
  const now = new Date();
  const res = await fetch("/api/complete-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityKeys: keys, localHour: now.getHours(), clientDate: localDate(now) }),
  });
  await syncProfileFromApi();
  if (!res.ok) return 0;
  const data = await res.json().catch(() => ({}));
  return typeof data.awarded === "number" ? data.awarded : 0;
}

export function declineGuestMerge() {
  safeRemove(GUEST_MERGE_KEY);
  window.dispatchEvent(new Event(GUEST_MERGE_EVENT));
}

export function pendingGuestMergeCount(): number {
  const raw = safeGet(GUEST_MERGE_KEY);
  if (!raw) return 0;
  try {
    const keys = JSON.parse(raw);
    return Array.isArray(keys) ? keys.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Updates settings-like profile values (name, sound, guide, reminders, track).
 * XP, streak and badges are never written this way.
 */
export function updateProfile(updates: Partial<Pick<UserProfile, "name" | "soundsEnabled" | "guideEnabled" | "remindersEnabled" | "activeTrack">>): UserProfile {
  const profile = getUserProfile();
  const updated: UserProfile = { ...profile, ...updates };
  if (updates.name !== undefined) updated.initial = updates.name.charAt(0).toUpperCase() || "D";
  saveUserProfile(updated);

  if (isUserSignedIn && isSupabaseConfigured()) {
    const patchBody: { name?: string; settings: ReturnType<typeof settingsPayload> } = {
      settings: settingsPayload(updated),
    };
    if (updates.name !== undefined) patchBody.name = updates.name;
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchBody),
    }).catch((err) => console.error("Failed to patch profile updates", err));
  }
  return updated;
}

/**
 * Records a code submission (and evaluates the Test Tamer / Bug Catcher badges).
 * Returns the badge ids newly earned on this device.
 */
/** Handles are lowercase, 3 to 20 characters, letters, digits and underscores. */
export const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;

export function normalizeHandle(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, "");
}

/**
 * Claims a public handle. The server owns uniqueness, so a handle is only truly
 * taken once it answers; a guest keeps it locally until they sign in.
 */
export async function setHandle(raw: string): Promise<{ ok: boolean; error?: string }> {
  const handle = normalizeHandle(raw);
  if (!HANDLE_PATTERN.test(handle)) {
    return { ok: false, error: "Three to twenty characters: letters, numbers and underscores." };
  }

  if (isUserSignedIn && isSupabaseConfigured()) {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body.error === "handle reserved" ? "That handle is reserved. Try another." : "That handle is taken. Try another." };
      }
      if (!res.ok) return { ok: false, error: "Could not save that handle. Try again." };
      await syncProfileFromApi();
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach the server. Try again." };
    }
  }

  saveUserProfile({ ...getUserProfile(), handle });
  return { ok: true };
}

/** Wears an earned badge as the learner's emblem, or takes it off with null. */
export function setEmblem(badgeId: string | null): UserProfile {
  const profile = getUserProfile();
  // A learner can only wear what they have earned.
  if (badgeId !== null && !profile.unlockedBadges.includes(badgeId)) return profile;
  const updated: UserProfile = { ...profile, emblem: badgeId };
  saveUserProfile(updated);
  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emblem: badgeId }),
    }).catch((err) => console.error("Failed to save emblem", err));
  }
  return updated;
}

/** Hides or shows the learner on the leaderboard. */
export function setLeaderboardHidden(hidden: boolean): UserProfile {
  const profile = getUserProfile();
  const updated: UserProfile = { ...profile, leaderboardHidden: hidden };
  saveUserProfile(updated);
  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaderboardHidden: hidden }),
    }).catch((err) => console.error("Failed to save leaderboard visibility", err));
  }
  return updated;
}

export function recordSubmission(slug: string, code: string, passed: boolean): string[] {
  if (typeof window === "undefined") return [];

  const profile = getUserProfile();
  const catalog = getClientCatalog();
  const failureKey = `dc_failed:${slug}`;
  const failedBefore = safeGet(failureKey) === "1";
  if (!passed) safeSet(failureKey, "1");

  const earned = catalog
    ? evaluateBadges(
        badgeSnapshot(profile, {
          submission: { failed: !passed, failThenPass: passed && failedBefore, firstTry: passed && !failedBefore },
        }),
        catalog,
        profile.unlockedBadges,
      )
    : [];
  if (earned.length > 0) {
    profile.unlockedBadges = [...profile.unlockedBadges, ...earned];
    addXp(profile, badgeXp(earned, catalog!));
    saveUserProfile(profile);
    announceBadges(earned);
  }

  if (isSupabaseConfigured() && isUserSignedIn) {
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, code: code.slice(0, 20_000), passed }),
    }).catch((err) => console.error("Failed to sync submission to API", err));
  }
  return earned;
}

/**
 * React hook to access and subscribe to real-time user profile state updates.
 * `ready` is false until the cached profile has been read on the client, so pages
 * can avoid flashing zero-state numbers.
 */
export function useUserProfile() {
  const [state, setState] = useState<{ profile: UserProfile; ready: boolean }>({
    profile: DEFAULT_PROFILE,
    ready: false,
  });

  useEffect(() => {
    const apply = () => setState({ profile: getUserProfile(), ready: true });
    const t = setTimeout(apply, 0);
    const handleEvent = () => setTimeout(apply, 0);
    window.addEventListener("dc_profile_change", handleEvent);
    window.addEventListener("storage", handleEvent);
    return () => {
      clearTimeout(t);
      window.removeEventListener("dc_profile_change", handleEvent);
      window.removeEventListener("storage", handleEvent);
    };
  }, []);

  return { profile: state.profile, ready: state.ready, updateProfile };
}

/**
 * React hook that tracks whether a Supabase session is currently active. Used to
 * gate signed-in-only features (like the Dream Guide) in the UI.
 */
export function useIsSignedIn(): boolean {
  return useAuthState().signedIn;
}

/** Sign-in state plus whether the initial session check has finished. */
export function useAuthState(): { signedIn: boolean; resolved: boolean } {
  const [state, setState] = useState({ signedIn: false, resolved: false });

  useEffect(() => {
    const apply = () => setTimeout(() => setState({ signedIn: isUserSignedIn, resolved: authResolved }), 0);
    apply();
    window.addEventListener("dc_auth_change", apply);
    return () => window.removeEventListener("dc_auth_change", apply);
  }, []);

  return state;
}
