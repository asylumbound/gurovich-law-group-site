import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

const practiceAreas = [
  {
    icon: "/images/personal-injury-LOGO.png",
    title: "Personal Injury",
    description:
      "Aggressive representation for accident victims. We fight for maximum compensation for your injuries and losses.",
    href: "/practice-areas/personal-injury",
  },
  {
    icon: "/images/criminal-defense.png",
    title: "Criminal Defense",
    description:
      "Protecting your rights and freedom. Experienced defense for all criminal charges from misdemeanors to felonies.",
    href: "/practice-areas/criminal-defense",
  },
  {
    icon: "/images/tenants-rights.png",
    title: "Employment Law",
    description:
      "Standing up for workers' rights. We handle discrimination, harassment, wrongful termination, and wage disputes.",
    href: "/practice-areas/employment-law",
  },
  {
    icon: "/images/civillitigation.png",
    title: "Civil Litigation",
    description:
      "Resolving complex disputes. From landlord-tenant issues to business conflicts, we advocate for your interests.",
    href: "/practice-areas/civil-litigation",
  },
];

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
            Our Expertise
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            Practice Areas
          </h2>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            With decades of combined experience, our attorneys provide skilled
            representation across a wide range of legal matters.
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
                  <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    <img
                      src={area.icon}
                      alt={`${area.title} icon`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {area.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed flex-grow">
                    {area.description}
                  </p>
                  <div className="mt-6 flex items-center text-primary font-heading text-sm font-semibold group-hover:gap-2 transition-all">
                    Learn More
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
