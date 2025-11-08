
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/context/AdminContext";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(post.date);

  // Show approval status badge if the post has a status
  const statusBadge = post.status && (
    <Badge 
      variant={post.status === 'approved' ? "success" : post.status === 'pending' ? "outline" : "destructive"}
      className="absolute top-2 right-2 z-10"
    >
      {post.status === 'approved' ? (
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Approved
        </span>
      ) : post.status === 'pending' ? (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending Approval
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Rejected
        </span>
      )}
    </Badge>
  );

  if (featured) {
    return (
      <Card className="group overflow-hidden border-0 bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg h-full transition-all duration-300 hover:shadow-xl">
        <div className="grid md:grid-cols-5 lg:grid-cols-2 h-full">
          <div className="md:col-span-2 lg:col-span-1 relative overflow-hidden min-h-[300px] md:min-h-[400px]">
            {statusBadge}
            <img 
              src={post.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"} 
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="md:col-span-3 lg:col-span-1 p-8 flex flex-col">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
            <p className="text-muted-foreground mb-6 line-clamp-3 text-lg leading-relaxed">{post.excerpt}</p>
            
            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to={`/blog/${post.id}`} className="flex items-center justify-center gap-2">Read Full Article</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden border bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm h-full hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden aspect-[16/10]">
        {statusBadge}
        <img 
          src={post.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"} 
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">{post.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 px-6 pb-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link to={`/blog/${post.id}`} className="flex items-center justify-center gap-2">Read Article</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
