
import { useState } from "react";
import { useAdmin, BlogPost } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pencil, Trash, Plus, Search, Image, Calendar, User, AlignLeft, 
  Type, FileText, Tag, Save, CheckCircle, XCircle, AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function BlogManager() {
  const { blogs, addBlog, editBlog, deleteBlog, approveBlog, rejectBlog } = useAdmin();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    image: "",
    tags: ""
  });
  const [previewContent, setPreviewContent] = useState("");

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "content") {
      setPreviewContent(value);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      image: "",
      tags: ""
    });
    setPreviewContent("");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      author: formData.author,
      image: formData.image
    };
    
    addBlog(blogData);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBlog) {
      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        image: formData.image
      };
      
      editBlog(currentBlog.id, blogData);
      setIsEditOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteBlog(id);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      image: blog.image || "",
      tags: ""
    });
    setPreviewContent(blog.content);
    setIsEditOpen(true);
  };

  const handleApprove = (id: string) => {
    approveBlog(id);
  };

  const handleReject = (id: string) => {
    if (window.confirm("Are you sure you want to reject this blog post?")) {
      rejectBlog(id);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
    }
  };

  const renderPreview = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {content.split('\n').map((paragraph, i) => (
          paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
        ))}
      </div>
    );
  };

  const BlogForm = ({ onSubmit, submitLabel, closeDialog }: { onSubmit: (e: React.FormEvent) => void, submitLabel: string, closeDialog: () => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Editor</TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2"><Image className="h-4 w-4" /> Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Type className="h-4 w-4" /> Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg"
                  placeholder="Enter your blog title"
                />
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" /> Excerpt
                </label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg h-20"
                  placeholder="Write a brief summary of your blog post"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <User className="h-4 w-4" /> Author
                </label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg"
                  placeholder="Enter author name"
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Image className="h-4 w-4" /> Featured Image URL
                </label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags (comma-separated)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="productivity, tips, social media"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Content
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              className="min-h-[300px] rounded-lg font-mono text-sm"
              placeholder="Write your blog content here..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="border rounded-lg p-4 overflow-hidden bg-card">
            <h2 className="text-2xl font-bold mb-2">{formData.title || "Blog Title Preview"}</h2>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4 gap-4">
              {formData.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{formData.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {formData.image && (
              <div className="relative h-56 mb-4 rounded-md overflow-hidden">
                <img 
                  src={formData.image} 
                  alt={formData.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
            )}
            
            <p className="text-muted-foreground mb-4 italic">
              {formData.excerpt || "This is where the excerpt will appear..."}
            </p>
            
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {renderPreview(previewContent || "Write your content to see the preview here...")}
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={closeDialog}
          className="rounded-lg"
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-lg gap-2">
          <Save className="h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blog Manager</CardTitle>
            <CardDescription>
              Create, edit, and delete blog posts for your website.
            </CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
              </DialogHeader>
              <BlogForm 
                onSubmit={handleAddSubmit}
                submitLabel="Create Post" 
                closeDialog={() => setIsAddOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
              </DialogHeader>
              <BlogForm 
                onSubmit={handleEditSubmit}
                submitLabel="Update Post" 
                closeDialog={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredBlogs.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{blog.date.toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {blog.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(blog.id)}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(blog.id)}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(blog)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No blog posts found matching your search."
                : "No blog posts yet. Create your first post!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
