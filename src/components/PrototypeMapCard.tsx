export default function PrototypeMapCard({
  destinationLabel = "Destination",
  startLabel = "Start point",
}: {
  destinationLabel?: string;
  startLabel?: string;
}) {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden edaan-card">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,39,42,0.6)_1px,transparent_1px),linear-gradient(0deg,rgba(39,39,42,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(16,185,129,0.16),transparent_26%)]" />

      <div className="absolute left-[8%] top-[22%] h-2 w-[40%] rotate-[14deg] rounded-full bg-zinc-800" />
      <div className="absolute left-[46%] top-[19%] h-2 w-[38%] -rotate-[18deg] rounded-full bg-zinc-800" />
      <div className="absolute left-[18%] top-[78%] h-2 w-[64%] rotate-[3deg] rounded-full bg-zinc-800" />
      <div className="absolute left-[63%] top-[18%] h-[62%] w-2 rotate-[12deg] rounded-full bg-zinc-800" />

      <div
        aria-label="Route line"
        className="absolute left-[15%] top-[66%] h-5 w-[72%] -rotate-[24deg] rounded-full bg-zinc-700 shadow-lg shadow-black/30"
      />
      <div
        aria-label="Safe road segment"
        className="absolute left-[18%] top-[63%] h-3 w-[35%] -rotate-[24deg] rounded-full bg-emerald-400 shadow-lg shadow-emerald-950/40"
      />
      <div
        aria-label="Risky road segment"
        className="absolute left-[52%] top-[45%] h-3 w-[31%] -rotate-[24deg] rounded-full bg-amber-400 shadow-lg shadow-amber-950/40"
      />

      <MapPreviewMarker
        label={startLabel}
        marker="S"
        tone="start"
        x="left-[14%]"
        y="top-[67%]"
      />
      <MapPreviewMarker
        label={destinationLabel}
        marker="D"
        tone="destination"
        x="left-[86%]"
        y="top-[35%]"
      />
      <MapPreviewMarker
        label="Charging stop pin"
        marker="C"
        tone="charging"
        x="left-[47%]"
        y="top-[53%]"
      />
      <MapPreviewMarker
        label="Highway warning marker"
        marker="!"
        tone="warning"
        x="left-[67%]"
        y="top-[43%]"
      />

      <div className="absolute left-4 top-4 edaan-card px-4 py-3 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Prototype Map
        </p>
        <p className="mt-1 text-sm font-bold text-white">
          LEV route confidence preview
        </p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 grid gap-2 p-3 edaan-card sm:grid-cols-2 lg:grid-cols-4">
        <MapPreviewLegend label="Route line" tone="route" />
        <MapPreviewLegend label="Safe road segment" tone="safe" />
        <MapPreviewLegend label="Risky road segment" tone="risky" />
        <MapPreviewLegend label="Charging and highway markers" tone="marker" />
      </div>
    </div>
  );
}

function MapPreviewMarker({
  label,
  marker,
  tone,
  x,
  y,
}: {
  label: string;
  marker: string;
  tone: "charging" | "destination" | "start" | "warning";
  x: string;
  y: string;
}) {
  const toneClass = {
    charging: "border-sky-200 bg-sky-400 text-zinc-950",
    destination: "border-white bg-rose-400 text-white",
    start: "border-white bg-emerald-400 text-zinc-950",
    warning: "border-white bg-amber-400 text-zinc-950",
  }[tone];

  return (
    <div className={`absolute ${x} ${y} -translate-x-1/2 -translate-y-1/2`}>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-black shadow-xl ${toneClass}`}
      >
        {marker}
      </div>
      <div className="mt-2 max-w-36 rounded-md border border-zinc-700 bg-zinc-950/90 px-2.5 py-1.5 text-xs font-bold text-zinc-100 shadow-lg">
        {label}
      </div>
    </div>
  );
}

function MapPreviewLegend({
  label,
  tone,
}: {
  label: string;
  tone: "marker" | "risky" | "route" | "safe";
}) {
  const toneClass = {
    marker: "bg-sky-400",
    risky: "bg-amber-400",
    route: "bg-zinc-500",
    safe: "bg-emerald-400",
  }[tone];

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
      <span className={`h-2.5 w-6 rounded-full ${toneClass}`} />
      {label}
    </div>
  );
}
