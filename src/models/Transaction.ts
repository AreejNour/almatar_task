import { Schema, model, Document, ObjectId } from "mongoose";
import { transactionType } from "../config/constant";

export default interface Transaction extends Document {
  user: ObjectId;
  points: number;
  type: string;
}

const schema = new Schema<Transaction>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    points: { type: Schema.Types.Number, required: true },
    type: {
      type: Schema.Types.String,
      enum: [transactionType.debit, transactionType.credit],
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = model<Transaction>(
  "Transaction",
  schema,
  "Transactions"
);
