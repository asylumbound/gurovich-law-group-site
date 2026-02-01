import { useParams, Link } from "wouter";
import { MapPin, Phone, Scale, Briefcase, Shield, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";
import { majorCities, courthouses, officeLocation } from "@shared/cityData";

// Practice areas for each city page
const practiceAreas = [
  {
    title: "Personal Injury",
    description: "Car accidents, slip and fall, wrongful death, and more.",
    icon: Shield,
    href: "/practice-areas/personal-injury"
  },
  {
    title: "Criminal Defense",
    description: "DUI, drug charges, theft, assault, and felony defense.",
    icon: Scale,
    href: "/practice-areas/criminal-defense"
  },
  {
    title: "Employment Law",
    description: "Wrongful termination, discrimination, wage disputes.",
    icon: Briefcase,
    href: "/practice-areas/employment-law"
  },
  {
    title: "Civil Litigation",
    description: "Business disputes, contract issues, property matters.",
    icon: Users,
    href: "/practice-areas/civil-litigation"
  }
];

export default function CityLandingPage() {
  const { city } = useParams<{ city: string }>();
  const { openContactModal } = useContactModal();

  // Find city data
  const cityData = majorCities.find(c => c.slug === city);

  // If city not found, show 404-like message
  if (!cityData) {
    return (
      <main className="min-h-screen bg-background py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">City Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find information for this city. Please check our full list of areas served.
          </p>
          <Button asChild>
            <Link href="/areas-served">View All Areas Served</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Get nearby courthouses for this county
  const nearbyCourts = courthouses[cityData.county]?.slice(0, 6) || [];

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container relative z-10">
          <Link 
            href="/areas-served" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Areas Served
          </Link>
          
          <div className="flex items-center gap-2 text-primary mb-4">
            <MapPin className="w-5 h-5" />
            <span className="font-medium tracking-wider uppercase">{cityData.county}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {cityData.name} Injury Lawyers
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mb-8">
            {cityData.description} Gurovich Law Group provides experienced legal representation 
            to {cityData.name} residents in personal injury, criminal defense, employment law, 
            and civil litigation matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={openContactModal}
              className="bg-primary hover:bg-primary/90"
            >
              Free Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-slate-900"
              asChild
            >
              <a href="tel:8184014725" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (818) 401-4725
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why {cityData.name} Residents Choose Us
            </h2>
            <p className="text-lg text-slate-600">
              With our office conveniently located in Sherman Oaks, we're just minutes away 
              from {cityData.name}. Our attorneys have extensive experience in {cityData.county} courts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$15M+</div>
              <p className="text-slate-600">Recovered for Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24+</div>
              <p className="text-slate-600">Years Combined Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <p className="text-slate-600">Google Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Legal Services in {cityData.name}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our attorneys handle a wide range of legal matters for {cityData.name} residents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area) => (
              <Link
                key={area.title}
                href={area.href}
                className="group p-6 bg-slate-50 rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                <area.icon className="w-10 h-10 mb-4 text-primary group-hover:text-white transition-colors" />
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-slate-600 group-hover:text-white/80 text-sm">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Courthouses Section */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {cityData.county} Courthouses
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our attorneys regularly appear in these {cityData.county} courthouses, 
              including {cityData.nearbyCourthouse} which serves {cityData.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {nearbyCourts.map((court) => (
              <div
                key={court.name}
                className="p-4 bg-white rounded-lg border border-slate-200"
              >
                <h4 className="font-semibold text-slate-900 mb-1">{court.name}</h4>
                <p className="text-sm text-slate-600">{court.address}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/areas-served">View All Courthouses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Office Location Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Conveniently Located Near {cityData.name}
                </h2>
                <p className="text-slate-600 mb-6">
                  Our Sherman Oaks office is easily accessible from {cityData.name}. 
                  We offer free parking and are available for in-person consultations, 
                  phone calls, or video conferences.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{officeLocation.name}</p>
                      <p className="text-slate-600">{officeLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a 
                      href="tel:8184014725" 
                      className="font-semibold text-primary hover:underline"
                    >
                      {officeLocation.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-slate-100 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Free Case Evaluation
                </h3>
                <p className="text-slate-600 mb-6">
                  Contact us today to discuss your {cityData.name} legal matter. 
                  No fee unless we win your case.
                </p>
                <Button size="lg" onClick={openContactModal} className="w-full">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a {cityData.name} Lawyer?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don't wait to get the legal help you need. Contact Gurovich Law Group today 
            for a free, no-obligation consultation about your case.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={openContactModal}
              className="text-primary font-semibold"
            >
              Get Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <a href="tel:8184014725" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (818) 401-4725
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": `Gurovich Law Group - ${cityData.name} Lawyers`,
            "description": `Experienced ${cityData.name} attorneys providing personal injury, criminal defense, employment law, and civil litigation services.`,
            "url": `https://gurovichlawgroup.com/areas-served/${cityData.slug}`,
            "telephone": "+1-818-401-4725",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "15250 Ventura Blvd., Suite 700",
              "addressLocality": "Sherman Oaks",
              "addressRegion": "CA",
              "postalCode": "91403",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": officeLocation.lat,
              "longitude": officeLocation.lng
            },
            "areaServed": {
              "@type": "City",
              "name": cityData.name,
              "containedInPlace": {
                "@type": "AdministrativeArea",
                "name": cityData.county
              }
            },
            "priceRange": "Free Consultation",
            "openingHours": "Mo-Fr 09:00-17:00"
          })
        }}
      />
    </main>
  );
}
