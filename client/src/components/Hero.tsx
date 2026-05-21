import { Button } from "@/components/ui/button";
import { Phone, FileText } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hero Marquee Component — 2-Column Layout
 * 
 * LAYOUT: CSS Grid with two columns
 * - LEFT column (55%): Contains ALL content - text, buttons, statue, opacity overlay
 * - RIGHT column (45%): Skyline background only (no content)
 * 
 * CRITICAL: All content elements MUST stay within the left column boundary
 * The opacity overlay is constrained to the left 70% of the viewport (extended by 15%)
 * 
 * Z-INDEX STACKING ORDER (TOP → BOTTOM):
 * 1. TEXT (z-30) - Headlines, body, CTAs - always topmost and clickable
 * 2. BOTTOM ANGLES (z-[25]) - White angled divider shape at bottom
 * 3. OPACITY OVERLAY (z-20) - Semi-transparent overlay, LEFT COLUMN ONLY
 * 4. JUSTICE STATUE (z-[15]) - Lady Justice statue, LEFT COLUMN ONLY
 * 5. BASE/BACKGROUND (z-10) - LA skyline background (full width)
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop (≥1024px): 55%/45% split, statue visible
 * - Tablet (768-1023px): 60%/40% split, statue smaller
 * - Mobile (≤767px): Full width left column, statue hidden
 */

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      {/* ============================================
          LAYER 5 (z-10): Background Base - LA Skyline
          Covers entire hero as background (full width)
          ============================================ */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
      >
        <img
          src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/her0_element_base.png"
          alt="Los Angeles skyline at sunset - Gurovich Law Group serves the greater LA area"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ============================================
          LAYER 3 (z-20): Opacity Overlay
          EXTENDED TO 70% WIDTH (was 55%, +15%)
          Uses percentage width to match column split
          ============================================ */}
      <div
        className="absolute top-0 bottom-0 left-0 z-20 pointer-events-none w-full md:w-[85%] lg:w-[80%]"
        aria-hidden="true"
      >
        <img
          src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/opacity_half_hero.png"
          alt="Decorative gradient overlay"
          className="w-full h-full object-cover object-left"
          style={{ opacity: 0.75 }}
        />
      </div>

      {/* ============================================
          LAYER 4 (z-[15]): Justice Statue
          CONSTRAINED TO LEFT COLUMN ONLY
          Positioned at bottom-left, responsive sizing
          Hidden on mobile to prevent overflow
          ============================================ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-0 bottom-0 z-[15] pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{ 
          /* Constrain to left column width */
          width: 'min(55%, 600px)',
          height: '100%',
        }}
      >
        <img
          src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/justice-statue-replacement-2.png"
          alt="Lady Justice statue symbolizing fair legal representation"
          className="absolute bottom-0 left-0 object-contain object-left-bottom h-full w-auto max-w-none"
          style={{
            /* Scale statue to fit within column */
            maxHeight: '95%',
          }}
        />
      </motion.div>

      {/* ============================================
          LAYER 1 (z-30): Text Content
          CONSTRAINED TO LEFT COLUMN ONLY
          Uses grid to ensure content stays in bounds
          ============================================ */}
      <div className="relative z-30 h-full min-h-[70vh] lg:min-h-[80vh]">
        {/* Grid Container: Defines column boundaries */}
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] lg:grid-cols-[55%_45%] h-full">
          
          {/* LEFT COLUMN: All text + CTAs - content MUST NOT exceed this column */}
          <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16 lg:py-20">
            <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-wide"
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                {t("hero.title")}
              </motion.h1>

              {/* Subheadline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg text-white mt-2 md:mt-3 tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.15em] uppercase"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
              >
                {t("hero.subtitle")}
              </motion.h2>

              {/* Divider Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-14 md:w-16 lg:w-20 h-1 bg-primary mt-4 md:mt-5 origin-left"
              />

              {/* Body Text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-body text-sm md:text-sm lg:text-base xl:text-lg text-white/95 mt-4 md:mt-5 leading-relaxed"
                style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
              >
                {t("hero.description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-5 md:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3"
              >
                {/* Call Button */}
                <motion.a 
                  href="tel:8184014725" 
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/80 text-primary-foreground font-heading font-semibold text-sm md:text-base px-4 sm:px-5 md:px-6 py-4 md:py-5 shadow-lg hover:shadow-xl whitespace-nowrap transition-all duration-200"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {t("hero.callToday")} 818.401.4725
                  </Button>
                </motion.a>

                {/* Start Your Case Button */}
                <Link href="/onboarding">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-gray-100 text-secondary border-white font-heading font-semibold text-sm md:text-base px-4 sm:px-5 md:px-6 py-4 md:py-5 shadow-lg hover:shadow-xl whitespace-nowrap transition-all duration-200"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Start Your Case
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Empty - skyline shows through */}
          <div className="hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* ============================================
          LAYER 2 (z-[25]): Bottom Angles
          White angled divider at bottom (full width)
          ============================================ */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-[25] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/her0_element_bottom_angles.png"
          alt="Decorative section divider"
          className="w-full h-auto block"
          style={{ marginBottom: '-1px' }}
        />
      </div>
    </section>
  );
}
