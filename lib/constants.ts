/**
 * Shared, hero-related constants used by Hero.tsx (which owns both pinned
 * scroll sequences). Header.tsx doesn't need anything from here — it uses
 * its own independent sticky-release height.
 */

/** Height (in vh) of the hero's DESKTOP scroll "runway" — how much scrolling
 * it takes to play through the full pinned phase sequence (On ear fade,
 * Beats 3/Overview shift, Add to Bag reveal) before the page un-pins. */
export const HERO_RUNWAY_HEIGHT_VH = 220;

/** Height (in svh) of the hero's MOBILE scroll runway. The pinned section is
 * one screen tall, so the sequence plays over roughly (this − 100)svh of
 * scrolling — about three-quarters of a screen at 170. `svh` (not `vh`) so
 * the runway doesn't jump when the mobile browser's toolbar shows or hides. */
export const HERO_MOBILE_RUNWAY_HEIGHT_SVH = 170;