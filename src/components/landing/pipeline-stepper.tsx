"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Truck, Grid3X3, BrainCircuit, Cog, Factory, ShieldCheck, Store, RefreshCcw } from "lucide-react";
import { PIPELINE_STEPS, type PipelineStep } from "./data";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { cn } from "@/lib/utils";

const STEP_ICONS: Record<PipelineStep["icon"], React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  grid: Grid3X3,
  brain: BrainCircuit,
  cogs: Cog,
  factory: Factory,
  shield: ShieldCheck,
  store: Store,
  refresh: RefreshCcw,
};

export function PipelineStepper() {
  const ref = useRef<HTMLDivElement>(null);
  // Fill the connector as the section scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.72", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <section id="pipeline" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-green-600/[0.09] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              One pipeline. <span className="text-emerald-400">Eight</span> steps to circular.
            </>
          }
          subtitle="From your curb to a manufacturer's loading dock — every stage is automated, measured, and verifiable."
        />

        <div ref={ref} className="relative mt-16">
          {/* Desktop connector line */}
          <div className="absolute left-0 right-0 top-[34px] hidden h-[3px] rounded-full bg-white/[0.07] lg:block" aria-hidden>
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 shadow-[0_0_16px_rgba(52,211,153,0.7)]"
              style={{ scaleX: progress }}
            />
          </div>

          {/* Mobile connector line */}
          <div className="absolute bottom-8 left-[34px] top-8 w-[3px] rounded-full bg-white/[0.07] lg:hidden" aria-hidden>
            <motion.div
              className="h-full origin-top w-full rounded-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-teal-300"
              style={{ scaleY: progress }}
            />
          </div>

          <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14" stagger={0.08}>
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[step.icon];
              return (
                <StaggerItem key={step.title} className="relative flex gap-4 lg:flex-col lg:gap-0">
                  {/* Node */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center lg:h-[68px] lg:w-[68px]">
                    <span className="absolute inset-0 rounded-2xl bg-emerald-400/[0.08]" />
                    <span className="absolute inset-0 rounded-2xl border border-emerald-400/25 transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_24px_rgba(52,211,153,0.35)]" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 font-display text-[10px] font-bold text-[#04120c] shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                      {i + 1}
                    </span>
                    <Icon className="h-7 w-7 text-emerald-300" />
                  </div>

                  <div className="lg:mt-5 lg:pr-4">
                    <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                    <span
                      className={cn(
                        "mt-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                      )}
                    >
                      {step.stat}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
