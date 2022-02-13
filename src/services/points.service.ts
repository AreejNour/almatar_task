import User, { UserModel } from "../models/User";
class PointService {
  async addUserPoints(user: User, points: number) {
    try {
      user.points = points;
      await user.save();
    } catch (e) {
      throw e;
    }
  }

  async isUserHasEnoughBalance(userId: string, points: number) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`reciver with id ${userId} is not found`);
      }

      if (user.points < points) {
        return false;
      }
      return true;
    } catch (e) {
      throw e;
    }
  }

  async getUserPoints(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`user is not found by id ${userId}`);
      }
      return user.points;
    } catch (e) {
      throw e;
    }
  }
}

export default new PointService();
