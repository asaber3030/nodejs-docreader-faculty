import SubjectController from "../http/controllers/SubjectController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const subjectRouter = Router()
const controller = new SubjectController()

subjectRouter.use(checkIsAuthenticated)
subjectRouter.get('/subjects/:moduleId', controller.get)
subjectRouter.get('/subjects/:moduleId/:subjectId', controller.getSubject)
subjectRouter.get('/subjects/:moduleId/:subjectId/lectures', controller.getSubjectLectures)
subjectRouter.get('/subjects/:moduleId/:subjectId/final-revisions', controller.getSubjectFinalRevisions)
subjectRouter.get('/subjects/:moduleId/:subjectId/practical', controller.getSubjectPractical)
subjectRouter.post('/subjects/:moduleId/create', controller.createSubject)
subjectRouter.post('/subjects/:moduleId/:subjectId/create/lecture', controller.createSubject)
subjectRouter.post('/subjects/:moduleId/:subjectId/create/practical', controller.createSubject)
subjectRouter.post('/subjects/:moduleId/:subjectId/create/final-revision', controller.createSubject)

export default subjectRouter