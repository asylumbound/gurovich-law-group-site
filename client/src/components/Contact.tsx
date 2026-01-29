import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "(818) 401-4725",
    href: "tel:8184014725",
  },
  {
    icon: Mail,
    label: "Email",
    value: "kg@gurovichlaw.com",
    href: "mailto:kg@gurovichlaw.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "15233 Ventura Blvd, Suite 500, Sherman Oaks, CA 91403",
    href: "https://maps.google.com/?q=15233+Ventura+Blvd+Sherman+Oaks+CA",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 9:00 AM - 5:00 PM",
    href: null,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);

    // Construct mailto link with form data
    const subject = encodeURIComponent("New Contact Form Inquiry - Gurovich Law Group");
    const body = encodeURIComponent(
      `New Contact Form Submission\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || "Not provided"}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSubmitted from: ${window.location.href}`
    );

    // Simulate form processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Open mailto link
    window.location.href = `mailto:kg@gurovichlaw.com?subject=${subject}&body=${body}`;

    toast.success("Your inquiry has been prepared. Please complete sending the email from your email client.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-sm font-semibold text-primary uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4">
            Free Case Consultation
          </h2>
          <p className="font-body text-lg text-white/70 mt-4 max-w-2xl mx-auto">
            Ready to discuss your case? Contact us today for a free, confidential
            consultation. We're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-xl p-8 shadow-xl"
            >
              <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                Send Us a Message
              </h3>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-background"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tell us about your case *"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    className="bg-background resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4 text-center">
                By submitting this form, you agree to our privacy policy.
                Attorney-client privilege applies to all communications.
              </p>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-white/60 uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-body text-lg text-white hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-body text-lg text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="font-heading text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Emergency?
              </p>
              <p className="font-body text-white/80">
                If you've been arrested or need immediate legal assistance,
                call us 24/7 at{" "}
                <a
                  href="tel:8184014725"
                  className="text-primary font-semibold hover:underline"
                >
                  (818) 401-4725
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
