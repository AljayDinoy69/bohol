"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
});

export default function MapPanel({ onMapReady, searchedTown }: { onMapReady?: (actions: { zoomIn: () => void; zoomOut: () => void; setView: (center: [number, number], zoom?: number) => void }) => void; searchedTown?: [number, number] | null }) {
  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <LeafletMap className="absolute inset-0" onMapReady={onMapReady} searchedTown={searchedTown} />
    </div>
  );
}