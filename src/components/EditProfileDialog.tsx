import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Pencil } from "lucide-react";
import { useUpdateProfile, type Profile } from "@/hooks/useProfile";

interface EditProfileDialogProps {
  profile: Profile;
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    vehicle_model: profile.vehicle_model || "",
    vehicle_type: profile.vehicle_type || "sedan",
    battery_capacity_kwh: profile.battery_capacity_kwh?.toString() || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        vehicle_model: profile.vehicle_model || "",
        vehicle_type: profile.vehicle_type || "sedan",
        battery_capacity_kwh: profile.battery_capacity_kwh?.toString() || "",
      });
    }
  }, [open, profile]);

  const handleSubmit = async () => {
    await updateProfile.mutateAsync({
      full_name: form.full_name || null,
      phone: form.phone || null,
      vehicle_model: form.vehicle_model || null,
      vehicle_type: form.vehicle_type || null,
      battery_capacity_kwh: form.battery_capacity_kwh ? Number(form.battery_capacity_kwh) : null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>
          <div className="space-y-2">
            <Label>Vehicle Model</Label>
            <Input
              value={form.vehicle_model}
              onChange={(e) => setForm({ ...form, vehicle_model: e.target.value })}
              placeholder="e.g. Tata Nexon EV"
            />
          </div>
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                <SelectItem value="three_wheeler">Three Wheeler</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Battery Capacity (kWh)</Label>
            <Input
              type="number"
              value={form.battery_capacity_kwh}
              onChange={(e) => setForm({ ...form, battery_capacity_kwh: e.target.value })}
              placeholder="e.g. 40"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full gradient-primary"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
