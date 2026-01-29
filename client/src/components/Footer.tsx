import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const practiceAreas = [
  { label: "Personal Injury", href: "/practice-areas/personal-injury" },
  { label: "Criminal Defense", href: "/practice-areas/criminal-defense" },
  { label: "Employment Law", href: "/practice-areas/employment-law" },
  { label: "Civil Litigation", href: "/practice-areas/civil-litigation" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Team", href: "/our-team" },
  { label: "Testimonials", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand with Full Logo */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <img
                src="/images/footerlogo.png"
                alt="Gurovich Law Group"
                className="h-20 w-auto"
              />
            </Link>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Gurovich Law Group provides vigorous advocacy for clients facing
              life's most serious legal challenges. We fight for your rights.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              Practice Areas
            </h4>
            <ul className="space-y-3">
              {practiceAreas.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-6">
              Contact Us
            </h4>
            <div className="space-y-4 font-body text-sm text-white/70">
              <p>
                15233 Ventura Blvd, Suite 500
                <br />
                Sherman Oaks, CA 91403
              </p>
              <p>
                <a
                  href="tel:8184014725"
                  className="hover:text-primary transition-colors"
                >
                  (818) 401-4725
                </a>
              </p>
              <p>
                <a
                  href="mailto:kg@gurovichlaw.com"
                  className="hover:text-primary transition-colors"
                >
                  kg@gurovichlaw.com
                </a>
              </p>
              <p>Mon-Fri: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-white/50">
            © {new Date().getFullYear()} Gurovich Law Group, APC. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-body text-sm text-white/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-body text-sm text-white/50 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/disclaimer"
              className="font-body text-sm text-white/50 hover:text-white transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
