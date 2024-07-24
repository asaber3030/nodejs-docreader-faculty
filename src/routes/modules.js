"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const FacultyController_1 = __importDefault(require("../http/controllers/FacultyController"));
const facultyRouter = (0, express_1.Router)();
const controller = new FacultyController_1.default();
facultyRouter.use(isAuthenticated_1.checkIsAuthenticated);
facultyRouter.get('/modules', controller.get);
facultyRouter.post('/modules/create', controller.createFaculty);
facultyRouter.get('/modules/:module', controller.getFaculty);
exports.default = facultyRouter;
