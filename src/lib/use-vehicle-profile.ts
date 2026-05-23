"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  defaultVehicleProfile,
  normalizeVehicleProfile,
  readVehicleProfileFromStorage,
  VEHICLE_PROFILE_STORAGE_KEY,
  type VehicleProfile,
  writeVehicleProfileToStorage,
} from "@/lib/vehicle-profile";

const vehicleProfileChangeEvent = "edaan:vehicle-profile-change";
const defaultProfileSnapshot = JSON.stringify(defaultVehicleProfile);

function getVehicleProfileSnapshot() {
  if (typeof window === "undefined") {
    return defaultProfileSnapshot;
  }

  return JSON.stringify(readVehicleProfileFromStorage());
}

function subscribeToVehicleProfile(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === VEHICLE_PROFILE_STORAGE_KEY ||
      event.key === null
    ) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(vehicleProfileChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(vehicleProfileChangeEvent, onStoreChange);
  };
}

export function saveVehicleProfile(profile: VehicleProfile) {
  writeVehicleProfileToStorage(profile);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(vehicleProfileChangeEvent));
  }
}

export function updateVehicleProfile(
  updater: VehicleProfile | ((currentProfile: VehicleProfile) => VehicleProfile),
) {
  const currentProfile = readVehicleProfileFromStorage();
  const nextProfile =
    typeof updater === "function" ? updater(currentProfile) : updater;

  saveVehicleProfile(nextProfile);
}

export function useVehicleProfile() {
  const profileSnapshot = useSyncExternalStore(
    subscribeToVehicleProfile,
    getVehicleProfileSnapshot,
    () => defaultProfileSnapshot,
  );

  return useMemo(
    () => normalizeVehicleProfile(JSON.parse(profileSnapshot) as unknown),
    [profileSnapshot],
  );
}
