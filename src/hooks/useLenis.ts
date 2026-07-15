import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToTarget, setLenisInstance } from "../lib/smoothScroll";

/**
 * Initializes Lenis smooth-scrolling for the whole document and routes
 * same-page hash-link clicks (nav, footer, CTAs) through it so anchor
 * jumps and wheel/drag scrolling never compete with each other.
 * Mount once at the top of the app (see App.tsx).
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(2, -10 * t),
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement).closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const targetEl = document.querySelector(hash);
      if (!targetEl) return;

      event.preventDefault();
      scrollToTarget(targetEl as HTMLElement);
      window.history.pushState(null, "", hash);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frameId);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
