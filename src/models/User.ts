import { Schema, model, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default interface User extends Document {
  name: string;
  email: string;
  password: string;
  points: number;
  getJwtToken: () => string;
  comparePassword: (str: String) => Boolean;
}

const schema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!);
};

schema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
export const UserModel = model<User>("User", schema, "Users");
