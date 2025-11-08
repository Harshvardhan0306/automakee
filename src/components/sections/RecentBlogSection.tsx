
import React from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const RecentBlogSection = () => {
  const { publicBlogs, isLoading } = useAdmin();
  const recentBlogs = publicBlogs.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 scroll-reveal">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Latest Articles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Stay up-to-date with the latest social media automation trends and tips from our experts.
            </p>
          </div>
          <Button asChild variant="outline" className="group md:self-end">
            <Link to="/blog" className="flex items-center gap-2">
              View All Articles 
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="scroll-reveal">
                <div className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            recentBlogs.map((blog) => (
              <div key={blog.id} className="scroll-reveal">
                <BlogCard post={blog} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentBlogSection;
