import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';

interface CampusMapProps {
  onAreaSelect?: (center: [number, number], radius: number) => void;
  selectedArea?: { center: [number, number]; radius: number } | null;
  incidents?: Array<{
    id: string;
    location: { lat: number; lng: number; address: string };
    type: 'SOS' | 'FriendWalk' | 'Report';
    priority?: 'urgent' | 'high' | 'medium' | 'low';
  }>;
  showRadiusSelector?: boolean;
  className?: string;
}

const CampusMap: React.FC<CampusMapProps> = ({
  onAreaSelect,
  selectedArea,
  incidents = [],
  showRadiusSelector = false,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [radius, setRadius] = useState(500);
  const radiusCircle = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current).setView([5.4164, 100.3327], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map.current);

    // Add incidents as markers
    incidents.forEach(incident => {
      const marker = L.circleMarker([incident.location.lat, incident.location.lng], {
        radius: 6,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 1,
        fillColor: incident.type === 'SOS' ? '#ef4444' : (incident.type === 'FriendWalk' ? '#f59e0b' : '#3b82f6')
      }).addTo(map.current!);
      marker.bindPopup(`<div class="p-2"><div class="font-semibold">${incident.type}</div><div class="text-sm">${incident.location.address}</div></div>`);
    });

    // Handle area selection for broadcasts
    if (showRadiusSelector && onAreaSelect) {
      map.current.on('click', (e: L.LeafletMouseEvent) => {
        const center: [number, number] = [e.latlng.lng, e.latlng.lat];
        onAreaSelect(center, radius);
        if (radiusCircle.current) radiusCircle.current.remove();
        radiusCircle.current = L.circle([e.latlng.lat, e.latlng.lng], { radius, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }).addTo(map.current!);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [incidents, radius, onAreaSelect, showRadiusSelector]);

  // Update selected area
  useEffect(() => {
    if (selectedArea && map.current) {
      map.current.setView([selectedArea.center[1], selectedArea.center[0]]);
      if (radiusCircle.current) radiusCircle.current.remove();
      radiusCircle.current = L.circle([selectedArea.center[1], selectedArea.center[0]], { radius: selectedArea.radius, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }).addTo(map.current);
    }
  }, [selectedArea]);

  // Leaflet requires no API key; render map directly

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {showRadiusSelector && (
        <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-lg border">
          <label className="text-sm font-medium">Broadcast Radius</label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-20"
              min="100"
              max="2000"
              step="100"
            />
            <span className="text-sm text-muted-foreground">meters</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Click on map to set area</p>
        </div>
      )}

      {incidents.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-lg border">
          <div className="text-sm font-medium mb-2">Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emergency border border-white"></div>
              <span>SOS Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning border border-white"></div>
              <span>Friend Walk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent border border-white"></div>
              <span>Report</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMap;