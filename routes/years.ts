import { Router } from "express";

import YearController from "../http/controllers/YearController";
import { checkIsAdmin } from "../middlewares/isAdmin";

const yearRouter = Router();
const controller = new YearController();

yearRouter.get("/years/:yearId/subjects", controller.getSubjects);
yearRouter.get("/years/:yearId/lectures", controller.getLectures);
yearRouter.get("/years/:yearId/links", controller.getLinks);
yearRouter.get(
  "/years/:yearId/notifiable-links",
  checkIsAdmin,
  controller.getNotifiableLinks
);
yearRouter.post(
  "/years/:yearId/notifications/notify",
  checkIsAdmin,
  controller.notify
);
yearRouter.post(
  "/years/:yearId/notifications/ignore",
  checkIsAdmin,
  controller.ignore
);

export default yearRouter;
