"use client";

import { useEffect } from "react";

/**
 * The last-resort error screen, used only when the root layout itself fails.
 * It replaces the whole document, so none of the site's CSS, fonts or
 * components are available — hence the plain inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          background: "#0F0F10",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ margin: 0, maxWidth: "320px", fontSize: "14px", lineHeight: 1.6, color: "#BDC0C2" }}>
          We couldn&apos;t load the site. Please try again.
        </p>
        {error.digest && <p style={{ margin: 0, fontSize: "12px", color: "#8E9296" }}>Error code: {error.digest}</p>}
        <button
          type="button"
          onClick={reset}
          style={{
            height: "55px",
            padding: "0 32px",
            border: 0,
            borderRadius: "8px",
            background: "#FFFFFF",
            color: "#000000",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}