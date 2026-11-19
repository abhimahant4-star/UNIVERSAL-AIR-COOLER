"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a stat such as "25,000+" or "45+" from 0 up to its value when it scrolls into view.
 * Text without a number (e.g. "Pan India") is shown as is.
 */
export default function CountUp({ value, className = "", duration = 2000 }: { value: string; className?: string; duration?: number }) {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const commas = !!match && match[2].includes(",");
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        setN(target * eased);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  if (!match || isNaN(target)) return <span className={className}>{value}</span>;

  const shown = decimals ? n.toFixed(decimals) : Math.round(n).toString();
  const formatted = commas ? Number(shown).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : shown;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {match[1]}
        {formatted}
        {match[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
