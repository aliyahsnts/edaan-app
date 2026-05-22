import RouteStatusBadge from "@/components/RouteStatusBadge";

export type ChargingPoint = {
  distanceKm: number;
  estimatedChargingTime: string;
  location: string;
  name: string;
  notes: string;
};

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ChargingAwareness({
  chargingPoints,
}: {
  chargingPoints: ChargingPoint[];
}) {
  return (
    <section id="charging-awareness" className="grid gap-5 scroll-mt-6">
      <SectionHeading
        eyebrow="Charging Awareness"
        title="Prototype charging options"
        description="Nearby charging options and estimated times to plan your trip."
      />

      <div className="rounded-lg border border-sky-400/70 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-100">
        LEV charging may take time. Charge before long trips when possible.
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {chargingPoints.map((chargingPoint) => (
          <article key={chargingPoint.name} className="edaan-card p-5">
            <RouteStatusBadge status="charging-stop" />

            <div className="mt-5">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {chargingPoint.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-zinc-400">
                {chargingPoint.location}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <ChargingPointRow
                label="Distance"
                value={`${formatNumber(chargingPoint.distanceKm)} km`}
              />
              <ChargingPointRow
                label="Estimated Charging Time"
                value={chargingPoint.estimatedChargingTime}
              />
              <ChargingPointRow label="Notes" value={chargingPoint.notes} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">{title}</h2>
      {description ? <p className="mt-2 text-base leading-7 text-sky-200">{description}</p> : null}
    </div>
  );
}

function ChargingPointRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg edaan-muted px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}
