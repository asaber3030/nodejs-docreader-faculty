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
facultyRouter.get('/faculties', controller.get);
facultyRouter.get('/faculties/:facultyId/years', controller.getFacultyYears);
facultyRouter.post('/faculties/create', controller.createFaculty);
facultyRouter.get('/faculties/:facultyId', controller.getFaculty);
facultyRouter.patch('/faculties/:facultyId/update', controller.updateFaculty);
facultyRouter.get('/faculties/:facultyId/years/:yearId', controller.getYear);
facultyRouter.get('/faculties/:facultyId/years/:yearId/students', controller.getYearStudents);
exports.default = facultyRouter;
