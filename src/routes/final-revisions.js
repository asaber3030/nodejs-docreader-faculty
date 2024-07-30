"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FinalRevisionController_1 = __importDefault(require("../http/controllers/FinalRevisionController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = require("express");
const finalRevisionRouter = (0, express_1.Router)();
const controller = new FinalRevisionController_1.default();
finalRevisionRouter.use(isAuthenticated_1.checkIsAuthenticated);
finalRevisionRouter.get('/final-revision/:subjectId', controller.get);
finalRevisionRouter.get('/final-revision/:subjectId/links', controller.getLinks);
finalRevisionRouter.post('/final-revision/:subjectId/links/create', controller.createLink);
finalRevisionRouter.patch('/final-revision/:subjectId/links/:linkId/update', controller.updateLink);
finalRevisionRouter.delete('/final-revision/:subjectId/links/:linkId/delete', controller.deleteLink);
exports.default = finalRevisionRouter;
