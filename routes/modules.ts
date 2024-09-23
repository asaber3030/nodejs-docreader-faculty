import ModuleController from "../http/controllers/ModuleController";

import { Router } from "express";
import { checkIsAdmin } from "../middlewares/isAdmin";

const moduleRouter = Router();
const controller = new ModuleController();

moduleRouter.get("/modules/:yearId", controller.get);
moduleRouter.post(
  "/modules/:yearId/create",
  checkIsAdmin,
  controller.createModule
);
moduleRouter.get("/modules/:yearId/:moduleId", controller.getModule);
moduleRouter.get(
  "/modules/:yearId/:moduleId/subjects",
  controller.getModuleSubjects
);
moduleRouter.post(
  "/modules/:yearId/:moduleId/subjects/create",
  checkIsAdmin,
  controller.createSubject
);
moduleRouter.post(
  "/modules/:yearId/:moduleId/update",
  checkIsAdmin,
  controller.updateModule
);
moduleRouter.delete(
  "/modules/:yearId/:moduleId/delete",
  checkIsAdmin,
  controller.deleteModule
);

export default moduleRouter;
