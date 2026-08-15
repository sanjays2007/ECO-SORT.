"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Scale, Recycle, CloudFog, Users } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { IMPACT_STATS, MATERIAL_COMPOSITION } from "./data";
import { useCountUp } from "./use-count-up";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const STAT_ICONS = [Scale, Recycle, CloudFog, Users];

function StatCard({
  label,
  value,
  suffix,
  decimals = 0,
  note,
  icon: Icon,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  const { ref, display } = useCountUp(value, 1.6, decimals);

  return (
    <Reveal delay={index * 0.08}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_16px_50px_-20px_rgba(16,185,129,0.4)]">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/[0.08] blur-2xl transition-opacity group-hover:opacity-150" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-[2.1rem]">
              <span ref={ref}>{display}</span>
              {suffix && <span className="ml-1 text-lg font-semibold text-emerald-400">{suffix}</span>}
            </p>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300">
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/** Six nodes around a ring with a pulse that travels clockwise. */
function CircularEconomyLoop() {
  const reduce = useReducedMotion();
  const nodes = [
    "Raw Material",
    "Manufacturer",
    "New Product",
    "Consumer",
    "Waste",
    "EcoSort",
  ];

  const angle = (i: number) => (i / 6) * Math.PI * 2 - Math.PI / 2;
  const R = 150;
  const pos = (i: number) => {
    const a = angle(i);
    return { x: 200 + R * Math.cos(a), y: 200 + R * Math.sin(a) };
  };

  // Arc path between consecutive nodes (clockwise)
  const arc = (from: number, to: number) => {
    const p1 = pos(from);
    const p2 = pos(to);
    const mid = angle(from) + Math.PI / 6;
    const mx = 200 + (R - 34) * Math.cos(mid);
    const my = 200 + (R - 34) * Math.sin(mid);
    return `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`;
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {/* Orbit guides */}
        <circle cx="200" cy="200" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 7" className="animate-spin-slow" style={{ transformOrigin: "200px 200px" }} />
        <circle cx="200" cy="200" r={R - 34} fill="none" stroke="rgba(52,211,153,0.12)" strokeWidth="1" />

        {/* Arrows between nodes */}
        {nodes.map((_, i) => {
          const from = i;
          const to = (i + 1) % 6;
          const p2 = pos(to);
          const a = Math.atan2(p2.y - 200, p2.x - 200);
          return (
            <g key={`arc-${i}`}>
              <path d={arc(from, to)} stroke="rgba(52,211,153,0.35)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path
                d={`M ${p2.x - 11 * Math.cos(a)} ${p2.y - 11 * Math.sin(a)} L ${p2.x - 3 * Math.cos(a) + 5 * Math.cos(a + Math.PI / 2)} ${p2.y - 3 * Math.sin(a) + 5 * Math.sin(a + Math.PI / 2)} L ${p2.x - 3 * Math.cos(a) - 5 * Math.cos(a + Math.PI / 2)} ${p2.y - 3 * Math.sin(a) - 5 * Math.sin(a + Math.PI / 2)} Z`}
                fill="rgba(52,211,153,0.7)"
              />
            </g>
          );
        })}

        {/* Nodes with traveling pulse */}
        {nodes.map((n, i) => {
          const { x, y } = pos(i);
          const isEcosort = n === "EcoSort";
          return (
            <motion.g
              key={n}
              initial={false}
              animate={
                reduce
                  ? { opacity: isEcosort ? 1 : 0.75 }
                  : { opacity: [0.35, 1, 0.35] }
              }
              transition={
                reduce
                  ? {}
                  : { duration: 2.4, times: [0, 0.5, 1], repeat: Infinity, delay: i * 0.4 }
              }
            >
              <circle cx={x} cy={y} r="17" fill={isEcosort ? "#052e21" : "#0a1511"} stroke={isEcosort ? "#34d399" : "rgba(52,211,153,0.45)"} strokeWidth={isEcosort ? 2 : 1.4} />
              {isEcosort && <circle cx={x} cy={y} r="17" fill="none" stroke="#34d399" strokeWidth="1.5" className="animate-pulse-ring" />}
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={isEcosort ? "#34d399" : "#cbd5e1"}>
                {n === "EcoSort" ? "ECO" : n.split(" ")[0].toUpperCase()}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Center chip */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Recycle className="h-8 w-8 text-emerald-400" />
          <p className="mt-2 font-display text-sm font-bold text-white">Closed Loop</p>
          <p className="max-w-[150px] text-[11px] leading-snug text-slate-500">waste out · feedstock in · nothing lost</p>
        </div>
      </div>
    </div>
  );
}

export function Impact() {
  const total = MATERIAL_COMPOSITION.reduce((s, m) => s + m.value, 0);
  const donutRef = useRef<HTMLDivElement>(null);

  return (
    <section id="impact" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Impact Dashboard"
          title={
            <>
              Measured in <span className="text-emerald-400">tonnes</span>, not promises
            </>
          }
          subtitle="Live operational figures from our pilot network — the numbers a city council actually cares about."
        />

        {/* Counters */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_STATS.map((s, i) => (
            <StatCard key={s.label} {...s} icon={STAT_ICONS[i]} index={i} />
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Composition donut */}
          <Reveal className="lg:col-span-2" delay={0.05}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <h3 className="font-display text-base font-bold text-white">Material Composition</h3>
              <p className="mt-1 text-xs text-slate-500">Recovered streams · last 90 days</p>
              <div ref={donutRef} className="relative mx-auto mt-2 h-56 w-full max-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MATERIAL_COMPOSITION}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={3}
                      stroke="none"
                      cornerRadius={6}
                    >
                      {MATERIAL_COMPOSITION.map((m) => (
                        <Cell key={m.name} fill={m.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0a1310",
                        border: "1px solid rgba(52,211,153,0.25)",
                        borderRadius: 12,
                        color: "#e2e8f0",
                        fontSize: 12,
                      }}
                      formatter={(v: number | string) => [`${v}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-white">34.2k</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">kg recovered</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
                {MATERIAL_COMPOSITION.map((m) => (
                  <div key={m.name} className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2 py-1.5">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} />
                    <span className="truncate text-[11px] text-slate-300">
                      {m.name} <span className="text-slate-500">{Math.round((m.value / total) * 100)}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Circular economy loop */}
          <Reveal className="lg:col-span-3" delay={0.15}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white">The Circular Loop</h3>
                  <p className="mt-1 text-xs text-slate-500">How recovered material re-enters the economy</p>
                </div>
                <span className="hidden rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-1 text-[11px] font-semibold text-emerald-300 sm:inline-flex">
                  ∞ closed loop
                </span>
              </div>
              <CircularEconomyLoop />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
