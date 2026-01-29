/**
 * Practice Area Sub-Page
 * Gurovich Law Group
 * 
 * Shows detailed information about a specific service within a practice area
 */

import { Link, useParams } from "wouter";
import { getPracticeAreaBySlug, getSubPageBySlug } from "@/data/practiceAreas";
import { Shield, Scale, Briefcase, Gavel, Phone, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Scale,
  Briefcase,
  Gavel,
};

export default function PracticeAreaSubPage() {
  const params = useParams<{ area: string; subpage: string }>();
  const area = getPracticeAreaBySlug(params.area || "");
  const subPage = getSubPageBySlug(params.area || "", params.subpage || "");

  if (!area || !subPage) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <Link href="/practice-areas">
            <Button>Back to Practice Areas</Button>
          </Link>
        </div>
      </main>
    );
  }

  const IconComponent = iconMap[area.icon] || Shield;

  // Get related services (other sub-pages in the same practice area)
  const relatedServices = area.subPages.filter(s => s.slug !== subPage.slug).slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/practice-areas" className="hover:text-white transition-colors">Practice Areas</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/practice-areas/${area.slug}`} className="hover:text-white transition-colors">{area.title}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{subPage.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <span className="text-primary font-medium">{area.title}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {subPage.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            {subPage.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed text-lg mb-8">
                  {subPage.fullDescription}
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  How We Can Help
                </h2>
                
                <div className="space-y-4 mb-10">
                  {subPage.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100 rounded-xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Why Experience Matters
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {subPage.title} cases require attorneys who understand the nuances of California law 
                    and have a track record of success. At Gurovich Law Group, we bring decades of combined 
                    experience to every case, giving you the best chance at a favorable outcome.
                  </p>
                  <p className="text-slate-600">
                    We offer free consultations to discuss your case and explain your legal options. 
                    There's no obligation, and all consultations are confidential.
                  </p>
                </div>
              </div>

              {/* Back Link */}
              <div className="mt-10">
                <Link href={`/practice-areas/${area.slug}`}>
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to {area.title}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-slate-800 rounded-2xl p-6 text-white mb-8 sticky top-24">
                <h3 className="text-xl font-bold mb-3">Free Consultation</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Have questions about your {subPage.title.toLowerCase()} case? 
                  Contact us today for a free, confidential consultation.
                </p>
                <div className="space-y-3">
                  <Link href="/contact">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                      Schedule Consultation
                    </Button>
                  </Link>
                  <a href="tel:818-401-4725" className="block">
                    <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900">
                      <Phone className="w-5 h-5 mr-2" />
                      (818) 401-4725
                    </Button>
                  </a>
                </div>
                <p className="text-slate-400 text-xs mt-4 text-center">
                  Available 24/7 for emergencies
                </p>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Related Services
                  </h3>
                  <div className="space-y-3">
                    {relatedServices.map((service) => (
                      <Link key={service.slug} href={`/practice-areas/${area.slug}/${service.slug}`}>
                        <div className="group flex items-center gap-2 text-slate-700 hover:text-primary transition-colors cursor-pointer py-2">
                          <ChevronRight className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{service.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Link href={`/practice-areas/${area.slug}`}>
                      <span className="text-sm text-primary font-medium hover:underline cursor-pointer">
                        View all {area.title} services →
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discuss Your Case?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our experienced {area.title.toLowerCase()} attorneys are here to help. 
            Contact us today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-8">
                Contact Us Today
              </Button>
            </Link>
            <a href="tel:818-401-4725">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
