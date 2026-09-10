import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  // Touch devices don't have a real mouse to hover with, but many mobile
  // browsers SIMULATE `:hover` on tap anyway — for legacy sites built only
  // for mouse input, so they still get some visual feedback. Since there's
  // no mouse to move away afterward, that simulated hover can just stay
  // matched indefinitely (until the next unrelated tap elsewhere on the
  // page) — which is exactly what was happening to the social icons and
  // back-to-top button: `hover:bg-white hover:text-black` were genuinely
  // still matching after the tap, nothing to do with the app's own
  // `active:`/pointer-event logic at all.
  //
  // `hoverOnlyWhenSupported: true` makes every `hover:` utility across the
  // WHOLE app compile against the CSS media feature `(hover: hover)`
  // instead of plain `:hover`. That media feature specifically detects
  // real hover capability (an actual mouse/trackpad) — true on desktop,
  // false on touch — so desktop's hover behavior is provably unaffected
  // (it still has real hover capability, so `hover:` still applies exactly
  // as before), while touch devices simply never match `hover:` styles at
  // all, so they can no longer get stuck showing them. Available since
  // Tailwind 3.4 (this project is on ^3.4.7). This is a global config
  // change rather than a per-element fix specifically because the same
  // `hover:` pattern is used throughout the app (Header's nav, Products'
  // cards, Case's button, etc.) — all equally exposed to this on touch,
  // not just the two elements that happened to surface it first.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      transitionProperty: {
        text: "font-size",
      },
      screens: {
        "593": "593px",
        "948": "948px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
