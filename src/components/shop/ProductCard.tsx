import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "../../types";
import { useAdminStore } from "../../store/adminStore";
import { useCartStore } from "../../store/cartStore";
import { Badge } from "../ui/Badge";
import { ProductVisual } from "./ProductVisual";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const salesEnabled = useAdminStore((state) => state.commerce.salesEnabled);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const disabled = !salesEnabled || isOutOfStock;

  function handleAdd(event: React.MouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    addItem(product);
    toast.success(`${product.name} ajouté au panier`, { icon: product.icon });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -8 }}
      onClick={() => onQuickView(product)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-kala-ink/5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <ProductVisual product={product} className="h-40" iconClassName="text-6xl" />
        {product.badge && <div className="absolute left-3 top-3"><Badge kind={product.badge} /></div>}
        {isOutOfStock && <span className="absolute inset-x-3 bottom-3 rounded-full bg-kala-ink/85 px-3 py-1 text-center text-xs font-bold text-white">Rupture de stock</span>}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold leading-tight text-kala-ink">{product.name}</h3>
        <p className="flex-1 text-sm text-kala-ink/60">{product.shortDescription}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-kala-ink">{euro.format(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-kala-ink/35 line-through">{euro.format(product.compareAtPrice)}</span>
              )}
            </div>
            <span className="text-xs text-kala-ink/45">{product.unit}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={disabled}
            aria-label={`Ajouter ${product.name} au panier`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-kala-green text-kala-cream transition-transform duration-200 hover:scale-110 hover:bg-kala-green-light active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
