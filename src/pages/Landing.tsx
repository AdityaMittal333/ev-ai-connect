import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Zap,
  TrendingDown,
  MapPin,
  Battery,
  Leaf,
  Shield,
  DollarSign,
  BarChart3,
  Navigation,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import aiNetworkImage from "@/assets/ai-network.png";
import evChargingImage from "@/assets/ev-charging.jpg";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Smart Matching",
      description:
        "Our AI analyzes location, traffic, battery %, price, and availability to recommend the perfect charging point for you.",
    },
    {
      icon: DollarSign,
      title: "Dynamic Pricing",
      description:
        "Fair pricing that adapts to demand in real-time, ensuring both hosts and guests get the best value.",
    },
    {
      icon: Battery,
      title: "Battery Health Predictor",
      description:
        "ML models help you extend your battery lifespan by recommending optimal charging times and durations.",
    },
    {
      icon: Navigation,
      title: "Route Optimization",
      description:
        "Energy-efficient route planning with optimal charging stops based on real-time traffic and grid load.",
    },
    {
      icon: Leaf,
      title: "Green AI Scoring",
      description:
        "Get rewarded for charging during renewable energy surplus hours to promote sustainable energy use.",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description:
        "Advanced anomaly detection ensures trust and safety by flagging suspicious activities.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account in seconds",
    },
    {
      step: "2",
      title: "Find or List",
      description: "Discover chargers or list your own",
    },
    {
      step: "3",
      title: "AI Matches You",
      description: "Get personalized recommendations",
    },
    {
      step: "4",
      title: "Charge & Earn",
      description: "Save on charging or earn from sharing",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Charging Points" },
    { value: "50,000+", label: "Active Users" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "₹500Cr+", label: "Saved by Users" },
  ];

  return (
    <div className="min-h-screen">
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(45, 212, 191, 0.9) 0%, rgba(16, 185, 129, 0.8) 50%, rgba(5, 150, 105, 0.9) 100%), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Badge variant="secondary" className="mb-6 animate-float">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered P2P Charging Network
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            India's Smartest EV
            <br />
            <span className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">
              Charging Network
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Share your charger, find nearby stations, and let AI optimize every charge. The
            future of EV charging is peer-to-peer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6 w-full sm:w-auto">
                <MapPin className="w-5 h-5 mr-2" />
                Find Chargers
              </Button>
            </Link>
            <Link to="/list-charger">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 w-full sm:w-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                List Your Charger
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-xl text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Intelligent Charging,
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Simplified
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI learns, predicts, and optimizes every aspect of your charging experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-card hover:shadow-lg transition-all duration-300 border-border/50"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <BarChart3 className="w-3 h-3 mr-1" />
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Get Started in
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  4 Simple Steps
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join India's fastest-growing P2P EV charging community powered by AI
              </p>

              <div className="space-y-6">
                {steps.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/dashboard">
                <Button size="lg" className="mt-8 gradient-primary">
                  Get Started Now
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src={aiNetworkImage}
                alt="AI Network"
                className="rounded-2xl shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <img
                src={evChargingImage}
                alt="EV Charging"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">
                <Leaf className="w-3 h-3 mr-1" />
                Sustainable Future
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Charge Green,
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Get Rewarded
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our Green AI Scoring system incentivizes charging during renewable energy peaks,
                helping build a sustainable EV ecosystem for India.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time renewable energy tracking",
                  "Smart charging during solar/wind peaks",
                  "Earn rewards for sustainable charging",
                  "Reduce grid load and carbon footprint",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Join the Future?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of India's AI-powered P2P EV charging revolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="hero"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 w-full sm:w-auto"
              >
                Find Chargers Now
              </Button>
            </Link>
            <Link to="/list-charger">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto"
              >
                List Your Charger
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
