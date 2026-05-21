/**
 * Badge Carousel Component
 * Gurovich Law Group
 * 
 * Auto-sliding carousel showcasing credential badges and awards.
 * Shows 7 badges at a time on desktop, auto-slides through all 13.
 * FULL COLOR - no grayscale effects.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const badges = [
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/AIoTL-2025.png", alt: "American Institute of Trial Lawyers - Litigator of the Year 2025" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/badge-2021.png", alt: "National Alliance of Attorneys - Member Attorney of the Year 2021" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/image-5-2.png", alt: "Million Dollar Advocates Forum" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/LACBA.png", alt: "Los Angeles County Bar Association" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/AAA-Top-100.png", alt: "American Academy of Attorneys - Top 100" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/Consumer-Attorneys.png", alt: "Consumer Attorneys Association of Los Angeles - CAALA" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/TOP-LITIGATOR.png", alt: "Litigator Awards - Ranked Top 1% Lawyers" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/Super-Lawyers-2026.png", alt: "Super Lawyers 2026" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/avvo.png", alt: "Avvo Rating" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/AILA-2025-copy.png", alt: "American Institute of Legal Advocates 2025" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/LoD.png", alt: "Lawyers of Distinction" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/NACDA-Badge-2025.png", alt: "National Academy of Criminal Defense Attorneys 2025" },
  { src: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/badges/NAJ-2025copy.png", alt: "National Academy of Jurisprudence 2025" },
];

export default function BadgeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Number of badges visible at different breakpoints
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 7;
    if (window.innerWidth >= 1280) return 7; // xl - desktop
    if (window.innerWidth >= 1024) return 6; // lg
    if (window.innerWidth >= 768) return 5;  // md
    if (window.innerWidth >= 640) return 3;  // sm
    return 2; // mobile
  };
  
  const [visibleCount, setVisibleCount] = useState(7);
  
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = badges.length - visibleCount;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 3 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <section className="py-12 md:py-16 bg-white">
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
      <div 
        className="relative container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Previous badges"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
          aria-label="Next badges"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Badges Track */}
        <div className="overflow-hidden mx-8 md:mx-12">
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {badges.map((badge, index) => (
              <div
                key={badge.alt}
                className="flex-shrink-0 px-3 md:px-4 lg:px-6"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="h-20 md:h-24 lg:h-28 flex items-center justify-center">
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    className="h-full w-auto object-contain max-w-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
