import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Star,
  Zap,
  Navigation,
  Battery,
  Clock,
  TrendingDown,
  Sparkles,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

const mockStations = [
  {
    id: 1,
    name: "Green Energy Hub",
    address: "Koramangala, Bangalore",
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
  },
  {
    id: 2,
    name: "Solar Charge Point",
    address: "Indiranagar, Bangalore",
    distance: "1.2 km",
    price: "₹10/kWh",
    rating: 4.9,
    reviews: 89,
    available: true,
    chargerType: "CCS DC",
    power: "50 kW",
    aiScore: 92,
    greenScore: 95,
    estimatedTime: "30 min",
  },
  {
    id: 3,
    name: "Quick Charge Station",
    address: "Whitefield, Bangalore",
    distance: "2.5 km",
    price: "₹15/kWh",
    rating: 4.7,
    reviews: 156,
    available: false,
    chargerType: "Type 2 AC",
    power: "11 kW",
    aiScore: 88,
    greenScore: 75,
    estimatedTime: "60 min",
  },
  {
    id: 4,
    name: "Home Charger Plus",
    address: "HSR Layout, Bangalore",
    distance: "1.8 km",
    price: "₹8/kWh",
    rating: 5.0,
    reviews: 67,
    available: true,
    chargerType: "Type 2 AC",
    power: "7.4 kW",
    aiScore: 90,
    greenScore: 92,
    estimatedTime: "90 min",
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find <span className="bg-gradient-primary bg-clip-text text-transparent">Nearby Chargers</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered recommendations based on your location and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Battery Level</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Range Available</p>
                  <p className="text-2xl font-bold">142 km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Green Score</p>
                  <p className="text-2xl font-bold">85/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chargers</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="fast">Fast Charging</SelectItem>
                  <SelectItem value="green">High Green Score</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gradient-primary">
                <Navigation className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                AI Recommended for You
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </h2>
            </div>

            {mockStations.map((station) => (
              <Card
                key={station.id}
                className={`glass-card hover:shadow-lg transition-all duration-300 ${
                  !station.available ? "opacity-60" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{station.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-base">
                        <MapPin className="w-4 h-4" />
                        {station.address} • {station.distance}
                      </CardDescription>
                    </div>
                    {station.available ? (
                      <Badge variant="default" className="bg-success">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary">In Use</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-lg">{station.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Time</p>
                      <p className="font-semibold text-lg flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {station.estimatedTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Charger Type</p>
                      <p className="font-semibold">{station.chargerType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Power</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Zap className="w-4 h-4 text-primary" />
                        {station.power}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{station.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({station.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Score: {station.aiScore}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-success" />
                      Green: {station.greenScore}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/station/${station.id}`} className="flex-1">
                      <Button className="w-full" variant={station.available ? "default" : "secondary"}>
                        View Details
                      </Button>
                    </Link>
                    {station.available && (
                      <Button className="gradient-primary">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <Card className="glass-card overflow-hidden">
              <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div className="relative z-10 text-center p-8">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">
                    Map integration would display all nearby charging stations with real-time availability
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">Best Time to Charge</p>
                  <p className="text-xs text-muted-foreground">
                    Renewable energy peak at 2:00 PM - 4:00 PM today
                  </p>
                </div>
                <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <p className="text-sm font-medium mb-1">Battery Health Tip</p>
                  <p className="text-xs text-muted-foreground">
                    Your battery is in optimal condition. Charging to 80% extends lifespan.
                  </p>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <p className="text-sm font-medium mb-1">Traffic Update</p>
                  <p className="text-xs text-muted-foreground">
                    Light traffic on route to nearest station - ideal time to charge
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
