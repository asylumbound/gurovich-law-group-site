/**
 * Contact Page
 * Gurovich Law Group
 * 
 * Features: Contact form with validation, Google Map, contact info
 * Form sends to: info@gurovichlaw.com
 */

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone) || formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Please provide more details about your legal matter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || "Website Contact Form Submission");
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Subject: ${formData.subject || "General Inquiry"}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSubmitted from Gurovich Law Group website contact form`
    );

    // Open mailto link
    window.location.href = `mailto:info@gurovichlaw.com?subject=${subject}&body=${body}`;

    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Email client opened",
        description: "Please send the email from your email client to complete your submission.",
      });
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contact-hero-bg.jpg"
            alt="Modern law office interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
        </div>
        <div className="container max-w-6xl relative z-10">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            Ready to discuss your legal matter? Contact us today for a free, confidential consultation. 
            Our experienced attorneys are here to help you navigate your legal challenges.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-slate-50">
        <div className="container max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="tel:818-401-4725" className="group">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                <p className="text-primary font-medium">(818) 401-4725</p>
              </div>
            </a>
            
            <a href="mailto:info@gurovichlaw.com" className="group">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <p className="text-primary font-medium">info@gurovichlaw.com</p>
              </div>
            </a>
            
            <a href="https://maps.google.com/?q=15250+Ventura+Blvd+Suite+700+Sherman+Oaks+CA+91403" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">Address</h3>
                <p className="text-slate-600 text-sm">15250 Ventura Blvd. Suite 700<br />Sherman Oaks, CA 91403</p>
              </div>
            </a>
            
            <div className="bg-white rounded-xl p-6 shadow-md h-full">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Office Hours</h3>
              <p className="text-slate-600 text-sm">Mon-Fri: 9:00 AM - 5:00 PM<br />24/7 Emergency Line</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-slate-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email Client</h3>
                  <p className="text-slate-600 mb-6">
                    Your email client should have opened with your message. Please send the email to complete your submission.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-700 font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`mt-2 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700 font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`mt-2 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-slate-700 font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(818) 555-1234"
                        className={`mt-2 ${errors.phone ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-slate-700 font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g., Personal Injury Case"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-700 font-medium">
                      How Can We Help? <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your legal matter..."
                      rows={6}
                      className={`mt-2 ${errors.message ? "border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Opening Email Client...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-slate-500 text-center">
                    By submitting this form, you agree to our privacy policy. 
                    All consultations are confidential.
                  </p>
                </form>
              )}
            </div>

            {/* Map and Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Visit Our Office
              </h2>
              <p className="text-slate-600 mb-8">
                Located in Sherman Oaks, we serve clients throughout the Los Angeles area.
              </p>

              {/* Google Map Embed */}
              <div className="rounded-xl overflow-hidden shadow-lg mb-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.8876!2d-118.4485!3d34.1517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c296d3c4d3c3c3%3A0x0!2s15250%20Ventura%20Blvd%20Suite%20700%2C%20Sherman%20Oaks%2C%20CA%2091403!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gurovich Law Group Office Location"
                />
              </div>

              {/* Quick Contact Options */}
              <div className="bg-slate-800 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Quick Contact Options
                </h3>
                <p className="text-slate-300 text-sm mb-6">
                  Need immediate assistance? Use one of these quick contact methods:
                </p>
                <div className="space-y-3">
                  <a href="tel:818-401-4725" className="block">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900 justify-start">
                      <Phone className="w-5 h-5 mr-3" />
                      Call: (818) 401-4725
                    </Button>
                  </a>
                  <a href="sms:818-401-4725" className="block">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900 justify-start">
                      <MessageSquare className="w-5 h-5 mr-3" />
                      Text: (818) 401-4725
                    </Button>
                  </a>
                  <a href="mailto:info@gurovichlaw.com" className="block">
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900 justify-start">
                      <Mail className="w-5 h-5 mr-3" />
                      Email: info@gurovichlaw.com
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="container max-w-4xl">
          <p className="text-sm text-slate-500 text-center">
            <strong>Disclaimer:</strong> Contacting our firm does not create an attorney-client relationship. 
            Please do not send confidential information until an attorney-client relationship has been established. 
            Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </section>
    </main>
  );
}
