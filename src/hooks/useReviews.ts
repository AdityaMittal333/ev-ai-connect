import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Review {
  id: string;
  station_id: string;
  user_id: string;
  booking_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useStationReviews(stationId: string) {
  return useQuery({
    queryKey: ["reviews", stationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:profiles!reviews_user_id_fkey(full_name, avatar_url)
        `)
        .eq("station_id", stationId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!stationId
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      station_id: string;
      rating: number;
      comment?: string;
      booking_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          ...review,
          user_id: profile.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.station_id] });
      queryClient.invalidateQueries({ queryKey: ["station", variables.station_id] });
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
