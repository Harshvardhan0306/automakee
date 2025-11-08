
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import RecentBlogSection from "@/components/sections/RecentBlogSection";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <RecentBlogSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
