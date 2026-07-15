import type { ReactNode } from "react";
import clsx from "clsx";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  speedClassName?: string;
}

/**
 * Infinite auto-scrolling row. The content is duplicated once so the
 * loop appears seamless, and paused on hover for accessibility/comfort.
 */
export function Marquee({
  children,
  reverse = false,
  className,
  speedClassName,
}: MarqueeProps) {
  return (
    <div className={clsx("group relative overflow-hidden", className)}>
      <div
        className={clsx(
          "flex w-max shrink-0 gap-6 group-hover:[animation-play-state:paused]",
          speedClassName ?? (reverse ? "animate-marquee-reverse" : "animate-marquee")
        )}
      >
        <div className="flex shrink-0 gap-6">{children}</div>
        <div className="flex shrink-0 gap-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
