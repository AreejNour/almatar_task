import config from "../config";
import { UserModel } from "../models/User";
import jwt from "jsonwebtoken";

const {
  jwt: { jwt_secret },
} = config;

const isAuthenticated = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new Error("You are not logged in! Please log in to get access.")
    );
  }

  const decoded: any = jwt.verify(token, jwt_secret!);

  const currentUser = await UserModel.findById(decoded.id);

  if (!currentUser) {
    return next(
      new Error("The user belonging to this token does no longer exist.")
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};
export default isAuthenticated;
