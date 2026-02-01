import { useRef, useState } from "react";
import { MapView } from "./Map";
import { courthouses, officeLocation } from "@shared/cityData";
import { Button } from "@/components/ui/button";

interface CourthouseMapProps {
  className?: string;
  selectedCounty?: string;
}

export function CourthouseMap({ className, selectedCounty }: CourthouseMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [activeCounty, setActiveCounty] = useState<string>(selectedCounty || "Los Angeles County");

  const counties = Object.keys(courthouses);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      marker.map = null;
    });
    markersRef.current = [];
  };

  const addMarkers = (map: google.maps.Map, county: string) => {
    clearMarkers();

    // Add office marker (gold/primary color)
    const officeMarkerContent = document.createElement("div");
    officeMarkerContent.innerHTML = `
      <div style="
        background: #B8860B;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        white-space: nowrap;
      ">
        ⚖️ Gurovich Law Group
      </div>
    `;

    const officeMarker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: officeLocation.lat, lng: officeLocation.lng },
      title: officeLocation.name,
      content: officeMarkerContent,
    });
    markersRef.current.push(officeMarker);

    // Add courthouse markers for selected county
    const countyCourthouses = courthouses[county] || [];
    countyCourthouses.forEach((courthouse) => {
      if (courthouse.lat && courthouse.lng) {
        const markerContent = document.createElement("div");
        markerContent.innerHTML = `
          <div style="
            background: #1e293b;
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            🏛️ ${courthouse.name}
          </div>
        `;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: courthouse.lat, lng: courthouse.lng },
          title: courthouse.name,
          content: markerContent,
        });

        // Add click listener to show info window
        marker.addListener("click", () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${courthouse.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${courthouse.address}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(courthouse.address)}" 
                   target="_blank" 
                   style="display: inline-block; margin-top: 8px; font-size: 12px; color: #B8860B;">
                  Get Directions →
                </a>
              </div>
            `,
          });
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position as google.maps.LatLngLiteral);
        }
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    addMarkers(map, activeCounty);
  };

  const handleCountyChange = (county: string) => {
    setActiveCounty(county);
    if (mapRef.current) {
      addMarkers(mapRef.current, county);
    }
  };

  return (
    <div className={className}>
      {/* County selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {counties.map((county) => (
          <Button
            key={county}
            variant={activeCounty === county ? "default" : "outline"}
            size="sm"
            onClick={() => handleCountyChange(county)}
            className="text-sm"
          >
            {county.replace(" County", "")}
          </Button>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-slate-200">
        <MapView
          className="h-[450px]"
          initialCenter={{ lat: officeLocation.lat, lng: officeLocation.lng }}
          initialZoom={10}
          onMapReady={handleMapReady}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-[#B8860B]"></span>
          <span>Gurovich Law Group Office</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-slate-800"></span>
          <span>Courthouses ({courthouses[activeCounty]?.length || 0} in {activeCounty.replace(" County", "")})</span>
        </div>
      </div>
    </div>
  );
}
