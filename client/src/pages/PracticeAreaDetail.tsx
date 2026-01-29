/**
 * Practice Area Detail Page
 * Gurovich Law Group
 * 
 * Shows a specific practice area with all its sub-pages
 */

import { Link, useParams } from "wouter";
import { getPracticeAreaBySlug } from "@/data/practiceAreas";
import { Shield, Scale, Briefcase, Gavel, ArrowRight, Phone, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Scale,
  Briefcase,
  Gavel,
};

export default function PracticeAreaDetail() {
  const params = useParams<{ area: string }>();
  const area = getPracticeAreaBySlug(params.area || "");
  const { openContactModal } = useContactModal();

  if (!area) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Practice Area Not Found</h1>
          <Link href="/practice-areas">
            <Button>Back to Practice Areas</Button>
          </Link>
        </div>
      </main>
    );
  }

  const IconComponent = iconMap[area.icon] || Shield;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 md:py-28">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/practice-areas" className="hover:text-white transition-colors">Practice Areas</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{area.title}</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            {/* Custom image icon on desktop */}
            {area.iconImage ? (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                <img 
                  src={area.iconImage} 
                  alt={area.title}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {area.title}
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            {area.heroDescription}
          </p>
        </div>
      </section>

      {/* Sub-pages Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Our {area.title} Services
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-3xl">
            Click on any service below to learn more about how we can help with your specific legal needs.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {area.subPages.map((sub) => (
              <Link key={sub.slug} href={`/practice-areas/${area.slug}/${sub.slug}`}>
                <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer h-full flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-grow mb-4">
                    {sub.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Choose Gurovich Law Group for {area.title}?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Experienced Attorneys</h3>
                    <p className="text-slate-600">Our team has decades of combined experience handling {area.title.toLowerCase()} cases in California.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Personalized Attention</h3>
                    <p className="text-slate-600">We treat every client as an individual, not a case number. Your attorney will be accessible and responsive.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Proven Results</h3>
                    <p className="text-slate-600">We have a track record of successful outcomes for our clients in {area.title.toLowerCase()} matters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Multilingual Service</h3>
                    <p className="text-slate-600">We serve clients in English, Spanish, Armenian, Russian, and Ukrainian.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Free Case Evaluation</h3>
              <p className="text-slate-300 mb-6">
                Not sure if you have a case? Contact us for a free, no-obligation consultation. 
                We'll review your situation and explain your legal options.
              </p>
              <div className="space-y-4">
                <Link href="/onboarding">
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Start Your Case
                  </Button>
                </Link>
                <a href="tel:818-401-4725" className="block">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-slate-900">
                    <Phone className="w-5 h-5 mr-2" />
                    (818) 401-4725
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
