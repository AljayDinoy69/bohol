"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

type MarkerKind = "good" | "warn" | "bad" | "active" | "unstable" | "unavailable";

type MapMarker = {
  id: string;
  kind: MarkerKind;
  position: [number, number];
  site?: any;
};

function markerHtml(kind: MarkerKind) {
  const colors = {
    good: "rgba(34,197,94,0.8)",
    warn: "rgba(245,158,11,0.8)",
    bad: "rgba(244,63,94,0.8)",
    active: "rgba(34,197,94,0.8)",
    unstable: "rgba(245,158,11,0.8)",
    unavailable: "rgba(244,63,94,0.8)"
  };
  
  return `
    <div style="color: ${colors[kind]}; font-size: 20px; text-shadow: 0 0 4px rgba(0,0,0,0.8); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
      <svg viewBox="0 0 384 512" fill="currentColor" style="width: 20px; height: 20px;">
        <path d="M192 0C85.49 0 0 85.49 0 192c0 71.5 38.9 133.7 96.7 166.8L192 512l95.3-153.2C345.1 325.7 384 263.5 384 192C384 85.49 298.51 0 192 0zm0 320c-70.69 0-128-57.31-128-128s57.31-128 128-128s128 57.31 128 128s-57.31 128-128z"/>
      </svg>
    </div>
  `;
}

function makeDotIcon(kind: MarkerKind) {
  return L.divIcon({
    className: "",
    html: markerHtml(kind),
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
}

function MapEventHandler({ 
  onMapReady, 
  center, 
  searchedTown 
}: { 
  onMapReady?: (actions: { zoomIn: () => void; zoomOut: () => void; setView: (center: [number, number], zoom?: number) => void }) => void;
  center?: [number, number];
  searchedTown?: [number, number] | null;
}) {
  const map = useMap();
  
  useMapEvents({
    click: () => {},
    locationfound: () => {},
    locationerror: () => {},
  });

  useEffect(() => {
    if (onMapReady && map) {
      onMapReady({
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
        setView: (center: [number, number], zoom?: number) => map.setView(center, zoom || 8),
      });
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (center && map) {
      map.setView(center, 8);
    }
  }, [center, map]);

  useEffect(() => {
    if (searchedTown && map) {
      map.setView(searchedTown, 12);
    }
  }, [searchedTown, map]);

  return null;
}

function DynamicMarkers({ sites }: { sites?: any[] }) {
  const [dynamicMarkers, setDynamicMarkers] = useState<MapMarker[]>([]);
  const markerRefs = useState<any>({})

  useEffect(() => {
    const loadSites = async () => {
      try {
        // If sites are provided as prop, use them
        if (sites && sites.length > 0) {
          const markers: MapMarker[] = sites
            .filter((site: any) => site.lat != null && site.lng != null && !isNaN(site.lat) && !isNaN(site.lng))
            .map((site: any, index: number) => ({
              id: `site-${site._id || site.id}-${site.name?.replace(/\s+/g, '-') || 'unknown'}-${index}`,
              position: [site.lat, site.lng] as [number, number],
              kind: site.status === "Active" ? "active" : 
                    site.status === "Warning" ? "unstable" : "unavailable" as MarkerKind,
              site: site
            }));
          setDynamicMarkers(markers);
        } else {
          // Fallback to fetching from API if no sites prop provided
          const response = await fetch('/api/sites');
          const data = await response.json();
          if (data.success && data.data) {
            const markers: MapMarker[] = data.data
              .filter((site: any) => site.lat != null && site.lng != null && !isNaN(site.lat) && !isNaN(site.lng))
              .map((site: any, index: number) => ({
                id: `site-${site._id || site.id}-${site.name?.replace(/\s+/g, '-') || 'unknown'}-${index}`,
                position: [site.lat, site.lng] as [number, number],
                kind: site.status === "Active" ? "active" : 
                      site.status === "Warning" ? "unstable" : "unavailable" as MarkerKind,
                site: site
              }));
            setDynamicMarkers(markers);
          }
        }
      } catch (error) {
        console.error('Error loading sites:', error);
      }
    };

    loadSites();
  }, [sites]);

  const getStatusColor = (status: string) => {
    if (status === "Active") return "text-emerald-400";
    if (status === "Warning") return "text-amber-400";
    return "text-red-400";
  };

  const getStatusBgColor = (status: string) => {
    if (status === "Active") return "bg-emerald-500/20";
    if (status === "Warning") return "bg-amber-500/20";
    return "bg-red-500/20";
  };

  const getSafeValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const handleMarkerMouseOver = (e: any) => {
    e.target.openPopup();
  };

  const handleMarkerMouseOut = (e: any) => {
    e.target.closePopup();
  };

  return (
    <>
      {dynamicMarkers.map((marker) => (
        <Marker 
          key={marker.id} 
          position={marker.position} 
          icon={makeDotIcon(marker.kind)}
          eventHandlers={{
            mouseover: handleMarkerMouseOver,
            mouseout: handleMarkerMouseOut
          }}
        >
          <Popup 
            className="custom-popup"
            closeButton={false}
            autoClose={false}
            closeOnClick={false}
          >
            <div className="w-64 p-3 bg-black/90 rounded-lg border border-white/20 text-white text-sm">
              <h3 className="font-semibold text-white mb-2">{getSafeValue(marker.site?.name || "Unknown Site")}</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className={`font-medium ${getStatusColor(getSafeValue(marker.site?.status))}`}>
                    {getSafeValue(marker.site?.status)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-white/70">Assigned Personnel:</span>
                  <span className="text-right text-white/80">{getSafeValue(marker.site?.assignedPersonnel)}</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-white/70">Latitude:</span>
                  <span className="text-right text-white/80">
                    {marker.position && marker.position[0] ? marker.position[0].toFixed(6) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-white/70">Longitude:</span>
                  <span className="text-right text-white/80">
                    {marker.position && marker.position[1] ? marker.position[1].toFixed(6) : 'N/A'}
                  </span>
                </div>

                {marker.site?.lastUpdate && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white/70">Updated:</span>
                    <span className="text-right text-white/60">
                      {new Date(marker.site.lastUpdate).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className={`mt-3 px-2 py-1 rounded text-center font-medium text-xs ${getStatusBgColor(getSafeValue(marker.site?.status))}`}>
                  {getSafeValue(marker.site?.status) === 'Active' && '✓ All Systems Operational'}
                  {getSafeValue(marker.site?.status) === 'Warning' && '⚠ Check Required'}
                  {getSafeValue(marker.site?.status) === 'Unavailable' && '✕ Offline'}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function LeafletMap({
  className,
  center,
  onMapReady,
  searchedTown,
  sites,
}: {
  className?: string;
  center?: [number, number];
  onMapReady?: (actions: { zoomIn: () => void; zoomOut: () => void; setView: (center: [number, number], zoom?: number) => void }) => void;
  searchedTown?: [number, number] | null;
  sites?: any[];
}) {
  return (
    <div className={className ? `${className} h-full w-full` : "h-full w-full"}>
      <MapContainer
        center={center || [9.8, 124.30]}
        zoom={10}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <MapEventHandler onMapReady={onMapReady} center={center} searchedTown={searchedTown} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <DynamicMarkers sites={sites} />
        {searchedTown && (
          <Marker
            position={searchedTown}
            icon={L.divIcon({
              className: "",
              html: `<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px white; box-shadow: 0 0 0 4px rgba(59,130,246,0.4), 0 0 12px rgba(59,130,246,0.6); animation: pulse 1.5s infinite;" />`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          />
        )}
      </MapContainer>
    </div>
  );
}
