"use client";

import { useRef, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

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

function HomeLeafletMap({ className }: { className?: string }) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Store map instance in ref when MapContainer is ready
    const handleMapReady = (mapInstance: any) => {
      mapRef.current = mapInstance;
    };

    // Get the map container element and attach the ready event
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
      </MapContainer>
      
      <ZoomControls mapRef={mapRef} />
    </div>
  );
}

function FixLeafletSizing() {
  return null;
}

export default HomeLeafletMap;
