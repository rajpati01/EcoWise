import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Camera, Users } from "lucide-react";

export default function CTASection({ ctaStats }) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join our community of eco-warriors today and start your journey towards sustainable living. Every small action counts!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 h-auto text-lg font-bold">
                <Users className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/classify">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 h-auto text-lg font-bold">
                <Camera className="mr-2 h-5 w-5" />
                Try Classifier
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-emerald-100">
            {ctaStats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
