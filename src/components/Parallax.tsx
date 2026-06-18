"use client";

import { useEffect, useRef } from "react";

/**
 * One shared scroll listener drives every Parallax layer on the page, instead
 * of each instance attaching its own - much cheaper when a page has many
 * drifting clouds. Layers register on mount and unregister on unmount.
 */
type Layer = { el: HTMLElement; speed: number };
const layers = new Set<Layer>();
let raf = 0;
let listening = false;

function update() {
  raf = 0;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  for (const { el, speed } of layers) {
    el.style.transform = `translate3d(0, ${(-y * speed).toFixed(1)}px, 0)`;
  }
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update);
}

function ensureListening() {
  if (listening) return;
  window.addEventListener("scroll", onScroll, { passive: true });
  listening = true;
}

export default function Parallax({
  speed,
  className,
  style,
  children,
}: {
  speed: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Honor a reduced-motion preference: skip scroll-driven parallax entirely.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const layer: Layer = { el, speed };
    layers.add(layer);
    ensureListening();
    onScroll(); // set initial position
    return () => {
      layers.delete(layer);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, pointerEvents: "none", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
