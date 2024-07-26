import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import FacultyController from "../http/controllers/FacultyController";

const facultyRouter = Router()

const controller = new FacultyController()

facultyRouter.use(checkIsAuthenticated)
facultyRouter.post('/faculties/create', controller.createFaculty)
facultyRouter.patch('/faculties/:facultyId/update', controller.updateFaculty)
facultyRouter.get('/faculties/:facultyId/years/:yearId', controller.getYear)
facultyRouter.get('/faculties/:facultyId/years/:yearId/students', controller.getYearStudents)

export default facultyRouter