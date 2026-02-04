import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Booking {
  id: string;
  station_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  estimated_kwh: number | null;
  estimated_cost: number | null;
  actual_kwh: number | null;
  actual_cost: number | null;
  status: string | null;
  payment_status: string | null;
  created_at: string;
  station?: {
    name: string;
    address: string;
    city: string;
    charger_type: string;
    power_kw: number;
  };
}

export function useUserBookings() {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          station:charging_stations(name, address, city, charger_type, power_kw)
        `)
        .eq("user_id", profile.id)
        .order("booking_date", { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    }
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: {
      station_id: string;
      booking_date: string;
      start_time: string;
      end_time: string;
      estimated_kwh?: number;
      estimated_cost?: number;
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
        .from("bookings")
        .insert({
          ...booking,
          user_id: profile.id,
          status: "pending"
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success("Booking updated!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
