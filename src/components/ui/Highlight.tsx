import type { ReactNode } from "react";
import clsx from "clsx";

type HighlightColor = "lime" | "mango" | "pink" | "mint" | "purple" | "cream";

const colorMap: Record<HighlightColor, string> = {
  lime: "bg-kala-lime text-kala-green-dark",
  mango: "bg-kala-mango text-kala-ink",
  pink: "bg-kala-pink text-kala-chili",
  mint: "bg-kala-mint text-kala-green-dark",
  purple: "bg-kala-purple text-kala-cream",
  cream: "bg-kala-cream text-kala-ink",
};

interface HighlightProps {
  children: ReactNode;
  color?: HighlightColor;
  className?: string;
}

export function Highlight({
  children,
  color = "lime",
  className,
}: HighlightProps) {
  return (
    <span
      className={clsx(
        "relative inline-block -rotate-1 rounded-2xl px-3 py-0.5 shadow-[3px_4px_0_rgba(0,0,0,0.18)]",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
