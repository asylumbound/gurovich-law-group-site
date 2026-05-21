import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useContactModal } from "@/contexts/ContactModalContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { openContactModal } = useContactModal();
  const { t } = useLanguage();

  const highlights = [
    t("about.experience"),
    t("about.personalized"),
    t("about.aggressive"),
    t("about.noFees"),
    t("about.multilingual"),
    t("about.available"),
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/about-firm-hero-bg.png')" }}
      />
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-secondary/70" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop"
                alt="Law office interior"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-primary text-primary-foreground p-6 rounded-xl shadow-xl hidden md:block"
            >
              <p className="font-display text-4xl font-bold">20+</p>
              <p className="font-heading text-sm uppercase tracking-wider mt-1">
                Years Experience
              </p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-heading text-sm font-semibold text-primary uppercase tracking-widest">
              {t("about.subtitle")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4 leading-tight">
              {t("about.title")}
            </h2>
            <p className="font-body text-lg text-gray-200 mt-6 leading-relaxed">
              {t("about.description")}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-white">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/team">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/80 text-primary-foreground font-heading font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {t("about.meetTeam")}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={openContactModal}
                  className="border-white text-white hover:bg-white/10 font-heading font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t("about.schedule")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
