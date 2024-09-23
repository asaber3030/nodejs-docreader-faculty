import ModuleController from "../http/controllers/ModuleController";

import { Router } from "express";
import { checkIsAdmin } from "../middlewares/isAdmin";

const moduleRouter = Router();
const controller = new ModuleController();

moduleRouter.get("/modules", controller.getAllModules);
moduleRouter.get("/modules/:moduleId", controller.getModule);
moduleRouter.get("/modules/:moduleId/subjects", controller.getModuleSubjects);
moduleRouter.post("/modules/create", checkIsAdmin, controller.createModule);
moduleRouter.post(
  "/modules/:moduleId/update",
  checkIsAdmin,
  controller.updateModule
);
moduleRouter.delete(
  "/modules/:moduleId/delete",
  checkIsAdmin,
  controller.deleteModule
);
moduleRouter.post(
  "/modules/:moduleId/subjects/create",
  checkIsAdmin,
  controller.createSubject
);

export default moduleRouter;
