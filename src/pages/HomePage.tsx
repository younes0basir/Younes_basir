import { useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../components/Header.tsx";
import Hero from "../components/Hero.tsx";
import SkillsMarquee from "../components/SkillsMarquee.tsx";
import About from "../components/About.tsx";
import Features from "../components/Features.tsx";
import Gallery from "../components/Gallery.tsx";
import Contact from "../components/Contact.tsx";
import Footer from "../components/Footer.tsx";
import { EASE_SOFT } from "../lib/motion.ts";
import { resetScrollAfterPaint } from "../lib/scroll.ts";

type HomePageProps = {
  reveal?: boolean;
};

export default function HomePage({ reveal = false }: HomePageProps) {
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!window.location.hash) {
      resetScrollAfterPaint();
    }
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-black"
      initial={reveal && !reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: EASE_SOFT, delay: reveal ? 0.15 : 0 }}
    >
      <Header />
      <main id="main">
        <Hero />
        <SkillsMarquee />
        <About />
        <Features />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
