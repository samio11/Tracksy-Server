import { Types } from "mongoose";

export interface IRating {
  ride: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  score: number;
  comment: string;
}
