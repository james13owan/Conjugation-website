import React from "react";

export default function LevelSelection({ onSelect, onBack }) {
  const levels = [
    { name: "Beginner", speed: 2000 },
    { name: "Intermediate", speed: 1500 },
    { name: "Advanced", speed: 1000 },
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to bottom, #1e3a8a, #3b82f6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Select Difficulty</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {levels.map((level) => (
          <button
            key={level.name}
            onClick={() => onSelect(level)}
            style={{
              background: "#f59e0b",
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
            {level.name}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: "2rem",
          padding: "1.5rem 3rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#6b7280",
          color: "white",
        }}
      >
        Back
      </button>
    </div>
  );
}
