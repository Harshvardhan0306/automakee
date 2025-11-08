
import { Smartphone, Globe, Gauge, PieChart, Briefcase, Database } from "lucide-react";

const additionalFeatures = [
  {
    title: "Mobile Optimization",
    description: "Manage your social media on the go with our responsive mobile interface.",
    icon: Smartphone,
  },
  {
    title: "Global Reach",
    description: "Supports multiple languages to help you connect with audiences worldwide.",
    icon: Globe,
  },
  {
    title: "Performance Metrics",
    description: "Track response times, engagement rates, and conversion statistics.",
    icon: Gauge,
  },
  {
    title: "Visual Analytics",
    description: "Beautiful charts and graphs that make data interpretation simple.",
    icon: PieChart,
  },
  {
    title: "Enterprise Solutions",
    description: "Custom packages for large businesses with specific requirements.",
    icon: Briefcase,
  },
  {
    title: "API Integration",
    description: "Connect with your existing tools and create a seamless workflow.",
    icon: Database,
  },
];

const AdditionalFeatures = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {additionalFeatures.map((feature, index) => (
        <div 
          key={index}
          className="bg-card p-6 rounded-xl border border-border/50 flex gap-4 hover:shadow-md transition-all duration-200 scroll-reveal"
          style={{ transitionDelay: `${(index % 3) * 100}ms` }}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <feature.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalFeatures;

