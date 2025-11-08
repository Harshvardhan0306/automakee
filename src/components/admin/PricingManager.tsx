
import React, { useState, useEffect } from "react";
import { usePricing, PricingPlan } from "@/context/PricingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PricingManager() {
  const { plans, fetchPlans, updatePlan, deletePlan, createPlan } = usePricing();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<PricingPlan, "id" | "created_at" | "updated_at">>({
    name: "",
    description: "",
    price_monthly: 0,
    price_annually: 0,
    currency: "INR",
    currency_symbol: "₹",
    features: [], // Initialize as empty array
    is_popular: false,
    cta_text: "Get Started",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan({ ...plan });
  };

  const handleUpdate = async () => {
    if (!editingPlan) return;
    
    // Ensure features is an array if it's a string
    if (typeof editingPlan.features === 'string') {
      editingPlan.features = (editingPlan.features as string).split('\n').filter(Boolean);
    }
    
    await updatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      await deletePlan(id);
    }
  };

  const handleCreate = async () => {
    // Ensure features is an array if it's a string
    if (typeof newPlan.features === 'string') {
      newPlan.features = (newPlan.features as string).split('\n').filter(Boolean);
    }
    
    // Make sure all required fields are provided
    const requiredPlan: Omit<PricingPlan, "id" | "created_at" | "updated_at"> = {
      name: newPlan.name,
      description: newPlan.description,
      price_monthly: newPlan.price_monthly,
      price_annually: newPlan.price_annually,
      currency: newPlan.currency,
      currency_symbol: newPlan.currency_symbol,
      features: newPlan.features,
      is_popular: newPlan.is_popular,
      cta_text: newPlan.cta_text,
    };
    
    await createPlan(requiredPlan);
    setIsCreating(false);
    setNewPlan({
      name: "",
      description: "",
      price_monthly: 0,
      price_annually: 0,
      currency: "INR",
      currency_symbol: "₹",
      features: [],
      is_popular: false,
      cta_text: "Get Started",
    });
  };

  const renderPlanForm = (plan: any, isNew = false) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (isNew) {
        setNewPlan({ ...newPlan, [name]: value });
      } else {
        setEditingPlan({ ...editingPlan!, [name]: value });
      }
    };

    const handleSwitchChange = (checked: boolean) => {
      if (isNew) {
        setNewPlan({ ...newPlan, is_popular: checked });
      } else {
        setEditingPlan({ ...editingPlan!, is_popular: checked });
      }
    };

    const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const featuresText = e.target.value;
      if (isNew) {
        setNewPlan({ ...newPlan, features: featuresText.split('\n').filter(Boolean) });
      } else {
        setEditingPlan({ ...editingPlan!, features: featuresText.split('\n').filter(Boolean) });
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`name-${isNew ? 'new' : plan.id}`}>Name</Label>
            <Input
              id={`name-${isNew ? 'new' : plan.id}`}
              name="name"
              value={plan.name}
              onChange={handleChange}
              placeholder="Plan name"
            />
          </div>
          <div>
            <Label htmlFor={`cta-${isNew ? 'new' : plan.id}`}>CTA Text</Label>
            <Input
              id={`cta-${isNew ? 'new' : plan.id}`}
              name="cta_text"
              value={plan.cta_text}
              onChange={handleChange}
              placeholder="Call to action text"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`description-${isNew ? 'new' : plan.id}`}>Description</Label>
          <Textarea
            id={`description-${isNew ? 'new' : plan.id}`}
            name="description"
            value={plan.description}
            onChange={handleChange}
            placeholder="Plan description"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`monthly-${isNew ? 'new' : plan.id}`}>Monthly Price</Label>
            <Input
              id={`monthly-${isNew ? 'new' : plan.id}`}
              name="price_monthly"
              type="number"
              value={plan.price_monthly}
              onChange={handleChange}
              placeholder="Monthly price"
            />
          </div>
          <div>
            <Label htmlFor={`annually-${isNew ? 'new' : plan.id}`}>Annual Price</Label>
            <Input
              id={`annually-${isNew ? 'new' : plan.id}`}
              name="price_annually"
              type="number"
              value={plan.price_annually}
              onChange={handleChange}
              placeholder="Annual price"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`currency-${isNew ? 'new' : plan.id}`}>Currency</Label>
            <Input
              id={`currency-${isNew ? 'new' : plan.id}`}
              name="currency"
              value={plan.currency}
              onChange={handleChange}
              placeholder="Currency code (e.g., INR)"
            />
          </div>
          <div>
            <Label htmlFor={`symbol-${isNew ? 'new' : plan.id}`}>Currency Symbol</Label>
            <Input
              id={`symbol-${isNew ? 'new' : plan.id}`}
              name="currency_symbol"
              value={plan.currency_symbol}
              onChange={handleChange}
              placeholder="Currency symbol (e.g., ₹)"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`features-${isNew ? 'new' : plan.id}`}>Features (one per line)</Label>
          <Textarea
            id={`features-${isNew ? 'new' : plan.id}`}
            name="features"
            value={Array.isArray(plan.features) ? plan.features.join('\n') : ''}
            onChange={handleFeaturesChange}
            placeholder="Enter features, one per line"
            rows={5}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`popular-${isNew ? 'new' : plan.id}`}
            checked={plan.is_popular}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor={`popular-${isNew ? 'new' : plan.id}`}>Mark as Popular</Label>
        </div>

        <div className="flex justify-end space-x-2">
          {isNew ? (
            <>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Plan</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Plan</Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing Plans</CardTitle>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        {isCreating && (
          <Card className="mb-6 border-dashed border-2">
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {renderPlanForm(newPlan, true)}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <div className="space-y-4">
              {plans.map(plan => (
                <Card key={plan.id} className={editingPlan?.id === plan.id ? "border-primary" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex space-x-2">
                      {editingPlan?.id !== plan.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(plan.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setEditingPlan(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleUpdate}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingPlan?.id === plan.id ? (
                      renderPlanForm(editingPlan)
                    ) : (
                      <div className="space-y-2">
                        <p className="text-muted-foreground">{plan.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xl">
                              {plan.currency_symbol}{plan.price_monthly.toLocaleString()}/month
                            </p>
                            <p className="text-sm text-muted-foreground">
                              or {plan.currency_symbol}{plan.price_annually.toLocaleString()}/month billed annually
                            </p>
                          </div>
                          {plan.is_popular && (
                            <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-full">
                              Popular
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <p className="font-semibold mb-1">Features:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="text-sm">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {plans.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pricing plans found. Click "Add Plan" to create one.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
