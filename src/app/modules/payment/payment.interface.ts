import { Types } from "mongoose";
import { ERideStatus } from "../ride/ride.interface";

export enum EPaymentStatus {
  pending = "pending",
  cancel = "cancel",
  fail = "fail",
  complete = "complete",
}

export interface IPayment {
  ride: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  status: EPaymentStatus;
  transactionId?: string;
  invoiceUrl?: string;
}
