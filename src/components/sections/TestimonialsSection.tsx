
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DatabaseReview {
  id: string;
  name: string;
  company: string | null;
  comment: string;
  rating: number;
  created_at: string;
  status: string;
}

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-primary fill-primary" : "text-muted-foreground"
        }`}
      />
    ));
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<DatabaseReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(12);
        
        if (error) {
          console.error('Error fetching testimonials:', error);
          return;
        }
        
        setTestimonials(data as DatabaseReview[]);
      } catch (err) {
        console.error('Unexpected error fetching testimonials:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-muted/10">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it. See how our platform is transforming workflows for businesses worldwide.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link to="/reviews" className="text-base font-medium">
                Write a Review
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="agencies">Agencies</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <ScrollArea className="h-full w-full">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id}>
                      <TestimonialCard testimonial={{
                        ...testimonial,
                        formattedDate: formatDate(testimonial.created_at)
                      }} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="agencies">
              <ScrollArea className="h-full w-full">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {testimonials
                    .filter((t) => t.company && (
                      t.company.includes("Solutions") || 
                      t.company.includes("Agency") || 
                      t.company.includes("Technologies") ||
                      t.company.includes("Systems")
                    ))
                    .map((testimonial, index) => (
                      <div key={testimonial.id}>
                        <TestimonialCard testimonial={{
                          ...testimonial,
                          formattedDate: formatDate(testimonial.created_at)
                        }} />
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="brands">
              <ScrollArea className="h-full w-full">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {testimonials
                    .filter((t) => t.company && (
                      t.company.includes("Designs") || 
                      t.company.includes("Enterprises") || 
                      t.company.includes("Innovations")
                    ))
                    .map((testimonial, index) => (
                      <div key={testimonial.id}>
                        <TestimonialCard testimonial={{
                          ...testimonial,
                          formattedDate: formatDate(testimonial.created_at)
                        }} />
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

interface TestimonialProps {
  testimonial: DatabaseReview & {
    formattedDate: string;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialProps) => {
  // Generate a consistent avatar from name
  const getAvatarUrl = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`;
  };

  return (
    <div className="relative bg-card hover:bg-card/80 transition-colors border rounded-xl shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={getAvatarUrl(testimonial.name)} alt={testimonial.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {testimonial.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h4 className="text-sm font-semibold">{testimonial.name}</h4>
          {testimonial.company && (
            <p className="text-xs text-muted-foreground">{testimonial.company}</p>
          )}
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="flex mr-2">{renderStars(testimonial.rating)}</div>
        <span className="text-xs text-muted-foreground">{testimonial.formattedDate}</span>
      </div>
      <p className="text-sm text-muted-foreground flex-grow">{testimonial.comment}</p>
      <div className="mt-4 pt-4 border-t">
        <Button variant="outline" asChild size="sm" className="w-full hover:bg-primary/10 hover:text-primary">
          <Link to="/reviews">Write Your Review</Link>
        </Button>
      </div>
    </div>
  );
};

export default TestimonialsSection;
