import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useContactModal } from "@/contexts/ContactModalContext";

const highlights = [
  "Over 20 years of combined legal experience",
  "Personalized attention to every case",
  "Aggressive representation in and out of court",
  "No fees unless we win your case",
  "Multilingual staff (English, Spanish, Russian)",
  "Available 24/7 for emergencies",
];

export default function About() {
  const { openContactModal } = useContactModal();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
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
              About Our Firm
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 leading-tight">
              Dedicated Legal Advocates Fighting for You
            </h2>
            <p className="font-body text-lg text-muted-foreground mt-6 leading-relaxed">
              At Gurovich Law Group, we understand that legal challenges can be
              overwhelming. Our team of experienced attorneys is committed to
              providing compassionate yet aggressive representation to protect
              your rights and secure the best possible outcome for your case.
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
                  <span className="font-body text-sm text-foreground">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/team">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold"
                >
                  Meet Our Team
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={openContactModal}
                className="border-primary text-primary hover:bg-primary/5 font-heading font-semibold"
              >
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
