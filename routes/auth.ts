import { Router } from "express";

import AuthController from "../http/controllers/AuthController";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/create-admin", authController.createAdmin);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/is-authenticated", authController.isAuthenticated);
authRouter.get("/user", checkIsAuthenticated, authController.getUserData);

export default authRouter;
