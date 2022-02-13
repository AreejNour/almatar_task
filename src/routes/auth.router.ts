import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import registerValidator from "../middlewares/validators/isRegisterValid";
import loginValidator from "../middlewares/validators/isLoginValid";

const AuthRouter = Router();
AuthRouter.post("/register", registerValidator, AuthController.register);
AuthRouter.post("/login", loginValidator, AuthController.login);

export default AuthRouter;
