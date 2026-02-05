 import { useState, useCallback } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 export interface ChargingRecommendation {
   bestTimeToCharge: {
     start: string;
     end: string;
     reason: string;
   };
   batteryTip: {
     title: string;
     description: string;
     impact: "high" | "medium" | "low";
   };
   costInsight: {
     savings: string;
     tip: string;
   };
   greenTip: {
     title: string;
     description: string;
     renewablePercent: number;
   };
   demandForecast: {
     currentDemand: "low" | "medium" | "high";
     peakHours: string;
     recommendation: string;
   };
 }
 
 export interface StationAnalysis {
   matchScore: {
     score: number;
     factors: string[];
   };
   priceAnalysis: {
     rating: "excellent" | "good" | "average" | "expensive";
     comparison: string;
   };
   demandPrediction: {
     nextHour: "low" | "medium" | "high";
     bestSlot: string;
   };
   sustainabilityScore: {
     score: number;
     insight: string;
   };
   recommendation: string;
 }
 
 export interface DemandForecast {
   hourlyForecast: Array<{
     hour: string;
     demand: "low" | "medium" | "high";
     price: number;
   }>;
   peakPeriods: string[];
   offPeakPeriods: string[];
   savingsOpportunity: string;
   gridStatus: {
     renewable: number;
     status: string;
   };
 }
 
 export function useAIInsights() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const getChargingRecommendation = useCallback(async (context?: {
     greenScore?: number;
     totalSessions?: number;
     vehicleType?: string;
     batteryCapacity?: number;
   }): Promise<ChargingRecommendation | null> => {
     setIsLoading(true);
     setError(null);
     
     try {
       const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
         body: { type: "charging_recommendation", context },
       });
 
       if (fnError) throw fnError;
       if (data.error) throw new Error(data.error);
       
       return data.insights as ChargingRecommendation;
     } catch (err) {
       const message = err instanceof Error ? err.message : "Failed to get AI recommendations";
       setError(message);
       toast.error(message);
       return null;
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   const getStationAnalysis = useCallback(async (context: {
     stationName: string;
     powerKw: number;
     pricePerKwh: number;
     aiScore: number;
     greenScore: number;
     avgRating: number;
     totalReviews: number;
   }): Promise<StationAnalysis | null> => {
     setIsLoading(true);
     setError(null);
     
     try {
       const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
         body: { type: "station_analysis", context },
       });
 
       if (fnError) throw fnError;
       if (data.error) throw new Error(data.error);
       
       return data.insights as StationAnalysis;
     } catch (err) {
       const message = err instanceof Error ? err.message : "Failed to analyze station";
       setError(message);
       toast.error(message);
       return null;
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   const getDemandForecast = useCallback(async (city?: string): Promise<DemandForecast | null> => {
     setIsLoading(true);
     setError(null);
     
     try {
       const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
         body: { type: "demand_forecast", context: { city } },
       });
 
       if (fnError) throw fnError;
       if (data.error) throw new Error(data.error);
       
       return data.insights as DemandForecast;
     } catch (err) {
       const message = err instanceof Error ? err.message : "Failed to get demand forecast";
       setError(message);
       toast.error(message);
       return null;
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   return {
     isLoading,
     error,
     getChargingRecommendation,
     getStationAnalysis,
     getDemandForecast,
   };
 }