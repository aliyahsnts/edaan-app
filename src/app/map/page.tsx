"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import TopHeader from "@/components/TopHeader";
import ManualBatteryInput from "@/components/ManualBatteryInput";
import RouteMap from "@/components/RouteMap";
import {
  AlertTriangle,
  ChevronLeft,
  CornerUpRight,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  getSelectedVehicleModel,
  getVehicleModelName,
  getVehicleType,
} from "@/lib/vehicle-profile";
import {
  updateVehicleProfile,
  useVehicleProfile,
} from "@/lib/use-vehicle-profile";

type Coordinate = [number, number];

type RouteGeometry = {
  type: "LineString";
  coordinates: Coordinate[];
};

type RouteResult = {
  distanceKm: number;
  durationMinutes: number | null;
  geometry: RouteGeometry;
  restrictedRoadWarning: {
    active: boolean;
    message: string;
    segments: Coordinate[][];
  };
};

type RouteOption = {
  alert: string;
  destination: string;
  destinationShort: string;
  fallbackDistanceKm: number;
  fallbackDurationMinutes: number;
  id: string;
  label: string;
  nextStep: string;
  progress: number;
  safetyScore: number;
  start: string;
  startShort: string;
  variant: "Detour 1" | "Detour 2" | "Primary";
  viaLabel: string;
  waypoints?: Coordinate[];
};

type MapWidgetId = "alert" | "choices" | "route" | "trip" | "vehicle";

type MapWidgetTab = {
  icon: LucideIcon;
  id: MapWidgetId;
  label: string;
};

const iloiloCityCenter: Coordinate = [122.5621, 10.7202];
const emptyRestrictedSegments: Coordinate[][] = [];
const tripStart = "SM City Iloilo, Mandurriao, Iloilo City, Philippines";
const tripDestination = "Festive Walk Mall, Iloilo City, Philippines";
const tripStartShort = "SM City";
const tripDestinationShort = "Festive Walk";
const mapWidgetTabs: MapWidgetTab[] = [
  { icon: CornerUpRight, id: "route", label: "Route" },
  { icon: Search, id: "choices", label: "Choices" },
  { icon: Zap, id: "vehicle", label: "Vehicle" },
  { icon: AlertTriangle, id: "alert", label: "Alert" },
  { icon: ShieldCheck, id: "trip", label: "Trip" },
];
const routeOptions: RouteOption[] = [
  {
    alert: "Primary path keeps the trip direct while staying on allowed roads.",
    destination: tripDestination,
    destinationShort: tripDestinationShort,
    fallbackDistanceKm: 2.3,
    fallbackDurationMinutes: 9,
    id: "primary",
    label: "Main route",
    nextStep: "Turn right onto Megaworld Boulevard",
    progress: 60,
    safetyScore: 98,
    start: tripStart,
    startShort: tripStartShort,
    variant: "Primary",
    viaLabel: "Direct",
  },
  {
    alert: "Detour 1 routes through Atria to avoid the busier mall-front turn.",
    destination: tripDestination,
    destinationShort: tripDestinationShort,
    fallbackDistanceKm: 3.2,
    fallbackDurationMinutes: 12,
    id: "detour-atria",
    label: "Via Atria",
    nextStep: "Detour through Atria Park District",
    progress: 46,
    safetyScore: 96,
    start: tripStart,
    startShort: tripStartShort,
    variant: "Detour 1",
    viaLabel: "Atria Park",
    waypoints: [[122.550354, 10.705177]],
  },
  {
    alert: "Detour 2 bends north first, useful when the direct corridor is congested.",
    destination: tripDestination,
    destinationShort: tripDestinationShort,
    fallbackDistanceKm: 2.8,
    fallbackDurationMinutes: 11,
    id: "detour-north",
    label: "North bend",
    nextStep: "Use the north bend toward Festive Walk",
    progress: 42,
    safetyScore: 94,
    start: tripStart,
    startShort: tripStartShort,
    variant: "Detour 2",
    viaLabel: "North access",
    waypoints: [[122.5458, 10.7149]],
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCoordinate(value: unknown): value is Coordinate {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

function isCoordinateSegment(value: unknown): value is Coordinate[] {
  return Array.isArray(value) && value.length > 1 && value.every(isCoordinate);
}

function isRouteResult(value: unknown): value is RouteResult {
  if (
    !isRecord(value) ||
    !isRecord(value.geometry) ||
    !isRecord(value.restrictedRoadWarning)
  ) {
    return false;
  }

  const coordinates = value.geometry.coordinates;
  const restrictedSegments = value.restrictedRoadWarning.segments;

  return (
    value.geometry.type === "LineString" &&
    Array.isArray(coordinates) &&
    coordinates.length > 1 &&
    coordinates.every(isCoordinate) &&
    Array.isArray(restrictedSegments) &&
    restrictedSegments.every(isCoordinateSegment) &&
    typeof value.distanceKm === "number" &&
    (typeof value.durationMinutes === "number" ||
      value.durationMinutes === null)
  );
}

function getApiError(payload: unknown) {
  return isRecord(payload) && typeof payload.error === "string"
    ? payload.error
    : "Could not load road-following route.";
}

function formatDistance(distanceKm: number | null, fallbackDistanceKm: number) {
  if (typeof distanceKm !== "number" || !Number.isFinite(distanceKm)) {
    return `${fallbackDistanceKm.toFixed(1)} km`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function formatDuration(
  durationMinutes: number | null,
  fallbackDurationMinutes: number,
) {
  if (
    typeof durationMinutes !== "number" ||
    !Number.isFinite(durationMinutes)
  ) {
    return `${fallbackDurationMinutes} min`;
  }

  return `${Math.max(1, Math.round(durationMinutes))} min`;
}

export default function MapNavigation() {
  const [activeWidgetId, setActiveWidgetId] = useState<MapWidgetId | null>(
    "route",
  );
  const [selectedRouteId, setSelectedRouteId] = useState(routeOptions[0].id);
  const [areaQuery, setAreaQuery] = useState("");
  const [routesById, setRoutesById] = useState<Record<string, RouteResult>>({});
  const [routeErrorsById, setRouteErrorsById] = useState<Record<string, string>>(
    {},
  );
  const vehicleProfile = useVehicleProfile();

  const selectedRoute = useMemo(
    () =>
      routeOptions.find((option) => option.id === selectedRouteId) ??
      routeOptions[0],
    [selectedRouteId],
  );

  const visibleRouteOptions = useMemo(() => {
    const query = areaQuery.trim().toLowerCase();

    if (!query) {
      return routeOptions;
    }

    return routeOptions.filter((option) =>
      [
        option.variant,
        option.label,
        option.viaLabel,
        option.startShort,
        option.destinationShort,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [areaQuery]);

  const route = routesById[selectedRoute.id] ?? null;
  const routeError = routeErrorsById[selectedRoute.id] ?? "";
  const selectedVehicleType = getVehicleType(vehicleProfile.selectedTypeId);
  const selectedVehicleModel = getSelectedVehicleModel(vehicleProfile);
  const selectedVehicleName = getVehicleModelName(selectedVehicleModel);
  const currentRangeKm = Math.round(
    (selectedVehicleModel.maxRangeKm * vehicleProfile.batteryPercentage) / 100,
  );
  const routeDistanceKm = route?.distanceKm ?? selectedRoute.fallbackDistanceKm;
  const routeBatteryUsePercentage = Math.min(
    100,
    Math.ceil((routeDistanceKm / selectedVehicleModel.maxRangeKm) * 100),
  );
  const arrivalBatteryPercentage = Math.max(
    0,
    vehicleProfile.batteryPercentage - routeBatteryUsePercentage,
  );

  const handleBatteryPercentageChange = (batteryPercentage: number) => {
    updateVehicleProfile((currentProfile) => ({
      ...currentProfile,
      batteryPercentage,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoute() {
      try {
        const response = await fetch("/api/route", {
          body: JSON.stringify({
            start: selectedRoute.start,
            destination: selectedRoute.destination,
            waypoints: selectedRoute.waypoints ?? [],
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as unknown;

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        if (!isRouteResult(payload)) {
          throw new Error("Route response did not include road geometry.");
        }

        setRoutesById((currentRoutes) => ({
          ...currentRoutes,
          [selectedRoute.id]: payload,
        }));
        setRouteErrorsById((currentErrors) => {
          const nextErrors = { ...currentErrors };
          delete nextErrors[selectedRoute.id];
          return nextErrors;
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setRouteErrorsById((currentErrors) => ({
          ...currentErrors,
          [selectedRoute.id]:
            error instanceof Error
              ? error.message
              : "Could not load road-following route.",
        }));
      }
    }

    loadRoute();

    return () => {
      controller.abort();
    };
  }, [selectedRoute]);

  const restrictedSegments =
    route?.restrictedRoadWarning.segments ?? emptyRestrictedSegments;
  const routeStatus = route
    ? "Road route active"
    : routeError
      ? "Base roads only"
      : "Syncing road route";
  const activeWidget =
    mapWidgetTabs.find((widget) => widget.id === activeWidgetId) ?? null;
  const ActiveWidgetIcon = activeWidget?.icon ?? CornerUpRight;
  const activeWidgetContent = (() => {
    switch (activeWidgetId) {
      case "route":
        return (
          <>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#126b34] text-white">
                <CornerUpRight size={28} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-xs font-bold text-zinc-500">
                  {routeStatus} for {selectedVehicleName}
                </p>
                <h2 className="text-lg font-black leading-tight text-zinc-900">
                  {selectedRoute.nextStep}
                </h2>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-100 bg-[#eef7f1] px-4 py-2 text-sm font-bold text-zinc-900">
              <ShieldCheck size={16} className="text-[#126b34]" />
              {selectedRoute.safetyScore} Safety Score
            </div>
          </>
        );

      case "choices":
        return (
          <>
            <label className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
              <Search size={16} className="text-[#126b34]" />
              <input
                value={areaQuery}
                onChange={(event) => setAreaQuery(event.target.value)}
                placeholder="Choose route or detour"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-zinc-900 outline-none placeholder:text-zinc-500"
              />
            </label>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {visibleRouteOptions.map((option) => {
                const isActive = option.id === selectedRoute.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedRouteId(option.id)}
                    className={`min-w-[128px] rounded-xl px-3 py-2 text-left text-xs font-black transition-colors ${
                      isActive
                        ? "bg-[#126b34] text-white"
                        : "bg-[#eef7f1] text-[#126b34]"
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider opacity-80">
                      {option.variant}
                    </span>
                    <span className="mt-0.5 block leading-tight">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold opacity-75">
                      {option.viaLabel}
                    </span>
                  </button>
                );
              })}
              {!visibleRouteOptions.length ? (
                <div className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-500">
                  No route matches
                </div>
              ) : null}
            </div>
          </>
        );

      case "vehicle":
        return (
          <>
            <div className="mb-2 flex items-start justify-between">
              <Zap size={16} className="text-[#2bc18b]" />
              <span className="rounded-sm bg-[#bbedcc] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0e5428]">
                FROM JOURNEY
              </span>
            </div>
            <div className="mb-3">
              <p className="text-sm font-black leading-tight text-zinc-900">
                {selectedVehicleName}
              </p>
              <p className="mt-1 text-[10px] font-bold text-zinc-500">
                {selectedVehicleType.label} -{" "}
                {selectedVehicleModel.capacityLabel} -{" "}
                {selectedVehicleModel.maxRangeKm} km max
              </p>
            </div>
            <ManualBatteryInput
              compact
              helperText="Shared with journey vehicle setup."
              label="Start battery"
              maxRangeKm={selectedVehicleModel.maxRangeKm}
              onPercentageChange={handleBatteryPercentageChange}
              value={vehicleProfile.batteryPercentage}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#eef7f1] px-2.5 py-2">
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                  Usable range
                </p>
                <p className="mt-0.5 text-sm font-black text-[#126b34]">
                  {currentRangeKm} km
                </p>
              </div>
              <div className="rounded-lg bg-[#eef7f1] px-2.5 py-2">
                <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                  Arrival est.
                </p>
                <p className="mt-0.5 text-sm font-black text-[#126b34]">
                  {arrivalBatteryPercentage}%
                </p>
              </div>
            </div>
          </>
        );

      case "alert":
        return (
          <div className="rounded-xl bg-[#e75f78] p-4 text-white">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle size={14} /> REGULATORY ALERT
            </div>
            <p className="text-sm font-medium leading-snug">
              {selectedRoute.alert}{" "}
              <span className="font-bold underline decoration-2 underline-offset-2">
                {selectedVehicleType.label}-aware checks active.
              </span>
            </p>
          </div>
        );

      case "trip":
        return (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    TRAVEL TIME
                  </p>
                  <h3 className="text-2xl font-black text-[#126b34]">
                    {formatDuration(
                      route?.durationMinutes ?? null,
                      selectedRoute.fallbackDurationMinutes,
                    )}
                  </h3>
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    DISTANCE
                  </p>
                  <h3 className="text-2xl font-black text-zinc-900">
                    {formatDistance(
                      route?.distanceKm ?? null,
                      selectedRoute.fallbackDistanceKm,
                    )}
                  </h3>
                </div>
              </div>
              <button className="rounded-xl bg-[#9c2a41] px-5 py-2.5 font-bold text-white shadow-md transition-colors hover:bg-[#822135]">
                Exit
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-700">
                {selectedRoute.startShort}
              </span>
              <div className="relative flex h-2 flex-1 items-center overflow-visible rounded-full bg-zinc-100">
                <div
                  className="absolute left-0 h-full rounded-full bg-[#126b34]"
                  style={{ width: `${selectedRoute.progress}%` }}
                />
                <div className="absolute right-0 -mr-1 h-3 w-3 rounded-full bg-[#c22141]" />
              </div>
              <span className="text-[10px] font-bold text-zinc-900">
                {selectedRoute.destinationShort}
              </span>
            </div>
          </>
        );

      default:
        return null;
    }
  })();

  return (
    <main className="relative h-screen min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <RouteMap
          className="h-full min-h-0 w-full overflow-hidden"
          fallbackCenter={iloiloCityCenter}
          fallbackZoom={13.2}
          geometry={route?.geometry ?? null}
          restrictedSegments={restrictedSegments}
          showLegend={false}
        />
      </div>

      <div className="pointer-events-auto absolute inset-x-0 top-0 z-30">
        <TopHeader rightAction="search-avatar" />
      </div>

      <section
        aria-label="Map widgets"
        className="pointer-events-none absolute bottom-4 left-0 top-[76px] z-20 flex items-start"
      >
        <nav className="pointer-events-auto flex w-14 flex-col gap-2 pl-2">
          {mapWidgetTabs.map((widget) => {
            const Icon = widget.icon;
            const isActive = activeWidgetId === widget.id;

            return (
              <button
                aria-label={
                  isActive
                    ? `Hide ${widget.label} widget`
                    : `Show ${widget.label} widget`
                }
                aria-pressed={isActive}
                className={`grid h-12 w-12 place-items-center rounded-r-2xl border border-l-0 shadow-lg transition-colors ${
                  isActive
                    ? "border-[#126b34] bg-[#126b34] text-white"
                    : "border-white bg-white/95 text-[#126b34] backdrop-blur-md hover:bg-[#eef7f1]"
                }`}
                key={widget.id}
                onClick={() =>
                  setActiveWidgetId((currentWidgetId) =>
                    currentWidgetId === widget.id ? null : widget.id,
                  )
                }
                title={widget.label}
                type="button"
              >
                <Icon size={20} strokeWidth={2.5} />
              </button>
            );
          })}
        </nav>

        <div className="pointer-events-none h-full w-[calc(100vw-4.5rem)] max-w-[360px] overflow-hidden">
          <article
            aria-hidden={!activeWidgetId}
            className="pointer-events-auto max-h-full overflow-y-auto rounded-r-2xl border border-l-0 border-white bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-300 ease-out no-scrollbar"
            style={{
              transform: activeWidgetId ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef7f1] text-[#126b34]">
                  <ActiveWidgetIcon size={16} strokeWidth={2.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    {activeWidget?.label ?? "Widget"}
                  </p>
                  <h2 className="truncate text-sm font-black text-zinc-900">
                    {selectedRoute.startShort} to {selectedRoute.destinationShort}
                  </h2>
                </div>
              </div>
              <button
                aria-label={`Hide ${activeWidget?.label ?? "widget"} widget`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef7f1] text-[#126b34] transition-colors hover:bg-[#d1f2d9]"
                onClick={() => setActiveWidgetId(null)}
                type="button"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="p-4">{activeWidgetContent}</div>
          </article>
        </div>
      </section>
    </main>
  );
}
