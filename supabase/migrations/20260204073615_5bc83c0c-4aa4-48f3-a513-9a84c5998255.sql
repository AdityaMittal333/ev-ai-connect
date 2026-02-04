-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  vehicle_model TEXT,
  vehicle_type TEXT,
  battery_capacity_kwh DECIMAL(10,2),
  green_score INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_kwh_charged DECIMAL(10,2) DEFAULT 0,
  co2_saved_kg DECIMAL(10,2) DEFAULT 0,
  is_host BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create charging_stations table
CREATE TABLE public.charging_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'Karnataka',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  charger_type TEXT NOT NULL,
  power_kw DECIMAL(10,2) NOT NULL,
  connector_type TEXT NOT NULL,
  price_per_kwh DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  amenities TEXT[],
  operating_hours_start TIME DEFAULT '06:00',
  operating_hours_end TIME DEFAULT '22:00',
  image_url TEXT,
  ai_score INTEGER DEFAULT 0,
  green_score INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.charging_stations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  estimated_kwh DECIMAL(10,2),
  estimated_cost DECIMAL(10,2),
  actual_kwh DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.charging_stations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Charging stations policies
CREATE POLICY "Anyone can view stations" ON public.charging_stations FOR SELECT USING (true);
CREATE POLICY "Hosts can insert stations" ON public.charging_stations FOR INSERT 
  WITH CHECK (host_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Hosts can update own stations" ON public.charging_stations FOR UPDATE 
  USING (host_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Hosts can delete own stations" ON public.charging_stations FOR DELETE 
  USING (host_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Hosts can view station bookings" ON public.bookings FOR SELECT 
  USING (station_id IN (SELECT id FROM public.charging_stations WHERE host_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON public.charging_stations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update station average rating
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_station_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_station_rating();