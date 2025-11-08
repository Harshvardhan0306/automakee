
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PricingSection from "@/components/sections/PricingSection";

const PricingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <PricingSection />
    </Layout>
  );
};

export default PricingPage;
