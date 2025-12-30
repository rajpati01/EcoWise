import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Camera, Recycle } from "lucide-react";

function StatItem({ label, value }) {
  return (
    <div className="space-y-1 text-center lg:text-left">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

export default function HeroSection({ stats }) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-sky-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Smart Waste Management for a
              <span className="text-primary"> Greener Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of eco-warriors using AI-powered waste
              classification, earning rewards, and building sustainable
              communities together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/classify">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto">
                  <Camera className="mr-2 h-5 w-5" />
                  Classify Waste Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4 h-auto"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              {stats.map((s, i) => (
                <StatItem key={i} label={s.label} value={s.value} />
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=800"
              alt="EcoWise mobile app interface"
              className="rounded-3xl shadow-2xl w-full max-w-md mx-auto"
              loading="lazy"
            />

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 hidden lg:block animate-bounce">
              <div className="flex items-center space-x-2">
                <Award className="text-accent text-xl" />
                <div>
                  <div className="font-semibold text-gray-900">+50 Points</div>
                  <div className="text-sm text-gray-600">Plastic Recycled</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 hidden lg:block animate-pulse">
              <div className="flex items-center space-x-2">
                <Recycle className="text-primary text-xl" />
                <div>
                  <div className="font-semibold text-gray-900">95% Accuracy</div>
                  <div className="text-sm text-gray-600">AI Classification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}