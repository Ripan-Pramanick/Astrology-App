// client/src/components/kundli/KundliChartCanvas.jsx
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useTranslation } from 'react-i18next';

const PLANET_META = {
  Sun:     { short: "Su", color: "#d97706", name: "Surya",       mantra: "ॐ सूर्याय नमः" },
  Moon:    { short: "Mo", color: "#475569", name: "Chandra",     mantra: "ॐ चन्द्राय नमः" },
  Mars:    { short: "Ma", color: "#dc2626", name: "Mangal",      mantra: "ॐ मङ्गलाय नमः" },
  Mercury: { short: "Me", color: "#059669", name: "Budha",       mantra: "ॐ बुधाय नमः" },
  Jupiter: { short: "Ju", color: "#7c3aed", name: "Guru",        mantra: "ॐ गुरवे नमः" },
  Venus:   { short: "Ve", color: "#db2777", name: "Shukra",      mantra: "ॐ शुक्राय नमः" },
  Saturn:  { short: "Sa", color: "#1d4ed8", name: "Shani",       mantra: "ॐ शनैश्चराय नमः" },
  Rahu:    { short: "Ra", color: "#334155", name: "Rahu",        mantra: "ॐ राहवे नमः" },
  Ketu:    { short: "Ke", color: "#334155", name: "Ketu",        mantra: "ॐ केतवे नमः" },
};

const ZODIAC = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const ZODIAC_NUM = {
  Aries:1,Taurus:2,Gemini:3,Cancer:4,Leo:5,Virgo:6,
  Libra:7,Scorpio:8,Sagittarius:9,Capricorn:10,Aquarius:11,Pisces:12,
};
const ZODIAC_SYMBOLS = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};

const HOUSE_DEFS = [
  { num:1,  shape:"square",   pts:[[50,0],[75,25],[50,50],[25,25]],  center:[50,22], numPos:[48,47] },
  { num:2,  shape:"triangle", pts:[[0,0],[50,0],[25,25]],             center:[25,12], numPos:[7,22]  },
  { num:3,  shape:"triangle", pts:[[0,0],[25,25],[0,50]],             center:[10,25], numPos:[19,14] },
  { num:4,  shape:"square",   pts:[[25,25],[50,50],[25,75],[0,50]],   center:[22,50], numPos:[47,48] },
  { num:5,  shape:"triangle", pts:[[0,50],[25,75],[0,100]],           center:[10,75], numPos:[19,62] },
  { num:6,  shape:"triangle", pts:[[25,75],[50,100],[0,100]],         center:[25,88], numPos:[7,78]  },
  { num:7,  shape:"square",   pts:[[50,50],[75,75],[50,100],[25,75]], center:[50,78], numPos:[48,53] },
  { num:8,  shape:"triangle", pts:[[75,75],[100,100],[50,100]],       center:[75,88], numPos:[63,78] },
  { num:9,  shape:"triangle", pts:[[75,75],[100,50],[100,100]],       center:[90,75], numPos:[71,62] },
  { num:10, shape:"square",   pts:[[75,25],[100,50],[75,75],[50,50]], center:[78,50], numPos:[53,48] },
  { num:11, shape:"triangle", pts:[[100,0],[100,50],[75,25]],         center:[90,25], numPos:[71,38] },
  { num:12, shape:"triangle", pts:[[50,0],[100,0],[75,25]],           center:[75,12], numPos:[63,22] },
];

function pointInPolygon(px, py, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const fmtDeg = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "";
  const d = Math.floor(n % 30);
  const m = Math.floor((n - Math.floor(n)) * 60);
  return `${d}°${m.toString().padStart(2,"0")}'`;
};

const sanitizeSign = (s) => {
  if (!s) return "Aries";
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

const getHouseFromSign = (planetSign, ascSign) => {
  const p = ZODIAC_NUM[planetSign] || 1;
  const a = ZODIAC_NUM[ascSign] || 1;
  return ((p - a + 12) % 12) + 1;
};

const signForHouse = (ascSign, houseNum) => {
  const aIdx = ZODIAC_NUM[ascSign] || 1;
  const idx = ((aIdx - 1 + (houseNum - 1)) % 12);
  return ZODIAC[idx];
};

const processPlanets = (planets, ascendant) => {
  let raw = [];
  if (Array.isArray(planets)) raw = planets;
  else if (planets?.planets && Array.isArray(planets.planets)) raw = planets.planets;
  else if (planets?.data && Array.isArray(planets.data)) raw = planets.data;
  else if (typeof planets === "object") raw = Object.values(planets).filter(v => v?.name);

  const validNames = ["sun","moon","mars","mercury","jupiter","venus","saturn","rahu","ketu"];
  let lagna = sanitizeSign(ascendant) || "Aries";
  const ascEntry = raw.find(p => p.name?.toLowerCase() === "ascendant");
  if (ascEntry?.sign) lagna = sanitizeSign(ascEntry.sign);

  const byHouse = { 1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[] };

  raw.forEach(p => {
    if (!p.name) return;
    const nameLower = p.name.trim().toLowerCase();
    if (!validNames.includes(nameLower)) return;
    const name = p.name.trim().charAt(0).toUpperCase() + p.name.trim().slice(1).toLowerCase();
    const sign = p.sign ? sanitizeSign(p.sign) : null;
    let house = sign ? getHouseFromSign(sign, lagna) : parseInt(p.house);
    if (!house || house < 1 || house > 12) house = 1;
    const degRaw = p.normDegree ?? p.fullDegree;
    const deg = isNaN(parseFloat(degRaw)) ? "" : fmtDeg(degRaw);
    const retrograde = p.retrograde === true || p.isRetro === true || p.isRetro === "true";
    byHouse[house].push({ name, sign, house, deg, retrograde });
  });
  return { lagna, byHouse, hasData: raw.length > 0 };
};

const KundliChart = ({ planets = [], ascendant = "Aries", name = "", onHouseClick }) => {
  const { t } = useTranslation('kundli');
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState(420);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [hoveredHouse, setHoveredHouse] = useState(null);

  const { lagna, byHouse, hasData } = React.useMemo(
    () => processPlanets(planets, ascendant),
    [planets, ascendant]
  );

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width || 420;
      setSize(Math.min(w - 10, 500));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const sc = (v) => (v / 100) * W;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fffbf5";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.font = `bold ${W * 0.22}px serif`;
    ctx.fillStyle = "rgba(234,88,12,0.06)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ॐ", W / 2, H / 2);
    ctx.restore();

    HOUSE_DEFS.forEach(house => {
      const pts = house.pts.map(([x, y]) => [sc(x), sc(y)]);
      const isHovered  = hoveredHouse  === house.num;
      const isSelected = selectedHouse === house.num;

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();

      if (isSelected) {
        ctx.fillStyle = "rgba(251,146,60,0.18)";
      } else if (isHovered) {
        ctx.fillStyle = "rgba(251,146,60,0.09)";
      } else {
        ctx.fillStyle = house.num === 1 ? "rgba(254,243,199,0.5)" : "rgba(255,251,245,0.4)";
      }
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#ea580c" : isHovered ? "#fb923c" : "#d4a96a";
      ctx.lineWidth = isSelected ? 2 : 1.2;
      ctx.stroke();

      const [nx, ny] = house.numPos;
      ctx.save();
      ctx.font = `600 ${W * 0.026}px Inter, Arial`;
      ctx.fillStyle = house.num === 1 ? "#92400e" : "#a16207";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(house.num, sc(nx), sc(ny));
      ctx.restore();

      const houseSign = signForHouse(lagna, house.num);
      const sym = ZODIAC_SYMBOLS[houseSign] || "";
      const [cx, cy] = house.center;

      ctx.save();
      ctx.font = `${W * 0.032}px serif`;
      ctx.fillStyle = "rgba(120,80,20,0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sym, sc(cx), sc(cy) - W * 0.038);
      ctx.restore();

      const ps = byHouse[house.num] || [];
      if (ps.length === 0) return;

      const lineH = W * 0.038;
      const perRow = 3;
      const totalRows = Math.ceil(ps.length / perRow);
      const startY = sc(cy) + (ps.length === 1 ? 0 : -(totalRows - 1) * lineH * 0.5);

      ps.forEach((p, i) => {
        const meta = PLANET_META[p.name] || { short: p.name.slice(0, 2), color: "#6b7280" };
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const rowCount = Math.min(ps.length - row * perRow, perRow);
        const xSpread = W * 0.044;
        const xOff = (col - (rowCount - 1) / 2) * xSpread;
        const yOff = row * lineH;
        const px2 = sc(cx) + xOff;
        const py2 = startY + yOff;

        ctx.beginPath();
        ctx.arc(px2, py2, W * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = meta.color;
        ctx.fill();

        ctx.save();
        ctx.font = `bold ${W * 0.024}px Inter, Arial`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(meta.short, px2, py2 + 0.5);
        ctx.restore();

        if (p.retrograde) {
          ctx.save();
          ctx.font = `bold ${W * 0.016}px Inter, Arial`;
          ctx.fillStyle = "#dc2626";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("R", px2 + W * 0.02, py2 - W * 0.016);
          ctx.restore();
        }
      });
    });

    ctx.strokeStyle = "#d4a96a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
  }, [lagna, byHouse, selectedHouse, hoveredHouse, size]);

  useEffect(() => { draw(); }, [draw]);

  const getHouseAtPoint = (canvas, clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = ((clientX - rect.left) * scaleX) / canvas.width * 100;
    const py = ((clientY - rect.top) * scaleY) / canvas.height * 100;

    for (const h of HOUSE_DEFS) {
      if (pointInPolygon(px, py, h.pts)) return h.num;
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const h = getHouseAtPoint(canvasRef.current, e.clientX, e.clientY);
    setHoveredHouse(h);
    if (canvasRef.current) canvasRef.current.style.cursor = h ? "pointer" : "default";
  };

  const handleClick = (e) => {
    const h = getHouseAtPoint(canvasRef.current, e.clientX, e.clientY);
    if (!h) return;
    const next = selectedHouse === h ? null : h;
    setSelectedHouse(next);
    if (onHouseClick && next) {
      onHouseClick(next, {
        house: next,
        sign: signForHouse(lagna, next),
        planets: byHouse[next] || [],
      });
    }
  };

  const handleMouseLeave = () => setHoveredHouse(null);
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const h = getHouseAtPoint(canvasRef.current, touch.clientX, touch.clientY);
    if (!h) return;
    setSelectedHouse(prev => prev === h ? null : h);
  };

  if (!hasData) {
    return (
      <div className="w-full bg-white rounded-2xl border border-orange-200/50 p-8 text-center">
        <p className="text-gray-500">{t('planetTable.noData')}</p>
      </div>
    );
  }

  const selSign = selectedHouse ? signForHouse(lagna, selectedHouse) : null;
  const selSignIndex = ZODIAC.indexOf(selSign);
  const translatedSelSign = selSignIndex !== -1 ? t(`zodiac.${selSignIndex}`) : selSign;
  const selPlanets = selectedHouse ? (byHouse[selectedHouse] || []) : [];
  
  const lagnaIndex = ZODIAC.indexOf(lagna);
  const translatedLagna = lagnaIndex !== -1 ? t(`zodiac.${lagnaIndex}`) : lagna;

  return (
    <div className="w-full">
      {name && (
        <p className="text-center text-sm font-semibold text-amber-800 mb-2 tracking-wide">
          {name} — {t('title')}
        </p>
      )}

      <div ref={containerRef} className="w-full flex flex-col items-center gap-4">
        <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-orange-900/10" style={{ width: size, height: size }}>
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ width: size, height: size, display: "block" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-800">
          <span>{ZODIAC_SYMBOLS[lagna]}</span>
          <span>{t('lagnaShort')}: {translatedLagna}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 py-3 bg-white/80 border border-amber-100 rounded-2xl w-full max-w-[500px]">
          {Object.entries(PLANET_META).map(([k, v]) => (
            <div key={k} className="inline-flex items-center gap-1.5 text-xs">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: v.color }}>
                {v.short}
              </div>
              <span className="text-stone-600 font-medium">{t(`planets.${k}`, { defaultValue: k })}</span>
            </div>
          ))}
        </div>

        {selectedHouse && (
          <div className="w-full max-w-[500px] rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  {t('bhava')} {selectedHouse}
                </span>
                <p className="font-bold text-stone-800 mt-1 text-lg">
                  {ZODIAC_SYMBOLS[selSign]} {translatedSelSign}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{t(`houses.${selectedHouse}`)}</p>
              </div>
              <button
                onClick={() => setSelectedHouse(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors flex items-center justify-center text-sm"
              >✕</button>
            </div>

            {selPlanets.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-3 border border-dashed border-stone-200 rounded-xl">
                {t('noGrahas')}
              </p>
            ) : (
              <ul className="space-y-2">
                {selPlanets.map((p, i) => {
                  const meta = PLANET_META[p.name] || { short:"?", color:"#6b7280", name: p.name };
                  return (
                    <li key={i} className="flex items-center justify-between gap-3 bg-stone-50 rounded-xl px-3 py-2 border border-stone-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: meta.color }}>
                          {meta.short}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{t(`planets.${p.name}`, { defaultValue: p.name })}</p>
                          {p.retrograde && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 rounded">{t('retrogradeLabel')}</span>
                          )}
                        </div>
                      </div>
                      {p.deg && <span className="text-xs font-mono text-stone-500">{p.deg}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliChart;