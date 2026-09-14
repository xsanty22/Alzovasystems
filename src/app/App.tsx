import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { AuthProvider, useAuth } from "./hooks/useAuth";
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
import { AdminLeads } from "./pages/AdminLeads";

function LandingPage() {
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
      <TechServicesModal open={techServicesOpen} onClose={() => setTechServicesOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}

function AdminRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin mx-auto mb-4" />
          <div className="text-sm" style={{ color: "#8B94A8", fontFamily: "'JetBrains Mono', monospace" }}>
            Verificando acceso...
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  const isAdmin = (profile as any)?.is_admin === true;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <AdminLeads />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/leads" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}