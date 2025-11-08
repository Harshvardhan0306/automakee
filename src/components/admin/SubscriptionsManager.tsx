import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePricing, UserSubscription } from "@/context/PricingContext";

interface SubscriptionWithUser extends UserSubscription {
  profiles: {
    id: string;
    username: string;
    full_name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
  };
}

export default function SubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { plans } = usePricing();

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        profiles(id, username, full_name, avatar_url),
        plan:pricing_plans(*)
      `)
      .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching subscriptions:", error);
        return;
      }

      setSubscriptions(data as SubscriptionWithUser[]);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.profiles?.email?.toLowerCase().includes(searchLower) ||
      (sub.plan?.name && sub.plan.name.toLowerCase().includes(searchLower)) ||
      sub.payment_status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Subscriptions</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchSubscriptions}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, plan or status"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredSubscriptions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Plan</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                    <th className="px-4 py-2 text-left">Cycle</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-border/60 hover:bg-secondary/20">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{sub.profiles?.full_name || "No name"}</p>
                          <p className="text-sm text-muted-foreground">{sub.profiles?.username || "No username"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{sub.plan?.name || "Unknown Plan"}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{format(new Date(sub.created_at), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(sub.created_at), "h:mm a")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{sub.end_date ? format(new Date(sub.end_date), "MMM d, yyyy") : "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{sub.end_date ? format(new Date(sub.end_date), "h:mm a") : ""}</p>
                      </td>
                      <td className="px-4 py-3 capitalize">{sub.billing_cycle}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {sub.payment_status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sub.is_active ? "default" : "outline"}>
                          {sub.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No subscriptions found matching your search." : "No subscriptions found."}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
