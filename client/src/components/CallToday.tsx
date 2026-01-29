import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function CallToday() {
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: "#1A222B" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          {/* Red bracket frame */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top left bracket */}
            <div 
              className="absolute top-0 left-0 w-16 md:w-24 h-full"
              style={{ borderLeft: "3px solid #C41E3A", borderTop: "3px solid #C41E3A" }}
            />
            {/* Top right bracket */}
            <div 
              className="absolute top-0 right-0 w-16 md:w-24 h-full"
              style={{ borderRight: "3px solid #C41E3A", borderTop: "3px solid #C41E3A" }}
            />
            {/* Bottom left bracket */}
            <div 
              className="absolute bottom-0 left-0 w-16 md:w-24 h-16"
              style={{ borderLeft: "3px solid #C41E3A", borderBottom: "3px solid #C41E3A" }}
            />
            {/* Bottom right bracket */}
            <div 
              className="absolute bottom-0 right-0 w-16 md:w-24 h-16"
              style={{ borderRight: "3px solid #C41E3A", borderBottom: "3px solid #C41E3A" }}
            />
          </div>

          {/* Content */}
          <div className="py-12 px-8 md:px-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-4">
              Call Today
            </h2>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide mb-8">
              We Want To Help You
            </p>
            
            {/* Call button */}
            <motion.a
              href="tel:8184014725"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-sm shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Phone className="w-6 h-6" style={{ color: "#1A222B" }} />
              <span 
                className="font-display text-xl md:text-2xl font-bold tracking-wide"
                style={{ color: "#1A222B" }}
              >
                818-401-4725
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
