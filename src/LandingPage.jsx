import React, { useState } from "react";

// Spain coastal background — Costa Brava / Mediterranean
const BG = "https://images.pexels.com/photos/20843248/pexels-photo-20843248.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop";

const TENSES = [
  { name: "Present",     label: "Present"     },
  { name: "Preterite",   label: "Preterite"   },
  { name: "Imperfect",   label: "Imperfect"   },
  { name: "Future",      label: "Future"      },
  { name: "Subjunctive", label: "Subjunctive" },
  { name: "Conditional", label: "Conditional" },
];

// SVG fractal noise — baked into page as a data URI, simulates aged poster grain
const GRAIN = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='n'>" +
  "<feTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/>" +
  "</filter>" +
  "<rect width='200' height='200' filter='url(%23n)'/>" +
  "</svg>"
);

export default function LandingPage({ onStart }) {
  const [vosotros, setVosotros]   = useState(false);
  const [hovered,  setHovered]    = useState(null);

  return (
    <div style={{
      width: "100vw", height: "100vh",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: "'EB Garamond', Georgia, serif",
    }}>

      {/* ── BACKGROUND PHOTO with vintage poster colour treatment ── */}
      <img
        src={BG}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          // sepia + high contrast + slight desaturation = vintage illustration feel
          filter: "sepia(0.40) saturate(0.72) brightness(0.80) contrast(1.22)",
          zIndex: 0,
        }}
      />

      {/* ── COLOUR GRADE OVERLAY — teal highlights, warm dark shadows ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `
          linear-gradient(
            180deg,
            rgba(0, 70, 85, 0.22)   0%,
            rgba(10, 8, 0, 0.08)   45%,
            rgba(0,  0, 0, 0.62)  100%
          )
        `,
      }} />

      {/* ── GRAIN / AGED-PAPER TEXTURE OVERLAY ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,${GRAIN}")`,
        backgroundSize: "200px 200px",
        opacity: 0.18,
        mixBlendMode: "overlay",
      }} />

      {/* ── HORIZONTAL CREASE LINES — aged poster folds ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(0deg,
            transparent              calc(33.3% - 1px),
            rgba(255,255,255,0.06)   calc(33.3% - 1px),
            rgba(255,255,255,0.06)   33.3%,
            rgba(0,0,0,0.10)         33.3%,
            rgba(0,0,0,0.10)         calc(33.3% + 1px),
            transparent              calc(33.3% + 1px),

            transparent              calc(66.6% - 1px),
            rgba(255,255,255,0.05)   calc(66.6% - 1px),
            rgba(255,255,255,0.05)   66.6%,
            rgba(0,0,0,0.08)         66.6%,
            rgba(0,0,0,0.08)         calc(66.6% + 1px),
            transparent              calc(66.6% + 1px)
          )
        `,
      }} />

      {/* ══════════════════════════════════════════
          POSTER CONTENT
      ══════════════════════════════════════════ */}
      <div style={{
        position: "relative", zIndex: 3,
        flex: 1,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "5vh 5vw 4vh",
      }}>

        {/* ── TOP: ESPAÑA headline + birthplace tagline ── */}
        <div>
          <h1 style={{
            fontFamily: "'Alfa Slab One', serif",
            fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
            color: "#bf3b10",
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "0.04em",
            textShadow:
              "3px 4px 0 rgba(0,0,0,0.35), " +
              "0 0 40px rgba(0,0,0,0.25), " +
              "0 0 80px rgba(0,0,0,0.15)",
          }}>
            ESPAÑA
          </h1>

          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(0.75rem, 1.4vw, 1rem)",
            color: "#4a6e28",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            margin: "0.55rem 0 0",
            fontWeight: 600,
            textShadow: "1px 1px 4px rgba(0,0,0,0.65)",
          }}>
            El Hogar del Español &nbsp;•&nbsp; Birthplace of the Language
          </p>
        </div>

        {/* ── BOTTOM of illustration area: Conjugación + subtitle ── */}
        <div>
          <h2 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(3rem, 6.5vw, 5.8rem)",
            color: "#f5edd4",
            margin: "0 0 0.4rem",
            lineHeight: 1.1,
            fontWeight: 400,
            textShadow: "2px 4px 12px rgba(0,0,0,0.70), 0 0 30px rgba(0,0,0,0.40)",
          }}>
            Conjugación
          </h2>

          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(0.85rem, 1.25vw, 1.05rem)",
            color: "rgba(238, 222, 190, 0.92)",
            margin: 0,
            letterSpacing: "0.06em",
            textShadow: "1px 1px 6px rgba(0,0,0,0.75)",
          }}>
            Choose your journey through the Spanish-speaking world
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM PANEL — dark bar, tense selection
      ══════════════════════════════════════════ */}
      <div style={{
        position: "relative", zIndex: 3,
        background: "rgba(18, 11, 5, 0.91)",
        borderTop: "1px solid rgba(190, 148, 78, 0.35)",
        backdropFilter: "blur(4px)",
      }}>

        {/* Row 1 — six tenses in equal columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          borderBottom: "1px solid rgba(190, 148, 78, 0.22)",
        }}>
          {TENSES.map((t, i) => (
            <button
              key={t.name}
              onMouseEnter={() => setHovered(t.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onStart(t.name, vosotros)}
              style={{
                padding: "0.85rem 0.4rem",
                background: hovered === t.name
                  ? "rgba(190, 148, 78, 0.18)"
                  : "transparent",
                border: "none",
                borderRight: i < 5
                  ? "1px solid rgba(190, 148, 78, 0.20)"
                  : "none",
                color: hovered === t.name ? "#f0d898" : "#d8c898",
                fontFamily: "'EB Garamond', serif",
                fontSize: "clamp(0.78rem, 1.05vw, 1rem)",
                fontWeight: 600,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.18s, color 0.18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Row 2 — All Tenses + Vosotros toggle */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <button
            onMouseEnter={() => setHovered("All Tenses")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onStart("All Tenses", vosotros)}
            style={{
              flex: 1,
              padding: "0.72rem 1rem",
              background: hovered === "All Tenses"
                ? "rgba(190, 148, 78, 0.20)"
                : "transparent",
              border: "none",
              borderRight: "1px solid rgba(190, 148, 78, 0.22)",
              color: hovered === "All Tenses" ? "#f5d880" : "#c8a850",
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(0.78rem, 1.05vw, 1rem)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
            }}
          >
            ✦ &nbsp;All Tenses&nbsp; ✦
          </button>

          {/* Vosotros toggle */}
          <div
            onClick={() => setVosotros(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "0.55rem",
              padding: "0.6rem 1.4rem",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div style={{
              width: "36px", height: "20px", borderRadius: "10px",
              background: vosotros ? "#c8a850" : "rgba(255,255,255,0.15)",
              position: "relative", transition: "background 0.3s", flexShrink: 0,
              boxShadow: vosotros ? "0 0 8px rgba(200,168,80,0.5)" : "none",
            }}>
              <div style={{
                position: "absolute", top: "2px",
                left: vosotros ? "18px" : "2px",
                width: "16px", height: "16px", borderRadius: "50%",
                background: "#fff", transition: "left 0.25s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }} />
            </div>
            <span style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(0.78rem, 1vw, 0.95rem)",
              color: "rgba(216, 196, 148, 0.82)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Vosotros
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
