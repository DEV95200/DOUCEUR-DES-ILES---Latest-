import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";
import { AnimatedSection } from "../ui/AnimatedSection";

const reasons = [
  {
    icon: "🌿",
    title: "100% fait maison",
    text: "Chaque recette est préparée en petites quantités dans notre atelier, jamais en usine.",
  },
  {
    icon: "📦",
    title: "Livré frais, sans attendre",
    text: "Commande préparée et expédiée sous 48h, emballée avec soin pour arriver intacte.",
  },
  {
    icon: "🤍",
    title: "Des recettes authentiques",
    text: "Aucun raccourci : les saveurs des îles, telles qu'elles doivent être.",
  },
];

export function WhyUs() {
  return (
    <section id="pourquoi" className="relative overflow-hidden px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pourquoi Kalawang"
          title="Pas de raccourcis, juste du goût"
          tagline="On cuisine comme à la maison, on livre comme on aimerait être livré."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {reasons.map((reason, index) => (
            <AnimatedSection key={reason.title} delay={index * 0.1}>
              <div className="group h-full rounded-3xl bg-kala-cream p-8 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {reason.icon}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-kala-ink">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-kala-ink/60">
                  {reason.text}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <WaveDivider color="#7b5ce0" />
    </section>
  );
}
