
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare, Sparkles, Quote, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import { Review } from "@/context/AdminContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReviewsPage() {
  const [category, setCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  // Fetch approved reviews to display
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['approved-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[] || [];
    }
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Sample categories for filtering
  const categories = ["Product", "Service", "Support", "Experience", "Interface"];
  
  // Filter and sort reviews
  const filteredReviews = reviews ? [...reviews]
    .filter(review => category === "all" || review.company?.includes(category))
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === "highest") {
        return b.rating - a.rating;
      } else if (sortOrder === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    }) : [];

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Join our community of happy customers</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl lg:text-6xl text-gradient">
              Customer Reviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with our products and services, and share your own feedback.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 border-2 animate-scale-in border-purple-200 dark:border-purple-900/30 glow">
              <div className="p-8 text-center">
                <Quote className="w-8 h-8 mx-auto mb-4 text-purple-500 opacity-50" />
                <h3 className="text-xl font-semibold mb-3">Share Your Experience</h3>
                <p className="text-muted-foreground mb-6">We value your feedback. Let us know how we're doing and help others make informed decisions.</p>
                <ReviewForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Reviews section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
            <h2 className="text-2xl font-bold">
              <span className="text-gradient">What Our Customers Say</span>
            </h2>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="mb-10">
            <div className="flex justify-end mb-6">
              <TabsList>
                <TabsTrigger value="grid" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300">
                  Grid View
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300">
                  List View
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border p-6 rounded-xl shadow-sm bg-card animate-pulse">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 staggered-children">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border hover-card rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 border bg-gradient-to-r from-purple-400 to-blue-400">
                            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                              {review.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{review.name}</h3>
                            {review.company && (
                              <Badge variant="outline" className="bg-purple-100/50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40">
                                {review.company}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? "text-yellow-500 fill-yellow-500" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        
                        <Quote className="h-5 w-5 text-purple-400/30 mb-2" />
                        <p className="text-muted-foreground mb-4">{review.comment}</p>
                        
                        <div className="text-xs text-muted-foreground flex items-center justify-between mt-4 pt-4 border-t">
                          <span>{formatDate(review.created_at)}</span>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                            Helpful <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-xl bg-card">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">Be the first to share your experience!</p>
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Write a Review
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border p-6 rounded-xl shadow-sm bg-card animate-pulse">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length > 0 ? (
                <div className="space-y-6 staggered-children">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border hover-card rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border bg-gradient-to-r from-purple-400 to-blue-400">
                            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                              {review.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold">{review.name}</h3>
                              {review.company && (
                                <Badge variant="outline" className="bg-purple-100/50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40">
                                  {review.company}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? "text-yellow-500 fill-yellow-500" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            
                            <p className="text-muted-foreground">{review.comment}</p>
                            
                            <div className="flex justify-end mt-4">
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                                Helpful <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border rounded-xl bg-card">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">Be the first to share your experience!</p>
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Write a Review
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Stats section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/50 dark:from-gray-950 dark:to-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Customer Satisfaction</h2>
            <p className="text-muted-foreground">
              See why our customers love our products and services. Join thousands of satisfied users today.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 staggered-children">
            {[
              { value: "4.8", label: "Average Rating", icon: Star },
              { value: "12k+", label: "Happy Customers", icon: MessageSquare },
              { value: "98%", label: "Satisfaction Rate", icon: Sparkles },
              { value: "24/7", label: "Customer Support", icon: MessageSquare }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover-card border border-purple-100 dark:border-purple-900/30">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-gradient">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
