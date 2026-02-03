import { motion } from "framer-motion";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Real client testimonials from Google Maps and CrushMyTicket.com
const testimonials = [
  {
    name: "Alina T.",
    location: "Los Angeles, CA",
    source: "Google",
    rating: 5,
    text: "Gurovich Law Group has been my go to law firm for anything from traffic citations to personal injury cases and car accidents for many years now. They provide great service and truly do fight for you trying to make it work in all kinds of situations.",
    image: "/images/testimonials/alina_t_large.webp",
    hasPhoto: true,
  },
  {
    name: "Allan Zepeda",
    location: "Van Nuys, CA",
    source: "Google",
    rating: 5,
    text: "The Gurovich team did their best! They fought for my brother's case after mistrial from a previous ridiculous lawyer we had. They did a magnificent job and was able to reduce the time on my brother's case. They went above and beyond!",
    image: "/images/testimonials/allan_zepeda_large.webp",
    hasPhoto: true,
  },
  {
    name: "Armen Mamulyan",
    location: "Los Angeles, CA",
    source: "CrushMyTicket",
    rating: 5,
    text: "If you're looking for an excellent team, they are the place to go. I hired them first time couple years ago and I'm very thankful for their attitude. 100% professionals. A lot of friends of mine used their services after that, everyone was happy. Highly recommend!",
    initials: "AM",
    initialsColor: "bg-amber-600",
    hasPhoto: false,
  },
  {
    name: "Elisabeth Starr",
    location: "Los Angeles, CA",
    source: "CrushMyTicket",
    rating: 5,
    text: "Most persistent and reliable team in Los Angeles. I had 5 cases and they were all dismissed thanks to their hard and diligent work! Highly recommend this team for all your traffic court needs. Extremely professional and always available to answer any questions.",
    initials: "ES",
    initialsColor: "bg-rose-600",
    hasPhoto: false,
  },
  {
    name: "Irina Antonenko",
    location: "Sherman Oaks, CA",
    source: "Google",
    rating: 5,
    text: "I can't thank GUROVICH LAW GROUP enough for their exceptional representation in my case! Their professionalism, expertise, and compassion were evident throughout the entire process. They took the time to understand my concerns and worked tirelessly.",
    initials: "IA",
    initialsColor: "bg-pink-600",
    hasPhoto: false,
  },
  {
    name: "Sam Kogosov",
    location: "Woodland Hills, CA",
    source: "Google",
    rating: 5,
    text: "I recently had the pleasure of working with Gurovich Law Group, and I can't speak highly enough of their services! From the moment I contacted them, the entire team was professional, responsive, and genuinely caring about my case.",
    initials: "SK",
    initialsColor: "bg-blue-600",
    hasPhoto: false,
  },
  {
    name: "George F.",
    location: "North Hollywood, CA",
    source: "Google",
    rating: 5,
    text: "I have used Gurovich Law Group multiple times in the past 10 years. The attorneys are great communicators and well versed in multiple avenues that we needed help in. Always available, always helpful, and always my first call.",
    initials: "GF",
    initialsColor: "bg-stone-600",
    hasPhoto: false,
  },
  {
    name: "Sarah Ronaghi",
    location: "Los Angeles, CA",
    source: "Google",
    rating: 5,
    text: "Can't say enough amazing things about this Law Firm. They have saved my bf out of 3 tickets so far! They are very reasonably priced and very professional. I highly highly recommend. 5 stars all the way!",
    initials: "SR",
    initialsColor: "bg-purple-600",
    hasPhoto: false,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-sm font-semibold text-primary uppercase tracking-widest">
            Client Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            What Our Clients Say
          </h2>
          <p className="font-body text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Real reviews from real clients. See why we're rated 4.8 stars on
            Google with over 24 reviews.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-card rounded-xl p-8 shadow-sm border border-border h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="font-body text-foreground leading-relaxed flex-grow">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
                      {testimonial.hasPhoto ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full ${testimonial.initialsColor} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {testimonial.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-heading font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </motion.div>

      </div>

      {/* JSON-LD AggregateRating Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "Gurovich Law Group",
            "image": "https://gurovichlawgroup.com/logo.png",
            "url": "https://gurovichlawgroup.com",
            "telephone": "+1-818-401-4725",
            "priceRange": "Free Consultation",
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
              "latitude": 34.1543,
              "longitude": -118.4651
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "17:00"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "24",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": testimonials.map(t => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": t.name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": t.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": t.text
            }))
          })
        }}
      />
    </section>
  );
}
