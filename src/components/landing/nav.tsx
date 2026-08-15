"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Recycle, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#demo", label: "Live Demo" },
  { href: "#pipeline", label: "Pipeline" },
  { href: "#marketplace", label: "Marketplace" },
  { href: "#traceability", label: "Traceability" },
  { href: "#impact", label: "Impact" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-white/[0.06] bg-[#05080a]/80 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav className={cn("mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8", scrolled ? "h-14" : "h-[72px]")}>
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_0_24px_rgba(52,211,153,0.45)] transition-shadow group-hover:shadow-[0_0_36px_rgba(52,211,153,0.7)]">
            <Recycle className="h-5 w-5 text-[#04120c]" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            EcoSort<span className="text-emerald-400">·</span>Vision
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-emerald-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#04120c] shadow-[0_0_24px_rgba(52,211,153,0.4)] transition-all hover:bg-emerald-300 hover:shadow-[0_0_36px_rgba(52,211,153,0.65)]"
          >
            Launch App
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/[0.06] bg-[#05080a]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06] hover:text-emerald-300"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2 border-t border-white/[0.06] pt-4">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-medium text-slate-200"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-emerald-400 px-4 py-2.5 text-center text-sm font-semibold text-[#04120c]"
                >
                  Launch App
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
