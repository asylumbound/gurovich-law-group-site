import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary py-16">
        <div className="container">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-white/70 mt-4">Last Updated: January 28, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose prose-lg prose-slate">
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Gurovich Law Group, APC ("we," "our," or "us") respects your privacy and is committed 
              to protecting your personal information. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our 
              legal services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect information about you in various ways, including:
            </p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
              Personal Information
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you contact us through our website, request a consultation, or engage our services, 
              we may collect personal information such as your name, email address, phone number, 
              mailing address, and details about your legal matter.
            </p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
              Automatically Collected Information
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When you visit our website, we may automatically collect certain information about your 
              device, including your IP address, browser type, operating system, access times, and 
              pages viewed. We may also collect information about your browsing behavior on our site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>To provide and maintain our legal services</li>
              <li>To respond to your inquiries and consultation requests</li>
              <li>To communicate with you about your case or our services</li>
              <li>To improve our website and user experience</li>
              <li>To comply with legal obligations and protect our rights</li>
              <li>To send you relevant updates about legal developments (with your consent)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Information Sharing and Disclosure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With your consent or at your direction</li>
              <li>With service providers who assist us in operating our website and services</li>
              <li>To comply with legal obligations, court orders, or legal processes</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar tracking technologies to collect information about your 
              browsing activities. Cookies are small data files stored on your device that help us 
              improve our website and your experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may 
              limit your ability to use certain features of our website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the Internet or electronic storage is 100% secure, 
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Your Rights and Choices
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information, 
              including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to opt-out of certain data processing</li>
              <li>The right to data portability</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website is not intended for children under 18 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please 
              contact us at:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="font-semibold text-foreground">Gurovich Law Group, APC</p>
              <p className="text-muted-foreground">15233 Ventura Blvd, Suite 500</p>
              <p className="text-muted-foreground">Sherman Oaks, CA 91403</p>
              <p className="text-muted-foreground mt-2">
                Phone: <a href="tel:8184014725" className="text-primary hover:underline">(818) 401-4725</a>
              </p>
              <p className="text-muted-foreground">
                Email: <a href="mailto:kg@gurovichlaw.com" className="text-primary hover:underline">kg@gurovichlaw.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
