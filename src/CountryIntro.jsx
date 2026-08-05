import React, { useEffect, useState } from "react";
import { getFunFactIndex, advanceFunFactIndex, tenseKey } from "./countries.js";

export default function CountryIntro({ country, selectedTense, stopNumber, totalStops, onContinue, onBack }) {
  const tk = tenseKey(selectedTense);
  const lastCountryName = localStorage.getItem(`conj_${tk}_last_country_name`) || "";
  const lastAccuracy = parseFloat(localStorage.getItem(`conj_${tk}_accuracy`) || "0");
  const cumCorrect = parseInt(localStorage.getItem(`conj_${tk}_cumulative_correct`) || "0", 10);
  const cumTotal = parseInt(localStorage.getItem(`conj_${tk}_cumulative_total`) || "0", 10);
  const totalAccuracy = cumTotal > 0 ? Math.round((cumCorrect / cumTotal) * 100) : null;
  const bestStreak = parseInt(localStorage.getItem(`conj_${tk}_streak`) || "0", 10);

  const [factIndex] = useState(() => getFunFactIndex(country.code));

  useEffect(() => {
    advanceFunFactIndex(country.code);
  }, [country.code]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(ellipse at 50% 30%, #1e2a50 0%, #0d1630 50%, #07101e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
          padding: "8px 18px",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ← Back to Map
      </button>

      {/* Stop counter */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.3)",
          color: "#f59e0b",
          padding: "8px 18px",
          borderRadius: "20px",
          fontSize: "0.88rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        ✈ Stop {stopNumber} of {totalStops}
      </div>

      {/* Country code */}
      <div
        style={{
          fontSize: "5.5rem",
          fontWeight: 900,
          color: "white",
          letterSpacing: "0.05em",
          marginBottom: "4px",
          lineHeight: 1,
        }}
      >
        {country.code}
      </div>

      {/* Adventure awaits */}
      <div
        style={{
          color: "#f59e0b",
          fontWeight: 700,
          fontSize: "1.05rem",
          marginBottom: "14px",
          letterSpacing: "0.02em",
        }}
      >
        Adventure awaits!
      </div>

      {/* Country name */}
      <h1
        style={{
          margin: "0 0 10px 0",
          fontSize: "3.5rem",
          fontWeight: 900,
          letterSpacing: "0.01em",
        }}
      >
        {country.name}
      </h1>

      {/* Details line */}
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "1rem",
          marginBottom: "4px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span>{country.capital}</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span>{country.region}</span>
        <span style={{ opacity: 0.4 }}>•</span>
        <span style={{ color: "#f59e0b" }}>{country.landmark}</span>
      </div>

      {/* Description */}
      <div
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.9rem",
          fontStyle: "italic",
          marginBottom: "36px",
        }}
      >
        {country.description}
      </div>

      {/* Info cards row */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "16px",
          marginBottom: "40px",
          width: "min(1020px, 92vw)",
        }}
      >
        {/* Did you know */}
        {(() => {
          const fact = country.funFacts[factIndex];
          const len = fact.length;
          const fontSize = len < 70 ? "1.35rem" : len < 100 ? "1.1rem" : len < 130 ? "0.95rem" : "0.85rem";
          return (
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: "16px",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: "#f59e0b",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  letterSpacing: "0.08em",
                  marginBottom: "14px",
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                😎 DID YOU KNOW?
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  color: "rgba(255,255,255,0.85)",
                  fontSize,
                  lineHeight: 1.5,
                }}
              >
                {fact}
              </div>
            </div>
          );
        })()}

        {/* Stats */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "16px",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ color: "#a5b4fc", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.08em", textAlign: "center" }}>
            📊 YOUR STATS · {selectedTense}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Last country accuracy */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
                {lastCountryName ? `Accuracy · ${lastCountryName}` : "Last accuracy"}
              </span>
              <span style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>
                {lastCountryName ? `${lastAccuracy}%` : "—"}
              </span>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Total accuracy */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>Total accuracy</span>
              <span style={{ color: "#60a5fa", fontWeight: 800, fontSize: "1rem" }}>
                {totalAccuracy !== null ? `${totalAccuracy}%` : "—"}
              </span>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

            {/* Best streak */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>Best streak</span>
              <span style={{ color: "#fb923c", fontWeight: 800, fontSize: "1rem" }}>
                🔥 {bestStreak}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        style={{
          padding: "1.1rem 4.5rem",
          background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          border: "none",
          borderRadius: "50px",
          color: "white",
          fontSize: "1.4rem",
          fontWeight: 900,
          cursor: "pointer",
          letterSpacing: "0.1em",
          boxShadow:
            "0 0 40px rgba(245,158,11,0.35), 0 8px 24px rgba(239,68,68,0.25)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.boxShadow =
            "0 0 60px rgba(245,158,11,0.55), 0 12px 32px rgba(239,68,68,0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 0 40px rgba(245,158,11,0.35), 0 8px 24px rgba(239,68,68,0.25)";
        }}
      >
        CONTINUE!
      </button>
    </div>
  );
}
