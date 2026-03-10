import React from "react";

export default function Home({ onStart, onSelectLevelPage }) {
  const tenses = [
    { name: "Present", color: "#4ade80" },
    { name: "Past", color: "#60a5fa" },
    { name: "Future", color: "#facc15" },
    { name: "Gustar & Similar", color: "#f472b6" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #1e3a8a, #3b82f6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✈️ Bienvenido, Piloto</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
        Select your tense to begin your journey
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {tenses.map((tense) => (
          <button
            key={tense.name}
            onClick={() => onSelectLevelPage(tense.name)}
            style={{
              background: tense.color,
              border: "none",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
          >
            {tense.name}
          </button>
        ))}
      </div>
    </div>
  );
}
