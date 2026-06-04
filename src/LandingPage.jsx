import React, { useState } from "react";

const JOURNEYS = [
  {
    name: "Present",
    emoji: "🌅",
    description: "The here and now",
    color: "#16a34a",
    glow: "#4ade80",
  },
  {
    name: "Preterite",
    emoji: "📜",
    description: "Completed past actions",
    color: "#1d4ed8",
    glow: "#60a5fa",
  },
  {
    name: "Imperfect",
    emoji: "🌙",
    description: "Ongoing past actions",
    color: "#7c3aed",
    glow: "#a78bfa",
  },
  {
    name: "Future",
    emoji: "🚀",
    description: "What is yet to come",
    color: "#b45309",
    glow: "#facc15",
  },
  {
    name: "Subjunctive",
    emoji: "💭",
    description: "Wishes and doubts",
    color: "#be185d",
    glow: "#ec4899",
  },
  {
    name: "Conditional",
    emoji: "🔮",
    description: "What would happen",
    color: "#c2410c",
    glow: "#fb923c",
  },
];

const ALL_TENSES = {
  name: "All Tenses",
  emoji: "🌍",
  description: "Master every tense — the full world tour",
  color: "#0f172a",
  glow: "#f59e0b",
  isAll: true,
};

export default function LandingPage({ onStart }) {
  const [includeVosotros, setIncludeVosotros] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleSelect = (tenseName) => {
    onStart(tenseName, includeVosotros);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(160deg, #0a0f2e 0%, #1e3a8a 40%, #0e4a6e 70%, #0f2027 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌎</div>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            color: "white",
            margin: 0,
            letterSpacing: "0.05em",
            textShadow: "0 4px 20px rgba(251, 191, 36, 0.4)",
          }}
        >
          Spanish World Tour
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.7)",
            marginTop: "0.75rem",
            marginBottom: 0,
          }}
        >
          Choose your journey through the Spanish-speaking world
        </p>
      </div>

      {/* TENSE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          maxWidth: "900px",
          width: "90%",
          marginBottom: "1.5rem",
        }}
      >
        {JOURNEYS.map((journey) => (
          <JourneyCard
            key={journey.name}
            journey={journey}
            hovered={hoveredCard === journey.name}
            onHover={setHoveredCard}
            onClick={handleSelect}
          />
        ))}
      </div>

      {/* ALL TENSES CARD — full width */}
      <div style={{ width: "90%", maxWidth: "900px", marginBottom: "2rem" }}>
        <JourneyCard
          journey={ALL_TENSES}
          hovered={hoveredCard === ALL_TENSES.name}
          onHover={setHoveredCard}
          onClick={handleSelect}
          fullWidth
        />
      </div>

      {/* VOSOTROS TOGGLE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.9rem 1.75rem",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50px",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
        }}
        onClick={() => setIncludeVosotros((v) => !v)}
      >
        <div
          style={{
            width: "42px",
            height: "24px",
            borderRadius: "12px",
            background: includeVosotros ? "#f59e0b" : "rgba(255,255,255,0.2)",
            position: "relative",
            transition: "background 0.25s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: includeVosotros ? "21px" : "3px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "white",
              transition: "left 0.25s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>
        <span style={{ color: "white", fontSize: "1rem", userSelect: "none" }}>
          Include <strong>vosotros</strong>{" "}
          <span style={{ opacity: 0.6, fontSize: "0.9rem" }}>(Spain Spanish)</span>
        </span>
      </div>
    </div>
  );
}

function JourneyCard({ journey, hovered, onHover, onClick, fullWidth }) {
  return (
    <button
      onMouseEnter={() => onHover(journey.name)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(journey.name)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${journey.color}cc, ${journey.color})`
          : "rgba(255,255,255,0.07)",
        border: `2px solid ${hovered ? journey.glow : "rgba(255,255,255,0.15)"}`,
        borderRadius: "16px",
        padding: fullWidth ? "1.5rem 2rem" : "1.5rem",
        cursor: "pointer",
        color: "white",
        textAlign: fullWidth ? "center" : "left",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 12px 32px ${journey.glow}55, 0 0 0 1px ${journey.glow}44`
          : "0 4px 12px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: fullWidth ? "row" : "column",
        alignItems: fullWidth ? "center" : "flex-start",
        justifyContent: fullWidth ? "center" : "flex-start",
        gap: fullWidth ? "1rem" : "0.5rem",
        width: "100%",
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ fontSize: fullWidth ? "2.5rem" : "2rem", lineHeight: 1 }}>
        {journey.emoji}
      </span>
      <div>
        <div
          style={{
            fontSize: fullWidth ? "1.4rem" : "1.15rem",
            fontWeight: "800",
            letterSpacing: "0.03em",
            color: hovered ? "white" : "rgba(255,255,255,0.95)",
          }}
        >
          {journey.name}
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)",
            marginTop: "0.2rem",
            transition: "color 0.2s",
          }}
        >
          {journey.description}
        </div>
      </div>
    </button>
  );
}
