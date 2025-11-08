
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Phone, MapPin, Clock, Calendar, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  interest: z.enum(["free_trial", "basic_plan", "enterprise", "other"], {
    message: "Please select your interest.",
  }),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addContact } = useAdmin();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      interest: "free_trial",
      company: "",
      phone: "",
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Make sure we're passing all required fields
      addContact({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: `Interest: ${values.interest}\nCompany: ${values.company || 'Not provided'}\n\n${values.message}`,
      });
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  const faqs = [
    {
      question: "How quickly can I get started with Automake?",
      answer: "You can start using Automake immediately after signing up. Our onboarding process is designed to get you up and running within minutes. For more complex setups, our support team is available to assist.",
    },
    {
      question: "Do I need technical skills to use Automake?",
      answer: "No technical skills are required. Our platform is designed with a user-friendly interface that makes it easy for anyone to set up and manage their social media automation.",
    },
    {
      question: "Can I customize the AI responses?",
      answer: "Yes, you can fully customize the AI responses to match your brand voice and specific requirements. Our platform learns from your examples and guidelines to maintain consistent communication.",
    },
    {
      question: "Is there a limit to the number of messages the AI can handle?",
      answer: "Our plans include different message volume allowances. The Free Trial has a limited number, while the Basic and Enterprise plans offer higher volumes suitable for most businesses.",
    },
  ];

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions about our platform? Ready to start your free trial? We're here to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="order-2 lg:order-1 scroll-reveal">
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-8">
                  <TabsTrigger value="contact">Contact Us</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contact" className="bg-card border border-border/50 rounded-xl p-6">
                  <h2 className="font-semibold text-xl mb-6">Send us a message</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone <span className="text-muted-foreground">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company <span className="text-muted-foreground">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="interest"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>I'm interested in:</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="free_trial" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Starting a free trial
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="basic_plan" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Basic Plan (₹2,000/month)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="enterprise" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Enterprise Plan (₹6,000/month)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Something else
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your social media needs..." 
                                className="resize-none min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="support" className="bg-card border border-border/50 rounded-xl p-6">
                  <h2 className="font-semibold text-xl mb-6">Support Options</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-muted-foreground mb-1">For general inquiries and non-urgent issues</p>
                        <a href="mailto:support@automake.com" className="text-primary hover:underline">
                          support@automake.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-muted-foreground mb-1">Available 24/7 for quick assistance</p>
                        <Button variant="outline" size="sm">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-muted-foreground mb-1">For Enterprise customers and urgent issues</p>
                        <a href="tel:+15551234567" className="text-primary hover:underline">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Schedule a Demo</h3>
                        <p className="text-muted-foreground mb-1">Get a personalized walkthrough of our platform</p>
                        <Button variant="outline" size="sm">
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-12">
                <h2 className="font-semibold text-xl mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-card border border-border/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 scroll-reveal">
              <div className="bg-card border border-border/50 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-xl mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    
                    
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground mb-1">For general inquiries:</p>
                      <a href="mailto:automake.help@gmail.com" className="text-primary hover:underline">
                        automake.help@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground mb-1">Monday to Friday, 9am - 6pm PST</p>
                      <a href="tel:+916284209052" className="text-primary hover:underline">
                        +91 6284209052
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                        Saturday: 10:00 AM - 4:00 PM PST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
