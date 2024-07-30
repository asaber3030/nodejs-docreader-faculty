import PracticalController from "../http/controllers/PracticalController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const practicalRouter = Router()
const controller = new PracticalController()

practicalRouter.use(checkIsAuthenticated)

practicalRouter.get('/practical/:subjectId', controller.get)
practicalRouter.get('/practical/:subjectId/links', controller.getLinks)
practicalRouter.post('/practical/:subjectId/links/create', controller.createLink)
practicalRouter.patch('/practical/:subjectId/links/:linkId/update', controller.updateLink)
practicalRouter.delete('/practical/:subjectId/links/:linkId/delete', controller.deleteLink)

export default practicalRouter