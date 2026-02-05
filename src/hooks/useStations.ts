import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Station {
  id: string;
  host_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  charger_type: string;
  power_kw: number;
  connector_type: string;
  price_per_kwh: number;
  is_available: boolean | null;
  is_verified: boolean | null;
  amenities: string[] | null;
  operating_hours_start: string | null;
  operating_hours_end: string | null;
  image_url: string | null;
  ai_score: number | null;
  green_score: number | null;
  total_bookings: number | null;
  avg_rating: number | null;
  total_reviews: number | null;
  created_at: string;
  updated_at: string;
  host?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useStations() {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charging_stations")
        .select(`
          *,
          host:profiles_public!charging_stations_host_id_fkey(full_name, avatar_url)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Station[];
    }
  });
}

export function useStation(id: string) {
  return useQuery({
    queryKey: ["station", id],
    queryFn: async () => {
      // First get the station data
      const { data: station, error: stationError } = await supabase
        .from("charging_stations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (stationError) throw stationError;
      if (!station) return null;

      // Get public host info from the secure view
      const { data: host, error: hostError } = await supabase
        .from("profiles_public")
        .select("full_name, avatar_url")
        .eq("id", station.host_id)
        .maybeSingle();
      
      if (hostError) throw hostError;
      
      return {
        ...station,
        host: host ? { full_name: host.full_name, avatar_url: host.avatar_url, phone: null } : null
      } as Station & { host: { full_name: string | null; avatar_url: string | null; phone: string | null } };
    },
    enabled: !!id
  });
}

export function useCreateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (station: {
      name: string;
      description?: string;
      address: string;
      city: string;
      charger_type: string;
      power_kw: number;
      connector_type: string;
      price_per_kwh: number;
      amenities?: string[];
      operating_hours_start?: string;
      operating_hours_end?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (!profile) throw new Error("Profile not found");

      // Generate AI and green scores (mock calculation)
      const ai_score = Math.floor(Math.random() * 20) + 80;
      const green_score = Math.floor(Math.random() * 25) + 75;

      const { data, error } = await supabase
        .from("charging_stations")
        .insert({
          ...station,
          host_id: profile.id,
          ai_score,
          green_score
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      toast.success("Charging station listed successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
