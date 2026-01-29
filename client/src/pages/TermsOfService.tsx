import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-white/70 mt-4">Last Updated: January 28, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose prose-lg prose-slate">
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Gurovich Law Group, APC website ("Website"), you accept and 
              agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree 
              to these terms, please do not use our Website. We reserve the right to modify these 
              terms at any time, and your continued use of the Website constitutes acceptance of any 
              modifications.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Use of Website
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This Website is provided for informational purposes only and does not constitute legal 
              advice. The information on this Website is not intended to create, and receipt or viewing 
              does not constitute, an attorney-client relationship.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use this Website only for lawful purposes and in a manner that does not 
              infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              No Attorney-Client Relationship
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The use of this Website, including the submission of any contact form or inquiry, does 
              not create an attorney-client relationship between you and Gurovich Law Group, APC. An 
              attorney-client relationship is only formed when:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>We have expressly agreed to represent you</li>
              <li>A written engagement agreement has been signed by both parties</li>
              <li>We have conducted a conflict check and confirmed we can represent you</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Until such time, any information you provide to us is not protected by attorney-client 
              privilege.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on this Website, including but not limited to text, graphics, logos, images, 
              audio clips, digital downloads, and software, is the property of Gurovich Law Group, APC 
              or its content suppliers and is protected by United States and international copyright laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              publicly perform, republish, download, store, or transmit any of the material on our 
              Website without our prior written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              User Conduct
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When using our Website, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable federal, state, local, or international law or regulation</li>
              <li>Send or facilitate the sending of any advertising or promotional material without our consent</li>
              <li>Impersonate or attempt to impersonate the firm, an employee, or any other person</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the Website</li>
              <li>Introduce any viruses, malware, or other harmful material</li>
              <li>Attempt to gain unauthorized access to any portion of the Website</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              THE WEBSITE AND ITS CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT 
              ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. GUROVICH LAW GROUP, APC DISCLAIMS 
              ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Implied warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the Website will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of any content</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE FULLEST EXTENT PERMITTED BY LAW, GUROVICH LAW GROUP, APC SHALL NOT BE LIABLE FOR 
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
              LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR 
              ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE WEBSITE OR ANY CONTENT ON THE 
              WEBSITE.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Indemnification
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to defend, indemnify, and hold harmless Gurovich Law Group, APC, its officers, 
              directors, employees, and agents from and against any claims, liabilities, damages, 
              judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) 
              arising out of or relating to your violation of these Terms of Service or your use of the 
              Website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service and any dispute or claim arising out of or in connection with them 
              shall be governed by and construed in accordance with the laws of the State of California, 
              without regard to its conflict of law provisions. Any legal action or proceeding arising 
              under these Terms shall be brought exclusively in the federal or state courts located in 
              Los Angeles County, California.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms of Service at any time at our sole 
              discretion. If we make material changes, we will provide notice by posting the updated 
              terms on this page and updating the "Last Updated" date. Your continued use of the Website 
              after any changes constitutes acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
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
