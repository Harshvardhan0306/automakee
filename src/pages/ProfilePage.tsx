import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePricing } from "@/context/PricingContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronRight, CreditCard, User, Shield, Lock, FileText, Key, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ProfilePage = () => {
  const { profile, user, isLoading: authLoading } = useAuth();
  const { userSubscription, isLoading: subscriptionLoading } = usePricing();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authLoading && !user) {
      navigate('/auth');
    }
    
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
    }
  }, [profile, authLoading, user, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
          bio: bio,
          website: website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      setPasswordError(error.message || "An error occurred while changing your password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (authLoading || subscriptionLoading) {
    return (
      <Layout>
        <div className="container pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your account and subscription</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter a new password to update your account security.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      
                      {passwordError && (
                        <div className="text-destructive text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {passwordError}
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button
                        onClick={() => setShowPasswordDialog(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Two-factor authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="link" className="px-0" onClick={() => 
                        toast({
                          title: "Coming Soon",
                          description: "Two-factor authentication will be available soon.",
                        })
                      }>
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Account activity</h3>
                      <p className="text-sm text-muted-foreground">
                        Review your login history and active sessions
                      </p>
                      <Button variant="link" className="px-0" onClick={() => 
                        toast({
                          title: "Coming Soon",
                          description: "Account activity tracking will be available soon.",
                        })
                      }>
                        View activity
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6">
            {userSubscription ? (
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>
                    You are currently subscribed to the {userSubscription.plan?.name} plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 bg-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{userSubscription.plan?.name}</h3>
                        <p className="text-muted-foreground">{userSubscription.plan?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">
                          {userSubscription.plan?.currency_symbol}
                          {userSubscription.billing_cycle === 'monthly' 
                            ? userSubscription.plan?.price_monthly 
                            : userSubscription.plan?.price_annually}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {userSubscription.billing_cycle === 'monthly' ? 'per month' : 'per year'}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Plan Features:</h4>
                      <ul className="space-y-2">
                        {userSubscription.plan?.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${userSubscription.is_active ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {userSubscription.is_active ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Cycle:</span>
                        <span className="capitalize">{userSubscription.billing_cycle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{format(new Date(userSubscription.start_date), 'MMM d, yyyy')}</span>
                      </div>
                      {userSubscription.end_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">End Date:</span>
                          <span>{format(new Date(userSubscription.end_date), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {userSubscription.payment_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment ID:</span>
                          <span className="font-mono text-xs">{userSubscription.payment_id}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Billing History</h4>
                      <div className="rounded border overflow-hidden">
                        <div className="bg-muted/50 py-2 px-3 text-sm grid grid-cols-4">
                          <div>Date</div>
                          <div>Amount</div>
                          <div>Status</div>
                          <div className="text-right">Receipt</div>
                        </div>
                        <div className="py-3 px-3 text-sm grid grid-cols-4 items-center border-t">
                          <div>{format(new Date(userSubscription.start_date), 'MMM d, yyyy')}</div>
                          <div>
                            {userSubscription.plan?.currency_symbol}
                            {userSubscription.billing_cycle === 'monthly' 
                              ? userSubscription.plan?.price_monthly 
                              : userSubscription.plan?.price_annually}
                          </div>
                          <div>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Paid
                            </span>
                          </div>
                          <div className="text-right">
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        Change Plan
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Change Subscription Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          To change your plan, please contact our support team.
                        </p>
                        <div className="pt-2">
                          <Button asChild className="w-full" size="sm">
                            <Link to="/contact">Contact Support</Link>
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="destructive">
                        Cancel Subscription
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Cancel Your Subscription</h4>
                        <p className="text-sm text-muted-foreground">
                          To cancel your subscription, please contact our support team.
                        </p>
                        <div className="pt-2">
                          <Button asChild className="w-full" size="sm">
                            <Link to="/contact">Contact Support</Link>
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Subscription</CardTitle>
                  <CardDescription>
                    You don't have an active subscription yet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-6 text-center bg-card">
                    <h3 className="font-medium text-lg mb-2">Choose a Subscription Plan</h3>
                    <p className="text-muted-foreground mb-6">
                      Select from our range of subscription plans to access premium features.
                    </p>
                    <Button asChild>
                      <Link to="/pricing" className="flex items-center gap-2">
                        View Pricing Plans
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    You haven't added any payment methods yet. Add a payment method to make future purchases easier.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => 
                      toast({
                        title: "Coming Soon",
                        description: "Payment method management will be available soon.",
                      })
                    }
                  >
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
