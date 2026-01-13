"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./HomeLeafletMap"), {
  ssr: false,
});

export default function HomeMapPanel() {
  return (
    <div className="relative z-0 aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[inset_0_0_1px_rgba(255,255,255,0.06)]">
      <LeafletMap className="absolute inset-0" />
    </div>
  );
}
