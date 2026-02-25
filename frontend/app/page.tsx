"use client";

import { useState } from "react";
import UrlInput        from "@/components/UrlInput";
import SummaryBox      from "@/components/SummaryBox";
import TranscriptBox   from "@/components/TranscriptBox";
import TimestampSummary from "@/components/TimestampSummary";

/* ── Types (unchanged from original) ────────────────────────────────────── */
interface SummarizeResult {
  transcript: string;
  summary:    string;
  timestamps: string[];
}

type TabId = "summary" | "timestamps" | "transcript";

/* ── Tab definitions ────────────────────────────────────────────────────── */
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "summary",    label: "Summary",    icon: "◈" },
  { id: "timestamps", label: "Timestamps", icon: "◷" },
  { id: "transcript", label: "Transcript", icon: "≡" },
];

/* ── Waveform loader bars ────────────────────────────────────────────────── */
const WAVE_BARS = [
  { cls: "wb-a", from: "#2dd4bf", to: "#34d399" },
  { cls: "wb-b", from: "#34d399", to: "#60a5fa" },
  { cls: "wb-c", from: "#60a5fa", to: "#a78bfa" },
  { cls: "wb-d", from: "#a78bfa", to: "#2dd4bf" },
  { cls: "wb-e", from: "#2dd4bf", to: "#34d399" },
  { cls: "wb-f", from: "#34d399", to: "#60a5fa" },
  { cls: "wb-g", from: "#60a5fa", to: "#2dd4bf" },
  { cls: "wb-h", from: "#2dd4bf", to: "#a78bfa" },
  { cls: "wb-i", from: "#a78bfa", to: "#34d399" },
];

/* ════════════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   Logic: 100% identical to original
   Changes: layout, visual design, centering, spacing only
════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  /* --- State (unchanged) --- */
  const [url,       setUrl]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<SummarizeResult | null>(null);
  const [apiError,  setApiError]  = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  /* --- Submit handler (unchanged logic) --- */
  const handleSummarize = async (submittedUrl: string) => {
    setApiError("");
    setResult(null);
    setLoading(true);
    try {
      const res  = await fetch("/api/summarize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: submittedUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Server error. Please try again.");
      setResult(data);
      setActiveTab("summary");
      setUrl(""); // clear input after success
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setApiError(""); setUrl(""); };

  /* --- Render --- */
  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      position: "relative",
      overflowX: "hidden",
    }}>

      {/* ── Decorative background ── */}
      <PageBackground />

      {/* ── Main column — max 680px, fully centered ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "680px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>

        {/* ── Header ── */}
        <header className="anim-fade-up d-0" style={{ textAlign: "center", paddingBottom: "4px" }}>
          <LogoBadge />

          <h1
            className="text-grad anim-fade-up d-80"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.1rem, 6vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              marginTop: "20px",
              marginBottom: "14px",
            }}
          >
            YouTube Summarizer
          </h1>

          <p
            className="anim-fade-up d-160"
            style={{
              color: "var(--color-text-2)",
              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
              lineHeight: 1.7,
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            Drop a YouTube link to instantly generate concise summaries, timestamp highlights, and full transcripts
          </p>
        </header>

        {/* ── Input card ── */}
        <div className="card-accent anim-fade-up d-240" style={{ padding: "24px 26px" }}>
          <UrlInput
            url={url}
            setUrl={setUrl}
            onSubmit={handleSummarize}
            loading={loading}
          />
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div
            className="card anim-fade-in"
            role="status"
            aria-live="polite"
            aria-label="Summarizing video, please wait"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "22px",
              padding: "44px 32px",
              textAlign: "center",
            }}
          >
            {/* Waveform — pure UX signal, no technical text */}
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "5px",
              height: "40px",
            }}>
              {WAVE_BARS.map((b, i) => (
                <span
                  key={i}
                  className={b.cls}
                  style={{
                    display: "inline-block",
                    width: "5px",
                    borderRadius: "99px",
                    background: `linear-gradient(to top, ${b.from}, ${b.to})`,
                    height: "8px",
                  }}
                />
              ))}
            </div>

            <div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--color-text-1)",
                marginBottom: "6px",
              }}>
                Summarizing your video…
              </p>
              <p style={{ fontSize: "0.84rem", color: "var(--color-text-2)", lineHeight: 1.6 }}>
                This usually takes 1–3 minutes.
              </p>
            </div>

            {/* Skeleton preview */}
            <div style={{
              width: "100%",
              maxWidth: "340px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>
              {[82, 66, 74, 52, 68].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: "10px", width: `${w}%`, animationDelay: `${i * 140}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Error banner ── */}
        {apiError && !loading && (
          <div className="alert-error anim-slide-up" role="alert">
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(248,113,113,0.20)",
              color: "var(--color-error)",
              fontSize: "0.75rem",
              fontWeight: 800,
              flexShrink: 0,
              marginTop: "1px",
            }}>!</span>
            <div>
              <p style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--color-error)",
                marginBottom: "4px",
              }}>
                Something went wrong
              </p>
              <p style={{
                fontSize: "0.83rem",
                color: "rgba(248,150,150,0.85)",
                lineHeight: 1.55,
              }}>
                {apiError}
              </p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="anim-slide-up" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Tab bar */}
            <div className="tab-bar" role="tablist" aria-label="Result views">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn${activeTab === tab.id ? " tab-active" : ""}`}
                >
                  <span style={{ fontSize: "1rem", lineHeight: 1, opacity: 0.85 }}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content panel */}
            <div className="card" style={{ padding: "24px 26px" }}>
              <div className="anim-tab-enter" key={activeTab}>
                {activeTab === "summary"    && <SummaryBox     summary={result.summary}           />}
                {activeTab === "timestamps" && <TimestampSummary timestamps={result.timestamps}   />}
                {activeTab === "transcript" && <TranscriptBox  transcript={result.transcript}     />}
              </div>
            </div>

            {/* Reset */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleReset}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "var(--color-text-3)",
                  transition: "color 0.2s ease",
                  padding: "4px 8px",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-2)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-3)")}
              >
                ↺ Summarize another video
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer style={{
          textAlign: "center",
          fontSize: "0.72rem",
          color: "var(--color-text-3)",
          paddingTop: "4px",
        }}>
          
        </footer>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function LogoBadge() {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 14px 6px 10px",
      background: "rgba(45,212,191,0.08)",
      border: "1px solid rgba(45,212,191,0.18)",
      borderRadius: "99px",
    }}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #2dd4bf, #34d399)",
        flexShrink: 0,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#041410">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5S4.5 3.5 2.6 4.1A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.6V8.4L15.8 12l-6.3 3.6z" />
        </svg>
      </span>
      <span style={{
        fontSize: "0.775rem",
        fontWeight: 600,
        color: "rgba(45,212,191,0.75)",
        letterSpacing: "0.01em",
      }}>
        Get instant support
      </span>
    </div>
  );
}

function PageBackground() {
  return (
    <div aria-hidden style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Deep base gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #080b0f 0%, #0a0f18 45%, #080e17 75%, #080b0f 100%)",
      }} />

      {/* Teal orb — top left */}
      <div className="orb-drift" style={{
        position: "absolute",
        top: "-20%",
        left: "-15%",
        width: "700px",
        height: "700px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(45,212,191,0.10) 0%, transparent 65%)",
        filter: "blur(60px)",
      }} />

      {/* Emerald orb — right side */}
      <div className="orb-drift" style={{
        position: "absolute",
        top: "15%",
        right: "-20%",
        width: "650px",
        height: "650px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(52,211,153,0.07) 0%, transparent 65%)",
        filter: "blur(70px)",
        animationDelay: "3s",
        animationDirection: "reverse",
      }} />

      {/* Blue orb — bottom */}
      <div className="orb-drift" style={{
        position: "absolute",
        bottom: "-15%",
        left: "25%",
        width: "500px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%)",
        filter: "blur(80px)",
        animationDelay: "5s",
      }} />

      {/* Subtle dot grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
      }} />
    </div>
  );
}