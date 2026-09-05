"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { CloseIcon, SubscribeArrowIcon } from "@/components/icons";
import { useLenis } from "@/components/providers/LenisProvider";

const subscribeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type SubscribeValues = z.infer<typeof subscribeSchema>;

// A snappier, more energetic curve than the AOS_DEFAULT_EASE used
// elsewhere in the app — intentional here: this is a direct-response tap
// interaction (open a popover), not a scroll-triggered content reveal, so
// it's given its own punchier easeOutExpo-style motion.
const POPOVER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Dummy subscribe form — validates the email client-side only.
 * No network request is made; wire `onSubmit` up to a real API route
 * (Mailchimp / ConvertKit / Resend, etc.) when you're ready.
 *
 * DESKTOP (lg+): the original always-editable inline bar, completely
 * unchanged — see DesktopSubscribeBar below, which is the exact same code
 * this file always had, just relocated into its own named block.
 *
 * MOBILE (<lg): the bar becomes a tap-only trigger (see
 * MobileSubscribeTrigger) that opens a real, independent form inside a
 * popover (MobileSubscribePopover) anchored just above wherever the
 * trigger actually is on screen. The two are intentionally NOT sharing
 * one underlying form/component — that keeps mobile's popover logic from
 * having any way to affect desktop's bar, at the cost of a little
 * duplicated (very small) form code.
 */
export default function SubscribeForm() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopSubscribeBar />
      </div>
      <div className="lg:hidden">
        <MobileSubscribeTrigger />
      </div>
    </>
  );
}

/** Unchanged from the original file — same markup, same classes, same
 * behavior. Only the function name changed (was the default export's
 * entire body). */
function DesktopSubscribeBar() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeValues>({ resolver: zodResolver(subscribeSchema) });

  const onSubmit = (_values: SubscribeValues) => {
    // Dummy: no API call. Replace this with a real POST when ready.
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex items-center justify-between bg-[#181A1B] rounded-lg py-2 px-4"
      >
        <div className="flex-1 mr-2">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Email"
            className="block w-full outline-none outline-0 border-none border-0 border-transparent bg-transparent caret-white placeholder-[#BDC0C2] focus:border-transparent focus:bg-transparent focus:text-white focus:placeholder-gray-500 focus:outline-none focus:ring-0 focus:ring-transparent focus:placeholder:text-transparent font-light text-[0.9375rem]"
            {...register("email")}
          />
        </div>

        <button
          type="submit"
          className="group relative flex bg-[#0A0A0B] min-w-[8.125rem] w-[8.125rem] h-[3.1875rem] rounded-lg overflow-hidden border border-transparent hover:border-[#3F3F45] transition-all duration-700"
          style={{ willChange: "transform" }}
        >
          <span className="flex justify-center items-center h-full w-full transform group-hover:-translate-x-[14px] transition-transform cursor-pointer duration-700">
            Subscribe
          </span>
          <span className="absolute top-0 -right-[30px] group-hover:-right-0 h-full flex justify-center items-center px-1.5 bg-[#29292D] transition-all cursor-pointer duration-700">
            <SubscribeArrowIcon />
          </span>
        </button>
      </form>

      {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
      {submitted && !errors.email && <p className="mt-2 text-xs text-[#BDC0C2]">Thanks — you&apos;re on the list.</p>}
    </div>
  );
}

interface AnchorRect {
  top: number;
  left: number;
  width: number;
}

const POPOVER_GAP_PX = 12; // gap between the popover's bottom edge and the trigger's top edge
const POPOVER_MAX_WIDTH_PX = 416; // 26rem — keeps it from getting absurdly wide on tablet-width "mobile"

/** The visually-identical bar, but non-editable directly — the whole thing
 * is a single tap target that opens MobileSubscribePopover. */
function MobileSubscribeTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const measureAnchor = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchorRect({ top: rect.top, left: rect.left, width: rect.width });
  };

  const open = () => {
    measureAnchor();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // Return focus to the trigger once the popover closes, so keyboard users
  // land back where they started.
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) triggerRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full bg-[#181A1B] rounded-lg py-2 px-4 text-left active:scale-[0.98] transition-transform"
      >
        <span className="flex-1 mr-2 font-light text-[0.9375rem] text-[#BDC0C2]">Email</span>
        <span className="flex items-center justify-center bg-[#0A0A0B] min-w-[8.125rem] w-[8.125rem] h-[3.1875rem] rounded-lg font-light text-[0.9375rem] shrink-0">
          Subscribe
        </span>
      </button>

      <MobileSubscribePopover isOpen={isOpen} anchorRect={anchorRect} onClose={close} onRemeasure={measureAnchor} />
    </>
  );
}

type SubmitPhase = "form" | "filling" | "arrow" | "thanks";

// Each stage's own duration, named so the full sequence's timing is
// readable in one place instead of scattered magic numbers. Total time
// from click to "Thanks" appearing: FILL + ARROW ≈ 1000ms.
const FILL_DURATION_MS = 550; // white fill wipes left→right across the button, with a slight overshoot/bounce
const ARROW_DURATION_MS = 450; // arrow fades in, holds briefly, shoots right and fades out
const THANKS_AUTOCLOSE_MS = 2000; // how long "Thanks" stays up before the popover auto-closes

function MobileSubscribePopover({
  isOpen,
  anchorRect,
  onClose,
  onRemeasure,
}: {
  isOpen: boolean;
  anchorRect: AnchorRect | null;
  onClose: () => void;
  onRemeasure: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<SubmitPhase>("form");
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeValues>({ resolver: zodResolver(subscribeSchema) });

  useEffect(() => setMounted(true), []);

  // Clears any in-flight sequence timers on unmount. Without this, a fast
  // close-then-reopen could leave a stale timer from the PREVIOUS open
  // still pending — since raw setTimeouts aren't tied to component
  // lifecycle — which would then fire mid-way through a freshly-reopened
  // popover and yank its phase forward (or close it) unexpectedly.
  useEffect(() => {
    return () => {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Lock body scroll (and pause Lenis) while open, close on Escape, and
  // re-measure the trigger's position on resize/orientation-change (body
  // scroll is locked while open, so scroll itself can't move the trigger —
  // only a resize/rotation can).
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    let resizeRafId: number | null = null;
    const handleResize = () => {
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        onRemeasure();
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, lenis, onClose, onRemeasure]);

  // Reset back to "form" each time it's freshly opened, and clear any
  // pending sequence timers the moment it closes (by any means — auto,
  // Escape, or backdrop tap) so a stale timer from this run can never
  // reach across into a future reopened instance.
  useEffect(() => {
    if (isOpen) {
      setPhase("form");
    } else {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }
  }, [isOpen]);

  const onSubmit = (_values: SubscribeValues) => {
    // Dummy: no API call. Replace this with a real POST when ready.
    reset();

    if (prefersReducedMotion) {
      // Skip the wipe/arrow choreography entirely for reduced-motion —
      // straight to the result, same as the rest of the app's pattern.
      setPhase("thanks");
      closeTimeoutRef.current = setTimeout(() => onClose(), THANKS_AUTOCLOSE_MS);
      return;
    }

    // form -> filling -> arrow -> thanks, each stage timed by its own
    // named constant above so the full sequence plays out in order:
    // white fill wipes across the button, then a brief hold, then the
    // arrow shoots across and fades, then it morphs into "Thanks".
    setPhase("filling");
    phaseTimeoutRef.current = setTimeout(() => {
      setPhase("arrow");
      phaseTimeoutRef.current = setTimeout(() => {
        setPhase("thanks");
        closeTimeoutRef.current = setTimeout(() => onClose(), THANKS_AUTOCLOSE_MS);
      }, ARROW_DURATION_MS);
    }, FILL_DURATION_MS);
  };

  if (!mounted || !anchorRect) return null;

  const width = Math.min(anchorRect.width, POPOVER_MAX_WIDTH_PX);
  const left = anchorRect.left + (anchorRect.width - width) / 2;
  const duration = prefersReducedMotion ? 0 : 0.35;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed backdrop — the page recedes, the popover itself stays
              undimmed since it's a separate element painted above this,
              not something this backdrop's opacity applies to. Tapping it
              closes the popover. */}
          <motion.div
            key="subscribe-backdrop"
            className="fixed inset-0 z-[60] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration } }}
            exit={{ opacity: 0, transition: { duration: duration * 0.8 } }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* z-[61] — intentionally the highest z-index anywhere in the
              app: above Header (z-50) and above MobileNav's own overlay
              (z-40), so the popover can never end up clipped or covered
              regardless of where the trigger sits on the page. */}
          <motion.div
            key="subscribe-popover"
            role="dialog"
            aria-modal="true"
            aria-label="Subscribe"
            data-lenis-prevent
            layout
            style={{ position: "fixed", left, width, bottom: window.innerHeight - anchorRect.top + POPOVER_GAP_PX }}
            className="z-[61] max-h-[70vh] overflow-y-auto rounded-xl border border-[#2A2A2E] bg-[#1E1E21] p-5 shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration, ease: POPOVER_EASE } }}
            exit={{ opacity: 0, y: 16, scale: 0.94, transition: { duration: duration * 0.7, ease: POPOVER_EASE } }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Subscribe</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-7 h-7 -m-1 rounded hover:bg-white/5 transition-colors"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {phase === "thanks" ? (
                <motion.p
                  key="thanks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="text-sm text-[#BDC0C2] py-2"
                >
                  Thanks — you&apos;re on the list.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <label htmlFor="subscribe-field-mobile" className="sr-only">
                    Email
                  </label>
                  <input
                    id="subscribe-field-mobile"
                    // type="text" (not "email") + inputMode="email":
                    // Chrome's autofill heuristics look at type="email" and
                    // any "email" substring in id/name as strong signals to
                    // treat a field as autofill-relevant — strong enough
                    // that it was overriding our autoComplete="off" outright
                    // (a documented, deliberate Chrome behavior, not a bug).
                    // That's what kept showing its own non-stylable blue
                    // "tracked by autofill" border even with no suggestion
                    // dropdown open. inputMode="email" is a pure soft UX
                    // hint — it still shows the "@"-optimized mobile
                    // keyboard layout — with zero autofill implications,
                    // unlike `type`. Real validation is entirely unaffected
                    // either way: it's handled by our own zod schema's
                    // `.email()` check below, which never depended on the
                    // native `type` attribute.
                    type="text"
                    inputMode="email"
                    autoComplete="off"
                    autoFocus
                    disabled={phase !== "form"}
                    placeholder="you@example.com"
                    className="w-full bg-[#0F0F10] border border-[#2A2A2E] focus:border-white/40 focus:ring-0 rounded-lg px-3 py-3 text-sm font-light text-white placeholder-[#6B6B70] outline-none transition-colors disabled:opacity-60"
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}

                  {/* Submit button — three stacked layers:
                        1. Base (always present): dark bg, white label —
                           the idle resting state.
                        2. Fill: a white layer, same size/position as the
                           base, revealed via an animated `clip-path`
                           (NOT a scaleX transform — scaling the layer
                           would also scale/distort its own text and icon
                           content; clip-path just reveals more of an
                           already full-size, correctly-positioned layer,
                           so nothing inside it stretches). It carries its
                           own black-colored label, aligned exactly with
                           the base layer's white one, so as the wipe
                           passes a given point it reads as that point's
                           text flipping color in place.
                        3. Arrow: mounted only during the "arrow" phase, a
                           single keyframe animation (fade in → brief hold
                           → shoot right while fading out) fully contained
                           within ARROW_DURATION_MS, so it never needs an
                           AnimatePresence-driven exit racing against the
                           whole form unmounting a moment later. */}
                  <motion.button
                    type="submit"
                    disabled={phase !== "form"}
                    whileTap={phase === "form" ? { scale: 0.96 } : undefined}
                    animate={{ scale: phase === "filling" ? [1, 0.96, 1.02, 1] : 1 }}
                    transition={{
                      scale: { duration: FILL_DURATION_MS / 1000, times: [0, 0.18, 0.55, 1], ease: "easeOut" },
                    }}
                    className="relative mt-3 w-full h-[3.1875rem] rounded-lg overflow-hidden bg-[#0A0A0B] disabled:cursor-default"
                  >
                    <span className="absolute inset-0 flex items-center justify-center font-light text-[0.9375rem] text-white">
                      Subscribe
                    </span>

                    {/* clip-path uses an "easeOutBack"-style curve (values
                        past 1 momentarily push the inset value slightly
                        beyond 0%/100%) — the fill visibly overshoots the
                        button's edge by a touch before settling back,
                        which reads as a more elastic, dynamic wipe than a
                        flat linear/ease-out one. */}
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center bg-white"
                      initial={false}
                      animate={{ clipPath: phase === "form" ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" }}
                      transition={{ duration: FILL_DURATION_MS / 1000, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      {phase === "filling" && (
                        <span className="font-light text-[0.9375rem] text-black">Subscribe</span>
                      )}
                      {phase === "arrow" && (
                        <motion.span
                          initial={{ opacity: 0, x: -18 }}
                          animate={{ opacity: [0, 1, 1, 0], x: [-18, 6, 24, 44] }}
                          transition={{
                            duration: ARROW_DURATION_MS / 1000,
                            times: [0, 0.3, 0.65, 1],
                            ease: "easeInOut",
                          }}
                        >
                          <SubscribeArrowIcon className="stroke-black" />
                        </motion.span>
                      )}
                    </motion.span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}