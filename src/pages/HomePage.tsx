import Header from "../components/Header.tsx";
import Hero from "../components/Hero.tsx";
import SkillsMarquee from "../components/SkillsMarquee.tsx";
import About from "../components/About.tsx";
import Features from "../components/Features.tsx";
import Gallery from "../components/Gallery.tsx";
import Contact from "../components/Contact.tsx";
import Footer from "../components/Footer.tsx";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <SkillsMarquee />
        <About />
        <Features />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
