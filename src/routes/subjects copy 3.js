"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubjectController_1 = __importDefault(require("../http/controllers/SubjectController"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = require("express");
const subjectRouter = (0, express_1.Router)();
const controller = new SubjectController_1.default();
subjectRouter.use(isAuthenticated_1.checkIsAuthenticated);
subjectRouter.get('/subjects/:subjectId', controller.get);
subjectRouter.get('/subjects/:subjectId/lectures', controller.getLectures);
subjectRouter.get('/subjects/:subjectId/practical', controller.getPractical);
subjectRouter.get('/subjects/:subjectId/final-revision', controller.getFinalRevision);
subjectRouter.patch('/subjects/:subjectId/update', controller.updateSubject);
subjectRouter.delete('/subjects/:subjectId/delete', controller.deleteSubject);
exports.default = subjectRouter;
