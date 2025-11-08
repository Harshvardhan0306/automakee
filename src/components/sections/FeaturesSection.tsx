
import { MessageSquare, BarChart, Zap, Shield, Users, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI-Powered Chatbots",
    description: "Intelligent conversation agents that understand context and user intent to provide natural responses.",
    icon: MessageSquare,
  },
  {
    title: "Advanced Analytics",
    description: "Comprehensive insights and metrics to track performance and identify opportunities for improvement.",
    icon: BarChart,
  },
  {
    title: "24/7 Automation",
    description: "Ensure your social media never sleeps with round-the-clock automated responses and engagement.",
    icon: Zap,
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption and data protection measures to keep your information secure.",
    icon: Shield,
  },
  {
    title: "Multi-Platform Support",
    description: "Seamlessly integrate with Instagram, WhatsApp, and Facebook (coming soon) to manage all channels.",
    icon: Users,
  },
  {
    title: "Custom AI Training",
    description: "Train your AI with your brand voice and specific responses to create authentic interactions.",
    icon: Sparkles,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-secondary/40 dark:bg-secondary/5 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Powerful Features for Modern Social Media
          </h2>
          <p className="text-muted-foreground text-lg">
            Our comprehensive suite of tools designed to elevate your social media presence
            and streamline your engagement strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl border border-border/40 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group scroll-reveal"
              style={{ transitionDelay: `${(index % 3) * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 lg:mt-32 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1 scroll-reveal">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Natural Language Processing
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our advanced AI understands the nuances of human communication, allowing for more 
              natural and context-aware conversations with your audience.
            </p>
            <ul className="space-y-3">
              {[
                "Context-aware responses that feel human",
                "Multi-language support for global reach",
                "Sentiment analysis to gauge customer mood",
                "Intent recognition for better understanding",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-3 h-6 w-6 text-green-500 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2 scroll-reveal">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
              alt="Natural Language Processing"
              className="rounded-2xl shadow-lg border border-border/40 aspect-video object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
