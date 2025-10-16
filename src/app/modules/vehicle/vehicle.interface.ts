import { Types } from "mongoose";
enum EVehicleType {
  Car,
  bike,
  truck,
}
export interface IVehicle {
  owner: Types.ObjectId;
  model: string;
  year: string;
  maxCapacity: number;
  vehicleImage: string;
  type: EVehicleType;
}
