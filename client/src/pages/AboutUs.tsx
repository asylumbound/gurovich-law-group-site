import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Scale, Heart, Shield, Users, Award, Clock, Globe } from "lucide-react";
import { useContactModal } from "@/contexts/ContactModalContext";



/**
 * About Us Page - Gurovich Law Group
 * 
 * DESIGN: Consistent with site styling (dark secondary backgrounds, primary accents)
 * LAYOUT: Multiple sections with alternating backgrounds for visual interest
 * RESPONSIVE: Mobile-first design with breakpoints at sm, md, lg, xl
 */

const coreValues = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We uphold the highest ethical standards in every case, ensuring transparent communication and honest counsel throughout your legal journey."
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "We understand that legal challenges are deeply personal. Our team provides empathetic support while fighting vigorously for your rights."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "With decades of combined experience, we pursue excellence in every aspect of our practice, from research to courtroom advocacy."
  },
  {
    icon: Users,
    title: "Client Focus",
    description: "Your goals are our priority. We provide personalized attention and tailor our strategies to achieve the best possible outcomes for you."
  }
];

const firmStats = [
  { value: "20+", label: "Years Combined Experience" },
  { value: "1000+", label: "Cases Handled" },
  { value: "5", label: "Languages Spoken" },
  { value: "24/7", label: "Emergency Availability" }
];

export default function AboutUs() {
  const { openContactModal } = useContactModal();

  return (
    <>
        {/* Hero Section */}
        <section className="relative bg-secondary py-20 md:py-28 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/about-firm-hero-bg.webp" 
              alt="Gurovich Law Group office building in Sherman Oaks California" 
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-secondary/80" />
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
                About Our Firm
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 leading-tight">
                Serving You with Compassion and Expertise
              </h1>
              <p className="text-gray-300 mt-6 text-lg md:text-xl font-body leading-relaxed max-w-2xl">
                At Gurovich Law Group, we pride ourselves on our years of experience in criminal defense, personal injury, and employment law. Our team is dedicated to providing personalized attention while navigating the legal system.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    onClick={openContactModal}
                    className="bg-primary hover:bg-primary/80 text-primary-foreground font-heading font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get In Touch
                  </Button>
                </motion.div>
                <motion.a 
                  href="tel:8184014725"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-heading font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Phone className="mr-2 h-5 w-5" />
                    (818) 401-4725
                  </Button>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Journey Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
                  Our Story
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3">
                  A Legacy of Trust and Dedication
                </h2>
                <div className="w-16 h-1 bg-primary mt-4 mb-6" />
                <div className="space-y-4 text-muted-foreground font-body text-base md:text-lg leading-relaxed">
                  <p>
                    Gurovich Law Group has grown from humble beginnings into a respected name in legal services. Our firm was founded on the principle of providing compassionate support and expert legal guidance to those who need it most.
                  </p>
                  <p>
                    Through years of dedication in criminal defense, personal injury, and employment law, we have built a reputation that speaks volumes about our commitment to our clients. Every case we take on receives the same level of attention and dedication.
                  </p>
                  <p>
                    Our multilingual team ensures that we not only understand the legal needs of our clients but also their personal stories. We believe that effective legal representation starts with truly understanding the people we serve.
                  </p>
                </div>
              </motion.div>

              {/* Image/Visual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/aboutus-courtroom.png" 
                    alt="Attorney presenting case in courtroom before judge" 
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Stats overlay */}
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-heading font-bold">20+</div>
                  <div className="text-sm font-body">Years Experience</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {firmStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-body mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
            >
              <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
                What We Stand For
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3">
                Our Core Principles
              </h2>
              <div className="w-16 h-1 bg-primary mt-4 mx-auto" />
              <p className="text-muted-foreground font-body text-base md:text-lg mt-6">
                At Gurovich Law Group, our commitment to integrity, client satisfaction, and justice forms the foundation of our practice.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className="space-y-6">
                  {[
                    { icon: Clock, title: "Available 24/7", desc: "Emergency legal assistance whenever you need it" },
                    { icon: Globe, title: "Multilingual Team", desc: "We speak English, Spanish, Russian, Armenian, and Ukrainian" },
                    { icon: Users, title: "Personalized Attention", desc: "Every case receives dedicated focus and care" },
                    { icon: Award, title: "Proven Track Record", desc: "Successful outcomes across thousands of cases" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 font-body text-sm mt-1">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
                  Why Choose Us
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-3">
                  Dedicated Legal Advocates Fighting for You
                </h2>
                <div className="w-16 h-1 bg-primary mt-4 mb-6" />
                <p className="text-gray-300 font-body text-base md:text-lg leading-relaxed">
                  At Gurovich Law Group, we understand that legal challenges can be overwhelming. Our team of experienced attorneys is committed to providing compassionate yet aggressive representation to protect your rights and secure the best possible outcome for your case.
                </p>
                <p className="text-gray-300 font-body text-base md:text-lg leading-relaxed mt-4">
                  We believe these principles are essential to fostering trust with our clients. Every legal challenge we encounter is approached with dedication and a focus on achieving the best outcomes possible.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">
                Schedule Your Consultation Today
              </h2>
              <p className="text-primary-foreground/90 font-body text-base md:text-lg mt-4 leading-relaxed">
                If you are facing legal issues or need guidance, we're here to help. Our experienced team combines deep legal knowledge with a personal touch. Let's discuss your situation and find the best path forward together.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    onClick={openContactModal}
                    className="font-heading font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Contact Us
                  </Button>
                </motion.div>
                <motion.a 
                  href="tel:8184014725"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-heading font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200">
                    <Phone className="mr-2 h-5 w-5" />
                    (818) 401-4725
                  </Button>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
    </>
  );
}
