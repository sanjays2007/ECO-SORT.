"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  phase: number;
}

/**
 * Canvas particle field representing waste-to-resource transformation:
 * dull grey-green specks drift upward and fade into electric emerald.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];

    const DULL = { r: 96, g: 122, b: 112 };
    const BRIGHT = { r: 52, g: 211, b: 153 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, width * dpr);
      canvas.height = Math.max(1, height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = (initial: boolean) => {
      const count = reduce ? 14 : Math.min(70, Math.floor(width / 16));
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: initial ? Math.random() * height : height + 8 + Math.random() * 40,
          r: 0.8 + Math.random() * 1.9,
          vy: 0.12 + Math.random() * 0.35,
          vx: (Math.random() - 0.5) * 0.12,
          life: 0,
          maxLife: 340 + Math.random() * 420,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    seed(true);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.life += dt;
        p.y -= p.vy * (dt / 16.7);
        p.x += p.vx * (dt / 16.7) + Math.sin(now / 1400 + p.phase) * 0.08;
        const progress = Math.min(1, p.life / p.maxLife);

        // Fade in at spawn, fade out as it "resolves" near the top
        const fadeIn = Math.min(1, p.life / 240);
        const fadeOut = progress > 0.82 ? 1 - (progress - 0.82) / 0.18 : 1;
        const alpha = fadeIn * fadeOut * (reduce ? 0.5 : 0.8);

        // Interpolate dull -> emerald as it rises
        const r = Math.round(DULL.r + (BRIGHT.r - DULL.r) * progress);
        const g = Math.round(DULL.g + (BRIGHT.g - DULL.g) * progress);
        const b = Math.round(DULL.b + (BRIGHT.b - DULL.b) * progress);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        if (progress > 0.7) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 0.12})`;
          ctx.fill();
        }

        if (p.y < -12 || p.life > p.maxLife) {
          p.y = height + 8 + Math.random() * 30;
          p.x = Math.random() * width;
          p.life = 0;
          p.maxLife = 340 + Math.random() * 420;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      // Draw a static frame
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(52, 211, 153, 0.35)";
        ctx.fill();
      }
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      seed(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
