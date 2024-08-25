import { Router } from "express";
import YearController from "../http/controllers/YearController";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";
import { checkHaveSameYearId } from "../middlewares/haveSameYearId";

const yearRouter = Router();
const controller = new YearController();

yearRouter.use(checkIsAuthenticated);

yearRouter.get(
  "/years/:yearId/subjects",
  checkHaveSameYearId,
  controller.getSubjects
);
yearRouter.get(
  "/years/:yearId/lectures",
  checkHaveSameYearId,
  controller.getLectures
);
yearRouter.get(
  "/years/:yearId/links",
  checkHaveSameYearId,
  controller.getLinks
);

export default yearRouter;
