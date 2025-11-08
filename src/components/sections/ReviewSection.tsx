
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseReview {
  id: string;
  name: string;
  company: string | null;
  comment: string;
  rating: number;
  created_at: string;
  status: string;
}

const reviewFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  rating: z.number().min(1).max(5),
  review: z.string().min(10, {
    message: "Review must be at least 10 characters.",
  }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export default function ReviewSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState<DatabaseReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }
        
        setReviews(data as DatabaseReview[]);
      } catch (err) {
        console.error('Unexpected error fetching reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      rating: 5,
      review: "",
    },
  });

  function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true);
    
    // Submit to Supabase
    supabase
      .from('reviews')
      .insert([{
        name: values.name,
        company: values.company || null,
        comment: values.review,
        rating: values.rating,
        status: 'pending' // Admin needs to approve
      }])
      .then(({ error }) => {
        if (error) {
          console.error('Error submitting review:', error);
          toast({
            title: "Error",
            description: "There was a problem submitting your review. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Review submitted!",
            description: "Thank you for sharing your experience. Your review will be visible after approval.",
          });
          
          form.reset();
          setUserRating(0);
          setOpen(false);
        }
        setIsSubmitting(false);
      });
  }

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

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? "text-primary fill-primary" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const StarInput = () => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setUserRating(i + 1);
              form.setValue("rating", i + 1);
            }}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                i < userRating ? "text-primary fill-primary" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real feedback from real customers. Share your experience with us.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
                <DialogDescription>
                  Tell us what you think about our platform.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your company name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <StarInput />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your experience..." 
                            {...field} 
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 w-24 bg-muted-foreground/20 rounded"></div>
                      <div className="h-3 w-16 bg-muted-foreground/20 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 ml-1 bg-muted-foreground/20 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    {review.company && (
                      <p className="text-sm text-muted-foreground">{review.company}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(review.created_at)}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-balance">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
