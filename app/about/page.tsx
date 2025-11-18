import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award, Gem, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                About Velure Jewellery
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                A legacy of passion, craftsmanship, and family heritage—connecting cultures through timeless artistry.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Velure Jewellery was born from a legacy of passion, craftsmanship, and family heritage. For over 25 years, my family has been deeply rooted in the jewelry industry back home — a journey that began in 1995, celebrating the art of Indian craftsmanship and timeless design.
                </p>
                <p>
                  One day, in a heartfelt family conversation, we talked about bringing our tradition and artistry to a wider audience. With their unwavering love and support, I found myself inspired to take this dream further — and that's how Velure Jewellery came into existence.
                </p>
                <p>
                  At Velure, we carry forward the same values that have defined our family's legacy for decades: authenticity, precision, and the belief that every piece of jewelry tells a story. Today, we're proud to extend this legacy into the global market, connecting cultures through craftsmanship and creating jewelry that resonates with modern elegance and emotional meaning.
                </p>
                <p>
                  Each piece from Velure is more than just jewelry — it's a reflection of heritage, love, and the beauty of timeless artistry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
                  <p className="text-muted-foreground">
                    Every piece is crafted with genuine materials and authentic Indian craftsmanship, honoring our family's 25-year legacy in the jewelry industry.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Gem className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Precision & Quality
                  </h3>
                  <p className="text-muted-foreground">
                    We meticulously craft each piece with attention to detail, ensuring exceptional quality that stands the test of time.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Emotional Meaning
                  </h3>
                  <p className="text-muted-foreground">
                    Every piece tells a story — your story. We believe jewelry should carry emotional significance and create lasting memories.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Timeless Design</h3>
                  <p className="text-muted-foreground">
                    Blending traditional Indian artistry with modern elegance, we create jewelry that transcends trends and generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">25+</p>
                <p className="text-muted-foreground">Years of Heritage</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">1995</p>
                <p className="text-muted-foreground">Founded</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">100%</p>
                <p className="text-muted-foreground">Authentic Craft</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">Global</p>
                <p className="text-muted-foreground">Reach</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Your Perfect Piece
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Explore our exquisite collection of handcrafted jewelry, where heritage meets modern elegance. Find a piece that tells your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Browse Collection</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
