"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleController_1 = __importDefault(require("../http/controllers/ModuleController"));
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const moduleRouter = (0, express_1.Router)();
const controller = new ModuleController_1.default();
moduleRouter.use(isAuthenticated_1.checkIsAuthenticated);
moduleRouter.get('/modules/:yearId', controller.get);
moduleRouter.post('/modules/:yearId/create', controller.createModule);
moduleRouter.get('/modules/:yearId/:moduleId', controller.getModule);
moduleRouter.get('/modules/:yearId/:moduleId/subjects', controller.getModuleSubjects);
moduleRouter.post('/modules/:yearId/:moduleId/subjects/create', controller.createSubject);
moduleRouter.patch('/modules/:yearId/:moduleId/update', controller.updateModule);
moduleRouter.delete('/modules/:yearId/:moduleId/delete', controller.deleteModule);
exports.default = moduleRouter;
