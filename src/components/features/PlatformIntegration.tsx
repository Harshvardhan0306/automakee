
import { MessageSquare, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PlatformIntegration = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1 scroll-reveal">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Seamless Platform Integration
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Automake works with the platforms where your customers already are. No need to switch between apps or manage multiple tools. Everything is consolidated in one powerful dashboard.
        </p>
        
        <div className="flex flex-col space-y-5">
          <div className="flex items-start">
            <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Instagram Integration</h3>
              <p className="text-muted-foreground">Automated comments, DM responses, and story interactions to keep your followers engaged.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">WhatsApp Support</h3>
              <p className="text-muted-foreground">Handle customer inquiries and support requests automatically through WhatsApp Business API.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Facebook Integration (Coming Soon)</h3>
              <p className="text-muted-foreground">Manage comments, messages, and post engagement across your Facebook business pages.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <Button asChild className="group">
            <Link to="/pricing">
              View Pricing
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="order-1 md:order-2 scroll-reveal">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur-3xl opacity-20 -z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2574&auto=format&fit=crop"
            alt="Platform Integration"
            className="rounded-2xl shadow-xl border border-border/40 w-full object-cover aspect-[4/3]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformIntegration;

