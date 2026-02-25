"use client";

import { useState } from "react";

interface TranscriptBoxProps {
  transcript: string;
}

export default function TranscriptBox({ transcript }: TranscriptBoxProps) {
  /* Logic — UNCHANGED */
  const [copied,   setCopied]   = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard API unavailable */
    }
  };

  /* Word count — UNCHANGED */
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Panel header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        flexWrap: "wrap",
        rowGap: "8px",
      }}>
        {/* Label + word count */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="section-label">
            <span
              className="section-label-dot"
              style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}
            />
            Full Transcript
          </div>
          <span style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            padding: "2px 9px",
            borderRadius: "99px",
            background: "rgba(255,255,255,0.06)",
            color: "var(--color-text-2)",
            border: "1px solid var(--color-border)",
          }}>
            {wordCount.toLocaleString()} words
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleCopy} className="btn-ghost">
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-success)" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: "var(--color-success)" }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>

          {/* Collapse/expand toggle */}
          <button onClick={() => setExpanded(e => !e)} className="btn-ghost">
            {expanded ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                Collapse
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                Expand
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript — height transitions between collapsed/expanded */}
      <div
        className="scroll-teal"
        style={{
          maxHeight: expanded ? "560px" : "200px",
          overflowY: "auto",
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          transition: "max-height 0.38s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.79rem",
          lineHeight: 1.9,
          color: "var(--color-text-2)",
          whiteSpace: "pre-wrap",
          letterSpacing: "0.01em",
        }}>
          {transcript}
        </p>
      </div>
    </div>
  );
}