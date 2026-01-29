"use client";

import { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useSites } from "../hooks/useDynamicData";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

function ZoomControls({ mapRef }: { mapRef: React.RefObject<any> }) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 z-[1000]">
      <button
        onClick={() => {
          const map = mapRef.current;
          if (map) map.zoomIn();
        }}
        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Zoom in"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
        </button>
        <button
          onClick={() => {
            const map = mapRef.current;
            if (map) map.zoomOut();
          }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zoom out"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
            </svg>
        </button>
      </div>
  );
}

function createCustomIcon(status: string) {
  const colorMap = {
    active: '#10b981',
    unstable: '#facc15',
    unavailable: '#ef4444'
  };

  return L.divIcon({
    html: `<div style="background-color: ${colorMap[status as keyof typeof colorMap] || '#6b7280'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

function HomeLeafletMap({ className }: { className?: string }) {
  const mapRef = useRef<any>(null);
  const { data: sites, loading, error } = useSites();

  useEffect(() => {
    const handleMapReady = (mapInstance: any) => {
      mapRef.current = mapInstance;
    };

    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      mapContainer.addEventListener('leafletmapready', handleMapReady);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('leafletmapready', handleMapReady);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={className ? `${className} h-full w-full` : "h-full w-full flex items-center justify-center"}>
        <div className="text-white/70">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className ? `${className} h-full w-full` : "h-full w-full flex items-center justify-center"}>
        <div className="text-red-400">Error loading map data</div>
      </div>
    );
  }

  // Filter out sites without valid coordinates
  const validSites = sites?.filter((site: any) => {
    // Handle both new GeoJSON format and old lat/lng format
    let lat, lng;
    
    if (site.location && typeof site.location === 'object' && site.location.type === 'Point') {
      // New GeoJSON format: coordinates are [lng, lat]
      lng = site.location.coordinates[0];
      lat = site.location.coordinates[1];
    } else {
      // Old format: separate lat/lng fields
      lat = site.latitude || site.lat;
      lng = site.longitude || site.lng;
    }
    
    return lat !== undefined && lng !== undefined && lat !== null && lng !== null;
  }) || [];

  return (
    <div className={className ? `${className} h-full w-full` : "h-full w-full"}>
      <MapContainer
        ref={mapRef}
        center={[9.80, 124.20]}
        zoom={9}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {validSites?.map((site: any) => {
          // Handle both new GeoJSON format and old lat/lng format
          let lat, lng;
          
          if (site.location && typeof site.location === 'object' && site.location.type === 'Point') {
            // New GeoJSON format: coordinates are [lng, lat]
            lng = site.location.coordinates[0];
            lat = site.location.coordinates[1];
          } else {
            // Old format: separate lat/lng fields
            lat = site.latitude || site.lat;
            lng = site.longitude || site.lng;
          }
          
          return (
            <Marker
              key={site.id || site._id}
              position={[lat, lng]}
              icon={createCustomIcon(site.status)}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-gray-600">{site.locationName || site.municipality || site.location}</p>
                  <p className="text-xs">Status: <span className={`font-medium ${
                    site.status === 'active' || site.status === 'Active' ? 'text-green-600' :
                    site.status === 'unstable' || site.status === 'Warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{site.status}</span></p>
                  {(site.signalStrength || site.signal) && (
                    <p className="text-xs">Signal: {site.signalStrength || site.signal}</p>
                  )}
                  {site.description && (
                    <p className="text-xs text-gray-500 mt-1">{site.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <ZoomControls mapRef={mapRef} />
    </div>
  );
}

function FixLeafletSizing() {
  return null;
}

export default HomeLeafletMap;
