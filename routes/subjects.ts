import SubjectController from "../http/controllers/SubjectController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const subjectRouter = Router()
const controller = new SubjectController()

subjectRouter.use(checkIsAuthenticated)
subjectRouter.get('/subjects/:moduleId', controller.get)
subjectRouter.post('/subjects/:moduleId/create', controller.createSubject)

subjectRouter.get('/subjects/:moduleId/:subjectId', controller.getSubject)
subjectRouter.patch('/subjects/:moduleId/:subjectId/update', controller.updateSubject)
subjectRouter.delete('/subjects/:moduleId/:subjectId/delete', controller.deleteSubject)

subjectRouter.get('/subjects/:moduleId/:subjectId/lectures', controller.getSubjectLectures)
subjectRouter.get('/subjects/:moduleId/:subjectId/final-revisions', controller.getSubjectFinalRevisions)
subjectRouter.get('/subjects/:moduleId/:subjectId/practical', controller.getSubjectPractical)

subjectRouter.post('/subjects/:moduleId/:subjectId/create/lecture', controller.createLecture)
subjectRouter.post('/subjects/:moduleId/:subjectId/create/practical', controller.createPractical)
subjectRouter.post('/subjects/:moduleId/:subjectId/create/final-revision', controller.createFinalRevision)

subjectRouter.patch('/subjects/:moduleId/:subjectId/create/lecture/:lectureId/update', controller.updateLecture)
subjectRouter.patch('/subjects/:moduleId/:subjectId/create/practical/:practicalId/update', controller.updatePractical)
subjectRouter.patch('/subjects/:moduleId/:subjectId/create/final-revision/:finalId/update', controller.updateFinalRevision)


export default subjectRouter