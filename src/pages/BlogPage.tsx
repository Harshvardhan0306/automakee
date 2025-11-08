
import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, FileQuestion } from "lucide-react";
import type { BlogPost } from "@/context/AdminContext";

const BlogPage = () => {
  const { blogs, publicBlogs, isLoading } = useAdmin();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  
  // Always use publicBlogs for non-admin users
  const blogsToShow = isAdmin ? blogs : publicBlogs;
  
  useEffect(() => {
    window.scrollTo(0, 0);

    // Set filtered blogs immediately on component mount and when dependencies change
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogsToShow);
    } else {
      const filtered = blogsToShow.filter(
        blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogsToShow, isAdmin]);

  // Get featured blog and regular blogs if there are any posts
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, tips, and the latest trends in social media automation to help your business thrive.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            // Skeleton loading state
            <div>
              <div className="mb-12">
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2">
                      <div className="h-64 w-full bg-muted animate-pulse" />
                    </div>
                    <div className="md:col-span-3 p-6">
                      <div className="h-8 w-3/4 bg-muted animate-pulse mb-4" />
                      <div className="h-4 w-full bg-muted animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse mb-2" />
                      <div className="h-4 w-2/3 bg-muted animate-pulse mb-6" />
                      <div className="mt-6">
                        <div className="h-10 w-32 bg-muted animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="h-48 w-full bg-muted animate-pulse" />
                    <div className="p-6">
                      <div className="h-6 w-3/4 bg-muted animate-pulse mb-2" />
                      <div className="h-4 w-full bg-muted animate-pulse mb-1" />
                      <div className="h-4 w-full bg-muted animate-pulse mb-1" />
                      <div className="h-4 w-2/3 bg-muted animate-pulse mb-4" />
                      <div className="h-9 w-24 bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="space-y-12">
              {searchTerm.trim() === "" && featuredBlog && (
                <div>
                  <BlogCard post={featuredBlog} featured />
                </div>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchTerm.trim() === "" ? regularBlogs : filteredBlogs).map((blog) => (
                  <div key={blog.id}>
                    <BlogCard post={blog} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm.trim() !== "" 
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "There are no blog posts available yet. Check back later for new content."}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
