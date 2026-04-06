import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  Battery,
  DollarSign,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/30", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-secondary/10 text-secondary border-secondary/30", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useUserBookings();
  const updateStatus = useUpdateBookingStatus();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleCancel = async (id: string) => {
    await updateStatus.mutateAsync({ id, status: "cancelled" });
    toast.success("Booking cancelled");
  };

  const handleComplete = async (id: string) => {
    await updateStatus.mutateAsync({ id, status: "completed" });
    toast.success("Booking marked as completed");
  };

  const activeBookings = bookings?.filter((b) => b.status === "pending" || b.status === "confirmed") || [];
  const pastBookings = bookings?.filter((b) => b.status === "completed" || b.status === "cancelled") || [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">My Bookings</span>
          </h1>
          <p className="text-muted-foreground">Manage your charging sessions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeBookings.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  ₹{bookings?.reduce((a, b) => a + Number(b.actual_cost || b.estimated_cost || 0), 0).toFixed(0) || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => {
                  const cfg = statusConfig[booking.status || "pending"];
                  const StatusIcon = cfg.icon;
                  return (
                    <Card key={booking.id} className="glass-card hover:shadow-lg transition-all">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-lg">{booking.station?.name || "Station"}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.station?.address}, {booking.station?.city}
                                </p>
                              </div>
                              <Badge variant="outline" className={cfg.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {cfg.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{format(new Date(booking.booking_date), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}</span>
                              </div>
                              {booking.estimated_kwh && (
                                <div className="flex items-center gap-2">
                                  <Battery className="w-4 h-4 text-muted-foreground" />
                                  <span>{Number(booking.estimated_kwh).toFixed(1)} kWh</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">₹{Number(booking.estimated_cost || 0).toFixed(0)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 sm:flex-col">
                            <Button
                              size="sm"
                              className="gradient-primary flex-1 sm:flex-none"
                              onClick={() => handleComplete(booking.id)}
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none text-destructive hover:text-destructive"
                              onClick={() => handleCancel(booking.id)}
                              disabled={updateStatus.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">No active bookings</p>
                  <p className="text-muted-foreground mb-4">Find a station and book your next charge</p>
                  <Link to="/dashboard">
                    <Button className="gradient-primary">Find Chargers</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => {
                  const cfg = statusConfig[booking.status || "completed"];
                  const StatusIcon = cfg.icon;
                  return (
                    <Card key={booking.id} className="glass-card">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold">{booking.station?.name || "Station"}</h3>
                              <Badge variant="outline" className={cfg.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {cfg.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(booking.booking_date), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                              </span>
                              <span className="font-semibold text-foreground">
                                ₹{Number(booking.actual_cost || booking.estimated_cost || 0).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="py-12 text-center">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">No past bookings yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
