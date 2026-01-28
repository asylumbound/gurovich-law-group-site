import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Layer - LA Skyline */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero/her0_element_base.png')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Lady Justice Image - Positioned on Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-0 bottom-0 h-full w-auto pointer-events-none hidden md:block"
      >
        <img
          src="/images/hero/her0_element_lady_justice.png"
          alt="Lady Justice"
          className="h-full w-auto object-contain object-bottom opacity-90"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container h-full min-h-[600px] lg:min-h-[700px] flex flex-col justify-center py-16 lg:py-24">
        <div className="max-w-2xl lg:ml-[15%]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide"
          >
            VIGOROUS ADVOCACY
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-lg md:text-xl lg:text-2xl text-white/90 mt-4 tracking-widest uppercase"
          >
            For Life's Most Serious Legal Challenges
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-16 h-1 bg-primary mt-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base md:text-lg text-white/85 mt-6 leading-relaxed max-w-xl"
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
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <a href="tel:8184014725">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold text-lg px-8 py-6"
              >
                <Phone className="mr-2 h-5 w-5" />
                CALL TODAY: 818.401.4725
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-heading font-semibold text-lg px-8 py-6"
            >
              Free Consultation
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Angles Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <img
          src="/images/hero/her0_element_bottom_angles.png"
          alt=""
          className="w-full h-auto"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
