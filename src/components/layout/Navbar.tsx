import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import clsx from "clsx";
import { useAdminStore } from "../../store/adminStore";
import { useCartStore, selectCartCount } from "../../store/cartStore";
import { useTopBarVisible } from "../marketing/PromoBar";
import { buttonClasses } from "../ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = useCartStore(selectCartCount);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const brandName = useAdminStore((state) => state.siteSettings.brandName);
  const videoEnabled = useAdminStore((state) => state.video.enabled);
  const recipesEnabled = useAdminStore((state) => state.recipes.some((recipe) => recipe.active));
  const topBarVisible = useTopBarVisible();

  const navLinks = [
    { href: "#boutique", label: "Boutique" },
    ...(recipesEnabled ? [{ href: "#recettes", label: "Recettes" }] : []),
    ...(videoEnabled ? [{ href: "#video", label: "Vidéo" }] : []),
    { href: "#histoire", label: "Notre histoire" },
    { href: "#faq", label: "F.A.Q." },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={clsx("fixed inset-x-0 z-50 transition-all duration-300", topBarVisible ? "top-10" : "top-0", scrolled || mobileOpen ? "bg-kala-ink/95 shadow-lg backdrop-blur" : "bg-transparent")}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-wide text-kala-cream">{brandName}</Link>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => <a key={link.href} href={link.href} className="font-body text-sm font-semibold text-kala-cream/85 transition-colors hover:text-kala-lime">{link.label}</a>)}
        </div>
        <div className="flex items-center gap-3">
          <a href="#boutique" className={clsx(buttonClasses("secondary", "sm"), "hidden sm:inline-flex")}>Commander</a>
          <button aria-label="Ouvrir le panier" onClick={toggleCart} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-kala-cream/10 text-kala-cream transition hover:bg-kala-cream/20">
            <ShoppingBag size={20} />
            <AnimatePresence>{count > 0 && <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-kala-mango text-[11px] font-bold text-kala-ink">{count}</motion.span>}</AnimatePresence>
          </button>
          <button aria-label="Ouvrir le menu" onClick={() => setMobileOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full bg-kala-cream/10 text-kala-cream md:hidden">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      <AnimatePresence>
        {mobileOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden md:hidden">
          <div className="flex flex-col gap-1 px-6 pb-6">
            {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 font-display text-lg text-kala-cream hover:bg-kala-cream/10">{link.label}</a>)}
            <a href="#boutique" onClick={() => setMobileOpen(false)} className={clsx(buttonClasses("secondary", "md"), "mt-2 justify-center")}>Commander</a>
          </div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
}
