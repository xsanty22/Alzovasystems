import { useState } from "react";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { Navbar } from "./components/layout/Navbar";
import { MobileMenu } from "./components/layout/MobileMenu";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { TechMarquee } from "./components/sections/TechMarquee";
import { Solutions } from "./components/sections/Solutions";
import { Products } from "./components/sections/Products";
import { Services } from "./components/sections/Services";
import { Process } from "./components/sections/Process";
import { Stats } from "./components/sections/Stats";
import { Testimonials } from "./components/sections/Testimonials";
import { CTA } from "./components/sections/CTA";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { QuoteCalculator } from "./components/QuoteCalculator";
import { TechServicesModal } from "./components/TechServicesModal";

export default function App() {
  const { scrolled, progress } = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [techServicesOpen, setTechServicesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div
        className="fixed top-0 left-0 h-[2px] z-[60]"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #0066FF, #00C2FF)",
          transition: "width 0.1s linear",
        }}
      />

      <Navbar
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero />
        <TechMarquee />
        <Solutions
          onOpenQuote={() => setQuoteOpen(true)}
          onOpenTechServices={() => setTechServicesOpen(true)}
        />
        <Products />
        <Services />
        <Process />
        <Stats />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
      <WhatsAppFloat />
      <QuoteCalculator open={quoteOpen} onClose={() => setQuoteOpen(false)} />
      <TechServicesModal
        open={techServicesOpen}
        onClose={() => setTechServicesOpen(false)}
      />
    </div>
  );
}