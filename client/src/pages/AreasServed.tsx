import { useState } from "react";
import { MapPin, Building2, ChevronDown, ChevronUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/contexts/ContactModalContext";

// Cities served - organized alphabetically
const citiesServed = [
  "Acton", "Agoura Hills", "Agoura", "Agua Dulce", "Alhambra", "Altadena",
  "Arcadia", "Arleta", "Artesia", "Avalon", "Azusa", "Baldwin Park",
  "Bassett", "Bel Air", "Bell Canyon", "Bell", "Bellflower", "Belmont Shore",
  "Beverly Hills", "Bradbury", "Brentwood", "Burbank", "Calabasas", "Canoga Park",
  "Canyon Country", "Carson", "Castaic", "Century City", "Cerritos", "Chatsworth",
  "City of Commerce", "City of Industry", "Claremont", "Cole", "Commerce", "Compton",
  "Covina", "Cudahy", "Culver City", "Diamond Bar", "Downey", "Duarte",
  "Eagle Rock", "East Los Angeles", "El Monte", "El Segundo", "Elizabeth Lake", "Encino",
  "Gardena", "Glendale", "Glendora", "Granada Hills", "Hacienda Heights", "Harbor City",
  "Hawaiian Gardens", "Hawthorne", "Hazard", "Hermosa Beach", "Hidden Hills", "Hollywood",
  "Huntington Park", "Inglewood", "Irwindale", "La Canada Flintridge", "La Canada", "La Crescenta",
  "La Mirada", "La Puente", "La Verne", "Lake Hughes", "Lake Los Angeles", "Lake View Terrace",
  "Lakewood", "Lancaster", "Lawndale", "Lennox", "Leona Valley", "Littlerock",
  "Llano", "Lomita", "Long Beach", "Los Angeles", "Los Nietos", "Lynwood",
  "Malibu", "Manhattan Beach", "Mar Vista", "Marina Del Rey", "Maywood", "Mission Hills",
  "Monrovia", "Montebello", "Monterey Park", "Montrose", "Mount Baldy", "Mount Wilson",
  "Newhall", "North Hills", "North Hollywood", "Northridge", "Norwalk", "Oak Park",
  "Pacific Palisades", "Pacoima", "Palmdale", "Palos Verdes Estates", "Panorama City", "Paramount",
  "Pasadena", "Pearblossom", "Pico Rivera", "Playa Del Rey", "Pomona", "Porter Ranch",
  "Quartz Hill", "Rancho Dominguez", "Rancho Palos Verdes", "Redondo Beach", "Reseda", "Rolling Hills Estates",
  "Rolling Hills", "Rosemead", "Rowland Heights", "San Dimas", "San Fernando", "San Gabriel",
  "San Marino", "San Pedro", "Santa Clarita", "Santa Fe Springs", "Santa Monica", "Saugus",
  "Sepulveda", "Shadow Hills", "Sherman Oaks", "Sierra Madre", "Signal Hill", "South El Monte",
  "South Gate", "South Pasadena", "Studio City", "Sun Valley", "Sundale", "Sylmar",
  "Tarzana", "Temple City", "Terminal Island", "Toluca Lake", "Topanga", "Torrance",
  "Tujunga", "Universal City", "Val Verde", "Valencia", "Van Nuys", "Rancho Cucamonga"
];

// Courthouse data organized by county
const courthouses = {
  "Los Angeles County": [
    { name: "Airport Courthouse", address: "11701 S. La Cienega Blvd., Los Angeles, CA 90045" },
    { name: "Alfred J. McCourtney Juvenile Justice Center", address: "1040 W. Avenue J, Lancaster, CA 93534" },
    { name: "Alhambra Courthouse", address: "150 W. Commonwealth Ave., Alhambra, CA 91801" },
    { name: "Bellflower Courthouse", address: "10025 E. Flower St., Bellflower, CA 90706" },
    { name: "Beverly Hills Courthouse", address: "9355 Burton Way, Beverly Hills, CA 90210" },
    { name: "Burbank Courthouse", address: "300 E. Olive Ave., Burbank, CA 91502" },
    { name: "Catalina Courthouse", address: "215 Summer Ave., Avalon, CA 90704" },
    { name: "Central Arraignment Courts", address: "429 Bauchet St., Los Angeles, CA 90012" },
    { name: "Central Civil West Courthouse", address: "600 S. Commonwealth Ave., Los Angeles, CA 90005" },
    { name: "Chatsworth Courthouse", address: "9425 Penfield Ave., Chatsworth, CA 91311" },
    { name: "Clara Shortridge Foltz Criminal Justice Center", address: "210 W. Temple St., Los Angeles, CA 90012" },
    { name: "Compton Courthouse", address: "200 W. Compton Blvd., Compton, CA 90220" },
    { name: "Downey Courthouse", address: "7500 E. Imperial Hwy., Downey, CA 90242" },
    { name: "East Los Angeles Courthouse", address: "4848 E. Civic Center Way, Los Angeles, CA 90022" },
    { name: "Eastlake Juvenile Court", address: "1601 Eastlake Ave., Los Angeles, CA 90033" },
    { name: "Edmund D. Edelman Children's Court", address: "201 Centre Plaza Dr., Monterey Park, CA 91754" },
    { name: "El Monte Courthouse", address: "11234 E. Valley Blvd., El Monte, CA 91731" },
    { name: "Glendale Courthouse", address: "600 E. Broadway, Glendale, CA 91206" },
    { name: "Governor George Deukmejian Courthouse", address: "275 Magnolia Ave., Long Beach, CA 90802" },
    { name: "Hollywood Courthouse", address: "5925 Hollywood Blvd., Los Angeles, CA 90028" },
    { name: "Inglewood Courthouse", address: "1 Regent St., Inglewood, CA 90301" },
    { name: "Inglewood Juvenile Courthouse", address: "110 Regent St., Inglewood, CA 90301" },
    { name: "Los Padrinos Juvenile Courthouse", address: "7281 E. Quill Dr., Downey, CA 90242" },
    { name: "Malibu Courthouse", address: "23525 Civic Center Way, Malibu, CA 90265" },
    { name: "Mental Health Courthouse", address: "1150 N. San Fernando Rd., Los Angeles, CA 90065" },
    { name: "Metropolitan Courthouse", address: "1945 S. Hill St., Los Angeles, CA 90007" },
    { name: "Michael Antonovich Antelope Valley Courthouse", address: "42011 4th St. W, Lancaster, CA 93534" },
    { name: "Norwalk Courthouse", address: "12720 Norwalk Blvd., Norwalk, CA 90650" },
    { name: "Pasadena Courthouse", address: "300 E. Walnut Ave., Pasadena, CA 91101" },
    { name: "Pomona Courthouse South", address: "400 Civic Center Plaza, Pomona, CA 91766" },
    { name: "San Fernando Courthouse", address: "900 Third St., San Fernando, CA 91340" },
    { name: "San Pedro Courthouse", address: "505 S. Centre St., San Pedro, CA 90731" },
    { name: "Santa Clarita Courthouse", address: "23747 W. Valencia Blvd., Santa Clarita, CA 91355" },
    { name: "Santa Monica Courthouse", address: "1725 Main St., Santa Monica, CA 90401" },
    { name: "Stanley Mosk Courthouse", address: "110 N. Hill St., Los Angeles, CA 90012" },
    { name: "Sylmar Juvenile Courthouse", address: "16350 Filbert St., Sylmar, CA 91342" },
    { name: "Torrance Courthouse", address: "825 Maple Ave., Torrance, CA 90503" },
    { name: "Van Nuys Courthouse East", address: "6230 Sylmar Ave., Van Nuys, CA 91401" },
    { name: "Van Nuys Courthouse West", address: "14400 Erwin St. Mall, Van Nuys, CA 91401" },
    { name: "West Covina Courthouse", address: "1427 W. Covina Pkwy., West Covina, CA 91790" },
    { name: "Whittier Courthouse", address: "7339 S. Painter Ave., Whittier, CA 90602" },
  ],
  "Orange County": [
    { name: "Central Justice Center", address: "700 Civic Center Drive West, Santa Ana, CA 92701" },
    { name: "Civil Complex Center", address: "751 West Santa Ana Blvd., Santa Ana, CA 92701" },
    { name: "Community Court (Santa Ana)", address: "909 N. Main St., Santa Ana, CA 92701" },
    { name: "Costa Mesa Justice Complex", address: "3390 Harbor Blvd., Costa Mesa, CA 92626" },
    { name: "Department CJ1 Orange County Men's Jail", address: "550 N. Flower St., Santa Ana, CA 92703" },
    { name: "Harbor Justice Center - Newport Beach", address: "4601 Jamboree Rd., Newport Beach, CA 92660" },
    { name: "Lamoreaux Justice Center", address: "341 The City Dr S, Orange, CA 92868" },
    { name: "North Justice Center (Fullerton)", address: "1275 N. Berkeley Ave., Fullerton, CA 92832" },
    { name: "Stephen K. Tamura - West Justice Center", address: "8141 13th St., Westminster, CA 92683" },
  ],
  "San Diego County": [
    { name: "Central Courthouse (San Diego)", address: "1100 Union Street, San Diego, CA 92101" },
    { name: "Hall of Justice (San Diego)", address: "330 West Broadway, San Diego, CA 92101" },
    { name: "Juvenile Court (San Diego)", address: "2851 Meadow Lark Drive, San Diego, CA 92123" },
    { name: "North County Regional Center (Vista)", address: "325 South Melrose Drive, Vista, CA 92081" },
    { name: "South County Regional Center (Chula Vista)", address: "500 Third Avenue, Chula Vista, CA 91910" },
    { name: "East County Regional Center (El Cajon)", address: "250 East Main Street, El Cajon, CA 92020" },
    { name: "Kearny Mesa Traffic Court", address: "8950 Clairemont Mesa Boulevard, San Diego, CA 92123" },
  ],
  "Ventura County": [
    { name: "East County Courthouse (Simi Valley)", address: "3855-F Alamo Street, Simi Valley, CA 93063" },
    { name: "Hall of Justice (Ventura)", address: "800 South Victoria Avenue, Ventura, CA 93009" },
    { name: "Juvenile Justice Center (Oxnard)", address: "4353 E. Vineyard Avenue, Oxnard, CA 93036" },
  ],
};

export default function AreasServed() {
  const [expandedCounty, setExpandedCounty] = useState<string | null>("Los Angeles County");
  const [showAllCities, setShowAllCities] = useState(false);
  const { openContactModal } = useContactModal();

  const displayedCities = showAllCities ? citiesServed : citiesServed.slice(0, 60);

  const toggleCounty = (county: string) => {
    setExpandedCounty(expandedCounty === county ? null : county);
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="container relative z-10">
          <p className="text-primary font-medium tracking-wider uppercase mb-4">Service Coverage</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Areas We Serve
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Gurovich Law Group proudly serves clients throughout Southern California, 
            with extensive experience in courthouses across Los Angeles, Orange, San Diego, 
            and Ventura counties.
          </p>
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cities We Serve
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our attorneys represent clients in over 130 cities throughout Southern California.
              No matter where you're located, we can help.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {displayedCities.map((city) => (
              <div
                key={city}
                className="bg-white rounded-lg px-4 py-3 text-sm text-slate-700 hover:bg-primary hover:text-white transition-colors duration-200 cursor-default border border-slate-200 hover:border-primary"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 flex-shrink-0 opacity-60" />
                  <span className="truncate">{city}, CA</span>
                </div>
              </div>
            ))}
          </div>

          {citiesServed.length > 60 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => setShowAllCities(!showAllCities)}
                className="gap-2"
              >
                {showAllCities ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show All {citiesServed.length} Cities
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Courthouses Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Courthouses We Practice In
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our attorneys have extensive experience appearing in courthouses throughout 
              Southern California. We know the local rules, judges, and procedures.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {Object.entries(courthouses).map(([county, locations]) => (
              <div key={county} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCounty(county)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold text-slate-900">{county}</span>
                    <span className="text-sm text-slate-500">({locations.length} locations)</span>
                  </div>
                  {expandedCounty === county ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {expandedCounty === county && (
                  <div className="p-5 bg-white">
                    <div className="grid gap-4 md:grid-cols-2">
                      {locations.map((courthouse) => (
                        <div
                          key={courthouse.name}
                          className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <h4 className="font-medium text-slate-900 mb-1">
                            {courthouse.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {courthouse.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Legal Help in Your Area?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation. Our experienced attorneys are ready 
            to discuss your case and explain your legal options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={openContactModal}
              className="text-primary font-semibold"
            >
              Schedule Free Consultation
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
    </main>
  );
}
