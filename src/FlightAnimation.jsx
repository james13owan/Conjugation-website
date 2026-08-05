import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, useMapContext } from "react-simple-maps";
import { geoNaturalEarth1 } from "d3-geo";
import { COUNTRIES, GEO_URL, SPANISH_ID_SET, getCompletedCodes, isFlightRoute, isBoatRoute } from "./countries.js";

// Only these two ocean crossings use the full arc animation; all other flights zoom-and-hop.
const LONG_HAUL = new Set(["UY-GQ", "GQ-ES"]);
const BUS_DURATION   = 3200;
const PLANE_DURATION = 2800;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Catmull-Rom spline — smooth curve through geographic waypoints
function crPoint(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [
    0.5 * ((2*p1[0]) + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    0.5 * ((2*p1[1]) + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3),
  ];
}
function evalSpline(pts, t) {
  if (pts.length < 2) return pts[0] || [0, 0];
  const n   = pts.length - 1;
  const raw = t * n;
  const seg = Math.min(Math.floor(raw), n - 1);
  const st  = raw - seg;
  const p1  = pts[seg], p2 = pts[seg + 1];
  const p0  = seg > 0     ? pts[seg - 1]  : [2*p1[0]-p2[0], 2*p1[1]-p2[1]];
  const p3  = seg < n - 1 ? pts[seg + 2]  : [2*p2[0]-p1[0], 2*p2[1]-p1[1]];
  return crPoint(p0, p1, p2, p3, st);
}

// Pan-American Highway waypoints for every bus route (exaggerated for visual interest)
const BUS_WAYPOINTS = {
  "MX-GT": [
    [-99.13,19.43],[-98.0,19.0],[-96.5,18.0],[-94.8,17.5],
    [-93.5,17.0],[-92.5,16.7],[-91.8,16.0],[-90.9,15.5],[-90.52,14.64],
  ],
  "GT-SV": [
    [-90.52,14.64],[-90.3,14.3],[-89.9,14.0],[-89.5,13.8],[-89.19,13.69],
  ],
  "SV-HN": [
    [-89.19,13.69],[-88.8,13.8],[-88.5,14.0],[-88.1,14.15],[-87.6,14.1],[-87.21,14.10],
  ],
  "HN-NI": [
    [-87.21,14.10],[-86.9,13.7],[-86.8,13.2],[-86.6,12.8],[-86.4,12.4],[-86.29,12.13],
  ],
  "NI-CR": [
    [-86.29,12.13],[-85.9,11.8],[-85.7,11.3],[-85.4,10.9],
    [-85.0,10.5],[-84.6,10.2],[-84.2,10.0],[-84.09,9.93],
  ],
  "CR-PA": [
    [-84.09,9.93],[-83.6,9.6],[-82.9,9.3],[-82.3,9.0],
    [-81.5,8.7],[-80.7,8.8],[-79.9,9.0],[-79.52,8.99],
  ],
  "VE-CO": [
    [-66.88,10.49],[-68.5,10.3],[-70.0,10.0],[-71.7,9.5],
    [-71.8,8.7],[-72.0,7.7],[-72.6,7.0],[-72.9,6.2],[-73.8,5.5],[-74.07,4.70],
  ],
  "CO-EC": [
    [-74.07,4.70],[-75.0,3.8],[-75.7,2.9],[-76.5,2.3],
    [-77.0,1.5],[-77.5,0.8],[-78.0,0.3],[-78.52,-0.22],
  ],
  "EC-PE": [
    [-78.52,-0.22],[-79.2,-1.5],[-79.9,-3.0],[-80.5,-4.5],
    [-80.7,-6.0],[-80.5,-7.5],[-79.5,-9.0],[-78.5,-10.5],[-77.5,-11.5],[-77.04,-12.05],
  ],
  "PE-BO": [
    [-77.04,-12.05],[-76.5,-13.5],[-75.2,-14.8],[-73.5,-15.8],
    [-71.5,-16.5],[-69.5,-16.8],[-68.0,-17.5],[-66.5,-18.5],[-65.26,-19.04],
  ],
  "BO-PY": [
    [-65.26,-19.04],[-64.0,-19.5],[-62.5,-19.8],[-60.5,-20.3],
    [-60.0,-21.5],[-59.0,-23.0],[-58.5,-24.0],[-57.64,-25.29],
  ],
  "PY-CL": [
    [-57.64,-25.29],[-58.5,-27.0],[-59.5,-28.5],[-61.5,-30.0],
    [-63.5,-31.5],[-65.0,-32.0],[-67.0,-32.8],[-69.0,-33.1],[-70.0,-33.3],[-70.65,-33.46],
  ],
  "CL-AR": [
    [-70.65,-33.46],[-69.5,-33.5],[-68.0,-33.6],
    [-65.5,-33.8],[-63.0,-34.1],[-60.5,-34.3],[-58.38,-34.61],
  ],
};

function quadBezier(p0, p1, p2, t) {
  const mt = 1 - t;
  return { x: mt*mt*p0.x + 2*mt*t*p1.x + t*t*p2.x, y: mt*mt*p0.y + 2*mt*t*p1.y + t*t*p2.y };
}
function bezierAngle(p0, p1, p2, t) {
  const dx = 2*(1-t)*(p1.x-p0.x) + 2*t*(p2.x-p1.x);
  const dy = 2*(1-t)*(p1.y-p0.y) + 2*t*(p2.y-p1.y);
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

// All dimensions are in SVG units divided by zoom so the pin appears
// the same physical size on screen regardless of the CSS scale factor.
function CapitalPin({ color, label, zoom = 1 }) {
  const s     = 1 / zoom;
  const dotR  = 3.5 * s;
  const stemH = 20 * s;
  const rectH = 11 * s;
  const rectW = (label.length * 4.0 + 10) * s;

  return (
    <>
      {/* Ground dot */}
      <circle cx={0} cy={0} r={dotR} fill={color} stroke="white" strokeWidth={0.8 * s} />
      {/* Thin stem */}
      <line x1={0} y1={-dotR} x2={0} y2={-(stemH)} stroke={color} strokeWidth={0.6 * s} />
      {/* Callout bubble */}
      <rect
        x={-rectW / 2} y={-(stemH + rectH)}
        width={rectW} height={rectH}
        rx={2 * s}
        fill="rgba(5,10,24,0.9)" stroke={color} strokeWidth={0.6 * s}
      />
      <text
        x={0} y={-(stemH + rectH / 2)}
        textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: `${6 * s}px`, fontWeight: 700, fill: "white", userSelect: "none", pointerEvents: "none" }}
      >
        {label}
      </text>
    </>
  );
}

// Renders a red polyline trail following the spline waypoints up to busT (0–1).
// Uses useMapContext() for the d3 projection — must be rendered inside ComposableMap.
function BusTrail({ waypoints, busT, busZoom }) {
  const { projection } = useMapContext();
  const STEPS = 120;
  const count = Math.floor(busT * STEPS);
  if (count < 2) return null;

  const points = Array.from({ length: count }, (_, i) => {
    const [lon, lat] = evalSpline(waypoints, i / STEPS);
    const projected = projection([lon, lat]);
    if (!projected) return null;
    return `${projected[0]},${projected[1]}`;
  }).filter(Boolean).join(" ");

  return (
    <polyline
      points={points}
      fill="none"
      stroke="#ef4444"
      strokeWidth={2 / busZoom}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.9}
    />
  );
}

// Build a projection matching ComposableMap's defaults (width=800, height=600) and
// return {centerX, centerY, zoom} in CSS-percentage-of-viewport coordinates.
// ComposableMap renders with viewBox="0 0 800 600" and preserveAspectRatio "xMidYMid meet",
// which letterboxes on non-4:3 screens. We account for that offset so the CSS
// transform-origin aligns exactly with the projected city positions.
function computeBusZoomParams(fromCoords, toCoords) {
  const MAP_W = 800, MAP_H = 600;
  const vw = window.innerWidth, vh = window.innerHeight;
  // Scale factor and letterbox/pillarbox offsets
  const k    = Math.min(vw / MAP_W, vh / MAP_H);
  const offX = (vw - MAP_W * k) / 2;
  const offY = (vh - MAP_H * k) / 2;
  const proj = geoNaturalEarth1().scale(180).rotate([60, 0, 0]).translate([MAP_W / 2, MAP_H / 2]);
  const fp = proj(fromCoords) || [MAP_W / 2, MAP_H / 2];
  const tp = proj(toCoords)   || [MAP_W / 2, MAP_H / 2];
  // Convert SVG user-space coords → CSS percentage of the viewport div
  const fromX = (offX + fp[0] * k) / vw * 100;
  const fromY = (offY + fp[1] * k) / vh * 100;
  const toX   = (offX + tp[0] * k) / vw * 100;
  const toY   = (offY + tp[1] * k) / vh * 100;
  const cx = (fromX + toX) / 2;
  const cy = (fromY + toY) / 2;
  const sx = Math.abs(toX - fromX);
  const sy = Math.abs(toY - fromY);
  const zoom = Math.min(80 / (Math.max(sx, sy, 1.5) * 2.5), 12);
  return { centerX: cx, centerY: cy, zoom };
}

export default function FlightAnimation({ fromCountry, toCountry, completedCodes: prop, onComplete }) {
  const completedCodes = prop || getCompletedCodes();
  const isBoat = isBoatRoute(fromCountry.code, toCountry.code);
  const isBus = !isBoat && !isFlightRoute(fromCountry.code, toCountry.code);
  const isLongHaul = LONG_HAUL.has(`${fromCountry.code}-${toCountry.code}`);
  // useZoom = bus OR boat OR short island hop — all zoom into the region and animate between capitals
  const useZoom = isBus || isBoat || (!isLongHaul);
  const moveEmoji = isBus ? "🚌" : isBoat ? "⛴️" : "✈️";

  // ── CSS-zoom state (uses screenPos for transform-origin) ──
  const [mapScale,      setMapScale]      = useState(1);
  const [mapOriginX,    setMapOriginX]    = useState(50);
  const [mapOriginY,    setMapOriginY]    = useState(50);
  const [mapTransition, setMapTransition] = useState("none");

  // ── Bus: geographic coordinates interpolated inside the SVG ──
  const [busCoords, setBusCoords] = useState(fromCountry.capitalCoords);
  const [busT,      setBusT]      = useState(0);
  const [showBus,   setShowBus]   = useState(false);

  // ── Plane: screen-space emoji (unchanged) ──
  const [planePos,   setPlanePos]   = useState(fromCountry.screenPos);
  const [planeAngle, setPlaneAngle] = useState(0);
  const [showPlane,  setShowPlane]  = useState(false);

  const [phase, setPhase] = useState("init");

  // Accurate midpoint + zoom computed from the real d3-geo projection
  const busParams = useRef(
    useZoom ? computeBusZoomParams(fromCountry.capitalCoords, toCountry.capitalCoords) : null
  );

  const rafRef   = useRef(null);
  const timerRef = useRef([]);

  // ── Bus route waypoints (Catmull-Rom spline path) ──
  const routeWaypoints = BUS_WAYPOINTS[`${fromCountry.code}-${toCountry.code}`]
    || [fromCountry.capitalCoords, toCountry.capitalCoords];

  // ── Bus zoom geometry (screenPos midpoint — just for CSS transform origin) ──
  const midX    = (fromCountry.screenPos.x + toCountry.screenPos.x) / 2;
  const midY    = (fromCountry.screenPos.y + toCountry.screenPos.y) / 2;
  const spanX   = Math.abs(toCountry.screenPos.x - fromCountry.screenPos.x);
  const spanY   = Math.abs(toCountry.screenPos.y - fromCountry.screenPos.y);
  const busZoom = Math.min(100 / (Math.max(spanX, spanY, 3) * 2.6), 13);

  // ── Plane arc geometry ──
  const planeP0  = fromCountry.screenPos;
  const planeP2  = toCountry.screenPos;
  const arcLift  = Math.max(10, Math.sqrt(spanX**2 + spanY**2) * 0.4);
  const planeP1  = { x: midX, y: midY - arcLift };

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timerRef.current.push(id);
    return id;
  };

  // projRef.current is already set by ProjectionCapture's synchronous render before this fires
  useEffect(() => {
    if (useZoom) startBus(); else startFlight();
    return () => { timerRef.current.forEach(clearTimeout); cancelAnimationFrame(rafRef.current); };
  }, []);

  // ────────────────────────────────────────────
  //  BUS MODE — geo interpolation inside the SVG
  // ────────────────────────────────────────────
  const startBus = () => {
    const { centerX, centerY, zoom } = busParams.current || { centerX: midX, centerY: midY, zoom: busZoom };
    setPhase("zoom-region");
    // Center the view on the midpoint between both capitals.
    // Formula: O = (S*P - 50) / (S - 1) places point P at 50% after scale(S).
    const ox = (zoom * centerX - 50) / (zoom - 1);
    const oy = (zoom * centerY - 50) / (zoom - 1);
    setMapOriginX(ox);
    setMapOriginY(oy);
    setBusCoords(fromCountry.capitalCoords);

    addTimer(() => {
      setMapTransition("transform 1.1s cubic-bezier(0.4,0,0.2,1)");
      setMapScale(zoom);
    }, 100);

    addTimer(() => {
      setPhase("driving");
      setShowBus(true);
      driveBus();
    }, 1500);

    addTimer(onComplete, 1500 + BUS_DURATION + 600);
  };

  const driveBus = () => {
    const start = performance.now();
    const tick  = (now) => {
      const raw = Math.min((now - start) / BUS_DURATION, 1);
      const t   = easeInOut(raw);
      setBusCoords(evalSpline(routeWaypoints, t));
      setBusT(t);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ────────────────────────────────────────────
  //  FLIGHT MODE (unchanged — ocean crossings)
  // ────────────────────────────────────────────
  const startFlight = () => {
    setPhase("zoom-from");
    setMapOriginX(fromCountry.screenPos.x);
    setMapOriginY(fromCountry.screenPos.y);

    addTimer(() => { setMapTransition("transform 1.1s cubic-bezier(0.4,0,0.2,1)"); setMapScale(4.5); }, 100);
    addTimer(() => { setMapTransition("transform 1s cubic-bezier(0.4,0,0.2,1)"); setMapScale(1); }, 2100);

    addTimer(() => {
      setPhase("flight");
      setShowPlane(true);
      setPlanePos(planeP0);
      setMapTransition("none");
      flyPlane();
    }, 3300);
  };

  const flyPlane = () => {
    const start = performance.now();
    const tick  = (now) => {
      const raw = Math.min((now - start) / PLANE_DURATION, 1);
      const t   = easeInOut(raw);
      setPlanePos(quadBezier(planeP0, planeP1, planeP2, t));
      setPlaneAngle(bezierAngle(planeP0, planeP1, planeP2, t));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("zoom-to");
        setShowPlane(false);
        setMapOriginX(toCountry.screenPos.x);
        setMapOriginY(toCountry.screenPos.y);
        addTimer(() => { setMapTransition("transform 1.1s cubic-bezier(0.4,0,0.2,1)"); setMapScale(4.5); }, 80);
        addTimer(onComplete, 1900);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // ── Map colour helpers ──
  const currentIdx  = COUNTRIES.findIndex(c => c.code === toCountry.code);
  const isCompleted = (code) => completedCodes.has(code);
  const isLocked    = (idx)  => idx > currentIdx;

  const getGeoFill = (numId) => {
    if (!SPANISH_ID_SET.has(numId)) return "#0c1118";
    const idx  = COUNTRIES.findIndex((c) => c.numId === numId);
    const code = COUNTRIES[idx]?.code;
    if (code === fromCountry.code) return "#22c55e";
    if (idx === currentIdx)        return "#f59e0b";
    if (isCompleted(code))         return `url(#flag-${code})`;
    if (isLocked(idx))             return "#1e1b4b";
    return "#15803d";
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050a18", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Zoomable map layer ── */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${mapScale})`,
        transformOrigin: `${mapOriginX}% ${mapOriginY}%`,
        transition: mapTransition,
      }}>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 180, rotate: [60, 0, 0] }}
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            {COUNTRIES.filter(c => c.code !== fromCountry.code && isCompleted(c.code)).map(c => (
              <pattern
                key={`flag-pattern-${c.code}`}
                id={`flag-${c.code}`}
                patternUnits="objectBoundingBox"
                patternContentUnits="objectBoundingBox"
                width="1" height="1"
              >
                <image
                  href={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                  x="0" y="0" width="1" height="1"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo}
                  style={{
                    default: { fill: getGeoFill(Number(geo.id)), stroke: "#ffffff14", strokeWidth: 0.5, outline: "none" },
                    hover:   { fill: getGeoFill(Number(geo.id)), outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Completed markers — hidden during zoom-style animations and during the flight itself */}
          {!useZoom && phase !== "flight" && COUNTRIES.map((c) => {
            if (!isCompleted(c.code)) return null;
            return (
              <Marker key={c.code} coordinates={c.center}>
                <circle r={7} fill="rgba(34,197,94,0.9)" stroke="white" strokeWidth={1} />
                <text textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: "9px", fontWeight: 900, fill: "white", pointerEvents: "none", userSelect: "none" }}>✓</text>
              </Marker>
            );
          })}

          {/* Capital pins — visible during zoom-style animation */}
          {useZoom && (phase === "zoom-region" || phase === "driving") && (
            <>
              <Marker coordinates={fromCountry.capitalCoords}>
                <CapitalPin color="#f59e0b" label={fromCountry.capital} zoom={busParams.current?.zoom || busZoom} />
              </Marker>
              <Marker coordinates={toCountry.capitalCoords}>
                <CapitalPin color="#4ade80" label={toCountry.capital} zoom={busParams.current?.zoom || busZoom} />
              </Marker>
            </>
          )}

          {/* Red trail + mover emoji — inside zoom div, scaled by 1/zoom */}
          {useZoom && showBus && (
            <>
              <BusTrail
                waypoints={routeWaypoints}
                busT={busT}
                busZoom={busParams.current?.zoom || busZoom}
              />
              <Marker coordinates={busCoords}>
                <text textAnchor="middle" dominantBaseline="central"
                  style={{ fontSize: `${12 / (busParams.current?.zoom || busZoom)}px`, userSelect: "none", pointerEvents: "none",
                           filter: "drop-shadow(0 0 4px rgba(255,220,50,0.95))" }}>
                  {moveEmoji}
                </text>
              </Marker>
            </>
          )}

          {/* Flight: pulse on from-country */}
          {phase === "zoom-from" && (
            <Marker coordinates={fromCountry.center}>
              <circle r={14} fill="rgba(34,197,94,0.15)" stroke="#4ade80" strokeWidth={2} />
              <circle r={6}  fill="#22c55e" stroke="white" strokeWidth={1.5} />
            </Marker>
          )}

          {/* Flight: capital pin on destination */}
          {phase === "zoom-to" && (
            <Marker coordinates={toCountry.capitalCoords}>
              <CapitalPin color="#fbbf24" label={toCountry.capital} zoom={4.5} />
            </Marker>
          )}
        </ComposableMap>
      </div>

      {/* ── Flight arc (normal scale, outside zoom) ── */}
      {!useZoom && phase === "flight" && (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}
          viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={`M ${planeP0.x} ${planeP0.y} Q ${planeP1.x} ${planeP1.y} ${planeP2.x} ${planeP2.y}`}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" strokeDasharray="1.2,0.8" />
          <circle cx={planeP0.x} cy={planeP0.y} r={0.7} fill="#f59e0b" opacity={0.8} />
          <circle cx={planeP2.x} cy={planeP2.y} r={0.7} fill="#4ade80" opacity={0.8} />
        </svg>
      )}

      {/* ── Plane emoji (CSS positioned, outside zoom) ── */}
      {showPlane && (
        <div style={{
          position: "absolute",
          left: `${planePos.x}%`,
          top:  `${planePos.y}%`,
          transform: `translate(-50%,-50%) rotate(${planeAngle}deg)`,
          fontSize: "22px",
          zIndex: 20,
          pointerEvents: "none",
          filter: "drop-shadow(0 0 10px rgba(251,191,36,1))",
        }}>
          ✈️
        </div>
      )}

      {/* ── Zoom-mode banner ── */}
      {useZoom && (phase === "zoom-region" || phase === "driving") && (
        <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", background: "rgba(8,12,35,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px 28px", textAlign: "center", zIndex: 30, backdropFilter: "blur(12px)", whiteSpace: "nowrap" }}>
          <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "1rem" }}>✅ {fromCountry.name} Complete!</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "4px" }}>
            {moveEmoji} {isBoat ? `Ferry: ${fromCountry.capital} → ${toCountry.capital}` : `${fromCountry.capital} → ${toCountry.capital}`}
          </div>
        </div>
      )}

      {/* ── Completed zoom-in (flights) ── */}
      {phase === "zoom-from" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}>
          <div style={{ fontSize: "4rem", marginBottom: "12px" }}>✅</div>
          <div style={{ color: "#4ade80", fontWeight: 900, fontSize: "2.8rem", textShadow: "0 0 40px rgba(74,222,128,0.8), 0 2px 8px rgba(0,0,0,0.9)" }}>{fromCountry.name}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", marginTop: "8px" }}>Complete!</div>
        </div>
      )}

      {/* ── Long-haul flight banners ── */}
      {!useZoom && phase === "flight" && (
        <>
          <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", background: "rgba(8,12,35,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px 28px", textAlign: "center", zIndex: 30, backdropFilter: "blur(12px)" }}>
            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "1rem" }}>✅ {fromCountry.name} Complete!</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "4px" }}>✈️ Flying to {toCountry.name}...</div>
          </div>
          <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "16px", background: "rgba(8,12,35,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50px", padding: "12px 28px", zIndex: 30, backdropFilter: "blur(12px)" }}>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>{fromCountry.code}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>— ✈ —</span>
            <span style={{ color: "#4ade80", fontWeight: 700 }}>{toCountry.code}</span>
          </div>
        </>
      )}

      {/* ── Destination zoom-in (flights) ── */}
      {phase === "zoom-to" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌍</div>
          <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: "2.5rem", textShadow: "0 0 40px rgba(251,191,36,0.8), 0 2px 8px rgba(0,0,0,0.9)" }}>{toCountry.name}</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1rem", marginTop: "8px" }}>Landing in {toCountry.capital}</div>
        </div>
      )}
    </div>
  );
}
