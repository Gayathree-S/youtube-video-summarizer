"use client";

import { useState } from "react";

interface SummaryBoxProps {
  summary: string;
}

export default function SummaryBox({ summary }: SummaryBoxProps) {
  /* Copy logic — UNCHANGED */
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard API unavailable */
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Panel header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
      }}>
        <div className="section-label">
          <span
            className="section-label-dot"
            style={{ background: "linear-gradient(135deg, #2dd4bf, #34d399)" }}
          />
          AI Summary
        </div>

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
      </div>

      {/* Summary text — teal-tinted background */}
      <div
        className="scroll-teal"
        style={{
          maxHeight: "288px",
          overflowY: "auto",
          padding: "18px 20px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(45,212,191,0.07) 0%, rgba(52,211,153,0.05) 100%)",
          border: "1px solid rgba(45,212,191,0.15)",
          boxShadow: "0 0 40px rgba(45,212,191,0.04) inset",
        }}
      >
        <p style={{
          fontSize: "0.9rem",
          lineHeight: 1.88,
          color: "var(--color-text-1)",
          whiteSpace: "pre-wrap",
        }}>
          {summary}
        </p>
      </div>
    </div>
  );
}