
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainFeatures from "@/components/features/MainFeatures";
import PlatformIntegration from "@/components/features/PlatformIntegration";
import AdditionalFeatures from "@/components/features/AdditionalFeatures";

const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 scroll-reveal">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Powerful Features for Modern Social Media
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover our comprehensive suite of tools designed to elevate your social media presence
              and streamline your engagement strategy.
            </p>
          </div>

          <MainFeatures />
        </div>
      </section>

      {/* Platform integration section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <PlatformIntegration />
        </div>
      </section>

      {/* Secondary features section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              From advanced analytics to custom workflows, Automake gives you all the tools to excel in social media management.
            </p>
          </div>

          <AdditionalFeatures />
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Ready to Transform Your Social Media?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of businesses already using Automake to streamline their social media engagement and improve customer satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FeaturesPage;

