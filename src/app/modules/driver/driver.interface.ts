import { Types } from "mongoose";
export interface ILocation {
  lat: number;
  lang: number;
}

export enum EDriverStatus {
  offline = "offline",
  available = "available",
  on_trip = "on_trip",
}
export interface IDriver {
  _id?: string;
  user: Types.ObjectId;
  vehicle: Types.ObjectId;
  licenseNumber: string;
  status: EDriverStatus;
  location: ILocation;
  rating?: number;
  acceptedRide?: number;
  income?: number;
}
