import ModuleController from "../http/controllers/ModuleController"

import { Router } from "express"
import { checkIsAuthenticated } from "../middlewares/isAuthenticated"

const moduleRouter = Router()
const controller = new ModuleController()

moduleRouter.use(checkIsAuthenticated)
moduleRouter.get('/modules/:yearId', controller.get)
moduleRouter.post('/modules/:yearId/create', controller.createModule)
moduleRouter.get('/modules/:yearId/:moduleId', controller.getModule)
moduleRouter.get('/modules/:yearId/:moduleId/subjects', controller.getModuleSubjects)
moduleRouter.post('/modules/:yearId/:moduleId/subjects/create', controller.createSubject)
moduleRouter.post('/modules/:yearId/:moduleId/update', controller.updateModule)
moduleRouter.delete('/modules/:yearId/:moduleId/delete', controller.deleteModule)

export default moduleRouter