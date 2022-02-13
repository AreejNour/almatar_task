import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { defaultPoints } from "../config/constant";
import PointService from "../services/points.service";

class UserController {
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = res.locals.user._id.toString();
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`user is not found by id ${userId}`);
      }
      res.send({
        user,
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }
  }

  async getUserPoints(req: Request, res: Response) {
    try {
      const userId = res.locals.user._id.toString();
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`user is not found by id ${userId}`);
      }
      res.send({
        points: user.points,
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }
  }
}
export default new UserController();
