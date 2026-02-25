"use client";

import { useState } from "react";

interface UrlInputProps {
  /** URL value — lifted to parent so page can clear it after success */
  url: string;
  setUrl: (v: string) => void;
  onSubmit: (url: string) => void;
  loading: boolean;
}

/* Validation logic — UNCHANGED from original */
function validate(value: string): string {
  if (!value.trim())
    return "Please paste a YouTube URL to get started.";
  if (!value.includes("youtube.com/") && !value.includes("youtu.be/"))
    return "That doesn't look like a YouTube link — double-check and try again.";
  return "";
}

export default function UrlInput({ url, setUrl, onSubmit, loading }: UrlInputProps) {
  const [error, setError] = useState("");

  /* Submit logic — UNCHANGED */
  const submit = () => {
    const err = validate(url);
    if (err) { setError(err); return; }
    setError("");
    onSubmit(url.trim());
  };

  const onChange = (v: string) => {
    setUrl(v);
    if (error) setError(""); // clear error as user types
  };

  /* Enter key — UNCHANGED */
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) submit();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Label */}
      <label style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        color: "var(--color-text-3)",
      }}>
        YouTube URL
      </label>

      {/* Input + Button — flex row, wraps on mobile */}
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "stretch",
      }}>
        {/*
          Clean input — no icon, no clutter.
          All focus/error styling comes from the .input-url CSS class.
        */}
        <input
          type="url"
          value={url}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
          placeholder="https://youtube.com/watch?v=..."
          aria-label="YouTube video URL"
          className={`input-url${error ? " input-error" : ""}`}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Submit button */}
        <button
          onClick={submit}
          disabled={loading}
          className="btn-primary"
          aria-label={loading ? "Processing…" : "Summarize video"}
        >
          {loading ? (
            <>
              {/* Inline spinner */}
              <svg
                className="anim-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 2a10 10 0 0 1 10 10" opacity=".9" />
                <path d="M12 2a10 10 0 0 0-10 10" opacity=".22" />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Summarize
            </>
          )}
        </button>
      </div>

      {/* Inline validation error */}
      {error && (
        <p style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.8rem",
          color: "var(--color-error)",
          marginTop: "2px",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}