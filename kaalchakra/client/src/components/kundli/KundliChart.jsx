import React, { useState, useMemo } from "react";

/**
 * Traditional North Indian Kundli Chart (Diamond / Kite layout)
 * - Outer square + two diagonals + an inner diamond connecting midpoints
 * - 12 houses arranged exactly as per classical Vedic North Indian style
 * - Ascendant (Lagna) is the 1st house — top-center diamond
 * - House order (anti-clockwise from top-center):
 *     1 (top)  -> 2 (top-left upper) -> 3 (top-left lower) -> 4 (left)
 *     5 (bottom-left upper) -> 6 (bottom-left lower) -> 7 (bottom)
 *     8 (bottom-right lower) -> 9 (bottom-right upper) -> 10 (right)
 *     11 (top-right lower) -> 12 (top-right upper)
 */

const PLANET_META = {
  Sun: { short: "Su", color: "#E25822", name: "Surya" },
  Moon: { short: "Mo", color: "#475569", name: "Chandra" },
  Mars: { short: "Ma", color: "#DC2626", name: "Mangal" },
  Mercury: { short: "Me", color: "#059669", name: "Budha" },
  Jupiter: { short: "Ju", color: "#7C3AED", name: "Guru" },
  Venus: { short: "Ve", color: "#DB2777", name: "Shukra" },
  Saturn: { short: "Sa", color: "#1D4ED8", name: "Shani" },
  Rahu: { short: "Ra", color: "#1f2a44", name: "Rahu" },
  Ketu: { short: "Ke", color: "#1f2a44", name: "Ketu" },
};

const ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const ZODIAC_NUM = {
  Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
  Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12,
};

// Geometry for a 400x400 chart
const S = 400;
const H = S / 2;      // 200
const Q = S / 4;      // 100
const TQ = (3 * S) / 4; // 300

// Fixed house polygons with correct centroid positions for labels
const HOUSES = [
  { num: 1, name: "Lagna", points: `${H},0 ${TQ},${Q} ${H},${H} ${Q},${Q}`, label: { x: H, y: Q * 0.9 } },
  { num: 2, name: "Dhana", points: `${H},0 ${Q},${Q} 0,0`, label: { x: Q * 0.7, y: Q * 0.55 } },
  { num: 3, name: "Sahaja", points: `0,0 ${Q},${Q} 0,${H}`, label: { x: Q * 0.55, y: Q * 0.7 } },
  { num: 4, name: "Sukha", points: `0,${H} ${Q},${Q} ${H},${H} ${Q},${TQ}`, label: { x: Q * 0.9, y: H } },
  { num: 5, name: "Putra", points: `0,${H} ${Q},${TQ} 0,${S}`, label: { x: Q * 0.55, y: TQ * 0.7 } },
  { num: 6, name: "Ripu", points: `0,${S} ${Q},${TQ} ${H},${S}`, label: { x: Q * 0.7, y: TQ * 0.55 } },
  { num: 7, name: "Yuvati", points: `${H},${S} ${Q},${TQ} ${H},${H} ${TQ},${TQ}`, label: { x: H, y: TQ * 1.1 } },
  { num: 8, name: "Randhra", points: `${H},${S} ${TQ},${TQ} ${S},${S}`, label: { x: TQ * 0.7, y: TQ * 0.55 } },
  { num: 9, name: "Dharma", points: `${S},${S} ${TQ},${TQ} ${S},${H}`, label: { x: TQ * 0.55, y: TQ * 0.7 } },
  { num: 10, name: "Karma", points: `${S},${H} ${TQ},${TQ} ${H},${H} ${TQ},${Q}`, label: { x: TQ * 1.1, y: H } },
  { num: 11, name: "Labha", points: `${S},${H} ${TQ},${Q} ${S},0`, label: { x: TQ * 0.55, y: Q * 0.7 } },
  { num: 12, name: "Vyaya", points: `${S},0 ${TQ},${Q} ${H},0`, label: { x: TQ * 0.7, y: Q * 0.55 } },
];

// Fixed sign calculation for each house from the ascendant sign
const signForHouse = (ascendantSign, houseNumber) => {
  const ascIdx = ZODIAC_NUM[ascendantSign] || 1;
  // In North Indian style, houses go counter-clockwise starting from top (house 1)
  const idx = ((ascIdx - 1 + (houseNumber - 1)) % 12) + 1;
  return { name: ZODIAC[idx - 1], num: idx };
};

const KundliChart = ({
  planets = [],
  ascendant = "Aries",
  name = "",
  onHouseClick,
}) => {
  const [selected, setSelected] = useState(null);
  const [hoverHouse, setHoverHouse] = useState(null);

  // Group planets by house
  const planetsByHouse = useMemo(() => {
    const map = {};
    (planets || []).forEach((p) => {
      const h = parseInt(p.house, 10);
      if (!h || h < 1 || h > 12) return;
      if (!map[h]) map[h] = [];
      map[h].push(p);
    });
    return map;
  }, [planets]);

  const handleClick = (h) => {
    const next = selected === h.num ? null : h.num;
    setSelected(next);
    if (onHouseClick) {
      onHouseClick(h.num, {
        house: h.num,
        name: h.name,
        sign: signForHouse(ascendant, h.num).name,
        planets: planetsByHouse[h.num] || [],
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto" data-testid="kundli-chart-root">
      <div className="relative rounded-3xl p-6 md:p-8 border border-amber-200 shadow-[0_10px_40px_-10px_rgba(234,88,12,0.25)]" style={{ backgroundImage: 'linear-gradient(to bottom right, #fffbeb, #fff7ed, #fff1f2)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md" style={{ backgroundImage: 'linear-gradient(to bottom right, #f97316, #f43f5e)' }}>
              ॐ
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 tracking-tight" data-testid="kundli-title">
                Vedic Indian Astrology
              </h3>
              <p className="text-xs text-stone-500">
                Lagna (Ascendant):{" "}
                <span className="font-semibold text-orange-700" data-testid="kundli-ascendant">
                  {ascendant}
                </span>
                {name ? <> · {name}</> : null}
              </p>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Vedic Chart
          </span>
        </div>

        {/* Chart + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SVG Chart */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square w-full max-w-[520px] mx-auto">
              <svg
                viewBox={`-6 -6 ${S + 12} ${S + 12}`}
                className="w-full h-full drop-shadow-sm"
                data-testid="kundli-svg"
              >
                {/* Decorative outer frame */}
                <rect
                  x="-4" y="-4"
                  width={S + 8} height={S + 8}
                  rx="10"
                  fill="url(#paperBg)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="paperBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fecaca" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="lagnaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0.35" />
                  </linearGradient>
                  <linearGradient id="selectedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.45" />
                  </linearGradient>
                </defs>

                {/* House polygons */}
                {HOUSES.map((h) => {
                  const isSelected = selected === h.num;
                  const isHover = hoverHouse === h.num;
                  const isLagna = h.num === 1;
                  const fill = isSelected
                    ? "url(#selectedFill)"
                    : isLagna
                    ? "url(#lagnaFill)"
                    : isHover
                    ? "rgba(251,146,60,0.18)"
                    : "rgba(255,255,255,0.35)";
                  return (
                    <polygon
                      key={h.num}
                      points={h.points}
                      fill={fill}
                      stroke="#c2410c"
                      strokeWidth={isSelected ? 2.5 : 1.25}
                      style={{ cursor: "pointer", transition: "fill 0.25s ease" }}
                      onClick={() => handleClick(h)}
                      onMouseEnter={() => setHoverHouse(h.num)}
                      onMouseLeave={() => setHoverHouse(null)}
                      data-testid={`house-${h.num}`}
                    />
                  );
                })}

                {/* Per-house content: sign number + planets */}
                {HOUSES.map((h) => {
                  const sign = signForHouse(ascendant, h.num);
                  const ps = planetsByHouse[h.num] || [];
                  const isLagna = h.num === 1;
                  return (
                    <g key={`t-${h.num}`} pointerEvents="none">
                      {/* Sign number in top-corner of each house */}
                      <text
                        x={h.label.x}
                        y={h.label.y - 14}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        fill="#9a3412"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {sign.num}
                      </text>

                      {/* Lagna label in house 1 */}
                      {isLagna && ps.length === 0 && (
                        <text
                          x={h.label.x}
                          y={h.label.y + 4}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#c2410c"
                          letterSpacing="1"
                        >
                          LAGNA
                        </text>
                      )}

                      {/* Planets - rendered as small abbreviations with improved positioning */}
                      {ps.map((p, i) => {
                        const meta = PLANET_META[p.name] || { short: p.name?.slice(0, 2) || "?", color: "#334155" };
                        // Arrange planets in up to 2 rows with better centering
                        const perRow = 3;
                        const row = Math.floor(i / perRow);
                        const col = i % perRow;
                        const count = Math.min(ps.length - row * perRow, perRow);
                        const spread = 22;
                        const xOffset = (col - (count - 1) / 2) * spread;
                        const yOffset = row * 16 + (ps.length <= 3 ? 2 : 6);
                        return (
                          <g key={`${h.num}-${i}`} transform={`translate(${h.label.x + xOffset}, ${h.label.y + yOffset})`}>
                            <text
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="700"
                              fill={meta.color}
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {meta.short}
                              {p.retrograde && (
                                <tspan fontSize="8" dy="-4" fill="#dc2626"> (R)</tspan>
                              )}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Center Om symbol (subtle) */}
                <text
                  x={H} y={H + 6}
                  textAnchor="middle"
                  fontSize="28"
                  fill="#c2410c"
                  opacity="0.15"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  ॐ
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-stone-600">
              {Object.entries(PLANET_META).map(([k, v]) => (
                <div key={k} className="inline-flex items-center gap-1.5">
                  <span className="font-bold" style={{ color: v.color }}>{v.short}</span>
                  <span className="text-stone-500">{k}</span>
                </div>
              ))}
              <div className="inline-flex items-center gap-1.5">
                <span className="font-bold text-red-600">(R)</span>
                <span className="text-stone-500">Retrograde</span>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            <HouseDetails
              selected={selected}
              ascendant={ascendant}
              planetsByHouse={planetsByHouse}
              onClear={() => setSelected(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HouseDetails = ({ selected, ascendant, planetsByHouse, onClear }) => {
  if (!selected) {
    return (
      <div className="h-full min-h-[280px] rounded-2xl border border-dashed border-amber-300 bg-white/60 backdrop-blur-sm p-5 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full  flex items-center justify-center text-2xl mb-3" style={{ backgroundImage: 'linear-gradient(to bottom right, #fde68a, #fdba74)' }}>
          ✦
        </div>
        <p className="text-sm font-semibold text-stone-700">Click any house</p>
        <p className="text-xs text-stone-500 mt-1 max-w-[220px]">
          Tap a bhava (house) in the chart to reveal its rashi (sign) and grahas (planets).
        </p>
      </div>
    );
  }

  const h = HOUSES.find((x) => x.num === selected);
  const sign = signForHouse(ascendant, selected);
  const ps = planetsByHouse[selected] || [];

  return (
    <div
      className="h-full rounded-2xl border border-amber-200 bg-white/85 backdrop-blur-sm p-5 shadow-sm"
      data-testid="house-details-panel"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-orange-600 font-semibold">
            Bhava {selected}
          </p>
          <h4 className="text-lg font-bold text-stone-800 mt-0.5" data-testid="house-details-name">
            {h?.name} Bhava
          </h4>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-stone-400 hover:text-stone-700 text-sm rounded-md px-2 py-1 hover:bg-stone-100 transition"
          data-testid="house-details-close"
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
        <div className="rounded-lg  border border-amber-100 p-2.5" style={{ backgroundImage: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }}>
          <p className="text-[10px] uppercase tracking-wider text-stone-500">Rashi</p>
          <p className="font-semibold text-stone-800 mt-0.5">
            {sign.name} <span className="text-orange-600">#{sign.num}</span>
          </p>
        </div>
        <div className="rounded-lg  border border-amber-100 p-2.5" style={{ backgroundImage: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }}>
          <p className="text-[10px] uppercase tracking-wider text-stone-500">Grahas</p>
          <p className="font-semibold text-stone-800 mt-0.5">{ps.length}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Planets in this house</p>
        {ps.length === 0 ? (
          <p className="text-xs text-stone-400 italic">No grahas placed here.</p>
        ) : (
          <ul className="space-y-1.5" data-testid="house-details-planets">
            {ps.map((p, i) => {
              const meta = PLANET_META[p.name] || { short: "?", color: "#334155", name: p.name };
              return (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition px-2.5 py-1.5 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-flex w-7 h-7 rounded-md items-center justify-center font-bold text-white text-[11px]"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.short}
                    </span>
                    <span className="font-semibold text-stone-800">{p.name}</span>
                    {p.retrograde && (
                      <span className="text-red-600 font-bold text-[10px]">R</span>
                    )}
                  </span>
                  <span className="text-stone-500">{p.degree || ""}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default KundliChart;