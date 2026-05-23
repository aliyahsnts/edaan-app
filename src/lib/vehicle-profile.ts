export type VehicleTypeId = "e-bike" | "e-scooter" | "ev-car" | "lev";

export type VehicleType = {
  category: string;
  iconKey: "bike" | "car";
  id: VehicleTypeId;
  label: string;
};

export type VehicleModel = {
  brand: string;
  capacityLabel: string;
  capacityWh: number;
  id: string;
  maxRangeKm: number;
  name: string;
};

export type VehicleProfile = {
  batteryPercentage: number;
  selectedModelIdByType: Record<VehicleTypeId, string>;
  selectedTypeId: VehicleTypeId;
};

export const VEHICLE_PROFILE_STORAGE_KEY = "edaan.vehicleProfile.v1";

export const vehicleTypes: VehicleType[] = [
  {
    category: "L1 Category",
    iconKey: "bike",
    id: "e-bike",
    label: "E-Bike",
  },
  {
    category: "L2 Class",
    iconKey: "bike",
    id: "e-scooter",
    label: "E-Scooter",
  },
  {
    category: "M1 Category",
    iconKey: "car",
    id: "ev-car",
    label: "EV Car",
  },
  {
    category: "Micro-mobility",
    iconKey: "car",
    id: "lev",
    label: "LEV",
  },
];

export const vehicleModels: Record<VehicleTypeId, VehicleModel[]> = {
  "e-bike": [
    {
      brand: "Fiido",
      capacityLabel: "374 Wh",
      capacityWh: 374,
      id: "fiido-d4s",
      maxRangeKm: 80,
      name: "D4S",
    },
    {
      brand: "HIMO",
      capacityLabel: "480 Wh",
      capacityWh: 480,
      id: "himo-c26",
      maxRangeKm: 100,
      name: "C26",
    },
    {
      brand: "DYU",
      capacityLabel: "360 Wh",
      capacityWh: 360,
      id: "dyu-d3f",
      maxRangeKm: 60,
      name: "D3F",
    },
  ],
  "e-scooter": [
    {
      brand: "Xiaomi",
      capacityLabel: "275 Wh",
      capacityWh: 275,
      id: "xiaomi-scooter-4",
      maxRangeKm: 35,
      name: "Electric Scooter 4",
    },
    {
      brand: "Ninebot",
      capacityLabel: "551 Wh",
      capacityWh: 551,
      id: "ninebot-max-g2",
      maxRangeKm: 70,
      name: "Max G2",
    },
    {
      brand: "Inokim",
      capacityLabel: "624 Wh",
      capacityWh: 624,
      id: "inokim-quick-4",
      maxRangeKm: 75,
      name: "Quick 4",
    },
  ],
  "ev-car": [
    {
      brand: "BYD",
      capacityLabel: "60.5 kWh",
      capacityWh: 60500,
      id: "byd-atto-3",
      maxRangeKm: 417,
      name: "Atto 3",
    },
    {
      brand: "Nissan",
      capacityLabel: "40 kWh",
      capacityWh: 40000,
      id: "nissan-leaf",
      maxRangeKm: 270,
      name: "Leaf",
    },
    {
      brand: "Hyundai",
      capacityLabel: "72.6 kWh",
      capacityWh: 72600,
      id: "hyundai-ioniq-5",
      maxRangeKm: 480,
      name: "Ioniq 5",
    },
  ],
  lev: [
    {
      brand: "Local Cargo",
      capacityLabel: "3.2 kWh",
      capacityWh: 3200,
      id: "local-cargo-trike",
      maxRangeKm: 85,
      name: "E-Trike",
    },
    {
      brand: "Wuling",
      capacityLabel: "13.8 kWh",
      capacityWh: 13800,
      id: "wuling-mini-ev",
      maxRangeKm: 170,
      name: "Mini EV",
    },
    {
      brand: "Niu",
      capacityLabel: "2.9 kWh",
      capacityWh: 2900,
      id: "niu-mqi",
      maxRangeKm: 95,
      name: "MQi Moped",
    },
  ],
};

export const defaultModelByType: Record<VehicleTypeId, string> = {
  "e-bike": "fiido-d4s",
  "e-scooter": "ninebot-max-g2",
  "ev-car": "byd-atto-3",
  lev: "local-cargo-trike",
};

export const defaultVehicleProfile: VehicleProfile = {
  batteryPercentage: 82,
  selectedModelIdByType: defaultModelByType,
  selectedTypeId: "ev-car",
};

export function clampBatteryPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getVehicleType(typeId: VehicleTypeId) {
  return (
    vehicleTypes.find((vehicleType) => vehicleType.id === typeId) ??
    vehicleTypes[0]
  );
}

export function getVehicleModels(typeId: VehicleTypeId) {
  return vehicleModels[typeId];
}

export function getSelectedVehicleModel(profile: VehicleProfile) {
  const models = getVehicleModels(profile.selectedTypeId);
  const selectedModelId =
    profile.selectedModelIdByType[profile.selectedTypeId];

  return models.find((model) => model.id === selectedModelId) ?? models[0];
}

export function getVehicleModelName(model: VehicleModel) {
  return `${model.brand} ${model.name}`;
}

export function getVehicleCapacityPercent(
  typeId: VehicleTypeId,
  model: VehicleModel,
) {
  const maxCapacityWh = Math.max(
    ...getVehicleModels(typeId).map((vehicleModel) => vehicleModel.capacityWh),
  );

  return Math.round((model.capacityWh / maxCapacityWh) * 100);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isVehicleTypeId(value: unknown): value is VehicleTypeId {
  return (
    value === "e-bike" ||
    value === "e-scooter" ||
    value === "ev-car" ||
    value === "lev"
  );
}

function modelExists(typeId: VehicleTypeId, modelId: string) {
  return getVehicleModels(typeId).some((model) => model.id === modelId);
}

export function normalizeVehicleProfile(value: unknown): VehicleProfile {
  if (!isRecord(value)) {
    return {
      ...defaultVehicleProfile,
      selectedModelIdByType: { ...defaultModelByType },
    };
  }

  const selectedTypeId = isVehicleTypeId(value.selectedTypeId)
    ? value.selectedTypeId
    : defaultVehicleProfile.selectedTypeId;
  const selectedModelIdByType = { ...defaultModelByType };
  const savedModels = value.selectedModelIdByType;

  if (isRecord(savedModels)) {
    vehicleTypes.forEach((vehicleType) => {
      const savedModelId = savedModels[vehicleType.id];

      if (
        typeof savedModelId === "string" &&
        modelExists(vehicleType.id, savedModelId)
      ) {
        selectedModelIdByType[vehicleType.id] = savedModelId;
      }
    });
  }

  const batteryPercentage =
    typeof value.batteryPercentage === "number"
      ? clampBatteryPercentage(value.batteryPercentage)
      : defaultVehicleProfile.batteryPercentage;

  return {
    batteryPercentage,
    selectedModelIdByType,
    selectedTypeId,
  };
}

export function readVehicleProfileFromStorage() {
  if (typeof window === "undefined") {
    return normalizeVehicleProfile(null);
  }

  try {
    return normalizeVehicleProfile(
      JSON.parse(window.localStorage.getItem(VEHICLE_PROFILE_STORAGE_KEY) ?? ""),
    );
  } catch {
    return normalizeVehicleProfile(null);
  }
}

export function writeVehicleProfileToStorage(profile: VehicleProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    VEHICLE_PROFILE_STORAGE_KEY,
    JSON.stringify(normalizeVehicleProfile(profile)),
  );
}
