"use client";

import { LandingNav } from "./nav";
import { Hero } from "./hero";
import { LiveDemo } from "./live-demo";
import { PipelineStepper } from "./pipeline-stepper";
import { Marketplace } from "./marketplace";
import { Traceability } from "./traceability";
import { Impact } from "./impact";
import { LandingFooter } from "./footer";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#05080a] text-slate-200 selection:bg-emerald-400/30 selection:text-white">
      {/* Base gradient wash */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]" aria-hidden />
      <div className="relative z-10">
        <LandingNav />
        <main>
          <Hero />
          <LiveDemo />
          <PipelineStepper />
          <Marketplace />
          <Traceability />
          <Impact />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
