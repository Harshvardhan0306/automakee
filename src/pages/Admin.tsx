
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminDateRangeSelector from "@/components/admin/AdminDateRangeSelector";
import DashboardStats from "@/components/admin/DashboardStats";
import RecentActivity from "@/components/admin/RecentActivity";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import AdminContentFilters from "@/components/admin/AdminContentFilters";
import AdminContentTabs from "@/components/admin/AdminContentTabs";
import AdminFooter from "@/components/admin/AdminFooter";
import { useActivityManager } from "@/hooks/useActivityManager";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { contacts, blogs, reviews, isLoading } = useAdmin();
  const { signOut } = useAuth();
  const [dateRange, setDateRange] = useState("This week");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const { recentActivities, getTimeAgo } = useActivityManager(contacts, blogs, reviews);
  const { totalSubscriptions, analyticsData, isLoading: isLoadingAnalytics } = useAdminAnalytics();
  
  useEffect(() => {
    document.title = "Admin Dashboard | Automake";
  }, []);
  
  const getPercentChange = (current: number, previous = 0) => {
    if (previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(0)}%`;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen bg-muted/30 flex w-full">
        <AdminSidebar 
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />

        <div className="flex-1 transition-all duration-300">
          <AdminHeader 
            toggleSidebar={toggleSidebar}
            contacts={contacts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleLogout={handleLogout}
            getTimeAgo={getTimeAgo}
          />
          
          <main className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <AdminDashboardHeader />
              <AdminDateRangeSelector 
                dateRange={dateRange} 
                setDateRange={setDateRange} 
              />
            </div>
          
            <DashboardStats 
              contacts={contacts.length}
              blogs={blogs.length}
              reviews={reviews.length}
              subscriptions={totalSubscriptions}
              getPercentChange={getPercentChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AnalyticsChart 
                data={analyticsData}
                isLoading={isLoadingAnalytics}
              />
              <RecentActivity activities={recentActivities} />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
              <h2 className="text-xl font-bold">Content Management</h2>
              <AdminContentFilters 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>
            
            <AdminContentTabs 
              contacts={contacts}
              blogs={blogs}
              reviews={reviews}
            />
          </main>
          
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
