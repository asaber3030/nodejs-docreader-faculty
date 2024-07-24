import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import UserController from "../http/controllers/UserController";

const userRouter = Router()

const controller = new UserController()

userRouter.use(checkIsAuthenticated)
userRouter.patch('/user/update', controller.update)

export default userRouter