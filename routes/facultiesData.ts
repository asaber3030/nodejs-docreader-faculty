import { Router } from "express";

import FacultyController from "../http/controllers/FacultyController";

const facultiesDataRouter = Router()

const controller = new FacultyController()

facultiesDataRouter.get('/faculties', controller.get)
facultiesDataRouter.get('/faculties/:facultyId/years', controller.getFacultyYears)
facultiesDataRouter.get('/faculties/:facultyId', controller.getFaculty)

export default facultiesDataRouter