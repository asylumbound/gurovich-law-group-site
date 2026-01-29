/**
 * Practice Areas - Main Listing Page
 * Gurovich Law Group
 * 
 * Design: Dark hero section with 4 practice area cards
 * Style: Consistent with site design system
 */

import { Link } from "wouter";
import { practiceAreas } from "@/data/practiceAreas";
import { Shield, Scale, Briefcase, Gavel, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Scale,
  Briefcase,
  Gavel,
};

export default function PracticeAreas() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 md:py-28">
        <div className="container max-w-6xl">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            Our Expertise
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Practice Areas
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            The Gurovich Law Group provides comprehensive legal representation across multiple 
            practice areas. Our experienced attorneys are dedicated to achieving the best possible 
            outcomes for our clients in every case.
          </p>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {practiceAreas.map((area) => {
              const IconComponent = iconMap[area.icon] || Shield;
              return (
                <Link key={area.slug} href={`/practice-areas/${area.slug}`}>
                  <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full">
                    {/* Card Header */}
                    <div className="bg-slate-800 p-6 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {area.title}
                      </h2>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {area.description}
                      </p>
                      
                      {/* Sub-pages list */}
                      <div className="space-y-2 mb-6">
                        {area.subPages.slice(0, 4).map((sub) => (
                          <div key={sub.slug} className="flex items-center gap-2 text-slate-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm">{sub.title}</span>
                          </div>
                        ))}
                        {area.subPages.length > 4 && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span className="text-sm">+ {area.subPages.length - 4} more</span>
                          </div>
                        )}
                      </div>
                      
                      {/* CTA */}
                      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                        <span>Learn More</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900 text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Legal Assistance?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Our experienced attorneys are ready to help you navigate your legal challenges. 
            Contact us today for a free, confidential consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                Schedule Consultation
              </Button>
            </Link>
            <a href="tel:818-401-4725">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 px-8">
                <Phone className="w-5 h-5 mr-2" />
                (818) 401-4725
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
