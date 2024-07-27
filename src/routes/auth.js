"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../http/controllers/AuthController"));
const authRouter = (0, express_1.Router)();
const authController = new AuthController_1.default();
authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/is-authenticated', authController.isAuthenticated);
authRouter.get('/user', authController.getUserData);
// authRouter.post('/verify-code', authController.verifyAccount)
exports.default = authRouter;
