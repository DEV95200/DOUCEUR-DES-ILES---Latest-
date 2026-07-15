import { Link } from "react-router-dom";
import { buttonClasses } from "../components/ui/Button";

export function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-kala-cream px-6 text-center">
      <span className="font-display text-7xl font-bold text-kala-green">
        404
      </span>
      <h1 className="font-display text-2xl font-bold text-kala-ink">
        Cette page s'est perdue dans les îles
      </h1>
      <p className="max-w-sm text-sm text-kala-ink/60">
        La page que vous cherchez n'existe pas ou plus.
      </p>
      <Link to="/" className={buttonClasses("primary", "md")}>
        Retour à l'accueil
      </Link>
    </section>
  );
}
