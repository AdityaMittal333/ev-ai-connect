import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStation } from "@/hooks/useStations";
import { useStationReviews, useCreateReview } from "@/hooks/useReviews";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { StationAIAnalysis } from "@/components/StationAIAnalysis";

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: station, isLoading } = useStation(id || "");
  const { data: reviews } = useStationReviews(id || "");
  const createBooking = useCreateBooking();
  const createReview = useCreateReview();

  const [bookingData, setBookingData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a station");
      navigate("/auth");
      return;
    }

    if (!bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      toast.error("Please fill in all booking details");
      return;
    }

    const estimatedHours = 
      (parseInt(bookingData.endTime.split(":")[0]) - parseInt(bookingData.startTime.split(":")[0])) +
      (parseInt(bookingData.endTime.split(":")[1]) - parseInt(bookingData.startTime.split(":")[1])) / 60;
    
    const estimatedKwh = estimatedHours * Number(station?.power_kw || 0);
    const estimatedCost = estimatedKwh * Number(station?.price_per_kwh || 0);

    await createBooking.mutateAsync({
      station_id: id!,
      booking_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      estimated_kwh: estimatedKwh,
      estimated_cost: estimatedCost,
    });

    setBookingDialogOpen(false);
    setBookingData({ date: "", startTime: "", endTime: "" });
  };

  const handleReview = async () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      navigate("/auth");
      return;
    }

    await createReview.mutateAsync({
      station_id: id!,
      rating: reviewData.rating,
      comment: reviewData.comment || undefined,
    });

    setReviewDialogOpen(false);
    setReviewData({ rating: 5, comment: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Station not found</p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                      {station.address}, {station.city}
                    </CardDescription>
                  </div>
                  <Badge variant="default" className={station.is_available ? "bg-success" : ""}>
                    {station.is_available ? "Available" : "In Use"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{Number(station.avg_rating || 0).toFixed(1)}</span>
                    <span className="text-muted-foreground">({station.total_reviews || 0} reviews)</span>
                  </div>
                  {station.is_verified && (
                    <>
                      <Separator orientation="vertical" className="h-6" />
                      <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </>
                  )}
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
                    <p className="font-bold text-xl">₹{station.price_per_kwh}/kWh</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <Clock className="w-5 h-5 text-secondary mb-2" />
                    <p className="text-sm text-muted-foreground">Hours</p>
                    <p className="font-bold text-lg">
                      {station.operating_hours_start?.slice(0, 5)} - {station.operating_hours_end?.slice(0, 5)}
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <Zap className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm text-muted-foreground">Power</p>
                    <p className="font-bold text-xl">{station.power_kw} kW</p>
                  </div>
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <Battery className="w-5 h-5 text-success mb-2" />
                    <p className="text-sm text-muted-foreground">Charger</p>
                    <p className="font-bold text-lg">{station.charger_type}</p>
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
                    <span className="font-bold">{station.ai_score || 0}/100</span>
                  </div>
                  <Progress value={station.ai_score || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Match based on your location, battery level, and preferences
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-success" />
                      Green Energy Score
                    </span>
                    <span className="font-bold">{station.green_score || 0}/100</span>
                  </div>
                  <Progress value={station.green_score || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Renewable energy availability during charging hours
                  </p>
                </div>
              </CardContent>
            </Card>

            <StationAIAnalysis station={station} />

            {station.amenities && station.amenities.length > 0 && (
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
            )}

            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews</CardTitle>
                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Write a Review</DialogTitle>
                        <DialogDescription>
                          Share your experience at {station.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                className="p-1"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    star <= reviewData.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Comment (optional)</Label>
                          <Textarea
                            placeholder="Tell others about your experience..."
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          />
                        </div>
                        <Button
                          onClick={handleReview}
                          className="w-full gradient-primary"
                          disabled={createReview.isPending}
                        >
                          {createReview.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Submit Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{review.user?.full_name || "Anonymous"}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">
                                {format(new Date(review.created_at), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
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
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold text-primary">₹{station.price_per_kwh}/kWh</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {station.charger_type} • {station.power_kw} kW
                  </p>
                </div>

                <div className="space-y-3">
                  <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-primary" size="lg" disabled={!station.is_available}>
                        <Calendar className="w-4 h-4 mr-2" />
                        {station.is_available ? "Book Now" : "Currently Unavailable"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book {station.name}</DialogTitle>
                        <DialogDescription>
                          Select your preferred date and time
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={bookingData.startTime}
                              onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={bookingData.endTime}
                              onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleBooking}
                          className="w-full gradient-primary"
                          disabled={createBooking.isPending}
                        >
                          {createBooking.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                    <p className="font-semibold">{station.host?.full_name || "Host"}</p>
                    <p className="text-sm text-muted-foreground">Verified Host</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Member since {format(new Date(station.created_at), "yyyy")}</p>
                  <p>Total Bookings: {station.total_bookings || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
