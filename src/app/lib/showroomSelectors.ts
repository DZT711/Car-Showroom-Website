import { getConfigurationAccent, getConfigurationOption } from "../data/configurations";
import { gallery, heroCampaigns, hotspots, vehicles, viewerAngles, type Hotspot } from "../data/vehicles";
import type { ShowroomState } from "../data/showroom";

export function selectVehicle(state: ShowroomState) {
  return vehicles.find(vehicle => vehicle.id === state.selectedVehicleId) ?? vehicles[0];
}

export function selectVehicleIndex(state: ShowroomState) {
  return Math.max(0, vehicles.findIndex(vehicle => vehicle.id === selectVehicle(state).id));
}

export function selectHeroCampaign(state: ShowroomState) {
  return heroCampaigns[selectVehicleIndex(state) % heroCampaigns.length] ?? heroCampaigns[0];
}

export function selectConfigurationAccent(state: ShowroomState) {
  return getConfigurationAccent(state.configuration);
}

export function selectPaintLabel(state: ShowroomState) {
  return getConfigurationOption("paint", state.configuration.paint)?.label ?? selectVehicle(state).colorName;
}

export function selectEnvironmentLabel(state: ShowroomState) {
  return getConfigurationOption("environment", state.configuration.environment)?.label ?? "Studio";
}

export function selectViewerEnvironmentMode(state: ShowroomState): "day" | "night" {
  return state.configuration.environment.includes("night") || state.configuration.studioLighting === "night" ? "night" : "day";
}

export function selectViewerLightingEnabled(state: ShowroomState) {
  return state.configuration.studioLighting !== "softbox";
}

export function selectVisibleHotspots(cameraLabel: string): Array<{ hotspot: Hotspot; position: { x: number; y: number } }> {
  return hotspots
    .map(hotspot => ({ hotspot, position: hotspot.cameras[cameraLabel] }))
    .filter((item): item is { hotspot: Hotspot; position: { x: number; y: number } } => Boolean(item.position));
}

export function selectGalleryItems(state: ShowroomState) {
  const vehicleIndex = selectVehicleIndex(state);
  return [...gallery.slice(vehicleIndex % gallery.length), ...gallery.slice(0, vehicleIndex % gallery.length)];
}

export function selectViewerAngles() {
  return viewerAngles;
}
