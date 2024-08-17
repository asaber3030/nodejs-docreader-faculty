import LectureController from "../http/controllers/LectureController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const lecturesRouter = Router()
const controller = new LectureController()

lecturesRouter.use(checkIsAuthenticated)

lecturesRouter.get('/lectures/:lectureId', controller.get)
lecturesRouter.patch('/lectures/:lectureId/update', controller.updateLecture)
lecturesRouter.delete('/lectures/:lectureId/delete', controller.deleteLecture)

lecturesRouter.get('/lectures/:lectureId/links', controller.getLinks)
lecturesRouter.post('/lectures/:lectureId/links/create', controller.createLink)

lecturesRouter.get('/lectures/:lectureId/links/:linkId', controller.getLink)
lecturesRouter.patch('/lectures/:lectureId/links/:linkId/update', controller.updateLink)
lecturesRouter.delete('/lectures/:lectureId/links/:linkId/delete', controller.deleteLink)

export default lecturesRouter