import React from "react";
import { tenseKey } from "./countries.js";

const DIFF_STYLE = {
  beginner:     { label: "Beginner",     color: "#4ade80", bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)"  },
  intermediate: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  advanced:     { label: "Advanced",     color: "#f87171", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)"  },
};

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i, left: (i * 97 + 13) % 100, top: (i * 67 + 31) % 100,
  size: (i % 3) + 1, opacity: 0.04 + (i % 5) * 0.05,
  color: ["#f87171", "#4ade80", "#60a5fa", "#a78bfa"][i % 4],
}));

export default function MissedVerbs({ selectedTense, onBack }) {
  const tk = tenseKey(selectedTense);
  const entries = JSON.parse(localStorage.getItem(`conj_${tk}_missed_verbs`) || "[]");
  // Most recent first
  const rows = [...entries].reverse();

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1e2a50 0%, #0d1630 50%, #07101e 100%)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      fontFamily: "'Segoe UI', Tahoma, sans-serif", color: "white",
    }}>
      {STARS.map(s => (
        <div key={s.id} style={{ position: "absolute", left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.color, opacity: s.opacity, pointerEvents: "none" }} />
      ))}

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <button
            onClick={onBack}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontSize: "0.88rem" }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 900, margin: 0, background: "linear-gradient(135deg, #f87171, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Missed Verbs
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", margin: "2px 0 0" }}>
              {selectedTense} · {rows.length} wrong answer{rows.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>

        {rows.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.8fr 0.8fr 0.85fr", gap: "0 12px", padding: "6px 16px", marginBottom: "4px" }}>
            {["Verb", "You Said", "Correct Answer", "Subject", "Tense", "Difficulty"].map(h => (
              <div key={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", padding: "0 32px 40px" }}>
        {rows.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎯</div>
            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "1.5rem" }}>¡Perfecto!</div>
            <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>No mistakes recorded yet — keep going!</div>
          </div>
        ) : (
          rows.map((v, i) => {
              const ds = DIFF_STYLE[v.difficulty] || DIFF_STYLE.intermediate;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.8fr 0.8fr 0.85fr",
                  gap: "0 12px", padding: "11px 16px", marginBottom: "5px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", alignItems: "center",
                }}>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{v.infinitive}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontStyle: "italic" }}>{v.english}</div>
                  </div>
                  <div style={{
                    color: "#f87171", fontWeight: 700, fontSize: "0.95rem",
                    background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: "6px", padding: "3px 10px", display: "inline-block",
                  }}>
                    {v.userAnswer}
                  </div>
                  <div style={{
                    color: "#4ade80", fontWeight: 800, fontSize: "0.95rem",
                    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
                    borderRadius: "6px", padding: "3px 10px", display: "inline-block",
                  }}>
                    {v.correctAnswer}
                  </div>
                  <div style={{ color: "#a5b4fc", fontSize: "0.88rem" }}>{v.subject}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>{v.tenseName}</div>
                  <div style={{
                    color: ds.color, fontWeight: 700, fontSize: "0.78rem",
                    background: ds.bg, border: `1px solid ${ds.border}`,
                    borderRadius: "6px", padding: "3px 8px", display: "inline-block",
                    letterSpacing: "0.03em",
                  }}>
                    {ds.label}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
