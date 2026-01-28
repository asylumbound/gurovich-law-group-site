import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Maria S.",
    location: "Los Angeles, CA",
    rating: 5,
    text: "After my car accident, I didn't know where to turn. The team at Gurovich Law Group fought tirelessly for me and secured a settlement that covered all my medical bills and more. I can't thank them enough!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "James T.",
    location: "Sherman Oaks, CA",
    rating: 5,
    text: "When I was facing serious criminal charges, Konstantin and his team were there every step of the way. Their expertise and dedication resulted in a complete dismissal of my case. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Elena R.",
    location: "Encino, CA",
    rating: 5,
    text: "I was wrongfully terminated from my job and felt hopeless. Gurovich Law Group took my case and fought for my rights. They secured a significant settlement and restored my faith in the legal system.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    name: "David M.",
    location: "Van Nuys, CA",
    rating: 5,
    text: "As a tenant facing illegal eviction, I was scared and confused. The attorneys at Gurovich Law Group not only stopped the eviction but also helped me recover damages. True advocates for the people!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
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
            Don't just take our word for it. Hear from the clients we've helped
            navigate their most challenging legal situations.
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
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
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
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
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
    </section>
  );
}
