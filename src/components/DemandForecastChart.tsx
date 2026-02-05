 import { useState, useEffect } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
 } from "recharts";
 import {
   TrendingUp,
   RefreshCw,
   Leaf,
   IndianRupee,
   Clock,
 } from "lucide-react";
 import { useAIInsights, DemandForecast } from "@/hooks/useAIInsights";
 import { cn } from "@/lib/utils";
 
 export function DemandForecastChart() {
   const [forecast, setForecast] = useState<DemandForecast | null>(null);
   const { getDemandForecast, isLoading } = useAIInsights();
 
   const fetchForecast = async () => {
     const result = await getDemandForecast("Bangalore");
     if (result) setForecast(result);
   };
 
   useEffect(() => {
     fetchForecast();
   }, []);
 
   const getDemandValue = (demand: string) => {
     switch (demand) {
       case "low": return 30;
       case "medium": return 60;
       case "high": return 90;
       default: return 50;
     }
   };
 
   const chartData = forecast?.hourlyForecast.map((item) => ({
     hour: item.hour,
     demand: getDemandValue(item.demand),
     price: item.price,
     demandLevel: item.demand,
   })) || [];
 
   const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       const data = payload[0].payload;
       return (
         <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
           <p className="font-semibold text-sm mb-2">{label}</p>
           <div className="space-y-1">
             <p className="text-xs flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary" />
               Demand: <span className="font-medium capitalize">{data.demandLevel}</span>
             </p>
             <p className="text-xs flex items-center gap-2">
               <IndianRupee className="w-3 h-3" />
               Price: <span className="font-medium">₹{data.price}/kWh</span>
             </p>
           </div>
         </div>
       );
     }
     return null;
   };
 
   if (isLoading && !forecast) {
     return (
       <Card className="glass-card">
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-primary" />
             Demand Forecast
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-48 bg-muted/50 rounded-lg animate-pulse" />
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card className="glass-card overflow-hidden">
       <CardHeader className="border-b border-border/50">
         <div className="flex items-center justify-between">
           <CardTitle className="flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-primary" />
             6-Hour Demand Forecast
           </CardTitle>
           <Button
             variant="ghost"
             size="sm"
             onClick={fetchForecast}
             disabled={isLoading}
           >
             <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
           </Button>
         </div>
       </CardHeader>
       
       <CardContent className="pt-4">
         {forecast ? (
           <>
             <div className="h-48 mb-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                       <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                   <XAxis
                     dataKey="hour"
                     tick={{ fontSize: 10 }}
                     tickLine={false}
                     axisLine={false}
                     className="text-muted-foreground"
                   />
                   <YAxis hide />
                   <Tooltip content={<CustomTooltip />} />
                   <Area
                     type="monotone"
                     dataKey="demand"
                     stroke="hsl(var(--primary))"
                     strokeWidth={2}
                     fill="url(#demandGradient)"
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
 
             <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                 <div className="flex items-center gap-2 mb-1">
                   <Clock className="w-4 h-4 text-destructive" />
                   <span className="text-xs font-medium">Peak Hours</span>
                 </div>
                 <p className="text-xs text-muted-foreground">
                   {forecast.peakPeriods.join(", ") || "None predicted"}
                 </p>
               </div>
               <div className="p-3 bg-success/5 rounded-lg border border-success/20">
                 <div className="flex items-center gap-2 mb-1">
                   <TrendingUp className="w-4 h-4 text-success" />
                   <span className="text-xs font-medium">Off-Peak</span>
                 </div>
                 <p className="text-xs text-muted-foreground">
                   {forecast.offPeakPeriods.join(", ") || "Check schedule"}
                 </p>
               </div>
             </div>
 
             <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <Leaf className="w-4 h-4 text-emerald-500" />
                   <span className="text-xs font-medium">Grid Status</span>
                 </div>
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                   {forecast.gridStatus.renewable}% Renewable
                 </Badge>
               </div>
               <p className="text-xs text-muted-foreground">
                 {forecast.gridStatus.status}
               </p>
             </div>
 
             {forecast.savingsOpportunity && (
               <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                 <p className="text-xs text-primary font-medium">
                   💡 {forecast.savingsOpportunity}
                 </p>
               </div>
             )}
           </>
         ) : (
           <div className="h-48 flex items-center justify-center">
             <p className="text-sm text-muted-foreground">No forecast available</p>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }