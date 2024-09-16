import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import UserController from "../http/controllers/UserController";

const userRouter = Router()
const controller = new UserController()

userRouter.use(checkIsAuthenticated)
userRouter.post('/user/update', controller.update)
userRouter.patch('/user/update', controller.update)
userRouter.post('/user/change-password', controller.changePassword)
userRouter.post('/user/register-device', controller.registerDevice)
userRouter.delete('/user/unregister-device', controller.unregisterDevice)

export default userRouter