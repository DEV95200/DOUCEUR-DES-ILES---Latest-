import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

export interface ColorStop {
  /** DOM id of the section that "owns" this color. */
  id: string;
  color: string;
}

interface Range {
  offsets: number[];
  colors: string[];
}

/**
 * Cross-fades a background color as the page scrolls from one section to
 * the next — most of each section stays a flat color, with a short blend
 * right at the seam, echoing the color-morph feel of the chwit.fr reference.
 *
 * Returns a Framer Motion MotionValue<string> to bind directly to a
 * `backgroundColor` style (no React re-renders on scroll).
 */
export function useBackgroundColorFade(stops: ColorStop[]) {
  const { scrollY } = useScroll();
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  const [range, setRange] = useState<Range>(() => ({
    offsets: [0, 1],
    colors: [stops[0]?.color ?? "#ffffff", stops[0]?.color ?? "#ffffff"],
  }));

  useEffect(() => {
    function measure() {
      const list = stopsRef.current;
      const anchor = document.getElementById(list[0]?.id ?? "");
      if (!anchor || list.length === 0) return;

      const tops = list.map((stop) => document.getElementById(stop.id)?.offsetTop ?? 0);

      const offsets: number[] = [0];
      const colors: string[] = [list[0].color];

      for (let i = 1; i < list.length; i++) {
        const prevOffset = offsets[offsets.length - 1];
        const top = Math.max(tops[i], prevOffset + 1);
        const gap = top - tops[i - 1];
        const fade = Math.min(260, gap * 0.4);

        offsets.push(Math.max(top - fade, prevOffset + 1));
        colors.push(list[i - 1].color);

        offsets.push(Math.max(top, offsets[offsets.length - 1] + 1));
        colors.push(list[i].color);
      }

      setRange({ offsets, colors });
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

  return useTransform(scrollY, range.offsets, range.colors);
}
