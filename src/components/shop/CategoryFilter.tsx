import { motion } from "framer-motion";
import clsx from "clsx";
import { categories } from "../../data/products";
import type { ProductCategory } from "../../types";

interface CategoryFilterProps {
  active: ProductCategory | "tous";
  onChange: (category: ProductCategory | "tous") => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => {
        const isActive = active === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="activeCategoryPill"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute inset-0 rounded-full bg-kala-ink"
              />
            )}
            <span
              className={clsx(
                "relative z-10",
                isActive ? "text-kala-cream" : "text-kala-ink/60 hover:text-kala-ink"
              )}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
