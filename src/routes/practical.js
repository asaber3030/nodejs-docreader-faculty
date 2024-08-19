"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PracticalController_1 = __importDefault(require("../http/controllers/PracticalController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = require("express");
const practicalRouter = (0, express_1.Router)();
const controller = new PracticalController_1.default();
practicalRouter.use(isAuthenticated_1.checkIsAuthenticated);
practicalRouter.get('/practical/:subjectId', controller.get);
practicalRouter.get('/practical/:subjectId/links', controller.getLinks);
practicalRouter.post('/practical/:subjectId/links/create', controller.createLink);
practicalRouter.get('/practical/links/:linkId', controller.getLink);
practicalRouter.patch('/practical/links/:linkId/update', controller.updateLink);
practicalRouter.delete('/practical/links/:linkId/delete', controller.deleteLink);
exports.default = practicalRouter;
