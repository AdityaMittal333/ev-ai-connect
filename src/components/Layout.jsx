import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X, User, Home, MapPin, Plus } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Find Chargers", href: "/dashboard", icon: MapPin },
    { name: "List Your Charger", href: "/list-charger", icon: Plus },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-border/50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center animate-glow">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ChargeShare
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="default" size="sm" className="gradient-primary">
                Get Started
              </Button>
            </div>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button variant="default" size="sm" className="w-full gradient-primary">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ChargeShare
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                An AI-powered Peer-to-Peer EV Charging Network that learns, predicts, and
                optimizes charging for India's EV future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/dashboard" className="hover:text-primary transition-colors">
                    Find Chargers
                  </Link>
                </li>
                <li>
                  <Link to="/list-charger" className="hover:text-primary transition-colors">
                    List Your Charger
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-primary transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>© 2025 ChargeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
