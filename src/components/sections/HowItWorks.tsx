import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { Polaroid } from "../ui/Polaroid";
import { WaveDivider } from "../ui/WaveDivider";

const steps = [
  {
    icon: "🛒",
    title: "Choisissez vos produits",
    text: "Parcourez la boutique et ajoutez vos saveurs préférées au panier, sans quitter la page.",
  },
  {
    icon: "💳",
    title: "Commandez en toute sécurité",
    text: "Paiement rapide et sécurisé, en quelques clics, depuis votre téléphone ou votre ordinateur.",
  },
  {
    icon: "📦",
    title: "Recevez chez vous",
    text: "Votre colis frais est préparé avec soin et livré directement à votre porte.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment" className="relative overflow-hidden px-6 py-28 text-kala-cream sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Comment ça marche"
            title="Commander n'a jamais été aussi simple"
            align="left"
            light
          />

          <div className="flex flex-col gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="flex items-start gap-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-kala-cream/15 text-2xl">
                  {step.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-kala-cream/75">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <Polaroid
            gradient="from-kala-lime to-kala-mango"
            icon="📦"
            caption="Emballé avec soin"
            rotate={3}
            sticker="🚚"
            className="w-80"
          />
        </div>
      </div>

      <WaveDivider color="#fbf3e4" />
    </section>
  );
}
