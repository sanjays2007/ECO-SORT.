"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CATEGORY_COLORS } from "./data";

const STREAMS = [
  { key: "glass", label: "Glass", color: CATEGORY_COLORS.glass, path: "M 585 195 C 640 172 660 90 700 60 C 740 30 792 32 836 38" },
  { key: "paper", label: "Paper", color: CATEGORY_COLORS.paper, path: "M 585 195 C 650 172 690 116 730 98 C 770 80 800 86 836 88" },
  { key: "metal", label: "Metal", color: CATEGORY_COLORS.metal, path: "M 585 195 C 660 190 700 158 740 146 C 780 134 812 140 836 140" },
  { key: "organic", label: "Organic", color: CATEGORY_COLORS.organic, path: "M 585 195 C 650 214 690 242 730 254 C 770 266 800 258 836 254" },
  { key: "plastic", label: "Plastic", color: CATEGORY_COLORS.plastic, path: "M 585 195 C 640 220 660 300 700 320 C 740 340 792 342 836 334" },
];

const APPROACH = "M 26 195 C 140 195 220 202 300 192 C 360 185 420 195 468 195 L 585 195";

const JOURNEYS = STREAMS.map((s, i) => {
  // Offset the start of each journey along the approach so particles stream continuously
  const inset = 30 + i * 46;
  return {
    ...s,
    journey: `M ${inset} 195 L 585 195 ${s.path.replace("M 585 195", "")}`,
    begin: `${i * 0.9}s`,
  };
});

export function PipelineDiagram({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 8;

  return (
    <svg
      viewBox="0 0 900 372"
      fill="none"
      className={className}
      role="img"
      aria-label="Mixed waste flows through size separation, AI classification, then splits into glass, paper, metal, organic and plastic streams"
    >
      <defs>
        <filter id="pd-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pd-glow-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pd-conveyor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* ---- Conveyor baseline ---- */}
      <path d={APPROACH} stroke="url(#pd-conveyor)" strokeWidth="2.5" strokeLinecap="round" />

      {/* ---- Journey particles (SMIL) ---- */}
      {!reduce &&
        JOURNEYS.map((s) => (
          <g key={`p-${s.key}`} fill={s.color} opacity="0.85">
            <circle r="3.2" filter="url(#pd-glow-soft)">
              <animateMotion dur={`${dur}s`} begin={s.begin} repeatCount="indefinite" rotate="auto">
                <mpath href={`#pd-journey-${s.key}`} />
              </animateMotion>
            </circle>
          </g>
        ))}

      {!reduce && (
        <g fill="#cbd5e1" opacity="0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={`dust-${i}`} r="1.6">
              <animateMotion
                dur="6s"
                begin={`${i * 1.5}s`}
                repeatCount="indefinite"
                path={APPROACH}
                keyPoints="0;0.62;0.62"
                keyTimes="0;0.75;1"
              />
            </circle>
          ))}
        </g>
      )}

      {/* ---- Journey path definitions (used by mpath) ---- */}
      <defs>
        {JOURNEYS.map((s) => (
          <path key={`def-${s.key}`} id={`pd-journey-${s.key}`} d={s.journey} />
        ))}
      </defs>

      {/* ---- Exit streams: base paths + animated dash overlay ---- */}
      {STREAMS.map((s) => (
        <g key={`s-${s.key}`}>
          <path d={s.path} stroke={s.color} strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
          <path
            d={s.path}
            stroke={s.color}
            strokeOpacity="0.75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 18"
            className="animate-dash"
            filter="url(#pd-glow-soft)"
          />
        </g>
      ))}

      {/* ---- Mixed waste pile (left) ---- */}
      <g>
        {[
          [30, 168, 8],
          [46, 160, 6],
          [56, 176, 9],
          [36, 186, 6],
          [18, 182, 5],
          [64, 170, 5],
        ].map(([cx, cy, r], i) => (
          <circle key={`mw-${i}`} cx={cx} cy={cy} r={r} fill="#64748b" fillOpacity="0.5">
            <animate attributeName="fill-opacity" values="0.35;0.65;0.35" dur="3.4s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <text x="40" y="146" fill="#94a3b8" fontSize="12" fontWeight="600" letterSpacing="0.08em">
          MIXED
        </text>
        <text x="40" y="160" fill="#94a3b8" fontSize="12" fontWeight="600" letterSpacing="0.08em">
          WASTE
        </text>
      </g>

      {/* ---- Size separation grid ---- */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`grid-${i}`} x={296 + i * 14} y={164} width="5" height="62" rx="2.5" fill="#34d399" fillOpacity="0.22">
            <animate attributeName="fill-opacity" values="0.16;0.4;0.16" dur="2.2s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <rect x="282" y="150" width="96" height="90" rx="10" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="3 5" fill="none" />
        <text x="330" y="272" fill="#6ee7b7" fontSize="11" fontWeight="500" textAnchor="middle" letterSpacing="0.14em" opacity="0.9">
          SIZE SEPARATION
        </text>
      </g>

      {/* ---- Camera scan ---- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <rect x="398" y="158" width="62" height="74" rx="12" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="1.5" />
        <circle cx="429" cy="195" r="16" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.06" />
        <circle cx="429" cy="195" r="5" fill="#38bdf8" opacity="0.9" />
        {!reduce && (
          <motion.rect
            x="402"
            y="162"
            width="54"
            height="2.5"
            rx="1.25"
            fill="#7dd3fc"
            opacity="0.8"
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <text x="429" y="262" fill="#7dd3fc" fontSize="11" fontWeight="500" textAnchor="middle" letterSpacing="0.14em">
          CAMERA SCAN
        </text>
      </motion.g>

      {/* ---- AI node ---- */}
      <g>
        {!reduce && (
          <circle cx="522" cy="195" r="22" stroke="#34d399" strokeOpacity="0.5" strokeWidth="1.5" className="animate-pulse-ring" />
        )}
        <circle cx="522" cy="195" r="17" fill="#052e21" stroke="#34d399" strokeWidth="1.5" filter="url(#pd-glow)" />
        <text x="522" y="199" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.1em" filter="url(#pd-glow)">
          AI
        </text>
        <text x="522" y="246" fill="#6ee7b7" fontSize="11" fontWeight="500" textAnchor="middle" letterSpacing="0.14em">
          VISION
        </text>
        <text x="522" y="259" fill="#64748b" fontSize="9.5" textAnchor="middle">
          8ms · 96.8% acc
        </text>
      </g>

      {/* ---- Split node ---- */}
      <g>
        <circle cx="585" cy="195" r="7" fill="#34d399" filter="url(#pd-glow)" />
        <circle cx="585" cy="195" r="12" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1.2" className="animate-pulse-ring" />
      </g>

      {/* ---- Stream labels ---- */}
      {STREAMS.map((s, i) => (
        <g key={`l-${s.key}`}>
          <circle cx="826" cy={[38, 88, 140, 254, 334][i]} r="4.5" fill={s.color} filter="url(#pd-glow-soft)" />
          <text
            x="836"
            y={[41, 91, 143, 257, 337][i]}
            fill="#e2e8f0"
            fontSize="13"
            fontWeight="600"
            letterSpacing="0.06em"
          >
            {s.label.toUpperCase()}
          </text>
          <text x="836" y={[53, 103, 155, 269, 349][i]} fill={s.color} fontSize="10" letterSpacing="0.1em" opacity="0.85">
            {["cullet", "fiber", "scrap", "compost", "rPET"][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
