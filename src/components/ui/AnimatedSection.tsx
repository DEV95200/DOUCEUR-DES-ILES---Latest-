import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

/**
 * Generic scroll-reveal wrapper: fades and slides content up once it
 * enters the viewport. Used to stagger cards/columns inside a section.
 */
export function AnimatedSection({
  children,
  delay = 0,
  className,
  y = 32,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
