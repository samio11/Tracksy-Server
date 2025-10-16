import { Types } from "mongoose";
import { ERideStatus } from "../ride/ride.interface";

export interface IPayment {
  ride: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  status: ERideStatus;
  transactionId?: string;
  invoiceUrl?: string;
}
