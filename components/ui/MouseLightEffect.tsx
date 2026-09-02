"use client";

import { useEffect } from "react";

/**
 * Faithful port of the original app.js mouse-light behavior:
 *
 *   for (const light of document.querySelectorAll(".light")) {
 *     light.onmousemove = e => handleOnMouseMove(e);
 *   }
 *
 * In the original markup only <body> carries the "light" class, so this
 * mounts once and listens on document.body directly.
 */
export default function MouseLightEffect() {
  useEffect(() => {
    const target = document.body;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    };

    target.addEventListener("mousemove", handleMouseMove);
    return () => target.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}
