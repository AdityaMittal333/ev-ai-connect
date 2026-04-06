import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Leaf,
  Zap,
  Star,
  Shield,
  Target,
  Gift,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Battery,
  Sparkles,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";


const BADGES = [
  { id: "first_charge", icon: Zap, title: "First Spark", description: "Complete your first charge", threshold: 1, field: "total_sessions" as const, color: "text-primary" },
  { id: "eco_starter", icon: Leaf, title: "Eco Starter", description: "Reach a Green Score of 50+", threshold: 50, field: "green_score" as const, color: "text-success" },
  { id: "power_user", icon: Battery, title: "Power User", description: "Charge 100+ kWh total", threshold: 100, field: "total_kwh_charged" as const, color: "text-secondary" },
  { id: "eco_warrior", icon: Shield, title: "Eco Warrior", description: "Reach Green Score of 80+", threshold: 80, field: "green_score" as const, color: "text-accent" },
  { id: "veteran", icon: Star, title: "Veteran Charger", description: "Complete 25 sessions", threshold: 25, field: "total_sessions" as const, color: "text-warning" },
  { id: "carbon_hero", icon: Target, title: "Carbon Hero", description: "Save 50+ kg CO₂", threshold: 50, field: "co2_saved_kg" as const, color: "text-success" },
  { id: "legend", icon: Crown, title: "EV Legend", description: "Complete 100 sessions", threshold: 100, field: "total_sessions" as const, color: "text-primary" },
  { id: "mega_saver", icon: TrendingUp, title: "Mega Saver", description: "Charge 500+ kWh", threshold: 500, field: "total_kwh_charged" as const, color: "text-secondary" },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Arjun M.", greenScore: 97, sessions: 142, co2Saved: 284, streak: 21 },
  { rank: 2, name: "Priya S.", greenScore: 95, sessions: 128, co2Saved: 256, streak: 18 },
  { rank: 3, name: "Rahul K.", greenScore: 93, sessions: 115, co2Saved: 230, streak: 15 },
  { rank: 4, name: "Sneha P.", greenScore: 91, sessions: 98, co2Saved: 196, streak: 12 },
  { rank: 5, name: "Vikram J.", greenScore: 89, sessions: 87, co2Saved: 174, streak: 10 },
  { rank: 6, name: "Ananya R.", greenScore: 87, sessions: 76, co2Saved: 152, streak: 8 },
  { rank: 7, name: "Karthik N.", greenScore: 85, sessions: 65, co2Saved: 130, streak: 7 },
  { rank: 8, name: "Divya L.", greenScore: 83, sessions: 54, co2Saved: 108, streak: 5 },
];

const REWARDS = [
  { title: "₹50 Charging Credit", cost: 500, icon: Gift, description: "Redeem for your next charge" },
  { title: "Priority Booking", cost: 300, icon: Calendar, description: "Skip the queue for 7 days" },
  { title: "Premium Badge", cost: 1000, icon: Award, description: "Exclusive profile badge" },
  { title: "Free Fast Charge", cost: 800, icon: Zap, description: "One free fast charge session" },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{rank}</span>;
}

export default function Leaderboard() {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("leaderboard");

  const userPoints = profile
    ? (profile.total_sessions || 0) * 10 + (profile.green_score || 0) * 5 + Math.floor(Number(profile.co2_saved_kg || 0)) * 3
    : 0;

  const streak = Math.min(profile?.total_sessions || 0, 7);

  const unlockedBadges = BADGES.filter((badge) => {
    const val = Number(profile?.[badge.field] || 0);
    return val >= badge.threshold;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Rewards & Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">
            Earn points, unlock badges, and climb the ranks by charging green
          </p>
        </div>

        {/* Points & Streak Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Points</p>
                  <p className="text-2xl font-bold">{userPoints.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Charging Streak</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{streak} days</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${i < streak ? "bg-destructive" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-2xl font-bold">{unlockedBadges.length}/{BADGES.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="leaderboard">
              <Trophy className="w-4 h-4 mr-2" /> Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="w-4 h-4 mr-2" /> Badges
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="w-4 h-4 mr-2" /> Rewards
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Top Green Chargers
                </CardTitle>
                <CardDescription>Ranked by Green Score, sessions, and CO₂ saved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_LEADERBOARD.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                        entry.rank <= 3 ? "bg-primary/5 border border-primary/20" : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <RankIcon rank={entry.rank} />
                      <div className="flex-1">
                        <p className="font-semibold">{entry.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {entry.sessions} sessions
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {entry.streak}d streak
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          <Leaf className="w-3 h-3 mr-1" />
                          {entry.greenScore}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{entry.co2Saved} kg CO₂</p>
                      </div>
                    </div>
                  ))}

                  {user && profile && (
                    <>
                      <div className="border-t border-dashed border-border my-4" />
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/30">
                        <span className="w-6 h-6 flex items-center justify-center font-bold text-primary">You</span>
                        <div className="flex-1">
                          <p className="font-semibold">{profile.full_name || "You"}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" /> {profile.total_sessions || 0} sessions
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {streak}d streak
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-1">
                            <Leaf className="w-3 h-3 mr-1" />
                            {profile.green_score || 0}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{Number(profile.co2_saved_kg || 0).toFixed(0)} kg CO₂</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                const val = Number(profile?.[badge.field] || 0);
                const unlocked = val >= badge.threshold;
                const progress = Math.min((val / badge.threshold) * 100, 100);

                return (
                  <Card
                    key={badge.id}
                    className={`glass-card transition-all ${unlocked ? "border-primary/40 shadow-md" : "opacity-70"}`}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                        unlocked ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {unlocked ? (
                          <Icon className={`w-8 h-8 ${badge.color}`} />
                        ) : (
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-1">{badge.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                      <Progress value={progress} className="h-1.5 mb-1" />
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(val)}/{badge.threshold}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <div className="grid sm:grid-cols-2 gap-4">
              {REWARDS.map((reward) => {
                const Icon = reward.icon;
                const canAfford = userPoints >= reward.cost;
                return (
                  <Card key={reward.title} className="glass-card hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{reward.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {reward.cost} pts
                            </Badge>
                            <Button
                              size="sm"
                              disabled={!canAfford}
                              className={canAfford ? "gradient-primary" : ""}
                            >
                              Redeem <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
