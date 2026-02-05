 import { useState, useEffect } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
 import {
   Sparkles,
   TrendingUp,
   Leaf,
   IndianRupee,
   Clock,
   CheckCircle2,
   RefreshCw,
   Brain,
 } from "lucide-react";
 import { useAIInsights, StationAnalysis } from "@/hooks/useAIInsights";
 import { cn } from "@/lib/utils";
 
 interface StationAIAnalysisProps {
   station: {
     name: string;
     power_kw: number;
     price_per_kwh: number;
     ai_score: number | null;
     green_score: number | null;
     avg_rating: number | null;
     total_reviews: number | null;
   };
 }
 
 export function StationAIAnalysis({ station }: StationAIAnalysisProps) {
   const [analysis, setAnalysis] = useState<StationAnalysis | null>(null);
   const { getStationAnalysis, isLoading } = useAIInsights();
 
   const fetchAnalysis = async () => {
     const result = await getStationAnalysis({
       stationName: station.name,
       powerKw: Number(station.power_kw),
       pricePerKwh: Number(station.price_per_kwh),
       aiScore: station.ai_score || 80,
       greenScore: station.green_score || 75,
       avgRating: Number(station.avg_rating) || 4.0,
       totalReviews: station.total_reviews || 0,
     });
     if (result) setAnalysis(result);
   };
 
   useEffect(() => {
     fetchAnalysis();
   }, [station.name]);
 
   const getPriceColor = (rating: string) => {
     switch (rating) {
       case "excellent": return "text-success";
       case "good": return "text-emerald-500";
       case "average": return "text-yellow-500";
       case "expensive": return "text-destructive";
       default: return "text-muted-foreground";
     }
   };
 
   const getDemandColor = (demand: string) => {
     switch (demand) {
       case "low": return "bg-success/10 text-success border-success/20";
       case "medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
       case "high": return "bg-destructive/10 text-destructive border-destructive/20";
       default: return "";
     }
   };
 
   if (isLoading && !analysis) {
     return (
       <Card className="glass-card">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Brain className="w-5 h-5 text-primary animate-pulse" />
             AI Analysis
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
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
               <Brain className="w-5 h-5 text-primary" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
             </div>
             AI Station Analysis
           </CardTitle>
           <Button
             variant="ghost"
             size="sm"
             onClick={fetchAnalysis}
             disabled={isLoading}
           >
             <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
           </Button>
         </div>
       </CardHeader>
       
       <CardContent className="pt-4 space-y-4">
         {analysis ? (
           <>
             {/* Match Score */}
             <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
               <div className="flex items-center justify-between mb-3">
                 <span className="font-semibold flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-primary" />
                   Match Score
                 </span>
                 <span className="text-2xl font-bold text-primary">
                   {analysis.matchScore.score}/100
                 </span>
               </div>
               <Progress value={analysis.matchScore.score} className="h-2 mb-3" />
               <div className="flex flex-wrap gap-1">
                 {analysis.matchScore.factors.map((factor, i) => (
                   <Badge key={i} variant="secondary" className="text-xs">
                     <CheckCircle2 className="w-3 h-3 mr-1" />
                     {factor}
                   </Badge>
                 ))}
               </div>
             </div>
 
             {/* Price & Demand Grid */}
             <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                 <div className="flex items-center gap-2 mb-2">
                   <IndianRupee className="w-4 h-4 text-muted-foreground" />
                   <span className="text-xs font-medium">Price Rating</span>
                 </div>
                 <p className={cn("font-bold capitalize", getPriceColor(analysis.priceAnalysis.rating))}>
                   {analysis.priceAnalysis.rating}
                 </p>
                 <p className="text-xs text-muted-foreground mt-1">
                   {analysis.priceAnalysis.comparison}
                 </p>
               </div>
 
               <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                 <div className="flex items-center gap-2 mb-2">
                   <Clock className="w-4 h-4 text-muted-foreground" />
                   <span className="text-xs font-medium">Next Hour Demand</span>
                 </div>
                 <Badge className={cn("mb-1", getDemandColor(analysis.demandPrediction.nextHour))}>
                   {analysis.demandPrediction.nextHour.toUpperCase()}
                 </Badge>
                 <p className="text-xs text-muted-foreground">
                   Best: {analysis.demandPrediction.bestSlot}
                 </p>
               </div>
             </div>
 
             {/* Sustainability */}
             <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/20">
               <div className="flex items-center justify-between mb-2">
                 <span className="font-semibold flex items-center gap-2">
                   <Leaf className="w-4 h-4 text-emerald-500" />
                   Sustainability Score
                 </span>
                 <span className="text-xl font-bold text-emerald-500">
                   {analysis.sustainabilityScore.score}/100
                 </span>
               </div>
               <Progress value={analysis.sustainabilityScore.score} className="h-2 mb-2" />
               <p className="text-xs text-muted-foreground">
                 {analysis.sustainabilityScore.insight}
               </p>
             </div>
 
             {/* AI Recommendation */}
             <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20">
               <div className="flex items-center gap-2 mb-2">
                 <TrendingUp className="w-4 h-4 text-secondary" />
                 <span className="font-semibold text-sm">AI Recommendation</span>
               </div>
               <p className="text-sm text-muted-foreground">
                 {analysis.recommendation}
               </p>
             </div>
           </>
         ) : (
           <div className="py-8 text-center">
             <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
             <p className="text-sm text-muted-foreground mb-4">
               Unable to analyze station
             </p>
             <Button onClick={fetchAnalysis} variant="outline" size="sm">
               Try Again
             </Button>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }