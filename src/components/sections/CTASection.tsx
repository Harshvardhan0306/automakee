
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background dark:from-secondary/5 dark:to-background overflow-hidden relative">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="scroll-reveal">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to transform your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 block mt-1">
                social media strategy?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of businesses using our platform to enhance customer engagement,
              save time, and drive growth through intelligent automation.
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
              <Button asChild size="lg" className="rounded-full px-8 hover:shadow-lg transition-all duration-300 group">
                <Link to="/contact">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/contact?demo=true">Request Demo</Link>
              </Button>
            </div>
          </div>

          <div className="perspective scroll-reveal">
            <div className="relative border border-border/40 shadow-xl rounded-2xl overflow-hidden preserve-3d transform hover:translate-y-[-10px] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2074&auto=format&fit=crop"
                alt="Analytics Dashboard"
                className="w-full object-cover rounded-2xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <p className="text-lg font-medium mb-2">Powerful Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Track performance and optimize your strategy with real-time insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
