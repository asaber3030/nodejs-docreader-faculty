"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const UserController_1 = __importDefault(require("../http/controllers/UserController"));
const userRouter = (0, express_1.Router)();
const controller = new UserController_1.default();
userRouter.use(isAuthenticated_1.checkIsAuthenticated);
userRouter.patch('/user/update', controller.update);
userRouter.patch('/user/update-faculty', controller.updateFaculty);
userRouter.post('/user/change-password', controller.changePassword);
exports.default = userRouter;
