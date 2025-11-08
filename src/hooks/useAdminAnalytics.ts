
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  conversions: number;
}

export function useAdminAnalytics() {
  const [totalSubscriptions, setTotalSubscriptions] = useState<number>(0);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSubscriptionData();
    generateAnalyticsData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      const { count, error } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'completed'); // Only count completed subscriptions

      if (error) {
        console.error('Error fetching subscription count:', error);
      } else {
        setTotalSubscriptions(count || 0);
      }
    } catch (error) {
      console.error('Unexpected error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalyticsData = async () => {
    try {
      // In a real application, you'd fetch actual analytics data
      // For now we'll generate mock data based on subscriptions
      
      // First, let's get some subscription data to make this more realistic
      const { data: subscriptionData, error } = await supabase
        .from('user_subscriptions')
        .select('created_at')
        .eq('payment_status', 'completed')
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching subscription data for analytics:', error);
        return;
      }
      
      // Group subscriptions by date
      const subsByDate = (subscriptionData || []).reduce((acc, sub) => {
        const date = new Date(sub.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      // Generate data for the last 7 days
      const today = new Date();
      const analyticsArray: AnalyticsData[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Use actual subscription count for this date if available, otherwise random
        const conversions = subsByDate[dateStr] || Math.floor(Math.random() * 5);
        // Make page views and visitors somewhat correlated with conversions
        const multiplier = Math.random() * 10 + 40; // Between 40-50x
        const visitorMultiplier = Math.random() * 5 + 20; // Between 20-25x
        
        analyticsArray.push({
          date: dateStr,
          pageViews: Math.floor(conversions * multiplier) + 200,
          uniqueVisitors: Math.floor(conversions * visitorMultiplier) + 100,
          conversions: conversions
        });
      }
      
      setAnalyticsData(analyticsArray);
    } catch (error) {
      console.error('Error generating analytics data:', error);
      
      // Fallback to completely random data if there's an error
      const today = new Date();
      const analyticsArray: AnalyticsData[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        analyticsArray.push({
          date: date.toISOString().split('T')[0],
          pageViews: Math.floor(Math.random() * 500) + 500,
          uniqueVisitors: Math.floor(Math.random() * 300) + 200,
          conversions: Math.floor(Math.random() * 30) + 5
        });
      }
      
      setAnalyticsData(analyticsArray);
    }
  };

  return {
    totalSubscriptions,
    analyticsData,
    isLoading
  };
}
