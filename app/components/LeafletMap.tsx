"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

type MarkerKind = "good" | "warn" | "bad" | "active" | "unstable" | "unavailable";

type MapMarker = {
  id: string;
  kind: MarkerKind;
  position: [number, number];
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

function DynamicMarkers() {
  const [dynamicMarkers, setDynamicMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const loadSites = () => {
      const sites = JSON.parse(localStorage.getItem("bohol_sites") || "[]");
      const markers: MapMarker[] = sites.map((site: any, index: number) => ({
        id: `site-${site.id}-${site.name?.replace(/\s+/g, '-') || 'unknown'}-${index}`,
        position: [site.lat, site.lng] as [number, number],
        kind: site.status === "Active" ? "active" : 
              site.status === "Warning" ? "unstable" : "unavailable" as MarkerKind
      }));
      setDynamicMarkers(markers);
    };

    loadSites();
    
    const handleStorageChange = () => {
      loadSites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bohol_sites_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bohol_sites_updated', handleStorageChange);
    };
  }, []);

  return (
    <>
      {dynamicMarkers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={makeDotIcon(marker.kind)} />
      ))}
    </>
  );
}

export default function LeafletMap({
  className,
  center,
  onMapReady,
  searchedTown,
}: {
  className?: string;
  center?: [number, number];
  onMapReady?: (actions: { zoomIn: () => void; zoomOut: () => void; setView: (center: [number, number], zoom?: number) => void }) => void;
  searchedTown?: [number, number] | null;
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
        <DynamicMarkers />
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
