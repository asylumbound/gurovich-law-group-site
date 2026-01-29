import { Link } from "wouter";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function Disclaimer() {
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
            Legal Disclaimer
          </h1>
          <p className="text-white/70 mt-4">Last Updated: January 28, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose prose-lg prose-slate">
          {/* Important Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-10 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground mb-2">Important Notice</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The information provided on this website is for general informational purposes only 
                and should not be construed as legal advice. Please read this disclaimer carefully 
                before using our website.
              </p>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Legal Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The information contained on this website is provided by Gurovich Law Group, APC for 
              general informational purposes only. While we strive to keep the information up to date 
              and correct, we make no representations or warranties of any kind, express or implied, 
              about the completeness, accuracy, reliability, suitability, or availability of the 
              information, products, services, or related graphics contained on the website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              No Attorney-Client Relationship
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Viewing this website, using any information provided herein, or communicating with 
              Gurovich Law Group, APC through this website does not create an attorney-client 
              relationship. An attorney-client relationship is only established through a signed 
              written agreement between you and our firm.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Until we have agreed to represent you and a formal engagement letter has been signed, 
              please do not send us any confidential information. Any information sent to us before 
              an attorney-client relationship is established may not be protected by attorney-client 
              privilege.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Results Not Guaranteed
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Case results, verdicts, and settlements mentioned on this website are not a guarantee 
              or prediction of the outcome of any other case. Every legal matter is unique, and the 
              outcome depends on the specific facts and circumstances of each case.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Past results do not guarantee future outcomes. The outcome of a particular case cannot 
              be predicted based on results obtained in other cases, even those with similar facts 
              and circumstances.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Accuracy of Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we make every effort to ensure that the information on this website is accurate 
              and up to date, laws and regulations change frequently. The information provided may 
              not reflect the most current legal developments.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You should not rely on any information on this website as a substitute for professional 
              legal advice. Always consult with a qualified attorney regarding your specific legal 
              situation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              External Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This website may contain links to external websites that are not provided or maintained 
              by Gurovich Law Group, APC. We do not guarantee the accuracy, relevance, timeliness, or 
              completeness of any information on these external websites. The inclusion of any links 
              does not necessarily imply a recommendation or endorsement of the views expressed within 
              them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Professional Advice
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The content on this website is not intended to be a substitute for professional legal 
              advice. If you have a legal problem, you should consult with an attorney licensed to 
              practice in your jurisdiction.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Do not disregard professional legal advice or delay in seeking it because of something 
              you have read on this website. The transmission and receipt of information contained on 
              this website does not constitute legal advice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Gurovich Law Group, APC is licensed to practice law in the State of California. The 
              information on this website is intended for residents of California and may not be 
              applicable to residents of other states.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you are not a resident of California, you should consult with an attorney licensed 
              in your state regarding your legal matters.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Testimonials and Endorsements
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Client testimonials and reviews displayed on this website reflect the experiences of 
              those particular clients. Testimonials are not a guarantee of future results. Each 
              case is different, and results will vary based on the specific facts and circumstances 
              of each case.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Gurovich Law Group, APC be liable for any special, direct, indirect, 
              consequential, or incidental damages or any damages whatsoever, whether in an action of 
              contract, negligence, or other tort, arising out of or in connection with the use of 
              this website or the contents of this website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this Disclaimer, please contact us at:
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
