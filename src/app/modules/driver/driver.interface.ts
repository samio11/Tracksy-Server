import { Types } from "mongoose";
export interface ILocation {
  lat: number;
  lang: number;
}

export enum EDriverStatus {
  offline,
  available,
  on_trip,
}
export interface IDriver {
  user: Types.ObjectId;
  vehicle: Types.ObjectId;
  licenseNumber: string;
  status: EDriverStatus;
  location: ILocation;
  rating: number;
  acceptedRide: number;
}
