
import Layout from "@/components/layout/Layout";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

const Testimonials = () => {
  return (
    <Layout>
      <div className="pt-28 pb-10 md:pt-40 md:pb-16 text-center bg-secondary/30 dark:bg-secondary/5">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Testimonials</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience with our platform.
          </p>
        </div>
      </div>
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Testimonials;
