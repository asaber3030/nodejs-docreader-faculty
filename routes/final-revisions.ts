import FinalRevisionController from "../http/controllers/FinalRevisionController"

import { checkIsAuthenticated } from "../middlewares/isAuthenticated"
import { Router } from "express"

const finalRevisionRouter = Router()
const controller = new FinalRevisionController()

finalRevisionRouter.use(checkIsAuthenticated)
finalRevisionRouter.get('/final-revision/:subjectId', controller.get)
finalRevisionRouter.get('/final-revision/:subjectId/links', controller.getLinks)
finalRevisionRouter.post('/final-revision/:subjectId/links/create', controller.createLink)

finalRevisionRouter.get('/final-revision/:subjectId/links/:linkId', controller.getLink)
finalRevisionRouter.patch('/final-revision/:subjectId/links/:linkId/update', controller.updateLink)
finalRevisionRouter.delete('/final-revision/:subjectId/links/:linkId/delete', controller.deleteLink)

export default finalRevisionRouter