
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How does the AI chatbot work?",
    answer:
      "Our AI chatbot uses advanced natural language processing to understand and respond to messages. It learns from your brand voice and previous interactions to provide personalized, contextually relevant responses that feel authentic and human-like.",
  },
  {
    question: "Can I customize the automated responses?",
    answer:
      "Absolutely! You have full control over your AI's responses. You can train it with your brand guidelines, create custom workflows based on keywords, and even review and refine its learning over time for continuous improvement.",
  },
  {
    question: "Which social media platforms are supported?",
    answer:
      "Currently, we support Instagram with full integration. WhatsApp Business API integration is available on our Enterprise plan. We're actively working on adding Facebook Messenger support, which will be available soon.",
  },
  {
    question: "Is there a limit to the number of messages handled?",
    answer:
      "The Free Trial includes handling up to 100 messages. Our Basic Plan supports up to 1,000 messages per month, while the Enterprise Plan offers unlimited message handling to accommodate businesses of any size.",
  },
  {
    question: "How secure is my data on your platform?",
    answer:
      "Security is our top priority. We use bank-grade encryption for all data, comply with GDPR and other privacy regulations, and never share your data with third parties. You retain full ownership of all your data and conversations.",
  },
  {
    question: "Can I switch plans or cancel my subscription?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. If you upgrade, the changes take effect immediately. If you downgrade or cancel, the changes will apply at the end of your current billing cycle.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-20 md:py-32" id="faq">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our platform and services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto scroll-reveal">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/40">
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12 md:mt-16 scroll-reveal">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <Button asChild variant="outline" className="rounded-lg">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
