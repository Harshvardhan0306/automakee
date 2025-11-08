
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Quote, ArrowRight, MessageCircle, User, Building } from "lucide-react";

const TestimonialsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const featuredTestimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "FashionForward",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop",
      content: "Automake has revolutionized how we engage with our Instagram followers. The AI responses are so natural that our customers can't tell they're not talking to a human. Our engagement has increased by 78% and we've been able to focus on creating better content instead of responding to comments all day.",
      rating: 5,
      category: "Retail",
    },
    {
      name: "Michael Chen",
      role: "Social Media Manager",
      company: "TechInnovate",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop",
      content: "We were skeptical about AI handling our customer interactions, but Automake proved us wrong. The platform learns our brand voice and maintains consistency across all communications. The analytics have helped us refine our strategy and we've seen a 45% increase in conversion from social media.",
      rating: 5,
      category: "Technology",
    },
    {
      name: "Emily Rodriguez",
      role: "Founder",
      company: "Wellness Collective",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1361&auto=format&fit=crop",
      content: "As a small business owner, I couldn't keep up with all the DMs and comments. Automake has been a game-changer! It handles routine questions instantly while flagging important messages for my attention. My customers are happier with the quick responses, and I've regained hours of my day.",
      rating: 4,
      category: "Health & Wellness",
    },
  ];
  
  const testimonials = [
    {
      name: "David Park",
      role: "E-commerce Director",
      company: "UrbanStyle",
      content: "The multi-platform support means we can maintain a consistent brand voice across Instagram and WhatsApp with minimal effort. The ROI has been incredible.",
      rating: 5,
      category: "Fashion",
    },
    {
      name: "Jessica Williams",
      role: "Customer Success",
      company: "EduPro Learning",
      content: "The customization options are extensive. We've trained the AI to answer course-specific questions, which has reduced our support ticket volume by 60%.",
      rating: 5,
      category: "Education",
    },
    {
      name: "Robert Gomez",
      role: "Digital Marketing Lead",
      company: "FoodieFinds",
      content: "We use Automake to engage with our followers about recipes and cooking tips. The AI handles thousands of interactions daily that would otherwise require several full-time employees.",
      rating: 4,
      category: "Food & Beverage",
    },
    {
      name: "Amanda Lee",
      role: "Brand Manager",
      company: "ActiveLife",
      content: "The analytics provided by Automake have given us insights into what our customers really want. We've adjusted our product development based on this feedback.",
      rating: 5,
      category: "Sports",
    },
    {
      name: "Thomas Wright",
      role: "CEO",
      company: "Local Landscaping",
      content: "Even as a local service business, we've seen tremendous benefit from Automake. It pre-qualifies leads through Instagram DMs before we spend time on consultations.",
      rating: 4,
      category: "Services",
    },
    {
      name: "Olivia Martinez",
      role: "Community Manager",
      company: "GamerConnect",
      content: "Our gaming community is active 24/7. Automake ensures we never miss engaging with fans regardless of timezone. The impact on our community growth has been measurable.",
      rating: 5,
      category: "Entertainment",
    },
  ];
  
  const starRating = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  const categories = Array.from(new Set([...featuredTestimonials, ...testimonials].map(t => t.category)));

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              What Our Customers Say
            </h1>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it. See how Automake has transformed social media management for businesses across industries.
            </p>
          </div>

          {/* Featured testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {featuredTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border/40 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-primary opacity-20" />
                </div>
                
                <p className="text-muted-foreground mb-6 flex-grow">{testimonial.content}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex">{starRating(testimonial.rating)}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/40">
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Category filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">More Customer Reviews</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button variant="outline" className="rounded-full" size="sm">
                All Industries
              </Button>
              {categories.map((category, index) => (
                <Button key={index} variant="ghost" className="rounded-full" size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* More testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border/40 p-5 transition-shadow duration-300 hover:shadow-md scroll-reveal"
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                  <div className="flex">
                    {starRating(testimonial.rating)}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-3">"{testimonial.content}"</p>
                
                <div className="mt-2">
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { 
                title: "4.8/5", 
                subtitle: "Average Rating", 
                icon: Star, 
                iconClass: "text-yellow-500"
              },
              { 
                title: "1,452+", 
                subtitle: "Happy Customers", 
                icon: User, 
                iconClass: "text-blue-500" 
              },
              { 
                title: "93%", 
                subtitle: "Renewal Rate", 
                icon: Building, 
                iconClass: "text-green-500" 
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-secondary/20 rounded-xl p-6 text-center scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-card border border-border/40 flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CTA section */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Join our growing community of satisfied customers
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience the difference that intelligent automation can make for your social media presence. Start your free trial today.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsPage;
