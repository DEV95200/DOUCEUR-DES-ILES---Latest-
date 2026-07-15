import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";
import { useCartStore, selectCartSubtotal } from "../store/cartStore";
import { buttonClasses } from "../components/ui/Button";
import { ProductVisual } from "../components/shop/ProductVisual";
import type { CustomerDetails, OrderRecord } from "../types";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function Checkout() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectCartSubtotal);
  const commerce = useAdminStore((state) => state.commerce);
  const promotions = useAdminStore((state) => state.promotions);
  const addOrder = useAdminStore((state) => state.addOrder);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const appliedPromotion = useMemo(() => promotions.find((promotion) => {
    if (!promotion.active || !promotion.code || promotion.code.toUpperCase() !== appliedCode.toUpperCase()) return false;
    return !promotion.endAt || new Date(promotion.endAt).getTime() > Date.now();
  }), [appliedCode, promotions]);

  const discount = appliedPromotion ? subtotal * (appliedPromotion.discountPercent / 100) : 0;
  const hasPhysicalProduct = items.some((item) => item.product.category !== "recettes");
  const shipping = !hasPhysicalProduct || subtotal >= commerce.freeShippingThreshold ? 0 : commerce.shippingFee;
  const total = Math.max(0, subtotal - discount + shipping);

  function applyPromo() {
    const normalized = promoInput.trim().toUpperCase();
    const promotion = promotions.find((candidate) => candidate.active && candidate.code?.toUpperCase() === normalized && (!candidate.endAt || new Date(candidate.endAt).getTime() > Date.now()));
    if (!promotion) {
      toast.error("Ce code promotionnel n’est pas valide ou a expiré.");
      return;
    }
    setAppliedCode(normalized);
    toast.success(`${promotion.discountLabel} appliqué à la commande`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commerce.salesEnabled) {
      toast.error("Les commandes sont actuellement suspendues.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const customer: CustomerDetails = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      notes: String(formData.get("notes") || ""),
    };
    const generated = `${commerce.orderPrefix || "KLW"}-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: OrderRecord = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      number: generated,
      createdAt: new Date().toISOString(),
      status: "Nouvelle",
      items: structuredClone(items),
      customer,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: appliedPromotion?.code,
    };
    addOrder(order);
    setOrderNumber(generated);
    clearCart();
  }

  if (orderNumber) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-kala-cream px-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="flex max-w-lg flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}><CheckCircle2 size={56} className="text-kala-green" /></motion.div>
          <h1 className="font-display text-2xl font-bold text-kala-ink">Merci pour votre commande !</h1>
          <p className="text-sm text-kala-ink/60">Votre commande <span className="font-semibold text-kala-ink">{orderNumber}</span> a bien été enregistrée dans Forge.</p>
          <Link to="/" className={buttonClasses("primary", "md")}>Retour à la boutique</Link>
        </motion.div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-kala-cream px-6 pt-24 text-center">
        <ShoppingBag size={40} className="text-kala-ink/30" />
        <h1 className="font-display text-2xl font-bold text-kala-ink">Votre panier est vide</h1>
        <p className="max-w-sm text-sm text-kala-ink/60">Direction la boutique pour choisir vos saveurs ou vos recettes numériques.</p>
        <Link to="/#boutique" className={buttonClasses("primary", "md")}>Voir la boutique</Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-kala-cream px-6 pb-24 pt-36 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase text-kala-ink">Livraison & paiement</h1>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Prénom" name="firstName" autoComplete="given-name" /><Field label="Nom" name="lastName" autoComplete="family-name" /></div>
            <Field label="E-mail" name="email" type="email" autoComplete="email" />
            <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" />
            <Field label="Adresse" name="address" autoComplete="street-address" />
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Ville" name="city" autoComplete="address-level2" /><Field label="Code postal" name="postalCode" autoComplete="postal-code" /></div>
            <div className="flex flex-col gap-2"><label htmlFor="notes" className="text-sm font-semibold text-kala-ink/70">Instructions de livraison (facultatif)</label><textarea id="notes" name="notes" rows={3} className="rounded-2xl border border-kala-ink/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-kala-green" /></div>
            <button type="submit" disabled={!commerce.salesEnabled} className={`${buttonClasses("primary", "lg")} mt-2 w-full disabled:cursor-not-allowed disabled:opacity-45`}>{commerce.salesEnabled ? `Confirmer ma commande — ${euro.format(total)}` : "Commandes temporairement suspendues"}</button>
            <p className="text-center text-xs text-kala-ink/45">Démonstration fonctionnelle : la commande est enregistrée dans Forge, mais aucun paiement bancaire réel n’est effectué.</p>
          </form>
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow-md sm:p-8">
          <h2 className="font-display text-lg font-bold uppercase text-kala-ink">Récapitulatif</h2>
          <ul className="mt-6 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3">
                  <ProductVisual product={item.product} className="h-12 w-12 shrink-0 rounded-xl" iconClassName="text-xl" />
                  <div className="flex-1"><p className="text-sm font-semibold text-kala-ink">{item.product.name}</p><div className="mt-1 flex items-center gap-1"><button type="button" aria-label="Diminuer la quantité" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-5 w-5 items-center justify-center rounded-full bg-kala-ink/5 hover:bg-kala-ink/10"><Minus size={10} /></button><span className="w-5 text-center text-xs font-semibold">{item.quantity}</span><button type="button" aria-label="Augmenter la quantité" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-5 w-5 items-center justify-center rounded-full bg-kala-ink/5 hover:bg-kala-ink/10"><Plus size={10} /></button></div></div>
                  <span className="text-sm font-bold text-kala-ink">{euro.format(item.product.price * item.quantity)}</span>
                  <button type="button" aria-label="Retirer l'article" onClick={() => removeItem(item.product.id)} className="text-kala-ink/30 hover:text-kala-chili"><Trash2 size={16} /></button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 border-t border-kala-ink/10 pt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-kala-ink/50">Code promotionnel</label>
            <div className="mt-2 flex gap-2"><div className="relative flex-1"><Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-kala-ink/35" /><input value={promoInput} onChange={(event) => setPromoInput(event.target.value.toUpperCase())} className="w-full rounded-xl border border-kala-ink/15 py-2.5 pl-9 pr-3 text-sm uppercase outline-none focus:border-kala-green" placeholder="VOTRECODE" /></div><button type="button" onClick={applyPromo} className="rounded-xl bg-kala-ink px-4 text-sm font-bold text-white">Appliquer</button></div>
            {appliedPromotion && <p className="mt-2 text-xs font-bold text-kala-green">{appliedPromotion.discountLabel} appliqué avec {appliedPromotion.code}</p>}
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-kala-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-kala-ink/60"><span>Sous-total</span><span>{euro.format(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between font-semibold text-kala-green"><span>Réduction</span><span>-{euro.format(discount)}</span></div>}
            <div className="flex justify-between text-kala-ink/60"><span>Livraison</span><span>{shipping === 0 ? "Offerte" : euro.format(shipping)}</span></div>
            {shipping > 0 && <p className="text-xs text-kala-ink/45">Plus que {euro.format(Math.max(0, commerce.freeShippingThreshold - subtotal))} pour la livraison offerte.</p>}
            <div className="mt-2 flex justify-between font-display text-lg font-bold text-kala-ink"><span>Total</span><span>{euro.format(total)}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return <div className="flex flex-col gap-2"><label htmlFor={name} className="text-sm font-semibold text-kala-ink/70">{label}</label><input id={name} name={name} type={type} required autoComplete={autoComplete} className="rounded-2xl border border-kala-ink/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-kala-green" /></div>;
}
