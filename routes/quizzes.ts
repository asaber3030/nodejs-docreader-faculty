import QuizController from "../http/controllers/QuizController";

import { Router } from "express";
import { checkIsAdmin } from "../middlewares/isAdmin";
import { checkIsAuthenticated } from "../middlewares/isAuthenticated";

const quizRouter = Router();
const controller = new QuizController();

quizRouter.get("/quizzes/:quizId", controller.getQuiz);
quizRouter.post(
  "/lectures/:lectureId/quizzes",
  checkIsAdmin,
  controller.createQuiz
);
quizRouter.patch("/quizzes/:quizId", checkIsAdmin, controller.updateQuiz);
quizRouter.delete("/quizzes/:quizId", checkIsAdmin, controller.deleteQuiz);

quizRouter.post(
  "/quizzes/:quizId/questions",
  checkIsAdmin,
  controller.createQuestion
);
quizRouter.patch(
  "/questions/:questionId",
  checkIsAdmin,
  controller.updateQuestion
);
quizRouter.delete(
  "/questions/:questionId",
  checkIsAdmin,
  controller.deleteQuestion
);

quizRouter.post(
  "/questions/:questionId/mark",
  checkIsAuthenticated,
  controller.markQuestion
);
quizRouter.delete(
  "/questions/:questionId/unmark",
  checkIsAuthenticated,
  controller.unmarkQuestion
);

export default quizRouter;
