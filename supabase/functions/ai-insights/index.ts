 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { type, context } = await req.json();
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     let systemPrompt = "";
     let userPrompt = "";
 
     switch (type) {
       case "charging_recommendation":
         systemPrompt = `You are an AI assistant for an EV charging network in India. Provide smart, personalized charging recommendations based on user data. Be concise and actionable. Focus on:
 - Optimal charging times based on renewable energy availability
 - Battery health preservation tips
 - Cost optimization strategies
 - Green scoring insights
 
 Format your response as JSON with the following structure:
 {
   "bestTimeToCharge": { "start": "HH:MM", "end": "HH:MM", "reason": "string" },
   "batteryTip": { "title": "string", "description": "string", "impact": "high|medium|low" },
   "costInsight": { "savings": "string", "tip": "string" },
   "greenTip": { "title": "string", "description": "string", "renewablePercent": number },
   "demandForecast": { "currentDemand": "low|medium|high", "peakHours": "string", "recommendation": "string" }
 }`;
         userPrompt = `Generate charging recommendations for a user in India with the following context:
 - Current time: ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
 - User's green score: ${context?.greenScore || 85}
 - Total sessions: ${context?.totalSessions || 0}
 - Vehicle type: ${context?.vehicleType || 'Electric Car'}
 - Battery capacity: ${context?.batteryCapacity || 40} kWh
 - Current month: ${new Date().toLocaleString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' })}`;
         break;
 
       case "station_analysis":
         systemPrompt = `You are an AI analyst for EV charging stations. Analyze station data and provide insights. Be data-driven and helpful.
 
 Format your response as JSON:
 {
   "matchScore": { "score": number, "factors": ["string"] },
   "priceAnalysis": { "rating": "excellent|good|average|expensive", "comparison": "string" },
   "demandPrediction": { "nextHour": "low|medium|high", "bestSlot": "string" },
   "sustainabilityScore": { "score": number, "insight": "string" },
   "recommendation": "string"
 }`;
         userPrompt = `Analyze this charging station:
 - Name: ${context?.stationName || 'Unknown'}
 - Power: ${context?.powerKw || 7} kW
 - Price: ₹${context?.pricePerKwh || 12}/kWh
 - AI Score: ${context?.aiScore || 80}
 - Green Score: ${context?.greenScore || 75}
 - Average Rating: ${context?.avgRating || 4.0}
 - Total Reviews: ${context?.totalReviews || 0}`;
         break;
 
       case "demand_forecast":
         systemPrompt = `You are a demand forecasting AI for EV charging networks in India. Predict demand patterns and provide actionable insights.
 
 Format response as JSON:
 {
   "hourlyForecast": [{ "hour": "HH:MM", "demand": "low|medium|high", "price": number }],
   "peakPeriods": ["string"],
   "offPeakPeriods": ["string"],
   "savingsOpportunity": "string",
   "gridStatus": { "renewable": number, "status": "string" }
 }`;
         userPrompt = `Generate a 6-hour demand forecast for EV charging in ${context?.city || 'Bangalore'}, India starting from now.`;
         break;
 
       default:
         throw new Error("Invalid insight type");
     }
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: systemPrompt },
           { role: "user", content: userPrompt },
         ],
         temperature: 0.7,
         max_tokens: 1024,
       }),
     });
 
     if (!response.ok) {
       if (response.status === 429) {
         return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
           status: 429,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       if (response.status === 402) {
         return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
           status: 402,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       const errorText = await response.text();
       console.error("AI gateway error:", response.status, errorText);
       throw new Error("AI service unavailable");
     }
 
     const data = await response.json();
     const content = data.choices?.[0]?.message?.content;
 
     // Parse JSON from response
     let parsedContent;
     try {
       // Extract JSON from markdown code blocks if present
       const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
       parsedContent = JSON.parse(jsonMatch[1] || content);
     } catch {
       parsedContent = { raw: content };
     }
 
     return new Response(JSON.stringify({ insights: parsedContent }), {
       status: 200,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   } catch (error) {
     console.error("AI insights error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       {
         status: 500,
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       }
     );
   }
 });