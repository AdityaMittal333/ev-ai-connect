import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateStation } from "@/hooks/useStations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  MapPin,
  DollarSign,
  Clock,
  Camera,
  Sparkles,
  CheckCircle2,
  Home,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ListCharger() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const createStation = useCreateStation();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    chargerType: "",
    connectorType: "",
    power: "",
    price: "",
    description: "",
    amenities: [] as string[],
    operatingHoursStart: "06:00",
    operatingHoursEnd: "22:00",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to list a charger");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const amenitiesList = [
    "Covered Parking",
    "WiFi",
    "Restroom",
    "Cafe Nearby",
    "Security",
    "Wheelchair Accessible",
  ];

  const chargerTypes = [
    { value: "AC Level 1", label: "AC Level 1" },
    { value: "AC Level 2", label: "AC Level 2" },
    { value: "DC Fast Charge", label: "DC Fast Charge" },
  ];

  const connectorTypes = [
    { value: "Type 2", label: "Type 2" },
    { value: "CCS", label: "CCS" },
    { value: "CHAdeMO", label: "CHAdeMO" },
    { value: "Type 1", label: "Type 1" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.chargerType || 
        !formData.connectorType || !formData.power || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const powerNum = parseFloat(formData.power);
    const priceNum = parseFloat(formData.price.replace("₹", ""));

    if (isNaN(powerNum) || isNaN(priceNum)) {
      toast.error("Please enter valid numbers for power and price");
      return;
    }

    await createStation.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
      address: formData.address,
      city: formData.city,
      charger_type: formData.chargerType,
      connector_type: formData.connectorType,
      power_kw: powerNum,
      price_per_kwh: priceNum,
      amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
      operating_hours_start: formData.operatingHoursStart,
      operating_hours_end: formData.operatingHoursEnd,
    });

    navigate("/dashboard");
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Passive Income",
      description: "Make money from your unused charger when you're not using it",
    },
    {
      icon: Sparkles,
      title: "AI-Optimized Pricing",
      description: "Our AI suggests optimal pricing based on demand and location",
    },
    {
      icon: CheckCircle2,
      title: "Verified Users Only",
      description: "All users are verified and screened for your safety",
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Home className="w-3 h-3 mr-1" />
              Become a Host
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              List Your <span className="bg-gradient-primary bg-clip-text text-transparent">Charging Station</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your charger with the community and earn passive income while helping India's EV revolution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Charger Details</CardTitle>
              <CardDescription>
                Fill in the details about your charging station. Our AI will help optimize your listing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Station Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Green Energy Hub"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., Bangalore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Full Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter complete address with pincode"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="chargerType">
                      Charger Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.chargerType}
                      onValueChange={(value) => setFormData({ ...formData, chargerType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select charger type" />
                      </SelectTrigger>
                      <SelectContent>
                        {chargerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connectorType">
                      Connector Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.connectorType}
                      onValueChange={(value) => setFormData({ ...formData, connectorType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select connector type" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="power">
                      Power Output (kW) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="power"
                        type="number"
                        placeholder="e.g., 22"
                        value={formData.power}
                        onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price per kWh (₹) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="e.g., 12"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI suggests: ₹10-14 based on your area
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your charging station, parking instructions, and any other details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Amenities</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                amenities: [...formData.amenities, amenity],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                amenities: formData.amenities.filter((a) => a !== amenity),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={amenity} className="cursor-pointer">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Upload photos of your charging station</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or JPEG (max. 5MB each)
                    </p>
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">AI Listing Optimization</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI will analyze your listing and suggest improvements to maximize visibility
                          and bookings. You'll also get dynamic pricing recommendations based on demand.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="flex-1 gradient-primary"
                    disabled={createStation.isPending}
                  >
                    {createStation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Listing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        List My Charger
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "AI Verification",
                    description:
                      "Our AI will verify your listing details and location within 24 hours",
                  },
                  {
                    step: "2",
                    title: "Profile Review",
                    description: "Quick background check to ensure platform safety",
                  },
                  {
                    step: "3",
                    title: "Go Live",
                    description:
                      "Your charger will be visible to thousands of EV owners in your area",
                  },
                  {
                    step: "4",
                    title: "Start Earning",
                    description: "Receive bookings and start earning passive income!",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
