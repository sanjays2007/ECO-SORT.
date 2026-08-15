"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, BadgeCheck, FileText, Check } from "lucide-react";
import { LISTINGS, MARKETPLACE_FILTERS, CATEGORY_COLORS, CATEGORY_LABELS, type CategoryKey } from "./data";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { cn } from "@/lib/utils";

function VerifiedBadge() {
  return (
    <span className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-emerald-400/30 bg-emerald-400/[0.08] px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
      <BadgeCheck className="h-3.5 w-3.5" />
      EcoSort Verified
      <span
        className="animate-shimmer pointer-events-none absolute inset-0"
        style={{ backgroundImage: "linear-gradient(110deg, transparent 30%, rgba(52,211,153,0.35) 50%, transparent 70%)" }}
      />
    </span>
  );
}

function RequestQuoteButton({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const onClick = () => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("done"), 1400);
    window.setTimeout(() => setState("idle"), 3200);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
        state === "done"
          ? "border border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
          : "bg-emerald-400 text-[#04120c] hover:bg-emerald-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.5)]"
      )}
    >
      {state === "idle" && (
        <>
          Request Quote
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </>
      )}
      {state === "loading" && (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Sending…
        </>
      )}
      {state === "done" && (
        <>
          <Check className="h-4 w-4" />
          Quote requested
        </>
      )}
    </button>
  );
}

export function Marketplace() {
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => {
      const matchesFilter = filter === "all" || l.category === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        l.material.toLowerCase().includes(q) ||
        l.supplier.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <section id="marketplace" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-aurora absolute -right-40 top-0 h-[460px] w-[460px] rounded-full bg-sky-500/[0.07] blur-[130px] [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="B2B Marketplace"
          title={
            <>
              Recovered materials, <span className="text-emerald-400">ready to buy</span>
            </>
          }
          subtitle="Lab-verified feedstock listed by batch. Every kilogram traceable to the bin it came from."
        />

        {/* Controls */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {MARKETPLACE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                  filter === f.value
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.2)]"
                    : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search material, supplier, batch…"
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none backdrop-blur transition-all focus:border-emerald-400/50 focus:shadow-[0_0_20px_rgba(52,211,153,0.15)] sm:w-72"
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((l) => {
              const color = CATEGORY_COLORS[l.category];
              return (
                <motion.article
                  key={l.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)]"
                >
                  {/* Category tint */}
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-300 group-hover:opacity-25" style={{ background: color }} />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[11px] text-slate-500">BATCH {l.id}</span>
                        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-white">{l.material}</h3>
                      </div>
                      <VerifiedBadge />
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: `${color}1f`, color }}>
                        {l.grade}
                      </span>
                      <span className="text-xs text-slate-500">{CATEGORY_LABELS[l.category]}</span>
                    </div>

                    {/* Purity */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Purity</span>
                        <span className="font-semibold text-emerald-300">{l.purity}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${l.purity}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)`, boxShadow: `0 0 8px ${color}66` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 text-sm">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Quantity</p>
                        <p className="mt-0.5 font-semibold text-slate-200">{l.quantity}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Price</p>
                        <p className="mt-0.5 font-semibold text-emerald-300">{l.price} / kg</p>
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          {l.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <FileText className="h-3.5 w-3.5" />
                          {l.supplier}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <RequestQuoteButton id={l.id} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-slate-500">
            No listings match that search. Try a different material or clear the filters.
          </p>
        )}
      </div>
    </section>
  );
}
