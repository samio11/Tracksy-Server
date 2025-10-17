import { Types } from "mongoose";
export enum EVehicleType {
  Car = "Car",
  Bike = "Bike",
  Truck = "Truck",
}
export interface IVehicle {
  _id?: string;
  owner: Types.ObjectId;
  model: string;
  year: string;
  maxCapacity: number;
  vehicleImage: string;
  type: EVehicleType;
}
