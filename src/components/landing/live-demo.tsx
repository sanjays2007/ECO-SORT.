"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Milk, CupSoda, Apple, Box, Wine, Cpu, SkipForward, Pause, Play, type LucideIcon } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DEMO_ITEMS,
  type CategoryKey,
} from "./data";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type Phase = "scanning" | "classified" | "delivered" | "idle";

const ITEM_ICONS: Record<CategoryKey, LucideIcon> = {
  plastic: Milk,
  metal: CupSoda,
  organic: Apple,
  paper: Box,
  glass: Wine,
  other: Cpu,
};

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function ConfidenceRing({ progress, color }: { progress: number; color: string }) {
  const display = Math.round(progress * 1000) / 10;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="148" height="148" viewBox="0 0 148 148" className="-rotate-90">
        <circle cx="74" cy="74" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <motion.circle
          cx="74"
          cy="74"
          r={RING_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress) }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-white">{display}%</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">confidence</span>
      </div>
    </div>
  );
}

function CameraFeed({ item, phase }: { item: (typeof DEMO_ITEMS)[number]; phase: Phase }) {
  const color = CATEGORY_COLORS[item.category];
  const Icon = ITEM_ICONS[item.category];
  const reduce = useReducedMotion();
  const boxed = phase !== "scanning";

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#04080a]">
      {/* Camera grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.10),transparent_65%)]" />

      {/* HUD */}
      <div className="absolute left-3 top-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
        <span className="relative flex h-2 w-2">
          <span className={cn("absolute inline-flex h-full w-full rounded-full bg-red-500", !reduce && "animate-ping", phase === "idle" && "opacity-30")} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        Cam-04 · Live
      </div>
      <div className="absolute right-3 top-3 font-mono text-[10px] text-slate-500">
        EcoNet-v4 · 8ms · {item.detail}
      </div>
      <div className="absolute bottom-3 left-3 font-mono text-[10px] text-slate-600">
        FOV 120° · 60 fps · IR-pass
      </div>

      {/* Item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.7, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.15, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-10 rounded-full" style={{ background: `radial-gradient(circle, ${color}33, transparent 70%)` }} />
            <motion.div
              animate={!reduce && phase === "scanning" ? { y: [0, -7, 0], rotate: [0, 2, 0] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-16 w-16 sm:h-20 sm:w-20" style={{ color, filter: `drop-shadow(0 0 18px ${color}88)` }} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bounding box */}
      <motion.div
        className="absolute left-1/2 top-[46%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-48 sm:w-48"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: boxed ? 1 : 0.85, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          "left-0 top-0 border-l-2 border-t-2 rounded-tl-lg",
          "right-0 top-0 border-r-2 border-t-2 rounded-tr-lg",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
        ].map((pos) => (
          <span key={pos} className={cn("absolute h-6 w-6", pos)} style={{ borderColor: color }} />
        ))}

        {/* Label tag */}
        <AnimatePresence>
          {boxed && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -top-9 left-0 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: color, color: "#04120c" }}
            >
              {item.name} → {CATEGORY_LABELS[item.category]} · {item.confidence}%
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crosshair ticks */}
        <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute left-1/2 bottom-0 h-2 w-px -translate-x-1/2" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2" style={{ background: color, opacity: 0.6 }} />
        <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2" style={{ background: color, opacity: 0.6 }} />
      </motion.div>

      {/* Scan line */}
      {!reduce && phase === "scanning" && (
        <motion.div
          className="absolute left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, #34d399, transparent)", boxShadow: "0 0 18px rgba(52,211,153,0.8)" }}
          animate={{ top: ["8%", "88%", "8%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Overlay states */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 right-3 rounded-md border border-emerald-400/30 bg-[#04120c]/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-300 backdrop-blur"
          >
            {reduce ? "DETECTING…" : <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />DETECTING…</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Conveyor({ item, phase }: { item: (typeof DEMO_ITEMS)[number]; phase: Phase }) {
  const color = CATEGORY_COLORS[item.category];
  const binIndex = CATEGORY_ORDER.indexOf(item.category);
  const binX = 62 + binIndex * 112; // centers: 62, 174, 286, 398, 510, 622
  const travelling = phase === "classified";
  const delivered = phase === "delivered";

  return (
    <svg viewBox="0 0 700 170" className="w-full" role="img" aria-label={`Item routing to ${CATEGORY_LABELS[item.category]} bin`}>
      {/* Belt */}
      <rect x="14" y="44" width="672" height="16" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.09)" />
      <line x1="20" y1="52" x2="680" y2="52" stroke="rgba(52,211,153,0.25)" strokeWidth="1" strokeDasharray="8 14" className="animate-dash" />

      {/* Belt ticks */}
      {Array.from({ length: 33 }).map((_, i) => (
        <line key={i} x1={30 + i * 20} y1="44" x2={30 + i * 20} y2="60" stroke="rgba(148,163,184,0.18)" strokeWidth="1.5" />
      ))}

      {/* Bins */}
      {CATEGORY_ORDER.map((cat, i) => {
        const active = i === binIndex && (travelling || delivered);
        return (
          <g key={cat} opacity={active ? 1 : 0.55}>
            <rect x={binX - 34} y={86} width="68" height="52" rx="10" fill="#0a1310" stroke={active ? CATEGORY_COLORS[cat] : "rgba(255,255,255,0.12)"} strokeWidth={active ? 1.8 : 1} />
            <rect x={binX - 34} y={86} width="68" height="6" rx="3" fill={CATEGORY_COLORS[cat]} opacity={active ? 1 : 0.7} />
            <text x={binX} y={156} textAnchor="middle" fontSize="12" fontWeight="600" fill={active ? CATEGORY_COLORS[cat] : "#94a3b8"}>
              {CATEGORY_LABELS[cat].toUpperCase()}
            </text>
            {delivered && active && (
              <circle cx={binX} cy={120} r="26" fill="none" stroke={CATEGORY_COLORS[cat]} strokeWidth="1.5" className="animate-pulse-ring" />
            )}
          </g>
        );
      })}

      {/* Travelling item */}
      <motion.g
        key={item.id}
        initial={{ x: 44, y: 32, opacity: 0 }}
        animate={
          delivered
            ? { x: binX, y: 96, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }
            : travelling
              ? { x: binX, y: 30, opacity: 1, transition: { duration: 1.9, ease: [0.32, 0, 0.25, 1] } }
              : { x: 44, y: 30, opacity: 0.25 }
        }
        transition={{ duration: 1.2 }}
      >
        <rect x="-13" y="-10" width="26" height="20" rx="7" fill={color} opacity="0.9" style={{ filter: `drop-shadow(0 0 10px ${color}99)` }} />
        <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="700" fill="#04120c">
          {item.name.split(" ")[0].slice(0, 4).toUpperCase()}
        </text>
      </motion.g>
    </svg>
  );
}

export function LiveDemo() {
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("scanning");
  const [auto, setAuto] = useState(true);
  // Note: initial line is static so server and client HTML match (no Date/time at render time)
  const [logs, setLogs] = useState<string[]>(["EcoNet-v4 online · awaiting items"]);
  const timers = useRef<number[]>([]);
  const reduce = useReducedMotion();

  const item = DEMO_ITEMS[itemIndex];
  const color = CATEGORY_COLORS[item.category];
  const ringProgress = phase === "scanning" ? 0.42 : item.confidence / 100;

  const advance = useCallback(() => {
    setItemIndex((i) => (i + 1) % DEMO_ITEMS.length);
  }, []);

  // Reset phase whenever the item changes
  useEffect(() => {
    setPhase("scanning");
  }, [itemIndex]);

  // Phase state machine
  useEffect(() => {
    if (reduce) {
      setPhase("classified");
      return;
    }
    let cancelled = false;
    const push = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => !cancelled && fn(), ms);
      timers.current.push(id);
    };

    if (phase === "scanning") {
      push(() => {
        setPhase("classified");
        setLogs((prev) =>
          [
            ...prev,
            `[${timestamp()}] Classified ${item.name} → ${CATEGORY_LABELS[item.category]} · ${item.confidence}%`,
          ].slice(-6)
        );
      }, 2300);
    } else if (phase === "classified") {
      push(() => setPhase("delivered"), 2100);
    } else if (phase === "delivered") {
      push(() => {
        if (auto) advance();
        else setPhase("idle");
      }, 1700);
    }

    return () => {
      cancelled = true;
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [phase, auto, item, advance, reduce]);

  const ring = useMemo(() => <ConfidenceRing progress={ringProgress} color={phase === "scanning" ? "#34d399" : color} />, [ringProgress, color, phase]);

  return (
    <section id="demo" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Live AI Sorting Demo"
          title={
            <>
              Watch waste get <span className="text-emerald-400">read</span> in real time
            </>
          }
          subtitle="A mock feed of our vision pipeline. Items are detected, classified, and routed to the right stream — exactly like on the plant floor."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Camera feed */}
          <Reveal className="lg:col-span-3" delay={0.05}>
            <div className="glass rounded-2xl p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-display text-sm font-semibold text-slate-200">Camera Feed · Unit 04</span>
                <span className="font-mono text-[11px] text-slate-500">{item.name} · {item.detail}</span>
              </div>
              <CameraFeed item={item} phase={phase} />
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORY_ORDER.map((cat) => {
                  const activeCat = item.category === cat && phase !== "scanning";
                  return (
                    <span
                      key={cat}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                        activeCat
                          ? "border-transparent text-[#04120c] shadow-[0_0_18px]"
                          : "border-white/10 text-slate-400"
                      )}
                      style={
                        activeCat
                          ? { background: CATEGORY_COLORS[cat], boxShadow: `0 0 18px ${CATEGORY_COLORS[cat]}88` }
                          : undefined
                      }
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Conveyor + confidence + logs */}
          <Reveal className="lg:col-span-2" delay={0.15}>
            <div className="flex h-full flex-col gap-4">
              <div className="glass rounded-2xl p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-slate-200">Automated Routing</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phase}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
                    >
                      {phase}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <Conveyor item={item} phase={phase} />

                <div className="mt-1 flex items-center justify-center border-t border-white/[0.06] pt-4">
                  {ring}
                </div>
              </div>

              <div className="glass rounded-2xl p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-slate-200">Event Log</span>
                  <button
                    onClick={() => setAuto((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                      auto ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {auto ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                    {auto ? "Auto-cycling" : "Paused"}
                  </button>
                </div>
                <div className="h-[104px] space-y-1.5 overflow-hidden font-mono text-[11px] leading-relaxed">
                  <AnimatePresence initial={false}>
                    {logs.map((l, i) => (
                      <motion.p
                        key={`${l}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn("truncate", i === logs.length - 1 ? "text-emerald-300" : "text-slate-500")}
                      >
                        {l}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
                <button
                  onClick={advance}
                  disabled={phase === "classified"}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-emerald-400/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SkipForward className="h-4 w-4" />
                  Scan next item
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
