import type { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  tagline?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  tagline,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={clsx(
            "rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
            light
              ? "border-kala-cream/40 text-kala-cream/80"
              : "border-kala-ink/20 text-kala-ink/70"
          )}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={clsx(
          "font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl",
          light ? "text-kala-cream" : "text-kala-ink"
        )}
      >
        {title}
      </motion.h2>
      {tagline && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={clsx(
            "max-w-2xl font-tagline text-xl italic sm:text-2xl",
            light ? "text-kala-cream/85" : "text-kala-ink/70"
          )}
        >
          {tagline}
        </motion.p>
      )}
    </div>
  );
}
