import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Users, BookOpen, MapPin, BarChart3, ArrowRight } from "lucide-react";

const DEFAULT_FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Classification",
    description:
      "Upload an image of your waste and our advanced AI instantly classifies it, providing recycling and reuse recommendations.",
    color: "from-emerald-50 to-emerald-100",
    iconBg: "bg-primary",
    link: "/classify",
  },
  {
    icon: Trophy,
    title: "Eco Points & Rewards",
    description:
      "Earn points for every eco-friendly action. Compete with friends and climb the leaderboard while making a difference.",
    color: "from-amber-50 to-amber-100",
    iconBg: "bg-accent",
    link: "/leaderboard",
  },
  {
    icon: Users,
    title: "Community Campaigns",
    description:
      "Create and join local environmental campaigns. Connect with like-minded individuals in your area.",
    color: "from-sky-50 to-sky-100",
    iconBg: "bg-secondary",
    link: "/campaigns",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description:
      "Access expert articles, tips, and guides on sustainable living, waste reduction, and environmental protection.",
    color: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-600",
    link: "/blog",
  },
  {
    icon: MapPin,
    title: "Smart Disposal Centers",
    description:
      "Find nearby recycling centers, disposal facilities, and collection points with our interactive map.",
    color: "from-green-50 to-green-100",
    iconBg: "bg-green-600",
    link: "/centers",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your environmental impact with detailed analytics and progress reports on your eco-journey.",
    color: "from-indigo-50 to-indigo-100",
    iconBg: "bg-indigo-600",
    link: "/profile",
  },
];

export default function FeaturesSection({ features = DEFAULT_FEATURES }) {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need for Sustainable Living</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines AI technology, community engagement, and educational resources to make
            waste management simple and rewarding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} hover-lift border-0 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white text-2xl h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <Link href={feature.link}>
                    <Button variant="ghost" className="p-0 h-auto font-semibold group">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}