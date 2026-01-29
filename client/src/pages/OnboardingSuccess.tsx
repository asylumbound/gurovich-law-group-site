import { motion } from "framer-motion";
import { CheckCircle, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OnboardingSuccess() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Submission
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8">
              Your intake form has been successfully submitted to Gurovich Law Group. 
              Our team will review your information and contact you within 24-48 hours.
            </p>

            {/* What's Next Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Case Review</h3>
                    <p className="text-gray-600 text-sm">
                      An attorney will carefully review your submission and assess your legal needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Initial Contact</h3>
                    <p className="text-gray-600 text-sm">
                      We'll reach out using your preferred contact method to discuss your case.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Free Consultation</h3>
                    <p className="text-gray-600 text-sm">
                      Schedule a free consultation to discuss your case in detail with our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[#1A222B] text-white rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Need Immediate Assistance?</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="tel:+18184014725" 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>(818) 401-4725</span>
                </a>
                <span className="hidden sm:block text-gray-500">|</span>
                <a 
                  href="mailto:info@gurovichlaw.com" 
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>info@gurovichlaw.com</span>
                </a>
              </div>
            </div>

            {/* Return Home Button */}
            <Link href="/">
              <Button size="lg" className="gap-2">
                Return to Homepage
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-8 max-w-md mx-auto">
              Reminder: Submitting this form does not create an attorney-client relationship. 
              An attorney-client relationship is only established after a formal engagement 
              agreement has been signed by both parties.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
