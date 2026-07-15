import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-kala-green text-kala-cream hover:bg-kala-green-light",
  secondary:
    "bg-kala-lime text-kala-ink hover:bg-kala-lime-dark",
  ghost:
    "bg-transparent text-inherit border-2 border-current hover:bg-black/5",
  dark: "bg-kala-ink text-kala-cream hover:bg-black",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-wide transition-colors duration-200 cursor-pointer select-none",
    variantStyles[variant],
    sizeStyles[size]
  );
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={clsx(buttonClasses(variant, size), className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
