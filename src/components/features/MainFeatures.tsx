
import { MessageSquare, BarChart, Zap, Shield, Users, Sparkles } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: any;
  color: string;
}

const mainFeatures: Feature[] = [
  {
    title: "AI-Powered Chatbots",
    description: "Our intelligent conversation agents understand context and user intent to provide natural responses that feel like real human interactions.",
    icon: MessageSquare,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  },
  {
    title: "Advanced Analytics",
    description: "Gain comprehensive insights and metrics to track performance and identify opportunities for improvement in your social media strategy.",
    icon: BarChart,
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  },
  {
    title: "24/7 Automation",
    description: "Ensure your social media never sleeps with round-the-clock automated responses and engagement that works while you don't.",
    icon: Zap,
    color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  },
  {
    title: "Enterprise Security",
    description: "Rest easy with bank-grade encryption and data protection measures to keep your information and your customers' data secure.",
    icon: Shield,
    color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  },
  {
    title: "Multi-Platform Support",
    description: "Seamlessly integrate with Instagram, WhatsApp, and Facebook (coming soon) to manage all your social channels from one dashboard.",
    icon: Users,
    color: "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300",
  },
  {
    title: "Custom AI Training",
    description: "Train your AI with your brand voice and specific responses to create authentic interactions that align with your company identity.",
    icon: Sparkles,
    color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  },
];

const MainFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {mainFeatures.map((feature, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl border border-border/40 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group scroll-reveal"
          style={{ transitionDelay: `${(index % 3) * 100}ms` }}
        >
          <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MainFeatures;

