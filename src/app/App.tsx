import { useState } from "react";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { AuthProvider } from "./hooks/useAuth";
import { Navbar } from "./components/layout/Navbar";
import { MobileMenu } from "./components/layout/MobileMenu";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { TechMarquee } from "./components/sections/TechMarquee";
import { Solutions } from "./components/sections/Solutions";
import { Products } from "./components/sections/Products";
import { Services } from "./components/sections/Services";
import { Auditorias } from "./components/sections/Auditorias";
import { Stats } from "./components/sections/Stats";
import { Testimonials } from "./components/sections/Testimonials";
import { CTA } from "./components/sections/CTA";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { QuoteCalculator } from "./components/QuoteCalculator";
import { TechServicesModal } from "./components/TechServicesModal";
import { AuthModal } from "./components/AuthModal";
import { AccountModal } from "./components/AccountModal";

export default function App() {
  const { scrolled, progress } = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [techServicesOpen, setTechServicesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [accountOpen, setAccountOpen] = useState(false);

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  return (
    <AuthProvider>
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
          onOpenRegister={openRegister}
          onOpenAccount={() => setAccountOpen(true)}
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
          <Services onOpenQuote={() => setQuoteOpen(true)} />
          <Auditorias />
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
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode={authMode}
        />
        <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      </div>
    </AuthProvider>
  );
}