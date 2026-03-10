import React, { useState } from "react";

export default function Home({ onStart }) {
  const [includeVosotros, setIncludeVosotros] = useState(false);

  const tenses = [
    { name: "Present", color: "#4ade80" },
    { name: "Preterite", color: "#60a5fa" },
    { name: "Imperfect", color: "#a78bfa" },
    { name: "Future", color: "#facc15" },
    { name: "Conditional", color: "#fb923c" },
    { name: "Subjunctive", color: "#ec4899" },
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
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Bienvenido
      </h1>

      <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
        How many countries will you visit today?
      </p>

      {/* TENSE BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "800px",
        }}
      >
        {tenses.map((tense) => (
          <button
            key={tense.name}
            onClick={() => onStart(tense.name, includeVosotros)}
            style={{
              background: tense.color,
              border: "none",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.target.style.transform = "scale(1.0)")
            }
          >
            {tense.name}
          </button>
        ))}
      </div>

      {/* VOSOTROS CHECKBOX — MOVED HERE */}
      <div
        style={{
          marginBottom: "2rem",
          marginTop: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem 1.5rem",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <input
          type="checkbox"
          id="vosotros-checkbox"
          checked={includeVosotros}
          onChange={(e) => setIncludeVosotros(e.target.checked)}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
          }}
        />
        <label
          htmlFor="vosotros-checkbox"
          style={{
            fontSize: "1.1rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          Include vosotros (Spain Spanish)
        </label>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "1rem", opacity: 0.8 }}>
        Select a tense and begin exploring the Spanish-speaking world!
      </p>
    </div>
  );
}
