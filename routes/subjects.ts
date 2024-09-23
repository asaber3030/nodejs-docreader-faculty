import { Router } from "express";

import SubjectController from "../http/controllers/SubjectController";
import { checkIsAdmin } from "../middlewares/isAdmin";

const subjectRouter = Router();
const controller = new SubjectController();

subjectRouter.get("/subjects", controller.getAllSubjects);
subjectRouter.get("/subjects/:subjectId", controller.get);
subjectRouter.post(
  "/subjects/:subjectId/create-lecture",
  checkIsAdmin,
  controller.createLecture
);
subjectRouter.get("/subjects/:subjectId/lectures", controller.getLectures);
subjectRouter.post(
  "/subjects/:subjectId/update",
  checkIsAdmin,
  controller.updateSubject
);
subjectRouter.delete(
  "/subjects/:subjectId/delete",
  checkIsAdmin,
  controller.deleteSubject
);

export default subjectRouter;
