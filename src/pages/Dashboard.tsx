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
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStations } from "@/hooks/useStations";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { DemandForecastChart } from "@/components/DemandForecastChart";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { data: stations, isLoading } = useStations();
  const { data: profile } = useProfile();
  const { user } = useAuth();

  const filteredStations = stations?.filter((station) => {
    const matchesSearch = 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "available") return matchesSearch && station.is_available;
    if (filterType === "fast") return matchesSearch && Number(station.power_kw) >= 50;
    if (filterType === "green") return matchesSearch && (station.green_score || 0) >= 80;
    
    return matchesSearch;
  }) || [];

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
                  <p className="text-sm text-muted-foreground">
                    {user ? "Sessions Completed" : "Battery Level"}
                  </p>
                  <p className="text-2xl font-bold">
                    {user ? profile?.total_sessions || 0 : "68%"}
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    {user ? "Energy Used" : "Range Available"}
                  </p>
                  <p className="text-2xl font-bold">
                    {user ? `${Number(profile?.total_kwh_charged || 0).toFixed(0)} kWh` : "142 km"}
                  </p>
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
                  <p className="text-2xl font-bold">{profile?.green_score || 85}/100</p>
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

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                AI Recommended for You
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <Card
                  key={station.id}
                  className={`glass-card hover:shadow-lg transition-all duration-300 ${
                    !station.is_available ? "opacity-60" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{station.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-base">
                          <MapPin className="w-4 h-4" />
                          {station.address}, {station.city}
                        </CardDescription>
                      </div>
                      {station.is_available ? (
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
                        <p className="font-semibold text-lg">₹{station.price_per_kwh}/kWh</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Power</p>
                        <p className="font-semibold text-lg flex items-center gap-1">
                          <Zap className="w-4 h-4 text-primary" />
                          {station.power_kw} kW
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Charger Type</p>
                        <p className="font-semibold">{station.charger_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Connector</p>
                        <p className="font-semibold">{station.connector_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{Number(station.avg_rating || 0).toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({station.total_reviews || 0} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Score: {station.ai_score || 0}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-success" />
                        Green: {station.green_score || 0}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/station/${station.id}`} className="flex-1">
                        <Button className="w-full" variant={station.is_available ? "default" : "secondary"}>
                          View Details
                        </Button>
                      </Link>
                      {station.is_available && (
                        <Button className="gradient-primary">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">No charging stations found</p>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search or filters" 
                      : "Be the first to list a charger in your area!"}
                  </p>
                  <Link to="/list-charger">
                    <Button className="gradient-primary">List Your Charger</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-20 h-fit">
            <AIInsightsPanel />
            <DemandForecastChart />
          </div>
        </div>
      </div>
    </div>
  );
}
