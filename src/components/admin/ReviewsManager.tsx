import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, CheckCircle2, XCircle, Star, Filter } from "lucide-react";
import { SuccessBadge } from "@/components/ui/success-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReviewsManager() {
  const { reviews, isLoadingReviews, fetchReviews } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Handle approving a review
  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Review approved",
        description: "The review has been approved and is now public."
      });
      
      // Refresh reviews
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve review",
        variant: "destructive"
      });
    }
  };

  // Handle rejecting a review
  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Review rejected",
        description: "The review has been rejected."
      });
      
      // Refresh reviews
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject review",
        variant: "destructive"
      });
    }
  };

  // Filter reviews based on search query and status filter
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.company && review.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>
          Manage and moderate customer reviews and testimonials.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingReviews ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading reviews...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.name}</div>
                        {review.company && (
                          <div className="text-xs text-muted-foreground">{review.company}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      <SuccessBadge 
                        variant={
                          review.status === 'approved' 
                            ? 'success' 
                            : review.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </SuccessBadge>
                    </TableCell>
                    <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {review.status !== 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                            Approve
                          </Button>
                        )}
                        {review.status !== 'rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(review.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                            Reject
                          </Button>
                        )}
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
              {searchQuery || statusFilter !== "all"
                ? "No reviews found matching your search criteria."
                : "No reviews submitted yet."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
