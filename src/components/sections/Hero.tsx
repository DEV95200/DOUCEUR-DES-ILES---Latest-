import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { Highlight } from "../ui/Highlight";
import { Polaroid } from "../ui/Polaroid";
import { WaveDivider } from "../ui/WaveDivider";
import { buttonClasses } from "../ui/Button";

export function Hero() {
  const hero = useAdminStore((state) => state.hero);
  const animationsEnabled = useAdminStore((state) => state.experience.animationsEnabled);

  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-36 text-kala-cream"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(198,242,77,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,138,61,0.3), transparent 45%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <motion.span
            initial={animationsEnabled ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-full border border-kala-cream/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-kala-cream/80"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={animationsEnabled ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-bold uppercase leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            {hero.titleLine}{" "}
            <Highlight color="lime" className="text-kala-green-dark">
              {hero.titleHighlight}
            </Highlight>
            .
          </motion.h1>

          <motion.p
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-lg font-tagline text-2xl italic text-kala-cream/85"
          >
            {hero.tagline}
          </motion.p>

          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a href="#boutique" className={buttonClasses("secondary", "lg")}>
              {hero.ctaPrimaryLabel}
            </a>
            <a href="#histoire" className={buttonClasses("ghost", "lg")}>
              {hero.ctaSecondaryLabel}
            </a>
          </motion.div>
        </div>

        <div className="relative hidden h-[26rem] lg:block">
          <Polaroid gradient="from-kala-lime to-kala-lime-dark" icon="🥭" caption="Râpé à la main" rotate={-8} sticker="✋" delay={0.2} className="absolute left-4 top-0 w-64" />
          <Polaroid gradient="from-kala-chili to-kala-chili-light" icon="🌶️" caption="Épices maison" rotate={4} sticker="🔥" delay={0.4} className="absolute right-0 top-10 w-60" />
          <Polaroid gradient="from-kala-mango to-kala-chili" icon="🍹" caption="Livré bien frais" rotate={-3} sticker="🚴" delay={0.6} className="absolute bottom-0 left-28 w-56" />
        </div>
      </div>

      <motion.a
        href="#histoire"
        aria-label="Défiler vers le bas"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-kala-cream/60"
        animate={animationsEnabled ? { y: [0, 8, 0] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={26} />
      </motion.a>

      <WaveDivider color="#6b1220" />
    </section>
  );
}
