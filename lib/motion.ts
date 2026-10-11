/**
 * Animation easing curves shared across the whole site, so each one lives in
 * exactly one place.
 */

/** The cubic-bezier behind the original AOS animations (CSS "ease"). Used by every scroll-triggered reveal. */
export const AOS_DEFAULT_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

/** A snappier ease-out-expo curve for direct tap interactions (popovers, sheets), as opposed to scroll-triggered reveals. */
export const POPOVER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];