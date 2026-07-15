import { motion } from "framer-motion";
import clsx from "clsx";

interface PolaroidProps {
  gradient: string;
  icon: string;
  caption?: string;
  rotate?: number;
  sticker?: string;
  className?: string;
  delay?: number;
}

/**
 * A rotated "polaroid" tile used to fill the illustrative photo slots on
 * the page. Rendered as a branded gradient + icon (instead of a stock
 * photo) so the site never depends on an external image host and stays
 * visually consistent with the product cards.
 */
export function Polaroid({
  gradient,
  icon,
  caption,
  rotate = -4,
  sticker,
  className,
  delay = 0,
}: PolaroidProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      style={{ "--tw-rotate": `${rotate}deg` } as React.CSSProperties}
      className={clsx(
        "animate-float relative rounded-3xl bg-white p-2.5 shadow-2xl",
        className
      )}
    >
      <div
        className={clsx(
          "flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br",
          gradient
        )}
      >
        <span className="text-7xl drop-shadow-sm">{icon}</span>
        {caption && (
          <span className="px-6 text-center font-display text-sm font-bold uppercase tracking-wide text-kala-ink/70">
            {caption}
          </span>
        )}
      </div>
      {sticker && (
        <span className="absolute -right-4 -top-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-kala-lime text-2xl shadow-lg">
          {sticker}
        </span>
      )}
    </motion.div>
  );
}
