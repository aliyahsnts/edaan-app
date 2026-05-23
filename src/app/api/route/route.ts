import { NextResponse } from "next/server";

type Coordinate = [number, number];

type RouteWaypoint = Coordinate | string;

type GeocodeFeature = {
  geometry?: {
    coordinates?: Coordinate;
  };
  properties?: {
    label?: string;
    name?: string;
  };
};

type GeocodeResponse = {
  features?: GeocodeFeature[];
};

type DirectionsFeature = {
  geometry?: {
    type?: string;
    coordinates?: Coordinate[];
  };
  properties?: {
    extras?: {
      waycategory?: {
        values?: [number, number, number][];
      };
    };
    summary?: {
      distance?: number;
      duration?: number;
    };
  };
};

type DirectionsResponse = {
  bbox?: [number, number, number, number];
  features?: DirectionsFeature[];
};

const orsBaseUrl = "https://api.openrouteservice.org";
const routeProfile = "cycling-electric";
const restrictedWayCategories = [
  { bit: 1, label: "highways" },
  { bit: 2, label: "tollways" },
  { bit: 4, label: "steps" },
  { bit: 8, label: "ferries" },
  { bit: 16, label: "fords" },
];

function getApiKey() {
  return process.env.OPENROUTESERVICE_API_KEY?.trim();
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

function readPlace(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readWaypoint(value: unknown): RouteWaypoint | null {
  if (isCoordinate(value)) {
    return value;
  }

  const place = readPlace(value);
  return place ? place : null;
}

function readWaypoints(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(readWaypoint)
    .filter((waypoint): waypoint is RouteWaypoint => waypoint !== null)
    .slice(0, 3);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(payload: unknown) {
  if (isRecord(payload)) {
    const error = payload.error;

    if (
      isRecord(error) &&
      typeof error.message === "string" &&
      error.message
    ) {
      return error.message;
    }

    if (typeof payload.message === "string" && payload.message) {
      return payload.message;
    }
  }

  return "OpenRouteService request failed.";
}

async function readOpenRouteResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  return payload as T;
}

async function geocodePlace(place: string, apiKey: string) {
  const url = new URL("/geocode/search", orsBaseUrl);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", place);
  url.searchParams.set("size", "1");

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await readOpenRouteResponse<GeocodeResponse>(response);
  const feature = data.features?.find((item) =>
    isCoordinate(item.geometry?.coordinates),
  );

  if (!feature || !isCoordinate(feature.geometry?.coordinates)) {
    throw new Error(`Could not find coordinates for "${place}".`);
  }

  return {
    label: feature.properties?.label ?? feature.properties?.name ?? place,
    coordinates: feature.geometry.coordinates,
  };
}

async function resolveWaypoint(waypoint: RouteWaypoint, apiKey: string) {
  if (typeof waypoint === "string") {
    return geocodePlace(waypoint, apiKey);
  }

  return {
    label: "Route waypoint",
    coordinates: waypoint,
  };
}

function getRestrictedCategoryLabels(value: number) {
  return restrictedWayCategories
    .filter((category) => (value & category.bit) === category.bit)
    .map((category) => category.label);
}

function buildRestrictedRoadWarning(
  routeCoordinates: Coordinate[],
  wayCategoryValues: [number, number, number][] = [],
) {
  const labels = new Set<string>();
  const segments = wayCategoryValues
    .map(([fromIndex, toIndex, value]) => {
      const categoryLabels = getRestrictedCategoryLabels(value);

      if (!categoryLabels.length) {
        return null;
      }

      categoryLabels.forEach((label) => labels.add(label));

      return routeCoordinates.slice(fromIndex, toIndex + 1);
    })
    .filter(
      (segment): segment is Coordinate[] =>
        Array.isArray(segment) && segment.length > 1,
    );

  return {
    active: segments.length > 0,
    message:
      segments.length > 0
        ? `Restricted-road warning: route includes ${Array.from(labels).join(
            ", ",
          )}.`
        : "No restricted-road categories returned for this route.",
    segments,
  };
}

async function getDirections(coordinates: Coordinate[], apiKey: string) {
  const response = await fetch(
    `${orsBaseUrl}/v2/directions/${routeProfile}/geojson`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates,
        extra_info: ["waycategory"],
      }),
      cache: "no-store",
    },
  );

  const data = await readOpenRouteResponse<DirectionsResponse>(response);
  const route = data.features?.[0];
  const distanceMeters = route?.properties?.summary?.distance;
  const durationSeconds = route?.properties?.summary?.duration;
  const routeCoordinates = route?.geometry?.coordinates;
  const wayCategoryValues = route?.properties?.extras?.waycategory?.values;

  if (
    typeof distanceMeters !== "number" ||
    !Array.isArray(routeCoordinates) ||
    routeCoordinates.length < 2
  ) {
    throw new Error("OpenRouteService did not return a usable route.");
  }

  return {
    distanceKm: distanceMeters / 1000,
    durationMinutes:
      typeof durationSeconds === "number" ? durationSeconds / 60 : null,
    restrictedRoadWarning: buildRestrictedRoadWarning(
      routeCoordinates,
      wayCategoryValues,
    ),
    geometry: {
      type: "LineString" as const,
      coordinates: routeCoordinates,
    },
    bbox: data.bbox ?? null,
  };
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing OPENROUTESERVICE_API_KEY in .env.local. Add your key and restart the dev server.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { start?: unknown; destination?: unknown; waypoints?: unknown }
    | null;

  const startPlace = readPlace(body?.start);
  const destinationPlace = readPlace(body?.destination);
  const waypoints = readWaypoints(body?.waypoints);

  if (!startPlace || !destinationPlace) {
    return NextResponse.json(
      { error: "Start and destination are required." },
      { status: 400 },
    );
  }

  try {
    const [start, destination, ...resolvedWaypoints] = await Promise.all([
      geocodePlace(startPlace, apiKey),
      geocodePlace(destinationPlace, apiKey),
      ...waypoints.map((waypoint) => resolveWaypoint(waypoint, apiKey)),
    ]);

    const routeCoordinates = [
      start.coordinates,
      destination.coordinates,
    ];

    routeCoordinates.splice(
      1,
      0,
      ...resolvedWaypoints.map((waypoint) => waypoint.coordinates),
    );

    const directions = await getDirections(routeCoordinates, apiKey);

    return NextResponse.json({
      start,
      destination,
      waypoints: resolvedWaypoints,
      profile: routeProfile,
      ...directions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Route planning failed. Try different locations.",
      },
      { status: 502 },
    );
  }
}
