import { Router } from "express";
import UserController from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const UserRouter = Router();

UserRouter.get("/", isAuthenticated, UserController.getUserProfile);

UserRouter.get("/points", isAuthenticated, UserController.getUserPoints);

export default UserRouter;
