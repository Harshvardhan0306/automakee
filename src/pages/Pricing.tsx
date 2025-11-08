
import Layout from "@/components/layout/Layout";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";

const Pricing = () => {
  return (
    <Layout>
      <div className="pt-28 pb-10 md:pt-40 md:pb-16 text-center bg-secondary/30 dark:bg-secondary/5">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple and transparent pricing plans designed to fit businesses of all sizes.
          </p>
        </div>
      </div>
      <PricingSection />
      <FAQSection />
    </Layout>
  );
};

export default Pricing;
