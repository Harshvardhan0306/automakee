
import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/context/AdminContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Share2, BookmarkPlus, FileX } from "lucide-react";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, isLoading } = useAdmin();
  const navigate = useNavigate();
  
  const post = blogs.find(blog => blog.id === id);
  const relatedPosts = blogs
    .filter(blog => blog.id !== id)
    .slice(0, 3);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoading && !post && id) {
      navigate('/blog');
    }
  }, [id, post, navigate, isLoading]);
  
  if (isLoading) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <section className="pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center py-16 border rounded-lg bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <FileX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Blog post not found</h2>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/blog">Back to Blog</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(post.date);

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-8 flex items-center gap-2 hover:bg-transparent hover:text-primary transition-colors duration-200"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Button>
            
            {post.image && (
              <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-8 scroll-reveal">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 scroll-reveal not-prose">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 scroll-reveal not-prose">
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <div className="mb-8 scroll-reveal">
                <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
              </div>
              
              <div className="scroll-reveal">
                {post.content.split('\n').map((paragraph, i) => (
                  paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
                ))}
              </div>
            </div>
            
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-16 border-t scroll-reveal">
                <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map(relatedPost => (
                    <Card key={relatedPost.id} className="group overflow-hidden border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-lg transition-all duration-300">
                      <Link to={`/blog/${relatedPost.id}`} className="block">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img 
                            src={relatedPost.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"} 
                            alt={relatedPost.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors duration-300">{relatedPost.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
