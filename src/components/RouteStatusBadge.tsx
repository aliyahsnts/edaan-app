export type RouteStatusBadgeStatus =
  | "safe"
  | "risky"
  | "not-recommended"
  | "charging-stop";

const routeStatusConfig: Record<
  RouteStatusBadgeStatus,
  {
    className: string;
    label: string;
  }
> = {
  safe: {
    className: "border-emerald-400 bg-emerald-400/10 text-emerald-200",
    label: "Safe and reachable",
  },
  risky: {
    className: "border-amber-400 bg-amber-400/10 text-amber-200",
    label: "Reachable but risky",
  },
  "not-recommended": {
    className: "border-rose-400 bg-rose-400/10 text-rose-200",
    label: "Not recommended / not reachable",
  },
  "charging-stop": {
    className: "border-sky-400 bg-sky-400/10 text-sky-200",
    label: "Suggested charging stop",
  },
};

export default function RouteStatusBadge({
  status,
}: {
  status: RouteStatusBadgeStatus;
}) {
  const config = routeStatusConfig[status];

  return (
    <div
      className={`rounded-lg border px-4 py-4 text-center text-lg font-bold ${config.className}`}
    >
      {config.label}
    </div>
  );
}
