"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up from 0 to value once the element scrolls into view. */
export function useCountUp(value: number, duration = 1.6, decimals = 0) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }));
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) =>
        setDisplay(
          v.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })
        ),
    });
    return () => controls.stop();
  }, [inView, value, duration, decimals, reduce]);

  return { ref, display };
}
