"use client";

import { useEffect, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * A product image with its empty (transparent) margins cropped away.
 *
 * Product PNGs arrive with different amounts of transparent padding, so the
 * same headphone drawn into the same box looks small in one file and big in
 * another. This finds the visible pixels' bounding box once per image (on a
 * canvas), crops to it, and shows the cropped version — so with
 * `object-contain` every product fills its box the same way, whatever the
 * file's padding.
 *
 * The image stays hidden (but keeps its space, so nothing shifts) until the
 * cropped version is ready; results are cached per source, so every later use
 * is instant. If anything goes wrong (the image fails to load, a canvas isn't
 * available) it falls back to showing the original untouched.
 */

/** Pixels at or below this alpha (0–255) count as empty, so faint shadows don't widen the crop. */
const ALPHA_THRESHOLD = 24;
/** Skip trimming for very large images — scanning them isn't worth the memory. */
const MAX_PIXELS = 12_000_000;

const trimmedBySrc = new Map<string, string>();
const pendingBySrc = new Map<string, Promise<string>>();

function trimTransparentEdges(src: string): Promise<string> {
  const pending = pendingBySrc.get(src);
  if (pending) return pending;

  const promise = new Promise<string>((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      try {
        const { naturalWidth: width, naturalHeight: height } = image;
        if (!width || !height || width * height > MAX_PIXELS) return resolve(src);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(src);

        context.drawImage(image, 0, 0);
        const { data } = context.getImageData(0, 0, width, height);

        let left = width;
        let top = height;
        let right = -1;
        let bottom = -1;
        for (let y = 0; y < height; y += 1) {
          const rowStart = y * width * 4;
          for (let x = 0; x < width; x += 1) {
            if ((data[rowStart + x * 4 + 3] ?? 0) > ALPHA_THRESHOLD) {
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
            }
          }
        }

        // Nothing visible, or nothing to crop: keep the original.
        if (right < 0) return resolve(src);
        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;
        if (cropWidth === width && cropHeight === height) return resolve(src);

        const cropped = document.createElement("canvas");
        cropped.width = cropWidth;
        cropped.height = cropHeight;
        const croppedContext = cropped.getContext("2d");
        if (!croppedContext) return resolve(src);

        croppedContext.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        resolve(cropped.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    image.onerror = () => resolve(src);
    image.src = src;
  }).then((url) => {
    trimmedBySrc.set(src, url);
    return url;
  });

  pendingBySrc.set(src, promise);
  return promise;
}

/** Start trimming an image ahead of time (e.g. a product's whole gallery) so it's ready when shown. */
export function preloadTrimmedImage(src: string): void {
  void trimTransparentEdges(src);
}

export default function TrimmedImage({
  src,
  className = "",
  ...imageProps
}: Omit<HTMLMotionProps<"img">, "src"> & { src: string }) {
  const [result, setResult] = useState<{ src: string; url: string } | null>(() => {
    const cached = trimmedBySrc.get(src);
    return cached ? { src, url: cached } : null;
  });

  useEffect(() => {
    let cancelled = false;
    trimTransparentEdges(src).then((url) => {
      if (!cancelled) setResult({ src, url });
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Only use a result that belongs to the CURRENT src (it can lag a render
  // behind when the src changes).
  const url = result?.src === src ? result.url : null;

  // `invisible` (not opacity) so it can't clash with opacity animations
  // passed in through imageProps.
  return <motion.img {...imageProps} src={url ?? src} className={`${className} ${url ? "" : "invisible"}`} />;
}