import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useContactModal } from "@/contexts/ContactModalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { openContactModal } = useContactModal();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.practiceAreas"), href: "/practice-areas" },
    { label: t("nav.team"), href: "/team" },
    { label: t("nav.reviews"), href: "/reviews" },
    { label: t("nav.blog"), href: "/blog" },
  ];

  const handleContactClick = () => {
    setMobileMenuOpen(false);
    openContactModal();
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Trap focus in mobile menu when open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full" role="banner">
      {/* Top Bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:8184014725"
              className="flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
              aria-label="Call us at (818) 401-4725"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">(818) 401-4725</span>
            </a>
            <a
              href="mailto:kg@gurovichlaw.com"
              className="flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
              aria-label="Email us at kg@gurovichlaw.com"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">kg@gurovichlaw.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="text-xs text-muted-foreground hidden sm:block" aria-label="Business hours">
              {t("header.hours")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Gurovich Law Group - Go to homepage"
          >
            <img
              src="/images/glg-logo-new.png"
              alt="Gurovich Law Group Logo"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-heading text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 ${
                  location === item.href
                    ? "text-primary"
                    : "text-foreground"
                }`}
                role="menuitem"
                aria-current={location === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button 
              onClick={handleContactClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold px-6 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Open contact form"
            >
              {t("nav.contact")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden border-t border-border bg-background"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="container py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block font-heading text-base font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 ${
                    location === item.href
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                  aria-current={location === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Button 
                onClick={handleContactClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open contact form"
              >
                {t("nav.contact")}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
