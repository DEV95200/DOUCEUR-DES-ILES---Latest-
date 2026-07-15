import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  useCartStore,
  selectCartSubtotal,
} from "../../store/cartStore";
import { buttonClasses } from "../ui/Button";
import { ProductVisual } from "../shop/ProductVisual";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-kala-ink/60 backdrop-blur-sm"
          />

          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-kala-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-kala-ink/10 px-6 py-5">
              <h2 className="font-display text-xl font-bold uppercase text-kala-ink">
                Votre panier
              </h2>
              <button
                aria-label="Fermer le panier"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-kala-ink/5 transition hover:bg-kala-ink/10"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kala-ink/5">
                  <ShoppingBag size={28} className="text-kala-ink/40" />
                </div>
                <p className="text-kala-ink/60">
                  Votre panier est vide pour le moment.
                </p>
                <a
                  href="#boutique"
                  onClick={closeCart}
                  className={buttonClasses("primary", "sm")}
                >
                  Voir la boutique
                </a>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="flex flex-col gap-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4 overflow-hidden"
                        >
                          <ProductVisual
                            product={item.product}
                            className="h-16 w-16 shrink-0 rounded-2xl"
                            iconClassName="text-2xl"
                          />

                          <div className="flex flex-1 flex-col gap-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-display text-sm font-bold leading-tight text-kala-ink">
                                {item.product.name}
                              </p>
                              <button
                                aria-label="Retirer l'article"
                                onClick={() => removeItem(item.product.id)}
                                className="text-kala-ink/40 transition hover:text-kala-chili"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-xs text-kala-ink/50">
                              {item.product.unit}
                            </p>

                            <div className="mt-1 flex items-center justify-between">
                              <div className="flex items-center gap-1 rounded-full border border-kala-ink/15 px-1 py-1">
                                <button
                                  aria-label="Diminuer la quantité"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-kala-ink/10"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  aria-label="Augmenter la quantité"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-kala-ink/10"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="font-display text-sm font-bold text-kala-ink">
                                {euro.format(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-kala-ink/10 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-body text-sm text-kala-ink/60">
                      Sous-total
                    </span>
                    <span className="font-display text-lg font-bold text-kala-ink">
                      {euro.format(subtotal)}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-kala-ink/50">
                    Frais de livraison calculés à l'étape suivante.
                  </p>
                  <Link
                    to="/commande"
                    onClick={closeCart}
                    className={`${buttonClasses("primary", "lg")} w-full`}
                  >
                    Passer la commande
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
