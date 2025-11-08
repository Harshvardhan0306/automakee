
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/context/AdminContext";
import ContactsList from "./ContactsList";
import BlogManager from "./BlogManager";
import { BarChart3, Users, MessageCircle, FileText } from "lucide-react";

export default function Dashboard() {
  const { contacts, blogs } = useAdmin();

  const stats = [
    {
      title: "Total Contacts",
      value: contacts.length,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      description: "Contact form submissions",
    },
    {
      title: "Blog Posts",
      value: blogs.length,
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
      description: "Published articles",
    },
    {
      title: "Recent Messages",
      value: contacts.filter(c => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return c.date > date;
      }).length,
      icon: <MessageCircle className="h-6 w-6 text-muted-foreground" />,
      description: "Received in last 7 days",
    },
    {
      title: "Total Views",
      value: "2,347",
      icon: <BarChart3 className="h-6 w-6 text-muted-foreground" />,
      description: "Website visitors this month",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
          <TabsTrigger value="blog">Blog Manager</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="space-y-4">
          <ContactsList />
        </TabsContent>
        <TabsContent value="blog" className="space-y-4">
          <BlogManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
