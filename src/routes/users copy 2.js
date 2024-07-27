"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const UserController_1 = __importDefault(require("../http/controllers/UserController"));
const SnippetController_1 = __importDefault(require("../http/controllers/SnippetController"));
const userRouter = (0, express_1.Router)();
const controller = new UserController_1.default();
const snippet = new SnippetController_1.default();
userRouter.use(isAuthenticated_1.checkIsAuthenticated);
userRouter.patch('/user/update', controller.update);
userRouter.delete('/user/delete', controller.delete);
userRouter.get('/user/data', controller.getUser);
userRouter.get('/user/skills', controller.getSkills);
userRouter.post('/user/skills/create', controller.createSkill);
userRouter.patch('/user/skills/:skillId/update', controller.updateSkill);
userRouter.delete('/user/skills/:skillId/delete', controller.deleteSkill);
userRouter.get('/user/snippets', snippet.get);
userRouter.get('/user/snippets/favourites', snippet.getFavourites);
userRouter.post('/user/snippets/create', snippet.create);
userRouter.get('/user/snippets/:snippetId', snippet.getSnippet);
userRouter.patch('/user/snippets/:snippetId/update', snippet.update);
userRouter.delete('/user/snippets/:snippetId/delete', snippet.delete);
exports.default = userRouter;