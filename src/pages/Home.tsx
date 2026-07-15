import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { scrollToTarget } from "../lib/smoothScroll";
import { useBackgroundColorFade } from "../hooks/useBackgroundColorFade";
import type { ColorStop } from "../hooks/useBackgroundColorFade";
import { Hero } from "../components/sections/Hero";
import { Story } from "../components/sections/Story";
import { FlavorBanner } from "../components/sections/FlavorBanner";
import { VideoSpotlight } from "../components/sections/VideoSpotlight";
import { Shop } from "../components/sections/Shop";
import { Recipes } from "../components/sections/Recipes";
import { WhyUs } from "../components/sections/WhyUs";
import { HowItWorks } from "../components/sections/HowItWorks";
import { Testimonials } from "../components/sections/Testimonials";
import { Faq } from "../components/sections/Faq";
import { Contact } from "../components/sections/Contact";
import { CtaBanner } from "../components/sections/CtaBanner";

const sectionColorStops: ColorStop[] = [
  { id: "accueil", color: "#0f3d2e" },
  { id: "histoire", color: "#6b1220" },
  { id: "saveurs", color: "#c6f24d" },
  { id: "video", color: "#7b5ce0" },
  { id: "boutique", color: "#fbf3e4" },
  { id: "recettes", color: "#ffffff" },
  { id: "pourquoi", color: "#e8cb13" },
  { id: "comment", color: "#7b5ce0" },
  { id: "avis", color: "#fbf3e4" },
  { id: "faq", color: "#8fe3b0" },
  { id: "contact", color: "#f3ad42" },
  { id: "cta", color: "#ffb6e1" },
];

export function Home() {
  const location = useLocation();
  const background = useBackgroundColorFade(sectionColorStops);

  useEffect(() => {
    if (!location.hash) return;
    const timeout = window.setTimeout(() => scrollToTarget(location.hash), 80);
    return () => window.clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <motion.div aria-hidden className="fixed inset-0 -z-10" style={{ backgroundColor: background }} />
      <Hero />
      <Story />
      <FlavorBanner />
      <VideoSpotlight />
      <Shop />
      <Recipes />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <Contact />
      <CtaBanner />
    </>
  );
}
