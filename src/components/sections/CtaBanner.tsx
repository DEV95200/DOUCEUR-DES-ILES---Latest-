import { motion } from "framer-motion";
import { Polaroid } from "../ui/Polaroid";
import { WaveDivider } from "../ui/WaveDivider";
import { buttonClasses } from "../ui/Button";

export function CtaBanner() {
  return (
    <section id="cta" className="relative overflow-hidden px-6 py-28 text-kala-chili sm:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start gap-6"
        >
          <h2 className="font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
            Envie de voyager
            <br /> sans bouger ?
          </h2>
          <p className="max-w-md font-tagline text-xl italic text-kala-chili/80">
            Composez votre commande en quelques minutes, on s'occupe du reste.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#boutique" className={buttonClasses("dark", "lg")}>
              Découvrir la boutique
            </a>
            <a
              href="#contact"
              className={buttonClasses("ghost", "lg")}
            >
              Nous contacter
            </a>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <Polaroid
            gradient="from-kala-mango to-kala-pink"
            icon="🥭"
            caption="Notre atelier"
            rotate={-4}
            sticker="❤️"
            className="w-72 sm:w-80"
          />
        </div>
      </div>

      <WaveDivider color="#14231b" />
    </section>
  );
}
