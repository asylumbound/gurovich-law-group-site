/**
 * Client Intake Form Component
 * Gurovich Law Group
 * 
 * Reusable intake form for service sub-pages to capture leads
 * related to specific legal issues
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Phone, Mail, AlertCircle } from "lucide-react";

interface ClientIntakeFormProps {
  practiceArea: string;
  serviceType: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "either";
  caseDescription: string;
  urgency: "immediate" | "this_week" | "flexible";
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  caseDescription?: string;
}

export default function ClientIntakeForm({ practiceArea, serviceType }: ClientIntakeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "either",
    caseDescription: "",
    urgency: "flexible",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\(\)\+]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.caseDescription.trim()) {
      newErrors.caseDescription = "Please describe your situation";
    } else if (formData.caseDescription.trim().length < 20) {
      newErrors.caseDescription = "Please provide more details (at least 20 characters)";
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
    const subject = encodeURIComponent(`New ${serviceType} Inquiry - ${practiceArea}`);
    const body = encodeURIComponent(
      `New Client Intake Form Submission\n\n` +
      `Practice Area: ${practiceArea}\n` +
      `Service Type: ${serviceType}\n\n` +
      `Contact Information:\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Preferred Contact: ${formData.preferredContact}\n` +
      `Urgency: ${formData.urgency}\n\n` +
      `Case Description:\n${formData.caseDescription}\n\n` +
      `---\nSubmitted from: ${window.location.href}`
    );

    // Simulate form processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Open mailto link
    window.location.href = `mailto:kg@gurovichlaw.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">
          Your inquiry has been prepared. Please complete sending the email from your email client.
        </p>
        <p className="text-sm text-green-600">
          If your email client didn't open, please email us directly at{" "}
          <a href="mailto:kg@gurovichlaw.com" className="font-semibold underline">
            kg@gurovichlaw.com
          </a>
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              preferredContact: "either",
              caseDescription: "",
              urgency: "flexible",
            });
          }}
          variant="outline"
          className="mt-6"
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Form Header */}
      <div className="bg-slate-800 text-white p-6">
        <h3 className="text-xl font-bold mb-2">Free Case Evaluation</h3>
        <p className="text-slate-300 text-sm">
          Tell us about your {serviceType.toLowerCase()} case. We'll review your situation and contact you promptly.
        </p>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-slate-700 font-medium">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-slate-700 font-medium">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="text-slate-700 font-medium">
              Phone <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Preferred Contact & Urgency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preferredContact" className="text-slate-700 font-medium">
              Preferred Contact Method
            </Label>
            <select
              id="preferredContact"
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="either">Either Email or Phone</option>
              <option value="email">Email Only</option>
              <option value="phone">Phone Only</option>
            </select>
          </div>
          <div>
            <Label htmlFor="urgency" className="text-slate-700 font-medium">
              How Soon Do You Need Help?
            </Label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="immediate">Immediately / Emergency</option>
              <option value="this_week">Within This Week</option>
              <option value="flexible">Flexible / Just Exploring Options</option>
            </select>
          </div>
        </div>

        {/* Case Description */}
        <div>
          <Label htmlFor="caseDescription" className="text-slate-700 font-medium">
            Describe Your Situation <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="caseDescription"
            name="caseDescription"
            value={formData.caseDescription}
            onChange={handleInputChange}
            placeholder={`Please describe your ${serviceType.toLowerCase()} situation. Include relevant dates, parties involved, and any other important details...`}
            rows={4}
            className={errors.caseDescription ? "border-red-500" : ""}
          />
          {errors.caseDescription && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.caseDescription}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Preparing Your Inquiry...
            </>
          ) : (
            "Request Free Consultation"
          )}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to be contacted by Gurovich Law Group regarding your inquiry. 
          Your information is confidential and protected by attorney-client privilege.
        </p>
      </form>
    </div>
  );
}
