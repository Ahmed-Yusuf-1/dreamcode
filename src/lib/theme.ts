/**
 * dreamcode theme knobs. Colours for both skies (Sunset Arcade and Midnight
 * Focus) live as tokens in src/app/globals.css; these are the per-page dials.
 *
 * gradientOpacity: how strongly the pastel wash covers the home hero photo.
 *   0 = photo fully visible, 1 = solid wash.
 */
export const gradientOpacity = {
  home: 0.9,
};

/**
 * cloudOpacityBoost: GLOBAL multiplier for every floating cloud cutout (0-1.5).
 */
export const cloudOpacityBoost = 1.15;

/**
 * cloudOpacity: per-page cloud visibility on top of the global boost.
 *   1 = as authored, 1.4 = clouds pop more, 0.3 = faint and ghostly.
 */
export const cloudOpacity = {
  home: 0.4,
  lessons: 1,
  badges: 1,
  journey: 0.5,
  dashboard: 0.42,
  peaks: 0.6,
  projects: 0.85,
  lesson: 0.4,
  practice: 0.65,
  review: 0.42,
  challenge: 0.6,
  profile: 0.5,
  auth: 0.8,
};
