import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserBookings } from "@/hooks/useBookings";
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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: bookings, isLoading: bookingsLoading } = useUserBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const achievements = [
    { icon: Leaf, title: "Eco Warrior", description: "Charged during 50+ renewable peaks" },
    { icon: Star, title: "5-Star Host", description: "Maintained excellent host rating" },
    { icon: Zap, title: "Power User", description: "Completed 45 charging sessions" },
    { icon: Shield, title: "Verified Member", description: "Completed identity verification" },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

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
                    <h2 className="text-2xl font-bold mb-1">{profile.full_name || "User"}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                    <Badge variant="secondary" className="mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      Member since {format(new Date(profile.created_at), "MMMM yyyy")}
                    </Badge>
                    {profile.is_host && (
                      <Badge variant="default" className="ml-2 bg-success">
                        Host
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Green Score</span>
                        <span className="font-semibold">{profile.green_score || 0}/100</span>
                      </div>
                      <Progress value={profile.green_score || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-2xl font-bold">{profile.total_sessions || 0}</p>
                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Battery className="w-5 h-5 text-secondary mx-auto mb-1" />
                        <p className="text-2xl font-bold">{Number(profile.total_kwh_charged || 0).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">kWh Charged</p>
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
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">
                          ₹{bookings?.reduce((acc, b) => acc + Number(b.actual_cost || b.estimated_cost || 0), 0).toFixed(0) || 0}
                        </p>
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
                        <p className="text-2xl font-bold">{Number(profile.total_kwh_charged || 0).toFixed(0)} kWh</p>
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
                        <p className="text-2xl font-bold">{Number(profile.co2_saved_kg || 0).toFixed(0)} kg</p>
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
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold mb-1">{booking.station?.name || "Unknown Station"}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(booking.booking_date), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.start_time} - {booking.end_time}
                              </span>
                              {booking.estimated_kwh && (
                                <span className="flex items-center gap-1">
                                  <Battery className="w-3 h-3" />
                                  {booking.estimated_kwh} kWh
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ₹{booking.actual_cost || booking.estimated_cost || 0}
                            </p>
                            <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No charging sessions yet</p>
                      <p className="text-sm">Book your first charging session to get started!</p>
                    </div>
                  )}
                  {bookings && bookings.length > 5 && (
                    <Button className="w-full mt-4" variant="outline">
                      View All History
                    </Button>
                  )}
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
                        <span className="font-semibold">{profile.green_score || 0}%</span>
                      </div>
                      <Progress value={profile.green_score || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on charging during renewable peak hours
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                        <Leaf className="w-5 h-5 text-success mb-2" />
                        <p className="text-2xl font-bold mb-1">{profile.total_sessions || 0}</p>
                        <p className="text-xs text-muted-foreground">Green Charges</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <TrendingUp className="w-5 h-5 text-primary mb-2" />
                        <p className="text-2xl font-bold mb-1">₹{((profile.green_score || 0) * 10).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Green Rewards</p>
                      </div>
                      <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <Shield className="w-5 h-5 text-secondary mb-2" />
                        <p className="text-2xl font-bold mb-1">{Number(profile.co2_saved_kg || 0).toFixed(0)} kg</p>
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
