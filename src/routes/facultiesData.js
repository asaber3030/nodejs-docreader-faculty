"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FacultyController_1 = __importDefault(require("../http/controllers/FacultyController"));
const facultiesDataRouter = (0, express_1.Router)();
const controller = new FacultyController_1.default();
facultiesDataRouter.get('/faculties', controller.get);
facultiesDataRouter.get('/faculties/:facultyId/years', controller.getFacultyYears);
facultiesDataRouter.get('/faculties/:facultyId', controller.getFaculty);
exports.default = facultiesDataRouter;
