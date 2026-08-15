"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Truck, BrainCircuit, Cog, Factory, ShieldCheck, Store, Package, Check, QrCode } from "lucide-react";
import { TRACE_STEPS, type TraceStep } from "./data";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const TRACE_ICONS: Record<TraceStep["icon"], React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  brain: BrainCircuit,
  cogs: Cog,
  factory: Factory,
  shield: ShieldCheck,
  store: Store,
  package: Package,
};

/** Deterministic pseudo-random grid so the mock QR renders identically every time. */
function useMockQr(seed: number) {
  return useMemo(() => {
    let s = seed >>> 0;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    const size = 21;
    const cells: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    const finder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const border = x === 0 || y === 0 || x === 6 || y === 6;
          const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          cells[oy + y][ox + x] = border || core;
        }
    };
    finder(0, 0);
    finder(size - 7, 0);
    finder(0, size - 7);

    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (!cells[y][x] && rand() < 0.44) cells[y][x] = true;
      }
    return { size, cells };
  }, [seed]);
}

function QrMock() {
  const { size, cells } = useMockQr(0xec0);

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-white/10 bg-white p-4 shadow-[0_0_40px_rgba(52,211,153,0.15)]">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40" role="img" aria-label="Mock QR code for batch ECO-PET-2026-001">
          {cells.map((row, y) =>
            row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0b1a14" /> : null))
          )}
        </svg>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <QrCode className="h-3.5 w-3.5 text-emerald-400" />
        Scan to view full material history
      </p>
    </div>
  );
}

export function Traceability() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <section id="traceability" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-500/[0.07] blur-[120px] [animation-delay:-4s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Material Traceability"
          title={
            <>
              Every gram has a <span className="text-emerald-400">story</span>
            </>
          }
          subtitle="Follow batch ECO-PET-2026-001 from a curbside bin in Bengaluru to a polymer buyer's loading dock."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Timeline */}
          <div ref={ref} className="relative lg:col-span-2">
            {/* Vertical fill line */}
            <div className="absolute bottom-0 left-[26px] top-2 w-[3px] rounded-full bg-white/[0.07]" aria-hidden>
              <motion.div
                className="h-full w-full origin-top rounded-full bg-gradient-to-b from-emerald-400 via-emerald-400 to-teal-300 shadow-[0_0_14px_rgba(52,211,153,0.6)]"
                style={{ scaleY: progress }}
              />
            </div>

            <div className="space-y-10">
              {TRACE_STEPS.map((step, i) => {
                const Icon = TRACE_ICONS[step.icon];
                const last = i === TRACE_STEPS.length - 1;
                return (
                  <Reveal key={step.title} delay={0.08 * i} y={20}>
                    <div className="relative flex gap-5 pl-1">
                      {/* Node */}
                      <div className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center">
                        <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 bg-[#081310] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[#04120c] shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <Icon className="h-6 w-6 text-emerald-300" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/[0.04] sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-base font-bold text-white">
                            {String(i + 1).padStart(2, "0")} · {step.title}
                          </h3>
                          <span className="font-mono text-[11px] text-slate-500">{step.meta}</span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{step.detail}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* QR + batch card */}
          <Reveal delay={0.2} className="lg:col-span-1">
            <div className="glass sticky top-24 flex flex-col items-center rounded-2xl p-6 sm:p-8">
              <QrMock />
              <div className="mt-6 w-full border-t border-white/[0.06] pt-5 text-center">
                <p className="font-mono text-xs text-slate-500">BATCH ID</p>
                <p className="mt-1 font-display text-lg font-bold text-emerald-300">ECO-PET-2026-001</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Origin</p>
                    <p className="mt-0.5 font-semibold text-slate-200">BLR-07</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Weight</p>
                    <p className="mt-0.5 font-semibold text-slate-200">24.5 t</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Grade</p>
                    <p className="mt-0.5 font-semibold text-slate-200">Food-A</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Custody</p>
                    <p className="mt-0.5 font-semibold text-emerald-300">Verified</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  Immutable custody chain: 7 checkpoints, 3 cameras, 1 lab test. Viewable by any buyer before purchase.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
