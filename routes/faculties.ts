import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import FacultyController from "../http/controllers/FacultyController";

const facultyRouter = Router()

const controller = new FacultyController()

facultyRouter.use(checkIsAuthenticated)
facultyRouter.get('/faculties', controller.get)
facultyRouter.post('/faculties/create', controller.createFaculty)
facultyRouter.get('/faculties/:facultyId', controller.getFaculty)
facultyRouter.patch('/faculties/:facultyId/update', controller.updateFaculty)
facultyRouter.get('/faculties/:facultyId/years', controller.getFacultyYears)
facultyRouter.get('/faculties/:facultyId/years/:yearId', controller.getYear)
facultyRouter.get('/faculties/:facultyId/years/:yearId/students', controller.getYearStudents)

export default facultyRouter