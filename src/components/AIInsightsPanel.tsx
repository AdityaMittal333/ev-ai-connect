 import { useState, useEffect } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import {
   Sparkles,
   Battery,
   Leaf,
   TrendingDown,
   Clock,
   Zap,
   RefreshCw,
   Sun,
   CloudSun,
   Moon,
   AlertCircle,
 } from "lucide-react";
 import { useAIInsights, ChargingRecommendation } from "@/hooks/useAIInsights";
 import { useProfile } from "@/hooks/useProfile";
 import { cn } from "@/lib/utils";
 
 export function AIInsightsPanel() {
   const [insights, setInsights] = useState<ChargingRecommendation | null>(null);
   const { getChargingRecommendation, isLoading } = useAIInsights();
   const { data: profile } = useProfile();
 
   const fetchInsights = async () => {
     const result = await getChargingRecommendation({
       greenScore: profile?.green_score || undefined,
       totalSessions: profile?.total_sessions || undefined,
       vehicleType: profile?.vehicle_type || undefined,
       batteryCapacity: profile?.battery_capacity_kwh ? Number(profile.battery_capacity_kwh) : undefined,
     });
     if (result) setInsights(result);
   };
 
   useEffect(() => {
     fetchInsights();
   }, [profile]);
 
   const getDemandColor = (demand: string) => {
     switch (demand) {
       case "low": return "text-success";
       case "medium": return "text-yellow-500";
       case "high": return "text-destructive";
       default: return "text-muted-foreground";
     }
   };
 
   const getImpactBadge = (impact: string) => {
     switch (impact) {
       case "high": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">High Impact</Badge>;
       case "medium": return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium Impact</Badge>;
       default: return <Badge variant="outline">Low Impact</Badge>;
     }
   };
 
   const getTimeIcon = () => {
     const hour = new Date().getHours();
     if (hour >= 6 && hour < 12) return <Sun className="w-5 h-5 text-yellow-500" />;
     if (hour >= 12 && hour < 18) return <CloudSun className="w-5 h-5 text-orange-500" />;
     return <Moon className="w-5 h-5 text-indigo-500" />;
   };
 
   if (isLoading && !insights) {
     return (
       <Card className="glass-card">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-primary animate-pulse" />
             AI Insights
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
             ))}
           </div>
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card className="glass-card overflow-hidden">
       <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
         <div className="flex items-center justify-between">
           <CardTitle className="flex items-center gap-2">
             <div className="relative">
               <Sparkles className="w-5 h-5 text-primary" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
             </div>
             AI-Powered Insights
           </CardTitle>
           <Button
             variant="ghost"
             size="sm"
             onClick={fetchInsights}
             disabled={isLoading}
             className="gap-2"
           >
             <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
             Refresh
           </Button>
         </div>
       </CardHeader>
       
       <CardContent className="p-0">
         {insights ? (
           <div className="divide-y divide-border/50">
             {/* Best Time to Charge */}
             <div className="p-4 hover:bg-muted/30 transition-colors">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                   {getTimeIcon()}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <p className="font-semibold text-sm">Best Time to Charge</p>
                     <Badge variant="secondary" className="text-xs">
                       <Clock className="w-3 h-3 mr-1" />
                       {insights.bestTimeToCharge.start} - {insights.bestTimeToCharge.end}
                     </Badge>
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {insights.bestTimeToCharge.reason}
                   </p>
                 </div>
               </div>
             </div>
 
             {/* Battery Health Tip */}
             <div className="p-4 hover:bg-muted/30 transition-colors">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                   <Battery className="w-5 h-5 text-success" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1 flex-wrap">
                     <p className="font-semibold text-sm">{insights.batteryTip.title}</p>
                     {getImpactBadge(insights.batteryTip.impact)}
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {insights.batteryTip.description}
                   </p>
                 </div>
               </div>
             </div>
 
             {/* Green Energy */}
             <div className="p-4 hover:bg-muted/30 transition-colors">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                   <Leaf className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-2">
                     <p className="font-semibold text-sm">{insights.greenTip.title}</p>
                     <span className="text-xs font-medium text-emerald-500">
                       {insights.greenTip.renewablePercent}% Renewable
                     </span>
                   </div>
                   <Progress value={insights.greenTip.renewablePercent} className="h-1.5 mb-2" />
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {insights.greenTip.description}
                   </p>
                 </div>
               </div>
             </div>
 
             {/* Cost Insight */}
             <div className="p-4 hover:bg-muted/30 transition-colors">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                   <TrendingDown className="w-5 h-5 text-secondary" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <p className="font-semibold text-sm">Cost Optimization</p>
                     <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs">
                       Save {insights.costInsight.savings}
                     </Badge>
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {insights.costInsight.tip}
                   </p>
                 </div>
               </div>
             </div>
 
             {/* Demand Forecast */}
             <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
               <div className="flex items-start gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                   <Zap className="w-5 h-5 text-primary" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                     <p className="font-semibold text-sm">Current Demand</p>
                     <Badge variant="outline" className={cn("text-xs", getDemandColor(insights.demandForecast.currentDemand))}>
                       {insights.demandForecast.currentDemand.toUpperCase()}
                     </Badge>
                   </div>
                   <p className="text-xs text-muted-foreground mb-1">
                     Peak hours: {insights.demandForecast.peakHours}
                   </p>
                   <p className="text-xs text-muted-foreground line-clamp-2">
                     {insights.demandForecast.recommendation}
                   </p>
                 </div>
               </div>
             </div>
           </div>
         ) : (
           <div className="p-8 text-center">
             <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
             <p className="text-sm text-muted-foreground mb-4">
               Unable to load AI insights
             </p>
             <Button onClick={fetchInsights} variant="outline" size="sm">
               Try Again
             </Button>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }