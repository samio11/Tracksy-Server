import { Types } from "mongoose";
import { ILocation } from "../driver/driver.interface";

export enum ERideStatus {
  requested,
  pending,
  accepted,
  arrived,
  started,
  completed,
  cancelled,
  no_driver,
}

export interface IRideHistory {
  status: ERideStatus;
  time: Date;
}
[];

export interface IRide {
  rider: Types.ObjectId;
  driver: Types.ObjectId;
  startRide: ILocation;
  endRide: ILocation;
  distance: number;
  duration: number;
  fare: number;
  rideStatus: ERideStatus;
  rideHistory: IRideHistory;
  promoCode?: string;
}
