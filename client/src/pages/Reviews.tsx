import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Phone, ArrowUpDown } from "lucide-react";
import { useContactModal } from "@/contexts/ContactModalContext";

import reviewsData from "@/content/reviews/reviews.json";

/**
 * Reviews Page - Gurovich Law Group
 * 
 * DESIGN: Clean card grid with star ratings
 * SORTING: Default highest rating first, optional toggle
 * NO DATES: Dates are stored internally but not displayed
 */

type SortOption = "rating" | "recent";

interface Review {
  id: string;
  source: string;
  reviewer_name: string;
  stars: number;
  title: string;
  body: string;
  provenance: {
    source_url: string;
    captured_at: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header: Name and Rating */}
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {review.reviewer_name}
        </h3>
        <div className="mt-1">
          <StarRating rating={review.stars} />
        </div>
      </div>

      {/* Title */}
      <h4 className="font-heading text-base font-medium text-foreground mb-3">
        {review.title}
      </h4>

      {/* Body */}
      <p className="text-muted-foreground font-body text-sm leading-relaxed">
        {review.body}
      </p>
    </motion.article>
  );
}

export default function Reviews() {
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const { openContactModal } = useContactModal();

  const sortedReviews = useMemo(() => {
    const reviews = [...reviewsData] as Review[];
    
    if (sortBy === "rating") {
      // Sort by rating (highest first), then by captured_at (most recent first) for ties
      return reviews.sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return new Date(b.provenance.captured_at).getTime() - new Date(a.provenance.captured_at).getTime();
      });
    } else {
      // Sort by captured_at (most recent first)
      return reviews.sort((a, b) => 
        new Date(b.provenance.captured_at).getTime() - new Date(a.provenance.captured_at).getTime()
      );
    }
  }, [sortBy]);

  // Calculate stats
  const totalReviews = reviewsData.length;
  const averageRating = (reviewsData.reduce((sum, r) => sum + r.stars, 0) / totalReviews).toFixed(1);
  const fiveStarCount = reviewsData.filter(r => r.stars === 5).length;

  return (
    <>
        {/* Hero Section */}
        <section className="relative bg-secondary py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://txeynebsnznkoqkhmuag.supabase.co/storage/v1/object/public/Gurovich/images/reviews-hero-bg.jpg"
              alt="Satisfied client shaking hands with attorney after successful case resolution"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
          </div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
                Client Testimonials
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
                What Our Clients Say
              </h1>
              <p className="text-gray-300 mt-4 text-lg font-body">
                Read verified reviews from clients we've helped with personal injury, criminal defense, and traffic cases.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">{averageRating}</div>
                  <div className="text-sm text-gray-400 font-body">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">{totalReviews}</div>
                  <div className="text-sm text-gray-400 font-body">Total Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">{fiveStarCount}</div>
                  <div className="text-sm text-gray-400 font-body">5-Star Reviews</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground font-body">
                Showing {totalReviews} reviews
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Sort reviews"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground font-body mt-4">
                Join our satisfied clients. Contact us today for a free consultation.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={openContactModal}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold px-8"
                >
                  Contact Us
                </Button>
                <a href="tel:8184014725">
                  <Button size="lg" variant="outline" className="font-heading font-semibold px-8">
                    <Phone className="mr-2 h-5 w-5" />
                    (818) 401-4725
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-6 bg-background border-t border-border">
          <div className="container">
            <p className="text-center text-xs text-muted-foreground font-body">
              Reviews are sourced from public profiles and client feedback. Individual results vary.
            </p>
          </div>
        </section>
    </>
  );
}
