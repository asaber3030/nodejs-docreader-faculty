import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import UserController from "../http/controllers/UserController";

const userRouter = Router();
const controller = new UserController();

userRouter.post("/user/update", checkIsAuthenticated, controller.update);
userRouter.patch("/user/update", checkIsAuthenticated, controller.update);
userRouter.post(
  "/user/change-password",
  checkIsAuthenticated,
  controller.changePassword
);
userRouter.post(
  "/user/register-device",
  checkIsAuthenticated,
  controller.registerDevice
);
userRouter.delete(
  "/user/unregister-device",
  checkIsAuthenticated,
  controller.unregisterDevice
);

export default userRouter;
