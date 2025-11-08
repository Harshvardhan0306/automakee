
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Tag, Users } from "lucide-react";
import ContactsList from "@/components/admin/ContactsList";
import BlogManager from "@/components/admin/BlogManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import PricingManager from "@/components/admin/PricingManager";
import SubscriptionsManager from "@/components/admin/SubscriptionsManager";
import UsersManager from "@/components/admin/UsersManager";
import { ContactSubmission, BlogPost, Review } from "@/context/AdminContext";

interface AdminContentTabsProps {
  contacts: ContactSubmission[];
  blogs: BlogPost[];
  reviews: Review[];
}

const AdminContentTabs = ({ contacts, blogs, reviews }: AdminContentTabsProps) => {
  return (
    <Tabs defaultValue="contacts" className="space-y-4">
      <TabsList className="grid grid-cols-6 w-full max-w-[720px]">
        <TabsTrigger value="contacts">
          Contacts
          <Badge variant="secondary" className="ml-2">{contacts.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="blog">
          Blog
          <Badge variant="secondary" className="ml-2">{blogs.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews
          <Badge variant="secondary" className="ml-2">{reviews.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="pricing" className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          <span>Pricing</span>
        </TabsTrigger>
        <TabsTrigger value="subscriptions" className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>Subscriptions</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Users</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="contacts" className="space-y-4">
        <ContactsList />
      </TabsContent>
      <TabsContent value="blog" className="space-y-4">
        <BlogManager />
      </TabsContent>
      <TabsContent value="reviews" className="space-y-4">
        <ReviewsManager />
      </TabsContent>
      <TabsContent value="pricing" className="space-y-4">
        <PricingManager />
      </TabsContent>
      <TabsContent value="subscriptions" className="space-y-4">
        <SubscriptionsManager />
      </TabsContent>
      <TabsContent value="users" className="space-y-4">
        <UsersManager />
      </TabsContent>
    </Tabs>
  );
};

export default AdminContentTabs;
