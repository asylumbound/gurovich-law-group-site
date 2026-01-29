import { useLocation } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useContactModal } from "@/contexts/ContactModalContext";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

// Custom Link component that scrolls to top on navigation
function ScrollToTopLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const [, setLocation] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLocation(href);
  };
  
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default function Footer() {
  const { openContactModal } = useContactModal();
  const { t } = useLanguage();

  const practiceAreas = [
    { label: t("practice.personalInjury"), href: "/practice-areas/personal-injury" },
    { label: t("practice.criminalDefense"), href: "/practice-areas/criminal-defense" },
    { label: t("practice.employmentLaw"), href: "/practice-areas/employment-law" },
    { label: t("practice.civilLitigation"), href: "/practice-areas/civil-litigation" },
  ];

  const quickLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.team"), href: "/team" },
    { label: t("nav.reviews"), href: "/reviews" },
    { label: t("nav.blog"), href: "/blog" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground" role="contentinfo">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand with Full Logo */}
          <div>
            <ScrollToTopLink href="/" className="inline-block mb-6">
              <img
                src="/logo-wht.png"
                alt="Gurovich Law Group - Return to Homepage"
                className="h-16 w-auto"
              />
            </ScrollToTopLink>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-4 mt-6" role="list" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`Follow us on ${social.label}`}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
                  role="listitem"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Practice Areas */}
          <nav aria-label="Practice Areas">
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              {t("nav.practiceAreas")}
            </h4>
            <ul className="space-y-3" role="list">
              {practiceAreas.map((item) => (
                <li key={item.href} role="listitem">
                  <ScrollToTopLink
                    href={item.href}
                    className="font-body text-white/70 hover:text-primary transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
                  >
                    {item.label}
                  </ScrollToTopLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3" role="list">
              {quickLinks.map((item) => (
                <li key={item.href} role="listitem">
                  <ScrollToTopLink
                    href={item.href}
                    className="font-body text-white/70 hover:text-primary transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
                  >
                    {item.label}
                  </ScrollToTopLink>
                </li>
              ))}
              <li role="listitem">
                <button
                  onClick={openContactModal}
                  className="font-body text-white/70 hover:text-primary transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
                >
                  {t("footer.contactUs")}
                </button>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              {t("footer.contactUs")}
            </h4>
            <address className="space-y-4 font-body text-sm text-white/70 not-italic">
              <p>
                15250 Ventura Blvd. Suite 700
                <br />
                Sherman Oaks, CA 91403
              </p>
              <p>
                <a
                  href="tel:8184014725"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
                  aria-label="Call us at (818) 401-4725"
                >
                  (818) 401-4725
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@gurovichlaw.com"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
                  aria-label="Email us at info@gurovichlaw.com"
                >
                  info@gurovichlaw.com
                </a>
              </p>
              <p>{t("contact.hoursValue")}</p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-white/50">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {/* Payment Icons */}
            <img
              src="/images/payment-icons.webp"
              alt="We accept American Express, MasterCard, Visa, Discover, and Cash"
              className="h-6 w-auto"
            />
            <ScrollToTopLink
              href="/privacy"
              className="font-body text-sm text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
            >
              {t("footer.privacy")}
            </ScrollToTopLink>
            <ScrollToTopLink
              href="/terms"
              className="font-body text-sm text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
            >
              {t("footer.terms")}
            </ScrollToTopLink>
            <ScrollToTopLink
              href="/admin"
              className="font-body text-sm text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
            >
              Admin
            </ScrollToTopLink>
            <ScrollToTopLink
              href="/disclaimer"
              className="font-body text-sm text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary rounded"
            >
              {t("footer.disclaimer")}
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
