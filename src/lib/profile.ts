"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface UserProfile {
  name: string;
  initial: string;
  level: number;
  xp: number; // XP within current level
  xpNext: number; // XP required for next level (always 800)
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  unlockedBadges: string[];
  weekActivity: number[]; // XP earned Mon..Sun
  soundsEnabled: boolean;
  guideEnabled: boolean;
  remindersEnabled: boolean;
  completedStops: string[];
  activeTrack?: string;
  tier: "free" | "pro";
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Dreamer",
  initial: "D",
  level: 4,
  xp: 540,
  xpNext: 800,
  streak: 7,
  lastActiveDate: null,
  unlockedBadges: ["first-loop", "bug-catcher", "cloud-hopper", "streak-keeper", "sky-builder"],
  weekActivity: [20, 45, 15, 60, 30, 75, 40],
  soundsEnabled: true,
  guideEnabled: true,
  remindersEnabled: true,
  completedStops: ["variables", "strings", "js-variables"],
  activeTrack: "python",
  tier: "free",
};

let isUserSignedIn = false;
let supabase: ReturnType<typeof createClient> | null = null;

/** Updates the cached sign-in flag and notifies listeners when it changes. */
function setSignedIn(value: boolean) {
  const changed = isUserSignedIn !== value;
  isUserSignedIn = value;
  if (changed && typeof window !== "undefined") {
    window.dispatchEvent(new Event("dc_auth_change"));
  }
}

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase = createClient();
  // Check active session on startup
  supabase.auth.getSession().then(({ data }) => {
    setSignedIn(!!data.session);
    if (isUserSignedIn) {
      syncProfileFromApi();
    }
  });
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    setSignedIn(!!session);
    if (isUserSignedIn) {
      syncProfileFromApi();
    }
  });
}

/** Whether a Supabase session is currently active. */
export function getIsSignedIn(): boolean {
  return isUserSignedIn;
}

/** Synchronizes the client profile cache with the database. */
async function syncProfileFromApi() {
  try {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        const serverProfile = data.profile;
        const profile = getUserProfile();
        const settings = serverProfile.settings || {};
        
        const merged: UserProfile = {
          name: serverProfile.name,
          initial: serverProfile.name.charAt(0).toUpperCase() || "D",
          level: serverProfile.level,
          xp: serverProfile.xp % 800,
          xpNext: 800,
          streak: serverProfile.streak,
          lastActiveDate: serverProfile.lastActiveDate,
          unlockedBadges: serverProfile.unlockedBadges || [],
          weekActivity: settings.weekActivity || profile.weekActivity,
          soundsEnabled: settings.soundsEnabled !== false,
          guideEnabled: settings.guideEnabled !== false,
          remindersEnabled: settings.remindersEnabled !== false,
          completedStops: serverProfile.completedStops || [],
          activeTrack: settings.activeTrack || "python",
          tier: serverProfile.tier === "pro" ? "pro" : "free",
        };
        
        localStorage.setItem("dc_user_profile", JSON.stringify(merged));
        window.dispatchEvent(new Event("dc_profile_change"));

        // Sync track setting if saved on server
        if (settings.activeTrack === "python" || settings.activeTrack === "javascript") {
          localStorage.setItem("dc_active_track", settings.activeTrack);
          window.dispatchEvent(new Event("dc_track_change"));
        }
      }
    }
  } catch (e) {
    console.error("Failed to sync profile from API", e);
  }
}

function getTodayString(): string {
  const date = new Date();
  // Adjust for local time zone
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split("T")[0];
}

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem("dc_user_profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse user profile", e);
  }

  const initialProfile = {
    ...DEFAULT_PROFILE,
    lastActiveDate: getTodayString(),
  };
  saveUserProfile(initialProfile);
  return initialProfile;
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("dc_user_profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("dc_profile_change"));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
}

/**
 * Adds XP to the profile, handles level ups, and logs the XP in the weekly chart.
 */
export function addXP(amount: number): UserProfile {
  const profile = getUserProfile();
  
  let newXp = profile.xp + amount;
  let newLevel = profile.level;
  
  while (newXp >= profile.xpNext) {
    newXp -= profile.xpNext;
    newLevel += 1;
  }
  
  profile.xp = newXp;
  profile.level = newLevel;

  const dayOfWeek = new Date().getDay();
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const activity = [...profile.weekActivity];
  activity[dayIndex] = (activity[dayIndex] || 0) + amount;
  profile.weekActivity = activity;

  updateStreakInPlace(profile);

  saveUserProfile(profile);

  // Sync to database if logged in
  if (isUserSignedIn && isSupabaseConfigured()) {
    const totalXp = (newLevel - 1) * 800 + newXp;
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xp: totalXp,
        streak: profile.streak,
        lastActiveDate: profile.lastActiveDate,
        settings: {
          soundsEnabled: profile.soundsEnabled,
          guideEnabled: profile.guideEnabled,
          remindersEnabled: profile.remindersEnabled,
          weekActivity: profile.weekActivity,
          activeTrack: profile.activeTrack || localStorage.getItem("dc_active_track") || "python",
        },
      }),
    }).catch((err) => console.error("Failed to patch profile XP", err));
  }

  return profile;
}

/**
 * Spends XP (e.g. the cost of a Dream Guide hint). Clamped so total XP never
 * goes below zero; level is re-derived from the remaining total.
 */
export function spendXP(amount: number): UserProfile {
  const profile = getUserProfile();
  const cost = Math.max(0, Math.floor(amount));

  let totalXp = (profile.level - 1) * 800 + profile.xp;
  totalXp = Math.max(0, totalXp - cost);

  profile.level = Math.floor(totalXp / 800) + 1;
  profile.xp = totalXp % 800;

  saveUserProfile(profile);

  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: totalXp }),
    }).catch((err) => console.error("Failed to sync XP spend", err));
  }

  return profile;
}

/**
 * Unlocks a badge in the user profile.
 */
export function unlockBadge(badgeId: string): UserProfile {
  const profile = getUserProfile();
  if (!profile.unlockedBadges.includes(badgeId)) {
    profile.unlockedBadges = [...profile.unlockedBadges, badgeId];
    saveUserProfile(profile);

    if (isUserSignedIn && isSupabaseConfigured()) {
      fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeId }),
      }).catch((err) => console.error("Failed to sync badge to API", err));
    }
  }
  return profile;
}

/**
 * Records a completed stop (lesson or challenge slug) in the profile.
 */
export function completeStop(slug: string): UserProfile {
  const profile = getUserProfile();
  const completed = profile.completedStops || [];
  if (!completed.includes(slug)) {
    profile.completedStops = [...completed, slug];
    saveUserProfile(profile);

    if (isUserSignedIn && isSupabaseConfigured()) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch((err) => console.error("Failed to sync progress to API", err));
    }
  }
  return profile;
}

function updateStreakInPlace(profile: UserProfile) {
  const todayStr = getTodayString();
  const lastActive = profile.lastActiveDate;

  if (!lastActive) {
    profile.streak = 1;
    profile.lastActiveDate = todayStr;
    return;
  }

  if (lastActive === todayStr) {
    return; // Already active today
  }

  const lastDate = new Date(lastActive);
  const todayDate = new Date(todayStr);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    profile.streak += 1;
  } else if (diffDays > 1) {
    profile.streak = 1;
  }
  
  profile.lastActiveDate = todayStr;
}

/**
 * Updates any user profile values.
 */
export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const profile = getUserProfile();
  
  if (updates.name !== undefined) {
    updates.initial = updates.name.charAt(0).toUpperCase() || "D";
  }
  
  const updated = { ...profile, ...updates };
  saveUserProfile(updated);

  if (isUserSignedIn && isSupabaseConfigured()) {
    const patchBody: {
      name?: string;
      xp?: number;
      streak?: number;
      lastActiveDate?: string | null;
      settings?: {
        soundsEnabled: boolean;
        guideEnabled: boolean;
        remindersEnabled: boolean;
        weekActivity: number[];
        activeTrack: string;
      };
    } = {};
    if (updates.name !== undefined) patchBody.name = updates.name;
    if (updates.xp !== undefined || updates.level !== undefined) {
      const targetLevel = updates.level !== undefined ? updates.level : updated.level;
      const targetXp = updates.xp !== undefined ? updates.xp : updated.xp;
      patchBody.xp = (targetLevel - 1) * 800 + targetXp;
    }
    if (updates.streak !== undefined) patchBody.streak = updates.streak;
    if (updates.lastActiveDate !== undefined) patchBody.lastActiveDate = updates.lastActiveDate;
    
    patchBody.settings = {
      soundsEnabled: updated.soundsEnabled,
      guideEnabled: updated.guideEnabled,
      remindersEnabled: updated.remindersEnabled,
      weekActivity: updated.weekActivity,
      activeTrack: updated.activeTrack || localStorage.getItem("dc_active_track") || "python",
    };

    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchBody),
    }).catch((err) => console.error("Failed to patch profile updates", err));
  }

  return updated;
}

/**
 * Records a code submission to the database.
 */
export function recordSubmission(slug: string, code: string, passed: boolean) {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;

  if (isUserSignedIn) {
    fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, code, passed }),
    }).catch((err) => console.error("Failed to sync submission to API", err));
  }
}

/**
 * React hook to access and subscribe to real-time user profile state updates.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setTimeout(() => {
      setProfile(getUserProfile());
    }, 0);

    const handleEvent = () => {
      setTimeout(() => {
        setProfile(getUserProfile());
      }, 0);
    };
    window.addEventListener("dc_profile_change", handleEvent);
    return () => window.removeEventListener("dc_profile_change", handleEvent);
  }, []);

  const triggerAddXp = useCallback((amount: number) => {
    return addXP(amount);
  }, []);

  const triggerUnlockBadge = useCallback((badgeId: string) => {
    return unlockBadge(badgeId);
  }, []);

  const triggerUpdateProfile = useCallback((updates: Partial<UserProfile>) => {
    return updateProfile(updates);
  }, []);

  const triggerCompleteStop = useCallback((slug: string) => {
    return completeStop(slug);
  }, []);

  return {
    profile,
    addXP: triggerAddXp,
    unlockBadge: triggerUnlockBadge,
    updateProfile: triggerUpdateProfile,
    completeStop: triggerCompleteStop,
  };
}

/**
 * React hook that tracks whether a Supabase session is active. Used to gate
 * signed-in-only features (like the Dream Guide) in the UI.
 */
export function useIsSignedIn(): boolean {
  const [signedIn, setSignedInState] = useState(false);

  useEffect(() => {
    const apply = () => setTimeout(() => setSignedInState(isUserSignedIn), 0);
    apply();
    window.addEventListener("dc_auth_change", apply);
    return () => window.removeEventListener("dc_auth_change", apply);
  }, []);

  return signedIn;
}
