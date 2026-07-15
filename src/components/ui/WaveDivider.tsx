import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";

interface WaveDividerProps {
  color: string;
  flip?: boolean;
  className?: string;
  /** How many px before the boundary the color blend should start (matches useBackgroundColorFade's cap). */
  fadeDistance?: number;
}

const WAVE_PATH =
  "M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,120 L0,120 Z";

function WaveLayer({
  color,
  duration,
  opacity,
  offsetY = 0,
  reverse = false,
}: {
  color: string;
  duration: number;
  opacity: number;
  offsetY?: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-x-0 flex h-full w-[200%]"
      style={{ top: offsetY, opacity }}
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-full w-1/2"
        >
          <path d={WAVE_PATH} fill={color} />
        </svg>
      ))}
    </motion.div>
  );
}

/**
 * A fluid, continuously-flowing wave divider that reveals itself right as
 * its section's boundary crosses the top of the viewport — driven by the
 * same absolute scroll-position math as useBackgroundColorFade (rather than
 * a viewport-relative "element enters/exits" progress), so the wave and the
 * page-wide color cross-fade stay in sync instead of drifting apart.
 */
export function WaveDivider({
  color,
  flip = false,
  className,
  fadeDistance = 260,
}: WaveDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [boundary, setBoundary] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      if (!ref.current) return;
      // getBoundingClientRect() + scrollY gives the element's true position
      // relative to the document, unlike offsetTop which is relative to the
      // nearest positioned ancestor (the section itself, here).
      setBoundary(ref.current.getBoundingClientRect().top + window.scrollY);
    }
    measure();
    const loadTimeout = window.setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => {
      window.clearTimeout(loadTimeout);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  const fadeEnd = boundary ?? 0;
  const fadeStart = fadeEnd - fadeDistance;
  const revealOpacity = useTransform(
    scrollY,
    [fadeStart, fadeStart + fadeDistance * 0.35, fadeEnd, fadeEnd + 48],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={clsx(
        "pointer-events-none absolute inset-x-0 -bottom-1 z-10 h-20 overflow-hidden sm:h-28",
        flip && "rotate-180",
        className
      )}
    >
      <motion.div style={{ opacity: revealOpacity }} className="absolute inset-0">
        <WaveLayer color={color} duration={26} opacity={0.4} offsetY={-8} reverse />
        <WaveLayer color={color} duration={16} opacity={1} />
      </motion.div>
    </div>
  );
}
