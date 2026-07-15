import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { buttonClasses } from "../ui/Button";

export function SiteExperience() {
  const popup = useAdminStore((state) => state.experience.popup);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup.enabled) {
      setOpen(false);
      return;
    }
    const key = "kalawang-popup-seen";
    if (popup.showOncePerSession && sessionStorage.getItem(key) === "1") return;
    const timer = window.setTimeout(() => setOpen(true), popup.delaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [popup]);

  function close() {
    setOpen(false);
    if (popup.showOncePerSession) sessionStorage.setItem("kalawang-popup-seen", "1");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Fermer la fenêtre promotionnelle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[85] bg-kala-ink/70 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-kala-cream p-8 shadow-2xl sm:p-10"
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-kala-lime/70" />
              <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-kala-pink/70" />
              <button
                onClick={close}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-kala-ink shadow"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-kala-green px-3 py-1 text-xs font-bold uppercase tracking-widest text-kala-cream">
                  Offre Kalawang
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-kala-ink">
                  {popup.title}
                </h2>
                <p className="mt-3 leading-relaxed text-kala-ink/65">{popup.body}</p>
                <a
                  href={popup.ctaHref || "#boutique"}
                  onClick={close}
                  className={`${buttonClasses("primary", "lg")} mt-7`}
                >
                  {popup.ctaLabel} <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function MaintenanceScreen() {
  const maintenance = useAdminStore((state) => state.experience.maintenance);
  const site = useAdminStore((state) => state.siteSettings);
  if (!maintenance.enabled) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-kala-green px-6 text-kala-cream">
      <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-kala-lime/20" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-kala-mango/20" />
      <div className="relative max-w-xl text-center">
        <p className="font-display text-xl font-bold tracking-[0.25em] text-kala-lime">
          {site.brandName}
        </p>
        <h1 className="mt-8 font-display text-4xl font-bold uppercase sm:text-6xl">
          {maintenance.title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-kala-cream/70">
          {maintenance.message}
        </p>
        <a
          href={`mailto:${site.contactEmail}`}
          className="mt-8 inline-flex rounded-full border border-kala-cream/30 px-5 py-3 text-sm font-bold transition hover:bg-kala-cream hover:text-kala-green"
        >
          {site.contactEmail}
        </a>
      </div>
    </div>
  );
}
