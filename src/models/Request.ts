import { Schema, model, Document, ObjectId } from "mongoose";
import { requestStatus } from "../config/constant";

export default interface Request extends Document {
  from: ObjectId;
  to: ObjectId;
  points: number;
  status: string;
  expiresAt: Date;
}

const schema = new Schema<Request>(
  {
    from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    to: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    points: { type: Schema.Types.Number, required: true },
    status: {
      type: Schema.Types.String,
      default: requestStatus.pending,
      enum: [
        requestStatus.pending,
        requestStatus.confirmed,
        requestStatus.expired,
      ],
    },
    expiresAt: { type: Schema.Types.Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const RequestModel = model<Request>("Request", schema, "Requests");
