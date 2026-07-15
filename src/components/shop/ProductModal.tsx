import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "../../types";
import { useAdminStore } from "../../store/adminStore";
import { useCartStore } from "../../store/cartStore";
import { Badge } from "../ui/Badge";
import { buttonClasses } from "../ui/Button";
import { ProductVisual } from "./ProductVisual";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const salesEnabled = useAdminStore((state) => state.commerce.salesEnabled);
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;
  const disabled = !salesEnabled || isOutOfStock;

  useEffect(() => setQuantity(1), [product?.id]);

  function handleClose() {
    setQuantity(1);
    onClose();
  }

  function handleAdd() {
    if (!product || disabled) return;
    addItem(product, quantity);
    toast.success(`${quantity} × ${product.name} ajouté au panier`, { icon: product.icon });
    handleClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div key="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 z-[80] bg-kala-ink/70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl sm:grid-cols-2"
            >
              <button onClick={handleClose} aria-label="Fermer" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-kala-ink shadow transition hover:bg-white"><X size={18} /></button>
              <ProductVisual product={product} className="min-h-[220px]" iconClassName="text-8xl" />
              <div className="flex flex-col gap-4 p-6 sm:p-8">
                {product.badge && <Badge kind={product.badge} />}
                <h3 className="font-display text-2xl font-bold leading-tight text-kala-ink">{product.name}</h3>
                <p className="text-sm leading-relaxed text-kala-ink/65">{product.description}</p>
                {product.stock !== undefined && (
                  <p className={`text-xs font-bold ${isOutOfStock ? "text-kala-chili" : "text-kala-green"}`}>
                    {isOutOfStock ? "Rupture de stock" : `${product.stock} unité${product.stock > 1 ? "s" : ""} disponible${product.stock > 1 ? "s" : ""}`}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-display text-2xl font-bold text-kala-ink">{euro.format(product.price)}</p>
                      {product.compareAtPrice && product.compareAtPrice > product.price && <span className="text-sm text-kala-ink/35 line-through">{euro.format(product.compareAtPrice)}</span>}
                    </div>
                    <p className="text-xs text-kala-ink/45">{product.unit}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-kala-ink/15 px-1 py-1">
                    <button aria-label="Diminuer la quantité" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-kala-ink/10"><Minus size={14} /></button>
                    <span className="w-6 text-center font-semibold">{quantity}</span>
                    <button aria-label="Augmenter la quantité" onClick={() => setQuantity((q) => Math.min(product.stock ?? 99, q + 1))} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-kala-ink/10"><Plus size={14} /></button>
                  </div>
                </div>
                <button disabled={disabled} onClick={handleAdd} className={`${buttonClasses("primary", "lg")} w-full disabled:cursor-not-allowed disabled:opacity-40`}>
                  {isOutOfStock ? "Indisponible" : !salesEnabled ? "Commandes suspendues" : `Ajouter au panier — ${euro.format(product.price * quantity)}`}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
