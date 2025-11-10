import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Star,
  Zap,
  Navigation,
  Battery,
  Clock,
  TrendingDown,
  Sparkles,
  Shield,
  Calendar,
  DollarSign,
  Phone,
  User,
  Leaf,
  ArrowLeft,
} from "lucide-react";

export default function StationDetails() {
  const { id } = useParams();

  const station = {
    id: 1,
    name: "Green Energy Hub",
    address: "123 Main Street, Koramangala, Bangalore, Karnataka 560034",
    distance: "0.8 km",
    price: "₹12/kWh",
    rating: 4.8,
    reviews: 124,
    available: true,
    chargerType: "Type 2 AC",
    power: "22 kW",
    aiScore: 95,
    greenScore: 88,
    estimatedTime: "45 min",
    host: "Rajesh Kumar",
    hostRating: 4.9,
    hostChargers: 2,
    amenities: ["Covered Parking", "WiFi", "Restroom", "Cafe Nearby"],
    availability: [
      { day: "Monday", slots: "24/7" },
      { day: "Tuesday", slots: "24/7" },
      { day: "Wednesday", slots: "24/7" },
      { day: "Thursday", slots: "24/7" },
      { day: "Friday", slots: "24/7" },
      { day: "Saturday", slots: "24/7" },
      { day: "Sunday", slots: "24/7" },
    ],
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{station.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-base">
                      <MapPin className="w-4 h-4" />
                      {station.address}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="bg-success text-lg px-4 py-2">
                    Available
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{station.rating}</span>
                    <span className="text-muted-foreground">({station.reviews} reviews)</span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="text-muted-foreground">{station.distance} away</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="aspect-video bg-muted/30 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="relative z-10 text-center">
                    <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold">Station Location</p>
                    <p className="text-sm text-muted-foreground">Map view with exact location</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <DollarSign className="w-5 h-5 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-bold text-xl">{station.price}</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <Clock className="w-5 h-5 text-secondary mb-2" />
                    <p className="text-sm text-muted-foreground">Est. Time</p>
                    <p className="font-bold text-xl">{station.estimatedTime}</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <Zap className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm text-muted-foreground">Power</p>
                    <p className="font-bold text-xl">{station.power}</p>
                  </div>
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <Battery className="w-5 h-5 text-success mb-2" />
                    <p className="text-sm text-muted-foreground">Charger</p>
                    <p className="font-bold text-lg">{station.chargerType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI Match Score</span>
                    <span className="font-bold">{station.aiScore}/100</span>
                  </div>
                  <Progress value={station.aiScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Excellent match based on your location, battery level, and preferences
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-success" />
                      Green Energy Score
                    </span>
                    <span className="font-bold">{station.greenScore}/100</span>
                  </div>
                  <Progress value={station.greenScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    High renewable energy availability during charging hours
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      Battery Health Impact
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Optimal charging speed for long-term battery health
                    </p>
                  </div>
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Cost Optimization
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Great value - 15% below average area pricing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {station.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card sticky top-20">
              <CardHeader>
                <CardTitle className="text-2xl">Book This Station</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Estimated Cost</span>
                    <span className="text-2xl font-bold text-primary">₹240</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on 20 kWh charging session
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full gradient-primary" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button className="w-full" variant="outline" size="lg">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button className="w-full" variant="secondary" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Host
                  </Button>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Safety & Trust
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                      <span>AI-verified host with excellent track record</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                      <span>24/7 support available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About the Host
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{station.host}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{station.hostRating} rating</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Member since 2023</p>
                  <p>{station.hostChargers} charging points</p>
                  <p>Verified host badge</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
