
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  Star,
  ArrowUpRight,
  CreditCard
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface DashboardStatsProps {
  contacts: number;
  blogs: number;
  reviews: number;
  subscriptions: number;
  getPercentChange: (current: number, previous?: number) => string;
}

const DashboardStats = ({
  contacts,
  blogs,
  reviews,
  subscriptions,
  getPercentChange
}: DashboardStatsProps) => {
  const stats: StatCard[] = [
    {
      title: "Total Contacts",
      value: contacts,
      trend: getPercentChange(contacts, contacts > 5 ? contacts - 2 : 0),
      trendUp: contacts > 5,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      description: "Contact form submissions",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Blog Posts",
      value: blogs,
      trend: getPercentChange(blogs, blogs > 5 ? blogs - 1 : 0),
      trendUp: blogs > 5,
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
      description: "Published articles",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Reviews",
      value: reviews,
      trend: getPercentChange(reviews, reviews > 5 ? reviews - 1 : 0),
      trendUp: reviews > 5,
      icon: <Star className="h-6 w-6 text-muted-foreground" />,
      description: "Customer testimonials",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Subscriptions",
      value: subscriptions,
      trend: getPercentChange(subscriptions, subscriptions > 1 ? subscriptions - 1 : 0),
      trendUp: subscriptions > 1,
      icon: <CreditCard className="h-6 w-6 text-muted-foreground" />,
      description: "Completed subscription payments",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border/40 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} flex items-center`}>
                {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />}
                {stat.trend}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
