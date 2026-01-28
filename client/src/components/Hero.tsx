import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Hero Marquee Component — 2-Column Layout
 * 
 * LAYOUT: CSS Grid with two columns
 * - LEFT column: All text + CTAs (headline, subhead, body, divider, buttons)
 * - RIGHT column: Skyline/background visual
 * 
 * Z-INDEX STACKING ORDER (TOP → BOTTOM):
 * 1. TEXT (z-50) - Headlines, body, CTAs - always topmost and clickable
 * 2. BOTTOM ANGLES (z-40) - White angled divider shape at bottom
 * 3. OPACITY OVERLAY (z-30) - Semi-transparent overlay for text readability
 * 4. JUSTICE STATUE (z-20) - Lady Justice statue, large and prominent
 * 5. BASE/BACKGROUND (z-10) - LA skyline background
 * 
 * RESPONSIVE BREAKPOINTS:
 * - ≥1024px: Two-column layout
 * - 768-1023px: Two-column with reduced type, rebalanced widths
 * - ≤767px: Stacked layout, text first, CTAs full-width
 */

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      {/* ============================================
          LAYER 5 (z-10): Background Base - LA Skyline
          Covers entire hero as background
          ============================================ */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
      >
        <img
          src="/images/her0_element_base.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ============================================
          LAYER 4 (z-20): Justice Statue
          Large, prominent, anchored bottom-left
          Partially bleeding off left edge matches mock
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-0 bottom-0 z-20 pointer-events-none"
        aria-hidden="true"
        style={{ 
          height: '110%',
          maxHeight: '115%',
        }}
      >
        <img
          src="/images/justice_statue_replacment.png"
          alt=""
          className="h-full w-auto object-contain object-left-bottom"
          style={{
            maxWidth: '60vw',
            minWidth: '400px',
          }}
        />
      </motion.div>

      {/* ============================================
          LAYER 3 (z-30): Opacity Overlay
          Semi-transparent left region for text readability
          Covers left ~50%, above statue, below text
          ============================================ */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/opacity_half_hero.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* ============================================
          LAYER 1 (z-50): Text Content - 2-Column Grid
          LEFT: All text and CTAs
          RIGHT: Visual space for skyline
          ============================================ */}
      <div className="relative z-50 h-full min-h-[70vh] lg:min-h-[80vh]">
        {/* Grid Container: 2 columns on desktop/tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[55%_45%] h-full">
          
          {/* LEFT COLUMN: Text + CTAs */}
          <div className="flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 lg:py-20">
            <div className="max-w-xl">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-wide"
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}
              >
                VIGOROUS ADVOCACY
              </motion.h1>

              {/* Subheadline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-xs sm:text-sm md:text-base lg:text-lg text-white mt-3 md:mt-4 tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}
              >
                For Life's Most Serious Legal Challenges
              </motion.h2>

              {/* Divider Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 md:w-20 h-1 bg-primary mt-5 md:mt-6 origin-left"
              />

              {/* Body Text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-body text-sm md:text-base lg:text-lg text-white/95 mt-5 md:mt-6 leading-relaxed"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}
              >
                High-stakes matters demand clear strategy and experienced execution.
                The Gurovich Law Group represents clients in personal injury,
                tenants' rights, criminal defense, and civil litigation with
                disciplined case-building and sophisticated advocacy.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                {/* Call Button */}
                <a href="tel:8184014725" className="block sm:inline-block">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-lg"
                  >
                    <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    CALL TODAY: 818.401.4725
                  </Button>
                </a>
                
                {/* Free Consultation Button */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-heading font-semibold text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 shadow-lg"
                >
                  Free Consultation
                </Button>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual space (skyline shows through) */}
          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* ============================================
          LAYER 2 (z-40): Bottom Angles
          White angled divider at bottom
          Full width, no clipping/warping on resize
          ============================================ */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/images/her0_element_bottom_angles.png"
          alt=""
          className="w-full h-auto block"
          style={{ marginBottom: '-1px' }} /* Prevent subpixel gap */
        />
      </div>
    </section>
  );
}
