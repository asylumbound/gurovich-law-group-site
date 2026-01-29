/**
 * Contact Modal Component
 * Gurovich Law Group
 * 
 * A popup contact form that appears when "Contact Us" buttons are clicked
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
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

    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about your case";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
    window.location.href = `mailto:info@gurovichlaw.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after closing animation
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl font-bold text-green-800 mb-2">
              Thank You!
            </DialogTitle>
            <DialogDescription className="text-green-700 mb-4">
              Your inquiry has been prepared. Please complete sending the email from your email client.
            </DialogDescription>
            <p className="text-sm text-muted-foreground mb-6">
              If your email client didn't open, please email us directly at{" "}
              <a href="mailto:info@gurovichlaw.com" className="font-semibold text-primary underline">
                info@gurovichlaw.com
              </a>
            </p>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Free Consultation</DialogTitle>
              <DialogDescription>
                Tell us about your case. We'll review your situation and contact you promptly.
              </DialogDescription>
            </DialogHeader>

            {/* Quick Contact Info */}
            <div className="flex flex-wrap gap-4 py-3 border-y border-border">
              <a
                href="tel:8184014725"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                (818) 401-4725
              </a>
              <a
                href="mailto:info@gurovichlaw.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@gurovichlaw.com
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="modal-name" className="text-sm font-medium">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="modal-email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="modal-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="modal-phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="modal-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="modal-message" className="text-sm font-medium">
                  Tell Us About Your Case <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="modal-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your legal situation..."
                  rows={4}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Request Free Consultation"
                  )}
                </Button>
              </motion.div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by Gurovich Law Group. 
                Your information is confidential and protected by attorney-client privilege.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
