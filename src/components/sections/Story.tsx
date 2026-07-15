import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";
import { AnimatedSection } from "../ui/AnimatedSection";

const pillars = [
  {
    icon: "🥭",
    title: "Mangues vertes triées à la main",
    text: "Chaque fruit est choisi juste avant maturité, pour ce croquant si particulier du vrai Kalawang.",
  },
  {
    icon: "🌶️",
    title: "Épices et piments locaux",
    text: "Cultivés par des producteurs de la région, sans arômes artificiels ni raccourcis.",
  },
  {
    icon: "👩‍🍳",
    title: "Recettes transmises en famille",
    text: "Le même geste, pot après pot. On ne change pas une recette qui fonctionne.",
  },
];

export function Story() {
  return (
    <section
      id="histoire"
      className="relative overflow-hidden px-6 py-28 text-kala-cream sm:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-7xl font-bold text-kala-mango sm:text-8xl"
        >
          0%
        </motion.span>
        <SectionHeading
          eyebrow="Notre histoire"
          title="Conservateur ajouté. Zéro raccourci."
          tagline="Juste des fruits, des épices, et du temps."
          light
        />
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-3">
        {pillars.map((pillar, index) => (
          <AnimatedSection key={pillar.title} delay={index * 0.1}>
            <div className="h-full rounded-3xl border-l-4 border-kala-mango bg-kala-cream/95 p-6 text-kala-ink shadow-lg">
              <span className="text-3xl">{pillar.icon}</span>
              <h3 className="mt-3 font-display text-lg font-bold">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-kala-ink/65">
                {pillar.text}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <WaveDivider color="#c6f24d" />
    </section>
  );
}
