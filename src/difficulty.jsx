import React, { useState } from "react";

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    seconds: 10,
    subtitle: "Pause and think",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.35)",
    border: "rgba(34,197,94,0.45)",
    bg: "rgba(34,197,94,0.08)",
    bgHover: "rgba(34,197,94,0.16)",
    icon: "🌱",
    barWidths: ["100%", "55%", "25%"],
  },
  {
    id: "intermediate",
    label: "Intermediate",
    seconds: 5,
    subtitle: "Be ready",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    border: "rgba(245,158,11,0.45)",
    bg: "rgba(245,158,11,0.08)",
    bgHover: "rgba(245,158,11,0.16)",
    icon: "⚡",
    barWidths: ["100%", "55%", "25%"],
  },
  {
    id: "advanced",
    label: "Advanced",
    seconds: 2,
    subtitle: "Native speed",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.35)",
    border: "rgba(239,68,68,0.45)",
    bg: "rgba(239,68,68,0.08)",
    bgHover: "rgba(239,68,68,0.16)",
    icon: "🔥",
    barWidths: ["100%", "55%", "25%"],
  },
];

/* Animated timer-bar preview showing how fast the meter drains */
function TimerPreview({ color, seconds }) {
  return (
    <div style={{ width: "100%", marginTop: "16px" }}>
      <div style={{
        height: "6px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          background: color,
          borderRadius: "4px",
          animation: `drain ${seconds}s linear infinite`,
          transformOrigin: "left",
        }} />
      </div>
      <div style={{
        color: "rgba(255,255,255,0.35)",
        fontSize: "0.72rem",
        marginTop: "6px",
        letterSpacing: "0.06em",
      }}>
        {seconds}s per question
      </div>
    </div>
  );
}

export default function DifficultySelect({ selectedTense, onSelect, onBack }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1e2a50 0%, #0d1630 50%, #07101e 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes drain {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: "20px", left: "20px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.75)",
          padding: "8px 18px", borderRadius: "20px",
          cursor: "pointer", fontSize: "0.88rem",
        }}
      >
        ← Back
      </button>

      {/* Tense badge */}
      <div style={{
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.3)",
        color: "#f59e0b",
        padding: "6px 20px", borderRadius: "20px",
        fontSize: "0.9rem", fontWeight: 700,
        letterSpacing: "0.08em",
        marginBottom: "18px",
      }}>
        {selectedTense}
      </div>

      <h1 style={{
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        fontWeight: 900,
        margin: "0 0 8px",
        letterSpacing: "0.02em",
      }}>
        Choose Your Difficulty
      </h1>
      <p style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: "1rem",
        margin: "0 0 40px",
      }}>
        This controls how fast the timer runs on each question.
      </p>

      {/* Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "min(95vw, 860px)",
      }}>
        {LEVELS.map((lvl) => {
          const on = hovered === lvl.id;
          return (
            <button
              key={lvl.id}
              onMouseEnter={() => setHovered(lvl.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(lvl.id)}
              style={{
                flex: "1 1 220px",
                maxWidth: "260px",
                background: on ? lvl.bgHover : lvl.bg,
                border: `1.5px solid ${on ? lvl.color : lvl.border}`,
                borderRadius: "16px",
                padding: "28px 24px",
                cursor: "pointer",
                textAlign: "left",
                color: "white",
                boxShadow: on
                  ? `0 12px 36px ${lvl.glow}, 0 0 0 1px ${lvl.border}`
                  : `0 4px 14px rgba(0,0,0,0.4)`,
                transform: on ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.20s ease",
              }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "10px" }}>{lvl.icon}</div>
              <div style={{
                color: lvl.color,
                fontWeight: 900,
                fontSize: "1.35rem",
                letterSpacing: "0.04em",
                marginBottom: "4px",
              }}>
                {lvl.label}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.85rem",
                marginBottom: "4px",
              }}>
                {lvl.subtitle}
              </div>
              <TimerPreview color={lvl.color} seconds={lvl.seconds} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
