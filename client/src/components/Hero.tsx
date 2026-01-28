import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Hero Marquee Component
 * 
 * Z-INDEX STACKING ORDER (TOP → BOTTOM):
 * 1. TEXT (z-50) - Headlines, body, CTAs - always topmost and clickable
 * 2. BOTTOM ANGLES (z-40) - White angled divider shape at bottom
 * 3. OPACITY OVERLAY (z-30) - Semi-transparent left overlay for text readability
 * 4. JUSTICE STATUE (z-20) - Lady Justice statue on left side
 * 5. BASE/BACKGROUND (z-10) - LA skyline background
 * 
 * Decorative layers use pointer-events: none to allow CTA clicks
 */

export default function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* LAYER 5 (z-10): Background Base - LA Skyline */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/her0_element_base.png')",
        }}
        aria-hidden="true"
      />

      {/* LAYER 4 (z-20): Justice Statue - Positioned on Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-0 bottom-0 z-20 h-full pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/justice_statue_replacment.png"
          alt=""
          className="h-full w-auto object-contain object-left-bottom max-w-[50vw] md:max-w-[45vw] lg:max-w-[40vw]"
        />
      </motion.div>

      {/* LAYER 3 (z-30): Opacity Overlay - Semi-transparent left region for text readability */}
      {/* Using the provided opacity_half_hero.png which has gray on left, transparent on right */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/opacity_half_hero.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
      </div>

      {/* LAYER 1 (z-50): Text Content - Always Topmost */}
      <div className="relative z-50 container h-full min-h-[600px] lg:min-h-[700px] flex flex-col justify-center py-16 lg:py-24">
        <div className="max-w-2xl ml-4 sm:ml-8 md:ml-12 lg:ml-[10%] xl:ml-[12%]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
          >
            VIGOROUS ADVOCACY
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-sm sm:text-base md:text-lg lg:text-xl text-white mt-3 md:mt-4 tracking-[0.15em] md:tracking-[0.2em] uppercase"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
          >
            For Life's Most Serious Legal Challenges
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 md:w-20 h-1 bg-primary mt-5 md:mt-6 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-sm md:text-base lg:text-lg text-white mt-5 md:mt-6 leading-relaxed max-w-lg lg:max-w-xl"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
          >
            High-stakes matters demand clear strategy and experienced execution.
            The Gurovich Law Group represents clients in personal injury,
            tenants' rights, criminal defense, and civil litigation with
            disciplined case-building and sophisticated advocacy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <a href="tel:8184014725" className="inline-block">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 w-full sm:w-auto shadow-lg"
              >
                <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                CALL TODAY: 818.401.4725
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-heading font-semibold text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-lg"
            >
              Free Consultation
            </Button>
          </motion.div>
        </div>
      </div>

      {/* LAYER 2 (z-40): Bottom Angles Decorative Element */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/her0_element_bottom_angles.png"
          alt=""
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
