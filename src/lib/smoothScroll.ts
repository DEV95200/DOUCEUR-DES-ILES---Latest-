import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

/**
 * Smoothly scrolls to a target element or selector, routed through Lenis
 * when available so it never fights with Lenis's own scroll animation.
 * Falls back to the native smooth scroll if Lenis hasn't mounted yet.
 */
export function scrollToTarget(target: string | HTMLElement, offset = -96) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
    return;
  }

  el.scrollIntoView({ behavior: "smooth" });
}
