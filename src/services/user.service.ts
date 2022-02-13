import { UserModel } from "../models/User";
class UserService {
  async isUserEmailExist(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  }

  async isEmailForUserId(email: string, userId: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (user?._id.toString() == userId.toString()) {
        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();
