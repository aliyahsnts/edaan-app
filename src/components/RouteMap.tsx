"use client";

import type { MutableRefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import maplibregl, {
  type GeoJSONSource,
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type Marker,
} from "maplibre-gl";

type Coordinate = [number, number];

type RouteGeometry = {
  type: "LineString";
  coordinates: Coordinate[];
};

type LineFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, string>;
    geometry: RouteGeometry;
  }>;
};

export type MapPin = {
  coordinates: Coordinate;
  detail: string;
  id: string;
  label: string;
  type: "charging" | "hazard";
};

type RouteMapProps = {
  chargingPins?: MapPin[];
  className?: string;
  destinationLabel?: string;
  fallbackCenter?: Coordinate;
  fallbackZoom?: number;
  geometry: RouteGeometry | null;
  hazardPins?: MapPin[];
  restrictedSegments?: Coordinate[][];
  showLegend?: boolean;
  showMaptilerNotice?: boolean;
  startLabel?: string;
};

const defaultCenter: Coordinate = [122.5621, 10.7202];
const defaultZoom = 12.6;
const fallbackStyle = "https://demotiles.maplibre.org/style.json";
const _rawMapTiler = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "";
let mapTilerKey = _rawMapTiler.trim();
if (mapTilerKey) {
  mapTilerKey = mapTilerKey.split("#")[0];
  try {
    const maybeUrl = new URL(mapTilerKey);
    const keyParam = maybeUrl.searchParams.get("key");
    if (keyParam) {
      mapTilerKey = keyParam;
    }
  } catch {
    // not a URL; keep the trimmed value
  }
}

const mapStyle = mapTilerKey
  ? `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`
  : fallbackStyle;

function createEmptyFeatureCollection(): LineFeatureCollection {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

function createRouteFeature(geometry: RouteGeometry | null): LineFeatureCollection {
  return {
    type: "FeatureCollection",
    features: geometry
      ? [
          {
            type: "Feature",
            properties: {},
            geometry,
          },
        ]
      : [],
  };
}

function createRestrictedFeatureCollection(
  restrictedSegments: Coordinate[][],
): LineFeatureCollection {
  return {
    type: "FeatureCollection",
    features: restrictedSegments.map((coordinates, index) => ({
      type: "Feature",
      properties: {
        id: `restricted-${index}`,
      },
      geometry: {
        type: "LineString",
        coordinates,
      },
    })),
  };
}

function getSource(map: MapLibreMap, id: string) {
  return map.getSource(id) as GeoJSONSource | undefined;
}

function setGeoJsonSource(
  map: MapLibreMap,
  id: string,
  data: LineFeatureCollection,
) {
  const source = getSource(map, id);

  if (source) {
    source.setData(data);
  } else {
    map.addSource(id, {
      data,
      type: "geojson",
    });
  }
}

function buildMarkerElement(pin: MapPin) {
  const element = document.createElement("div");
  const dot = document.createElement("span");
  const isCharging = pin.type === "charging";

  element.className = [
    "flex",
    "h-5",
    "w-5",
    "items-center",
    "justify-center",
    "rounded-full",
    "border-[3px]",
    "border-white",
    "ring-2",
    "shadow-lg",
    "shadow-zinc-950/25",
    isCharging
      ? "bg-emerald-400/35 ring-emerald-400"
      : "bg-amber-400/35 ring-amber-400",
  ].join(" ");
  element.setAttribute("aria-label", pin.label);
  element.title = pin.label;
  dot.className = [
    "h-2",
    "w-2",
    "rounded-full",
    isCharging ? "bg-emerald-400" : "bg-amber-400",
  ].join(" ");
  element.append(dot);

  return element;
}

function buildPopupContent(pin: MapPin) {
  const content = document.createElement("div");
  const title = document.createElement("strong");
  const detail = document.createElement("p");

  title.textContent = pin.label;
  detail.textContent = pin.detail;
  detail.className = "mt-1";

  content.append(title, detail);

  return content;
}

function updateMarkers(
  map: MapLibreMap,
  markersRef: MutableRefObject<Marker[]>,
  pins: MapPin[],
) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = pins.map((pin) =>
    new maplibregl.Marker({
      anchor: "center",
      element: buildMarkerElement(pin),
    })
      .setLngLat(pin.coordinates)
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setDOMContent(
          buildPopupContent(pin),
        ),
      )
      .addTo(map),
  );
}

function fitRouteBounds(
  map: MapLibreMap,
  geometry: RouteGeometry | null,
  pins: MapPin[],
  fallbackCenter: Coordinate,
  fallbackZoom: number,
) {
  const coordinates = [
    ...(geometry?.coordinates ?? []),
    ...pins.map((pin) => pin.coordinates),
  ];

  if (!coordinates.length) {
    map.easeTo({
      center: fallbackCenter,
      zoom: fallbackZoom,
    });
    return;
  }

  const bounds = coordinates.reduce(
    (nextBounds, coordinate) => nextBounds.extend(coordinate),
    new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
  );

  map.fitBounds(bounds as LngLatBoundsLike, {
    maxZoom: 14,
    padding: 52,
  });
}

export default function RouteMap({
  chargingPins = [],
  className = "h-full min-h-[320px] w-full overflow-hidden rounded-lg border border-zinc-800",
  destinationLabel = "Destination",
  fallbackCenter = defaultCenter,
  fallbackZoom = defaultZoom,
  geometry,
  hazardPins = [],
  restrictedSegments = [],
  showLegend = true,
  showMaptilerNotice = true,
  startLabel = "Start",
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const allPins = useMemo(
    () => [...chargingPins, ...hazardPins],
    [chargingPins, hazardPins],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      attributionControl: {
        compact: true,
      },
      center: fallbackCenter,
      container: containerRef.current,
      style: mapStyle,
      zoom: fallbackZoom,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [fallbackCenter, fallbackZoom]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const activeMap = map;

    function renderOverlays() {
      const routeData = createRouteFeature(geometry);
      const restrictedData =
        restrictedSegments.length > 0
          ? createRestrictedFeatureCollection(restrictedSegments)
          : createEmptyFeatureCollection();

      setGeoJsonSource(activeMap, "route", routeData);
      setGeoJsonSource(activeMap, "restricted-segments", restrictedData);

      if (!activeMap.getLayer("route-casing")) {
        activeMap.addLayer({
          id: "route-casing",
          paint: {
            "line-color": "#052e16",
            "line-opacity": 0.92,
            "line-width": 9,
          },
          source: "route",
          type: "line",
        });
      }

      if (!activeMap.getLayer("route-line")) {
        activeMap.addLayer({
          id: "route-line",
          paint: {
            "line-color": "#34d399",
            "line-opacity": 0.96,
            "line-width": 5,
          },
          source: "route",
          type: "line",
        });
      }

      if (!activeMap.getLayer("restricted-line")) {
        activeMap.addLayer({
          id: "restricted-line",
          paint: {
            "line-color": "#f43f5e",
            "line-dasharray": [1.5, 1],
            "line-opacity": 0.95,
            "line-width": 6,
          },
          source: "restricted-segments",
          type: "line",
        });
      }

      updateMarkers(activeMap, markersRef, allPins);
      fitRouteBounds(
        activeMap,
        geometry,
        allPins,
        fallbackCenter,
        fallbackZoom,
      );
    }

    if (activeMap.loaded()) {
      renderOverlays();
    } else {
      activeMap.once("load", renderOverlays);

      return () => {
        activeMap.off("load", renderOverlays);
      };
    }
  }, [allPins, fallbackCenter, fallbackZoom, geometry, restrictedSegments]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} aria-label="Route map" className="h-full w-full" />

      {showMaptilerNotice && !mapTilerKey ? (
        <div className="absolute bottom-3 left-3 rounded-md border border-amber-400/60 bg-zinc-950/90 px-3 py-2 text-xs font-semibold text-amber-100 shadow-lg">
          Add NEXT_PUBLIC_MAPTILER_KEY for MapTiler tiles
        </div>
      ) : null}

      {showLegend ? (
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <MapBadge label="Route" tone="route" />
          {chargingPins.length > 0 ? (
            <MapBadge label="Charging" tone="charging" />
          ) : null}
          {hazardPins.length > 0 ? <MapBadge label="Hazard" tone="hazard" /> : null}
          {restrictedSegments.length > 0 ? (
            <MapBadge label="Restricted" tone="restricted" />
          ) : null}
        </div>
      ) : null}

      <div className="sr-only">
        {startLabel} to {destinationLabel}
      </div>
    </div>
  );
}

function MapBadge({
  label,
  tone,
}: {
  label: string;
  tone: "charging" | "hazard" | "restricted" | "route";
}) {
  const toneClass = {
    charging: "bg-emerald-400",
    hazard: "bg-amber-400",
    restricted: "bg-rose-400",
    route: "bg-teal-300",
  }[tone];

  return (
    <span className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950/85 px-2.5 py-1 text-xs font-semibold text-zinc-100 shadow-lg">
      <span className={`h-2.5 w-2.5 rounded-full ${toneClass}`} />
      {label}
    </span>
  );
}
