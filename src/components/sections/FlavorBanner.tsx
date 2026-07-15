import { Marquee } from "../ui/Marquee";
import { WaveDivider } from "../ui/WaveDivider";
import { AnimatedSection } from "../ui/AnimatedSection";

const icons = ["🥭", "🌶️", "🍹", "🍋", "🥥", "🍯", "🫙", "🍰"];

function IconTile({ icon }: { icon: string }) {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-kala-green/10 text-4xl sm:h-24 sm:w-24">
      {icon}
    </div>
  );
}

export function FlavorBanner() {
  return (
    <section id="saveurs" className="relative overflow-hidden py-16 text-kala-green-dark">
      <Marquee className="mb-10">
        {icons.map((icon, i) => (
          <IconTile key={`top-${i}`} icon={icon} />
        ))}
      </Marquee>

      <AnimatedSection className="mx-auto max-w-4xl px-6 text-center sm:px-8">
        <p className="font-tagline text-2xl italic sm:text-3xl">
          De la mangue verte au punch maison.
        </p>
        <p className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
          Toutes les saveurs des îles, dans votre cuisine.
        </p>
      </AnimatedSection>

      <Marquee reverse className="mt-10">
        {icons.map((icon, i) => (
          <IconTile key={`bottom-${i}`} icon={icon} />
        ))}
      </Marquee>

      <WaveDivider color="#fbf3e4" />
    </section>
  );
}
