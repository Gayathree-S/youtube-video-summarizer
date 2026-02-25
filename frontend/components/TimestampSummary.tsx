"use client";

interface TimestampSummaryProps {
  timestamps: string[];
}

export default function TimestampSummary({ timestamps }: TimestampSummaryProps) {
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
            style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}
          />
          Timestamp Breakdown
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
          {timestamps.length} segments
        </span>
      </div>

      {/* Timeline list */}
      <div
        className="scroll-teal"
        role="list"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          paddingRight: "4px",
        }}
      >
        {/* LOGIC UNCHANGED — parsing [MM:SS] prefix from each timestamp string */}
        {timestamps.map((ts, i) => {
          const match = ts.match(/^(\[[\d:]+\])\s*(.*)/);
          const time  = match?.[1] ?? "";
          const text  = match?.[2] ?? ts;

          return (
            <div
              key={i}
              role="listitem"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                transition: "background 0.14s ease",
                cursor: "default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.035)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Amber timestamp pill */}
              <span className="ts-pill">{time}</span>

              {/* Segment summary text */}
              <p style={{
                fontSize: "0.855rem",
                lineHeight: 1.65,
                color: "var(--color-text-1)",
                paddingTop: "1px",
              }}>
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}