import { Router } from "express";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

import FacultyController from "../http/controllers/FacultyController";

const facultyRouter = Router()

const controller = new FacultyController()

facultyRouter.use(checkIsAuthenticated)
facultyRouter.get('/modules', controller.get)
facultyRouter.post('/modules/create', controller.createFaculty)
facultyRouter.get('/modules/:module', controller.getFaculty)
export default facultyRouter