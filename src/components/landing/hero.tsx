"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ParticleField } from "./particles";
import { PipelineDiagram } from "./pipeline-diagram";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.14] blur-[120px]" />
        <div className="animate-aurora absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-sky-500/[0.08] blur-[100px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-green-600/[0.1] blur-[110px] [animation-delay:-10s]" />
      </div>

      <ParticleField className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Waste Sorting · B2B Material Marketplace
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease }}
          className="mt-7 max-w-4xl text-center font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]"
        >
          We don&apos;t just sort waste.
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            We turn it into a resource.
          </span>
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease }}
          className="mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Identify → Segregate → Process → Verify → Sell → Reuse. A closed-loop system where
          every discarded item becomes traceable, saleable feedstock — in under 8 milliseconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#demo"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 text-sm font-semibold text-[#04120c] shadow-[0_0_32px_rgba(52,211,153,0.45)] transition-all hover:bg-emerald-300 hover:shadow-[0_0_48px_rgba(52,211,153,0.7)] sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current" />
            See it in action
          </a>
          <a
            href="#marketplace"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition-all hover:border-emerald-400/40 hover:bg-emerald-400/[0.06] hover:text-emerald-300 sm:w-auto"
          >
            Explore Marketplace
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* Live pipeline diagram */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-16 w-full max-w-5xl"
        >
          <div className="glass relative overflow-hidden rounded-2xl p-2 shadow-[0_24px_80px_-24px_rgba(16,185,129,0.25)] sm:p-4">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-500/[0.06] to-transparent" />
            <PipelineDiagram className="h-auto w-full" />
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-3 pt-2 sm:px-6">
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Pipeline live
              </span>
              <span className="font-mono text-xs text-slate-500">
                throughput 12.4 t/hr · uptime 99.98%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pipeline strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 1 : 1 }}
          transition={{ delay: 1 }}
          className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-6"
        >
          {["Identify", "Segregate", "Process", "Verify", "Sell", "Reuse"].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease }}
              className="flex items-center justify-center gap-1.5 bg-[#070c0a] px-3 py-3 text-center"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-display text-sm font-semibold text-slate-200">{step}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
