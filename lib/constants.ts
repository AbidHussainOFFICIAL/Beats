/**
 * Shared, hero-related constant used by Hero.tsx (which owns the pinned
 * scroll sequence). Header.tsx no longer needs anything from here — it
 * measures the runway element directly in the DOM instead of computing an
 * approximation of its geometry via constants.
 */

/** Height (in vh) of the hero's scroll "runway" — how much scrolling it
 * takes to play through the full pinned phase sequence (On ear fade,
 * Beats 3/Overview shift, Add to Bag reveal) before the page un-pins. */
export const HERO_RUNWAY_HEIGHT_VH = 220;