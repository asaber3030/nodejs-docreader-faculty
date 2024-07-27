import { Router } from "express";

import AuthController from "../http/controllers/AuthController";

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.get('/is-authenticated', authController.isAuthenticated)
authRouter.get('/user', authController.getUserData)

// authRouter.post('/verify-code', authController.verifyAccount)

export default authRouter