
import Layout from "@/components/layout/Layout";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CTASection from "@/components/sections/CTASection";

const Features = () => {
  return (
    <Layout>
      <div className="pt-28 pb-10 md:pt-40 md:pb-16 text-center bg-secondary/30 dark:bg-secondary/5">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Features</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the powerful tools and capabilities that make our platform the leading choice for social media automation.
          </p>
        </div>
      </div>
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Features;
