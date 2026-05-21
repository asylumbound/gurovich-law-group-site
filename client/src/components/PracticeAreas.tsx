import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function PracticeAreas() {
  const { t } = useLanguage();

  const practiceAreas = [
    {
      icon: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/personal-injury-LOGO.png",
      title: t("practice.personalInjury"),
      description: t("practice.personalInjuryDesc"),
      href: "/practice-areas/personal-injury",
    },
    {
      icon: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/criminal-defense.png",
      title: t("practice.criminalDefense"),
      description: t("practice.criminalDefenseDesc"),
      href: "/practice-areas/criminal-defense",
    },
    {
      icon: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/tenants-rights.png",
      title: t("practice.employmentLaw"),
      description: t("practice.employmentLawDesc"),
      href: "/practice-areas/employment-law",
    },
    {
      icon: "https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/civillitigation.png",
      title: t("practice.civilLitigation"),
      description: t("practice.civilLitigationDesc"),
      href: "/practice-areas/civil-litigation",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-sm font-semibold text-primary uppercase tracking-widest">
            {t("practice.subtitle")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            {t("practice.title")}
          </h2>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t("practice.description")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {practiceAreas.map((area) => (
            <motion.div key={area.title} variants={itemVariants}>
              <Link href={area.href}>
                <div className="group bg-card rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/20 h-full flex flex-col">
                  {/* Title row with icon on the left */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={area.icon}
                        alt={`${area.title} icon`}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {area.title}
                    </h3>
                  </div>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed flex-grow">
                    {area.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-heading text-sm font-semibold group-hover:gap-2 transition-all">
                    {t("practice.learnMore")}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
