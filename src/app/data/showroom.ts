import { defaultConfiguration, type VehicleConfiguration } from "./configurations";
import { vehicles } from "./vehicles";

export type ShowroomState = {
  selectedVehicleId: string;
  configuration: VehicleConfiguration;
};

export const defaultShowroomState: ShowroomState = {
  selectedVehicleId: vehicles[1]?.id ?? vehicles[0].id,
  configuration: defaultConfiguration,
};
