import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { useContactModal } from "@/contexts/ContactModalContext";

export default function Blog() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
              Legal Insights
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mt-4">
              Our Blog
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto font-body text-lg">
              Stay informed with the latest legal news, tips, and insights from our experienced attorneys.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                {/* Card Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/80 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary/20 font-heading text-6xl font-bold">
                      GLG
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground text-xs font-heading font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-muted-foreground text-xs font-body mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-heading text-xl font-bold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-primary font-heading text-sm font-semibold hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Have a Legal Question?
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              Our experienced attorneys are here to help. Contact us today for a free, confidential consultation about your legal matter.
            </p>
            <button 
              onClick={openContactModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors"
            >
              Schedule a Free Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
