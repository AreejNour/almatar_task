import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { defaultPoints } from "../config/constant";
import PointService from "../services/points.service";
import userService from "../services/user.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const isEmailExist = await userService.isUserEmailExist(email);

      if (isEmailExist) {
        throw new Error("Email is already exist");
      }
      const user = await UserModel.create({ email, password, name });
      await PointService.addUserPoints(user, defaultPoints);
      const token = user.getJwtToken();
      res.send({
        token: token,
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email }).select("+password");

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        throw Error("Invalid email or password");
      }
      const token = user.getJwtToken();
      res.send({
        token: token,
      });
    } catch (err) {
      res.statusCode = 500;
      res.json({
        message: "something went wrong",
      });
    }
  }
}
export default new AuthController();
