import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Star,
  Zap,
  Calendar,
  MapPin,
  TrendingUp,
  Leaf,
  Award,
  Battery,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react";

export default function Profile() {
  const userStats = {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    memberSince: "January 2024",
    totalCharges: 45,
    totalEarnings: "₹12,450",
    rating: 4.9,
    greenScore: 92,
    chargersListed: 1,
  };

  const recentCharges = [
    {
      station: "Green Energy Hub",
      date: "2 days ago",
      cost: "₹240",
      energy: "20 kWh",
      duration: "45 min",
    },
    {
      station: "Solar Charge Point",
      date: "5 days ago",
      cost: "₹180",
      energy: "18 kWh",
      duration: "35 min",
    },
    {
      station: "Home Charger Plus",
      date: "1 week ago",
      cost: "₹160",
      energy: "20 kWh",
      duration: "90 min",
    },
  ];

  const achievements = [
    { icon: Leaf, title: "Eco Warrior", description: "Charged during 50+ renewable peaks" },
    { icon: Star, title: "5-Star Host", description: "Maintained excellent host rating" },
    { icon: Zap, title: "Power User", description: "Completed 45 charging sessions" },
    { icon: Shield, title: "Verified Member", description: "Completed identity verification" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{userStats.name}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{userStats.email}</p>
                    <Badge variant="secondary" className="mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      Member since {userStats.memberSince}
                    </Badge>
                    <div className="flex items-center justify-center gap-1 mt-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{userStats.rating}</span>
                      <span className="text-sm text-muted-foreground">rating</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Green Score</span>
                        <span className="font-semibold">{userStats.greenScore}/100</span>
                      </div>
                      <Progress value={userStats.greenScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-2xl font-bold">{userStats.totalCharges}</p>
                        <p className="text-xs text-muted-foreground">Total Charges</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <MapPin className="w-5 h-5 text-secondary mx-auto mb-1" />
                        <p className="text-2xl font-bold">{userStats.chargersListed}</p>
                        <p className="text-xs text-muted-foreground">Chargers Listed</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6" variant="outline">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-2xl font-bold">{userStats.totalEarnings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Battery className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Energy</p>
                        <p className="text-2xl font-bold">890 kWh</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                        <p className="text-2xl font-bold">245 kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Charging History</CardTitle>
                  <CardDescription>Your latest charging sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCharges.map((charge, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{charge.station}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {charge.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {charge.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Battery className="w-3 h-3" />
                              {charge.energy}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{charge.cost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View All History
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-success" />
                    Green Energy Impact
                  </CardTitle>
                  <CardDescription>
                    Your contribution to sustainable energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Renewable Energy Usage</span>
                        <span className="font-semibold">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        You charged during renewable peak hours 32 times
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                        <Leaf className="w-5 h-5 text-success mb-2" />
                        <p className="text-2xl font-bold mb-1">32</p>
                        <p className="text-xs text-muted-foreground">Green Charges</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <TrendingUp className="w-5 h-5 text-primary mb-2" />
                        <p className="text-2xl font-bold mb-1">₹1,200</p>
                        <p className="text-xs text-muted-foreground">Green Rewards</p>
                      </div>
                      <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <Shield className="w-5 h-5 text-secondary mb-2" />
                        <p className="text-2xl font-bold mb-1">245 kg</p>
                        <p className="text-xs text-muted-foreground">CO₂ Prevented</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
