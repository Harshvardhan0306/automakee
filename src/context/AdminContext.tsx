import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Define types for our data
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string | null;
  date: Date;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: Date;
  author: string;
  image?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Review {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AdminContextType {
  contacts: ContactSubmission[];
  blogs: BlogPost[];
  publicBlogs: BlogPost[]; // Blogs that are approved and visible to everyone
  reviews: Review[];
  addContact: (contact: Omit<ContactSubmission, "id" | "date" | "created_at">) => Promise<void>;
  addBlog: (blog: Omit<BlogPost, "id" | "date" | "status">) => Promise<void>;
  editBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  approveBlog: (id: string) => Promise<void>;
  rejectBlog: (id: string) => Promise<void>;
  isLoading: boolean;
  isLoadingReviews: boolean;
  fetchContacts: () => Promise<void>;
  fetchReviews: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [publicBlogs, setPublicBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const { toast } = useToast();
  const { user, profile, isAdmin } = useAuth();

  useEffect(() => {
    fetchBlogs();
    fetchContacts();
    fetchReviews();
  }, [user]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          id,
          title,
          content,
          excerpt,
          created_at,
          image,
          status,
          profiles(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
        toast({
          title: 'Error fetching blogs',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        const formattedBlogs: BlogPost[] = data.map(blog => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          date: new Date(blog.created_at),
          author: blog.profiles?.full_name || blog.profiles?.username || 'Anonymous',
          image: blog.image,
          status: (blog.status as 'pending' | 'approved' | 'rejected') || 'approved',
        }));
        setBlogs(formattedBlogs);
        
        const approvedBlogs = formattedBlogs.filter(blog => blog.status === 'approved');
        setPublicBlogs(approvedBlogs);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching blogs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error fetching contacts',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        const formattedContacts: ContactSubmission[] = data.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
          phone: contact.phone,
          date: new Date(contact.created_at),
          created_at: contact.created_at,
        }));
        setContacts(formattedContacts);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching contacts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: 'Error fetching reviews',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setReviews(data as Review[]);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const addContact = async (contact: Omit<ContactSubmission, "id" | "date" | "created_at">) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: contact.name,
            email: contact.email,
            message: contact.message,
            phone: contact.phone || null,
          }
        ]);

      if (error) {
        console.error('Error adding contact:', error);
        toast({
          title: 'Error submitting contact form',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Contact submission successful',
        description: 'We\'ll get back to you soon!',
      });
      
      fetchContacts();
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while submitting the form',
        variant: 'destructive',
      });
    }
  };

  const addBlog = async (blog: Omit<BlogPost, "id" | "date" | "status">) => {
    if (!user || !profile) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to add blogs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const status = isAdmin ? 'approved' as const : 'pending' as const;
      
      const { data, error } = await supabase
        .from('blogs')
        .insert([
          {
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt,
            author_id: user.id,
            image: blog.image,
            status: status
          }
        ])
        .select();

      if (error) {
        console.error('Error adding blog:', error);
        toast({
          title: 'Error adding blog',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const newBlog: BlogPost = {
        id: data[0].id,
        title: data[0].title,
        content: data[0].content,
        excerpt: data[0].excerpt,
        date: new Date(data[0].created_at),
        author: profile.full_name || profile.username,
        image: data[0].image,
        status: data[0].status as 'pending' | 'approved' | 'rejected'
      };

      setBlogs((prev) => [newBlog, ...prev]);
      
      if (newBlog.status === 'approved') {
        setPublicBlogs((prev) => [newBlog, ...prev]);
      }
      
      toast({
        title: 'Blog post created',
        description: isAdmin ? 
          'Your new blog post has been created and published successfully.' : 
          'Your blog post has been submitted for approval.',
      });
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while adding blog',
        variant: 'destructive',
      });
    }
  };

  const editBlog = async (id: string, updatedBlog: Partial<BlogPost>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to edit blogs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: updatedBlog.title,
          content: updatedBlog.content,
          excerpt: updatedBlog.excerpt,
          image: updatedBlog.image,
          status: updatedBlog.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating blog:', error);
        toast({
          title: 'Error updating blog',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const updatedBlogs = blogs.map((blog) =>
        blog.id === id ? { ...blog, ...updatedBlog } : blog
      );
      setBlogs(updatedBlogs);
      
      const updatedPublicBlogs = updatedBlogs.filter(blog => blog.status === 'approved');
      setPublicBlogs(updatedPublicBlogs);
      
      toast({
        title: 'Blog post updated',
        description: 'Your blog post has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while updating blog',
        variant: 'destructive',
      });
    }
  };

  const approveBlog = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only administrators can approve blog posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      await editBlog(id, { status: 'approved' });
      toast({
        title: 'Blog approved',
        description: 'The blog post is now visible to all users.',
      });
    } catch (error: any) {
      console.error('Error approving blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the blog post',
        variant: 'destructive',
      });
    }
  };

  const rejectBlog = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Permission denied',
        description: 'Only administrators can reject blog posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      await editBlog(id, { status: 'rejected' });
      toast({
        title: 'Blog rejected',
        description: 'The blog post has been rejected.',
      });
    } catch (error: any) {
      console.error('Error rejecting blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the blog post',
        variant: 'destructive',
      });
    }
  };

  const deleteBlog = async (id: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to delete blogs',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog:', error);
        toast({
          title: 'Error deleting blog',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      setPublicBlogs((prev) => prev.filter((blog) => blog.id !== id));
      
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong while deleting blog',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        contacts,
        blogs,
        publicBlogs,
        reviews,
        addContact,
        addBlog,
        editBlog,
        deleteBlog,
        approveBlog,
        rejectBlog,
        isLoading,
        isLoadingReviews,
        fetchContacts,
        fetchReviews,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
