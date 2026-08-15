"use client";

import Link from "next/link";
import { Recycle, ArrowUpRight } from "lucide-react";
import { SDGS } from "./data";
import { Reveal } from "./reveal";

export function LandingFooter() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* CTA banner */}
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.12] via-[#07120d] to-[#07120d] px-6 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="animate-aurora absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-emerald-400/[0.18] blur-[90px]" />
            </div>
            <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your city&apos;s waste is <span className="text-emerald-300 text-glow">already worth something.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              See the full platform — live sorting, analytics, and the B2B marketplace behind closed-loop recycling.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 text-sm font-semibold text-[#04120c] shadow-[0_0_32px_rgba(52,211,153,0.45)] transition-all hover:bg-emerald-300 hover:shadow-[0_0_48px_rgba(52,211,153,0.7)]"
              >
                Launch the platform
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* SDG strip */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Reveal>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Aligned with the UN Sustainable Development Goals
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {SDGS.map((sdg) => (
                <div key={sdg.number} className="group relative">
                  <div className="flex cursor-help items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.06]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 font-display text-xs font-bold text-[#04120c]">
                      {sdg.number}
                    </span>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-300">{sdg.title}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0a1310] p-3 text-xs leading-relaxed text-slate-400 shadow-2xl group-hover:block">
                    <p className="mb-1 font-semibold text-emerald-300">SDG {sdg.number} · {sdg.title}</p>
                    {sdg.description}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-600">
              <Recycle className="h-4.5 w-4.5 text-[#04120c]" strokeWidth={2.5} />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-white">
                EcoSort<span className="text-emerald-400">·</span>Vision
              </p>
              <p className="text-[11px] text-slate-500">Identify · Segregate · Process · Verify · Sell · Reuse</p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            <p>Built for GreenHack 2026 · Team Circularity</p>
            <p className="mt-0.5">© 2026 EcoSort-Vision. Demo build — all data is simulated.</p>
          </div>

          <div className="flex gap-6 text-xs font-medium text-slate-400">
            {["Docs", "API", "Privacy"].map((l) => (
              <a key={l} href="#top" className="transition-colors hover:text-emerald-300">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
