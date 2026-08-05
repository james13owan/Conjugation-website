import React, { useEffect, useState } from "react";
import { tenseKey } from "./countries.js";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i, left: (i * 97 + 13) % 100, top: (i * 67 + 31) % 100,
  size: (i % 3) + 1, opacity: 0.05 + (i % 6) * 0.06,
  color: ["#fbbf24", "#4ade80", "#60a5fa", "#a78bfa"][i % 4],
}));

export default function GameComplete({ onPlayAgain, onViewMissed, selectedTense }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const tk = tenseKey(selectedTense);
  const cumCorrect = parseInt(localStorage.getItem(`conj_${tk}_cumulative_correct`) || "0", 10);
  const cumTotal   = parseInt(localStorage.getItem(`conj_${tk}_cumulative_total`)   || "0", 10);
  const cumWrong   = cumTotal - cumCorrect;
  const accuracy   = cumTotal > 0 ? Math.round((cumCorrect / cumTotal) * 100) : 0;
  const missedCount = JSON.parse(localStorage.getItem(`conj_${tk}_missed_verbs`) || "[]").length;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1e2a50 0%, #0d1630 50%, #07101e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', Tahoma, sans-serif", color: "white",
    }}>
      {STARS.map((s) => (
        <div key={s.id} style={{ position: "absolute", left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.color, opacity: s.opacity, pointerEvents: "none" }} />
      ))}

      <div style={{ textAlign: "center", transform: show ? "translateY(0)" : "translateY(30px)", opacity: show ? 1 : 0, transition: "all 0.8s ease", position: "relative", zIndex: 1, width: "100%", maxWidth: "700px", padding: "0 24px" }}>
        <div style={{ fontSize: "5rem", marginBottom: "16px" }}>🏆</div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Journey Complete!
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", margin: "0 0 6px" }}>
          You've mastered all 21 Spanish-speaking countries!
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem", marginBottom: "36px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
          🇲🇽 Central America
          <span style={{ opacity: 0.4 }}>→</span>
          🏝️ Caribbean
          <span style={{ opacity: 0.4 }}>→</span>
          🌎 South America
          <span style={{ opacity: 0.4 }}>→</span>
          🌍 Africa
          <span style={{ opacity: 0.4 }}>→</span>
          🇪🇸 Europe
        </p>

        {/* Stats box */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "28px",
          display: "flex",
          gap: "0",
        }}>
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>{accuracy}%</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginTop: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Accuracy</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ color: "#4ade80", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>{cumCorrect}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginTop: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Correct</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "#f87171", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>{cumWrong}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginTop: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Wrong</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <button
            onClick={onPlayAgain}
            style={{
              padding: "1.1rem 4rem", width: "100%",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              border: "none", borderRadius: "50px", color: "white",
              fontSize: "1.3rem", fontWeight: 900, cursor: "pointer",
              letterSpacing: "0.06em",
              boxShadow: "0 0 40px rgba(245,158,11,0.4)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Master Another Tense 🌎
          </button>

          <button
            onClick={onViewMissed}
            style={{
              padding: "0.85rem 3rem", width: "100%",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.35)",
              borderRadius: "50px", color: "#f87171",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
          >
            View Missed Verbs 📋 {missedCount > 0 && `(${missedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
