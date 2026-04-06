import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Station } from "@/hooks/useStations";

// Import leaflet CSS
import "leaflet/dist/leaflet.css";

interface StationMapProps {
  stations: Station[];
}

export function StationMap({ stations }: StationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Center on India (Bangalore default)
      const map = L.map(mapRef.current!, {
        center: [12.9716, 77.5946],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom green icon
      const greenIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background: hsl(158, 64%, 52%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><span style="transform: rotate(45deg); color: white; font-size: 14px;">⚡</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const stationsWithCoords = stations.filter(
        (s) => s.latitude && s.longitude
      );

      // If no stations have real coordinates, place them with mock offsets
      const displayStations = stationsWithCoords.length > 0
        ? stationsWithCoords
        : stations.slice(0, 8).map((s, i) => ({
            ...s,
            latitude: 12.9716 + (Math.random() - 0.5) * 0.08,
            longitude: 77.5946 + (Math.random() - 0.5) * 0.08,
          }));

      displayStations.forEach((station) => {
        if (!station.latitude || !station.longitude) return;

        const marker = L.marker([station.latitude, station.longitude], {
          icon: greenIcon,
        }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${station.name}</h3>
            <p style="color: #666; margin: 0 0 8px 0; font-size: 12px;">${station.address}</p>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 12px;">⚡ ${station.power_kw} kW</span>
              <span style="font-size: 12px;">₹${station.price_per_kwh}/kWh</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <span style="
                background: ${station.is_available ? '#16a34a' : '#94a3b8'};
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
              ">${station.is_available ? "Available" : "In Use"}</span>
              <span style="
                background: #f1f5f9;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
              ">Score: ${station.ai_score || 0}</span>
            </div>
            <a href="/station/${station.id}" style="
              display: block;
              text-align: center;
              margin-top: 8px;
              padding: 6px;
              background: hsl(158, 64%, 52%);
              color: white;
              border-radius: 6px;
              text-decoration: none;
              font-size: 12px;
              font-weight: 600;
            ">View Details</a>
          </div>
        `);
      });

      // Fit bounds if we have markers
      if (displayStations.length > 0) {
        const bounds = L.latLngBounds(
          displayStations
            .filter((s) => s.latitude && s.longitude)
            .map((s) => [s.latitude!, s.longitude!] as [number, number])
        );
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stations]);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          Station Map
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-0">
        <div
          ref={mapRef}
          className="w-full rounded-b-lg overflow-hidden"
          style={{ height: "400px" }}
        />
      </CardContent>
    </Card>
  );
}
