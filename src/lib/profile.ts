"use client";

import { useState, useEffect, useCallback } from "react";

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
};

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
      // Ensure it has all required properties
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse user profile", e);
  }

  // If new user, set lastActiveDate to today but initialize streak to 7 for consistency with demo
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
  
  // Add to total/current XP
  let newXp = profile.xp + amount;
  let newLevel = profile.level;
  
  while (newXp >= profile.xpNext) {
    newXp -= profile.xpNext;
    newLevel += 1;
  }
  
  profile.xp = newXp;
  profile.level = newLevel;

  // Update weekly activity chart
  // getDay() is 0 for Sunday, 1 for Monday... 6 for Saturday.
  // We want Mon=0, Tue=1... Sun=6.
  const dayOfWeek = new Date().getDay();
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const activity = [...profile.weekActivity];
  activity[dayIndex] = (activity[dayIndex] || 0) + amount;
  profile.weekActivity = activity;

  // Also update streak since user did an activity
  updateStreakInPlace(profile);

  saveUserProfile(profile);
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

  // Calculate day difference
  const lastDate = new Date(lastActive);
  const todayDate = new Date(todayStr);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    profile.streak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    profile.streak = 1;
  }
  
  profile.lastActiveDate = todayStr;
}

/**
 * Updates any user profile values.
 */
export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const profile = getUserProfile();
  const updated = { ...profile, ...updates };
  saveUserProfile(updated);
  return updated;
}

/**
 * React hook to access and subscribe to real-time user profile state updates.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    // Initial fetch on mount
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
