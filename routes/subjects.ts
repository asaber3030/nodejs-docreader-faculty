import SubjectController from "../http/controllers/SubjectController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const subjectRouter = Router()
const controller = new SubjectController()

subjectRouter.use(checkIsAuthenticated)

subjectRouter.get('/subjects/:subjectId', controller.get)
subjectRouter.post('/subjects/:subjectId/create-lecture', controller.createLecture)
subjectRouter.get('/subjects/:subjectId/lectures', controller.getLectures)

subjectRouter.post('/subjects/:subjectId/update', controller.updateSubject)
subjectRouter.delete('/subjects/:subjectId/delete', controller.deleteSubject)

export default subjectRouter