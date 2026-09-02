# Beats Landing Page — Next.js + TypeScript

Rebuilt from the original HTML/CSS/JS project with identical UI, UX, animations, and transitions.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Drop in your images

The project references your existing image filenames directly — just copy them into these folders and everything renders automatically, no code changes needed:

```
public/images/content/
  header-headphone-bkg.png
  specs-headphones-bkg.png
  case-headphone-case-bkg.png
  sale-headphones-collapse-bkg.png
  headphone-1.png
  headphone-2.png
  headphone-3.png
  headphone-4.png
  headphone-5.png

public/images/brands/
  apple.png
  spotify.png
  amazon.png
  youtube.png

public/images/favicons/
  apple-touch-icon.png
  favicon-32x32.png
  favicon-16x16.png
```

## What changed under the hood (behavior is identical)

| Original | Replaced with |
|---|---|
| AOS.js (`data-aos` attributes) | `components/ui/Reveal.tsx` + `AnimatedHeading.tsx` — Framer Motion `whileInView`, same durations/delays/offsets |
| simpleParallax.js | `components/ui/ParallaxImage.tsx` — Framer Motion `useScroll`/`useTransform`, same per-image scale + direction settings |
| Mouse-follow light glow (`app.js`) | `components/ui/MouseLightEffect.tsx` — same `--mouse-x`/`--mouse-y` CSS var approach |
| Repeated copy-pasted markup (specs, products, footer links, socials) | `lib/data.ts` — typed arrays, mapped over in each section |
| `<link>` Google Fonts tag | `next/font/google` (self-hosted Poppins, no external request) |
| Plain `<form>` with no handler | `components/ui/SubscribeForm.tsx` — dummy, client-side email validation only (react-hook-form + zod), no network call |
| Two near-duplicate HTML files (`index.html` / dist copy) | One `app/page.tsx`, Next.js handles the production build |

## Notes

- Decorative/product images use plain `<img>` (not `next/image`) since their real dimensions aren't known yet — once you drop in your images, ask to swap these to `next/image` for automatic optimization if you want it.
- `prefers-reduced-motion` is respected globally (added in `globals.css`), which the original didn't have.
- The email subscribe form is intentionally a dummy — wire `onSubmit` in `SubscribeForm.tsx` to a real API route when you're ready.
