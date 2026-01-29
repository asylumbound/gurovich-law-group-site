/**
 * Badge Carousel Component
 * Gurovich Law Group
 * 
 * Auto-sliding infinite carousel showcasing credential badges and awards.
 * Uses CSS animation for smooth, continuous scrolling effect.
 */

import { motion } from "framer-motion";

const badges = [
  { src: "/images/badges/AIoTL-2025.png", alt: "American Institute of Trial Lawyers - Litigator of the Year 2025" },
  { src: "/images/badges/badge-2021.png", alt: "National Alliance of Attorneys - Member Attorney of the Year 2021" },
  { src: "/images/badges/image-5-2.png", alt: "Million Dollar Advocates Forum" },
  { src: "/images/badges/LACBA.png", alt: "Los Angeles County Bar Association" },
  { src: "/images/badges/AAA-Top-100.png", alt: "American Academy of Attorneys - Top 100" },
  { src: "/images/badges/Consumer-Attorneys.png", alt: "Consumer Attorneys Association of Los Angeles - CAALA" },
  { src: "/images/badges/TOP-LITIGATOR.png", alt: "Litigator Awards - Ranked Top 1% Lawyers" },
  { src: "/images/badges/Super-Lawyers-2026.png", alt: "Super Lawyers 2026" },
  { src: "/images/badges/avvo.png", alt: "Avvo Rating" },
  { src: "/images/badges/AILA-2025-copy.png", alt: "American Institute of Legal Advocates 2025" },
  { src: "/images/badges/LoD.png", alt: "Lawyers of Distinction" },
  { src: "/images/badges/NACDA-Badge-2025.png", alt: "National Academy of Criminal Defense Attorneys 2025" },
  { src: "/images/badges/NAJ-2025copy.png", alt: "National Academy of Jurisprudence 2025" },
];

export default function BadgeCarousel() {
  // Duplicate badges for seamless infinite scroll
  const duplicatedBadges = [...badges, ...badges];

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="font-heading text-sm font-semibold text-primary uppercase tracking-widest">
            Recognition & Awards
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-3">
            Trusted by Clients, Recognized by Peers
          </h2>
        </motion.div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling track */}
        <div className="flex animate-scroll">
          {duplicatedBadges.map((badge, index) => (
            <div
              key={`${badge.alt}-${index}`}
              className="flex-shrink-0 px-4 md:px-6 lg:px-8"
            >
              <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center">
                <img
                  src={badge.src}
                  alt={badge.alt}
                  className="h-full w-auto object-contain max-w-[120px] md:max-w-[140px] lg:max-w-[160px] grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: fit-content;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
