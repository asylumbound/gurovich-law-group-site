import { Link, useParams } from "wouter";
import { Calendar, Clock, User, ArrowLeft, Phone } from "lucide-react";
import { getBlogPostBySlug, getRecentPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-background py-20">
        <div className="container text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary py-12 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-body text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Category */}
            <span className="inline-block bg-primary text-primary-foreground text-xs font-heading font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-gray-300 text-sm font-body">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="prose prose-lg max-w-none font-body text-foreground">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="font-heading text-xl font-bold text-foreground mt-6 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* CTA Box */}
              <div className="mt-12 p-8 bg-secondary rounded-lg">
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  Need Legal Assistance?
                </h3>
                <p className="text-gray-300 font-body mb-6">
                  If you have questions about your legal situation, our experienced attorneys are here to help. Contact us today for a free, confidential consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold w-full sm:w-auto">
                      Schedule Consultation
                    </Button>
                  </Link>
                  <a href="tel:8184014725">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-heading font-semibold w-full sm:w-auto">
                      <Phone className="h-4 w-4 mr-2" />
                      (818) 401-4725
                    </Button>
                  </a>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              {/* Contact Card */}
              <div className="bg-card rounded-lg border border-border p-6 mb-8">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                  Free Consultation
                </h3>
                <p className="text-muted-foreground text-sm font-body mb-4">
                  Speak with an experienced attorney about your case. No obligation.
                </p>
                <a href="tel:8184014725">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </a>
              </div>

              {/* Recent Posts */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                  Recent Articles
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 3).map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      href={`/blog/${recentPost.slug}`}
                      className="block group"
                    >
                      <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {recentPost.title}
                      </h4>
                      <span className="text-xs text-muted-foreground font-body">
                        {recentPost.date}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
}
