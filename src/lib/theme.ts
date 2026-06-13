/**
 * dreamcode theme knobs - tweak freely.
 *
 * gradientOpacity: how strongly the pastel gradient (#6E8FC7 → #F0AABE)
 * covers the background photo on each page.
 *   0   = photo fully visible, no tint
 *   0.5 = dreamy haze, photo clearly visible
 *   1   = solid gradient, photo hidden
 *
 * Each page reads its own value, so you can tune them independently.
 */
export const gradientOpacity = {
  home: 0.9, //       / - Neon Dusk hero (photo: bg-dusk-neon-clouds-1)
  lessons: 0.9, //    /lessons - Sunset Stops (photo: bg-hero-cloudsea-sunset)
  badges: 0.95, //    /badges - Neon Collection (photo: bg-rainbow-cloud-2)
  challenge: 0.75, // /challenge/* - Rainbow Peak (photo: bg-rainbow-cloud-1)
  auth: 0.9, //       /login + /signup - Doorway (photo: bg-doorway-clouds-1)
};

/**
 * cloudOpacityBoost: GLOBAL multiplier for every floating cloud cutout (0-1.5).
 * Raise it to make all drifting clouds across the whole site more visible.
 */
export const cloudOpacityBoost = 1.15;

/**
 * cloudOpacity: PER-PAGE cloud visibility, on top of the global boost.
 * Every page is here - dial each one independently.
 *   1   = as authored
 *   1.4 = clouds pop much more
 *   0.3 = faint, ghostly clouds
 *
 * Note: on /home this controls only the clouds in the scrollable story
 * below the hero. The hero's own clouds sit with the photo and are left alone.
 */
export const cloudOpacity = {
  home: 0.1,
  lessons: 1,
  badges: 1,
  journey: 0.1,
  dashboard: 0.1,
  peaks: 0.3,
  projects: 0.8,
  lesson: 0.15,
  practice: 0.6,
  review: 0.2,
  challenge: 0.8,
  profile: 0.3,
  auth: 0.8,
};
