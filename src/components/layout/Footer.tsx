import { Mail, MapPin } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";

const quickLinks = [
  { href: "#boutique", label: "Boutique" },
  { href: "#recettes", label: "Recettes" },
  { href: "#histoire", label: "Notre histoire" },
  { href: "#avis", label: "Avis clients" },
  { href: "#faq", label: "F.A.Q." },
];

export function Footer() {
  const site = useAdminStore((state) => state.siteSettings);
  return (
    <footer className="bg-kala-ink text-kala-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="font-display text-3xl font-bold tracking-wide">{site.brandName}</span>
          <p className="max-w-sm text-sm leading-relaxed text-kala-cream/70">{site.footerText}</p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-kala-lime">Navigation</span>
          {quickLinks.map((link) => <a key={link.href} href={link.href} className="text-sm text-kala-cream/70 transition hover:text-kala-cream">{link.label}</a>)}
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-kala-lime">Contact</span>
          <a href={`mailto:${site.contactEmail}`} className="flex items-center gap-2 text-sm text-kala-cream/70 transition hover:text-kala-cream"><Mail size={16} /> {site.contactEmail}</a>
          <span className="flex items-center gap-2 text-sm text-kala-cream/70"><MapPin size={16} /> {site.location}</span>
        </div>
      </div>
      <div className="border-t border-kala-cream/10 px-6 py-6 text-center text-xs text-kala-cream/50 sm:px-8">© {new Date().getFullYear()} {site.brandName}. Tous droits réservés.</div>
    </footer>
  );
}
