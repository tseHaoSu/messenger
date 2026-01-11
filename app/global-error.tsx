"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --bg: #f5f2ef;
            --fg: #1a1a1a;
            --muted: #6b6560;
            --primary: #8b4332;
            --primary-fg: #fff;
            --border: #e5e0db;
            --destructive: #dc2626;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #1c1917;
              --fg: #f5f5f4;
              --muted: #a8a29e;
              --primary: #c45a3a;
              --primary-fg: #faf5f2;
              --border: #44403c;
              --destructive: #ef4444;
            }
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          backgroundColor: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "Poppins, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--destructive)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.025em" }}>
              Critical Error
            </h1>
            <p style={{ fontSize: "1.125rem", color: "var(--muted)", margin: 0 }}>
              Something went wrong
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: "inherit",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                backgroundColor: "transparent",
                color: "var(--fg)",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/conversations")}
              style={{
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: "inherit",
                border: "none",
                borderRadius: "1rem",
                backgroundColor: "var(--primary)",
                color: "var(--primary-fg)",
                cursor: "pointer",
              }}
            >
              Back to Conversations
            </button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
