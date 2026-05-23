"use client";

import { useEffect, useMemo, useState } from "react";
import TopHeader from "@/components/TopHeader";
import RouteMap from "@/components/RouteMap";
import { AlertTriangle, CornerUpRight, Search, ShieldCheck, Zap } from "lucide-react";

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

const iloiloCityCenter: Coordinate = [122.5621, 10.7202];
const emptyRestrictedSegments: Coordinate[][] = [];
const tripStart = "SM City Iloilo, Mandurriao, Iloilo City, Philippines";
const tripDestination = "Festive Walk Mall, Iloilo City, Philippines";
const tripStartShort = "SM City";
const tripDestinationShort = "Festive Walk";
const routeOptions: RouteOption[] = [
  {
    alert: "Primary path keeps the trip direct while staying on LEV-aware roads.",
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
  const [selectedRouteId, setSelectedRouteId] = useState(routeOptions[0].id);
  const [areaQuery, setAreaQuery] = useState("");
  const [routesById, setRoutesById] = useState<Record<string, RouteResult>>({});
  const [routeErrorsById, setRouteErrorsById] = useState<Record<string, string>>(
    {},
  );

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

  return (
    <main className="min-h-screen relative flex flex-col h-screen">
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

      <div className="z-10 relative flex flex-col h-full pointer-events-none">
        <div className="pointer-events-auto">
          <TopHeader rightAction="search-avatar" />
        </div>

        <div className="px-5 mt-2 flex flex-col gap-3 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-4 border border-white">
            <div className="w-14 h-14 rounded-xl bg-[#126b34] text-white flex items-center justify-center flex-shrink-0">
              <CornerUpRight size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 mb-0.5">
                {routeStatus}
              </p>
              <h2 className="text-lg font-black text-zinc-900 leading-tight">
                {selectedRoute.nextStep}
              </h2>
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white/95 p-3 shadow-lg backdrop-blur-md">
            <label className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2">
              <Search size={16} className="text-[#126b34]" />
              <input
                value={areaQuery}
                onChange={(event) => setAreaQuery(event.target.value)}
                placeholder="Choose route or detour"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-zinc-900 outline-none placeholder:text-zinc-500"
              />
            </label>

            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
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
                    <span className="mt-0.5 block leading-tight">{option.label}</span>
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
          </div>

          <div className="self-start bg-white/95 backdrop-blur-md text-zinc-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-md border border-zinc-100 text-sm">
            <ShieldCheck size={16} className="text-[#126b34]" />{" "}
            {selectedRoute.safetyScore} Safety Score
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg w-56 border border-zinc-100 mt-2">
            <div className="flex justify-between items-start mb-2">
              <Zap size={16} className="text-[#2bc18b]" />
              <span className="bg-[#bbedcc] text-[#0e5428] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                BEST-PATH
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold">
              Arrival Battery
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-3xl font-black text-zinc-900">64%</h3>
              <span className="text-xs font-bold text-[#126b34]">down 2%</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full">
              <div className="bg-[#2bc18b] h-full flex-[0.64] rounded-l-full" />
              <div className="bg-zinc-200 h-full flex-[0.36] rounded-r-full" />
            </div>
          </div>
        </div>

        <div className="mt-auto mb-4 px-5 flex flex-col gap-4 pointer-events-auto">
          <div className="bg-[#e75f78] text-white rounded-2xl p-4 shadow-lg ml-auto w-64 border-2 border-[#c22141]/20">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle size={14} /> REGULATORY ALERT
            </div>
            <p className="text-sm font-medium leading-snug">
              {selectedRoute.alert}{" "}
              <span className="underline font-bold decoration-2 underline-offset-2">
                LEV-aware
              </span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
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
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
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
              <button className="bg-[#9c2a41] hover:bg-[#822135] transition-colors text-white font-bold py-2.5 px-6 rounded-xl shadow-md">
                Exit
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-700">
                {selectedRoute.startShort}
              </span>
              <div className="flex-1 h-2 bg-zinc-100 rounded-full flex items-center relative overflow-visible">
                <div
                  className="h-full bg-[#126b34] rounded-full absolute left-0"
                  style={{ width: `${selectedRoute.progress}%` }}
                />
                <div className="w-3 h-3 bg-[#c22141] rounded-full absolute right-0 -mr-1" />
              </div>
              <span className="text-[10px] font-bold text-zinc-900">
                {selectedRoute.destinationShort}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
