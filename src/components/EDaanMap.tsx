"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";
import maplibregl, {
  type GeoJSONSource,
  type Map as MapLibreMap,
  type Marker,
} from "maplibre-gl";

type Coordinate = [number, number];

type MapPoint = {
  coordinates: Coordinate;
  detail: string;
  id: string;
  label: string;
  marker: string;
  tone: "charging" | "destination" | "start" | "warning";
};

type RouteFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, string>;
    geometry: {
      type: "LineString";
      coordinates: Coordinate[];
    };
  }>;
};

const iloiloCityCenter: Coordinate = [122.5621, 10.7202];
const _rawMapTiler = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "";
// Normalize the env value: allow either the raw key or a full MapTiler style URL.
// If a full URL or a fragment (e.g. #14.7/10.72471/122.55050) was pasted, strip the fragment
// and extract the `key` query param if present. This prevents storing the full URL
// (or browser position fragment) in .env.local — only the API key is used.
let mapTilerKey = _rawMapTiler.trim();
if (mapTilerKey) {
  // remove URL fragment (everything after '#') which is map position only
  mapTilerKey = mapTilerKey.split("#")[0];

  try {
    const maybeUrl = new URL(mapTilerKey);
    const keyParam = maybeUrl.searchParams.get("key");
    if (keyParam) {
      mapTilerKey = keyParam;
    }
  } catch (e) {
    // not a URL, keep trimmed value
  }
}

const mapStyle = mapTilerKey
  ? `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`
  : "https://demotiles.maplibre.org/style.json";

const samplePoints: MapPoint[] = [
  {
    coordinates: [122.5621, 10.7202],
    detail: "Sample origin near central Iloilo City.",
    id: "start-point",
    label: "Start point",
    marker: "S",
    tone: "start",
  },
  {
    coordinates: [122.5458, 10.7149],
    detail: "Sample destination for the prototype route.",
    id: "destination",
    label: "Destination",
    marker: "D",
    tone: "destination",
  },
  {
    coordinates: [122.5534, 10.7175],
    detail: "Suggested charging stop for a top-up before continuing.",
    id: "charging-point",
    label: "Suggested charging point",
    marker: "C",
    tone: "charging",
  },
  {
    coordinates: [122.5718, 10.7241],
    detail: "Restricted or highway warning marker for LEV riders.",
    id: "restricted-warning",
    label: "Restricted / highway warning",
    marker: "!",
    tone: "warning",
  },
];

const routeData: RouteFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "sample-route",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          samplePoints[0].coordinates,
          samplePoints[2].coordinates,
          samplePoints[1].coordinates,
        ],
      },
    },
  ],
};

function getSource(map: MapLibreMap, id: string) {
  return map.getSource(id) as GeoJSONSource | undefined;
}

function addRouteLayer(map: MapLibreMap) {
  if (!getSource(map, "edaan-route")) {
    map.addSource("edaan-route", {
      data: routeData,
      type: "geojson",
    });
  }

  if (!map.getLayer("edaan-route-casing")) {
    map.addLayer({
      id: "edaan-route-casing",
      paint: {
        "line-color": "#052e16",
        "line-opacity": 0.9,
        "line-width": 9,
      },
      source: "edaan-route",
      type: "line",
    });
  }

  if (!map.getLayer("edaan-route-line")) {
    map.addLayer({
      id: "edaan-route-line",
      paint: {
        "line-color": "#34d399",
        "line-opacity": 0.96,
        "line-width": 5,
      },
      source: "edaan-route",
      type: "line",
    });
  }
}

function markerClass(tone: MapPoint["tone"]) {
  const toneClass = {
    charging: "bg-sky-400 text-zinc-950",
    destination: "bg-rose-400 text-white",
    start: "bg-emerald-400 text-zinc-950",
    warning: "bg-amber-400 text-zinc-950",
  }[tone];

  return [
    "flex",
    "h-9",
    "w-9",
    "items-center",
    "justify-center",
    "rounded-full",
    "border-2",
    "border-white",
    "text-sm",
    "font-black",
    "shadow-lg",
    toneClass,
  ].join(" ");
}

function buildMarkerElement(point: MapPoint) {
  const element = document.createElement("div");

  element.className = markerClass(point.tone);
  element.textContent = point.marker;

  return element;
}

function buildPopupContent(point: MapPoint) {
  const content = document.createElement("div");
  const title = document.createElement("strong");
  const detail = document.createElement("p");

  title.textContent = point.label;
  detail.textContent = point.detail;
  detail.className = "mt-1";

  content.append(title, detail);

  return content;
}

function addMarkers(
  map: MapLibreMap,
  markersRef: MutableRefObject<Marker[]>,
) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = samplePoints.map((point) =>
    new maplibregl.Marker({
      anchor: "center",
      element: buildMarkerElement(point),
    })
      .setLngLat(point.coordinates)
      .setPopup(
        new maplibregl.Popup({ offset: 18 }).setDOMContent(
          buildPopupContent(point),
        ),
      )
      .addTo(map),
  );
}

export default function EDaanMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      attributionControl: {
        compact: true,
      },
      center: iloiloCityCenter,
      container: containerRef.current,
      style: mapStyle,
      zoom: 12.6,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    function renderDemoOverlays() {
      addRouteLayer(map);
      addMarkers(map, markersRef);
    }

    if (map.loaded()) {
      renderDemoOverlays();
    } else {
      map.once("load", renderDemoOverlays);
    }

    mapRef.current = map;

    return () => {
      map.off("load", renderDemoOverlays);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden edaan-card">
      <div
        ref={containerRef}
        aria-label="Interactive e-Daan map centered on Iloilo City"
        className="h-full w-full"
      />

      {!mapTilerKey ? (
        <div className="absolute bottom-4 left-4 edaan-muted text-xs font-semibold text-amber-100 shadow-lg">
          Add NEXT_PUBLIC_MAPTILER_KEY for MapTiler tiles
        </div>
      ) : null}

      <div className="absolute left-4 top-4 grid gap-2 p-3 edaan-card sm:grid-cols-2">
        <MapLegend label="Start" tone="start" />
        <MapLegend label="Destination" tone="destination" />
        <MapLegend label="Charging" tone="charging" />
        <MapLegend label="Restricted" tone="warning" />
      </div>
    </div>
  );
}

function MapLegend({
  label,
  tone,
}: {
  label: string;
  tone: MapPoint["tone"];
}) {
  const toneClass = {
    charging: "bg-sky-400",
    destination: "bg-rose-400",
    start: "bg-emerald-400",
    warning: "bg-amber-400",
  }[tone];

  return (
    <span className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
      <span className={`h-2.5 w-2.5 rounded-full ${toneClass}`} />
      {label}
    </span>
  );
}
