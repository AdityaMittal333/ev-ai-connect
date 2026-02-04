-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_station_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.charging_stations
  SET 
    avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE station_id = COALESCE(NEW.station_id, OLD.station_id)),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE station_id = COALESCE(NEW.station_id, OLD.station_id))
  WHERE id = COALESCE(NEW.station_id, OLD.station_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;