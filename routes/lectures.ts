import { Router } from "express";

import LectureController from "../http/controllers/LectureController";
import { checkIsAdmin } from "../middlewares/isAdmin";

const lecturesRouter = Router();
const lectureController = new LectureController();

lecturesRouter.get("/lectures", lectureController.getAllLectures);
lecturesRouter.get("/links", lectureController.getAllLinks)

lecturesRouter.get("/lectures/:lectureId", lectureController.get);
lecturesRouter.post(
  "/lectures/:lectureId/update",
  checkIsAdmin,
  lectureController.updateLecture
);
lecturesRouter.delete(
  "/lectures/:lectureId/delete",
  checkIsAdmin,
  lectureController.deleteLecture
);

lecturesRouter.get("/lectures/:lectureId/links", lectureController.getLinks);
lecturesRouter.post(
  "/lectures/:lectureId/links/create",
  checkIsAdmin,
  lectureController.createLink
);

lecturesRouter.get("/links/:linkId", lectureController.getLink);
lecturesRouter.post(
  "/links/:linkId/update",
  checkIsAdmin,
  lectureController.updateLink
);
lecturesRouter.delete(
  "/links/:linkId/delete",
  checkIsAdmin,
  lectureController.deleteLink
);

export default lecturesRouter;
