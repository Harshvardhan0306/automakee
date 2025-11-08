
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent dark:from-background dark:to-background z-0"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className={`space-y-4 transition-all duration-700 delay-100 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-border/40 bg-background/60 backdrop-blur-sm px-3 py-1 text-sm font-medium text-muted-foreground mb-4">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                <span>AI-powered social media automation</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight tracking-tight text-balance">
              Transform Your Social Media <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                With Smart AI Automation
              </span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-balance">
              Revolutionize your engagement strategy with intelligent chatbots and automated responses that feel personal and authentic.
            </p>
          </div>
          
          <div className={`mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <Button asChild size="lg" className="rounded-full px-8 hover:shadow-lg transition-all duration-300 group">
              <Link to="/contact">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-full px-8 group">
                  <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-md">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                    title="Product Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className={`relative mt-16 md:mt-24 w-full max-w-5xl mx-auto transition-all duration-700 delay-500 perspective ${loaded ? 'opacity-100' : 'opacity-0 scale-95'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-24 z-10 bottom-0"></div>
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl preserve-3d transform hover:translate-y-[-10px] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=2070&auto=format&fit=crop"
                alt="Dashboard Preview"
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
