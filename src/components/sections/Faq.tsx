import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Marquee } from "../ui/Marquee";
import { WaveDivider } from "../ui/WaveDivider";
import { faqItems } from "../../data/faq";

const galleryTiles = [
  { icon: "🥭", gradient: "from-kala-lime to-kala-lime-dark" },
  { icon: "🌶️", gradient: "from-kala-chili to-kala-chili-light" },
  { icon: "🍹", gradient: "from-kala-mango to-kala-chili" },
  { icon: "🍰", gradient: "from-kala-pink to-kala-purple" },
  { icon: "🫙", gradient: "from-kala-purple to-kala-purple-dark" },
  { icon: "🍋", gradient: "from-kala-lime to-kala-mango" },
];

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section id="faq" className="relative overflow-hidden px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Besoin d'aide" title="Foire aux questions" />

        <div className="mt-12 flex flex-col gap-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border-2 border-kala-green bg-kala-cream"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-display font-semibold text-kala-green-dark">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-kala-green-dark"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-kala-ink/65">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <Marquee className="mt-20">
        {galleryTiles.map((tile, i) => (
          <div
            key={i}
            className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-kala-cream bg-gradient-to-br text-4xl shadow-md sm:h-32 sm:w-32 sm:text-5xl ${tile.gradient}`}
          >
            {tile.icon}
          </div>
        ))}
      </Marquee>

      <WaveDivider color="#f3ad42" />
    </section>
  );
}
